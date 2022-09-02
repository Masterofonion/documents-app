import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { DocumentItem, Filters, ServiceData } from 'src/app/model/model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tableData$: BehaviorSubject<DocumentItem[]> = new BehaviorSubject<
    DocumentItem[]
  >([]);
  private fullTableData: DocumentItem[] = [];
  private baseUrl = ' http://localhost:3000';
  constructor(private http: HttpClient) {}
  getServiceData(): Observable<ServiceData> {
    return forkJoin({
      organizations: this.getData('organizations'),
      documentNames: this.getData('document-names'),
    });
  }
  initTableData() {
    this.getData('documents').subscribe((data) => {
      this.fullTableData = data;
      this.tableData$.next(this.fullTableData);
    });
  }
  getTableData(): Observable<DocumentItem[]> {
    return this.tableData$.asObservable();
  }
  getData(endPoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endPoint}`);
  }
  filterData(filters: Filters) {
    console.log('filters');
    let filteredData = this.fullTableData.filter((item) => {
      return (
        (!filters['documentType'] ||
          item['documentType'] === filters['documentType']) &&
        (!filters['number'] || item['number'].startsWith(filters['number']))
      );
    });
    this.tableData$.next(filteredData);
  }
  resetFilteredData() {
    this.tableData$.next(this.fullTableData);
  }
}

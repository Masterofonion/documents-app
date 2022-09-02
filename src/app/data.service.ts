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
  saveNewDocument(newDocument: DocumentItem, filters: Filters) {
    this.http
      .post<DocumentItem>(`${this.baseUrl}/documents`, newDocument)
      .subscribe((data) => {
        this.fullTableData.push(data);
        this.filterData(filters);
      });
  }
  deleteDocument(id: string, filters: Filters) {
    this.http.delete(`${this.baseUrl}/documents/${id}`).subscribe((data) => {
      console.log(data);
      let index = this.fullTableData.findIndex((item) => item.id === id);
      if (index >= 0) {
        this.fullTableData.splice(index, 1);
        this.filterData(filters);
      }
    });
  }
  patchDocument(editedDoc: DocumentItem, filters: Filters) {
    this.http
      .patch<DocumentItem>(
        `${this.baseUrl}/documents/${editedDoc.id}`,
        editedDoc
      )
      .subscribe((data) => {
        let index = this.fullTableData.findIndex((item) => item.id === data.id);
        if (index >= 0) {
          this.fullTableData.splice(index, 1, data);
          this.filterData(filters);
        }
      });
  }
  getDocumentById(id: string) {
    return this.fullTableData.find((item) => item.id === id);
  }
}

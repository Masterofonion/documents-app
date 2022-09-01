import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { DocumentItem, ServiceData } from 'src/model/model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tableData$: BehaviorSubject<any> = new BehaviorSubject(null);
  private serviceData: any;
  private baseUrl = ' http://localhost:3000';
  private serviceEndPoints: string[] = ['document-names', 'organizations'];
  constructor(private http: HttpClient) {}
  getServiceData(): Observable<ServiceData> {
    return forkJoin({
      organizations: this.getData('organizations'),
      documentNames: this.getData('document-names'),
    }).pipe(
      tap((data) => {
        this.serviceData = data;
      })
    );
  }
  getTableData(): Observable<DocumentItem[]> {
    return this.getData('documents');
  }
  getData(endPoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endPoint}`);
  }
}

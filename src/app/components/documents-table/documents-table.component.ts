import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { mergeMap, Observable, tap } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { DocumentItem, ServiceData } from 'src/app/model/model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditDocumentDialogComponent } from '../edit-document-dialog/edit-document-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss'],
})
export class DocumentsTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  // serviceData$: Observable<ServiceData> = this.data.getServiceData();
  serviceData: ServiceData;
  tableData: DocumentItem[];
  activeId = '';
  displayedColumns: string[] = [
    'isMain',
    'documentType',
    'series',
    'number',
    'dateOfIssue',
  ];
  dataSource: any;
  filters = { documentType: '', number: '' };
  constructor(
    private data: DataService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.data
      .getServiceData()
      .pipe(
        tap((data) => {
          this.serviceData = data;
        }),
        mergeMap(() => {
          return this.data.getTableData();
        })
      )
      .subscribe((data) => {
        this.tableData = data;
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
      });
  }
  chooseDocument(id: string) {
    if (id !== this.activeId) {
      this.activeId = id;
    } else {
      this.activeId = '';
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(EditDocumentDialogComponent);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  filterData() {
    let filteredData = this.tableData.filter((item) => {
      return (
        (!this.filters['documentType'] ||
          item['documentType'] === this.filters['documentType']) &&
        (!this.filters['number'] ||
          item['number'].startsWith(this.filters['number']))
      );
    });
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.sort = this.sort;
  }
  setFilter(type: 'documentType' | 'number', value: any) {
    console.log(value);
    this.filters[type] = value;
  }
  resetFilteredData() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, mergeMap, Observable, tap } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { DocumentItem, Filters, ServiceData } from 'src/app/model/model';
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
  serviceData: ServiceData;
  serviceData$: Observable<ServiceData> = this.data.getServiceData();
  activeId = '';
  isArchivedShown = false;
  displayedColumns: string[] = [
    'isMain',
    'documentType',
    'series',
    'number',
    'dateOfIssue',
  ];
  dataSource: any;
  filters = new Filters();
  constructor(
    private data: DataService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.data.initTableData();
    this.data
      .getServiceData()
      .pipe(
        tap((data) => {
          this.serviceData = data;
        }),
        mergeMap(() => this.data.getTableData())
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
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
  openDialog(mode: 'edit' | 'create') {
    let user = null;
    if (mode === 'edit') {
      user = Object.assign({}, this.data.getDocumentById(this.activeId));
    }
    const dialogRef = this.dialog.open(EditDocumentDialogComponent, {
      data: { user: user, mode: mode },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (mode === 'create') {
          this.data.saveNewDocument(data, this.filters);
        }
        if (mode === 'edit') {
          this.data.patchDocument(data, this.filters);
        }
      }
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
    this.data.filterData(this.filters);
  }

  resetFilteredData() {
    this.data.resetFilteredData();
    this.clearInputs();
  }
  deleteDocument() {
    this.data.deleteDocument(this.activeId, this.filters);
  }
  clearInputs() {
    let keys = Object.keys(this.filters) as (keyof Filters)[];
    keys.map((key) => (this.filters[key] = ''));
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { mergeMap, Observable, tap } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { DocumentItem, ServiceData } from 'src/model/model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditDocumentDialogComponent } from '../edit-document-dialog/edit-document-dialog.component';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss'],
})
export class DocumentsTableComponent implements OnInit {
  // serviceData$: Observable<ServiceData> = this.data.getServiceData();
  serviceData: ServiceData;
  tableData: DocumentItem[];
  activeId = '';
  constructor(private data: DataService, private dialog: MatDialog) {}

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
  }
}

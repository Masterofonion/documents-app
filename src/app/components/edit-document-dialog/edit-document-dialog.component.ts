import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/data.service';
import { DocumentInfo, DocumentItem } from 'src/app/model/model';

@Component({
  selector: 'app-edit-document-dialog',
  templateUrl: './edit-document-dialog.component.html',
  styleUrls: ['./edit-document-dialog.component.scss'],
})
export class EditDocumentDialogComponent implements OnInit {
  serviceData$ = this.data.getServiceData();
  documentInfo = new DocumentInfo();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public editedDocument: { user: DocumentItem; mode: 'create' | 'edit' },
    private data: DataService
  ) {}

  ngOnInit(): void {
    if (this.editedDocument.user) {
      console.log(this.editedDocument);
      this.documentInfo = this.editedDocument.user;
    }
    console.log(this.documentInfo);
  }
}

import { Component, OnInit } from '@angular/core';
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
  constructor(private data: DataService) {}

  ngOnInit(): void {
    console.log(this.documentInfo);
  }
}

export interface DocumentItem {
  id: string;
  documentType: string;
  series: string;
  number: string;
  dateOfIssue: string;
  isMain: boolean;
  isArchived: boolean;
  organization: string;
}
export class DocumentInfo {
  id = '';
  documentType = '';
  series = '';
  number = '';
  organization = '';
  dateOfIssue = new Date().toISOString();
  isMain = false;
  isArchived = false;
}
export interface ServiceData {
  organizations: string[];
  documentNames: { [key: string]: string };
}

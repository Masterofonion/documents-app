export interface DocumentItem {
  id: string;
  documentType: string;
  series: string;
  number: string;
  dateOfIssue: string;
  isMain: boolean;
  isArchived: boolean;
}
export interface ServiceData {
  organizations: string[];
  documentNames: { [key: string]: string };
}

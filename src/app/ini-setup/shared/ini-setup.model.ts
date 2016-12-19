export class IniSetupModel {
  APVEND: string = '';;
  Application: string = '';;
  DEFAULT_APPS: string = '';;
  DEFAULT_COMPANY: string = '';;
  DEFAULT_DATA: string = '';;
  DEFAULT_FMDATA: string = '';;
  DEFAULT_IFS: string = '';
  DEFAULT_REPORTS: string = '';
  DEFAULT_SELECT: string = '';
  DEFAULT_SKYLINE: string = '';
  DVersion: string = '';
  EXPAND_URN_ZOOM: string = '';
  GlobalPermissions: GlobalPermissionsModel;
  Licensee: string = '';
  PRINTER_1: string = '';
  PRINTER_1_COMPRESS: string = '';
  PRINTER_1_NORMAL: string = '';
  PdfProcessLocation: string = '';
  PdfStoreLocation: string = '';
  RegistrationCode: string = '';
  SerialNumber: string = '';
  ServerType: string = '';
  Version: string = '';
  downloadInterval: number = 0;
  filepathObject: filepathObjectModel;
  uploadInterval: number = 0;
}

export class GlobalPermissionsModel {
  ApproveInvoiceRoleID: number = 0;
  ApproverOverrideRoleID: number = 0;
  BatchInvoiceRoleID: number = 0;
  DeleteInvoiceRoleID: number = 0;
  GlobalPermissionID: number = 0;
  ProcessScannedRoleID: number = 0;
  ReviewInvoiceRoleID: number = 0;
  SyncBatchestoSkylineRoleID: number = 0;
}

export class filepathObjectModel {
  path: string = '';
  Category: string = '';
}

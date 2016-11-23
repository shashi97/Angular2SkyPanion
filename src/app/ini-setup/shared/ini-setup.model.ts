export class IniSetupModel {
    APVEND: string = null;;
    Application: string = null;;
    DEFAULT_APPS: string = null;;
    DEFAULT_COMPANY: string = null;;
    DEFAULT_DATA: string = null;;
    DEFAULT_FMDATA: string = null;;
    DEFAULT_IFS: string = null;
    DEFAULT_REPORTS: string = null;
    DEFAULT_SELECT: string = null;
    DEFAULT_SKYLINE: string = null;
    DVersion: string = null;
    EXPAND_URN_ZOOM: string = null;
    GlobalPermissions: GlobalPermissionsModel;
    Licensee: string = null;
    PRINTER_1: string = null;
    PRINTER_1_COMPRESS: string = null;
    PRINTER_1_NORMAL: string = null;
    PdfProcessLocation: string = '';
    PdfStoreLocation: string = '';
    RegistrationCode: string = null;
    SerialNumber: string = null;
    ServerType: string = null;
    Version: string = null;
    downloadInterval: number = 0;
    filepathObject: filepathObjectModel;
    uploadInterval: number = 0;

    constructor(serverResponse) {
        if (serverResponse) {
            Object.assign(this, serverResponse);
        }
    }
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
}
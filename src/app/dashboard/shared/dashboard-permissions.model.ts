export class DashboardUserWisePermissionsModel{
IsGlobalApprover:boolean = false;
IsGlobalBatch:boolean = false;
IsGlobalDelete:boolean = false;
IsGlobalOverride:boolean = false;
IsGlobalPdfScan:boolean = false;
IsGlobalReviewer:boolean = false;
IsSyncBatching:boolean = false;
UserID:number = 0;
IsSuperUser:boolean =false;
}


export class DashboardCompanyWisePermissionsModel{
IsCompApprover:boolean = false;
IsCompBatch:boolean = false;
IsCompDelete:boolean = false;
IsCompOverride:boolean = false;
IsCompPdfScan:boolean = false;
IsCompReviewer:boolean = false;
IsCompSyncBatching:boolean = false;
UserID:number = 0;
}


export class DashboardPermissionModel{
    UserPermissions:DashboardUserWisePermissionsModel;
    UserCompanyWisePermissions:DashboardCompanyWisePermissionsModel
}
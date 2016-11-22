export class  RoleModel {
  public rolesDetail: Array<RoleInfo> = [];
    constructor() {
    this.rolesDetail = new Array<RoleInfo>();
    }
}

export class RoleInfo {
  AccountID: number;
  CreatedAt ?: Date;
  Description: string;
  Name: string;
  Picture ?: string;
  RoleID: number;
  UpdatedAt ?: Date;
  status ?: number;
}

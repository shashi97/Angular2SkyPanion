  
export class RoleModel {
  AccountID: number;
  CreatedAt ?: Date;
  Description: string;
  Name: string;
  Picture ?: string;
  RoleID: number;
  UpdatedAt ?: Date;
  status ?: number;
  RoleCount ?: number;
  RowNumber ?: number;
  IsDelete ?: boolean;
  PortalMemberRoles ?: Array<any>= [];
  RoleName ?: string;
  AccountName ?: string;
}



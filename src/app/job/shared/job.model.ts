export class JobModel {
  AccountID: number;
  CompanyID: number;
  CompanyName: string;
  Description: string;
  JobID: number;
  Number: string;
  RowNumber: number;
  TenantId: string;
  TotalCount: number;
  ActBeginDate: Date;
  ActEndDate: Date;
  ClosedDate: Date;
  CurrCost_cents: number;
  CurrCost_currency: string;
  EstBeginDate: Date;
  EstEndDate: Date;
  JobCategories: Array<any> = [];

}


export class JobCategory {
  AccountID: number;
  Category: string;
  CurrBudget_cents: number;
  CurrBudget_currency: string;
  CurrCost_cents: number;
  CurrCost_currency: string;
  Description: string;
  JobCategoryID: number;
  JobID: number;
  OrigBudget_cents: number;
  OrigBudget_currency: string;
  Spare: string;
  TotalCount: number;
}


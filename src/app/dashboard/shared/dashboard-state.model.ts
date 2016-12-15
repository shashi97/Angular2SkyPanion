

export class DashboardStateModel {
    dashboardHeader :string = '';
    isApprove:boolean= false;
    relevantInvoiceState:number = 0;
    toProcessInvCount:number = 0;
    toReviewInvCount:number = 0;
    toSyncInvCount:number = 0;
    toApproveInvCount: number = 0;
    toOverrideInvCount: number = 0;
    toBatchInvCount: number = 0;
    toRejectedInvCount: number = 0;
    companyID:number = 0
}

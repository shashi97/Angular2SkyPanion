
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class InvoiceModelContext extends BSModalContext {
	invoiceID;
	companyID;
	invoiceAmount;
	invoiceNumber;
	constructor() {
		super();
	}
}


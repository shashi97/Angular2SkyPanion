import { Component } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { JobService } from './shared/job.service';
import { JobModel, JobInfo } from './shared/job.model';

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

@Component({
    selector: 'sp-job',
    templateUrl: './job.component.html',
    providers: [JobService]
})
export class JobComponent {
  options = new TableOptions({
        columnMode: ColumnMode.force,
        headerHeight: 50,
        footerHeight: 50,
        rowHeight: 'auto',
        columns: [
            new TableColumn({ prop: 'Number' }),
            new TableColumn({ name: 'Company', prop: 'ActivationLink' }),
            new TableColumn({ name: 'Description' }),
            new TableColumn({ name: 'Talent Id ' })
        ]
    });

}

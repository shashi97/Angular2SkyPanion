import { Component, OnInit , Output , Input, EventEmitter} from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { DashboardService } from '../../../dashboard/shared/dashboard.service';

export class SyncTypeArgument {
  syncId: string = '-1';
  syncName: string = 'Sync Type';
}

@Component({
    selector: 'sp-syncType-dropdown',
    templateUrl: './sync-type.component.html'
})

export class SyncTypeDropdownComponent extends BaseComponent implements OnInit {

    @Output()
    public syncTypeChanged: EventEmitter<SyncTypeArgument> = new EventEmitter<SyncTypeArgument>();
    @Input() syncTypeFiltered: SyncTypeArgument = new SyncTypeArgument();
    private syncList: Array<any> = [];
    // private syncName: string = 'Sync Type';
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private dashboardService: DashboardService
    ) {
        super(localStorageService, router);
        this.syncList = new Array<any>();
        this.getSyncList();
    }

    ngOnInit() {
    }

    private getSyncList() {
        let item = [{ ID: 'all', Name: 'All' }, { ID: 'true', Name: 'Sync Enabled' }, { ID: 'false', Name: 'Sync Disabled' }];
        for (let i = 0; i < 3; i++) {
            this.syncList.splice(i, 0, item[i]);

            this.syncList.map((sync) => {
                if (sync.ID === this.syncTypeFiltered.syncId) {
                    this.syncTypeFiltered.syncName = sync.Name;
                }
            });
        }

    }

  private selectSync(id): void {
    this.syncList.map((sync) => {
      if (sync.ID === id) {
        this.syncTypeFiltered.syncId = id;
        this.syncTypeFiltered.syncName = sync.Name;
      }
    });
    this.syncTypeChanged.emit(this.syncTypeFiltered);
  }

}

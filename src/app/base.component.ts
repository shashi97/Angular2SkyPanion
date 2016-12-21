import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

export class BaseComponent {
  user: any;
  sessionDetails: any;
  disableMenu: Object = { 'display': 'block' };
  disableSideBar: Object = { 'display': '' };

  constructor(protected localStorageService: LocalStorageService,
    protected router: Router) {
    let token = this.localStorageService.get('authorization');
    if (token) {
      this.user = this.localStorageService.get('sessionData');
      if (this.user) {
        if (this.router.url === '/') {
          this.disableSideBar = {};
          this.router.navigate(['/company/-1/-1']);
        }
      } else {
        this.disableMenu = { 'display': 'none' };
        this.disableSideBar = { 'display': 'none' };
        this.router.navigate(['/login']);
      }
    } else {
      this.disableMenu = { 'display': 'none' };
    }
  }
}

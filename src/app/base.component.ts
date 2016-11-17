import { Router} from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

export class BaseComponent {
    user: any;
    sessionDetails: any;

    constructor(protected localStorageService: LocalStorageService,
        protected router: Router) {
        let token = this.localStorageService.get('authorization');
        if (token) {
            this.user = this.localStorageService.get('user');
            if (this.router.url === '/login') {
                this.router.navigate(['/company']);
            }
        } else {
            this.router.navigate(['/login']);
        }
    }
}

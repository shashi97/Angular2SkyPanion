import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { } from './ach-setup.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class AchSetupService {
  constructor(private http: Http) {
  }

  getAchSetups(pageNumber, rowsPerPage) {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/achsetups/' + pageNumber + '/' + rowsPerPage)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  getachSetupDetail(id) {
    return this.http.get(ApiUrl.baseUrl + 'api/achsetups/' + id)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }


  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
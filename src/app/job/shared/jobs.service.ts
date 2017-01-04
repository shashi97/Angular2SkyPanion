import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { JobModel } from '../shared/job.model';
import 'Rxjs/Rx';
import { JobCategory } from '../../invoice/invoice-entry/shared/invoice-entry.model';
import { ApiUrl } from '../../config.component';
// import { JobsInfo } from './jobs.model';
@Injectable()
export class JobsService {
  constructor(private http: Http) {

  }
  public getJobs(pageNumber: number, rowsPerPage: number): Promise<any> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/jobs/'
      + pageNumber
      + '/'
      + rowsPerPage
      )
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getJobsByCompanyId(CompanyID: number): Promise<any> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/jobs/'
      + CompanyID
      )
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }


  public getJobCategory(jobID: number): Promise<any> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/jobs/category/'
      + jobID
      )
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }
  public getJobById(jobId: number, currentPage: number, pageSize: number): Promise<JobModel> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/jobs/'
      + jobId
      + '/'
      + currentPage
      + '/'
      + pageSize
      )
      .toPromise()
      .then(response => response.json() as JobModel)
      .catch(error => error);

  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }




}

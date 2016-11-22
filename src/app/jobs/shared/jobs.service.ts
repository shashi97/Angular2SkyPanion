import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { JobRowInfo, JobDetails } from '../shared/jobs.model';
import 'Rxjs/Rx';

import { ApiUrl } from '../../config.component';
// import { JobsInfo } from './jobs.model';
@Injectable()
export class JobsService {
  constructor(private http: Http) {

  }
  public getJobs(pageNumber: number, rowsPerPage: number): Promise<JobRowInfo[]> {
   return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/jobs/'
      + pageNumber
      + '/'
      + rowsPerPage
      )
      .toPromise()
      .then(response => response.json() as JobRowInfo[])
      .catch(this.handleError);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  public getJobById(jobId: number, currentPage: number, pageSize: number): Promise<JobDetails> {
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
      .then(response => response.json() as JobDetails)
      .catch(this.handleError);

  }


}

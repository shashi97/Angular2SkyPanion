import { EventEmitter } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';
import {PubSubService} from '../interceptor/pub-service';


export class HttpInterceptor extends Http {
 _pubsub: PubSubService;
  authorization: any;
  requested: EventEmitter<string>;
  completed: EventEmitter<string>;
  error: EventEmitter<string>;

  constructor(backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private router: Router,
    private pubsub: PubSubService,
    private localStorageService: LocalStorageService
    ) {
    super(backend, defaultOptions);
    this.requested = new EventEmitter<string>();
    this.completed = new EventEmitter<string>();
    this.error = new EventEmitter<string>();

  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    
    // this.requested.emit('start');

    options = this.addHeaders(options);

    return this.intercept(super.get(url, options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    // this.requested.emit('start');

    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    // this.requested.emit('start');
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    // this.requested.emit('start');

    return this.intercept(super.delete(url, options));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    let isHeaderFound = true;
    if (!options) {
      isHeaderFound = false;
    }
    options = this.addHeaders(options);
    if (!isHeaderFound) {
      options.headers.append('Content-Type', 'application/json');
    }
    return options;
  }

  addHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }
    this.authorization = this.localStorageService.get('authorization');
    if (this.authorization) {
      options.headers.append('Authorization', this.authorization);
    }
    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    this.pubsub.beforeRequest.emit("beforeRequestEvent");
      observable.do




    try
    {
      return observable.finally(() => 
      this.pubsub.afterRequest.emit("afterRequestEvent"));
    }catch (e) {
        return observable.catch((err, source) => {
      if (err.status === 401) {                  
        this.authorization = this.localStorageService.get('authorization');
        if (this.authorization) {
          this.localStorageService.remove('authorization');
          this.localStorageService.remove('user');
        }
        this.router.navigate(['/login']);
        return Observable.empty();

      } else if (err.status === 403) {
        console.log('you can not access api');
        return Observable.throw(err);
      } else if (err.status === 0) {                // Api Connection Refused
        console.log('ERR_CONNECTION_REFUSED, Api is down');
        return Observable.throw(err);
      } else {
        return Observable.throw(err);
      }
    });
    }
  }
}

import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
@Injectable()

export class SettingService {
    constructor(private http: Http) {

    }

    private apiServiceBase: string = 'http://localhost:5000/';

    public getRoles() {
        return this.http
            .get(this.apiServiceBase + "api/roles")
            .map((res: Response) => res.json());
    }

    public getRoleTypes() {
        return this.http
            .get(this.apiServiceBase + "api/roles/roleType")
            .map((res: Response) => res.json());
    }

}

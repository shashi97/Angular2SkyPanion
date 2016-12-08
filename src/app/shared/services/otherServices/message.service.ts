import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()

export class MessageService {
    constructor(private http: Http) {
    }

    showMessage(title: string, message: string, msgType: string) {
        let msgColor = 'DarkGreen';
        let iconClass = null;
        switch (title) {
            case 'error':
                msgColor = 'DarkRed';
                iconClass = 'fa fa-thumbs-down bounce animated';
                break;
            case 'info':
                msgColor = 'DarkBlue';
                iconClass = null;
                break;
            default:
                msgColor = 'DarkGreen';
                iconClass = 'fa fa-thumbs-up bounce animated';
                break;
        }
    }
}

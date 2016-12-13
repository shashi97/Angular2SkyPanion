import { Component, Output, EventEmitter } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { IniSetupComponent } from './ini-setup.component';
import { IniSetupService } from './shared/ini-setup.service';
import { IniSetupModel } from './shared/ini-setup.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


export class CustomModalContext extends BSModalContext {
    Serverfiles: IniSetupModel = new IniSetupModel();
    iniSetupModel: Object;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
    selector: 'modal',
    //styleUrls: ['./bootstrap.min.css'],
    //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
    // Remove when solved.
    /* tslint:disable */
    templateUrl: './setup-modal.component.html',
})

export class CustomModal implements CloseGuard, ModalComponent<CustomModalContext> {
    context: CustomModalContext;
    private Errors: Array<any> = [];
    private ErrorsHeaders: string = "";
    private iniSetupComponent: IniSetupComponent;
    private Serverfiles: Array<any> = [];
    private showHideErrorLog: Object = { 'display': 'none' };
    private displayValue: String;
    private filepath: Object =
    {
        path: null,
        Category: 14
    };


    // @Output()
    // public currentFileChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(public dialog: DialogRef<CustomModalContext>,
        private iniSetupService: IniSetupService,
        public toastr: ToastsManager) {
        this.context = dialog.context;
        this.getDirectoryDetail(this.context.Serverfiles);

        //  dialog.setCloseGuard(this);
    }
    public getDirectories(filepath, category): void {
        this.context.Serverfiles.filepathObject.path = filepath;
        this.context.Serverfiles.filepathObject.Category = category;
        this.getDirectoryDetail(this.context.Serverfiles);
    }

    public getDirectoryDetail(context): void {
        this.iniSetupService.getServerDirectoriesfiles(context.filepathObject).then((result) => {
            if (result.status === 404) {
                this.Serverfiles = [];
            } else if (result.status === 500) {
            } else {
                this.Serverfiles = result;
                //this.setValueForModal(Serverfiles);
            }
        });
    }

    public getParentDirectory(): void {
        var path = this.context.Serverfiles.filepathObject.path.substr(0, (this.context.Serverfiles.filepathObject.path.lastIndexOf("/") + 1))
        if (path.match(/\//g).length == 1) {
            this.getDirectories(null, 14);
        }
        else {
            this.getDirectories(path, this.context.Serverfiles.filepathObject.Category);
        }
    }

     public saveSelectedfilePath(path): void {
        this.ErrorsHeaders = "";
        this.Errors = new Array<any>();
        this.context.Serverfiles.filepathObject.path = path;
        this.iniSetupService.saveSelectedfilePath(this.context.Serverfiles).then((result) => {
            if (result.status == 404) {
                //$scope.intilizevariables();
            }
            else if (result.status == 500) {
            }
            else {
                if (result._body.replace(/"/g, '') == "Some thing is Wrong with this file") {
                    var obj = { ErrorName: "Something is wrong in this selected file" }
                    this.Errors.splice(this.Errors.length, 0, obj);

                    if (this.Errors.length > 0) {
                        this.showHideErrorLog = { 'display': 'block' };
                        this.displayValue = 'alert alert-danger';
                        this.ErrorsHeaders = this.Errors.length + ' errors is this Selected File';
                        return;
                    }
                } else {
                    this.showHideErrorLog = { 'display': 'none' };
                    this.displayValue = 'none';
                    this.toastr.success('file upload sucessfully', 'Success!');
                    this.dialog.close();
                }
            }
        });
    }

    public closeModel(): void {
        this.dialog.close();
    }
  


}

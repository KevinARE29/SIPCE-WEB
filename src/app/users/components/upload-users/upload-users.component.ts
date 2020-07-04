import { Component } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { empty } from 'rxjs';
import { CvsToJsonService } from './../../../shared/cvs-to-json.service';

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css']
})
export class UploadUsersComponent {
  fileList: UploadFile[];

  constructor(private cvsToJsonService: CvsToJsonService) {}

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isCvs = file.type === 'application/vnd.ms-excel';
      if (!isCvs) {
        // Only CSV allowed
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        // File must be smaller than 2MB
        observer.complete();
        return;
      }
      observer.next(isCvs && isLt2M);
      observer.complete();
    });
  };

  customReq = (item: unknown) => {
    // TODO: refactor to return an Observable
    this.fileList = [
      {
        uid: item['file'].uid,
        name: item['file'].name,
        status: 'done',
        response: '{"status": "success"}'
      }
    ];

    this.cvsToJsonService.cvsJSON(item['file']).subscribe((r) => {
      console.log(r);
    });
    return empty();
  };
}

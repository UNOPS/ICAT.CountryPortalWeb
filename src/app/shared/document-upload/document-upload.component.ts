import { async } from '@angular/core/testing';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import {
  DocumentControllerServiceProxy,
  Documents,
  DocumentsDocumentOwner,
} from './../../../shared/service-proxies/service-proxies';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit, OnChanges {
  @Input() doucmentList: Documents[] = [];
  @Input() documentOwner: DocumentsDocumentOwner;
  @Input() documentOwnerId: number;
  @Input() isNew: boolean;
  @Input() showDeleteButton: boolean = true;
  @Input() showUpload: boolean = true;
  @Input() id: number = 0;
  @Input() viewDocument: boolean = false;

  loading: boolean;
  uploadedFiles: any[] = [];
  SERVER_URL = environment.baseUrlAPIDocUploadAPI; //"http://localhost:7080/document/upload2";
  SERVER_URL_ANONYMOUS = environment.baseUrlAPIDocUploadAnonymousAPI;
  uploadURL: string;
  token: string;
  constructor(
    private docService: DocumentControllerServiceProxy,
    private httpClient: HttpClient,
    private confirmationService: ConfirmationService
  ) {
    // this.showDeleteButton = false;
    this.token = localStorage.getItem('access_token')!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.documentOwner) {
      this.uploadURL =
        (this.token ? this.SERVER_URL : this.SERVER_URL_ANONYMOUS) +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
    this.load();
  }

  ngOnInit(): void {
    // this.token = localStorage.getItem('access_token')!;

    // console.log("documentOwnerId..",this.documentOwnerId);

    if (this.documentOwner) {
      this.uploadURL =
        (this.token ? this.SERVER_URL : this.SERVER_URL_ANONYMOUS) +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
    console.log('uploadURL', this.uploadURL);
    console.log('============' + this.showDeleteButton + '==============');
  }

  loadDocments(event: LazyLoadEvent) {
    this.load();
  }

  async load() {
    if (!this.isNew) {
      this.loading = true;

      if (this.token) {
        console.log('token123', this.token);
        await this.docService
          .getDocuments(this.documentOwnerId, this.documentOwner)
          .subscribe(
            (res) => {
              console.log('token1234', res);
              this.doucmentList = res;
              this.loading = false;
            },
            (err: any) => console.log(err)
          );
      } else {
        console.log('token124', this.token);
        await this.docService
          .getDocumentsAnonymous(this.documentOwnerId, this.documentOwner)
          .subscribe(
            (res) => {
              this.doucmentList = res;
              this.loading = false;
            },
            (err: any) => console.log(err)
          );
      }
    }
  }

  onUploadComplete(event: any) {
    console.log(event);
    this.load();
  }

  async myUploader(event: any) {
    this.loading = true;
    if (this.doucmentList === undefined || this.doucmentList === null) {
      this.doucmentList = new Array();
    }
    let fileReader = new FileReader();

    for (let file of event.files) {
      console.log('timecheck1');
      this.loading = true;
      file.documentOwner = this.documentOwner;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentOwner', this.documentOwner.toString());
      let fullUrl =
        this.SERVER_URL +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
      console.log('this.uploadURL', this.uploadURL);
      this.httpClient.post<any>(fullUrl, formData).subscribe(
        (res) => {
          this.load();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }
    console.log('timecheck2');
  }

  async deleteConfirm(doc: Documents) {
    console.log('name');
    this.confirmationService.confirm({
      message: `Do you want to delete ${(doc.fileName, doc.id)} ?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.token) {
          this.docService.deleteDoc(doc.id).subscribe(
            (res: any) => {
              console.log('token12345', res);
              this.load();
            },
            (err: any) => console.log(err)
          );
        } else {
          this.docService.deleteDocAnonymous(doc.id).subscribe(
            (res: any) => {
              console.log('deleteDocAnonymous', res);
              this.load();
            },
            (err: any) => console.log(err)
          );
        }
      },
      reject: () => {
        //this.messageService.add({severity:'info', summary:'Rejected', detail:'You have rejected'});
      },
    });
  }

  base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onUpload(event: any) {
    alert('test');
  }
}

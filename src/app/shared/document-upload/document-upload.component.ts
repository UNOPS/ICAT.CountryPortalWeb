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
    private confirmationService: ConfirmationService,
  ) {
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
    if (this.documentOwner) {
      this.uploadURL =
        (this.token ? this.SERVER_URL : this.SERVER_URL_ANONYMOUS) +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
  }

  loadDocments(event: LazyLoadEvent) {
    this.load();
  }

  async load() {
    if (!this.isNew) {
      this.loading = true;

      if (this.token) {
        await this.docService
          .getDocuments(this.documentOwnerId, this.documentOwner)
          .subscribe(
            (res) => {
              this.doucmentList = res;
              this.loading = false;
            },
            (err: any) => console.log(err)
          );
      } else {
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
    this.load();
  }

  async myUploader(event: any) {
    this.loading = true;
    if (this.doucmentList === undefined || this.doucmentList === null) {
      this.doucmentList = [];
    }

    for (const file of event.files) {
      this.loading = true;
      file.documentOwner = this.documentOwner;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentOwner', this.documentOwner.toString());
      const fullUrl =
        this.SERVER_URL +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
      this.httpClient.post<any>(fullUrl, formData).subscribe(
        (res) => {
          this.load();
        },
        (err) => {
          this.loading = false;
        },
      );
    }
  }

  async deleteConfirm(doc: Documents) {
    this.confirmationService.confirm({
      message: `Do you want to delete ${(doc.fileName, doc.id)} ?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.token) {
          this.docService.deleteDoc(doc.id).subscribe((res: any) => {
            this.load();
          });
        } else {
          this.docService.deleteDocAnonymous(doc.id).subscribe((res: any) => {
            this.load();
          });
        }
      },
      reject: () => {},
    });
  }

  base64ToArrayBuffer(base64: any) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onUpload(event: any) {
    alert('test');
  }
}

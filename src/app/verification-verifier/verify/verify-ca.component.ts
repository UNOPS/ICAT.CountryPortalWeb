import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import { LazyLoadEvent, MessageService } from 'primeng/api';

import {
  Assessment,
  AssessmentYear,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verify-ca',
  templateUrl: './verify-ca.component.html',
  styleUrls: ['./verify-ca.component.css'],
})
export class VerifyCaComponent implements OnInit {
  VerificationStatusEnum = VerificationStatus;

  verificationStatus: string[] = [
    VerificationStatus[VerificationStatus['Pre Assessment']],
    VerificationStatus[VerificationStatus['NC Received']] === 'NC Received' ? 'NC Sent' : 'NC Received' ,
    VerificationStatus[VerificationStatus['In Remediation']],
    VerificationStatus[VerificationStatus['Initial Assessment']],
    VerificationStatus[VerificationStatus['Final Assessment']],
    VerificationStatus[VerificationStatus['Fail']],
    VerificationStatus[VerificationStatus['Pass']],
  ];

  searchBy: any = {
    status: null,
    text: null,
  };
  loading: boolean;
  totalRecords: number = 0;
  isActive: boolean = false;
  rows: number = 10;
  last: number;
  event: any;
  paras: AssessmentYear[] = [];
  assessmentList: Assessment[] = [];
  blank = '';
  userName: string;
  loggedUser: User[] = [];

  @ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private vrServiceProxy: VerificationControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    
  }

  onStatusChange($event: any) {
    this.onSearch();
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
   this.loading = true;
    this.totalRecords = 0;

    let status = this.searchBy.status  === 'NC Sent' ? 'NC Received' : this.searchBy.status
    let statusId = status
      ? Number(VerificationStatus[status])
      : 0;
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    let Active = 0;
    setTimeout(() => {
      this.vrServiceProxy
        .getVerifierParameters(pageNumber, this.rows, statusId, filtertext)
        .subscribe((a) => {
          this.paras = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        }, error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading'
          })
          this.loading = false
        });
    }, 1);
  };

  statusClick(event: any, object: AssessmentYear) {
    this.router.navigate(['/verification-verifier/detail'], {
      queryParams: {
        id: object.id,
        verificationStatus: object.verificationStatus,
      },
    });
  }
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import {
  AssesmentControllerServiceProxy,
  Assessment,
  AssessmentYear,
  MitigationActionType,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
  VerificationControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verify-history',
  templateUrl: './verify-history.component.html',
  styleUrls: ['./verify-history.component.css']
})
export class VerifyHistoryComponent implements OnInit
{

 VerificationStatusEnum = VerificationStatus;

verificationStatus: string[] = [
  // VerificationStatus[VerificationStatus.Pending],
  // VerificationStatus[VerificationStatus['Pre Assessment']],
  // VerificationStatus[VerificationStatus['NC Received']] === 'NC Received' ? 'NC Sent' : 'NC Received',
  // VerificationStatus[VerificationStatus['In Remediation']],
  // VerificationStatus[VerificationStatus['Initial Assessment']],
  // VerificationStatus[VerificationStatus['Final Assessment']],
  VerificationStatus[VerificationStatus.Fail],
  VerificationStatus[VerificationStatus['Pass']]
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
blank:string='';

@ViewChild('op') overlay: any;
constructor(
  private router: Router,
  private serviceProxy: ServiceProxy,
  private vrServiceProxy: VerificationControllerServiceProxy,
  private cdr: ChangeDetectorRef,
  private route: ActivatedRoute

) { }

ngAfterViewInit(): void {
  this.cdr.detectChanges();
}

ngOnInit(): void {
 console.log(this.verificationStatus, VerificationStatus[VerificationStatus.Pending], VerificationStatus.Pending)

  this.onSearch();
}



onStatusChange($event: any) {
  this.onSearch();
}


onSearch() {
  let event: any = {};
  event.rows = this.rows;
  event.first = 0;

  this.loadgridData(event);
}




loadgridData = (event: LazyLoadEvent) => {
 this.loading = true;
  this.totalRecords = 0;

  console.log(this.searchBy);
  let status = this.searchBy.status  === 'NC Sent' ? 'NC Received' : this.searchBy.status
  let statusId = status
    ? Number(VerificationStatus[status])
    : 0;
    console.log("110011",statusId)
  let filtertext = this.searchBy.text ? this.searchBy.text : '';
  console.log("2222",filtertext)
  let pageNumber =
    event.first === 0 || event.first === undefined
      ? 1
      : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
  this.rows = event.rows === undefined ? 10 : event.rows;
  let Active = 0;
  console.log(pageNumber)
  setTimeout(() => {
    this.vrServiceProxy
      .getVRParameters(
        pageNumber,
        this.rows,
        statusId,
        filtertext,
        'true'
      )
      .subscribe((a) => {
       this.paras = a.items;
        // this.paras = a.items.filter((o: any)=>o.verificationStatus == 6 || o.verificationStatus == 7 );
        console.log('hey aassse year',this.paras)
        this.totalRecords = a.meta.totalItems;
       this.loading = false;
      });
  }, 1);
};


statusClick(event: any, object: AssessmentYear) {
  // if (
  //   this.QuAlityCheckStatusEnum[object.qaStatus] !==
  //   this.QuAlityCheckStatusEnum[this.QuAlityCheckStatusEnum.Pass]
  // ) {
  //   this.router.navigate(['/qc/detail'], {
  //     queryParams: { id: object.id },
  //   });
  // }

  this.router.navigate(['verification-verifier/detail'], {
    queryParams: { id: object.id , verificationStatus:object.verificationStatus, flag:1 },
  });
}


}

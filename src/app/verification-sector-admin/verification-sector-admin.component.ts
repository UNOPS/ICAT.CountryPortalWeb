import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import { LazyLoadEvent } from 'primeng/api';
import {
  Assessment,
  AssessmentYear,
  ServiceProxy,
  VerificationControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verification-sector-admin',
  templateUrl: './verification-sector-admin.component.html',
  styleUrls: ['./verification-sector-admin.component.css'],
})
export class VerificationSectorAdminComponent implements OnInit {
  VerificationStatusEnum = VerificationStatus;

  verificationStatus: string[] = [
    VerificationStatus[VerificationStatus.Pending],
    VerificationStatus[VerificationStatus['Pre Assessment']],
    VerificationStatus[VerificationStatus['NC Recieved']],
    VerificationStatus[VerificationStatus['Initial Assessment']],
    VerificationStatus[VerificationStatus['Final Assessment']],
    VerificationStatus[VerificationStatus.Fail],
    VerificationStatus[VerificationStatus['Pass']],
  ];

  searchBy: any = {
    status: null,
    text: null,
  };
  loading: boolean;
  totalRecords = 0;
  isActive = false;
  rows = 10;
  last: number;
  event: any;
  paras: AssessmentYear[] = [];
  assessmentList: Assessment[] = [];
  blank = '';

  @ViewChild('op') overlay: any;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private vrServiceProxy: VerificationControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.onSearch();
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
    this.totalRecords = 0;

    const statusId = this.searchBy.status
      ? Number(VerificationStatus[this.searchBy.status])
      : 0;

    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.vrServiceProxy
        .getVRParameters(pageNumber, this.rows, statusId, filtertext)
        .subscribe((a) => {
          this.paras = a.items;

          this.totalRecords = a.meta.totalItems;
        });
    }, 1);
  };

  statusClick(event: any, object: AssessmentYear) {
    this.router.navigate(['/verification-sector-admin/detail'], {
      queryParams: {
        id: object.id,
        verificationStatus: object.verificationStatus,
      },
    });
  }
}

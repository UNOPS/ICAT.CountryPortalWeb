import { Component, OnInit } from '@angular/core';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { LazyLoadEvent } from 'primeng/api';
import { Router } from '@angular/router';
import decode from 'jwt-decode';

import {
  AssessmentYear,
  Ndc,
  QualityCheckControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-quality-check',
  templateUrl: './quality-check.component.html',
  styleUrls: ['./quality-check.component.css'],
})
export class QualityCheckComponent implements OnInit {
  QuAlityCheckStatusEnum = QuAlityCheckStatus;
  qualityCheckStatus: string[] = [
    QuAlityCheckStatus[QuAlityCheckStatus.Pending],
    QuAlityCheckStatus[QuAlityCheckStatus.InProgress],
    QuAlityCheckStatus[QuAlityCheckStatus.Fail],
    QuAlityCheckStatus[QuAlityCheckStatus.Pass],
  ];
  ndcList: Ndc[];
  searchBy: any = {
    status: null,
    text: null,
    ndc: null,
    subNdc: null,
  };
  parameteters: AssessmentYear[] = [];
  climateAction: any[] = [];
  loading: boolean;
  totalRecords = 0;
  itemsPerPage = 0;
  isActive = false;
  rows = 10;
  last: number;
  event: any;
  userCountryId: any;
  userSectorId: any;
  usrRole: any;
  qcDisable = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private qaServiceProxy: QualityCheckControllerServiceProxy,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    this.usrRole = tokenPayload.roles[0];

    if (this.usrRole == 'QC Team' || this.usrRole == 'MRV Admin') {
      this.qcDisable = true;
    } else {
      this.qcDisable = false;
    }

    this.serviceProxy
      .getManyBaseNdcControllerNdc(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        ['subNdc'],
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.ndcList = res.data;
      });

    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    let subNDC = this.searchBy.subNdc ? this.searchBy.subNdc.id : 0;

    this.qaServiceProxy.getQCParameters(
      1,
      10000,
      0,
      filtertext,
      ndcId,
      subNDC,
      '',
    )
      .subscribe((a) => {

        a.items.forEach((b: any) => {
          this.climateAction.push(b.assessment.project)
        })
      });

    this.onSearch();

  }

  onStatusChange($event: any) {
    this.onSearch();
  }

  onNDChange($event: any) {}

  onSubNdCChange($event: any) {}

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const statusId = this.searchBy.status
      ? Number(QuAlityCheckStatus[this.searchBy.status])
      : 0;
    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    const subNDC = this.searchBy.subNdc ? this.searchBy.subNdc.id : 0;
    const ctAction = this.searchBy.climateaction
      ? this.searchBy.climateaction.climateActionName
      : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.qaServiceProxy
        .getQCParameters(
          pageNumber,
          this.rows,
          statusId,
          filtertext,
          ndcId,
          subNDC,
          ctAction,
        )
        .subscribe((a) => {
          this.parameteters = a.items;
          this.totalRecords = a.meta.totalItems;

          this.loading = false;
          this.itemsPerPage = a.meta.itemsPerPage;
        });
    }, 1);
  };

  onCAChange(event: any) {
    this.onSearch();
  }

  statusClick(event: any, object: AssessmentYear) {
    this.router.navigate(['/qc/detail'], {
      queryParams: { id: object.id, flag: object.qaStatus },
    });
  }
}

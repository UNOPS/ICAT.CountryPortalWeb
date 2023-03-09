import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import {
  AssessmentControllerServiceProxy,
  AssessmentYearControllerServiceProxy,
  Methodology,
  ParameterRequestControllerServiceProxy,
  Project,
  ProjectControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-managedatastatus',
  templateUrl: './managedatastatus.component.html',
  styleUrls: ['./managedatastatus.component.css'],
})
export class ManagedatastatusComponent implements OnInit {
  projectApprovalStatusId = 1;
  methodologies: Methodology[];
  searchText: string;
  countryId: any = 0;

  projects: Project[];

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
  };

  first = 0;
  sectorId = 1;

  constructor(
    private serviceProxy: ServiceProxy,
    private assessmentProxy: AssessmentControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private assYearProxy: AssessmentYearControllerServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild('dt') table: Table;
  activeprojects: activeproject[] = [];
  activeprojectson: activeproject[] = [];
  activeprojectsload: activeproject[] = [];

  datarequests: datarequest[] = [];
  datarequests1: datarequest;
  asseYearId: any;
  alldatarequests: any;

  ngOnInit() {
    this.serviceProxy
      .getManyBaseMethodologyControllerMethodology(
        undefined,
        undefined,
        undefined,
        undefined,
        ['version,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.methodologies = res.data;
        if (res.totalRecords !== null) {
          this.last = res.count;
        } else {
          this.last = 0;
        }
      });
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  directToApprovePage(datarequests: any) {
    const assenmentYearId = datarequests.assenmentYearId;
    this.router.navigate(['/app-approve-data'], {
      queryParams: { id: assenmentYearId },
    });
  }

  loadgridData(event: LazyLoadEvent) {
    this.loading = true;

    const filterText = this.searchBy.text ? this.searchBy.text : '';
    const projectStatusId = 0;

    this.projectApprovalStatusId = 5;
    this.countryId = 0;

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 10 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    this.assYearProxy
      .assessmentYearForManageDataStatus(
        pageNumber,
        this.rows,
        filterText,
        projectStatusId,
        this.projectApprovalStatusId,
        0,
      )
      .subscribe((res) => {
        this.loading = false;

        this.totalRecords = res.meta.totalItems;
        this.datarequests = [];
        for (const assessmentYear of res.items) {
          const datarequests1: datarequest = {
            name: '',
            type: '',
            year: '',
            assenmentYearId: 0,
            totalreqCount: 0,
            pendingreqCount: 0,
            pendingdataentries: 0,
            recieved: 0,
            qaStatus: 0,
          };

          datarequests1.name =
            assessmentYear.assessment.project.climateActionName;
          datarequests1.year = assessmentYear.assessmentYear
            ? assessmentYear.assessmentYear
            : '';
          datarequests1.type = assessmentYear.assessment.assessmentType;
          datarequests1.assenmentYearId = assessmentYear.id;
          datarequests1.qaStatus = assessmentYear.qaStatus;

          this.parameterProxy
            .getDateRequestToManageDataStatus(
              assessmentYear.assessment.id,
              assessmentYear.assessmentYear,
            )
            .subscribe((res) => {
              datarequests1.totalreqCount = res.length;

              for (const dr of res) {
                if (
                  dr.dr_dataRequestStatus == -1 ||
                  dr.dr_dataRequestStatus == 1 ||
                  dr.dr_dataRequestStatus == 2
                ) {
                  ++datarequests1.pendingreqCount;
                }

                if (
                  dr.dr_dataRequestStatus == 3 ||
                  dr.dr_dataRequestStatus == -9 ||
                  dr.dr_dataRequestStatus == 4 ||
                  dr.dr_dataRequestStatus == 5 ||
                  dr.dr_dataRequestStatus == 6 ||
                  dr.dr_dataRequestStatus == -6 ||
                  dr.dr_dataRequestStatus == -8
                ) {
                  ++datarequests1.pendingdataentries;
                }

                if (
                  dr.dr_dataRequestStatus == 9 ||
                  dr.dr_dataRequestStatus == 8 ||
                  dr.dr_dataRequestStatus == 9 ||
                  dr.dr_dataRequestStatus == 11
                ) {
                  ++datarequests1.recieved;
                }
              }
            });

          this.datarequests.push(datarequests1);
        }
      });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.methodologies
      ? this.first === this.methodologies.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.methodologies ? this.first === 0 : true;
  }

  status() {}
}

export interface activeproject {
  name: string;
  ertarget: number;
  targetyear: string;
  erarchievment: number;
  archivmentyear: string;
}

export interface datarequest {
  name: string;
  type: string;
  year: string;
  assenmentYearId: number;
  totalreqCount: number;
  pendingreqCount: number;
  pendingdataentries: number;
  recieved: number;
  qaStatus: number;
}

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import {
  AssessmentControllerServiceProxy,
  AssessmentYearControllerServiceProxy,
  Methodology,
  ParameterRequestControllerServiceProxy,
  ParameterVerifierAcceptance,
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
    year: null,
    climateaction: null,
    status: null
  };

  first = 0;
  sectorId: number = 1;
  yearList: any;
  statusList: any[] = [
    {name: 'Not Approved', code: 'notApproved'},
    {name: 'Approved', code: 'approved'}
  ]


  constructor(
    private serviceProxy: ServiceProxy,
    private assessmentProxy: AssessmentControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
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
  dataReqCA: any[] = []

  async ngOnInit() {
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
      })
    //  this.loadgridData();

    let res = await this.assessmentYearProxy.assessmentYearForManageDataStatus(0, 0, '', 0, 5, 0, 0, '', 'true', '').toPromise()
    for await (let r of res){
      this.dataReqCA.push(r.assessment.project)
    }

    this.dataReqCA =   Object.values(
      this.dataReqCA.reduce((acc, obj) => ({
        ...acc,
        [obj.id]: obj
      }), {})
    );
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  directToApprovePage(datarequests: any) {
    let assenmentYearId = datarequests.assenmentYearId
    this.router.navigate(['/app-approve-data'], {
      queryParams: { id: assenmentYearId },
    });
  }

  onCAChange(e: any) {
    if (this.searchBy.climateaction) {
      this.assessmentYearProxy
        .getAllByProjectId(this.searchBy.climateaction.id)
        .subscribe((res: any) => {
          this.yearList = res;
          const tempYearList = getUniqueListBy(this.yearList, 'assessmentYear');
          this.yearList = tempYearList;
        });
    }

    function getUniqueListBy(arr: any, key: any) {
      return [
        ...new Map(
          arr.map((item: { [x: string]: any }) => [item[key], item])
        ).values(),
      ];
    }

    this.onSearch();
  }

  onYearChange(e: any){
    this.onSearch();
  }

  onStatusChange(e: any){
    this.onSearch()
  }



  loadgridData(event: LazyLoadEvent) {


    this.loading = true;

    let filterText = this.searchBy.text ? this.searchBy.text : '';
    let climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
      : 0;
    let year = this.searchBy.year ? this.searchBy.year.assessmentYear : '';
    let projectStatusId = 0;
    let status = this.searchBy.status ? this.searchBy.status.code : ''

    let sectorId = this.sectorId;
    let statusId = 0;
    let mitigationActionTypeId = 0;
    this.projectApprovalStatusId = 5;
    this.countryId = 0;

    let assessmentStatusName = '';
    let Active = 4;
    let editedOn = 0;
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : (event.first / (event.rows === undefined ? 10 : event.rows)) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    this.assessmentYearProxy.assessmentYearForManageDataStatus(
      pageNumber,
      this.rows,
      filterText,
      projectStatusId,
      this.projectApprovalStatusId,
      // this.countryId,
      // sectorId,
      0,
      climateActionId,
      year,
      'false',
      status
    ).subscribe(async res => {
      this.loading = false;

      this.totalRecords = res.meta.totalItems;
      this.datarequests = [];
      for (let assementYear of res.items) {
        let datarequests1: datarequest = {
          name: "",
          type: '',
          year: "",
          assenmentYearId: 0,
          totalreqCount: 0,
          pendingreqCount: 0,
          pendingdataentries: 0,
          recieved: 0,
          qaStatus: 1,//for disble button befor data load.
          verificationStatus: 0,
          isAllParameterAccept: false,
         
         
        };

        datarequests1.name = assementYear.assessment.project.climateActionName;
        datarequests1.year = assementYear.assessmentYear ? assementYear.assessmentYear : "";
        datarequests1.type = assementYear.assessment.assessmentType;
        datarequests1.assenmentYearId = assementYear.id;
        datarequests1.qaStatus = assementYear.qaStatus;
        datarequests1.verificationStatus = assementYear.verificationStatus;

        this.assessmentProxy
          .getAssessmentsForApproveData(
            assementYear.assessment.id,
            assementYear.assessmentYear,
            " "
          )
          .subscribe((res) => {
            datarequests1.isAllParameterAccept = !res.assessment?.parameters.some((obj: {
              parameterRequest: any;
              verifierAcceptance: ParameterVerifierAcceptance;

            }) => obj.parameterRequest.dataRequestStatus != 11 && obj.verifierAcceptance != ParameterVerifierAcceptance.REJECTED);
          })
        this.parameterProxy
          .getDateRequestToManageDataStatus(assementYear.assessment.id, assementYear.assessmentYear)
          .subscribe(res => {
            datarequests1.totalreqCount = res.length;
            for (let dr of res) {

              if (dr.dr_dataRequestStatus == -1 || dr.dr_dataRequestStatus == 1 || dr.dr_dataRequestStatus == 2) {
                ++datarequests1.pendingreqCount;
              }

              if (dr.dr_dataRequestStatus == 3 || dr.dr_dataRequestStatus == -9 || dr.dr_dataRequestStatus == 4
                || dr.dr_dataRequestStatus == 5 || dr.dr_dataRequestStatus == 6 || dr.dr_dataRequestStatus == -6 || dr.dr_dataRequestStatus == -8) {
                ++datarequests1.pendingdataentries;
              }

              if (dr.dr_dataRequestStatus == 9 || dr.dr_dataRequestStatus == 8 || dr.dr_dataRequestStatus == 9 || dr.dr_dataRequestStatus == 11) {
                ++datarequests1.recieved;
              }
            }
          })

        this.datarequests.push(datarequests1);

      }
      this.datarequests.sort((a,b) => a.qaStatus - b.qaStatus)
    })
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

  status() { }

  getApproveDataLabel(request: datarequest){
    if(request.qaStatus === 4 || request.qaStatus ==1 ){
      return "Approved Data"
    } 
    else {
      return "Approve Data"
    }
  }

  async disableApproveData(request: datarequest){

    if(request.qaStatus === 4 || request.qaStatus === 1){
      return true
    } 
    else {
      return false
    }
  }

}

export interface activeproject {
  name: string,
  ertarget: number,
  targetyear: string,
  erarchievment: number,
  archivmentyear: string
};

export interface datarequest {
  name: string,
  type: string,
  // year : number,
  year: string,
  assenmentYearId: number,
  totalreqCount: number,
  pendingreqCount: number,
  pendingdataentries: number,
  recieved: number,
  qaStatus:number
  verificationStatus: number,
  isAllParameterAccept:boolean,
 
};

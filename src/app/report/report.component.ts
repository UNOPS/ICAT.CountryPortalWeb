import { environment } from './../../environments/environment';
import { NdcControllerServiceProxy, ProjectControllerServiceProxy, ReportDataPDF, ReportPdfInsert, SectorControllerServiceProxy } from './../../shared/service-proxies/service-proxies';
import { query } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import { filter } from 'rxjs/operators';
import {
  Assessment,
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  Country,
  GetManyReportResponseDto,
  GetReportDto,
  Ndc,
  Project,
  Report,
  ReportControllerServiceProxy,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { ExcecutiveSummeryReport } from './Dto/executiveSummeryReportDto';
import { ClimateActionComponent } from 'app/climate-action/climate-action/climate-action.component';
import { ThrowStmt } from '@angular/compiler';
// import { FinalReportComponent } from './final-report/final-report.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, AfterViewInit {
  test = 'test';

  reports: Report[];
  sectorList: Sector[] = [];
  ndcList: Ndc[] = [];
  climateActionList: Project[] = [];
  assessmentList: Assessment[] = [];
  assessmentYrList: AssessmentYear[] = [];
  typeList: String[] = [];
  typePair: any;
  userId: number; // country admmin(1) / sector admin(2)
  isShown: boolean = true;
  display: boolean = false;
  display1: boolean = false;

  sectorListSelection: Sector[] = [];
  selectedSector: Sector[]=[];
  selectedNdc: Ndc[];
  selectedNdc1: Ndc[];
  selectedproject: Project[];
  selecetedType: any[];
  selectedYr: AssessmentYear[];
  sectors: Sector[];

  sectorIdList: string[] = new Array();
  ndcIdList: number[] = new Array();
  yrIdList: number[] = new Array();
  popUpProject: Project[] = [];
  popUpAssessmentList: Assessment[] = [];
  popUpYrList: AssessmentYear[] = [];
  uniquePopYrList: any[] = []
  setUniquePopYrList: any[] = []
  setPopYrList: any[] = []
  yearsArray: any[] = []
  yearsFilterArray: any[] = []
  pdfFiles: any[] = []



  report: Report = new Report();
  reportName: string;
  reportName1: string = '';
  description: string = '';

  // reportName2: string = "aaaaaaaaaa";
  reportPdfFile = new ReportPdfInsert();
  sectorFilter: string[] = new Array();
  ndcFilter: string[] = new Array();
  assessmentYrFilter: string[] = new Array();

  displayButton: boolean = false;

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  reportDtoSend = new GetReportDto();
  reportResponse = new GetManyReportResponseDto();
  cou = new Country();

  summeryReport = new ExcecutiveSummeryReport();
  summeryReportPDF = new ReportDataPDF();
  SERVER_URL = environment.baseUrlAPI;
  countryId = 1;

  allSelect:boolean=false;
  isCountryLevel:boolean=true;

  dataCollectionGhgModuleStatus: number;

  searchBy: any = {
    sector: null,
    ndc: null,
    ca: null,
    type: null,
    text: null,
    countryId: null,
  };

  constructor(
    private serviceProxy: ServiceProxy,
    private reportProxy: ReportControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router, // private finalComponet: FinalReportComponent,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private ndcProxy: NdcControllerServiceProxy,
    private cilmateProxy: ProjectControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    

    if(tokenPayload.sectorId){   //because this page only shows CA,SA,MRV,TT.this also can be don by using user roles from tocken
    this.isCountryLevel=false;
    this.serviceProxy.getOneBaseSectorControllerSector(tokenPayload.sectorId,undefined,undefined,undefined)
    .subscribe(res=>{
      this.selectedSector.push(res);
      // console.log("reporttokenPayload",res);
    this.onSectorChange( this.selectedSector);

    })

    }

    this.dataCollectionGhgModuleStatus =tokenPayload.moduleLevels[4];

    // ****update base on loggin details -- get user id from logging details
    // this.route.queryParams.subscribe((params) =>{
    //   this.userId = params['id'];
    // })
    //this.filterReportData()
    //this.loadPdfFiles()

    // this.reportProxy.getAllPdfFiles().subscribe((a) => {
    //   console.log("==== files=====", a);
    //   this.pdfFiles = a
    // })

    this.filterReportData()

    this.userId = 1; // country admmin(1) / sector admin(2) ==> if sector admin get it;s id and replace sector id in table loading data paramter
    if (this.userId == 1) {
      this.isShown;
    }
    if (this.userId == 2) {
      this.isShown = !this.isShown;
    }

    this.sectorProxy.getCountrySector(this.countryId).subscribe((res: any) => {
      this.sectorList = res;
      console.log("++++" ,this.sectorList)
    });
    // this.serviceProxy
    //   .getManyBaseSectorControllerSector(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.sectorList = res.data;
    //   });

    // this.serviceProxy
    //   .getManyBaseNdcControllerNdc(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    this.ndcProxy.getDateRequest(0, 0, [])
      .subscribe((res: any) => {
        this.ndcList = res.items;
        // console.log('ndc list...',this.ndcList);
      });

    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    this.cilmateProxy.getProjectsForCountrySectorInstitution(0, 0, 0, [], 0, 0)
      .subscribe((res: any) => {
        this.climateActionList = res.items;
        console.log('project list..', this.climateActionList);
      });

    if (this.dataCollectionGhgModuleStatus){
      this.typePair = [
        { id: 1, name: 'GHG Ex Post', value: 'Ex-post' },
        { id: 2, name: 'GHG Ex ante', value: 'Ex-ante' },
      ];
    } else {
      this.typePair = [
        { id: 1, name: 'GHG Ex Post', value: 'Ex-post' },
        { id: 2, name: 'GHG Ex ante', value: 'Ex-ante' },
        { id: 3, name: 'MAC Ex Post', value: 'Ex-post' },
        { id: 4, name: 'MAC Ex ante', value: 'Ex-ante' },
      ];
    }

    // console.log('pair...',this.typePair)
    //

    this.serviceProxy
      .getManyBaseAssesmentControllerAssessment(
        undefined,
        undefined,
        undefined,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.assessmentList = res.data;
        // console.log('assessment list', this.assessmentList);
      });

    this.serviceProxy
      .getManyBaseAssessmentYearControllerAssessmentYear(
        undefined,
        undefined,
        undefined,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.assessmentYrList = res.data;
        // console.log('yr list', this.assessmentYrList);
      });


  }

  reportLoading(reportId: number) {
    // console.log('repo ID', reportId);
    this.serviceProxy
      .getOneBaseReportControllerReport(reportId, undefined, undefined, 0)
      .subscribe((res) => {
        this.report = res;
        // console.log('load repo',this.report);
        this.reportName1 = res.reportName;
        // console.log('reportName1',this.reportName1);
        this.description = res.description;
        // console.log("description",this.description)
      });
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
    this.filterReportData()

  }
  selectAllSectors(selectAllSectors:boolean){
    this.selectedSector=[]
    this.selectedNdc=[];
    this.popUpProject=[];
    this.selecetedType=[];
    this.selectedYr=[];
    if(selectAllSectors){
      this.selectedSector=[];
      this.selectedSector=this.sectorList;
      this.onSectorChange(this.selectedSector);
      // console.log(" this.selectedSector",  this.selectedSector);
    }

 
  }
  onselectedAssesmentType(selectedType:any){
    // console.log("selectedType", selectedType);
    if(selectedType.includes(this.typePair[3])&&!selectedType.includes(this.typePair[1])){
      
      selectedType.push(this.typePair[1]);
     
    }
    if(selectedType.includes(this.typePair[2])&&!selectedType.includes(this.typePair[0])){
     
      selectedType.push(this.typePair[0]);
   

    }
    // console.log("type", selectedType);


  }


  filterReportData() {
    console.log("this.searchBy", this.searchBy);

    let sector = this.searchBy.sector ? this.searchBy.sector.name : "";
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id.toString() : "";
    let projectId = this.searchBy.ca ? this.searchBy.ca.id.toString() : "";
    let reportName = this.searchBy.text ? this.searchBy.text : "";

    this.reportProxy.getPdfDataAndFilter(ndcId, projectId, sector, reportName).subscribe((a) => {
      console.log(a);
      this.pdfFiles = a
    })


  }



  loadgridData = (event: LazyLoadEvent) => {
    // console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;



    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let countryId = this.searchBy.countryId ? this.searchBy.country.id : 0;
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    let projectId = this.searchBy.ca ? this.searchBy.ca.id : 0;
    let type = this.searchBy.type ? this.searchBy?.type.type : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = 1;
    let rows = 10;

    setTimeout(() => {
      // console.log('type selected', type);
      this.reportProxy
        .getReportInfo(
          pageNumber,
          rows,
          filtertext,
          countryId, // need to be added
          sectorId,
          ndcId,
          projectId,
          type
        )
        .subscribe((a) => {
          this.reports = a.items;
          // console.log('reports...',this.reports);
          this.totalRecords = a.meta.totalRecords;
          this.loading = false;
        });
    }, 1);
  };


  // loadPdfFiles() {
  //   this.reportProxy.getAllPdfFiles().subscribe((a) => {
  //     console.log("==== files=====", a);
  //     this.pdfFiles = a
  //   })
  // }

  onStatusChange(event: any) {
    this.onSearch();
  }
  onNdcChange(event: any) {
    this.onSearch();
  }
  onCAChange(event: any) {
    this.onSearch();
  }
  onTypeChange(event: any) {
    this.onSearch();
  }

  generate() {
    this.display = true;
  }

  onSectorChange(sectors: Sector[]) {
    console.log("=============",sectors)
    // let sectorFilter: string[] = new Array();
    this.sectorIdList = sectors.length == 0 ? ['0', ''] : ['0']
    for (let a = 0; a < sectors.length; a++) {
      this.sectorIdList.push(sectors[a]?.id + '');
    }
    console.log('id....', this.sectorIdList);

    // console.log('sectorFilter',this.sectorFilter);

    // this.serviceProxy
    //   .getManyBaseNdcControllerNdc(
    //     undefined,
    //     undefined,
    //     undefined,
    //     this.sectorFilter,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    this.ndcProxy.getDateRequest(0, 0, this.sectorIdList)
      .subscribe((res: any) => {
        this.selectedNdc1 = res.items;
        console.log('selectedNdc111111111', this.selectedNdc1);
      });
  }

  onClimateActionChange() {
    this.uniquePopYrList=[];
    this.yrIdList=[];
    // console.log('this.uniquePopYrList...', this.selectedproject);
    this.selectedYr=[];
    for (let a = 0; a < this.selectedproject.length; a++) {
      for (let b = 0; b < this.selectedproject[a].assessments.length; b++) {
        if (
          this.yrIdList.indexOf(this.selectedproject[a]?.assessments[b]?.id) ==
          -1
        ) {
          this.yrIdList.push(this.selectedproject[a]?.assessments[b]?.id);
        }
      }
    }

    // console.log('onClimateActionChange', this.yrIdList);
    this.assessmentYrFilter = [];
    this.popUpYrList = [];
    console.log('this.uniquePopYrList...', this.popUpYrList);
    this.assessmentYrFilter.push('assessment.id||$in||' + this.yrIdList)&
    this.assessmentYrFilter.push('verificationStatus||$eq||' + 7);
    // console.log('assessmentId', this.assessmentYrFilter);

   if(this.yrIdList.length>0){ this.serviceProxy
      .getManyBaseAssessmentYearControllerAssessmentYear(
        undefined,
        undefined,
        this.assessmentYrFilter,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.popUpYrList = res.data;
        this.uniquePopYrList = [...new Map(this.popUpYrList.map(item => [item.assessmentYear, item])).values()];
        console.log('this.uniquePopYrList...', this.popUpYrList);
        this.uniquePopYrList.sort(function (a, b) {
          return a.assessmentYear - b.assessmentYear
        })
        //console.log('pop up yrs...', this.popUpYrList);
      });}
  }
 
  onselectedNdcChange(ndc: Ndc[]) {
    this.popUpProject=[];
    this.selectedproject=[];
    this.uniquePopYrList=[];
    this.selectedYr=[];
    this.ndcIdList=[];
    let ndcFilter:string[]=[]
    if(ndc.length>0){
      for (let a = 0; a < ndc.length; a++) {
        this.ndcIdList.push(ndc[a].id);
      }
      ndcFilter.push('ndc.id||$in||' + this.ndcIdList);
     
      this.serviceProxy
        .getManyBaseProjectControllerProject(
          undefined,
          undefined,
          undefined,
          ndcFilter,
          ['editedOn,DESC'],
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.popUpProject = res.data;
          console.log('this.popUpProject', this.popUpProject);
          for (let c = 0; c < this.popUpProject.length; c++) {
            if (this.popUpProject[c]?.assessments.length !== 0) {
              // console.log('not null projects',this.popUpProject[c]);
              for (let a = 0; a < this.popUpProject[c]?.assessments.length; a++) {
                if (
                  !this.popUpAssessmentList.includes(
                    this.popUpProject[c]?.assessments[a]
                  )
                ) {
                  this.popUpAssessmentList.push(
                    this.popUpProject[c]?.assessments[a]
                  );
                  // console.log('finale assessments',this.popUpAssessmentList);
                }
              }
            }
          }
          // for (let a = 0; a < this.popUpAssessmentList.length; a++) {
          //   this.yrIdList.push(this.popUpAssessmentList[a]?.id);
          // }
          // this.assessmentYrFilter.push('assessment.id||$in||' + this.yrIdList);
          // console.log('assessmentId', this.assessmentYrFilter);
  
          // this.serviceProxy
          //   .getManyBaseAssessmentYearControllerAssessmentYear(
          //     undefined,
          //     undefined,
          //     undefined,
          //     this.assessmentYrFilter,
          //     ['editedOn,DESC'],
          //     undefined,
          //     1000,
          //     0,
          //     0,
          //     0
          //   )
          //   .subscribe((res: any) => {
          //     this.popUpYrList = res.data;
          //     // console.log('pop up yrs...',this.popUpYrList);
          //   });
        });
    }
    
  }

  publish(reportName: string) {
    // console.log('i am called');
    // this.displayButton = true;
    // console.log('ID of report',reportName);
    this.display1 = true;
    this.reportLoading(1);
    // this.serviceProxy
    // .getOneBaseReportControllerReport(
    //   1,
    //   undefined,
    //   undefined,
    //   reportId,
    // ).subscribe((res)=>{
    //   this.report = res;
    //   console.log('Name of report',this.report);
    //   this.reportName = this.report.reportName;

    // }
    // )
  }
  confirm() {
    // let projIds: string[] = [];
    // let assessType: string[] = [];
    // let yearIds: string[] = [];
   this.summeryReport = new ExcecutiveSummeryReport();
   this.summeryReport.selectAllSectors=this.allSelect
    //Sector
    for (let index = 0; index < this.selectedSector.length; index++) {
      const element = this.selectedSector[index].name;
      
      this.summeryReport.sectorIds.push(this.selectedSector[index].id);
      this.summeryReport.sectors.push(element);
    }
    //Projects - climate Actions
    
    for (let index = 0; index < this.selectedproject.length; index++) {
     
      const element = this.selectedproject[index];
      this.summeryReport.country = element.country.name;
      this.summeryReport.projIds.push(element.id.toString());
      if (this.selectedproject[index].climateActionName) {
        // this.summeryReport.projects.push(
        //   this.selectedproject[index].climateActionName
        // );

        if (this.summeryReport.climateActionIds.indexOf(this.selectedproject[index].id) == -1) {
          if (this.selectedproject[index].id) {
            this.summeryReport.climateActionIds.push(
              this.selectedproject[index].id
            );
          }
        }


      }
    }

   
    //Assessment Types
    this.summeryReport.macAssecmentType = []
    this.summeryReport.assessType = []
    for (let index = 0; index < this.selecetedType.length; index++) {
      const element = this.selecetedType[index];
      //this.summeryReport.assessType.push(`'` + element.type.toString() + `'`);

      if (element.id == 1 || element.id == 2) {
        if (
          this.summeryReport.assessType.indexOf(element.value.toString()) == -1
        ) {
          this.summeryReport.assessType.push(
            `'` + element.value.toString() + `'`
          );
        }

      }
      if (element.id == 3 || element.id == 4) {
        this.summeryReport.assessType.push(
          `'MAC'`
        );
        this.summeryReport.macAssecmentType.push(
          `'` + element.value.toString() + `'`
        )
      }

      //this.summeryReport.types.push(element.type.toString());
    }

    console.log("====this.selectedYr====", this.selectedYr);

    // Year list
    for (let index = 0; index < this.selectedYr.length; index++) {
      const element = this.selectedYr[index];
      for (let x = 0; x < this.popUpYrList.length; x++) {
        if (this.popUpYrList[x].assessmentYear == element.assessmentYear) {
          this.summeryReport.yearIds.push(this.popUpYrList[x].id.toString());

        }
      }


      if (this.selectedYr[index].assessmentYear) {
        if (
          this.summeryReport.years.indexOf(
            Number(this.selectedYr[index].assessmentYear)
          ) == -1
        ) {
          this.summeryReport.years.push(
            Number(this.selectedYr[index].assessmentYear)
          );
        }
      }
    }

    // console.log('projIds', projIds.toString());
    // console.log('selecetedType', assessType.toString());
    // console.log('yearIds', yearIds.toString());

    //  this.assessmentYearProxy
    //    .getDataForReport(
    //      projIds.toString(),
    //       assessType.toString(),
    //       yearIds.toString()
    //     )
    //   .subscribe((res: any) => {
    //    this.summeryReport.executiveSummery = res;
    this.summeryReport.reportName = this.reportName;
    // this.router.navigate(['/final-report', JSON.stringify(this.summeryReport)]);

    const url = `/final-report/${encodeURI(
      JSON.stringify(this.summeryReport)
    )}`;

    console.log('this.summeryReport', this.summeryReport);
    console.log('url', url);
    // this.router.navigate([
    //   '/final-report/',
    //   JSON.stringify(this.summeryReport),
    // ]);

    window.open(url, '_blank');

    // console.log('url', url);
    // });

    // console.log('selected Sector', this.selectedSector);
    // console.log('selected Ndc', this.selectedNdc);
    // console.log('selected project', this.selectedproject);
    console.log('seleceted Type', this.selecetedType);
    console.log('selected Yr=====', this.selectedYr);
    // console.log('reportName', this.reportName);

    // // let report = new Report();
    // for (let a = 0; a < this.selectedproject.length; a++) {
    //   this.reportDtoSend.project.push(this.selectedproject[a]);
    // }

    // let array: String[] = [];
    // for (const a of this.selecetedType) {
    //   // console.log('type........',a);
    //   if (a[0] !== null) {
    //     if (!this.reportDtoSend.assessmentTypeList.includes('Ex-Post')) {
    //       this.reportDtoSend.assessmentTypeList.push('Ex-Post');
    //     }
    //   }
    //   if (a[1] !== null) {
    //     if (!this.reportDtoSend.assessmentTypeList.includes('Ex-Ante')) {
    //       this.reportDtoSend.assessmentTypeList.push('Ex-Ante');
    //     }
    //   }
    //   if (a[2] !== null) {
    //     if (!this.reportDtoSend.assessmentTypeList.includes('MAC')) {
    //       this.reportDtoSend.assessmentTypeList.push('MAC');
    //     }
    //   }
    // }

    // for (let c = 0; c < this.selectedYr.length; c++) {
    //   this.reportDtoSend.assessmentYrList.push(
    //     this.selectedYr[c].assessmentYear
    //   );
    //   // console.log('yrrrr',this.selectedYr[c].assessmentYear);
    // }

    // this.reportDtoSend.reportName = this.reportName;

    // console.log('repost dto to send', this.reportDtoSend);

    // this.reportProxy
    //   .getFinalReportDetails(this.reportDtoSend)
    //   .subscribe((res: any) => {
    //     console.log('res...', res);
    //     this.reportResponse = res.data;

    //     this.router.navigate(['/final-report', JSON.stringify(res)]);

    //     // this.router.navigate(['/final-report'],{
    //     //   queryParams: { object: res }
    //     // })

    //     // this.finalComponet.fromParent(res)
    //   });

    // query oarams balanna

    // this.serviceProxy
    // .createOneBaseReportControllerReport(

    // )
  }

  async confirmPDF() {
    // let projIds: string[] = [];
    // let assessType: string[] = [];
    // let yearIds: string[] = [];

    //Sector

    this.summeryReportPDF.selectAllSectors=this.allSelect;
    for (let index = 0; index < this.selectedSector.length; index++) {
      const element = this.selectedSector[index].name;
      if (this.summeryReportPDF.sectors.indexOf(element) == -1) {
        
        this.summeryReportPDF.sectorIds.push(this.selectedSector[index].id);
        this.summeryReportPDF.sectors.push(element);
      }
    }
    //Projects - climate Actions

    this.summeryReportPDF.projIds = []

    for (let index = 0; index < this.selectedproject.length; index++) {
      const element = this.selectedproject[index];
      this.summeryReportPDF.country = element.country.name;

      if (this.summeryReportPDF.projIds.indexOf(element.id.toString()) == -1) {
        this.summeryReportPDF.projIds.push(element.id.toString());
      }
    }


    // NDC ID
    this.summeryReportPDF.ndcIdList = []

    for (let index = 0; index < this.ndcIdList.length; index++) {
      const element = this.ndcIdList[index];
      console.log("==== ele ndcid +++++", element);
      if (this.summeryReportPDF.ndcIdList.indexOf(element.toString()) == -1) {
        this.summeryReportPDF.ndcIdList.push(element.toString());
      }
    }


    //Assessment Types
    this.summeryReportPDF.macAssecmentType = []
    this.summeryReportPDF.assessType = []

    console.log(' this.selecetedType', this.selecetedType);
    for (let index = 0; index < this.selecetedType.length; index++) {
      const element = this.selecetedType[index];
      if (element.id == 1 || element.id == 2) {
        if (
          this.summeryReportPDF.assessType.indexOf(element.value.toString()) == -1
        ) {
          this.summeryReportPDF.assessType.push(
            `'` + element.value.toString() + `'`
          );
        }

      }
      if (element.id == 3 || element.id == 4) {
        this.summeryReportPDF.assessType.push(
          `'MAC'`
        );
        this.summeryReportPDF.macAssecmentType.push(
          `'` + element.value.toString() + `'`
        )
      }
    }

    // Year list
    for (let index = 0; index < this.selectedYr.length; index++) {
      const element = this.selectedYr[index];
      for (let x = 0; x < this.popUpYrList.length; x++) {
        if (this.popUpYrList[x].assessmentYear == element.assessmentYear) {
          this.summeryReportPDF.yearIds.push(this.popUpYrList[x].id.toString());

        }
      }


      if (this.selectedYr[index].assessmentYear) {
        if (
          this.summeryReportPDF.years.indexOf(
            Number(this.selectedYr[index].assessmentYear)
          ) == -1
        ) {
          this.summeryReportPDF.years.push(
            Number(this.selectedYr[index].assessmentYear)
          );
        }
      }
    }

    this.summeryReportPDF.reportName = this.reportName;
    // debugger;
    let res: any;
    console.log('summeryReportPDF', this.summeryReportPDF);
    res = await this.reportProxy
      .getReportPDF(this.summeryReportPDF)
      .toPromise()

    // this.userName = localStorage.getItem('user_name')!;

    const token = localStorage.getItem('access_token')!;

    const currentUser = decode<any>(token);


    this.reportPdfFile.sectorName = this.summeryReportPDF.sectors.toString();
    this.reportPdfFile.ndcName = this.summeryReportPDF.ndcIdList.toString();
    this.reportPdfFile.climateAction = this.summeryReportPDF.projIds.toString();
    this.reportPdfFile.reportName = this.summeryReportPDF.reportName;
    this.reportPdfFile.countryId = currentUser.countryId;
    this.reportPdfFile.assesmentType = this.summeryReportPDF.assessType.toString();
    this.reportPdfFile.generateReportName = res.fileName

    console.log("========= reportPdfFile +++++++++++", this.reportPdfFile);

    let resultPdfData = await this.reportProxy.getReportPdfFileData(this.reportPdfFile).subscribe((a) => {
      console.log(a);

    })
    console.log("==== %%%  +++++", resultPdfData);




    let url = environment.baseUrlAPI + `/${res.fileName}`;
    window.open(url, '_blank');

    this.filterReportData()
  }
}

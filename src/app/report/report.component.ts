import { environment } from './../../environments/environment';
import {
  NdcControllerServiceProxy,
  ProjectControllerServiceProxy,
  ReportDataPDF,
  ReportPdfInsert,
  SectorControllerServiceProxy,
} from './../../shared/service-proxies/service-proxies';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import { debounceTime, filter } from 'rxjs/operators';
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
import { Subject, Subscription } from 'rxjs';
// import { FinalReportComponent } from './final-report/final-report.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {
  test = 'test';

  reports: Report[];
  sectorList: Sector[] = [];
  ndcList: Ndc[] = [];
  climateActionList: Project[] = [];
  assessmentList: Assessment[] = [];
  assessmentYrList: AssessmentYear[] = [];
  typeList: string[] = [];
  typePair: any;
  userId: number;
  isShown = true;
  display = false;
  display1 = false;

  sectorListSelection: Sector[] = [];
  selectedSector: Sector[] = [];
  selectedNdc: Ndc[];
  selectedNdc1: Ndc[];
  selectedproject: Project[];
  selecetedType: any[];
  selectedYr: AssessmentYear[];
  sectors: Sector[];

  sectorIdList: string[] = [];
  ndcIdList: number[] = [];
  yrIdList: number[] = [];
  popUpProject: Project[] = [];
  popUpAssessmentList: Assessment[] = [];
  popUpYrList: AssessmentYear[] = [];
  uniquePopYrList: any[] = [];
  setUniquePopYrList: any[] = [];
  setPopYrList: any[] = [];
  yearsArray: any[] = [];
  yearsFilterArray: any[] = [];
  pdfFiles: any[] = [];

  report: Report = new Report();
  reportName: string;
  reportName1 = '';
  description = '';

  reportPdfFile = new ReportPdfInsert();
  sectorFilter: string[] = [];
  ndcFilter: string[] = [];
  assessmentYrFilter: string[] = [];

  displayButton = false;

  loading: boolean;
  totalRecords = 0;
  rows = 10;
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
  spin:boolean =false;

  searchBy: any = {
    sector: null,
    ndc: null,
    ca: null,
    type: null,
    text: null,
    countryId: null,
  };
  sectorSubscription: Subscription;
  dataReqSubscription: Subscription;
  csiSubscription: Subscription;
  assessmentSubcription: Subscription;
  yearSubscription: Subscription;
  private requestTrigger: Subject<void> = new Subject<void>();
  mainSubscription: Subscription;

  constructor(
    private serviceProxy: ServiceProxy,
    private reportProxy: ReportControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private ndcProxy: NdcControllerServiceProxy,
    private cilmateProxy: ProjectControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
  ) { }

  ngOnDestroy(): void {
    this.mainSubscription.unsubscribe() // destroy method when loading another component
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    this.mainSubscription = this.requestTrigger
    .pipe(debounceTime(1000)) // Adjust the debounce time (in milliseconds) as per your requirements
    .subscribe(() => {
      if(tokenPayload.sectorId){   //because this page only shows CA,SA,MRV,TT.this also can be don by using user roles from tocken
      this.isCountryLevel=false;
      this.serviceProxy.getOneBaseSectorControllerSector(tokenPayload.sectorId,undefined,undefined,undefined)
      .subscribe(res=>{
        this.selectedSector.push(res);
      this.onSectorChange( this.selectedSector);
  
      })
  
      }
  
      this.dataCollectionGhgModuleStatus =tokenPayload.moduleLevels[4];
  
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
      });
      this.ndcProxy.getDateRequest(0, 0, [])
        .subscribe((res: any) => {
          this.ndcList = res.items;
        });
  
      this.cilmateProxy.getProjectsForCountrySectorInstitution(0, 0, 0, [], 0, 0)
        .subscribe((res: any) => {
          this.climateActionList = res.items;
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
  
    })  
    this.requestTrigger.next()

  }

  reportLoading(reportId: number) {
    this.serviceProxy
      .getOneBaseReportControllerReport(reportId, undefined, undefined, 0)
      .subscribe((res) => {
        this.report = res;

        this.reportName1 = res.reportName;

        this.description = res.description;
      });
  }

  onSearch() {
    const event: any = {};
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
    }
  }
  onselectedAssessmentType(selectedType:any){
    if(selectedType.includes(this.typePair[3])&&!selectedType.includes(this.typePair[1])){
      
      selectedType.push(this.typePair[1]);
     
    }
    if(selectedType.includes(this.typePair[2])&&!selectedType.includes(this.typePair[0])){
     
      selectedType.push(this.typePair[0]);
    }
  }


  filterReportData() {
    let sector = this.searchBy.sector ? this.searchBy.sector.name : "";
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id.toString() : "";
    let projectId = this.searchBy.ca ? this.searchBy.ca.id.toString() : "";
    let reportName = this.searchBy.text ? this.searchBy.text : "";

    this.dataReqSubscription = this.reportProxy.getPdfDataAndFilter(ndcId, projectId, sector, reportName).subscribe((a) => {
      this.pdfFiles = a
    })


  }

  loadgridData = (event: LazyLoadEvent) => {
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
      this.reportProxy
        .getReportInfo(
          pageNumber,
          rows,
          filtertext,
          countryId,
          sectorId,
          ndcId,
          projectId,
          type,
        )
        .subscribe((a) => {
          this.reports = a.items;

          this.totalRecords = a.meta.totalRecords;
          this.loading = false;
        });
    }, 1);
  };

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
    this.sectorIdList = sectors.length == 0 ? ['0', ''] : ['0'];
    for (let a = 0; a < sectors.length; a++) {
      this.sectorIdList.push(sectors[a]?.id + '');
    }

    this.ndcProxy
      .getDateRequest(0, 0, this.sectorIdList)
      .subscribe((res: any) => {
        this.selectedNdc1 = res.items;
      });
  }

  onClimateActionChange() {
    this.uniquePopYrList = [];
    this.yrIdList = [];

    this.selectedYr = [];
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

    this.assessmentYrFilter = [];
    this.popUpYrList = [];

    this.assessmentYrFilter.push('assessment.id||$in||' + this.yrIdList) &
      this.assessmentYrFilter.push('verificationStatus||$eq||' + 7);

    if (this.yrIdList.length > 0) {
      this.serviceProxy
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
          0,
        )
        .subscribe((res: any) => {
          this.popUpYrList = res.data;
          this.uniquePopYrList = [
            ...new Map(
              this.popUpYrList.map((item) => [item.assessmentYear, item]),
            ).values(),
          ];

          this.uniquePopYrList.sort(function (a, b) {
            return a.assessmentYear - b.assessmentYear;
          });
        });
    }
  }

  onselectedNdcChange(ndc: Ndc[]) {
    this.spin =true
    this.popUpProject = [];
    this.selectedproject = [];
    this.uniquePopYrList = [];
    this.selectedYr = [];
    this.ndcIdList = [];
    const ndcFilter: string[] = [];
    if (ndc.length > 0) {
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
          0,
        )
        .subscribe((res: any) => {
          this.popUpProject = res.data;

          for (let c = 0; c < this.popUpProject.length; c++) {
            if (this.popUpProject[c]?.assessments.length !== 0) {
              for (
                let a = 0;
                a < this.popUpProject[c]?.assessments.length;
                a++
              ) {
                if (
                  !this.popUpAssessmentList.includes(
                    this.popUpProject[c]?.assessments[a],
                  )
                ) {
                  this.popUpAssessmentList.push(
                    this.popUpProject[c]?.assessments[a],
                  );
                }
              }
            }
          }
          this.spin=false
        });
    }
    
  }

  publish(reportName: string) {
    this.display1 = true;
    this.reportLoading(1);
  }
  
  confirm() {
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
        if (
          this.summeryReport.climateActionIds.indexOf(
            this.selectedproject[index].id,
          ) == -1
        ) {
          if (this.selectedproject[index].id) {
            this.summeryReport.climateActionIds.push(
              this.selectedproject[index].id,
            );
          }
        }
      }
    }

    this.summeryReport.macAssecmentType = [];
    this.summeryReport.assessType = [];
    for (let index = 0; index < this.selecetedType.length; index++) {
      const element = this.selecetedType[index];

      if (element.id == 1 || element.id == 2) {
        if (
          this.summeryReport.assessType.indexOf(element.value.toString()) == -1
        ) {
          this.summeryReport.assessType.push(
            `'` + element.value.toString() + `'`,
          );
        }
      }
      if (element.id == 3 || element.id == 4) {
        this.summeryReport.assessType.push(`'MAC'`);
        this.summeryReport.macAssecmentType.push(
          `'` + element.value.toString() + `'`,
        );
      }
    }

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
            Number(this.selectedYr[index].assessmentYear),
          ) == -1
        ) {
          this.summeryReport.years.push(
            Number(this.selectedYr[index].assessmentYear),
          );
        }
      }
    }

    this.summeryReport.reportName = this.reportName;

    const url = `/final-report/${encodeURI(
      JSON.stringify(this.summeryReport),
    )}`;

    window.open(url, '_blank');
  }

  async confirmPDF() {
    this.summeryReportPDF.selectAllSectors = this.allSelect;
    for (let index = 0; index < this.selectedSector.length; index++) {
      const element = this.selectedSector[index].name;
      if (this.summeryReportPDF.sectors.indexOf(element) == -1) {
        this.summeryReportPDF.sectorIds.push(this.selectedSector[index].id);
        this.summeryReportPDF.sectors.push(element);
      }
    }

    this.summeryReportPDF.projIds = [];

    for (let index = 0; index < this.selectedproject.length; index++) {
      const element = this.selectedproject[index];
      this.summeryReportPDF.country = element.country.name;

      if (this.summeryReportPDF.projIds.indexOf(element.id.toString()) == -1) {
        this.summeryReportPDF.projIds.push(element.id.toString());
      }
    }

    this.summeryReportPDF.ndcIdList = [];

    for (let index = 0; index < this.ndcIdList.length; index++) {
      const element = this.ndcIdList[index];

      if (this.summeryReportPDF.ndcIdList.indexOf(element.toString()) == -1) {
        this.summeryReportPDF.ndcIdList.push(element.toString());
      }
    }

    this.summeryReportPDF.macAssecmentType = [];
    this.summeryReportPDF.assessType = [];

    for (let index = 0; index < this.selecetedType.length; index++) {
      const element = this.selecetedType[index];
      if (element.id == 1 || element.id == 2) {
        if (
          this.summeryReportPDF.assessType.indexOf(element.value.toString()) ==
          -1
        ) {
          this.summeryReportPDF.assessType.push(
            `'` + element.value.toString() + `'`,
          );
        }
      }
      if (element.id == 3 || element.id == 4) {
        this.summeryReportPDF.assessType.push(`'MAC'`);
        this.summeryReportPDF.macAssecmentType.push(
          `'` + element.value.toString() + `'`,
        );
      }
    }

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
            Number(this.selectedYr[index].assessmentYear),
          ) == -1
        ) {
          this.summeryReportPDF.years.push(
            Number(this.selectedYr[index].assessmentYear),
          );
        }
      }
    }

    this.summeryReportPDF.reportName = this.reportName;
    let res: any;

    res = await this.reportProxy
      .getReportPDF(this.summeryReportPDF)
      .toPromise();

    const token = localStorage.getItem('access_token')!;

    const currentUser = decode<any>(token);

    this.reportPdfFile.sectorName = this.summeryReportPDF.sectors.toString();
    this.reportPdfFile.ndcName = this.summeryReportPDF.ndcIdList.toString();
    this.reportPdfFile.climateAction = this.summeryReportPDF.projIds.toString();
    this.reportPdfFile.reportName = this.summeryReportPDF.reportName;
    this.reportPdfFile.countryId = currentUser.countryId;
    this.reportPdfFile.assessmentType = this.summeryReportPDF.assessType.toString();
    this.reportPdfFile.generateReportName = res.fileName

    let resultPdfData = await this.reportProxy.getReportPdfFileData(this.reportPdfFile).subscribe((a) => {
      this.spin=false;
      let url = environment.baseUrlAPI + `/document/downloadReport/${ res.fileName }`;
      window.open(url, '_blank');
      this.filterReportData()
    })
   
  }
}

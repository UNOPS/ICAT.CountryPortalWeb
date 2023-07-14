import { HostListener, Component, OnInit, NgModule } from '@angular/core';
import { LazyLoadEvent, PrimeNGConfig, MessageService } from 'primeng/api';
import { from, Subject, Subscription } from 'rxjs';
import {
  AssessmentControllerServiceProxy,
  AssessmentResultControllerServiceProxy,
  AssessmentResult,
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  EmissionReductioDraftDataEntity,
  EmissionReductionDraftdataControllerServiceProxy,
  Ndc,
  NdcControllerServiceProxy,
  Project,
  ProjectControllerServiceProxy,
  Sector,
  SectorControllerServiceProxy,
  ServiceProxy,
  SubNdc,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { environment } from 'environments/environment';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-ca-sa-dashboard',
  templateUrl: './ca-sa-dashboard.component.html',
  styleUrls: ['./ca-sa-dashboard.component.css'],
})
export class CASADashboardComponent implements OnInit {
  indtituteadmin = false;
  userType = 'countryAdmin';
  countryAdmin = false;
  data: any;
  activeprojects1 = ['vv', 'df', 'd', 'd'];
  loading: boolean;
  totalRecords = 0;
  rows = 5;
  last: number;
  event: any;
  subndcList: SubNdc[] = [];
  ndcList: Ndc[] = [];
  chartOptions: any;
  searchBy: any = {
    sector: 0,
    ndc: 0,
    subndc: 0,
  };

  searchBy1: any = {
    sector: 0,
  }
  sector: Sector;
  sectorList: Sector[] = [];
  subscription: Subscription;
  public i: number = 0;
  public id: string = 'chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items: any = [];
  data1: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; }[]; };
  ind: number = 1;
  countryId: number;
  sectorId: number;
  projects: Project[];
  proposedProjectsCount: number = 0;
  underConstructionCount: number = 0;
  operationalProjectsCount: number = 0;
  projectID: number = 0;
  emissionReduction: EmissionReductioDraftDataEntity = new EmissionReductioDraftDataEntity();
  ndcprojectset = new Map<string, number>();
  horizontalOptions: any;

  showName: boolean = false;
  basicData: any;

  basicOptions: any;
  project: number[] = [];
  projectemreduct: number[] = [];
  activps: Project[] = [];
  ndctotalemission: number[] = [];
  totalemission: number = 0;
  em: number[] = [];
  ndcname: string[] = [];
  ndcnameForChart: string[] = []
  ndcnameForChart2: number[] = []
  totalem: number = 0;
  lineStylesData: any;
  total: number;
  num: number[] = [];
  emi: number[] = [];
  prnames: string[] = [];
  ndcprojectdetails: ndcdetails[] = [];
  datandc: ndcdetails;




  assessmetYr: AssessmentYear[] = new Array();
  assessmentListId: number[] = new Array();
  yrGap: number;
  newYr: number;
  yrList: number[] = new Array();
  yrListGraph: string[] = new Array();
  postYrList: number[] = new Array();
  postresaultList: number[] = new Array();
  postIdLisst: number[] = new Array();
  cliamteActionsBySector: Project[];
  assessmenResulytList: AssessmentResult[];
  actualValLst: number[] = new Array();
  unconValLst: number[] = new Array();
  conValLst: number[] = new Array();
  bauValLst: number[] = new Array();
  currentYear: number = (new Date()).getFullYear();

  isNDCdata: boolean = false;

  responsiveOptions: any;

  screenWidth: number;
  moduleLevel: number[];
  emissionReducSubscription: Subscription;
  requestTriggerEmissionReduction: Subject<void> = new Subject<void>();
  private aySubscription: Subscription;
  private requestTrigger: Subject<void> = new Subject<void>();
  delayTime = 1000



  constructor(private primengConfig: PrimeNGConfig,
    private emmissionProxy: EmissionReductionDraftdataControllerServiceProxy,
    private serviceproxy: ServiceProxy,
    private assesmentserviceproxy: AssessmentControllerServiceProxy,
    private assesmentResultserviceproxy: AssessmentResultControllerServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy,
    private ndcserviceproxy: NdcControllerServiceProxy,
    private asseyearproxy: AssessmentYearControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private messageService: MessageService) {
    this.getScreenSize();
    this.chartOptions = {
      responsive: true,
    }
    this.data = {
      labels: [
        "Data not available"
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [360],
        backgroundColor: [

          'rgb(54, 162, 235)',
        ],
        hoverOffset: 4
      }]
    };

    let s = new String("23")

    this.horizontalOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: { chart: { _metasets: any; }; dataset: { label: string; }; parsed: { y: number | bigint | null; }; dataIndex: number; raw: number; }) {
              return ['Aggregated Actions : ' + context.dataset.label[context.dataIndex],
              'Total emission :  ' + context.raw
              ];
            }
          }
        },
        title: {
          display: true,
          text: 'Aggregated Actions Achievements',

          font: {
            size: 24
          }
        },
        legend: {
          display: false,
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Aggregated Actions',
            font: {
              size: 12
            }
          },
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Emissions reduction (tCO' + '\u2082' + 'e)',
            font: {
              size: 12
            }
          },
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

  }
  ngOnDestroy(): void {
    if (this.aySubscription) this.aySubscription.unsubscribe()
    if (this.emissionReducSubscription) this.emissionReducSubscription.unsubscribe()
  }
  ndcids = new Set<number>();
  ndcem = new Map();
  data3: number[] = [];

  unconditionalValue: number;
  conditionalValue: number;

  activeprojects: activeproject[] = [];
  activeprojectson: activeproject[] = [];
  activeprojectsload: activeproject[] = [];
  ndcemMap = new Map();
  t: any = {};

  isCountryAdmin: boolean = false;

  userName: String;

  macGrapsForPosts: string[][] = [];
  macGrapsForAntes: string[][] = [];
  ngOnInit(): void {

    this.climateactionserviceproxy.getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(0, 0, 0, ['1 ', '5'], 0, 0, environment.apiKey1)
      .subscribe((res => {

        this.projects = res.items;
        this.onSearch();
        for (let project of this.projects) {

          if (project.projectStatus.id == 1) this.proposedProjectsCount += 1;
          if (project.projectStatus.id == 2) this.underConstructionCount += 1;
          if (project.projectStatus.id == 3) this.operationalProjectsCount += 1;
        }

        this.data = {
          labels: ['Planned', 'Adopted', 'Implemented'],
          datasets: [
            {
              data: [this.proposedProjectsCount, this.underConstructionCount, this.operationalProjectsCount],
              backgroundColor: [
                "#89CFF0",
                "#0096FF",
                "#00008B"
              ],
              hoverBackgroundColor: [
                "#89CFF0",
                "#0096FF",
                "#00008B"
              ]
            }
          ]
        };

        let intest = 0;
        this.requestTriggerEmissionReduction.next()
        this.requestTrigger.next()
      }));

    this.aySubscription = this.requestTrigger
      .pipe(debounceTime(this.delayTime))
      .subscribe(() => {
        this.asseyearproxy.getAssessmentYearsForCountryAndSectorAdmins(1, 10000, 0, 0)
          .subscribe(req => {
            this.macGrapsForPosts = req;
            this.macGrapsForPosts.forEach((element, index) => {
              this.macGrapsForPosts[index] = [element[0], 'data:image/jpg;base64,' + element[1]]
            });

            this.asseyearproxy.getAssessmentYearsForCountryAndSectorAdmins(1, 10000, 0, 1)
              .subscribe(req => {
                this.macGrapsForAntes = req;
                this.macGrapsForAntes.forEach((element, index) => {
                  this.macGrapsForAntes[index] = [element[0], 'data:image/jpg;base64,' + element[1]]
                });
              });
          });
      })

    this.primengConfig.ripple = true;
    const token = localStorage.getItem('access_token')!;
    const currenyUser = decode<any>(token);
    this.userName = currenyUser.fname;
    this.countryId = currenyUser.countryId;
    this.moduleLevel = currenyUser.moduleLevels
    if (currenyUser.sectorId) {
      this.serviceproxy.getOneBaseSectorControllerSector(currenyUser.sectorId, undefined, undefined, undefined)
        .subscribe(res => {
          this.sector = res;
        });


    } else {
      this.isCountryAdmin = true;
      this.sectorProxy.getCountrySector(currenyUser.countryId).subscribe((res: any) => {
        for (let d of res) {
          this.sectorList.push(d)
        }
      });
    }

    this.onSearch1();
    this.emissionReducSubscription = this.requestTriggerEmissionReduction
      .pipe(debounceTime(this.delayTime))
      .subscribe(() => {
        this.emmissionProxy.getEmissionEeductionDraftDataForCountry()
          .subscribe(async (res: any) => {
            this.emissionReduction = res;
            this.configEmissionTargetGraph();
            this.unconditionalValue = this.emissionReduction.targetYearEmission - this.emissionReduction.unconditionaltco2;
            this.conditionalValue = this.emissionReduction.targetYearEmission - this.emissionReduction.conditionaltco2;
            this.yrGap = parseInt(this.emissionReduction.targetYear) - parseInt(this.emissionReduction.baseYear)
            for (let a = 0; a <= this.yrGap; a++) {
              this.newYr = parseInt(this.emissionReduction.baseYear) + a;
              this.yrList.push(this.newYr);
            };
            let yearlstLength = this.yrList.length - 1;

            for (let x = 0; x <= yearlstLength; x++) {

              let total = 0;

              let bauValue: number = ((this.emissionReduction.targetYearEmission - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission;
              this.conValLst.push(!this.emissionReduction.conditionaltco2 && this.emissionReduction.conditionaltco2 == 0 ? 0 : ((this.conditionalValue - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission);
              this.unconValLst.push(!this.emissionReduction.unconditionaltco2 && this.emissionReduction.unconditionaltco2 == 0 ? 0 : ((this.unconditionalValue - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission);
              this.bauValLst.push(bauValue);
              let res = await this.assesmentResultserviceproxy.getAssessmentResultforDashboard(this.yrList[x]).toPromise();
              this.assessmenResulytList = res

              for (let assementResult of this.assessmenResulytList) {
                total += assementResult.totalEmission ? Number(assementResult.totalEmission) : 0;
              }


              if (this.yrList[x] <= this.currentYear) { this.actualValLst.push(bauValue - (total / 1000000)); }
            }

            this.lineStylesData = {
              labels: this.yrList,

              datasets: [
                {
                  label: 'Actual',
                  data: this.actualValLst,
                  fill: false,
                  borderColor: '#533440',
                  tension: .4,
                  tooltip: {
                    callbacks: 'yes'
                  }

                }
                ,
                {
                  label: 'Aggregated Actions-Conditional',
                  data: this.conValLst,
                  fill: true,
                  borderColor: '#81B622',
                  tension: .4,
                  backgroundColor: '#81B622',
                  tooltip: {
                    callbacks: 'yes'
                  }

                },
                {
                  label: 'Aggregated Actions-Unconditional',
                  data: this.unconValLst,
                  fill: true,
                  tension: .4,
                  borderColor: '#FFDB58',
                  backgroundColor: '#FFDB58',
                  tooltip: {
                    callbacks: 'yes'
                  }
                },
                {
                  label: 'BAU',
                  data: this.bauValLst,
                  fill: true,
                  tension: .4,
                  borderColor: '#FFA726',
                  backgroundColor: '#FFA726',
                  tooltip: {
                    callbacks: 'yes'
                  }
                },


              ]
            };

            this.getNDC(0);
            if (this.userType == "countryAdmin") {
              this.countryAdmin = true;
            }
          })
      })
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: undefined) {
    this.screenWidth = window.innerWidth;
  }

  getNDC = (sectorID: number) => {
    this.ndcserviceproxy.ndcSectorDetailsDashboard(0, 0, sectorID)
      .subscribe((res => {
        for (let d of res.items) {
          this.ndcList.push(d)
          for (let s of d.subNdc) {
            if (s.name.length > 20) {
              s.name = s.name.substring(0, 32) + "..........."
            }
            this.subndcList.push(s)
          }
        }
      }))
  }

  configEmissionTargetGraph = () => {
    this.basicOptions = {

      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: { chart: { _metasets: any; }; dataset: { label: string; }; parsed: { y: number | bigint | null; }; dataIndex: number; raw: number; }) {
              let baulst = context.chart._metasets[3]._dataset.data;
              let label = context.dataset.label || '';

              if (label) {
                label += ' Emission : ';
              }
              if (context.parsed.y !== null) {
                label += Number(context.parsed.y).toFixed(2) + " MtCO₂e";
              }

              if (context.dataset.label == 'Actual') {
                let emissionReduction = "Emission Reduction : " + (baulst[context.dataIndex] - Number(context.parsed.y)).toFixed(2) + " MtCO₂e" + " (" + (((baulst[context.dataIndex] - Number(context.parsed.y)) / baulst[context.dataIndex]) * 100).toFixed(2) + "% of BAU Emission)";
                return [label, emissionReduction];
              }
              if (context.dataset.label == 'BAU') {
                return [label];
              }

              let prsntge = 'Emission reduction of ' + context.dataset.label + ' over BAU : ' + (((baulst[context.dataIndex] - context.raw) / baulst[context.dataIndex]) * 100).toFixed(2) + '%'
              return [label, prsntge];
            }
          }
        },

        title: {
          display: true,
          text: `Emission Reduction Targets of ${this.emissionReduction.sector ? this.emissionReduction.sector.name + " sector" : this.emissionReduction.country.name}`,

          font: {
            size: 24
          }
        },
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {

        x: {
          display: true,
          title: {
            display: true,
            text: 'Years',
            font: {
              size: 12
            }
          },
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Emissions (MtCO₂e)',
            font: {
              size: 12
            }
          },

          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;
    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    let subNdcId = this.searchBy.subndc ? this.searchBy.subndc.id : 0;
    let projectApprovalStatusId: string[] = [];
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 5 : event.rows;
    let filter1: string[] = new Array();
    if (this.moduleLevel[3] == 1 || this.moduleLevel[4] == 1) {
      projectApprovalStatusId = ['5'];
      filter1.push('isProposal||$eq||' + 0);
    } else if (this.moduleLevel[1] == 1 || this.moduleLevel[2] == 1) {

      projectApprovalStatusId = ['1', '4'];
      filter1.push('isProposal||$eq||' + 1);
    } else {
      projectApprovalStatusId = ['5'];
      filter1.push('isProposal||$eq||' + 0);
    }

    this.climateactionserviceproxy
      .getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
        pageNumber,
        this.rows,
        sectorId,
        projectApprovalStatusId,
        ndcId,
        subNdcId,
        environment.apiKey1)

      .subscribe((a) => {
        this.activeprojectsload = [];
        this.totalRecords = a.meta.totalItems;
        this.loading = false;

        for (let project of a.items) {
          let activeproject1: activeproject = {
            name: "",
            ertarget: 0,
            targetyear: '-',
            erarchievment: 0,
            archivmentyear: "-"
          };
          activeproject1.name = project.climateActionName;

          let filterAsses: string[] = new Array();
          filterAsses.push(...filter1)
          filterAsses.push('project.id||$eq||' + project.id);

          this.serviceproxy.getManyBaseAssessmentControllerAssessment(
            undefined,
            undefined,
            filterAsses,
            undefined,
            ['id,ASC'],
            undefined,
            1000,
            0,
            0,
            0
          ).subscribe((res => {
            let targettotalemission = 0;
            let tarchievmenttotalem = 0;
            let minyearante = "0";
            let maxyearante = "0";
            let minyearpost = "0";
            let maxyearpost = "0";
            if (res.data.length != 0) {
              for (let dt of res.data) {
                let sum = 0;
                for (let d of dt.assessmentResult) {
                  sum = sum + (d.totalEmission ? Number(d.totalEmission) : 0);
                }

                if (dt.assessmentType == 'Ex-ante') {
                  for (let year of dt.assessmentYear) {
                    if (Number(year.assessmentYear) > Number(maxyearante)) {
                      maxyearante = year.assessmentYear;
                    }
                    if (Number(minyearante) != 0 && Number(year.assessmentYear) < Number(minyearante)) {
                      minyearante = year.assessmentYear;
                    } else if (Number(minyearante) == 0) {
                      minyearante = year.assessmentYear;
                    }
                  }

                  targettotalemission = targettotalemission + sum;
                }
                if (dt.assessmentType == 'Ex-post') {
                  for (let year of dt.assessmentYear) {
                    if (Number(year.assessmentYear) > Number(maxyearpost)) {
                      maxyearpost = year.assessmentYear;
                    }
                    if (Number(minyearpost) != 0 && Number(year.assessmentYear) < Number(minyearpost)) {
                      minyearpost = year.assessmentYear;
                    } else if (Number(minyearpost) == 0) {
                      minyearpost = year.assessmentYear;
                    }
                  }

                  tarchievmenttotalem = tarchievmenttotalem + sum;
                }

              }
              activeproject1.erarchievment = tarchievmenttotalem;
              activeproject1.ertarget = targettotalemission;
              activeproject1.targetyear = minyearante + "-" + maxyearante;
              activeproject1.archivmentyear = minyearpost + "-" + maxyearpost;

            }

          }))

          this.activeprojectsload.push(activeproject1);

        }

        this.activeprojects = this.activeprojectsload;
      });
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }
  onsectorChange(event: any) {
    this.getNDC(this.searchBy.sector.id);
    this.onSearch();
  }

  onsectorChange1(event: any) {
    this.onSearch1();
  }
  onndcChange(event: any) {
    this.subndcList = [];
    this.subndcList = event.subNdc;
    this.onSearch();
  }
  onsubndcChange(event: any) {
    this.onSearch();
  }

  onSearch1() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData2(event);
  }

  testoneeeaa() {}

  loadgridData2 = (event: LazyLoadEvent) => {
    let sectorId = this.searchBy1.sector ? this.searchBy1.sector.id : 0;
    this.ndcserviceproxy
      .getNdcForDashboard(
        0,
        0,
        this.isCountryAdmin ? sectorId : 0,
      )
      .subscribe((a) => {
        let ndcNames: string[] = []
        let ndcReduction: number[] = []
        let xaxis: number[] = [];
        for (let ndc of a.items) {
          let totalemissionRduction: number = 0;
          for (let assement of ndc.assesment) {

            for (let assesrslt of assement.assessmentResult) {
              totalemissionRduction = totalemissionRduction + (assesrslt.totalEmission ? Number(assesrslt.totalEmission) : 0);
            }
          }
          if (totalemissionRduction != 0) {

            ndcNames.push(ndc.name);
            ndcReduction.push(totalemissionRduction);
            xaxis.push(ndcNames.length)
          }
        }
        this.isNDCdata = ndcNames.length > 0 ? true : false;
        this.basicData = {
          labels: xaxis,
          datasets: [
            {
              label: ndcNames,
              backgroundColor: '#42A5F5',
              data: ndcReduction
            },

          ]
        };

      });
  }
}

export interface activeproject {
  name: string,
  ertarget: number,
  targetyear: string,
  erarchievment: number,
  archivmentyear: string
};

export interface ndcdetails {
  name: string,
  cacount: number,

};

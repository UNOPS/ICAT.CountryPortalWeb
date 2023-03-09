import { HostListener, Component, OnInit, NgModule } from '@angular/core';
import { LazyLoadEvent, PrimeNGConfig, MessageService } from 'primeng/api';
import { from, Subscription } from 'rxjs';
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
  };
  sector: Sector;
  sectorList: Sector[] = [];
  subscription: Subscription;
  public i = 0;
  public id = 'chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items: any = [];
  data1: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
    }[];
  };
  ind = 1;
  countryId: number;
  sectorId: number;
  projects: Project[];
  proposedProjectsCount = 0;
  underConstructionCount = 0;
  operationalProjectsCount = 0;
  projectID = 0;
  emissionReduction: EmissionReductioDraftDataEntity = new EmissionReductioDraftDataEntity();
  ndcprojectset = new Map<string, number>();
  horizontalOptions: any;

  showName = false;
  basicData: any;
  basicOptions: any;
  project: number[] = [];
  projectemreduct: number[] = [];
  activps: Project[] = [];
  ndctotalemission: number[] = [];
  totalemission = 0;
  em: number[] = [];
  ndcname: string[] = [];
  ndcnameForChart: string[] = [];
  ndcnameForChart2: number[] = [];
  totalem = 0;
  lineStylesData: any;
  total: number;
  num: number[] = [];
  emi: number[] = [];
  prnames: string[] = [];
  ndcprojectdetails: ndcdetails[] = [];
  datandc: ndcdetails;

  assessmetYr: AssessmentYear[] = [];
  assessmentListId: number[] = [];
  yrGap: number;
  newYr: number;
  yrList: number[] = [];
  yrListGraph: string[] = [];
  postYrList: number[] = [];
  postresultList: number[] = [];
  postIdLisst: number[] = [];
  cliamteActionsBySector: Project[];
  assessmenResulytList: AssessmentResult[];
  actualValLst: number[] = [];
  unconValLst: number[] = [];
  conValLst: number[] = [];
  bauValLst: number[] = [];
  currentYear: number = new Date().getFullYear();

  isNDCdata = false;

  responsiveOptions: any;

  screenWidth: number;
  moduleLevel: number[];

  constructor(
    private primengConfig: PrimeNGConfig,
    private emmissionProxy: EmissionReductionDraftdataControllerServiceProxy,
    private serviceproxy: ServiceProxy,
    private assessmentserviceproxy: AssessmentControllerServiceProxy,
    private assessmentResultserviceproxy: AssessmentResultControllerServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy,
    private ndcserviceproxy: NdcControllerServiceProxy,
    private asseyearproxy: AssessmentYearControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private messageService: MessageService,
  ) {
    this.getScreenSize();
    this.chartOptions = {
      responsive: true,
    };
    this.data = {
      labels: ['Data not available'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [360],
          backgroundColor: ['rgb(54, 162, 235)'],
          hoverOffset: 4,
        },
      ],
    };

    this.horizontalOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: {
              chart: { _metasets: any };
              dataset: { label: string };
              parsed: { y: number | bigint | null };
              dataIndex: number;
              raw: number;
            }) {
              return [
                'Aggregated Actions : ' +
                  context.dataset.label[context.dataIndex],
                'Total emission :  ' + context.raw,
              ];
            },
          },
        },
        title: {
          display: true,
          text: 'Aggregated Actions Achievements',

          font: {
            size: 24,
          },
        },
        legend: {
          display: false,
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Aggregated Actions',
            font: {
              size: 12,
            },
          },
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Emissions reduction (tCO' + '\u2082' + 'e)',
            font: {
              size: 12,
            },
          },
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
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

  isCountryAdmin = false;

  userName: string;

  macGrapsForPosts: string[][] = [];
  macGrapsForAntes: string[][] = [];
  ngOnInit(): void {
    this.asseyearproxy
      .getAssessmentYearsForCountryAndSectorAdmins(1, 10000, 0, 0)
      .subscribe((req) => {
        this.macGrapsForPosts = req;

        this.macGrapsForPosts.forEach((element, index) => {
          this.macGrapsForPosts[index] = [
            element[0],
            'data:image/jpg;base64,' + element[1],
          ];
        });
      });

    this.asseyearproxy
      .getAssessmentYearsForCountryAndSectorAdmins(0, 0, 0, 1)
      .subscribe((req) => {
        this.macGrapsForAntes = req;

        this.macGrapsForAntes.forEach((element, index) => {
          this.macGrapsForAntes[index] = [
            element[0],
            'data:image/jpg;base64,' + element[1],
          ];
        });
      });

    this.primengConfig.ripple = true;
    const token = localStorage.getItem('access_token')!;
    const currenyUser = decode<any>(token);
    this.userName = currenyUser.fname;
    this.countryId = currenyUser.countryId;
    this.moduleLevel = currenyUser.moduleLevels;

    if (currenyUser.sectorId) {
      this.serviceproxy
        .getOneBaseSectorControllerSector(
          currenyUser.sectorId,
          undefined,
          undefined,
          undefined,
        )
        .subscribe((res) => {
          this.sector = res;
        });
    } else {
      this.isCountryAdmin = true;
      this.sectorProxy
        .getCountrySector(currenyUser.countryId)
        .subscribe((res: any) => {
          for (const d of res) {
            this.sectorList.push(d);
          }
        });
    }

    this.onSearch1();

    this.emmissionProxy
      .getEmissionEeductionDraftDataForCountry()
      .subscribe(async (res: any) => {
        this.emissionReduction = res;
        this.configEmissionTargetGraph();
        this.unconditionalValue =
          this.emissionReduction.targetYearEmission -
          this.emissionReduction.unconditionaltco2;
        this.conditionalValue =
          this.emissionReduction.targetYearEmission -
          this.emissionReduction.conditionaltco2;

        this.yrGap =
          parseInt(this.emissionReduction.targetYear) -
          parseInt(this.emissionReduction.baseYear);
        for (let a = 0; a <= this.yrGap; a++) {
          this.newYr = parseInt(this.emissionReduction.baseYear) + a;

          this.yrList.push(this.newYr);
        }
        const yearlstLength = this.yrList.length - 1;

        for (let x = 0; x <= yearlstLength; x++) {
          let total = 0;

          const bauValue: number =
            ((this.emissionReduction.targetYearEmission -
              this.emissionReduction.baseYearEmission) /
              yearlstLength) *
              x +
            this.emissionReduction.baseYearEmission;
          this.conValLst.push(
            !this.emissionReduction.conditionaltco2 &&
              this.emissionReduction.conditionaltco2 == 0
              ? 0
              : ((this.conditionalValue -
                  this.emissionReduction.baseYearEmission) /
                  yearlstLength) *
                  x +
                  this.emissionReduction.baseYearEmission,
          );
          this.unconValLst.push(
            !this.emissionReduction.unconditionaltco2 &&
              this.emissionReduction.unconditionaltco2 == 0
              ? 0
              : ((this.unconditionalValue -
                  this.emissionReduction.baseYearEmission) /
                  yearlstLength) *
                  x +
                  this.emissionReduction.baseYearEmission,
          );
          this.bauValLst.push(bauValue);

          const res = await this.assessmentResultserviceproxy
            .getAssessmentResultforDashboard(this.yrList[x])
            .toPromise();

          this.assessmenResulytList = res;

          for (const assessmentResult of this.assessmenResulytList) {
            total += assessmentResult.totalEmission
              ? Number(assessmentResult.totalEmission)
              : 0;
          }

          if (this.yrList[x] <= this.currentYear) {
            this.actualValLst.push(bauValue - total / 1000000);
          }
        }

        this.lineStylesData = {
          labels: this.yrList,

          datasets: [
            {
              label: 'Actual',
              data: this.actualValLst,
              fill: false,
              borderColor: '#533440',
              tension: 0.4,
              tooltip: {
                callbacks: 'yes',
              },
            },
            {
              label: 'Aggregated Actions-Conditional',
              data: this.conValLst,
              fill: true,
              borderColor: '#81B622',
              tension: 0.4,
              backgroundColor: '#81B622',
              tooltip: {
                callbacks: 'yes',
              },
            },
            {
              label: 'Aggregated Actions-Unconditional',
              data: this.unconValLst,
              fill: true,
              tension: 0.4,
              borderColor: '#FFDB58',
              backgroundColor: '#FFDB58',
              tooltip: {
                callbacks: 'yes',
              },
            },
            {
              label: 'BAU',
              data: this.bauValLst,
              fill: true,
              tension: 0.4,
              borderColor: '#FFA726',
              backgroundColor: '#FFA726',
              tooltip: {
                callbacks: 'yes',
              },
            },
          ],
        };

        this.climateactionserviceproxy
          .getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
            0,
            0,
            0,
            ['1 ', '5'],
            0,
            0,
            '1234',
          )
          .subscribe((res) => {
            this.projects = res.items;

            this.onSearch();
            for (const project of this.projects) {
              if (project.projectStatus.id == 1)
                this.proposedProjectsCount += 1;
              if (project.projectStatus.id == 2)
                this.underConstructionCount += 1;
              if (project.projectStatus.id == 3)
                this.operationalProjectsCount += 1;
            }

            this.data = {
              labels: ['Planned', 'Adopted', 'Implemented'],
              datasets: [
                {
                  data: [
                    this.proposedProjectsCount,
                    this.underConstructionCount,
                    this.operationalProjectsCount,
                  ],
                  backgroundColor: ['#89CFF0', '#0096FF', '#00008B'],
                  hoverBackgroundColor: ['#89CFF0', '#0096FF', '#00008B'],
                },
              ],
            };
          });

        this.getNDC(0);

        if (this.userType == 'countryAdmin') {
          this.countryAdmin = true;
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: undefined) {
    this.screenWidth = window.innerWidth;
  }

  getNDC = (sectorID: number) => {
    this.ndcserviceproxy
      .ndcSectorDetailsDashboard(0, 0, sectorID)
      .subscribe((res) => {
        for (const d of res.items) {
          this.ndcList.push(d);
          for (const s of d.subNdc) {
            if (s.name.length > 20) {
              s.name = s.name.substring(0, 32) + '...........';
            }

            this.subndcList.push(s);
          }
        }
      });
  };

  configEmissionTargetGraph = () => {
    this.basicOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: {
              chart: { _metasets: any };
              dataset: { label: string };
              parsed: { y: number | bigint | null };
              dataIndex: number;
              raw: number;
            }) {
              const baulst = context.chart._metasets[3]._dataset.data;
              let label = context.dataset.label || '';

              if (label) {
                label += ' Emission : ';
              }
              if (context.parsed.y !== null) {
                label += Number(context.parsed.y).toFixed(2) + ' MtCO₂e';
              }

              if (context.dataset.label == 'Actual') {
                const emissionReduction =
                  'Emission Reduction : ' +
                  (
                    baulst[context.dataIndex] - Number(context.parsed.y)
                  ).toFixed(2) +
                  ' MtCO₂e' +
                  ' (' +
                  (
                    ((baulst[context.dataIndex] - Number(context.parsed.y)) /
                      baulst[context.dataIndex]) *
                    100
                  ).toFixed(2) +
                  '% of BAU Emission)';
                return [label, emissionReduction];
              }
              if (context.dataset.label == 'BAU') {
                return [label];
              }

              const prsntge =
                'Emission reduction of ' +
                context.dataset.label +
                ' over BAU : ' +
                (
                  ((baulst[context.dataIndex] - context.raw) /
                    baulst[context.dataIndex]) *
                  100
                ).toFixed(2) +
                '%';

              return [label, prsntge];
            },
          },
        },

        title: {
          display: true,
          text: `Emission Reduction Targets of ${
            this.emissionReduction.sector
              ? this.emissionReduction.sector.name + ' sector'
              : this.emissionReduction.country.name
          }`,

          font: {
            size: 24,
          },
        },
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Years',
            font: {
              size: 12,
            },
          },
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Emissions (MtCO₂e)',
            font: {
              size: 12,
            },
          },

          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  };

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;
    const sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    const ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    const subNdcId = this.searchBy.subndc ? this.searchBy.subndc.id : 0;
    let projectApprovalStatusId: string[] = [];
    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 5 : event.rows;

    const filter1: string[] = [];
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
        '1234',
      )

      .subscribe((a) => {
        this.activeprojectsload = [];

        this.totalRecords = a.meta.totalItems;
        this.loading = false;

        for (const project of a.items) {
          const activeproject1: activeproject = {
            name: '',
            ertarget: 0,
            targetyear: '-',
            erarchievment: 0,
            archivmentyear: '-',
          };
          activeproject1.name = project.climateActionName;

          const filterAsses: string[] = [];
          filterAsses.push(...filter1);
          filterAsses.push('project.id||$eq||' + project.id);

          this.serviceproxy
            .getManyBaseAssessmentControllerAssessment(
              undefined,
              undefined,
              filterAsses,
              undefined,
              ['id,ASC'],
              undefined,
              1000,
              0,
              0,
              0,
            )
            .subscribe((res) => {
              let targettotalemission = 0;
              let tarchievmenttotalem = 0;
              let minyearante = '0';
              let maxyearante = '0';
              let minyearpost = '0';
              let maxyearpost = '0';

              if (res.data.length != 0) {
                for (const dt of res.data) {
                  let sum = 0;
                  for (const d of dt.assessmentResult) {
                    sum = sum + (d.totalEmission ? Number(d.totalEmission) : 0);
                  }

                  if (dt.assessmentType == 'Ex-ante') {
                    for (const year of dt.assessmentYear) {
                      if (Number(year.assessmentYear) > Number(maxyearante)) {
                        maxyearante = year.assessmentYear;
                      }
                      if (
                        Number(minyearante) != 0 &&
                        Number(year.assessmentYear) < Number(minyearante)
                      ) {
                        minyearante = year.assessmentYear;
                      } else if (Number(minyearante) == 0) {
                        minyearante = year.assessmentYear;
                      }
                    }

                    targettotalemission = targettotalemission + sum;
                  }
                  if (dt.assessmentType == 'Ex-post') {
                    for (const year of dt.assessmentYear) {
                      if (Number(year.assessmentYear) > Number(maxyearpost)) {
                        maxyearpost = year.assessmentYear;
                      }
                      if (
                        Number(minyearpost) != 0 &&
                        Number(year.assessmentYear) < Number(minyearpost)
                      ) {
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
                activeproject1.targetyear = minyearante + '-' + maxyearante;
                activeproject1.archivmentyear = minyearpost + '-' + maxyearpost;
              }
            });

          this.activeprojectsload.push(activeproject1);
        }

        this.activeprojects = this.activeprojectsload;
      });
  };

  onSearch() {
    const event: any = {};
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
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData2(event);
  }

  testoneeeaa() {}

  loadgridData2 = (event: LazyLoadEvent) => {
    const sectorId = this.searchBy1.sector ? this.searchBy1.sector.id : 0;

    this.ndcserviceproxy
      .getNdcForDashboard(0, 0, this.isCountryAdmin ? sectorId : 0)
      .subscribe((a) => {
        const ndcNames: string[] = [];
        const ndcReduction: number[] = [];
        const xaxis: number[] = [];

        for (const ndc of a.items) {
          let totalemissionRduction = 0;
          for (const assessment of ndc.assessment) {
            for (const assesrslt of assessment.assessmentResult) {
              totalemissionRduction =
                totalemissionRduction +
                (assesrslt.totalEmission ? Number(assesrslt.totalEmission) : 0);
            }
          }
          if (totalemissionRduction != 0) {
            ndcNames.push(ndc.name);
            ndcReduction.push(totalemissionRduction);
            xaxis.push(ndcNames.length);
          }
        }
        this.isNDCdata = ndcNames.length > 0 ? true : false;

        this.basicData = {
          labels: xaxis,
          datasets: [
            {
              label: ndcNames,
              backgroundColor: '#42A5F5',
              data: ndcReduction,
            },
          ],
        };
      });
  };
}

export interface activeproject {
  name: string;
  ertarget: number;
  targetyear: string;
  erarchievment: number;
  archivmentyear: string;
}

export interface ndcdetails {
  name: string;
  cacount: number;
}

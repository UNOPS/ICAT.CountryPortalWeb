import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import {
  AssesmentResaultControllerServiceProxy,
  Assessment,
  AssessmentResault,
  AssessmentYear,
  EmissionReductioDraftDataEntity,
  EmissionReductionDraftdataControllerServiceProxy,
  Institution,
  Ndc,
  NdcControllerServiceProxy,
  Parameter,
  ParameterControllerServiceProxy,
  ParameterRequest,
  Project,
  ProjectControllerServiceProxy,
  Sector,
  ServiceProxy,
  SubNdc,
  User,
  UserType,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-ia-dashboard',
  templateUrl: './ia-dashboard.component.html',
  styleUrls: ['./ia-dashboard.component.css'],
})
export class IaDashboardComponent implements OnInit {
  climateactions: Project[];
  climateactions1: Project[];

  sector: string;
  userId: number;
  user: User = new User();
  institution: Institution = new Institution();
  emissionReduction: EmissionReductioDraftDataEntity =
    new EmissionReductioDraftDataEntity();
  parameterList: Parameter[];
  cliamteActionsBySector: Project[];
  assessmentList: AssessmentResault[];
  climateActionIdList: number[] = [];
  assessmentListBySector: Assessment[] = [];
  finalAssessmentList: Assessment[] = [];
  request: ParameterRequest[] = [];
  assessmetYr: AssessmentYear[] = [];
  assessmentListId: number[] = [];
  yrGap: number;
  newYr: number;
  yrList: number[] = [];
  yrListGraph: string[] = [];
  postYrList: number[] = [];
  postresaultList: number[] = [];
  postIdLisst: number[] = [];
  paramaterRequest = 0;
  parameterPending = 0;
  parameterReview = 0;
  institutionId = 0;
  basicData: any;
  unconditionalValue: number;
  conditionalValue: number;
  actualdata: number[][] = [];
  pid: number[] = [];
  subndcList: SubNdc[] = [];
  subNdcCopy: SubNdc[] = [];
  ndcList: Ndc[] = [];
  projectemreduct: number[] = [];
  data3: number[] = [];

  userCountryId = 0;
  sectorList: Sector[] = [];
  operationalProjectsCount = 0;
  countryId = 1;
  loading: boolean;
  loadingCA: boolean;
  totalRecords = 0;
  totalRecordsCA = 0;
  rows = 10;
  last: number;
  event: any;
  projects: Project[];

  activeprojects: activeproject[] = [];
  activeprojectson: activeproject[] = [];
  activeprojectsload: activeproject[] = [];

  actualValLst: number[] = [];
  unconValLst: number[] = [];
  conValLst: number[] = [];
  bauValLst: number[] = [];
  filter: string[] = [];
  currentYear: number = new Date().getFullYear();

  searchBy: any = {
    sector: 0,
    ndc: 0,
    subndc: 0,
  };

  lineStylesData: any;
  basicOptions1: any;
  basicOptions2: any;
  sectorId = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy,
    private emmissionProxy: EmissionReductionDraftdataControllerServiceProxy,
    private ndcProxy: NdcControllerServiceProxy,
    private assesmentResultserviceproxy: AssesmentResaultControllerServiceProxy,
    private paraProxy: ParameterControllerServiceProxy,
  ) {
    this.basicOptions1 = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: 'Count',
            font: {
              size: 12,
            },
          },
          ticks: {
            color: '#495057',
            precision: 0,
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }

  userName: string;

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    this.userName = decode<any>(token).fname;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;

    this.ndcProxy.getDateRequest(0, 0, []).subscribe((res) => {
      for (const d of res.data) {
        this.ndcList.push(d);
      }
      this.ndcList = this.ndcList.filter(
        (o) => o.country.id == this.userCountryId,
      );
    });

    let i = 0;
    for (const y of this.projectemreduct) {
      this.data3.push(this.projectemreduct[i]);
      i++;
    }

    this.route.queryParams.subscribe((params) => {
      const token = localStorage.getItem('access_token')!;
      const tokenPayload = decode<any>(token);

      const filterByUserEmail: string[] = [];

      filterByUserEmail.push('email||$eq||' + tokenPayload.usr);
      this.serviceProxy
        .getOneBaseUsersControllerUser(7, undefined, undefined, 0)
        .subscribe((res: any) => {
          this.user = res;

          this.institutionId = this.user.institution.id;

          this.serviceProxy
            .getOneBaseInstitutionControllerInstitution(
              this.user.institution?.id,
              undefined,
              undefined,
              0,
            )
            .subscribe((res: any) => {
              this.institution = res;

              this.sectorId = this.institution.sector.id;

              this.sector = this.institution.sector.name;
            });

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
              const yearlstLength = this.yrList.length;

              for (let x = 0; x < yearlstLength; x++) {
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

                const res = await this.assesmentResultserviceproxy
                  .getAssessmentResultforDashboard(this.yrList[x])
                  .toPromise();
                this.assessmentList = res;

                for (const assement of this.assessmentList) {
                  total += assement.totalEmission
                    ? Number(assement.totalEmission)
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
                  },
                  {
                    label: 'Aggregated Actions-Conditional',
                    data: this.conValLst,
                    fill: true,
                    borderColor: '#81B622',
                    tension: 0.4,
                    backgroundColor: '#81B622',
                  },
                  {
                    label: 'Aggregated Actions-Unconditional',
                    data: this.unconValLst,
                    fill: true,
                    tension: 0.4,
                    borderColor: '#FFDB58',
                    backgroundColor: '#FFDB58',
                  },
                  {
                    label: 'BAU',
                    data: this.bauValLst,
                    fill: true,
                    tension: 0.4,
                    borderColor: '#FFA726',
                    backgroundColor: '#FFA726',
                  },
                ],
              };
            });

          this.filter.push('mappedInstitution.id||$eq||' + this.institutionId);

          const event: any = {};
          event.rows = this.rows;
          event.first = 0;

          this.loadgridDataCA(event);

          const filterPara: string[] = [];

          filterPara.push('institution.id||$eq||' + this.institutionId);

          this.paraProxy.getParameterForIaDash().subscribe((res: any) => {
            this.parameterList = res;

            for (const a of this.parameterList) {
              if (a.parameterRequest.dataRequestStatus == 2) {
                this.paramaterRequest++;
              }
              if (a.parameterRequest.dataRequestStatus == 4) {
                this.parameterPending++;
              }
              if (a.parameterRequest.dataRequestStatus == 5) {
                this.parameterReview++;
              }
            }

            this.basicData = {
              labels: [
                'Pending data requests',
                'Pending data entry',
                'Pending data review',
              ],
              datasets: [
                {
                  label: 'Data Requests',
                  backgroundColor: '#42A5F5',
                  data: [
                    this.paramaterRequest,
                    this.parameterPending,
                    this.parameterReview,
                  ],
                },
              ],
            };
          });
        });
    });

    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  configEmissionTargetGraph = () => {
    this.basicOptions2 = {
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
  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;
  }

  loadgridDataCA = (event: LazyLoadEvent) => {
    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    this.climateactionserviceproxy
      .getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
        pageNumber,
        this.rows,
        0,
        [],
        0,
        0,
        '1234',
      )
      .subscribe((res: any) => {
        this.climateactions = res.items;
        this.totalRecordsCA = res.meta.totalItems;
        this.loadingCA = false;
      });
  };

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const sectorId = this.sectorId;
    const ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    const subNdcId = this.searchBy.subndc ? this.searchBy.subndc.id : 0;
    const projectApprovalStatusId = ['', '5'];

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
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

          this.projects = a.items;

          for (const project of a.items) {
            const activeproject1: activeproject = {
              name: '',
              ertarget: 0,
              targetyear: '0',
              erarchievment: 0,
              archivmentyear: '',
            };
            activeproject1.name = project.climateActionName;

            const filter1: string[] = [];
            filter1.push('project.id||$eq||' + project.id);

            this.serviceProxy
              .getManyBaseAssesmentControllerAssessment(
                undefined,
                undefined,
                filter1,
                undefined,
                ['id,ASC'],
                undefined,
                1000,
                0,
                0,
                0,
              )
              .subscribe((res) => {
                let sum = 0;
                let targettotalemission = 0;
                let tarchievmenttotalem = 0;
                let minyear = '2050';
                let maxyear = '0';
                let targetyearrange = '-';
                let archiveyearrange = '-';

                if (res.data.length != 0) {
                  for (const dt of res.data) {
                    const filter2: string[] = [];
                    filter2.push('assement.id||$eq||' + dt.id);

                    for (const year of dt.assessmentYear) {
                      if (Number(year.assessmentYear) > Number(maxyear)) {
                        maxyear = year.assessmentYear;
                      }
                      if (Number(year.assessmentYear) < Number(minyear)) {
                        minyear = year.assessmentYear;
                      }
                    }

                    if (dt.assessmentType == 'Ex-Ante') {
                      targetyearrange = minyear + '-' + maxyear;
                    }
                    if (dt.assessmentType == 'Ex-Post') {
                      archiveyearrange = minyear + '-' + maxyear;
                    }

                    activeproject1.targetyear = targetyearrange;
                    activeproject1.archivmentyear = archiveyearrange;
                    this.serviceProxy
                      .getManyBaseAssesmentResaultControllerAssessmentResault(
                        undefined,
                        undefined,
                        filter2,
                        undefined,
                        ['id,ASC'],
                        undefined,
                        1000,
                        0,
                        0,
                        0,
                      )
                      .subscribe((response) => {
                        for (const d of response.data) {
                          sum = sum + d.totalEmission;
                        }

                        if (dt.assessmentType == 'Ex-Ante') {
                          targettotalemission = sum;
                          targetyearrange = minyear + '-' + maxyear;
                        }
                        if (dt.assessmentType == 'Ex-post') {
                          tarchievmenttotalem = sum;
                          archiveyearrange = minyear + '-' + maxyear;
                        }
                        activeproject1.erarchievment = tarchievmenttotalem;
                        activeproject1.ertarget = targettotalemission;
                        activeproject1.targetyear = targetyearrange;
                        activeproject1.archivmentyear = archiveyearrange;
                      });
                  }
                }
              });

            this.activeprojectsload.push(activeproject1);
          }

          this.activeprojects = this.activeprojectsload;
        });
    }, 1);
  };

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }
  onsectorChange(event: any) {
    this.onSearch();
  }
  onndcChange(event: any) {
    this.subndcList = this.subNdcCopy;
    this.subndcList = this.subndcList.filter((o) => o.ndc.id == event.id);

    this.onSearch();
  }
  onsubndcChange(event: any) {
    this.onSearch();
  }

  testoneeeaa() {}
}

export interface activeproject {
  name: string;
  ertarget: number;
  targetyear: string;
  erarchievment: number;
  archivmentyear: string;
}

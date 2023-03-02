import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AssesmentControllerServiceProxy,
  Assessment,
  AssessmentResault,
  AssessmentYear,
  Ndc,
  Parameter,
  Project,
  ProjectionResault,
  ServiceProxy,
  SubNdc,
} from 'shared/service-proxies/service-proxies';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  assement: Assessment = new Assessment();
  project: Project = new Project();
  baselineEmission: number;
  projectEmission: number;
  leakageEmission: number;
  totalEmission: number;
  objective: any[] = [];
  objectiveName: string[] = [];
  ndc: Ndc = new Ndc();
  subNdc: SubNdc = new SubNdc();
  allParameter: Parameter[];
  baseParameter: Parameter[] = [];
  proParameter: Parameter[] = [];
  projectionParameter: Parameter[] = [];
  leakageParameter: Parameter[] = [];
  allResualt: AssessmentResault[];
  lParameter: AssessmentResault[];
  bresult: AssessmentResault[];
  projectionData: ProjectionResault[];
  assessmentId = 0;
  assessmentYr: string;
  projctId = 0;
  ndcId = 0;
  subNdcId = 0;
  typeArray: number[] = [];
  dateList: number[] = [];
  projectionList: number[] = [];
  basicData: any;
  basicOptions: any;
  assessmentYr2: AssessmentYear[] = [];
  yrId: number;

  leakage: any;
  isShown = false;
  title: string;
  fileName = 'GHGparameters.xlsx';
  excellist: any[] = [];
  methodologies: any[] = [];
  constructor(
    private serviceProxy: ServiceProxy,
    private asseProxi: AssesmentControllerServiceProxy,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assessmentId = params['id'];
      this.assessmentYr = params['yr'];
    });

    this.serviceProxy
      .getOneBaseAssesmentControllerAssessment(
        this.assessmentId,
        undefined,
        undefined,
        0,
      )
      .subscribe((res: any) => {
        this.assement = res;

        this.projctId = this.assement.project?.id;

        if (this.assement.lekageScenario == null) {
          this.isShown = true;
        }

        const assessmentIdFilter: string[] = [];

        if (this.assessmentId != 0) {
          assessmentIdFilter.push('assessmentId||$eq||' + this.assessmentId);
        }

        this.serviceProxy
          .getManyBaseAssessmentObjectiveControllerAssessmentObjective(
            undefined,
            undefined,
            assessmentIdFilter,
            undefined,
            undefined,
            undefined,
            1000,
            0,
            0,
            0,
          )
          .subscribe((res) => {
            this.objective = res.data;

            for (let a = 0; a <= this.objective.length; a++) {
              this.objectiveName.push(this.objective[a]?.objective);
            }
          });

        const assessmentFilterBase: string[] = [];

        if (this.assessmentId != 0) {
          assessmentFilterBase.push('assessment.id||$eq||' + this.assessmentId);
        }

        if (this.assement.isProposal) {
          this.asseProxi
            .getAssessmentDetails(this.assessmentId, this.assessmentYr)
            .subscribe((res) => {
              this.allParameter = res.parameters;

              for (let a = 0; a < this.allParameter.length; a++) {
                if (this.allParameter[a].value != null) {
                  if (this.allParameter[a].isBaseline == true) {
                    this.baseParameter.push(this.allParameter[a]);
                  }
                  if (this.allParameter[a].isProject == true) {
                    this.proParameter.push(this.allParameter[a]);
                  }
                  if (this.allParameter[a].isProjection == true) {
                    this.projectionParameter.push(this.allParameter[a]);
                  }
                  if (this.assement.lekageScenario != null) {
                    this.isShown == true;
                    if (this.allParameter[a].isLekage == true) {
                      this.leakageParameter.push(this.allParameter[a]);
                    }
                  }
                }
              }
            });
        } else {
          this.asseProxi
            .getAssment(this.assessmentId, this.assessmentYr)
            .subscribe((res) => {
              this.allParameter = res.parameters;

              for (let a = 0; a < this.allParameter.length; a++) {
                if (this.allParameter[a].isBaseline == true) {
                  this.baseParameter.push(this.allParameter[a]);
                }
                if (this.allParameter[a].isProject == true) {
                  this.proParameter.push(this.allParameter[a]);
                }
                if (this.allParameter[a].isProjection == true) {
                  this.projectionParameter.push(this.allParameter[a]);
                }
                if (this.assement.lekageScenario != null) {
                  this.isShown == true;
                  if (this.allParameter[a].isLekage == true) {
                    this.leakageParameter.push(this.allParameter[a]);
                  }
                }
              }
            });
        }

        const assessmentYrFilter: string[] = [];

        assessmentYrFilter.push('assessmentYear||$eq||' + this.assessmentYr) &
          assessmentYrFilter.push('assessment.id||$eq||' + this.assessmentId);

        this.serviceProxy
          .getManyBaseAssessmentYearControllerAssessmentYear(
            undefined,
            undefined,
            assessmentYrFilter,
            undefined,
            undefined,
            undefined,
            1000,
            0,
            0,
            0,
          )
          .subscribe((res: any) => {
            this.assessmentYr2 = res.data;

            this.yrId = this.assessmentYr2[0]?.id;

            const assessmentFilterResualt: string[] = [];

            if (this.assessmentId != 0) {
              assessmentFilterResualt.push(
                'assement.id||$eq||' + this.assessmentId,
              ) &
                assessmentFilterResualt.push(
                  'assessmentYear.id||$eq||' + this.yrId,
                );
            }

            this.serviceProxy
              .getManyBaseAssesmentResaultControllerAssessmentResault(
                undefined,
                undefined,
                assessmentFilterResualt,
                undefined,
                undefined,
                undefined,
                1000,
                0,
                0,
                0,
              )
              .subscribe((res) => {
                this.allResualt = res.data;

                this.baselineEmission = this.allResualt[0]?.baselineResult;
                this.projectEmission = this.allResualt[0]?.projectResult;
                this.leakageEmission = this.allResualt[0]?.lekageResult;
                this.totalEmission = this.allResualt[0]?.totalEmission;
              });
          });

        this.serviceProxy
          .getOneBaseProjectControllerProject(
            this.projctId,
            undefined,
            undefined,
            0,
          )
          .subscribe((res: any) => {
            this.project = res;

            if (this.project.projectApprovalStatus?.id == 1) {
              this.title = 'proposed';
            } else {
              this.title = 'approved';
            }
          });
      });

    const assessmentFilterBase: string[] = [];
    const assessmentFilterProject: string[] = [];
    const assessmentFilterleakage: string[] = [];

    if (this.assessmentId != 0) {
      assessmentFilterBase.push('assement.id||$eq||' + this.assessmentId) &
        assessmentFilterBase.push('resultType.id||$eq||' + 1);
    }

    if (this.assessmentId != 0) {
      assessmentFilterProject.push('assement.id||$eq||' + this.assessmentId) &
        assessmentFilterProject.push('resultType.id||$eq||' + 2);
    }

    if (this.assessmentId != 0) {
      assessmentFilterleakage.push('assement.id||$eq||' + this.assessmentId) &
        assessmentFilterleakage.push('resultType.id||$eq||' + 3);
    }

    const projectionFilter: string[] = [];

    if (this.assessmentId != 0) {
      projectionFilter.push('assement.id||$eq||' + this.assessmentId);
    }
    this.serviceProxy
      .getManyBaseProjectionResaultControllerProjectionResault(
        undefined,
        undefined,
        projectionFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.projectionData = res.data;

        let value = 0;
        for (let i = 0; i < this.projectionData.length; i++) {
          value = this.projectionData[i].projectionResualt;
          this.projectionList.push(value);
        }

        this.basicData = {
          labels: this.dateList,
          datasets: [
            {
              label: 'Projection Data',
              data: this.projectionList,
              fill: false,
              borderColor: '#42A5F5',
              tension: 0.4,
            },
          ],
        };

        this.basicOptions = {
          plugins: {
            legend: {
              labels: {
                color: '#495057',
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#495057',
              },
              grid: {
                color: '#ebedef',
              },
            },
            y: {
              ticks: {
                color: '#495057',
              },
              grid: {
                color: '#ebedef',
              },
            },
          },
        };
      });
  }

  public download() {
    const data = document.getElementById('download-content')!;

    html2canvas(data).then((canvas) => {
      const componentWidth = data.offsetWidth;
      const componentHeight = data.offsetHeight;

      const orientation = componentWidth >= componentHeight ? 'l' : 'p';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
      });

      pdf.internal.pageSize.width = componentWidth;
      pdf.internal.pageSize.height = componentHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      pdf.save('download.pdf');
    });
  }

  backtoPAge() {}

  async downloadExcel() {
    const res2 = await this.asseProxi
      .getMethodologyNameByAssessmentId(this.assessmentId)
      .toPromise();
    const methodName = res2.methodology.displayName;

    for (const x of this.allParameter) {
      const obj: excelGhgParameter = {
        Methodology: '',
        Version_of_The_Methodology: '',
        Original_Name_of_The_Parameter: '',
        Parameter_Name: '',
        Entered_Value: '',
        Entered_Unit: '',
        Converted_Value: '',
        Requested_Unit: '',
        Institution: '',
        Assessment_Type: '',
        Alternative_Parameter: '',
        Baseline_Parameter: '',
        Base_Year: '',
        Project_Parameter: '',
        Leakage_Parameter: '',
        Assessment_Year: '',
        Projection_Parameter: '',
        Projection_Base_Year: '',
        Projection_Year: '',
        Vehicle: '',
        Fuel_type: '',
        Route: '',
        Power_plant: '',
        DefaultValue: '',
      };

      obj.Methodology = methodName;
      obj.Version_of_The_Methodology = x.methodologyVersion;
      obj.Original_Name_of_The_Parameter = x.originalName;
      obj.Parameter_Name = x.name;
      obj.Entered_Value = x.value;
      obj.Entered_Unit = x.uomDataEntry;
      obj.Converted_Value = x.conversionValue;
      obj.Requested_Unit = x.uomDataRequest;
      obj.Institution = x?.institution ? x?.institution?.name : 'N/A';
      obj.Assessment_Type = this.assement.assessmentType;
      obj.Alternative_Parameter = x.isAlternative ? 'Yes' : 'No';
      obj.Baseline_Parameter = x.isBaseline ? 'Yes' : 'No';
      obj.Base_Year = x.baseYear;
      obj.Project_Parameter = x.isProject ? 'Yes' : 'No';
      obj.Leakage_Parameter = x.isLekage ? 'Yes' : 'No';
      obj.Assessment_Year = this.assessmentYr;
      obj.Projection_Parameter = x.isProjection ? 'Yes' : 'No';
      obj.Projection_Base_Year = x.projectionBaseYear
        ? x.projectionBaseYear
        : 'N/A';
      obj.Projection_Year = x.projectionYear ? x.projectionYear : 'N/A';
      obj.Vehicle = x.vehical ? x.vehical : 'N/A';
      obj.Fuel_type = x.fuelType ? x.fuelType : 'N/A';
      obj.Route = x.route ? x.route : 'N/A';
      obj.Power_plant = x.powerPlant ? x.powerPlant : 'N/A';
      obj.DefaultValue = x?.defaultValue ? x?.defaultValue?.name : 'N/A';

      this.excellist.push(obj);
    }

    this.excellist.push(
      {},
      {
        Baseline_Parameter: this.baselineEmission,
        Project_Parameter: this.projectEmission,
        Leakage_Parameter: this.leakageEmission,
        Emission_Reduction: this.totalEmission,
      },
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excellist);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}

export interface excelGhgParameter {
  Methodology: any;
  Version_of_The_Methodology: any;
  Original_Name_of_The_Parameter: any;
  Parameter_Name: any;
  Entered_Value: any;
  Entered_Unit: any;
  Converted_Value: any;
  Requested_Unit: any;
  Institution: any;
  Assessment_Type: any;

  Alternative_Parameter: any;
  Baseline_Parameter: any;
  Base_Year: any;
  Project_Parameter: any;
  Leakage_Parameter: any;
  Assessment_Year: any;
  Projection_Parameter: any;
  Projection_Base_Year: any;
  Projection_Year: any;
  Vehicle: any;
  Fuel_type: any;
  Route: any;
  Power_plant: any;
  DefaultValue: any;
}

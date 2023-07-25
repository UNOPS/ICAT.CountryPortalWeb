import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AssessmentControllerServiceProxy,
  Assessment,
  AssessmentResult,
  AssessmentYear,
  Ndc,
  Parameter,
  Project,
  ProjectionResult,
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
  assessment: Assessment = new Assessment();
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
  allResult: AssessmentResult[];
  lParameter: AssessmentResult[];
  bresult: AssessmentResult[];
  projectionData: ProjectionResult[];
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
  spin:boolean =false;
  leakage: any;
  isShown: boolean = false;
  title: string;
  fileName: string = 'GHGparameters.xlsx';
  excellist: any[] = [];
  methodologies: any[] = [];
  constructor(
    private serviceProxy: ServiceProxy,
    private asseProxi: AssessmentControllerServiceProxy,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spin =true
    this.route.queryParams.subscribe((params) => {
      this.assessmentId = params['id'];
      this.assessmentYr = params['yr'];
    });

    this.serviceProxy
      .getOneBaseAssessmentControllerAssessment(
        this.assessmentId,
        undefined,
        undefined,
        0
      )
      .subscribe((res: any) => {
        this.assessment = res;
        this.projctId = this.assessment.project?.id;
        if (this.assessment.lekageScenario == null) {
          this.isShown = true;
        }
        let assessmentIdFilter: string[] = [];

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
            0
          )
          .subscribe((res) => {
            this.objective = res.data;
            for (let a = 0; a <= this.objective.length; a++) {
              this.objectiveName.push(this.objective[a]?.objective);
            }
          });

        let assessmentFilterBase: string[] = [];

        if (this.assessmentId != 0) {
          assessmentFilterBase.push('assessment.id||$eq||' + this.assessmentId);
        }
        if (this.assessment.isProposal) {
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
                  if (this.assessment.lekageScenario != null) {
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
                if (this.assessment.lekageScenario != null) {
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

            const assessmentFilterResult: string[] = [];

            if (this.assessmentId != 0) {
              assessmentFilterResult.push(
                'assessment.id||$eq||' + this.assessmentId,
              ) &
                assessmentFilterResult.push(
                  'assessmentYear.id||$eq||' + this.yrId,
                );
            }

            this.serviceProxy
              .getManyBaseAssessmentResultControllerAssessmentResult(
                undefined,
                undefined,
                assessmentFilterResult,
                undefined,
                undefined,
                undefined,
                1000,
                0,
                0,
                0,
              )
              .subscribe((res) => {
                this.allResult = res.data;

                this.baselineEmission = this.allResult[0]?.baselineResult;
                this.projectEmission = this.allResult[0]?.projectResult;
                this.leakageEmission = this.allResult[0]?.lekageResult;
                this.totalEmission = this.allResult[0]?.totalEmission;
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
      assessmentFilterBase.push('assessment.id||$eq||' + this.assessmentId) &
        assessmentFilterBase.push('resultType.id||$eq||' + 1);
    }

    if (this.assessmentId != 0) {
      assessmentFilterProject.push('assessment.id||$eq||' + this.assessmentId) &
        assessmentFilterProject.push('resultType.id||$eq||' + 2);
    }

    if (this.assessmentId != 0) {
      assessmentFilterleakage.push('assessment.id||$eq||' + this.assessmentId) &
        assessmentFilterleakage.push('resultType.id||$eq||' + 3);
    }

    const projectionFilter: string[] = [];

    if (this.assessmentId != 0) {
      projectionFilter.push('assessment.id||$eq||' + this.assessmentId);
    }
    this.serviceProxy
      .getManyBaseProjectionResultControllerProjectionResult(
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
          value = this.projectionData[i].projectionResult;
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
        this.spin =false
      });
      
  }
  public download() {
    var data = document.getElementById('download-content')!;

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

  backtoPAge() { }

  async downloadExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const nameValuePairs = [
      [
        'Assessment Name',
        `Assessment of ${this.title} Specific Climate Action - ${this.project.climateActionName}`,
      ],
      ['Aggregated Actions', this.assessment.ndc ? this.assessment.ndc.name : '-'],
      ['Action Areas', this.assessment.subNdc ? this.assessment.subNdc.name : '-'],
      ['Objective of Assessment', this.objectiveName.join(',')],
      ['Baseline Year', this.assessment.baseYear],
      ['Project Year ', this.assessmentYr],
      ['Assessment Approach ', this.assessment.assessmentType],
      ['Assessment Methodology ', this.assessment.methodology.displayName],
      ['Version of The Methodology ', this.assessment.methodology.version],
    ];

    const namevalue = XLSX.utils.sheet_add_aoa(worksheet, nameValuePairs);

    const tableData = [
      [
        'Original_Name_of_The_Parameter',
        'Parameter Name',
        'Entered Value',
        'Entered Unit',
        'Converted Value',
        'Requested Unit',
        'Institution',
        'Alternative Parameter',
        'Baseline Parameter',
        'Project Parameter',
        'Leakage Parameter',
        'Projection Parameter',
        'Projection Base Year',
        'Vehicle',
        'Fuel type',
        'Power plant',
        'DefaultValue',
      ],
    ];
    for (let x of this.allParameter) {
      tableData.push([
        x.originalName,
        x.name,
        x.value,
        x.uomDataEntry,
        x.conversionValue,
        x.uomDataRequest,
        x?.institution ? x?.institution?.name : 'N/A',
        x.isAlternative ? 'Yes' : 'No',
        x.isBaseline ? 'Yes' : 'No',
        x.isProject ? 'Yes' : 'No',
        x.isLekage ? 'Yes' : 'No',
        x.isProjection ? 'Yes' : 'No',
        x.projectionBaseYear ? x.projectionBaseYear.toString() : 'N/A',
        x.projectionYear ? x.projectionYear.toString() : 'N/A',
        x.vehical ? x.vehical : 'N/A',
        x.fuelType ? x.fuelType : 'N/A',
        x.route ? x.route : 'N/A',
        x.powerPlant ? x.powerPlant : 'N/A',
        x?.defaultValue ? x?.defaultValue?.name : 'N/A',
      ]);
    }

    const tableRange = XLSX.utils.sheet_add_aoa(worksheet, tableData, {
      origin: 'A11',
    });
    const result = [];
    if (this.baselineEmission) {
      result.push(['Baseline Emission', this.baselineEmission + ' tCO₂e']);
    } 
    if (this.projectEmission) {
      result.push(['Project Emission', this.projectEmission + ' tCO₂e']);
    } 
     if (this.leakageEmission) {
      result.push(['Leakage Emission', this.leakageEmission + ' tCO₂e']);
    } 
     if (this.totalEmission) {
      result.push(['Emission Reduction', this.totalEmission + ' tCO₂e']);
    }

    XLSX.utils.sheet_add_aoa(worksheet, result, {
      origin: 'A' + (this.allParameter.length + 13),
    });

    if (this.projectionParameter.length > 0) {
      const projectionResult = [
        [
          'Projection Result',
        ],
        [
          '',
        ],
        [
          'Year',
          'Baseline Result',
          'Project Result',
          'Leakage Result',
          'Emission Reduction',
        ],
      ];
      for (let param of this.projectionData) {
        projectionResult.push([
          param.projectionYear.toString(),
          param.baselineResult.toString(),
          param.projectResult.toString(),
          param.leakageResult>0?param.leakageResult.toString():'0 tCO₂e',
          param.emissionReduction.toString(),

        ]);
      }

      XLSX.utils.sheet_add_aoa(worksheet, projectionResult, {
        origin: 'A' + (this.allParameter.length + 18),
      });

    }
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
   
 
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

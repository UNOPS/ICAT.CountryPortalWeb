import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AssesmentControllerServiceProxy,
  Assessment,
  AssessmentObjective,
  // AssessmentParameter,
  AssessmentResault,
  AssessmentYear,
  Ndc,
  Parameter,
  Project,
  ProjectionResault,
  ServiceProxy,
  SubNdc,
} from 'shared/service-proxies/service-proxies';
// import * as jsPDF  from "jspdf";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { color } from 'html2canvas/dist/types/css/types/color';
import * as moment from 'moment';
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
  baseParameter: Parameter[] = new Array();
  proParameter: Parameter[] = new Array();
  projectionParameter: Parameter[] = new Array();
  leakageParameter: Parameter[] = new Array();
  allResualt: AssessmentResault[];
  lParameter: AssessmentResault[];
  bresult: AssessmentResault[];
  projectionData: ProjectionResault[];
  assessmentId: number = 0;
  assessmentYr: string;
  projctId: number = 0;
  ndcId: number = 0;
  subNdcId: number = 0;
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
    private asseProxi: AssesmentControllerServiceProxy,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spin =true
    this.route.queryParams.subscribe((params) => {
      this.assessmentId = params['id'];
      this.assessmentYr = params['yr'];
      console.log('id...', this.assessmentId);
      console.log('yr....', this.assessmentYr);
    });

    this.serviceProxy
      .getOneBaseAssesmentControllerAssessment(
        this.assessmentId,
        undefined,
        undefined,
        0
      )
      .subscribe((res: any) => {
        this.assement = res;
        console.log('assessment...', this.assement);
        this.projctId = this.assement.project?.id;
        console.log('leakge...', this.assement.lekageScenario);
        if (this.assement.lekageScenario == null) {
          console.log('change');
          this.isShown = true;
        }
        // for(let a=0; a<this.assement.assessmentObjective.length;a++){
        //   console.log('obejective.....',this.assement.assessmentObjective)
        //   this.objective = this.assement.assessmentObjective
        //   this.objectiveName = this.assement.assessmentObjective[a].objective;
        // }

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
            console.log('obejectttt', res);
            for (let a = 0; a <= this.objective.length; a++) {
              this.objectiveName.push(this.objective[a]?.objective);
              // console.log('obejectttt',this.objectiveName)
            }
          });

        let assessmentFilterBase: string[] = [];

        if (this.assessmentId != 0) {
          assessmentFilterBase.push('assessment.id||$eq||' + this.assessmentId);
          // &
          //   assessmentFilterBase.push('AssessmentYear||$eq||' + this.assessmentYr);
        }
        console.log('aaaaaaaaaaa', assessmentFilterBase);

        // this.serviceProxy
        // .getManyBaseParameterControllerParameter(
        //   undefined,
        //   undefined,
        //   assessmentFilterBase,
        //   undefined,
        //   undefined,
        //   undefined,
        //   1000,
        //   0,
        //   0,
        //   0,
        // )
        if (this.assement.isProposal) {
          this.asseProxi
            .getAssessmentDetails(this.assessmentId, this.assessmentYr)
            .subscribe((res) => {
              // this.allParameter = res.data;
              this.allParameter = res.parameters;
              console.log('poposal');
              console.log('allParameter..', this.allParameter);

              // console.log('type...',this.allParameter[1].isBaseline)
              //isBaseline||$eq||false
              for (let a = 0; a < this.allParameter.length; a++) {
                console.log('values1', this.allParameter[a].value);
                if (this.allParameter[a].value != null) {
                  console.log('values2', this.allParameter[a].value);

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

                // if(this.allParameter[a].isLekage ==false) {
                //   this.isShown == false
                // }
              }
              console.log('base para..', this.baseParameter);
              console.log('pro para..', this.proParameter);
              console.log('leak para..', this.leakageParameter);
            });
        } else {
          console.log('not poposal');
          this.asseProxi
            .getAssment(this.assessmentId, this.assessmentYr)
            .subscribe((res) => {
              // this.allParameter = res.data;
              this.allParameter = res.parameters;

              console.log('allParameter..', this.allParameter);

              // console.log('type...',this.allParameter[1].isBaseline)
              //isBaseline||$eq||false
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

                // if(this.allParameter[a].isLekage ==false) {
                //   this.isShown == false
                // }
              }
              console.log('base para..', this.baseParameter);
              console.log('pro para..', this.proParameter);
              console.log('leak para..', this.leakageParameter);
            });
        }

        // this.asseProxi.getAssment(this.assessmentId,this.assessmentYr)
        // .subscribe((res)=>{
        //   // this.allParameter = res.data;
        //   this.allParameter = res.parameters;

        //   console.log('allParameter..',this.allParameter)

        //   // console.log('type...',this.allParameter[1].isBaseline)
        //   //isBaseline||$eq||false
        //   for(let a=0; a<this.allParameter.length;a++){
        //     if(this.allParameter[a].isBaseline == true){
        //       this.baseParameter.push(this.allParameter[a])
        //     }
        //     if(this.allParameter[a].isProject == true){
        //       this.proParameter.push(this.allParameter[a])
        //     }
        //     if (this.assement.lekageScenario != null) {
        //       this.isShown == true;
        //       if( this.allParameter[a].isLekage == true){

        //         this.leakageParameter.push(this.allParameter[a])
        //       }
        //     }

        //     // if(this.allParameter[a].isLekage ==false) {
        //     //   this.isShown == false
        //     // }
        //   }
        //   console.log('base para..',this.baseParameter)
        //   console.log('pro para..',this.proParameter)
        //   console.log('leak para..',this.leakageParameter)
        // })

        let assessmentYrFilter: string[] = [];

        assessmentYrFilter.push('assessmentYear||$eq||' + this.assessmentYr) &
          assessmentYrFilter.push('assessment.id||$eq||' + this.assessmentId);
        console.log('yr filterr....', assessmentYrFilter);

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
            0
          )
          .subscribe((res: any) => {
            this.assessmentYr2 = res.data;
            console.log('yrrrrrr', this.assessmentYr2);
            this.yrId = this.assessmentYr2[0]?.id;

            let assessmentFilterResualt: string[] = [];

            if (this.assessmentId != 0) {
              assessmentFilterResualt.push(
                'assement.id||$eq||' + this.assessmentId
              ) &
                assessmentFilterResualt.push(
                  'assessmentYear.id||$eq||' + this.yrId
                );
            }

            console.log('filteeeeee', assessmentFilterResualt);

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
                0
              )
              .subscribe((res) => {
                this.allResualt = res.data;
                console.log('resault...', this.allResualt);
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
            0
          )
          .subscribe((res: any) => {
            this.project = res;
            // console.log('projectBy Assesmnt', this.project);

            if (this.project.projectApprovalStatus?.id == 1) {
              // console.log('name chnaeg');
              this.title = 'proposed';
            } else {
              this.title = 'approved';
            }
          });
      });

    let assessmentFilterBase: string[] = [];
    let assessmentFilterProject: string[] = [];
    let assessmentFilterleakage: string[] = [];

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

    //PROJECTION CHART - START
    let projectionFilter: string[] = [];

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
        0
      )
      .subscribe((res) => {
        this.projectionData = res.data;
        console.log('projection', this.projectionData);

        let yr = 0;
        // for(var i=0; i<this.projectionData.length;i++){
        //   yr = this.projectionData[i].year;
        //   this.dateList.push(yr);
        // }

        // console.log('yr...', this.dateList);

        let value = 0;
        for (var i = 0; i < this.projectionData.length; i++) {
          value = this.projectionData[i].projectionResualt;
          // console.log(value)
          this.projectionList.push(value);
        }

        // console.log('values...', this.projectionList);

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

  // //PDF DOWNLOAD - START
  public download() {
    // var data = document.getElementById('content')!;
    // console.log('daaaa', data);
    // console.log('width and height',data.clientHeight)
    // html2canvas(data).then((canvas) => {
    //   var imaWidth = 185;  //123
    //   var pageHeight = 300;  //500
    //   var imgHeight = (canvas.height * imaWidth) / canvas.width;
    //   console.log('size', canvas.height); // 4346
    //   console.log('size....', canvas.width);  //2006
    //   var heightLeft = imgHeight;
    //   var text =
    //     'Downolad date ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' Assessment year ' +
    //     this.assement.assessmentYear[0].assessmentYear + ' text-based to be added';

    //   const contentDataURL = canvas.toDataURL('image/png');
    //   let pdf = new jsPDF('p', 'mm', 'a4');
    //   var position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 10, position, imaWidth, imgHeight);
    //   pdf.text(text, 0, 295);
    //   pdf.save('');
    // });

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
      //  var text =
      //       'Downolad date ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' Assessment year ' +
      //       this.assement.assessmentYear[0].assessmentYear + ' text-based to be added';

      pdf.internal.pageSize.width = componentWidth;
      pdf.internal.pageSize.height = componentHeight;

      //pdf.text(text, 0, 295);
      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      pdf.save('download.pdf');
    });
  }

  backtoPAge() {
    // this.location.back();
  }

  async downloadExcel() {
    console.log("selectedProjects..",this.allParameter)

    // let res2: any;
    // res2 = await this.asseProxi
    //   .getMethodologyNameByAssessmentId(this.assessmentId)
    //   .toPromise();
    // let methodName = res2.methodology.displayName;

    // for (let x of this.allParameter) {
    //   console.log('selectedProjects..', x);

    //   let obj: excelGhgParameter = {
    //     Methodology: '',
    //     Version_of_The_Methodology: '',
    //     Original_Name_of_The_Parameter: '',
    //     Parameter_Name: '',
    //     Entered_Value: '',
    //     Entered_Unit: '',
    //     Converted_Value: '',
    //     Requested_Unit: '',
    //     Institution: '',
    //     Assessment_Type: '',
    //     Alternative_Parameter: '',
    //     // parentParameter:'',
    //     // parentParameterId:'',
    //     Baseline_Parameter: '',
    //     Base_Year: '',
    //     Project_Parameter: '',
    //     Leakage_Parameter: '',
    //     Assessment_Year: '',
    //     Projection_Parameter: '',
    //     Projection_Base_Year: '',
    //     Projection_Year: '',
    //     Vehicle: '',
    //     Fuel_type: '',
    //     Route: '',
    //     Power_plant: '',
    //     DefaultValue: '',
    //   };

    //   obj.Methodology = methodName;
    //   obj.Version_of_The_Methodology = x.methodologyVersion;
    //   obj.Original_Name_of_The_Parameter = x.originalName;
    //   obj.Parameter_Name = x.name;
    //   obj.Entered_Value = x.value;
    //   obj.Entered_Unit = x.uomDataEntry;
    //   obj.Converted_Value = x.conversionValue;
    //   obj.Requested_Unit = x.uomDataRequest;
    //   obj.Institution = x?.institution ? x?.institution?.name : 'N/A';
    //   obj.Assessment_Type = this.assement.assessmentType;
    //   obj.Alternative_Parameter = x.isAlternative ? 'Yes' : 'No';
    //   // obj.parentParameter=x.parentParameter;
    //   // obj.parentParameterId=x.parentParameterId;
    //   obj.Baseline_Parameter = x.isBaseline ? 'Yes' : 'No';
    //   obj.Base_Year = x.baseYear;
    //   obj.Project_Parameter = x.isProject ? 'Yes' : 'No';
    //   obj.Leakage_Parameter = x.isLekage ? 'Yes' : 'No';
    //   obj.Assessment_Year = this.assessmentYr;
    //   obj.Projection_Parameter = x.isProjection ? 'Yes' : 'No';
    //   obj.Projection_Base_Year = x.projectionBaseYear
    //     ? x.projectionBaseYear
    //     : 'N/A';
    //   obj.Projection_Year = x.projectionYear ? x.projectionYear : 'N/A';
    //   obj.Vehicle = x.vehical ? x.vehical : 'N/A';
    //   obj.Fuel_type = x.fuelType ? x.fuelType : 'N/A';
    //   obj.Route = x.route ? x.route : 'N/A';
    //   obj.Power_plant = x.powerPlant ? x.powerPlant : 'N/A';
    //   obj.DefaultValue = x?.defaultValue ? x?.defaultValue?.name : 'N/A';

    //   this.excellist.push(obj);
    // }

    // this.excellist.push(
    //   {},
    //   {
    //     Baseline_Parameter: this.baselineEmission,
    //     Project_Parameter: this.projectEmission,
    //     Leakage_Parameter: this.leakageEmission,
    //     Emission_Reduction: this.totalEmission,
    //   }
    // );

    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excellist);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const nameValuePairs = [
      [
        'Assessment Name',
        `Assessment of ${this.title} Specific Climate Action - ${this.project.climateActionName}`,
      ],
      ['Aggregated Actions', this.assement.ndc ? this.assement.ndc.name : '-'],
      ['Action Areas', this.assement.subNdc ? this.assement.subNdc.name : '-'],
      ['Objective of Assessment', this.objectiveName.join(',')],
      ['Baseline Year', this.assement.baseYear],
      ['Project Year ', this.assessmentYr],
      ['Assessment Approach ', this.assement.assessmentType],
      ['Assessment Methodology ', this.assement.methodology.displayName],
      ['Version of The Methodology ', this.assement.methodology.version],
    ];

    const namevalue = XLSX.utils.sheet_add_aoa(worksheet, nameValuePairs);

    const tableData = [
      [
        // 'Version of The Methodology',
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
        // x.methodologyVersion,
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
  // parentParameter:any,
  // parentParameterId:any,
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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Assessment,
  AssessmentObjective,
  // AssessmentParameter,
  AssessmentResault,
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
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx'; 
@Component({
  selector: 'app-mac-result',
  templateUrl: './mac-result.component.html',
  styleUrls: ['./mac-result.component.css']
})
export class MacResultComponent implements OnInit {

  assement: Assessment = new Assessment();
  project: Project = new Project();
  filteredParameters: Parameter[] = [];
  resultList: AssessmentResault = new AssessmentResault();
  ndc: Ndc = new Ndc();
  subNdc: SubNdc = new SubNdc();
  projectStartDate: string;
  assessmentYear: string;
  objectiveOfAssessment: string;
  discountRate: number;
  //baselineEmission: AssessmentResault[];
  
  bsTotalInvestment: number; //project wise
  bsProjectLife: number;
  bsAnnualOM:number;
  bsAnnualFuelCost: number;
  bsOtherAnnualCost: number;
  bsTotalAnnualCost: number;

  psTotalInvestment: number;
  psProjectLife: number;
  psAnnualOM : number;
  psAnnualFuelCost: number;
  psOtherAnnualCost : number;
  psTotalAnnualCost : number;


  projectEmission: AssessmentResault[];
  leakageEmission: AssessmentResault[];
  baseParameter: Parameter[];
  proParameter: Parameter[];
  lParameter: AssessmentResault[];
  bresult: AssessmentResault[];
  projectionData: ProjectionResault[];
  // baseParameter: AssessmentParameter = new AssessmentParameter();
  // proParameter: AssessmentParameter = new AssessmentParameter();
  assessmentId: number = 0;
  projctId: number = 0;
  ndcId: number = 0;
  subNdcId: number = 0;
  typeArray: number[] = [];
  dateList: number[] = [];
  projectionList: number[] = [];
  basicData: any;
  basicOptions: any;
  title: string;

  getDiscountRate:any;
  getBsTotalInvestment:any = 0;
  getBsProjectLife:any = 0;
  getBsAnnualOM:any;
  getBsAnnualFuelCost:any;
  getBsOtherAnnualCost:any;
  
  getPsTotalInvestment:any = 0;
  getPsProjectLife:any = 0;
  getPsAnnualOM:any;
  getPsAnnualFuelCost:any;
  getPsOtherAnnualCost:any = 0;

  getReduction:any;
  getBsTotalAnnualCost:any = 0;
  getPsTotalAnnualCost:any = 0;
  getCostDifference:any = 0;
  getMacValue:any = 0;

  objectiveList: AssessmentObjective[] =[];
 
  projectName:string;
  fileName: string='macParameters.xlsx';
  excellist:excelMacParameter[] = [];
  disableExcelButton:boolean = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) 
  { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.assessmentId = params['id'];
      console.log('id...', this.assessmentId);
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
     // console.log('relevent assessment...', this.assement);
     
      this.projctId = this.assement.project.id;
      
      this.assessmentYear = this.assement.assessmentYear[0]?.assessmentYear;
     // this.objectiveOfAssessment = this.assement.assessmentObjective[0]?.objective;
     // console.log("asss objsss..",this.objectiveOfAssessment);

     let objectiveFilter: string[] = [];

          if (this.assessmentId != 0) {
            objectiveFilter.push('assessmentId||$eq||' + this.assessmentId);
            //objectiveFilter.push('Parameter.assessmentYear||$eq||'+this.assessmentYear);
          }
      

     this.serviceProxy
     .getManyBaseAssessmentObjectiveControllerAssessmentObjective(
       undefined,
       undefined,
       objectiveFilter,
       undefined,
       undefined,
       undefined,
       1000,
       0,
       0,
       0
     ).subscribe((res: any) => {
       this.objectiveList = res.data;
       //console.log('this.results',this.objectiveList)
       this.objectiveOfAssessment = this.objectiveList[0]?.objective;
      // console.log("asss objsss..",this.objectiveOfAssessment);
     });










      this.serviceProxy
        .getOneBaseProjectControllerProject(
          this.projctId,
          undefined,
          undefined,
          0
        )
        .subscribe((res: any) => {
          console.log("inside assessments...",this.projctId)
          this.project = res;
          console.log('projectBy Assesmnt', this.project);
          this.ndc = this.project?.ndc;
          this.subNdc = this.project?.subNdc;
          this.projectStartDate = moment(this.project?.proposeDateofCommence).format('YYYY-MM-DD');
          this.projectName = this.project?.climateActionName;
         // this.getBsTotalInvestment = this.project.baseScenarioTotalInvestment;
         // this.getBsProjectLife = this.project.baseScenarioProjectLife;
         // this.getPsTotalInvestment = this.project.projectScenarioTotalInvestment;
          //this.getPsProjectLife = this.project.duration;
          // console.log('projectApprovalStatus',this.project.projectApprovalStatus.id)
          if (this.project?.projectApprovalStatus?.name == 'Active') {
           // console.log('proposed');
            
            this.title = 'approved';
          } else {
            this.title = 'proposed';
          //  console.log('approved');
          }

          let parameterFilter: string[] = [];

          if (this.assessmentId != 0) {
            parameterFilter.push('assessment.id||$eq||' + this.assessmentId)&
            parameterFilter.push('Parameter.assessmentYear||$eq||'+this.assessmentYear);
          }
      
          this.serviceProxy
            .getManyBaseParameterControllerParameter(
              undefined,
              undefined,
              parameterFilter,
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0
            )
            .subscribe((res: any) => {
              this.filteredParameters = res.data;
              //console.log('parametsrs by filterd..', this.filteredParameters);
              
              this.getBsTotalInvestment = this.filteredParameters.find((o:any)=>o.name== 'Baseline Scenario Total Investment')?.value;
              this.getBsProjectLife = this.filteredParameters.find((o:any)=>o.name== 'Baseline Scenario Project Life')?.value;
              this.getBsAnnualOM = this.filteredParameters.find((o:any)=>o.name== 'Baseline Scenario Annual O&M')?.value;
              this.getBsAnnualFuelCost = this.filteredParameters.find((o:any)=>o.name== 'Baseline Scenario Annual Fuel')?.value;
              this.getBsOtherAnnualCost = this.filteredParameters.find((o:any)=>o.name== 'Baseline Scenario Other Annual Cost')?.value;
            //  this.getBsTotalAnnualCost = (+this.getBsAnnualOM + +this.getBsAnnualFuelCost + +this.getBsOtherAnnualCost);

              this.getPsTotalInvestment = this.filteredParameters.find((o:any)=>o.name== 'Project Scenario Total Investment')?.value;
              this.getPsProjectLife = this.filteredParameters.find((o:any)=>o.name== 'Project Scenario Project Life')?.value;
              this.getPsAnnualOM = this.filteredParameters.find((o:any)=>o.name== 'Project Scenario Annual O&M')?.value;
              this.getPsAnnualFuelCost = this.filteredParameters.find((o:any)=>o.name== 'Project Scenario Annual Fuel')?.value;
              this.getPsOtherAnnualCost = this.filteredParameters.find((o:any)=>o.name== 'Project Scenario Other Annual Cost')?.value;
            //  this.getPsTotalAnnualCost = (+this.getPsAnnualOM + +this.getPsAnnualFuelCost + +this.getPsOtherAnnualCost);

              this.getDiscountRate = this.filteredParameters.find((o:any)=>o.name== 'Discount Rate')?.value;
            //  this.getCostDifference = (+this.getPsTotalAnnualCost - +this.getBsTotalAnnualCost);
              this.getReduction = this.filteredParameters.find((o:any)=>o.name== 'Reduction')?.value;

              //console.log("reductio is ",this.getDiscountRate);
            });

            let resultFilter: string[] = [];
            resultFilter.push('assement.id||$eq||' + this.assessmentId)&
            resultFilter.push('assessmentYear.assessmentYear||$eq||'+this.assessmentYear);
          
    this.serviceProxy
    .getManyBaseAssesmentResaultControllerAssessmentResault(
      undefined,
      undefined,
      resultFilter,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res: any) => {
      this.resultList = res.data[0];
     // console.log('this.results',this.resultList)
      this.getCostDifference = this.resultList?.costDifference;
      this.getPsTotalAnnualCost = this.resultList?.psTotalAnnualCost;
      this.getBsTotalAnnualCost = this.resultList?.bsTotalAnnualCost;
      this.getMacValue = this.resultList?.macResult;
    });

          
            

        });
    });


  }

  
    //PDF DOWNLOAD - START
    public download() {
      var data = document.getElementById('content')!;
     // console.log('daaaa', data);
      html2canvas(data).then((canvas) => {
        var imaWidth = 200; //123
        var pageHeight = 350; //500
        var imgHeight = (canvas.height * imaWidth) / canvas.width;
       // console.log('size', canvas.height); // 4346
       // console.log('size....', canvas.width); //2006
        var heightLeft = imgHeight;
        var text =
          'Downolad date ' +
          moment().format('YYYY-MM-DD HH:mm:ss') +
          '  Assessment date ' +
          this.assessmentYear +
          ' text-based to be added';
  
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 10, position, imaWidth, imgHeight);
        pdf.text(text, 0, 290);
        pdf.save('');
      });
    }

    downloadExcel()
    {
     // console.log("parameters..",this.filteredParameters)

      for(let x of this.filteredParameters)
      {
 

        let obj:excelMacParameter =
        {
         
        //  Original_Name_of_The_Parameter:'',
          Parameter_Name:'',
          Entered_Value:'',
          Unit:'',
          Institution:'',
          Assessment_Type:'',      
          Baseline_Parameter:'',
          Project_Parameter:'',
          Assessment_Year:'',
  
  
        }



       
     //   obj.Original_Name_of_The_Parameter=x.originalName;
        obj.Parameter_Name=x.name;
        obj.Entered_Value=x.value;
        obj.Unit=x.uomDataEntry;
        obj.Institution= x?.institution ? x?.institution?.name:'N/A';
        obj.Assessment_Type=this.assement.assessmentType;
        obj.Baseline_Parameter=x.isBaseline?'Yes':'No';
        obj.Project_Parameter=x.isProject?'Yes':'No';
        obj.Assessment_Year=x.assessmentYear;;
      
  

  this.excellist.push(obj);
      }
           //console.log("selectedProjects..",this.selectedProjects)
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excellist);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
   /* save to file */
  XLSX.writeFile(wb, this.fileName);
  this.excellist =[]
  // this.disableExcelButton = true;
    }
    

    back()
    {
      this.location.back();
    }

}



export interface excelMacParameter
{
  //Methodology:any,
  //Version_of_The_Methodology:any, 
 // Original_Name_of_The_Parameter:any,
  Parameter_Name:any,
  Entered_Value:any,
  Unit:any,
  //Converted_Value:any,
  //Requested_Unit:any,
  Institution:any,
  Assessment_Type:any,
  //Alternative_Parameter:any,
  Baseline_Parameter:any,
  //Base_Year:any,
  Project_Parameter:any,
  //Leakage_Parameter:any,
  Assessment_Year:any,
 // Projection_Parameter:any,
 // Projection_Base_Year:any,
 // Projection_Year:any,
 // Vehicle:any,
 // Fuel_type:any,
 // Route:any,
 // Power_plant:any,
 // DefaultValue:any,
  


}
import { Component, OnInit,ViewChild,AfterViewInit,ChangeDetectorRef, Input, } from '@angular/core';
import { ORIENTATION_BREAKPOINTS } from '@angular/flex-layout';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService, SelectItem } from 'primeng/api';
import { Assessment, AssessmentObjective, AssessmentYear, Institution, Project, ServiceProxy, Parameter as Parameter_Server, ProjectApprovalStatus, } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-mac-assessment-approved',
  templateUrl: './mac-assessment-approved.component.html',
  styleUrls: ['./mac-assessment-approved.component.css']
})
export class MacAssessmentApprovedComponent implements OnInit,AfterViewInit {

  @Input() IsProposal: boolean;
  climateActions: Project[] = [];  
  assessments: Assessment[] = [];
  assessmentsByYear: Assessment[][] = [];
  filteredAssessments: any[] = [];
  ndc :any = '';
  instiTutionList: Institution[];
  subNdc:any='';
  projectStartDate:any='';
  asseYear: string='';
  details: any[]=[];
  uniqueYears: SelectItem[]=[];
  years: number[] = [];
  selectYears: any;
  slectedProject: Project = new Project();
  project: Project = new Project();
  createdAssessment: Assessment = new Assessment();
  
  approachList: any = ['Ex-ante', 'Ex-post']
  @ViewChild('op') overlay: any;
 
                      
  selectedApproachList: any[]=[];
  objectiveOfAsse: string ='';

  proposedAssessmentDetails : any = []; 

  uomDiscountrate : string='%';
  uomCost : string= "$";
  uomReduction : string="tCo2e";
  uomLife : string="years"


  selectedApproch: Assessment[] = [];    
  discountrate : Institution = new Institution();
  bsOtherAnnualCost: Institution = new Institution();
  bsTotalInvestment : Institution = new Institution();
  psTotalInvestment : Institution = new Institution();
  bsAnnualOM : Institution = new Institution();
  psAnnualOM : Institution = new Institution();
  bsAnnualFuel : Institution = new Institution();
  psAnnualFuel : Institution = new Institution();
  bsProjectLife: Institution = new Institution();
  psProjectLife: Institution = new Institution();
  psOtherAnnualCost: Institution = new Institution();
  emptyObj: Institution;
  emptyVal:string;
  
  duration:number;   // project scenario project life
  baseScenarioProjectLife:number;
  projectScenarioTotalInvestment:number;
  baseScenarioTotalInvestment:number;
  isDiasbaleEye:boolean = true;
  noUniqueYears:boolean = false;


  checkedbsAnnualfuelCost:boolean = false;
  checkedpsAnnualfuelCost:boolean = false;

  checkedbsProjectLife:boolean = false;
  checkedpsProjectLife:boolean = false;

  checkedbsOM:boolean = false;
  checkedpsOM:boolean = false;

  checkedDiscountRate:boolean = false;

  macDefaultValues:any;
  bsAnnualFuelCostList:any;
  psAnnualFuelCostList:any;
  bsAnnualFuelObject:any;


  bsDefaultValList:any
  psDefaultValList:any;

  bsProjectLifeList:any;
  psProjectLifeList:any;

  bsAnnualOMlist:any;
  psAnnualOMlist:any;

  discountRateList:any;

  bsAnnualFuelName:any;


  discountRateDisplay:string;
  bsProjectLifeDisplay:string;
  psProjectLifeDisplay:string;
  bsOM:string;
  psOM:string;
  bsfuelCost:string;
  psfuelCost:string;
  
  psAnnualOMDefaultVAl:any;
  bsAnnualOMDefaulVAl:any;
  psAnnualFuelDefaultVal:any;
  bsAnnualFuelDefaulVAl:any;
  discountrateDefaultVAl:any
                    
   macValue :any = 
      {
     
     "parameters":{
         "DiscountRate":"",
         "reduction" :"",
         "year":"",
        "baseline": {  //baseline details
         "bsTotalInvestment":"",
         "bsAnnualOM":"",
         "bsOtherAnnualCost":"",
         "bsAnnualFuel":"",
         "bsProjectLife":"",
        },
       "project": {
          // project details
         "psTotalInvestment":"",
         "psOtherAnnualCost":"",
         "psAnnualOM":"",
         "psAnnualFuel":"",
         "psProjectLife":"",
        },
      }
    }
  
   
    userCountryId:number = 0;
    userSectorId:number = 0;

    isDisableSaveButton:boolean = false;
  


  constructor(private serviceProxy: ServiceProxy,
     private cdr: ChangeDetectorRef,
     private messageService :MessageService,
     private router: Router,
     ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    

    let projfilter: string[] = new Array();
    projfilter.push('projectApprovalStatus.id||$in||' +[1,5])

    this.serviceProxy
    .getManyBaseProjectControllerProject(
      undefined,
      undefined,
      projfilter,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    )
    .subscribe((res: any) => {
      this.climateActions = res.data;
      this.climateActions = this.climateActions.filter((o)=>{
        if (o.country !== undefined) {
          return o.country.id == this.userCountryId
        } else return false
      })
      //
      console.log('climateActions', res.data);
     
    });

    let filter2: string[] = new Array();
    filter2.push('type.id||$eq||' +3)
    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        filter2,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.instiTutionList = res.data;
        this.instiTutionList = this.instiTutionList.filter((o)=>o.country.id == this.userCountryId);
       // console.log('my institutions', res.data);
      });



      let filterMac: string[] = [];
    filterMac.push('isMac||$eq||' +1);
    this.serviceProxy
    .getManyBaseDefaultValueControllerDefaultValue(
      undefined,
      undefined,
      filterMac,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    )
    .subscribe((res: any) => {
      this.macDefaultValues = res.data;
     // this.macDefaultValues = this.macDefaultValues.filter((o:any)=>o.country.id == this.userCountryId || o.country.id == null);
      
      this.bsDefaultValList = this.macDefaultValues.filter((o:any)=>o.scenario == 'baseLine');
      this.psDefaultValList = this.macDefaultValues.filter((o:any)=>o.scenario == 'project');

      this.bsProjectLifeList = this.bsDefaultValList.filter((o:any)=>o.parameterName == 'Project Life');
      this.psProjectLifeList = this.psDefaultValList.filter((o:any)=>o.parameterName == 'Project Life');
      console.log("this.bsProjectLifeList...",this.bsProjectLifeList);


      this.bsAnnualFuelCostList = this.bsDefaultValList.filter((o:any)=>o.parameterName == 'Annual Fuel Cost');
      this.psAnnualFuelCostList = this.psDefaultValList.filter((o:any)=>o.parameterName == 'Annual Fuel Cost');

      this.bsAnnualOMlist = this.bsDefaultValList.filter((o:any)=>o.parameterName == 'Annual O&M');
      this.psAnnualOMlist = this.psDefaultValList.filter((o:any)=>o.parameterName == 'Annual O&M');

      this.discountRateList =this.macDefaultValues.filter((o:any)=>o.scenario == null);
      console.log('this.bsAnnualOMlist..', this.bsAnnualOMlist);
     
    });

 
  }


  


  onChange(event: any) {
    this.isDiasbaleEye = false;
    //console.log('this.slectedProject', this.slectedProject);
    let filter1: string[] = new Array();
    filter1.push('project.id||$eq||' +this.slectedProject.id)&
    filter1.push('Assessment.assessmentType||$in||' +this.approachList)&
    filter1.push('Assessment.isProposal||$eq||' +0);
    
    this.ndc = this.slectedProject.ndc?.name;
    this.subNdc = this.slectedProject.subNdc?.name;
    this.projectStartDate= moment(this.slectedProject.proposeDateofCommence).format('YYYY-MM-DD');

    this.baseScenarioTotalInvestment=this.slectedProject.baseScenarioTotalInvestment;
    this.projectScenarioTotalInvestment=this.slectedProject.projectScenarioTotalInvestment;
    this.baseScenarioProjectLife=this.slectedProject.baseScenarioProjectLife;
    this.duration=this.slectedProject.duration;
    
    
    this.serviceProxy.getManyBaseAssesmentControllerAssessment
    (
      undefined,
      undefined,
      filter1,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    )
    .subscribe((res: any) => {
      this.assessments = res.data;
      //console.log('assessments', this.assessments);
     // this.asseYear = this.assessments[0].assessmentYear[0].assessmentYear;
     // console.log('asse year',this.asseYear)
    });

    
  }


getYears()
  {  
    this.selectedApproch=[]
    if(this.details.length==0)
    {
    for (let x =0; x<this.assessments.length;x++)
    {
     // console.log('your ass',this.assessments[x])

    //  for (let j =0; j<this.assessments[x].assessmentYear.length;x++)
    // {
    //  // console.log('your ass',this.assessments[x])
    //   this.details.push(this.assessments[x].assessmentYear[j].assessmentYear);
    // }


      this.details.push(this.assessments[x].assessmentYear[0].assessmentYear);


    }
   // console.log('asse year',this.details)
     }
     this.uniqueYears = [...new Set(this.details)];
     this.uniqueYears = this.uniqueYears.map(year => {return {label: year.toString(), value: year}})
     this.uniqueYears = this.uniqueYears.sort((a,b)=>a.value-b.value)
     if(this.uniqueYears.length === 0){
      this.noUniqueYears = true
     } else {
      this.noUniqueYears = false
     }
    // console.log("unique years",this.uniqueYears)
  }


  getAssessmentApproachesForAYear(yr:any,index:number)
  {
    console.log("hiii.....")
    //isProposal
    let filter1: string[] = new Array();
    filter1.push('project.id||$eq||' +this.slectedProject.id)&
    filter1.push('Assessment.assessmentType||$in||' +this.approachList)&
    filter1.push('Assessment.isProposal||$eq||' +0)&
    filter1.push('assessmentYear.assessmentYear||$eq||' +yr);
    
    this.serviceProxy.getManyBaseAssesmentControllerAssessment
    (
      undefined,
      undefined,
      filter1,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    )
    .subscribe((res: any) => {
      this.assessmentsByYear[index] = res.data;
      console.log('assessmentsByYear....', res.data);
     // this.asseYear = this.assessments[0].assessmentYear[0].assessmentYear;
     // console.log('asse year',this.asseYear)
    });
  
  }


getSelectedApproach()
{

  
  console.log("selected Approach....",this.selectedApproch);
}

getSelectedIns()
{
  //console.log("selected ins....",this.discountrate);

}


onChangeDefaultValues(event:any)
{

 // console.log("default check...",this.checked)
}


onStatusChangebsAnnualFuel(event:any)
{
   this.bsAnnualFuelDefaulVAl = Number(event.value);
   this.bsfuelCost = event.administrationLevel;
}

onStatusChangepsAnnualFuel(event:any)
{
   this.psAnnualFuelDefaultVal = Number(event.value);
   this.psfuelCost = event.administrationLevel;
}


onStatusChangebsProjectLife(event:any)
{
   this.baseScenarioProjectLife = Number(event.value);
   this.bsProjectLifeDisplay = event.administrationLevel;
}

onStatusChangepsProjectLife(event:any)
{
   this.duration = Number(event.value);
   this.psProjectLifeDisplay = event.administrationLevel;
}

onStatusChangebsAnnualOM(event:any)
{
   this.bsAnnualOMDefaulVAl = Number(event.value);
   this.bsOM = event.administrationLevel;
}

onStatusChangepsAnnualOM(event:any)
{
   this.psAnnualOMDefaultVAl = Number(event.value);
   this.psOM = event.administrationLevel;
}

onStatusChangexxDiscountRate(event:any)
{
   this.discountrateDefaultVAl = Number(event.value);
   this.discountRateDisplay = event.administrationLevel;
}


detail() {
  if (this.slectedProject) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: this.slectedProject.id },
    });
  }
}

createAssessments(data: NgForm)
{
  console.log("hi....")
  if (data.form.valid) {
    console.log("hi....2")
   // this.updateProject();
for(let ass of this.selectedApproch){
  if (ass?.assessmentResult.length === 0){
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `There is no result for selected assessment in assesment year ${ass.assessmentYear[0].assessmentYear}. `,
      closable: true,
    });
    return;
   }

}


    for(let x=0; x<this.selectedApproch.length; x++)
    {
      console.log("hi....3", this.selectedApproch)
      console.log("selectYears", this.selectYears)
      console.log("objectiveOfAsse", this.objectiveOfAsse)
      console.log("bsTotalInvestment", this.bsTotalInvestment)
      console.log("bsProjectLife", this.bsProjectLife)
      console.log("bsAnnualOM", this.bsAnnualOM)
      console.log("bsAnnualFuel", this.bsAnnualFuel)
    // console.log("reduction....",this.selectedApproachLi[x]);
    let assessment = new Assessment();
   // assessment.baseYear = this.baseYear.getFullYear();  
   // var ndc = new Ndc();
   // ndc.id = this.selectedNdc.id;
   // var subndc = new SubNdc();
   // subndc.id = this.selctedSubNdc.id;   
   // assessment.subNdc = subndc;
   // assessment.ndc = ndc;

  //  if (this.selectedApproch[x]?.assessmentResult.length === 0){
  //   this.messageService.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: `There is no result for selected assessment in assesment year ${this.selectedApproch[x].assessmentYear[0].assessmentYear}. `,
  //     closable: true,
  //   });
  //   return;
  //  }

    assessment.projectDuration = this.slectedProject.duration;
    assessment.projectStartDate = moment(this.slectedProject.proposeDateofCommence);
    assessment.emmisionReductionValue = this.selectedApproch[x]?.assessmentResult[0].totalEmission;
    assessment.ghgAssessTypeForMac = this.selectedApproch[x]?.assessmentType;
   // assessment.isGuided = this.isGuidedSelection;
    assessment.assessmentType = 'MAC';
  //  assessment.mitigationActionType = this.selectedMitigationActionType;
  //  assessment.methodology = this.selectedMethodology;
  //  assessment.baselineScenario = this.baselineScenario;
  //  assessment.projectScenario = this.ProjectScenario;
  //  assessment.lekageScenario = this.LeakageScenario;
    assessment.project = this.slectedProject;
  //  assessment.assessmentApplication = this.selectedAssessmentApplication;
    assessment.isProposal = this.IsProposal;
  //  assessment.easyOfUseDataCollection = this.selectedEasyofdataCollection;

 // console.log("assessment object",assessment);

    let assesmentYars: AssessmentYear[] = [];
    let assessmentObjective: AssessmentObjective[]=[];
    let parameters: Parameter_Server[] = [];
    let ae = new AssessmentYear();
    let ao = new AssessmentObjective();
    ae.assessmentYear = this.selectedApproch[x].assessmentYear[0].assessmentYear
    assesmentYars.push(ae);
    ao.objective = this.objectiveOfAsse;
    assessmentObjective.push(ao);
    

    


    if(this.discountrateDefaultVAl != null)
    {
      let discountrateParams = this.createParam(
        'Discount Rate',
        this.emptyObj,
        this.discountrateDefaultVAl,
        this.emptyVal,
        this.uomDiscountrate,
        true,
        false,
        false,
        false,
        this.selectedApproch[x]?.assessmentYear[0]?.assessmentYear
      );
      parameters.push(...discountrateParams!);
    }
    else
    {
      let discountrateParams = this.createParam(
        'Discount Rate',
        this.discountrate,
        this.emptyVal,
        this.emptyVal,
        this.uomDiscountrate,
        true,
        false,
        false,
        false,
        this.selectedApproch[x]?.assessmentYear[0]?.assessmentYear
      );
      parameters.push(...discountrateParams!);
    }


    let reductionParams = this.createParam(
      'Reduction',
      this.emptyObj,
      this.selectedApproch[x]?.assessmentResult[0].totalEmission.toString(),  // special case  
      this.uomReduction,
      this.emptyVal,
      false,
      false,
      false,
      false,
      this.selectedApproch[x]?.assessmentYear[0]?.assessmentYear
    );
    parameters.push(...reductionParams!);




    if(this.baseScenarioTotalInvestment==0)
    {

      let bsTotalInvestmentParams = this.createParam(
        'Baseline Scenario Total Investment',
        this.bsTotalInvestment,
        this.emptyVal,
        this.emptyVal,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...bsTotalInvestmentParams!);

    }
    else
    {

      let bsTotalInvestmentParams = this.createParam(
        'Baseline Scenario Total Investment',
        this.emptyObj,
        this.baseScenarioTotalInvestment.toString(),
        this.uomCost,
        this.emptyVal,
        true,
        false,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...bsTotalInvestmentParams!);

    }
    

 if(this.bsAnnualOMDefaulVAl != null)
 {
  let bsAnnualOMParams = this.createParam(
    'Baseline Scenario Annual O&M',
    this.emptyObj,
    this.bsAnnualOMDefaulVAl,
    this.emptyVal,
    this.uomCost,
    true,
    false,
    false,
    false,
    this.selectedApproch[x].assessmentYear[0].assessmentYear
  );
  parameters.push(...bsAnnualOMParams!);
 }
 else{
  let bsAnnualOMParams = this.createParam(
    'Baseline Scenario Annual O&M',
    this.bsAnnualOM,
    this.emptyVal,
    this.emptyVal,
    this.uomCost,
    true,
    false,
    false,
    false,
    this.selectedApproch[x].assessmentYear[0].assessmentYear
  );
  parameters.push(...bsAnnualOMParams!);
 }


    

    let bsOtherAnnualCostParams = this.createParam(
      'Baseline Scenario Other Annual Cost',
      this.bsOtherAnnualCost,
      this.emptyVal,
      this.emptyVal,
      this.uomCost,
      true,
      false,
      false,
      false,
      this.selectedApproch[x].assessmentYear[0].assessmentYear
    );
    parameters.push(...bsOtherAnnualCostParams!);



    if(this.baseScenarioProjectLife==0)
    {
      let bsProjectLifeParams = this.createParam(
        'Baseline Scenario Project Life',
        this.bsProjectLife,
        this.emptyVal,
        this.emptyVal,
        this.uomLife,
        true,
        false,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...bsProjectLifeParams!);
    }
    else
    {
      let bsProjectLifeParams = this.createParam(
        'Baseline Scenario Project Life',
        this.emptyObj,
        this.baseScenarioProjectLife.toString(),
        this.uomLife,
        this.emptyVal,
        true,
        false,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...bsProjectLifeParams!);

    }

    

    if(this.bsAnnualFuelDefaulVAl != null)
    {
      let bsAnnualFuelParams = this.createParam(
        'Baseline Scenario Annual Fuel',
        this.emptyObj,
        this.bsAnnualFuelDefaulVAl,
        this.emptyVal,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...bsAnnualFuelParams!);
    }
   else{
    let bsAnnualFuelParams = this.createParam(
      'Baseline Scenario Annual Fuel',
      this.bsAnnualFuel,
      this.emptyVal,
      this.emptyVal,
      this.uomCost,
      true,
      false,
      false,
      false,
      this.selectedApproch[x].assessmentYear[0].assessmentYear
    );
    parameters.push(...bsAnnualFuelParams!);
  }



    



    if(this.projectScenarioTotalInvestment==0)
    {
      let psTotalInvestmentParams = this.createParam(
        'Project Scenario Total Investment',
        this.psTotalInvestment,
        this.emptyVal,
        this.emptyVal,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...psTotalInvestmentParams!);
    }
    else
    {
      let psTotalInvestmentParams = this.createParam(
        'Project Scenario Total Investment',
        this.emptyObj,
        this.projectScenarioTotalInvestment.toString(),
        this.uomCost,
        this.emptyVal,
        false,
        true,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...psTotalInvestmentParams!);

    }

    if(this.psAnnualOMDefaultVAl != null)
    {
      let psAnnualOMParams = this.createParam(
        'Project Scenario Annual O&M',
        this.emptyObj,
        this.psAnnualOMDefaultVAl,
        this.emptyVal,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...psAnnualOMParams!);
    }
    else
    {
      let psAnnualOMParams = this.createParam(
        'Project Scenario Annual O&M',
        this.psAnnualOM,
        this.emptyVal,
        this.emptyVal,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...psAnnualOMParams!);
    }





    

    let psOtherAnnualCostParams = this.createParam(
      'Project Scenario Other Annual Cost',
      this.psOtherAnnualCost,
      this.emptyVal,
      this.emptyVal,
      this.uomCost,
      false,
      true,
      false,
      false,
      this.selectedApproch[x].assessmentYear[0].assessmentYear
    );
    parameters.push(...psOtherAnnualCostParams!);


    if(this.duration==0)
    {
      let psProjectLifeParams = this.createParam(
        'Project Scenario Project Life',
        this.psProjectLife,
        this.emptyVal,
        this.emptyVal,
        this.uomLife,
        false,
        true,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...psProjectLifeParams!);
  
    }
    else
    {
      let psProjectLifeParams = this.createParam(
        'Project Scenario Project Life',
        this.emptyObj,
        this.duration.toString(),
        this.uomLife,
        this.emptyVal,
        false,
        true,
        false,
        false,
        this.selectedApproch[x].assessmentYear[0].assessmentYear
      );
      parameters.push(...psProjectLifeParams!);
  
    }
    

 if(this.psAnnualFuelDefaultVal != null)
 {
  let psAnnualFuelParams = this.createParam(
    'Project Scenario Annual Fuel', //name
    this.emptyObj, //institution
    this.psAnnualFuelDefaultVal,   //value
    this.emptyVal,  // data entry
    this.uomCost, // dat request
    false,
    true,
    false,
    false,
    this.selectedApproch[x].assessmentYear[0].assessmentYear
  );
  parameters.push(...psAnnualFuelParams!);
 }
else{

  let psAnnualFuelParams = this.createParam(
    'Project Scenario Annual Fuel', //name
    this.psAnnualFuel, //institution
    this.emptyVal,   //value
    this.emptyVal,  // data entry
    this.uomCost, // dat request
    false,
    true,
    false,
    false,
    this.selectedApproch[x].assessmentYear[0].assessmentYear
  );
  parameters.push(...psAnnualFuelParams!);
}


      

    assessment.assessmentYear = assesmentYars;
    assessment.assessmentObjective =assessmentObjective;
    assessment.parameters = parameters;


    console.log(assessment);
    console.log('hiiiii.....');
    
    this.serviceProxy
      .createOneBaseAssesmentControllerAssessment(assessment)
      .subscribe((res: any) => {
       // alert('Saved Successfully');
       this.isDisableSaveButton = true;
       this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully sent to Data Collection Team! ',
        closable: true,
      });
      // this.messageService.add({severity:'success', summary: 'Success', detail:'successfully sent to Data Collection Team!.'});

       setTimeout(() => {
     
        
          
      //  this.router.navigate(['/all-result']);
    
      },2000);
      
      
        // this.bsOtherAnnualCost = this.emptyObj;
        // this.bsTotalInvestment  = this.emptyObj;
        // this.psTotalInvestment  = this.emptyObj;
        // this.bsAnnualOM  =this.emptyObj;
        // this.psAnnualOM  =this.emptyObj;
        // this.bsAnnualFuel  =this.emptyObj;
        // this.psAnnualFuel  =this.emptyObj;
        // this.bsProjectLife = this.emptyObj;
        // this.psProjectLife = this.emptyObj;
        // this.psOtherAnnualCost =this.emptyObj;

    //     this.serviceProxy
    //     .getManyBaseAssesmentControllerAssessment(
    //       undefined,
    //       undefined,
    //       undefined,
    //       undefined,
    //       ['createdOn,DESC'],    // ['createdOn, DESC'], // ['createdOn,DESC'],
    //       undefined,
    //       1000,
    //       0,
    //       0,
    //       0
    //     )
    //     .subscribe((res: any) => {
    //       this.createdAssessment = res.data[0];
    //       console.log('climateActions', this.createdAssessment);

    //       this.createdAssessment.project.id = this.slectedProject.id;
    //       this.serviceProxy
    //      .updateOneBaseAssesmentControllerAssessment(this.createdAssessment.id, this.createdAssessment)
    //      .subscribe(
    //      (res) => {
    //      console.log("my response",res);
    //   },
    // );
         
    //     });

       
      });

      
  }//for



}//if


}//method

private createParam(
  name: string,
  institution: Institution,
  value:string,
  uomDataEntry: string,
  uomDataRequest: string,
  isBaseline: boolean,
  isProject: boolean,
  islekage: boolean,
  isProjection: boolean,
  assesmentYear: string
) {
  let parameters: Parameter_Server[] = [];

 

  let param = this.createServerParam(
      name,
      institution,
      value,
      uomDataEntry,
      uomDataRequest,
      assesmentYear,
      undefined,
      false,
      isBaseline,
      isProject,
      islekage,
      isProjection
    );
    parameters.push(param);
  return parameters;
}


createServerParam(
  name: string,
  institution: Institution,
  value:string,
  uomDataEntry:string,
  uomDataRequest:string,
  assesmentYear: string,
  pp: Parameter_Server | undefined,
  isAlternative: boolean,
  isBaseline: boolean,
  isProject: boolean,
  islekage: boolean,
  isProjection: boolean
) {
  let param = new Parameter_Server();
  param.name = name;
  param.institution = institution;
  param.value = value;
  param.uomDataEntry = uomDataEntry;
  param.uomDataRequest = uomDataRequest;
  //param.institution = p.institution;
  param.isAlternative = isAlternative;

  param.assessmentYear =  +assesmentYear;
 // param.useDefaultValue = p.useDefaultValue;
  param.isBaseline = isBaseline;
  param.isProject = isProject;
  param.isLekage = islekage;
  param.isProjection = isProjection;
 // param.route = sp.route;
 // param.powerPlant = sp.powerPlant;
 // param.fuelType = sp.fuel;
 // param.vehical = sp.vehical;
  

  return param;
}


// updateProject()
// {
//   this.serviceProxy
//   .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     1000,
//     0,
//     0,
//     0
//   )
//   .subscribe((res: any) => {
//     this.projectApprovalStatus = res.data;

//     let status = this.projectApprovalStatus.find((a) => a.id === 5);
//     this.slectedProject.projectApprovalStatus = status === undefined ? (null as any) : status;

//     this.serviceProxy
//     .updateOneBaseProjectControllerProject(this.slectedProject.id, this.slectedProject)
//     .subscribe(
//       (res) => {
//         console.log("my response",res);
//       },
//     );

//   });
// }


}
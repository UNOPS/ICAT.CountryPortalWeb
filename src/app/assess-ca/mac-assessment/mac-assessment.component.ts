
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { Assessment, 
  AssessmentYear, 
  Project, 
  ServiceProxy,
  Parameter as Parameter_Server,
  AssessmentObjective,
  AssesmentResaultControllerServiceProxy,
  AssessmentResault,
  ProjectApprovalStatus, 
} from 'shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mac-assessment',
  templateUrl: './mac-assessment.component.html',
  styleUrls: ['./mac-assessment.component.css']
})
export class MacAssessmentComponent implements OnInit,AfterViewInit {

  @Input()
  IsProposal: boolean;
  
  climateActions: Project[] = [];
  assessments: Assessment[] = [];
  newAssessments: any[] = [];
  asseYear: string;
  asseYearNew: string;
  details: any[]=[];
  objectiveOfAsse: string ='';
  slectedProject: Project = new Project();
  ndc :any = '';
  projectApprovalStatus: ProjectApprovalStatus[];
  isDisabled:boolean = true;
  projectStartDate:any;
  @ViewChild('op') overlay: any;
  choosenValMethod: any='';
  reduction: any='';
  ghgAssessmentTypeForMac:any = '';
  proposedAssessmentDetails : any = []; 
  subNdc:any='';
  discountrate : any = null;

  uomDiscountrate : string='%';
  uomCost : string= "$";
  uomReduction : string="tCo2e";
  uomLife : string="years"

  bsOtherAnnualCost: any = null;
  bsTotalInvestment : any = null;
  psTotalInvestment : any = null;
  bsAnnualOM :any =null;
  psAnnualOM :any =null;
  bsAnnualFuel : any =null;
  psAnnualFuel : any =null;
  bsProjectLife:any = null;
  psProjectLife:any = null;
  psOtherAnnualCost: any =null;
  approachList: any = ['Ex-ante', 'Ex-post']

  assessmentList1: Assessment[]=[];
  createdMacAssessment: Assessment = new Assessment();
  createdMacAssessmentId: number;   
  createdMacAssessmentYear: AssessmentYear = new AssessmentYear(); 
  createdMacAssessmentYearId:number;
  calculate: boolean = true;
  result:any;
  years: number[] = [];
  macResults:any;
   macValue :any = 
      {
         "DiscountRate":"",
         "reduction" :"",
         "year":"",
        "baseline": {  
          //baseline details
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
  
    userCountryId:number = 0;
    userSectorId:number = 0;

  isDiasbaleEye:boolean = true;

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

  isDisableSaveButton:boolean = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService :MessageService,
    private assementResultService :AssesmentResaultControllerServiceProxy,
    private httpClient: HttpClient,
    private router: Router,
    ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  formatYear()
  {
    //console.log("hiii yyrr..",this.asseYearNew)
    let x = JSON.stringify(this.asseYearNew);
    //console.log("strting typer..",x);
    this.asseYear = (Number(x.split("-")[0].substring(1))+1).toString();
    //console.log("final yr..",this.asseYear)
    //console.log("type..",typeof(this.asseYearNew))
    //this.asseYear = this.asseYearNew.split(" ")[2];
    // console.log("hiii yyrr..",this.asseYear)
     
  }
  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    //console.log("token payload..",this.userCountryId)


    var year = moment().year();
    for (let i = 1; i < 10; i++) {
      this.years.push(year - i);
      this.years.push(year + i);
    }

    this.years = this.years.sort();


    this.serviceProxy
    .getManyBaseProjectControllerProject(
      undefined,
      undefined,
      undefined,
      undefined,
      ['id,DESC'],
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
      });
     
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
   // console.log('this.slectedProject', this.slectedProject);
   this.isDiasbaleEye = false;
    let filter1: string[] = new Array();
    filter1.push('project.id||$eq||' +this.slectedProject.id)
    this.ndc = this.slectedProject.ndc?.name;
    this.subNdc = this.slectedProject.subNdc?.name;
    this.projectStartDate= moment(this.slectedProject.proposeDateofCommence).format('YYYY-MM-DD');
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
      console.log('assessments', res.data);
     // this.asseYear = this.assessments[0].assessmentYear[0].assessmentYear;
     // console.log('asse year',this.asseYear)
    });



  }
  /*
  isGhg(ast:any): boolean {
    let x = ast.find((o: any)=>o.assessmentType == 'Ex-Ante' || o.assessmentType == 'Ex-Post' ); 
   // console.log("our array obj ", ast);
   // console.log("we have ", x);
    return x;
  }
*/



onChangeDefaultValues(event:any)
{

 // console.log("default check...",this.checked)
}


onStatusChangebsAnnualFuel(event:any)
{
   this.bsAnnualFuel = Number(event.value);
   this.bsfuelCost = event.administrationLevel;
}

onStatusChangepsAnnualFuel(event:any)
{
   this.psAnnualFuel = Number(event.value);
   this.psfuelCost = event.administrationLevel;
}


onStatusChangebsProjectLife(event:any)
{
   this.bsProjectLife = Number(event.value);
   this.bsProjectLifeDisplay = event.administrationLevel;
}

onStatusChangepsProjectLife(event:any)
{
   this.psProjectLife = Number(event.value);
   this.psProjectLifeDisplay = event.administrationLevel;
}

onStatusChangebsAnnualOM(event:any)
{
   this.bsAnnualOM = Number(event.value);
   this.bsOM = event.administrationLevel;
}

onStatusChangepsAnnualOM(event:any)
{
   this.psAnnualOM = Number(event.value);
   this.psOM = event.administrationLevel;
}

onStatusChangexxDiscountRate(event:any)
{
   this.discountrate = Number(event.value);
   this.discountRateDisplay = event.administrationLevel;
}


  mouseEnter()
  {
    this.getData();
  }

  filterYear()
  {
    this.isDisabled = false;
    let filter1: string[] = new Array();
    filter1.push('project.id||$eq||' +this.slectedProject.id)&
    filter1.push('assessmentYear.assessmentYear||$eq||' +this.asseYear)&
    filter1.push('Assessment.assessmentType||$in||' +this.approachList);
    
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
      this.newAssessments = res.data;
     console.log('newassessments', res.data);
     // this.asseYear = this.assessments[0].assessmentYear[0].assessmentYear;
     // console.log('asse year',this.asseYear)
    });
  }

  getData() {

    console.log("this.newAssessments[x]...",this.newAssessments)
    //console.log(this.assessments.length)
  if(this.details.length==0)
  {
    for (let x =0; x<this.newAssessments.length;x++)
    {
      if(this.newAssessments[x]?.assessmentResult[0] != undefined)
      {
        this.details.push({"projData":this.newAssessments[x]?.assessmentResult[0]?.totalEmission+"__"+this.newAssessments[x]?.methodology?.displayName+"__"+this.newAssessments[x]?.assessmentType});
      }
      
    }
  } 
    //console.log(this.details); choosenValMethod
  }


  viewChoosenVal(event: any) {
    console.log("this.choosenValMethod",this.choosenValMethod); 
    this.reduction = this.choosenValMethod.projData.split("__", 2)[0];
    this.ghgAssessmentTypeForMac = this.choosenValMethod.projData.split("__", 3)[2];
    console.log(" this.ghgAssessmentTypeForMac",  this.ghgAssessmentTypeForMac); 
  }

  onDiscountChange($event:any)
  {
  //  console.log("this.reduction", this.reduction); 
  }

  removeDroplistVal()
  {
    this.choosenValMethod = '';
  }

  setValues()
  {
    this.macValue =   
      {
         "DiscountRate":this.discountrate,
         "reduction" :this.reduction,
         "year":this.asseYear,
        "baseline": {  
          //baseline details
         "bsTotalInvestment":this.bsTotalInvestment,
         "bsAnnualOM":this.bsAnnualOM,
         "bsOtherAnnualCost":this.bsOtherAnnualCost,
         "bsAnnualFuel":this.bsAnnualFuel,
         "bsProjectLife":this.bsProjectLife,
        },
       "project": {
          // project details
         "psTotalInvestment":this.psTotalInvestment,
         "psOtherAnnualCost":this.psOtherAnnualCost,
         "psAnnualOM":this.psAnnualOM,
         "psAnnualFuel":this.psAnnualFuel,
         "psProjectLife":this.psProjectLife,
        },
      
    }
   // console.log("fial val ",this.macValue)
  }

  detail() {
    if (this.slectedProject) {
      this.router.navigate(['/propose-project'], {
        queryParams: { id: this.slectedProject.id },
      });
    }
  }




  createAssementCA(data: NgForm) {

    this.macValue =   
      {
         "DiscountRate":this.discountrate,
         "reduction" :this.reduction,
         "year":this.asseYear,
        "baseline": {  
          //baseline details
         "bsTotalInvestment":this.bsTotalInvestment,
         "bsAnnualOM":this.bsAnnualOM,
         "bsOtherAnnualCost":this.bsOtherAnnualCost,
         "bsAnnualFuel":this.bsAnnualFuel,
         "bsProjectLife":this.bsProjectLife,
        },
       "project": {
          // project details
         "psTotalInvestment":this.psTotalInvestment,
         "psOtherAnnualCost":this.psOtherAnnualCost,
         "psAnnualOM":this.psAnnualOM,
         "psAnnualFuel":this.psAnnualFuel,
         "psProjectLife":this.psProjectLife,
        }
      }




      //API CAll HERE






    //  console.log("to pradeep ",this.macValue)

    if (data.form.valid) {
      let assessment = new Assessment();
     // assessment.baseYear = this.baseYear.getFullYear();
     // var ndc = new Ndc();
     // ndc.id = this.selectedNdc.id;
     // var subndc = new SubNdc();
     // subndc.id = this.selctedSubNdc.id;
     // assessment.subNdc = subndc;
     // assessment.ndc = ndc;
      assessment.projectDuration = this.slectedProject.duration;
      assessment.projectStartDate = moment(this.slectedProject.proposeDateofCommence);
      assessment.emmisionReductionValue = this.reduction;
     // assessment.isGuided = this.isGuidedSelection;
      assessment.assessmentType = 'MAC';
      assessment.ghgAssessTypeForMac = this.ghgAssessmentTypeForMac;
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
      ae.assessmentYear = this.asseYear;
      assesmentYars.push(ae);
      ao.objective = this.objectiveOfAsse;
      console.log("my object.....",this.objectiveOfAsse);
      assessmentObjective.push(ao);
      

      let discountrateParams = this.createParam(
        'Discount Rate',
        this.discountrate,
        this.uomDiscountrate,
        false,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...discountrateParams!);

      let reductionParams = this.createParam(
        'Reduction',
        this.reduction,
        this.uomReduction,
        false,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...reductionParams!);
  
      let bsTotalInvestmentParams = this.createParam(
        'Baseline Scenario Total Investment',
        this.bsTotalInvestment,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...bsTotalInvestmentParams!);

      let bsAnnualOMParams = this.createParam(
        'Baseline Scenario Annual O&M',
        this.bsAnnualOM,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...bsAnnualOMParams!);

      let bsOtherAnnualCostParams = this.createParam(
        'Baseline Scenario Other Annual Cost',
        this.bsOtherAnnualCost,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...bsOtherAnnualCostParams!);

      let bsProjectLifeParams = this.createParam(
        'Baseline Scenario Project Life',
        this.bsProjectLife,
        this.uomLife,
        true,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...bsProjectLifeParams!);


      let bsAnnualFuelParams = this.createParam(
        'Baseline Scenario Annual Fuel',
        this.bsAnnualFuel,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear
      );
      parameters.push(...bsAnnualFuelParams!);



      let psTotalInvestmentParams = this.createParam(
        'Project Scenario Total Investment',
        this.psTotalInvestment,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear
      );
      parameters.push(...psTotalInvestmentParams!);

      let psAnnualOMParams = this.createParam(
        'Project Scenario Annual O&M',
        this.psAnnualOM,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear
      );
      parameters.push(...psAnnualOMParams!);

      let psOtherAnnualCostParams = this.createParam(
        'Project Scenario Other Annual Cost',
        this.psOtherAnnualCost,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear
      );
      parameters.push(...psOtherAnnualCostParams!);

      let psProjectLifeParams = this.createParam(
        'Project Scenario Project Life',
        this.psProjectLife,
        this.uomLife,
        false,
        true,
        false,
        false,
        this.asseYear
      );
      parameters.push(...psProjectLifeParams!);


      let psAnnualFuelParams = this.createParam(
        'Project Scenario Annual Fuel',
        this.psAnnualFuel,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear
      );
      parameters.push(...psAnnualFuelParams!);
          

         

         

         


     

      assessment.assessmentYear = assesmentYars;
      assessment.assessmentObjective =assessmentObjective;
      assessment.parameters = parameters;


     // console.log(assessment);

      this.serviceProxy
        .createOneBaseAssesmentControllerAssessment(assessment)
        .subscribe((res: any) => {
        
          this.isDisableSaveButton = true;

        



          this.serviceProxy.getManyBaseAssesmentControllerAssessment
          (
            undefined,
            undefined,
            undefined,
            undefined,
            ["editedOn,DESC"],
            undefined,
            1,
            0,
            0,
            0
          )
          .subscribe((res: any) => {
            this.createdMacAssessment = res.data[0];
           // console.log('mac----assessments',this.createdMacAssessment);
            this.createdMacAssessmentId = this.createdMacAssessment.id;
            console.log('mac----assessments--id',this.createdMacAssessmentId);
            this.messageService.add({severity:'success', summary:'Confirmed', detail:'You have successfully Created & Wait for few seconds!.'});
            this.serviceProxy.getManyBaseAssessmentYearControllerAssessmentYear
            (
              undefined,
              undefined,
              undefined,
              undefined,
              ["id,DESC"],
              undefined,
              1,
              0,
              0,
              0
            )
            .subscribe((res: any) => {
              this.createdMacAssessmentYear = res.data[0];
              //console.log('mac----assessments',this.createdMacAssessmentYear);
              this.createdMacAssessmentYearId = this.createdMacAssessmentYear.id;
              console.log('mac----assessments--year',this.createdMacAssessmentYearId);

              let macUrl = environment.baseUrlMac;//  console.log("my url...",Url)
              let headers = new HttpHeaders().set('api-key','1234');
             // let fullUrl = 'http://3.110.47.158:3600/mac';
             console.log("going to call cal engine...,macUrl")
              this.httpClient.post<any>(macUrl, this.macValue,{'headers':headers}).subscribe(
                (res) => {
                 // this.load();
                 this.result = res;
               // console.log("=================================");
                console.log("my mac...",res);
               // console.log("my mac111...",res['baseLineAnnualCost']);


                 let asrslt = new AssessmentResault();
                 asrslt.bsTotalAnnualCost = res['baseLineAnnualCost'];
                 asrslt.psTotalAnnualCost = res['projecrAnnualCost'];
                 asrslt.costDifference = res['totalAnnualCost'];  //this should be checked
                 asrslt.macResult = res['mac']; //this.result.mac;
                 asrslt.assessmentYear.id = this.createdMacAssessmentYearId;
                 asrslt.assement.id = this.createdMacAssessmentId;

                 this.serviceProxy
                 .createOneBaseAssesmentResaultControllerAssessmentResault(asrslt)
                 .subscribe((res: any) => {
                 
                  this.serviceProxy.getManyBaseAssesmentControllerAssessment(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    ["editedOn,DESC"],
                    undefined,
                    1,
                    0,
                    0,
                    0
                   ).subscribe((res: any) => {
                    this.assessmentList1 = res.data;
                   // console.log("Ass...",this.assessmentList1);
                    this.router.navigate(['/mac-result'],{
                    queryParams: { id: this.assessmentList1[0]?.id}
                  })  


                  },
                  (error)=>{

                    this.bsOtherAnnualCost = '';
                    this.bsTotalInvestment  = '';
                    this.psTotalInvestment  = '';
                    this.bsAnnualOM  ='';
                    this.psAnnualOM  ='';
                    this.bsAnnualFuel  ='';
                    this.psAnnualFuel  ='';
                    this.bsProjectLife = '';
                    this.psProjectLife = '';
                    this.psOtherAnnualCost ='';

                    this.messageService.add({severity:'error', summary: 'Error', detail:'Error,please try again!.'});
                  }
                  );
                


                 
                  
                  //this.messageService.add({severity:'success', summary:'Confirmed', detail:'result saved!.'});
                 // alert('Saved Successfully');
                 });
               
         


                },
                (err) => console.log('cal engine issue please check the engine..........................=======')
              );
              



            });


          });



          

         // alert('Saved Successfully');
        
        });
    }
   
  }



  private createParam(
    name: string,
    value: string,
    UOMDataentry: string,
    isBaseline: boolean,
    isProject: boolean,
    islekage: boolean,
    isProjection: boolean,
    assesmentYear: string
  ) {
    let parameters: Parameter_Server[] = [];

   

    let param = this.createServerParam(
        name,
        value,
        UOMDataentry,
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
    value: string,
    UOMDataentry: string,
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
    //param.institution = p.institution;
    param.isAlternative = isAlternative;
    param.uomDataEntry = UOMDataentry;
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
    param.value = value;

    return param;
  }
  

}

import { Component, Input, OnInit,ViewChild  } from '@angular/core';
// import {Headers} from 'angular2/http';
import { HttpHeaders } from '@angular/common/http';
import ParameterSection from 'app/Model/parameter-section';
import ParameterDimensionSelection from 'app/Model/parameter-dimension-selection';
import decode from 'jwt-decode';
import * as moment from 'moment';
import {
  Assessment,
  AssessmentYear,
  Institution,
  Parameter as Parameter_Server,
  Methodology,
  MitigationActionType,
  Ndc,
  Project,
  ServiceProxy,
  SubNdc,
  AssessmentObjective,
  ProjectionYear,
  DefaultValue,
  ApplicabilityEntity,
  ParameterControllerServiceProxy,
  AssesmentResaultControllerServiceProxy,
  AssessmentYearControllerServiceProxy,
  InstitutionControllerServiceProxy,
  ProjectApprovalStatus,
  AssesmentControllerServiceProxy,
  ApplicabilityControllerServiceProxy,
  DefaultValueControllerServiceProxy,
  User,
  Country,
  ParameterRequestControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import Parameter from 'app/Model/parameter';
import ParameterSections from 'app/Model/parameter-sections';
import SectionParameter from 'app/Model/section-parameter';

import { NgForm } from '@angular/forms';
import { ProjectIndicaters } from 'app/Model/projection-indicaters.enum';
import { EasyofuseDatacollection } from 'app/Model/easy-of-use-data-Collection.enum';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { environment } from 'environments/environment';
import { empty, Observable } from 'rxjs';
import { MessageService, SelectItem } from 'primeng/api';
import { Router ,ActivatedRoute} from '@angular/router';
import { MethodologyControllerServiceProxy,  } from 'shared/service-proxies/service-proxies';
import { ParameterInfo } from '../parameter-info.enum';
import { FuelParameterComponent } from '../fuel-parameter/fuel-parameter.component';
import { VehicalParameterComponent } from '../vehical-parameter/vehical-parameter.component';

declare type ParaInfoType = keyof typeof ParameterInfo;


@Component({
  selector: 'app-ghg-assessment',
  templateUrl: './ghg-assessment.component.html',
  styleUrls: ['./ghg-assessment.component.css'],
})
export class GhgAssessmentComponent implements OnInit {

  @ViewChild(FuelParameterComponent) child1Component: FuelParameterComponent; 
  @ViewChild(VehicalParameterComponent) child2Component: VehicalParameterComponent;
  // @ViewChild(Child3Component) child3Component: Child3Component;

  @Input()
  IsProposal: boolean;

  common: string = 'Common';
  climateActions: Project[] = [];
  selectedClimateAction: Project;
  baseYear: Date;
  assesmentYear: Date;
  years: SelectItem[] = new Array();
  selectYears: number[];
  selectedObjective: AssessmentObjective[] = [];
  approachList: string[] = ['Ex-ante', 'Ex-post'];
  selectedApproch: string;
  isGuidedSelection: boolean = false;

  hasCommonBaseline: boolean = false;
  hasCommonProject: boolean = false;
  hasCommonLeakage: boolean = false;

  routes: any[] = [];
  powerPlants: any[] = [];
  stratums: any[] = [];

  baslineParam: any = [];
  ProjectParam: any = [];
  lekageParam: any = [];
  methodologyCode: string;
  methodologyVersion: string;

  useRoute: boolean = false;
  usePowerPlant: boolean = false;
  useStratum: boolean = false;

  baselineScenario: string = '';
  ProjectScenario: string = '';
  LeakageScenario: string = '';

  blHasVehicale: boolean = false;
  blHasFuel: boolean = false;
  blHasRoute: boolean = false;
  blHasPowerPlant: boolean = false;
  blHasFeedstock: boolean = false;
  blHasSoil: boolean = false;
  blHasStratum: boolean = false;
  blHasResidue: boolean = false;
  blHasLandClearance: boolean = false;

  blHasVehicaleMulti: boolean = false;
  blHasFuelMulti: boolean = false;
  blHasRouteMulti: boolean = false;
  blHasPowerPlantMulti: boolean = false;
  blHasFeedstockMulti: boolean = false;
  blHasSoilMulti: boolean = false;
  blHasStratumMulti: boolean = false;
  blHasResidueMulti: boolean = false;
  blHasLandClearanceMulti: boolean = false;

  prHasVehicale: boolean = false;
  prHasFuel: boolean = false;
  prHasRoute: boolean = false;
  prHasPowerPlant: boolean = false;
  prHasFeedstock: boolean = false;
  prHasSoil: boolean = false;
  prHasStratum: boolean = false;
  prHasResidue: boolean = false;
  prHasLandClearance: boolean = false;

  prHasVehicaleMulti: boolean = false;
  prHasFuelMulti: boolean = false;
  prHasRouteMulti: boolean = false;
  prHasPowerPlantMulti: boolean = false;
  prHasFeedstockMulti: boolean = false;
  prHasSoilMulti: boolean = false;
  prHasStratumMulti: boolean = false;
  prHasResidueMulti: boolean = false;
  prHasLandClearanceMulti: boolean = false;

  lkHasVehicale: boolean = false;
  lkHasFuel: boolean = false;
  lkHasRoute: boolean = false;
  lkHasPowerPlant: boolean = false;
  lkHasFeedstock: boolean = false;
  lkHasSoil: boolean = false;
  lkHasStratum: boolean = false;
  lkHasResidue: boolean = false;
  lkHasLandClearance: boolean = false;

  lkHasVehicaleMulti: boolean = false;
  lkHasFuelMulti: boolean = false;
  lkHasRouteMulti: boolean = false;
  lkHasPowerPlantMulti: boolean = false;
  lkHasFeedstockMulti: boolean = false;
  lkHasSoilMulti: boolean = false;
  lkHasStratumMulti: boolean = false;
  lkHasResidueMulti: boolean = false;
  lkHasLandClearanceMulti: boolean = false;

  blVehicalValue: any = [];
  blFuelValue: any = [];
  blFeedstockValue: any = [];
  blSoilValue: any = [];
  blResidueValue: any = [];
  blLandClearanceValue: any = [];


  prVehicalValue: any = [];
  prFuelValue: any = [];
  prFeedstockValue: any = [];
  prSoilValue: any = [];
  prResidueValue: any = [];
  prLandClearanceValue: any = [];

  lkVehicalValue: any = [];
  lkFuelValue: any = [];
  lkFeedstockValue: any = [];
  lkSoilValue: any = [];
  lkResidueValue: any = [];
  lkLandClearanceValue: any = [];



  basllineSelection: ParameterDimensionSelection[] = [];
  projectSelection: ParameterDimensionSelection[] = [];
  lekageSelection: ParameterDimensionSelection[] = [];

  isSaveRoutePowerplantStratum : boolean = true;
  routePowerPlantMaintain: boolean = true;

  showBaslineGenrate: boolean = true;
  baselineShowMaintain: boolean = true;

  showProjectGenrate: boolean = true;
  projectShowMaintain: boolean = true;

  showLekageGenrate: boolean = true;
  lekageShowMaintain: boolean = true;

  pBYPDDefaultValue: boolean = false;

  route: string = 'rout';
  fuel: string = 'fuel';
  vehicle: string = 'vehicle';
  power: string = 'power plant';
  feedstock: string = 'feedstock';
  soil: string = 'soil';
  stratum: string = 'stratum';
  residue: string = 'residue';
  landclearance: string = 'land clearance';



  blParameters: ParameterSections;
  prParameters: ParameterSections;
  lkParameters: ParameterSections;

  methodologys: Methodology[] = [];
  methodologysCopy: Methodology[] = [];
  methodologyList: Methodology[] = [];
  selectedMethodology: Methodology;

  defaultValues: DefaultValue[] = [];

  uniqdefaultValues: DefaultValue[] = [];
  uniqdeParaName:any[] = [];
  ndcList: Ndc[];
  selectedNdc: Ndc;
  selctedSubNdc: SubNdc;
  proposeDateofCommence: Date;
  projectDuration: number;

  mitigationActionType: MitigationActionType[] = [];
  assesmentObjective: AssessmentObjective[] = [];
  selectedMitigationActionType: MitigationActionType | undefined;

  applicability: ApplicabilityEntity[] =[];
  arrEsy:any[] = [];
  selectedApplicability: ApplicabilityEntity[];

  ProjectIndicaterEnum = ProjectIndicaters;
  hasPrevActiveCA:boolean= false;

  projectIndicaters: string[] = [
    ProjectIndicaters[ProjectIndicaters['Population Growth (POP)']],
    ProjectIndicaters[ProjectIndicaters['Gross Domestic Production (GDP)']],
  ];

  // projectionBaseMaxDate: Date = new Date();
  // projectionBaseMinDate: Date = new Date();

  projectionBaseyears: number[] = [];

  EasyofuseDatacollection = EasyofuseDatacollection;

  easyofuseDatacollections: string[] = [
    EasyofuseDatacollection[
      EasyofuseDatacollection['Highly Resource and Data intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Highly Resource and Low Data Intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Highly Resource and Moderately Data Intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Low Resource and Data Intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Low Resource and Highly Data intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Low Resource and Moderately Data Intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Moderately Resource and Data Intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Moderately Resource and Highly data intensive']
    ],
    EasyofuseDatacollection[
      EasyofuseDatacollection['Moderately Resource and Low Data Intensive']
    ],
  ];

  selectedEasyofdataCollection: string | undefined;
  selectedprojectIndicater: string;
  ProjectionbaseYear: number;
  instiTutionList: Institution[];
  selectdProjectionBaseYearInstition: Institution;
  selectdProjectionBaseYearValue: string;
  ProjectionBaseYeardefaultValues: DefaultValue[];
  selectdProjectionBaseYeardefaultValue: DefaultValue;

  projectionYears: number[] = [];
  selectdProjectionYearInstition: Institution;
  selectdProjectionYearValue: string;
  ProjectionYear: Date;
  ProjectionYeardefaultValues: DefaultValue[];
  selectdProjectionYeardefaultValue: DefaultValue;

  showAddObjective: boolean;
  newObjective: string;
  isSave: boolean;
  savedAsessment: Assessment;
  isDiasbaleEye:boolean = true;
  projectApprovalStatus: ProjectApprovalStatus[];

  selectedAssessementByCA:Assessment[] = [];
  assementYearAndTypeObjectList:any[] =[];
  warningMessage:any='';
  isDisableforSubmitButton:boolean = false;
  isSubmitted:boolean = false;
  isClimateActionListDisabled:boolean = false;
  isMethodologyDisabled:boolean =false;
  isMitigationListDisabled:boolean =false;
  isApplicabilityListDisabled:boolean =false;
  countOfMitigationActionDropDownList:number = 0;
  methodologysForApplicability: Methodology[] = [];
  countryCode:string='';
  userName:string='';
  loggedUser:User;
  userCountryId:number = 0;
  userSectorId:number = 0;
  mitigationIdList:any[]= [];
  selectBaselineVeicle:boolean=true;
  selectBaseLineFuel:boolean=true;
  selectProjectVeicle:boolean=true;
  selectProjectFuel:boolean=true;
  isDisableAfterSubmit:boolean = false;

  methodAssessments: any[];
  methodParaCodes: any[];

  infos: any = {};

  requiredParas: boolean = true;

  projectId:number;
  project:Project;

  constructor(
    private methodologyProxy: MethodologyControllerServiceProxy,
    private router: Router,
    private route1: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy,
    private http: HttpClient,
    private defaultValueControllerServiceProxy: DefaultValueControllerServiceProxy,
    private messageService: MessageService,
    private assesmentResaultProxy: AssesmentResaultControllerServiceProxy,
    private assesmentYearProxy: AssessmentYearControllerServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy,
    private assessmentProxy: AssesmentControllerServiceProxy,
    private applicabilityControllerServiceProxy:ApplicabilityControllerServiceProxy,
    private parameterRequestControllerServiceProxy:ParameterRequestControllerServiceProxy,
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    var year = moment().year();
    this.years.push({label: year.toString(),value: year });
    for (let i = 1; i < 30; i++) {
      // this.years.push({label: (year - i).toString(),value: year - i });
      this.years.push({label: (year + i).toString(),value: year + i });
    }

    this.userName = localStorage.getItem('user_name')!;
    let filterUser: string[] = [];
    filterUser.push('username||$eq||' + this.userName);
    
    this.route1.queryParams.subscribe((params) => {
      this.projectId = 0;
      this.projectId = params['id'];
      console.log("projectId",this.projectId)
    });
    this.serviceProxy
    .getManyBaseNdcControllerNdc(
      undefined,
      undefined,
      undefined,
      undefined,
      ['name,ASC'],
      ['subNdc'],
      1000,
      0,
      0,
      0
    )
    .subscribe((res: any) => {
      this.ndcList = res.data;
      this.ndcList = this.ndcList.filter((o)=>o.country.id == this.userCountryId && o.sector.id == this.userSectorId);
      console.log("+++++++++",this.ndcList)
    });

    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filterUser,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {   


      this.loggedUser = res.data[0];
     // this.fullname = this.loggedUser.firstName+" "+this.loggedUser.lastName;
      this.countryCode = this.loggedUser.country.code_extended;
      console.log("this.loggedUser...",this.countryCode);
     
      });

    this.years = this.years.sort(function(a,b) {return a.value - b.value});
    this.addRoute();
    this.addPowerPlant();
    this.addStratum ();
   

    this.serviceProxy
      .getManyBaseDefaultValueControllerDefaultValue(
        undefined,
        undefined,
        ['country.id||$eq||'+this.userCountryId],
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
       // this.methodologys = this.methodologys.filter((o)=>o.country.id == this.userCountryId);
        this.defaultValues = res.data;
        this.defaultValues.forEach((a)=>{
          let name= a.parameterName+" " +a.administrationLevel +" "+a.country.id;
          if(!this.uniqdeParaName.includes(name)){
            this.uniqdeParaName.push(name)
          }
        })

        //this.defaultValues = this.defaultValues.filter((o)=>o.country.id == this.userCountryId || o.country.id == null);
        console.log("my default values..",this.defaultValues);
        this.defaultValues.map(
          (a) =>
            (a.name = `${a.value} - ${a.unit} - ${a.administrationLevel} - ${a.source}  - ${a.year}`)
        );
      });
      var filterMeth: any = ['isActive||$eq||' + 1];
    this.serviceProxy
      .getManyBaseMethodologyControllerMethodology(
        undefined,
        undefined,
        filterMeth,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
       // this.climateActions = this.climateActions.filter((o)=>o.country.id == this.userCountryId && o.sector.id == this.userSectorId)
        
        this.methodologys = res.data;
        this.methodologys = this.methodologys.filter((o)=>o.country.id == this.userCountryId);
        this.methodologysCopy = this.methodologys;
        this.methodologyList = this.methodologys;

        this.methodologyList.map((a)=>{

          if(a.displayName.length>110)
          {
            a.displayName = a.displayName.substring(0,105)+".....";
          }
         

        });

        for(let meth of this.methodologyList)
        {

           this.mitigationIdList.push(meth.mitigationActionType.id);
        }
        this.mitigationIdList = [...new Set(this.mitigationIdList)];
        console.log("this.mitigationIdList....", this.mitigationIdList);
        var mitifilter: any = ['id||$in||' +this.mitigationIdList];
        this.serviceProxy
          .getManyBaseMitigationActionControllerMitigationActionType(
            undefined,
            undefined,
            mitifilter,
            undefined,
            ['name,ASC'],
            undefined,
            1000,
            0,
            0,
            0
          )
          .subscribe((res: any) => {
            this.mitigationActionType = res.data;
            
    
            // filter mitigation actions which are belong to isactive methodologies..
            this.mitigationActionType = this.mitigationActionType.filter((a)=>a.methodology.find((b)=>b.isActive == 1));
            console.log('this.mitigationActionType..',this.mitigationActionType);
          });
      });
      // this.methodologyProxy.getMethoDetails(1,50,'').subscribe((a) => {
        
      //   this.methodologys = a.items;
      //   this.methodologyList = a.meta.totalItems;
      // console.log('kkkk',this.methodologys)
       
      
      // })

    var filter: any = ['projectApprovalStatus.id||$in||' + [1, 5]];
    if (this.IsProposal) {
      filter = undefined;
      // projfilter.push('projectApprovalStatus.id||$in||' +[1,5])
    }

   
if(this.projectId && this.projectId>0){
  

  this.serviceProxy
  .getOneBaseProjectControllerProject(
    this.projectId,
    undefined,
    undefined,
    0
  )
  .subscribe(async (res) => {
    this.selectedClimateAction=res
    this.climateActions.push(res)
    this.projectDuration =res.duration;
    this.selectedNdc = this.ndcList.find(
      (a) => a.name === res.previousNdc
    )!;

    this.selctedSubNdc = this.selectedNdc?.subNdc.find(
      (a) => a.id === this.selectedClimateAction.subNdc?.id
    )!;

    this.proposeDateofCommence=new Date(
      this.selectedClimateAction.proposeDateofCommence.year(),
      this.selectedClimateAction.proposeDateofCommence.month(),
      this.selectedClimateAction.proposeDateofCommence.date()
    );
   
    
  })
}
else{
  this.serviceProxy
  .getManyBaseProjectControllerProject(
    undefined,
    undefined,
    filter,
    undefined,
    ['id,DESC'],
    undefined,
    1000,
    0,
    0,
    0
  )
  .subscribe((res: any) => {

    // console.log('this.userCountryId',this.userCountryId,this.userSectorId)
    this.climateActions = res.data;
    // console.log('this.userCountryId',  this.climateActions)
    this.climateActions = this.climateActions.filter(o=>o.country?o.country.id == this.userCountryId:false && o.sector?o.sector.id == this.userSectorId:false)
    // console.log('this.userCountryId',  this.climateActions)


  });

 
}
    

   


 

    this.serviceProxy
      .getManyBaseAssessmentObjectiveControllerAssessmentObjective(
        undefined,
        undefined,
        ['assessmentId||$isnull'],
        undefined,
        ['objective,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.assesmentObjective = res.data;
      });

    // this.serviceProxy
    //   .getManyBaseApplicabilityControllerApplicabilityEntity(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.applicability = res.data;
    //   });

    // this.instituationProxy
    //   .getInstitutionforAssesment()
    //   .subscribe((res: any) => {
    //     this.instiTutionList = res;
    //     console.log(this.instiTutionList);
    //   });

    let intTypeFilter: string[] = new Array();

    intTypeFilter.push('type.id||$eq||' + 3);

    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        undefined,
        intTypeFilter,
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
      });

    this.basllineSelection.push(new ParameterDimensionSelection().createNew());
    this.projectSelection.push(new ParameterDimensionSelection().createNew());
    this.lekageSelection.push(new ParameterDimensionSelection().createNew());
  }

  loadJson() {
    this.getMethodologyParam().subscribe((methParam) => {
      if (methParam !== undefined && methParam.methodology !== undefined) {
        this.methodologyCode = methParam.methodology.code;
        this.methodologyVersion = methParam.methodology.versionnumber;

        this.baslineParam = this.getParam('baseline', methParam.methodology);
        this.ProjectParam = this.getParam('project', methParam.methodology);
        this.lekageParam = this.getParam('leakage', methParam.methodology);

        console.log("+++++++++++++++",this.baslineParam);
       [ this.blHasVehicale,this.blHasVehicaleMulti] = this.isHaveDiminsionType(
          this.vehicle,
          this.baslineParam
        );
        this.blVehicalValue = this.getDiminsionTypeValue(
          this.vehicle,
          this.baslineParam
        );
        console.log("+++++++++++++++",this.blVehicalValue);
        [this.blHasFuel,this.blHasFuelMulti] = this.isHaveDiminsionType(this.fuel, this.baslineParam);
        this.blFuelValue = this.getDiminsionTypeValue(
          this.fuel,
          this.baslineParam
        );

        [this.blHasPowerPlant,this.blHasPowerPlantMulti] = this.isHaveDiminsionType(
          this.power,
          this.baslineParam
        );

        [this.blHasRoute,this.blHasRouteMulti] = this.isHaveDiminsionType(
          this.route,
          this.baslineParam
        );
       [ this.blHasStratum,this.blHasStratumMulti]= this.isHaveDiminsionType(
          this.stratum,
          this.baslineParam
        );


        
        [this.blHasSoil,this.blHasSoilMulti] = this.isHaveDiminsionType(
          this.soil,
          this.baslineParam
        );
        this.blSoilValue = this.getDiminsionTypeValue(
          this.soil,
          this.baslineParam
        );

        [this.blHasResidue,this.blHasResidueMulti ]= this.isHaveDiminsionType(
          this.residue,
          this.baslineParam
        );

        this.blResidueValue = this.getDiminsionTypeValue(
          this.residue,
          this.baslineParam
        );

        [this.blHasFeedstock,this.blHasFeedstockMulti] = this.isHaveDiminsionType(
          this.feedstock,
          this.baslineParam
        );
        this.blFeedstockValue = this.getDiminsionTypeValue(
          this.feedstock,
          this.baslineParam
        );

        [this.blHasLandClearance,this.blHasLandClearanceMulti]= this.isHaveDiminsionType(
          this.landclearance,
          this.baslineParam
        );
        this.blLandClearanceValue = this.getDiminsionTypeValue(
          this.landclearance,
          this.baslineParam
        );





        [this.prHasVehicale,this.prHasVehicaleMulti] = this.isHaveDiminsionType(
          this.vehicle,
          this.ProjectParam
        );
        this.prVehicalValue = this.getDiminsionTypeValue(
          this.vehicle,
          this.ProjectParam
        );
        [this.prHasFuel,this.prHasFuelMulti] = this.isHaveDiminsionType(this.fuel, this.ProjectParam);
        this.prFuelValue = this.getDiminsionTypeValue(
          this.fuel,
          this.ProjectParam
        );
        [this.prHasPowerPlant] = this.isHaveDiminsionType(
          this.power,
          this.ProjectParam
        );

        [this.prHasRoute,this.prHasRouteMulti] = this.isHaveDiminsionType(
          this.route,
          this.ProjectParam
        );

        [this.prHasStratum,this.prHasStratumMulti]= this.isHaveDiminsionType(
          this.stratum,
          this.ProjectParam
        );



        [this.prHasSoil,this.prHasSoilMulti] = this.isHaveDiminsionType(
          this.soil,
          this.ProjectParam
        );
        this.prSoilValue = this.getDiminsionTypeValue(
          this.soil,
          this.ProjectParam
        );

        [this.prHasResidue,this.prHasResidueMulti] = this.isHaveDiminsionType(
          this.residue,
          this.ProjectParam
        );
        this.prResidueValue = this.getDiminsionTypeValue(
          this.residue,
          this.ProjectParam
        );

        [this.prHasFeedstock,this.prHasFeedstockMulti] = this.isHaveDiminsionType(
          this.feedstock,
          this.ProjectParam
        );
        this.prFeedstockValue = this.getDiminsionTypeValue(
          this.feedstock,
          this.ProjectParam
        );

        [this.prHasLandClearance,this.prHasLandClearanceMulti]= this.isHaveDiminsionType(
          this.landclearance,
          this.ProjectParam
        );
        this.prLandClearanceValue = this.getDiminsionTypeValue(
          this.landclearance,
          this.ProjectParam
        );


        [this.lkHasVehicale,this.lkHasVehicaleMulti] = this.isHaveDiminsionType(
          this.vehicle,
          this.lekageParam
        );
        this.lkVehicalValue = this.getDiminsionTypeValue(
          this.vehicle,
          this.lekageParam
        );
       [ this.lkHasFuel,this.lkHasFuelMulti] = this.isHaveDiminsionType(this.fuel, this.lekageParam);
        this.lkFuelValue = this.getDiminsionTypeValue(
          this.fuel,
          this.lekageParam
        );
        [this.lkHasPowerPlant,this.lkHasPowerPlantMulti] = this.isHaveDiminsionType(
          this.power,
          this.lekageParam
        );

        [this.lkHasRoute,this.lkHasRouteMulti] = this.isHaveDiminsionType(
          this.route,
          this.lekageParam
        );
        [this.lkHasStratum,this.lkHasStratumMulti]= this.isHaveDiminsionType(
          this.stratum,
          this.lekageParam
        );




        [this.lkHasSoil,this.lkHasSoilMulti] = this.isHaveDiminsionType(
          this.soil,
          this.lekageParam
        );
        this.lkSoilValue = this.getDiminsionTypeValue(
          this.soil,
          this.lekageParam
        );
        
        [this.lkHasResidue,this.lkHasResidueMulti] = this.isHaveDiminsionType(
          this.residue,
          this.lekageParam
        );
        this.lkResidueValue = this.getDiminsionTypeValue(
          this.residue,
          this.lekageParam
        );
        
        

       [ this.lkHasFeedstock,this.lkHasFeedstockMulti] = this.isHaveDiminsionType(
          this.feedstock,
          this.lekageParam
        );
        this.lkFeedstockValue = this.getDiminsionTypeValue(
          this.feedstock,
          this.lekageParam
        );

        [this.lkHasLandClearance,this.lkHasLandClearanceMulti]= this.isHaveDiminsionType(
          this.landclearance,
          this.lekageParam
        );
        this.lkLandClearanceValue = this.getDiminsionTypeValue(
          this.landclearance,
          this.lekageParam
        );




        this.useRoute =
          this.isHaveDiminsionType(this.route, this.baslineParam)[0] ||
          this.isHaveDiminsionType(this.route, this.ProjectParam)[0];

        this.usePowerPlant =
          this.isHaveDiminsionType(this.power, this.baslineParam)[0] ||
          this.isHaveDiminsionType(this.power, this.ProjectParam)[0];

          //have to check this logic
        this.useStratum =
          this.isHaveDiminsionType(this.stratum, this.baslineParam)[0] ||
          this.isHaveDiminsionType(this.stratum, this.ProjectParam)[0];
          console.log("+++++++++++++++",this.useRoute);


      } else {
        this.baslineParam = [];
        this.ProjectParam = [];
        this.lekageParam = [];
        this.methodologyCode = '';
        this.useRoute = false;
        this.usePowerPlant = false;
        this.useStratum = false;

        this.messageService.add({
          severity: 'warn',
          summary: 'Methodology',
          detail: 'No details found for selected methodology.',
          closable: true,
        });
      }
    });
  }

  getParam(category: string, methParam: any) {
    return methParam.parameters.filter((a: any) => a.category === category);
  }

  isHaveDiminsionType(type: string, param: any) {
    let hasvalue = false;
    let multi=false;
    if (param !== undefined && param !== null) {
      param.map((p: any) => {
        let dimnsions = p.dimensions;
        if (dimnsions !== undefined) {
          let route = dimnsions.find((a: any) => a.type === type);
          if (route !== undefined && route !== null) {hasvalue = true;
          route.multyselect=='true'?multi=true:multi=false
          
          }
          
        }
      });
    }

    return [hasvalue,multi];
  }

  getDiminsionTypeValue(type: string, param: any) {
    let Values: any = [];
    if (param !== undefined && param !== null) {
      param.map((p: any) => {
        let dimnsions = p.dimensions;
        
        if (dimnsions !== undefined) {
         
          let route = dimnsions.find((a: any) => a.type === type);
          {
          
            if (route !== undefined && route !== null) Values = route.values;
          
            return;
          }
        }
      });
    }

    return Values;
  }

  getDiminsion(type: string, param: any) {
    let diminsion: any;
    if (param !== undefined && param !== null) {
      param.map((p: any) => {
        let dimnsions = p.dimensions;
        if (dimnsions !== undefined) {
          var param = dimnsions.find((a: any) => a.type === type);
          if (param !== undefined) {
            diminsion = param;
          }
        }
      });
    }

    return diminsion;
  }

  removeRoute(index: number) {
    this.routes.splice(index, 1);
  }

  addRoute() {
    this.routes.push({ name: '' });
  }

  removeStratum(index: number) {
    this.stratums.splice(index, 1);
  }

  addStratum() {
    this.stratums.push({ name: '' });
  }

  removePowerPlant(index: number) {
    this.powerPlants.splice(index, 1);
  }

  addPowerPlant() {
    this.powerPlants.push({ name: '' });
  }

  addBaselineParam() {
    this.hasCommonBaseline = false;
    this.basllineSelection.push(new ParameterDimensionSelection().createNew());
  }

  removeBaselineParam(index: number) {
    this.basllineSelection.splice(index, 1);
  }

  addProjectParam() {
    this.hasCommonProject = false;
    this.projectSelection.push(new ParameterDimensionSelection().createNew());
  }

  removeProjectParam(index: number) {
    this.projectSelection.splice(index, 1);
  }

  addLekageParam() {
    this.hasCommonLeakage = false;
    this.lekageSelection.push(new ParameterDimensionSelection().createNew());
  }

  removeLekageParam(index: number) {
    this.lekageSelection.splice(index, 1);
  }

  getMethodologyParam(): Observable<any> {
    console.log(this.selectedMethodology)
    let Url = environment.baseUrlJsonFile + '/' + this.selectedMethodology.name;
    var headers = new HttpHeaders().set('api-key','1234');
    let file = undefined;
    // this.http.get(Url).subscribe((data: any) => {
    //   return data;
    // });
    return this.http.get(Url,{'headers':headers});
  }

  postParamToCalculation(parameters: any): Observable<any> {
    let Url = environment.baseUrlJsonFile + '/methodology';
    let headers = new HttpHeaders().set('api-key','1234');
    let file = undefined;
    // this.http.get(Url).subscribe((data: any) => {
    //   return data;
    // });

    return this.http.post(Url, parameters,{'headers':headers});
  }


  changeProjectVehicle()
  {
    this.selectProjectVeicle = false;
  }

  ChangeDimensionVehicalType(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
    this.selectBaselineVeicle = false;
    if (event.value.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.value);
      if (vValue === undefined || vValue === null) {
        item.newVehical = event.value;
        item.canAddVehical = true;
      }
    } else {
      item.newVehical = '';
      item.canAddVehical = false;
    }
  }

  addDimensionVehicalValue(
    item: ParameterDimensionSelection,
    dimensionTypeValue: any
  ) {
    dimensionTypeValue.push({
      name: item.newVehical,
      DefaultValue: 'false',
    });

    item.vehical = dimensionTypeValue.find(
      (a: any) => a.name === item.newVehical
    );
    item.newVehical = '';
    item.canAddVehical = false;
  }

  onbaseFuelChange()
  {
    this.selectBaseLineFuel= false;
  }
  changeProjectFuel()
  {
    this.selectProjectFuel= false;
  }
  ChangeDimensionVehicalTypeMulti(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
   
    if (event.filter.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.filter);
      if (vValue === undefined || vValue === null) {
        item.newVehical = event.filter;
        item.canAddVehical = true;
      }
    } else {
      item.newVehical = '';
      item.canAddVehical = false;
    }
  }
  ChangeDimensionFuelType(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
   
    if (event.filter.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.filter);
      if (vValue === undefined || vValue === null) {
        item.newFuel = event.filter;
        item.canAddFuel = true;
      }
    } else {
      item.newFuel = '';
      item.canAddFuel = false;
    }
  }

  addDimensionFuelValue(
    item: ParameterDimensionSelection,
    dimensionTypeValue: any
  ) {
    let newId =
      Math.max.apply(
        Math,
        dimensionTypeValue.map(function (o: any) {
          return o.Id;
        })
      ) + 1;
    dimensionTypeValue.push({
      Id: newId,
      name: item.newFuel,
      DefaultValue: 'false',
    });

    item.fuel.push(
      dimensionTypeValue.find((a: any) => a.name === item.newFuel)
    );
    item.newFuel = '';
    item.canAddFuel = false;
  }



  ChangeDimensionLandClearanceType(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
   
    if (event.filter.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.filter);
      if (vValue === undefined || vValue === null) {
        item.newLandClearance = event.filter;
        item.canAddLandClearance = true;
      }
    } else {
      item.newLandClearance = '';
      item.canAddLandClearance = false;
    }
  }

  addDimensionLandClearanceValue(
    item: ParameterDimensionSelection,
    dimensionTypeValue: any
  ) {
    let newId =
      Math.max.apply(
        Math,
        dimensionTypeValue.map(function (o: any) {
          return o.Id;
        })
      ) + 1;
    dimensionTypeValue.push({
      Id: newId,
      name: item.newLandClearance,
      DefaultValue: 'false',
    });

    item.landClearance.push(
      dimensionTypeValue.find((a: any) => a.name === item.newLandClearance)
    );
    item.newLandClearance = '';
    item.canAddLandClearance = false;
  }
  ChangeDimensionResidueType(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
   
    if (event.filter.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.filter);
      if (vValue === undefined || vValue === null) {
        item.newResidue = event.filter;
        item.canAddResidue = true;
      }
    } else {
      item.newResidue = '';
      item.canAddResidue = false;
    }
  }

  addDimensionResidueValue(
    item: ParameterDimensionSelection,
    dimensionTypeValue: any
  ) {
    let newId =dimensionTypeValue.length>0?
      Math.max.apply(
        Math,
        dimensionTypeValue.map(function (o: any) {
          return o.Id;
        })
      ) + 1:1;
    dimensionTypeValue.push({
      Id: newId,
      name: item.newResidue,
      DefaultValue: 'false',
    });
   
    item.residue.push(
      dimensionTypeValue.find((a: any) => a.name === item.newResidue)
    );
    item.newResidue = '';
    item.canAddResidue = false;
  }
  ChangeDimensionSoilType(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
   
    if (event.filter.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.filter);
      if (vValue === undefined || vValue === null) {
        item.newSoil = event.filter;
        item.canAddSoil = true;
      }
    } else {
      item.newSoil = '';
      item.canAddSoil = false;
    }
  }

  addDimensionSoilValue(
    item: ParameterDimensionSelection,
    dimensionTypeValue: any
  ) {
    let newId =
      Math.max.apply(
        Math,
        dimensionTypeValue.map(function (o: any) {
          return o.Id;
        })
      ) + 1;
    dimensionTypeValue.push({
      Id: newId,
      name: item.newSoil,
      DefaultValue: 'false',
    });

    item.soil.push(
      dimensionTypeValue.find((a: any) => a.name === item.newSoil)
    );
    item.newSoil = '';
    item.canAddSoil = false;
  }
  ChangeDimensionFeedstockType(
    event: any,
    dimensionTypeValue: any,
    item: ParameterDimensionSelection
  ) {
   
    this.selectBaselineVeicle = false;
    if (event.value.length >= 3) {
      let vValue = dimensionTypeValue.find((a: any) => a.name === event.value);
      if (vValue === undefined || vValue === null) {
        item.newFeedstock = event.value;
        item.canAddFeedstock = true;
      }
    } else {
      item.newFeedstock = '';
      item.canAddFeedstock = false;
    }
  }

  addDimensionFeedstockValue(
    item: ParameterDimensionSelection,
    dimensionTypeValue: any
  ) {
    let newId =
      Math.max.apply(
        Math,
        dimensionTypeValue.map(function (o: any) {
          return o.Id;
        })
      ) + 1;
    dimensionTypeValue.push({
      Id: newId,
      name: item.newFeedstock,
      DefaultValue: 'false',
    });

    item.feedstock.push(
      dimensionTypeValue.find((a: any) => a.name === item.newFeedstock)
    );
    item.newFeedstock = '';
    item.canAddFeedstock = false;
  }

  powerPlantRoutestratumSave() {
    this.isSaveRoutePowerplantStratum = !this.isSaveRoutePowerplantStratum;
    this.routePowerPlantMaintain = !this.routePowerPlantMaintain;
  }

  getParameterInfo(parameterSection: any) {
    for (let section of Object.keys(parameterSection)){
      for (let sp of parameterSection[section].sectionparameters){
        for (let para of sp.parameters){
          let str = this.selectedMethodology.name + "_" + para.Code;
          if (ParameterInfo[str as ParaInfoType]){
            this.infos[para.Code] = ParameterInfo[str as ParaInfoType];
          }
        }
      }
    }
  }

  baslineGenrate() {
    this.showBaslineGenrate = !this.showBaslineGenrate;
    this.baselineShowMaintain = !this.baselineShowMaintain;

    if (!this.showBaslineGenrate) {
      this.blParameters = new ParameterSections();
      if (
        this.basllineSelection &&
        this.basllineSelection.length > 0 &&
        this.baslineParam &&
        this.baslineParam.length > 0
      ) {
        if (this.blHasRoute) {
          let routeParam = this.getDiminsion(this.route, this.baslineParam);
          
          let routeSection = this.genrateRouteParameterSection(
            this.basllineSelection,
            routeParam,
            'Route Info'
          );
          console.log("+++++++",routeSection)
          this.blParameters.routeSection = routeSection;
        }
        if (this.blHasVehicale){
          
          
          if( !this.blHasFeedstock) {
          console.log("dimention1",this.blHasFeedstock)
          let vehicalParam = this.getDiminsion(this.vehicle, this.baslineParam);
          let vehicalCommon = this.getCommon(this.blVehicalValue);
          console.log("fuelCommon",vehicalCommon)
          if (vehicalCommon) {
            let commonEntered = this.basllineSelection.filter(b => b.vehical.id === vehicalCommon.id )
            if (commonEntered.length === 0){
              var tempCommon = new ParameterDimensionSelection().createNew();
              tempCommon.vehical = vehicalCommon;
              this.basllineSelection.push(tempCommon);
              this.hasCommonBaseline = true;
            }
          }
          console.log("fuelCommon",this.basllineSelection)
          let vehicalSection = this.genrateVehicalParameterSection(
            this.basllineSelection,
            vehicalParam,
            'Vehicle Info'
          );

          this.blParameters.vehicalSection = vehicalSection;
        }else{
          console.log("dimention2",this.blHasFeedstock)
          let vehicalParam = this.getDiminsion(this.vehicle, this.baslineParam);
          let fuelCommon = this.getCommon(this.blVehicalValue);
          console.log("fuelCommon",fuelCommon)
          if (fuelCommon) {
            this.basllineSelection[0].vehicals.unshift(fuelCommon);
          }
          console.log("fuelCommon",this.basllineSelection)

        //assume vehical dimention is multiselect every time feedstock is available in dimention
          let vehicalSection = this.genrateVehicalParameterSectionWhenHasFeedstock(
            this.basllineSelection,
            vehicalParam,
            'Vehicle Info'
          );

          this.blParameters.vehicalSection = vehicalSection;


          }
        }
        if (this.blHasFuel) {
          if(!this.blHasFeedstock){let fuelParam = this.getDiminsion(this.fuel, this.baslineParam);

          let fuelCommon = this.getCommon(this.blFuelValue);
          if (fuelCommon) {
            this.basllineSelection[0].fuel.unshift(fuelCommon);
          }

          let fuelSection = this.genrateFuelParameterSection(
            this.basllineSelection,
            fuelParam,
            'Fuel Info'
          );
          this.blParameters.fuelSection = fuelSection;}
          else{
            let fuelParam = this.getDiminsion(this.fuel, this.baslineParam);
            let fuelCommon = this.getCommon(this.blFuelValue);
            if (fuelCommon) {
              this.basllineSelection[0].fuel.unshift(fuelCommon);
            }
           
           
              let fuelSection = this.genrateFuelParameterSectionWhenHasFeedstock(
                this.basllineSelection,
                fuelParam,
                'Fuel Info'
              );
              this.blParameters.fuelSection = fuelSection;
  
  
  
          }

        }
     // newly added dimentions

        if (this.blHasFeedstock) {
          let feedstockParam = this.getDiminsion(this.feedstock, this.baslineParam);

          let feedstockCommon = this.getCommon(this.blFeedstockValue);
          if (feedstockCommon) {
            let commonEntered = this.basllineSelection.filter(b => b.feedstock.id === feedstockCommon.id)
            if (commonEntered.length === 0) {
              var tempCommon = new ParameterDimensionSelection().createNew();
              tempCommon.feedstock = feedstockCommon;
              this.basllineSelection.push(tempCommon);
              this.hasCommonBaseline = true;
            }
          }

          let feedstockSection = this.genrateFeedstockParameterSection(
            this.basllineSelection,
            feedstockParam,
            'Feedstock Info'
          );
          this.blParameters.feedstockSection = feedstockSection;
        }
        if (this.blHasSoil) {
          let soilParam = this.getDiminsion(this.soil, this.baslineParam);

          let soilCommon = this.getCommon(this.blSoilValue);
          if (soilCommon) {
            this.basllineSelection[0].soil.unshift(soilCommon);
          }

          let soilSection = this.genrateSoilParameterSection(
            this.basllineSelection,
            soilParam,
            'Soil Info'
          );
          this.blParameters.soilSection = soilSection;
        }
        if (this.blHasResidue) {
          let residueParam = this.getDiminsion(this.residue, this.baslineParam);

          let residueCommon = this.getCommon(this.blResidueValue);
          if (residueCommon) {
            this.basllineSelection[0].residue.unshift(residueCommon);
          }

          let residueSection = this.genrateResidueParameterSection(
            this.basllineSelection,
            residueParam,
            'Residue Info'
          );
          this.blParameters.residueSection = residueSection;
        }
        if (this.blHasLandClearance) {
          let landClearanceParam = this.getDiminsion(this.landclearance, this.baslineParam);

          let landClearanceCommon = this.getCommon(this.blLandClearanceValue);
          if (landClearanceCommon) {
            this.basllineSelection[0].landClearance.unshift(landClearanceCommon);
          }

          let landClearanceSection = this.genrateLandClearanceParameterSection(
            this.basllineSelection,
            landClearanceParam,
            'Land Clearance Info'
          );
          this.blParameters.landClearanceSection = landClearanceSection;
        }

        if (this.blHasStratum) {
          let stratumParam = this.getDiminsion(this.stratum, this.baslineParam);
          let stratumSection = this.genrateStratumParameterSection(
            this.basllineSelection,
            stratumParam,
            'Stratum Info'
          );

          this.blParameters.stratumSection = stratumSection;
        }


        if (this.blHasPowerPlant) {
          let powerPlant = this.getDiminsion(this.power, this.baslineParam);

          let powerSection = this.genratePowerPlantParameterSection(
            this.basllineSelection,
            powerPlant,
            'Power Plant Info'
          );
          this.blParameters.powerPlantSection = powerSection;
        }
      }
    } else {
      this.blParameters = new ParameterSections();
    }
    this.getParameterInfo(this.blParameters)
  }

  projectGenrate() {
    this.showProjectGenrate = !this.showProjectGenrate;
    this.projectShowMaintain = !this.projectShowMaintain;
    this.prParameters = new ParameterSections();

    if (
      !this.showProjectGenrate &&
      this.projectSelection &&
      this.projectSelection.length > 0 &&
      this.ProjectParam &&
      this.ProjectParam.length > 0
    ) {
      if (this.prHasRoute) {
        let routeParam = this.getDiminsion(this.route, this.ProjectParam);
        let routeSection = this.genrateRouteParameterSection(
          this.projectSelection,
          routeParam,
          'Route Info'
        );

        this.prParameters.routeSection = routeSection;
      }
      if (this.prHasVehicale){
          
          
        if( !this.prHasFeedstock) {
        let vehicalParam = this.getDiminsion(this.vehicle, this.ProjectParam);
        let vehicleCommon = this.getCommon(this.prVehicalValue);

        if (vehicleCommon) {
          let commonEntered = this.projectSelection.filter(p => p.vehical.id === vehicleCommon.id)
          if (commonEntered.length === 0) {
            var tempCommon = new ParameterDimensionSelection().createNew();
            tempCommon.vehical = vehicleCommon;
            this.hasCommonProject = true;
            this.projectSelection.push(tempCommon);
          }
        }
        let vehicalSection = this.genrateVehicalParameterSection(
          this.projectSelection,
          vehicalParam,
          'Vehicle Info'
        );

        this.prParameters.vehicalSection = vehicalSection;
      }else{
        
        let vehicalParam = this.getDiminsion(this.vehicle, this.ProjectParam);
        let vehicalCommon = this.getCommon(this.prVehicalValue);
      
        if (vehicalCommon) {
          this.projectSelection[0].vehicals.unshift(vehicalCommon);
        }
       

      //assume vehical dimention is multiselect every time feedstock is available in dimention
        let vehicalSection = this.genrateVehicalParameterSectionWhenHasFeedstock(
          this.projectSelection,
          vehicalParam,
          'Vehicle Info'
        );

        this.prParameters.vehicalSection = vehicalSection;



      }}

      if (this.prHasFuel) {
        if (!this.prHasFeedstock) {
          let fuelParam = this.getDiminsion(this.fuel, this.ProjectParam);

          let fuelCommon = this.getCommon(this.prFuelValue);
          if (fuelCommon) {
            this.projectSelection[0].fuel.unshift(fuelCommon);
          }

          let fuelSection = this.genrateFuelParameterSection(
            this.projectSelection,
            fuelParam,
            'Fuel Info'
          );
          this.prParameters.fuelSection = fuelSection;
        }
        else {
          let fuelParam = this.getDiminsion(this.fuel, this.ProjectParam);
          let fuelCommon = this.getCommon(this.prFuelValue);
          if (fuelCommon) {
            this.projectSelection[0].fuel.unshift(fuelCommon);
          }


          let fuelSection = this.genrateFuelParameterSectionWhenHasFeedstock(
            this.projectSelection,
            fuelParam,
            'Fuel Info'
          );
          this.prParameters.fuelSection = fuelSection;



        }
      }

      if (this.prHasFeedstock) {
        let feedstockParam = this.getDiminsion(this.feedstock, this.ProjectParam);

        let feedstockCommon = this.getCommon(this.prFeedstockValue);
        if (feedstockCommon) {
          let commonEntered = this.projectSelection.filter(p => p.feedstock.id === feedstockCommon.id)
          if (commonEntered.length === 0) {
            var tempCommon = new ParameterDimensionSelection().createNew();
            tempCommon.feedstock = feedstockCommon;
            this.hasCommonProject = true;
            this.projectSelection.push(tempCommon);
          }
        }

        let feedstockSection = this.genrateFeedstockParameterSection(
          this.projectSelection,
          feedstockParam,
          'Feedstock Info'
        );
        this.prParameters.feedstockSection = feedstockSection;
      }
      if (this.prHasSoil) {
        let soilParam = this.getDiminsion(this.soil, this.ProjectParam);

        let soilCommon = this.getCommon(this.prSoilValue);
        if (soilCommon) {
          this.projectSelection[0].soil.unshift(soilCommon);
        }

        let soilSection = this.genrateSoilParameterSection(
          this.projectSelection,
          soilParam,
          'Soil Info'
        );
        this.prParameters.soilSection = soilSection;
      }
      if (this.prHasResidue) {
        let residueParam = this.getDiminsion(this.residue, this.ProjectParam);

        let residueCommon = this.getCommon(this.prResidueValue);
        if (residueCommon) {
          this.projectSelection[0].residue.unshift(residueCommon);
        }

        let residueSection = this.genrateResidueParameterSection(
          this.projectSelection,
          residueParam,
          'Residue Info'
        );
        this.prParameters.residueSection = residueSection;
      }
      if (this.prHasLandClearance) {
        let landClearanceParam = this.getDiminsion(this.landclearance, this.ProjectParam);

        let landClearanceCommon = this.getCommon(this.blLandClearanceValue);
        if (landClearanceCommon) {
          this.projectSelection[0].landClearance.unshift(landClearanceCommon);
        }

        let landClearanceSection = this.genrateLandClearanceParameterSection(
          this.projectSelection,
          landClearanceParam,
          'Land Clearance Info'
        );
        this.prParameters.landClearanceSection = landClearanceSection;
      }

      if (this.prHasStratum) {
        let stratumParam = this.getDiminsion(this.stratum, this.ProjectParam);
        let stratumSection = this.genrateStratumParameterSection(
          this.projectSelection,
          stratumParam,
          'Stratum Info'
        );

        this.prParameters.stratumSection = stratumSection;
      }

      if (this.prHasPowerPlant) {
        let powerPlant = this.getDiminsion(this.power, this.ProjectParam);

        let powerSection = this.genratePowerPlantParameterSection(
          this.projectSelection,
          powerPlant,
          'Power Plant Info'
        );
        this.prParameters.powerPlantSection = powerSection;
      }
    }
    this.getParameterInfo(this.prParameters)
  }

  lekageGenrate() {
    this.showLekageGenrate = !this.showLekageGenrate;
    this.lekageShowMaintain = !this.lekageShowMaintain;
    if (!this.showLekageGenrate) {
      this.lkParameters = new ParameterSections();
      if (
        this.lekageSelection &&
        this.lekageSelection.length > 0 &&
        this.lekageParam &&
        this.lekageParam.length > 0
      ) {
        if (this.lkHasRoute) {
          let routeParam = this.getDiminsion(this.route, this.lekageParam);
          let routeSection = this.genrateRouteParameterSection(
            this.lekageSelection,
            routeParam,
            'Route Info'
          );

          this.lkParameters.routeSection = routeSection;
        }
        if (this.lkHasVehicale){
          
          
          if( !this.lkHasFeedstock) {
          let vehicalParam = this.getDiminsion(this.vehicle, this.lekageParam);
          let vehicalCommon = this.getCommon(this.lkVehicalValue);
          if (vehicalCommon) {
            let commonEntered = this.lekageSelection.filter(l => l.vehical.id === vehicalCommon.id)
            if (commonEntered.length === 0) {
              var tempCommon = new ParameterDimensionSelection().createNew();
              tempCommon.vehical = vehicalCommon;
              this.hasCommonLeakage = true;
              this.lekageSelection.push(tempCommon);
            }
          }
          let vehicalSection = this.genrateVehicalParameterSection(
            this.lekageSelection,
            vehicalParam,
            'Vehicle Info'
          );

          this.lkParameters.vehicalSection = vehicalSection;
        }else{
        
          let vehicalParam = this.getDiminsion(this.vehicle, this.lekageParam);
          let vehicalCommon = this.getCommon(this.lkVehicalValue);
        
          if (vehicalCommon) {
            this.lekageSelection[0].vehicals.unshift(vehicalCommon);
          }
         
  
        //assume vehical dimention is multiselect every time feedstock is available in dimention
          let vehicalSection = this.genrateVehicalParameterSectionWhenHasFeedstock(
            this.lekageSelection,
            vehicalParam,
            'Vehicle Info'
          );
  
          this.lkParameters.vehicalSection = vehicalSection;
  
  
  
        }}


        if (this.lkHasFuel) {
         
        if (!this.lkHasFeedstock){ 
          let fuelParam = this.getDiminsion(this.fuel, this.lekageParam);
          let fuelCommon = this.getCommon(this.lkFuelValue);
          if (fuelCommon) {
            this.lekageSelection[0].fuel.unshift(fuelCommon);
          }
          let fuelSection = this.genrateFuelParameterSection(
            this.lekageSelection,
            fuelParam,
            'Fuel Info'
          );
          this.lkParameters.fuelSection = fuelSection;}
          else{
            let fuelParam = this.getDiminsion(this.fuel, this.lekageParam);
            let fuelCommon = this.getCommon(this.lkFuelValue);
            if (fuelCommon) {
              this.lekageSelection[0].fuel.unshift(fuelCommon);
            }
           
           
              let fuelSection = this.genrateFuelParameterSectionWhenHasFeedstock(
                this.lekageSelection,
                fuelParam,
                'Fuel Info'
              );
              this.lkParameters.fuelSection = fuelSection;



          }
        }
        if (this.lkHasFeedstock) {
          let feedstockParam = this.getDiminsion(this.feedstock, this.lekageParam);
  
          let feedstockCommon = this.getCommon(this.lkFeedstockValue);
          if (feedstockCommon) {
            let commonEntered = this.lekageSelection.filter(l => l.feedstock.id === feedstockCommon.id)
            if (commonEntered.length === 0) {
              var tempCommon = new ParameterDimensionSelection().createNew();
              tempCommon.feedstock = feedstockCommon;
              this.hasCommonLeakage = true;
              this.lekageSelection.push(tempCommon);
            }
          }
  
          let feedstockSection = this.genrateFeedstockParameterSection(
            this.lekageSelection,
            feedstockParam,
            'Feedstock Info'
          );
          this.lkParameters.feedstockSection = feedstockSection;
        }
        if (this.lkHasSoil) {
          let soilParam = this.getDiminsion(this.soil, this.lekageParam);
  
          let soilCommon = this.getCommon(this.lkSoilValue);
          if (soilCommon) {
            this.lekageSelection[0].soil.unshift(soilCommon);
          }
  
          let soilSection = this.genrateSoilParameterSection(
            this.lekageSelection,
            soilParam,
            'Soil Info'
          );
          this.lkParameters.soilSection = soilSection;
        }
        if (this.lkHasResidue) {
          let residueParam = this.getDiminsion(this.residue, this.lekageParam);
  
          let residueCommon = this.getCommon(this.lkResidueValue);
          if (residueCommon) {
            this.lekageSelection[0].residue.unshift(residueCommon);
          }
  
          let residueSection = this.genrateResidueParameterSection(
            this.lekageSelection,
            residueParam,
            'Residue Info'
          );
          this.lkParameters.residueSection = residueSection;
        }
        if (this.lkHasLandClearance) {
          let landClearanceParam = this.getDiminsion(this.landclearance, this.lekageParam);
  
          let landClearanceCommon = this.getCommon(this.lkLandClearanceValue);
          if (landClearanceCommon) {
            this.lekageSelection[0].landClearance.unshift(landClearanceCommon);
          }
  
          let landClearanceSection = this.genrateLandClearanceParameterSection(
            this.lekageSelection,
            landClearanceParam,
            'Land Clearance Info'
          );
          this.lkParameters.landClearanceSection = landClearanceSection;
        }
  
        if (this.lkHasStratum) {
          let stratumParam = this.getDiminsion(this.stratum, this.lekageParam);
          let stratumSection = this.genrateStratumParameterSection(
            this.lekageSelection,
            stratumParam,
            'Stratum Info'
          );
  
          this.lkParameters.stratumSection = stratumSection;
        }




        if (this.lkHasPowerPlant) {
          let powerPlant = this.getDiminsion(this.power, this.lekageParam);

          let powerSection = this.genratePowerPlantParameterSection(
            this.lekageSelection,
            powerPlant,
            'Power Plant Info'
          );
          this.lkParameters.powerPlantSection = powerSection;
        }
      }
    } else {
      this.lkParameters = new ParameterSections();
    }
    this.getParameterInfo(this.lkParameters)
  }

  genrateVehicalParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    vehicalParam: any,
    sectionHeader: string
  ) {
    let vehicalSection = new ParameterSection();
    vehicalSection.sectionHeader = sectionHeader;

    parameterSelection.map((v) => {
      console.log("dimention11",v.vehical)
      if (v.vehical.name === this.common) {
        let sectionparam = new SectionParameter();
        sectionparam.fuel = '';
        sectionparam.vehical = v.vehical.name;
        sectionparam.parameterHeader = `${v.vehical.name}`;
        // console.log("+++++++++++++++++",sectionparam)
        this.getAllParameters(vehicalParam, sectionparam, v.vehical);
        vehicalSection.sectionparameters.push(sectionparam);
      }
      if(v.fuel.length ==0 && v.vehical.name != this.common){
        let sectionparam = new SectionParameter();
        sectionparam.fuel = '';
            sectionparam.vehical = v.vehical.name;
            sectionparam.route = '';
            sectionparam.parameterHeader = `${v.vehical.name}`;
            // console.log("+++++++++++++++++",sectionparam)
            this.getAllParameters(vehicalParam, sectionparam, v.vehical);
            vehicalSection.sectionparameters.push(sectionparam);
      }
      v.fuel.map((f: any) => {
        let sectionparam = new SectionParameter();

        if (v.route.length === 0) {
          sectionparam.fuel = f.name;
          sectionparam.vehical = v.vehical.name;
          // console.log("+++++++++++++++++",sectionparam)
          sectionparam.parameterHeader = `${f.name}-${v.vehical.name}`;
          this.getAllParameters(vehicalParam, sectionparam, v.vehical);
        } else {
          v.route.map((r: any) => {
           
            sectionparam.fuel = f.name;
            sectionparam.vehical = v.vehical.name;
            sectionparam.route = r.name;
            sectionparam.parameterHeader = `${f.name}-${v.vehical.name} - ${r.name}`;
            this.getAllParameters(vehicalParam, sectionparam, v.vehical);


          });
        }
        vehicalSection.sectionparameters.push(sectionparam);
      });
    });
    console.log("++++++++++++vehical",vehicalSection)
    this.checkDefaultValue(vehicalSection,"vehical");
    vehicalSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return vehicalSection;
  }

  checkBool(useDefaultValue:any){
    if(useDefaultValue=="true" || useDefaultValue==true){
      return true
    }
      else return false
  }

  checkDefaultValue(pa:ParameterSection,type:string){
   pa.sectionparameters.forEach((a)=>{
      let name="";
      if(type=="vehical"){
        name=a.vehical
      }
      else if(type=="fuel"){
        name=a.fuel
      }
      else if(type=="vehicla"){
        name=a.vehical
      }
      else if(type=="route"){
        name=a.route
      }
      else if(type=="powerPlant"){
        name=a.powerPlant
      }
      else if(type=="landClearance"){
        name=a.landClearance
      }
      else if(type=="residue"){
        name=a.residue
      }
      else if(type=="stratum"){
        name=a.stratum
      }
      else if(type=="soil"){
        name=a.soil
      }
      a.parameters.forEach((para)=>{
        let name1 = para.parameterName +" "+name+ " "+ this.loggedUser.country.id;
        let bool1= this.checkBool( para.useDefaultValue);
        if(!this.uniqdeParaName.includes(name1) && bool1==true){
          let unitValues=new DefaultValue();
          this.uniqdeParaName.push(name1);
          unitValues.parameterName=para.parameterName;
          unitValues.administrationLevel=name;
          unitValues.unit=para.UOM;
          let co= new Country();
          co.id = this.loggedUser.country.id;
          unitValues.country=co;
          this.uniqdefaultValues.push(unitValues);
        }

        if(para.alternativeParameters.length>0){
          para.alternativeParameters.forEach((al)=>{
            let name2 =al.parameterName+" "+ name+ " "+ this.loggedUser.country.id;
            let bool2= this.checkBool( para.useDefaultValue);
            if(!this.uniqdeParaName.includes(name2) && bool2==true){
              let unitValues2=new DefaultValue();
              this.uniqdeParaName.push(name2);
              unitValues2.parameterName=al.parameterName;
              unitValues2.administrationLevel=name;
              unitValues2.unit=para.UOM;
              let co= new Country();
          co.id = this.loggedUser.country.id;
          unitValues2.country=co;
              this.uniqdefaultValues.push(unitValues2);
            }
          })
        }
      })
    })
  }
  genrateVehicalParameterSectionWhenHasFeedstock(
    parameterSelection: ParameterDimensionSelection[],
    vehicalParam: any,
    sectionHeader: string
  ) {
    let vehicalSection = new ParameterSection();
    vehicalSection.sectionHeader = sectionHeader;
    // sectionparam.parameterHeader = `${f.name}-${v.vehical.name}`;
  

    parameterSelection.map((v) => {
      v.vehicals.map((f:any)=>{
        console.log("dimention22",f)
        if (f.name === this.common) {
          let sectionparam = new SectionParameter();
          // sectionparam.fuel = '';
          sectionparam.vehical = f.name;
          sectionparam.parameterHeader = `${f.name}`;
          this.getAllParameters(vehicalParam, sectionparam, f);
          vehicalSection.sectionparameters.push(sectionparam);
        }
        if(f.name !== this.common){
          let sectionparam = new SectionParameter();
              sectionparam.vehical = f.name;
              sectionparam.feedstock = v.oneFeedstock.name;
              sectionparam.route = '';
              sectionparam.parameterHeader =v.oneFeedstock.name? `${v.oneFeedstock.name} - ${f.name}`:`${f.name}`;
              this.getAllParameters(vehicalParam, sectionparam, f);
              vehicalSection.sectionparameters.push(sectionparam);
  
  
        }

      })
    
    });
    console.log("++++++++++++genrateVehicalParameterSectionWhenHasFeedstock",vehicalSection)
    this.checkDefaultValue(vehicalSection,"vehical");
    vehicalSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return vehicalSection;
  }
  
  genrateFuelParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    fuelParam: any,
    sectionHeader: string
  ) {
    let fuelSection = new ParameterSection();
    fuelSection.sectionHeader = sectionHeader;
    // sectionparam.parameterHeader = `${f.name}-${v.vehical.name}`;
    let fuelList: any = [];
    let unuiqeFuel: any = [];

    parameterSelection.map((v) => {
      fuelList.push(...v.fuel);
    });

    unuiqeFuel = [
      ...new Map(fuelList.map((v: any) => [v['name'], v])).values(),
    ];

    unuiqeFuel.map((f: any) => {
      let fuelsectionparam = new SectionParameter();
      fuelsectionparam.fuel = f.name;
      fuelsectionparam.parameterHeader = f.name;

      this.getAllParameters(fuelParam, fuelsectionparam, f);
      fuelSection.sectionparameters.push(fuelsectionparam);
    });
    console.log("++++++++++++fuel",fuelSection)
    this.checkDefaultValue(fuelSection,"fuel");
    fuelSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return fuelSection;
  }
  genrateFuelParameterSectionWhenHasFeedstock(
    parameterSelection: ParameterDimensionSelection[],
    fuelParam: any,
    sectionHeader: string
  ) {
    let fuelSection = new ParameterSection();
    fuelSection.sectionHeader = sectionHeader;
  
    
    parameterSelection.map((v) => {
      v.fuel.map((f:any)=>{
        
        if (f.name === this.common) {
          let sectionparam = new SectionParameter();
        
          sectionparam.fuel = f.name;
          sectionparam.parameterHeader = `${f.name}`;
          this.getAllParameters(fuelParam, sectionparam, f);
          fuelSection.sectionparameters.push(sectionparam);
        }
        if(f.name !== this.common){
          let sectionparam = new SectionParameter();
              sectionparam.fuel = f.name;
              sectionparam.feedstock = v.oneFeedstock.name;
             
              sectionparam.parameterHeader =v.oneFeedstock.name? `${v.oneFeedstock.name} - ${f.name}`:`${f.name}`;
              this.getAllParameters(fuelParam, sectionparam, f);
              fuelSection.sectionparameters.push(sectionparam);
  
  
        }

      })
    
    });
    console.log("++++++++++++ genrateFuelParameterSectionWhenHasFeedstock",fuelSection)
    this.checkDefaultValue(fuelSection,"fuel");
    fuelSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return fuelSection;
  }
  genrateFeedstockParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    feedstockParam: any,
    sectionHeader: string
  ) {
    let feedstockSection = new ParameterSection();
    feedstockSection.sectionHeader = sectionHeader;
   
    

    parameterSelection.map((v) => {
      if (v.oneFeedstock.name === this.common) {
        let sectionparam = new SectionParameter();
        sectionparam.fuel = '';
        sectionparam.feedstock = v.oneFeedstock.name;
        sectionparam.parameterHeader = `${v.oneFeedstock.name}`;
        this.getAllParameters(feedstockParam, sectionparam, v.oneFeedstock);
        feedstockSection.sectionparameters.push(sectionparam);
      }
      if( v.oneFeedstock.name != this.common){
        let sectionparam = new SectionParameter();
        sectionparam.fuel = '';
            sectionparam.feedstock = v.oneFeedstock.name;
            sectionparam.route = '';
            sectionparam.parameterHeader = `${v.oneFeedstock.name}`;
            this.getAllParameters(feedstockParam, sectionparam, v.oneFeedstock);
            feedstockSection.sectionparameters.push(sectionparam);
      }
    });

   




    console.log("++++++++++++feedstock",feedstockSection)
    this.checkDefaultValue(feedstockSection,"feedstock");
    feedstockSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return feedstockSection;
  }
  genrateSoilParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    soilParam: any,
    sectionHeader: string
  ) {
    let soilSection = new ParameterSection();
    soilSection.sectionHeader = sectionHeader;
    // sectionparam.parameterHeader = `${f.name}-${v.vehical.name}`;
    parameterSelection.map((v) => {
      v.soil.map((f:any)=>{
        if (f.name === this.common) {
          let sectionparam = new SectionParameter();
          // sectionparam.fuel = '';
          sectionparam.soil = f.name;
          sectionparam.parameterHeader = `${f.name}`;
          this.getAllParameters(soilParam, sectionparam, f);
          soilSection.sectionparameters.push(sectionparam);
        }
        if(f.name !== this.common){
          let sectionparam = new SectionParameter();
              sectionparam.soil = f.name;
              sectionparam.feedstock = v.oneFeedstock.name;
              sectionparam.route = '';
              sectionparam.parameterHeader =v.oneFeedstock.name? `${v.oneFeedstock.name} - ${f.name}`: `${f.name}`;
              this.getAllParameters(soilParam, sectionparam, f);
              soilSection.sectionparameters.push(sectionparam);
  
  
        }

      })
    
    });
    console.log("++++++++++++soil",soilSection)
    this.checkDefaultValue(soilSection,"soil");
    soilSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return soilSection;
  }

  genrateResidueParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    residueParam: any,
    sectionHeader: string
  ) {
    let residueSection = new ParameterSection();
    residueSection.sectionHeader = sectionHeader;
    // sectionparam.parameterHeader = `${f.name}-${v.vehical.name}`;
    let residueList: any = [];
    let unuiqeResidue: any = [];

    parameterSelection.map((v) => {
      residueList.push(...v.residue);
    });

    unuiqeResidue = [
      ...new Map(residueList.map((v: any) => [v['name'], v])).values(),
    ];

    unuiqeResidue.map((f: any) => {
      let residueSectionparam = new SectionParameter();
      residueSectionparam.residue = f.name;
      residueSectionparam.parameterHeader = f.name;

      this.getAllParameters(residueParam, residueSectionparam, f);
      residueSection.sectionparameters.push(residueSectionparam);
    });
    console.log("++++++++++++residue",residueSection)
    this.checkDefaultValue(residueSection,"residue");
    residueSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return residueSection;
  }
  genrateLandClearanceParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    landClearanceParam: any,
    sectionHeader: string
  ) {
    let landClearanceSection = new ParameterSection();
    landClearanceSection.sectionHeader = sectionHeader;
    // sectionparam.parameterHeader = `${f.name}-${v.vehical.name}`;
    let landClearanceList: any = [];
    let unuiqeLandClearance: any = [];

    parameterSelection.map((v) => {
      landClearanceList.push(...v.landClearance);
    });

    unuiqeLandClearance = [
      ...new Map(landClearanceList.map((v: any) => [v['name'], v])).values(),
    ];

    unuiqeLandClearance.map((f: any) => {
      let landClearancesectionparam = new SectionParameter();
      landClearancesectionparam.fuel = f.name;
      landClearancesectionparam.parameterHeader = f.name;

      this.getAllParameters(landClearanceParam, landClearancesectionparam, f);
      landClearanceSection.sectionparameters.push(landClearancesectionparam);
    });
    console.log("++++++++++++landClearance",landClearanceSection)
    this.checkDefaultValue(landClearanceSection,"landClearance");
    landClearanceSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return landClearanceSection;
  }

  genrateRouteParameterSection(
    parameterSelection: ParameterDimensionSelection[], //selcted all basline vlues (vehucal,fuel,....)
    routParam: any,  // fuel dimention data in basline paramiter
    sectionHeader: string
  ) {
    let routSection = new ParameterSection();
    routSection.sectionHeader = sectionHeader;
   
    let routeList: any[] = [];
    parameterSelection.map((v: any) => routeList.push(...v.route));
   
    const uniqueItem = [
      ...new Map(routeList.map((v: any) => [v.name, v])).values(),
    ];
    
    uniqueItem.map((v) => {
      if (v.name !== '' && v.name !== undefined && v.name !== null) {
        let routsectionparam = new SectionParameter();
        routsectionparam.route = v.name;
        routsectionparam.parameterHeader = v.name;
        this.getAllParameters(routParam, routsectionparam, v);
        if (routsectionparam.parameters.length > 0) {
          routSection.sectionparameters.push(routsectionparam);
        }
      }
    });
    this.checkDefaultValue(routSection,"route");
    routSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return routSection;
  }
  genrateStratumParameterSection(
    parameterSelection: ParameterDimensionSelection[], //selcted all basline vlues (vehucal,fuel,....)
    stratumParam: any,  // fuel dimention data in basline paramiter
    sectionHeader: string
  ) {
    let stratumSection = new ParameterSection();
    stratumSection.sectionHeader = sectionHeader;


    parameterSelection.map((v) => {
      v.stratum.map((f:any)=>{
        if (f.name === this.common) {
          let sectionparam = new SectionParameter();
          // sectionparam.fuel = '';
          sectionparam.stratum = f.name;
          sectionparam.parameterHeader = `${f.name}`;
          this.getAllParameters(stratumParam, sectionparam, f);
          stratumSection.sectionparameters.push(sectionparam);
        }
        if(f.name !== this.common){
          let sectionparam = new SectionParameter();
              sectionparam.stratum = f.name;
              sectionparam.feedstock = v.oneFeedstock.name;
              sectionparam.route = '';
              sectionparam.parameterHeader =v.oneFeedstock.name? `${v.oneFeedstock.name} - ${f.name}`: `${f.name}`;
              this.getAllParameters(stratumParam, sectionparam, f);
              stratumSection.sectionparameters.push(sectionparam);
  
  
        }

      })
    
    });
    console.log("++++++++++++stratum",stratumSection)
    this.checkDefaultValue(stratumSection,"stratum");
    stratumSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return stratumSection;
  }

  genratePowerPlantParameterSection(
    parameterSelection: ParameterDimensionSelection[],
    fuelParam: any,
    sectionHeader: string
  ) {
    let fuelSection = new ParameterSection();
    fuelSection.sectionHeader = sectionHeader;

    let routeList: any[] = [];

    parameterSelection.map((v: any) => routeList.push(v.powerPlan));

    const uniqueItem = [
      ...new Map(routeList.map((v: any) => [v.name, v])).values(),
    ];

    uniqueItem.map((v) => {
      if (v.name !== '' && v.name !== undefined && v.name !== null) {
        let fuelsectionparam = new SectionParameter();
        fuelsectionparam.powerPlant = v.name;
        fuelsectionparam.parameterHeader = v.name;
        this.getAllParameters(fuelParam, fuelsectionparam, v.name);
        if (fuelsectionparam.parameters.length > 0) {
          fuelSection.sectionparameters.push(fuelsectionparam);
        }
      }
    });
    console.log("++++++++++++powerPlant",fuelSection)
    this.checkDefaultValue(fuelSection,"powerPlant");
    fuelSection.sectionparameters.forEach(sp => {
      sp.parameters.map(para => {
        para.defaultValues.sort((a: any, b: any) => b.year  - a.year)
      })
    })
    return fuelSection;
  }

  getAllParameters(jsonParam: any, sectionparam: SectionParameter, value: any) {
    

    if (value !== undefined) {
      if (value.name !="Common"){
        let params = this.createParameter(jsonParam);
        sectionparam.parameters = params;
  
        let valueParams = this.createParameter(value);
        sectionparam.parameters.push(...valueParams);
      }
      else if(value.name =="Common"){
        let valueParams = this.createParameter(value);
        sectionparam.parameters = [];
        sectionparam.parameters.push(...valueParams);
      }
    }

    this.suggestValues(sectionparam)
    
    console.log(sectionparam);
  }

  async suggestValues(sectionparam:SectionParameter) {
    let assessments = await this.assessmentProxy.getAssessmentsByCountryMethodology(this.selectedMethodology.id, this.userCountryId).toPromise()
     console.log(assessments)
    this.methodParaCodes = sectionparam.parameters.map(para => {return para.Code});
    let assessmentIds = assessments.map(ass => {return ass.id});
    let filter: string[] | undefined = []
    if (this.methodParaCodes && this.methodParaCodes.length > 0 && 
        assessmentIds && assessmentIds.length > 0){
          filter.push('assessment.id||$in||' + assessmentIds) &
          filter.push('code||$in||'+ this.methodParaCodes)
          if (sectionparam.vehical) filter.push('vehical||$eq||'+ sectionparam.vehical)
          if (sectionparam.fuel) filter.push('fuelType||$eq||'+ sectionparam.fuel)
          if (sectionparam.powerPlant) filter.push('powerPlant||$eq||'+ sectionparam.powerPlant)
          if (sectionparam.route) filter.push('route||$eq||'+ sectionparam.route)
          if (sectionparam.feedstock) filter.push('feedstock||$eq||'+ sectionparam.feedstock)
          if (sectionparam.residue) filter.push('residue||$eq||'+ sectionparam.residue)
          if (sectionparam.soil) filter.push('soil||$eq||'+ sectionparam.soil)
          if (sectionparam.stratum) filter.push('stratum||$eq||'+ sectionparam.stratum)
          if (sectionparam.landClearance) filter.push('landClearance||$eq||'+ sectionparam.landClearance)
          
          this.serviceProxy
              .getManyBaseParameterControllerParameter(
                undefined,
                undefined,
                filter,
                undefined,
                undefined,
                undefined,
                1000,
                0,
                0,
                0
              ).subscribe(async (res: any) => {
                
                let parametersIds:string[] = res.data.map((p:any) => p.id);
           let qcPassParameterRequest =  await this.parameterRequestControllerServiceProxy.getQCpassParameterRequest(parametersIds).toPromise();

           console.log('sectionparam.parameters',qcPassParameterRequest)
                sectionparam.parameters = sectionparam.parameters.map(para =>{
                  // let parameters = res.data.filter((p:any) => (p.code == para.Code) && p.value )
                  let parameters = qcPassParameterRequest.filter((p:any) => (p.parameter.code == para.Code) && p.parameter.value )

                  
                  para.historicalValues = parameters.map((dr: any) => {
                    let p =dr.parameter;
                    return {
                      label: p.AssessmentYear  + ' - ' + p.value + ' ' + p.uomDataEntry , 
                      value: p.value,
                      unit: p.uomDataEntry,
                      year: p.assessmentYear
                    }
                  })
                  let answer: any[] = [];
                  para.historicalValues.forEach((x: any) => {
                    if (!answer.some(y => JSON.stringify(y) === JSON.stringify(x))) {
                      answer.push(x)
                    }
                  })
                  para.historicalValues = answer
                  para.displayhisValues = para.historicalValues.filter(val => val.unit === para.UOM)
                  para.displayhisValues.sort((a: any,b: any) => b.year - a.year);
                  return para
                })
              })
        }

  }

  createParameter(jsonParam: any) {
    let params: Parameter[] = [];
    if (jsonParam.parameter !== undefined) {
      jsonParam.parameter.map((p: any) => {
        let param = new Parameter();
        param.parameterName = p.name;
        param.UOMList = [...p.unit];
        param.Code = p.code;
        param.UOM = param?.UOMList[0];
        param.useDefaultValue =
          p.useDefaultValue === undefined
            ? p.usedefaultvalue === undefined
              ? false
              : p.usedefaultvalue
            : p.useDefaultValue;
        //param.defaultValues = this.defaultValues.filter((a) => a.parameterName === p.name);
        let val = this.getDefaultValues(p.name)
       // console.log('val..',val)
        param.defaultValues = val;
        //console.log("param.....",param.defaultValues)
        if (p.alternativeparameters != undefined) {
          p.alternativeparameters.map((ap: any) => {
            let alterparam = new Parameter();
            alterparam.parameterName = ap.name;
            alterparam.isAlternativeParameter = true;
            alterparam.UOMList = [...ap.unit];
            alterparam.Code = ap.code;
            alterparam.UOM = alterparam.UOMList[0];
            alterparam.useDefaultValue =
              ap.useDefaultValue === undefined ? false : ap.useDefaultValue;
            alterparam.defaultValues = this.defaultValues.filter(
              (a) => a.parameterName === ap.name
            );

            param.alternativeParameters.push(alterparam);
          });
        }
        
        params.push(param);
      });
    }
    
    return params;
  }

  onCAChange(event: any) {
    this.isDiasbaleEye = false;
   console.log("my event....gggg.",this.selectedClimateAction)
   console.log("my event....gg.",event)
   if(this.selectedClimateAction.projectApprovalStatus?.id==5){
     this.hasPrevActiveCA = true

   }
   else{
    this.hasPrevActiveCA = false;

   }
    this.selectedNdc = this.ndcList.find(
      (a) => a.id === this.selectedClimateAction.ndc?.id
    )!;

    this.selectDefaultMethodForNDc();

    this.selctedSubNdc = this.selectedNdc?.subNdc.find(
      (a) => a.id === this.selectedClimateAction.subNdc?.id
    )!;

    this.selectDefaultMethodForSUBNDc();

    this.proposeDateofCommence = new Date(
      this.selectedClimateAction.proposeDateofCommence.year(),
      this.selectedClimateAction.proposeDateofCommence.month(),
      this.selectedClimateAction.proposeDateofCommence.date()
    );

    this.projectDuration = this.selectedClimateAction.duration;

    if(this.IsProposal== false) 
    {
 
      let filterProject: string[] = new Array();
      filterProject.push('project.id||$eq||' +event.id)&
      filterProject.push('Assessment.isProposal||$eq||' +0)&
      filterProject.push('Assessment.assessmentType||$in||' +this.approachList);
      this.serviceProxy.getManyBaseAssesmentControllerAssessment
      (
        undefined,
        undefined,
        filterProject,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.selectedAssessementByCA = res.data;
        console.log('selectedAssessementByCA...', res.data);
  
         let yearList:any[] = [];
         let uniqueYearList:any[] = [];
        for(let assement of this.selectedAssessementByCA )
        {
          for(let asyears of assement.assessmentYear)
          {
            
            yearList.push(asyears.assessmentYear)
          }
        }
        uniqueYearList = [...new Set( yearList)];
  
        console.log('asyears...', yearList);
        console.log('uniqueYearList..', uniqueYearList);
  
        const result:any[] = [];
        // Create a unique list of items to loop over
        // Add each item to the result list
        [...new Set(yearList)].forEach(item => result.push({
          key: item,
          // Get the count of items of the current type {key: '2020', count: 4}
          count: 
          yearList.filter(i => i == item).length
        }));
        let duplicateYears = result.filter((obj)=>obj.count>1);
        console.log('result..', result);
        console.log('duplicateYears..', duplicateYears);
  
        for(let x of duplicateYears)
        {
          
          this.years = this.years.filter((obj)=>obj != x['key'] )
        }
        console.log("this.years..",this.years)
  
        if(this.selectedAssessementByCA.length>0)
        {
           this.methodologys = [];
           this.methodologys[0] = this.selectedAssessementByCA[0].methodology;
           //this.selectedMethodology = this.selectedAssessementByCA[0].methodology;
          // this.selectedMethodology = this.methodologys[0];
          console.log("this.selectedAssessementByCA..",this.methodologys[0])
        }
        else{
          this.methodologys = this.methodologysCopy;
        }
      });

    }

    



  }


  getDefaultValues(name:any)
  {
   // param.defaultValues = this.defaultValues.filter((a) => a.parameterName === name);
   let idArray:any[] = [];
   let arr:any[] = [];
   
   arr = this.defaultValues.filter((a) => a.parameterName === name && a.value !== null);
  //  arr = this.defaultValues.filter((a) => a.parameterName === name && a.parentId === null);
  // console.log('arrname...',arr)
   for(let item of arr)
   {
     
     idArray.push(item.id)
    // console.log("item",idArray);
   }
  // console.log('inside loop ',idArray)
  // console.log('end of foor loop')

   let arr2:any[] = [];
   //arr2 =   this.defaultValues.filter((a) =>a.parentId in idArray);
   for(let pId of idArray)
   {
    // let child:any[] = [];
    let child = this.defaultValues.filter((a) =>a.parentId === pId && a.value != null);
     
     if(child.length != 0)
     {
      Array.prototype.push.apply(arr2,child); 
      //arr2.push(child)
     }
     
   }
  // console.log("child array",arr2)
   //console.log("arr.....2",arr2)
   Array.prototype.push.apply(arr,arr2); 
   //arr.concat(arr2);
  // console.log("arr.....3",arr)
   return arr;
  }

  onNdcChange(event: any) {
    this.selectDefaultMethodForNDc();
  }

  selectDefaultMethodForNDc() {
    console.log(this.selectedNdc);

    var metho = this.methodologyList.filter(
      (a) => a.ndc.find((n: Ndc) => n.id === this.selectedNdc.id) !== undefined
    );

    if (metho !== null && metho.length > 0) {
      this.selectedMethodology = metho[0];
    }
  }

  onSubNdcChange(event: any) {
    console.log('DDDDDDD');
    this.selectDefaultMethodForSUBNDc();
  }

  onCAChangeProjectStatus() {
    if (this.IsProposal == false) {
      this.updateProjectApprovelState();
    }
  }

  onChangeAssessmentType()
  {
    if(this.IsProposal==false)
    {
 
      let result = this.assementYearAndTypeObjectList.find((o)=>o.assessmentType == this.selectedApproch)
      console.log("my result..",result)
  
      if(result != undefined)
      {
        this.isDisableforSubmitButton = true;
        this.isSubmitted = true;
        this.warningMessage = "You have done an "+result['assessmentType']+" assessment before in "+result['year']+" please select assessment years again!"
      }
      else
      {
        this.isDisableforSubmitButton = false
        this.warningMessage ='';
      }

    }
    
   
  }

  selectDefaultMethodForSUBNDc() {
    if (this.selectedNdc) {
      var metho = this.methodologyList.filter(
        (a) =>
          a.subNdc.find((n: SubNdc) => n.id === this.selctedSubNdc.id) !==
          undefined
      );

      if (metho !== null && metho.length > 0) {
        this.selectedMethodology = metho[0];
      }
    }
  }

  // checkFormValidity():boolean{

  //       if(this.selectedClimateAction== undefined || this.selectedClimateAction==null){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select Specific Climate Action before submit'});
  //         return false;
  //       }
  //       if(this.baseYear== undefined || this.baseYear==null){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select base year before submit'});
  //         return false;
  //       }
  //       if(!this.IsProposal && (this.selectYears== undefined || this.selectYears.length==0)){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select Assessment Years before submit'});
  //         return false;
  //       }
  //       if(this.IsProposal && (this.assesmentYear== undefined || this.assesmentYear==null)){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select Assessment Year before submit'});
  //         return false;
  //       }
  //       if(this.projectDuration== undefined || this.projectDuration==null){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select Project Duration before submit'});
  //         return false;
  //       }
  //       if(this.proposeDateofCommence== undefined || this.proposeDateofCommence==null){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select Date of Commence before submit'});
  //         return false;
  //       }
  //       if(this.selectedApproch== undefined || this.selectedApproch==null){

  //         this.messageService.add({severity:'error', summary:'Fill mandatory field', detail:'Please select Assessment Approach before submit'});
  //         return false;
  //       }
  //       // if(this.proposeDateofCommence== undefined || this.proposeDateofCommence==null){

  //       //   this.messageService.add({severity:'error', summary:'Fill Emplty Space', detail:'Please select Date of Commence before submit'});
  //       //   return false;
  //       // }
  //       // if(this.proposeDateofCommence== undefined || this.proposeDateofCommence==null){

  //       //   this.messageService.add({severity:'error', summary:'Fill Emplty Space', detail:'Please select Date of Commence before submit'});
  //       //   return false;
  //       // }

  //   return true
  // }

  async createAssementCA(data: NgForm) {
    console.log("proprose")
    this.requiredParas = true
    if (this.IsProposal) {
      this.selectYears = [];
    }

    if (data.form.valid && this.selectYears !== undefined && !this.isSave ) {
      let country = new Country();
      country.id = this.userCountryId;
      let assessment = new Assessment();
      assessment.country = country;
      assessment.baseYear = this.baseYear.getFullYear();
      if (this.selectedNdc) {
        var ndc = new Ndc();
        ndc.id = this.selectedNdc.id;
        assessment.ndc = ndc;
      } else {
        assessment.ndc = undefined!;
      }
      if (this.selctedSubNdc) {
        var subndc = new SubNdc();
        subndc.id = this.selctedSubNdc.id;
        assessment.subNdc = subndc;
      } else {
        assessment.subNdc = undefined!;
      }
      assessment.projectDuration = this.projectDuration;
      assessment.projectStartDate = moment(this.proposeDateofCommence);
      assessment.isGuided = this.isGuidedSelection;
      assessment.assessmentType = this.selectedApproch;
      if (this.selectedMitigationActionType) {
        assessment.mitigationActionType = this.selectedMitigationActionType;
      }
      assessment.methodology = this.selectedMethodology;
      assessment.baselineScenario = this.baselineScenario;
      assessment.projectScenario = this.ProjectScenario;
      assessment.lekageScenario = this.LeakageScenario;
      assessment.project = this.selectedClimateAction;
      assessment.applicability = this.selectedApplicability;
      assessment.isProposal = this.IsProposal;
      if (this.selectedEasyofdataCollection) {
        assessment.easyOfUseDataCollection = this.selectedEasyofdataCollection;
      }
      assessment.applicability = undefined!;
      assessment.assessmentObjective = this.selectedObjective;
      assessment.methodologyCode = this.methodologyCode;
      assessment.methodologyVersion = this.methodologyVersion;

      let assesmentYars: AssessmentYear[] = [];
      let parameters: Parameter_Server[] = [];

      if (this.IsProposal) {
        this.selectYears.push(this.assesmentYear.getFullYear());
      }

      this.selectYears.map((y: any) => {
        let ae = new AssessmentYear();
        ae.assessmentYear = y;
        assesmentYars.push(ae);

        if (this.blParameters !== undefined && this.blParameters !== null) {
          if (
            this.blParameters.routeSection !== undefined &&
            this.blParameters.routeSection.sectionparameters.length > 0
          ) {
            let routeParams = this.createParam(
              this.blParameters.routeSection,
              true,
              false,
              false,
              false,
              y,
              this.countryCode
            );
            parameters.push(...routeParams!);
          }

          let vehicalParams = this.createParam(
            this.blParameters.vehicalSection,
            true,
            false,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...vehicalParams!);

          let fuelParams = this.createParam(
            this.blParameters.fuelSection,
            true,
            false,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...fuelParams!);

          let powerPlant = this.createParam(
            this.blParameters.powerPlantSection,
            true,
            false,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...powerPlant!);

          // let routePlant = this.createParam(
          //   this.blParameters.routeSection,
          //   true,
          //   false,
          //   false,
          //   false,
          //   y,
          //   this.countryCode
          // );
          // parameters.push(...routePlant!);

         //newly added section
         let feedstock = this.createParam(
          this.blParameters.feedstockSection,
          true,
          false,
          false,
          false,
          y,
          this.countryCode
        );
        parameters.push(...feedstock!);

        let residue = this.createParam(
          this.blParameters.residueSection,
          true,
          false,
          false,
          false,
          y,
          this.countryCode
        );
        parameters.push(...residue!);

        let stratum = this.createParam(
          this.blParameters.stratumSection,
          true,
          false,
          false,
          false,
          y,
          this.countryCode
        );
        parameters.push(...stratum!);


        let soil = this.createParam(
          this.blParameters.soilSection,
          true,
          false,
          false,
          false,
          y,
          this.countryCode
        );
        parameters.push(...soil!);

        let landClearance = this.createParam(
          this.blParameters.landClearanceSection,
          true,
          false,
          false,
          false,
          y,
          this.countryCode
        );
        parameters.push(...landClearance!);




        }

        if (this.prParameters !== undefined && this.prParameters !== null) {
          let routeParams = this.createParam(
            this.prParameters.routeSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...routeParams!);

          let vehicalParams = this.createParam(
            this.prParameters.vehicalSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...vehicalParams!);

          let fuelParams = this.createParam(
            this.prParameters.fuelSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...fuelParams!);

          let powerPlant = this.createParam(
            this.prParameters.powerPlantSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...powerPlant!);

          // let route = this.createParam(
          //   this.prParameters.routeSection,
          //   false,
          //   true,
          //   false,
          //   false,
          //   y,
          //   this.countryCode
          // );
          // parameters.push(...route!);


          //newly added  dimentions
          let feedstock = this.createParam(
            this.prParameters.feedstockSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...feedstock!);
  
          let residue = this.createParam(
            this.prParameters.residueSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...residue!);
  
          let stratum = this.createParam(
            this.prParameters.stratumSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...stratum!);
  
  
          let soil = this.createParam(
            this.prParameters.soilSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...soil!);
  
          let landClearance = this.createParam(
            this.prParameters.landClearanceSection,
            false,
            true,
            false,
            false,
            y,
            this.countryCode
          );
          parameters.push(...landClearance!);
        }

        if (this.lkParameters !== undefined && this.lkParameters !== null) {
          let routeParams = this.createParam(
            this.lkParameters.routeSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...routeParams!);

          let vehicalParams = this.createParam(
            this.lkParameters.vehicalSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...vehicalParams!);

          let fuelParams = this.createParam(
            this.lkParameters.fuelSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...fuelParams!);

          let powerPlant = this.createParam(
            this.lkParameters.powerPlantSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...powerPlant!);

          // let route = this.createParam(
          //   this.lkParameters.routeSection,
          //   false,
          //   false,
          //   true,
          //   false,
          //   y,
          //   this.countryCode
          // );
          // parameters.push(...route!);

 //newly added dimensions


          let feedstock = this.createParam(
            this.lkParameters.feedstockSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...feedstock!);
  
          let residue = this.createParam(
            this.lkParameters.residueSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...residue!);
  
          let stratum = this.createParam(
            this.lkParameters.stratumSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...stratum!);
  
  
          let soil = this.createParam(
            this.lkParameters.soilSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...soil!);
  
          let landClearance = this.createParam(
            this.lkParameters.landClearanceSection,
            false,
            false,
            true,
            false,
            y,
            this.countryCode
          );
          parameters.push(...landClearance!);
        }
      });

      assessment.assessmentYear = assesmentYars;
      assessment.parameters = parameters;

      let paramSuffix =
        this.ProjectIndicaterEnum[
          this.ProjectIndicaterEnum['Population Growth (POP)']
        ] === this.selectedprojectIndicater
          ? 'POP'
          : 'GDP';

      //-----------------Projection----------
      if (this.selectedApproch === 'Ex-ante') {
        assessment.projectionIndicator = this.selectedprojectIndicater;
        assessment.projectionBaseYear = this.ProjectionbaseYear;

        let projectBaseYearParm = this.createProjectionParam(
          'Projection Base Year ' + assessment.projectionBaseYear,
          this.selectdProjectionBaseYearInstition,
          this.selectdProjectionBaseYearValue,
          this.pBYPDDefaultValue,
          assessment.projectionBaseYear,
          null!,
          this.selectdProjectionBaseYeardefaultValue
        );
        assessment.parameters.push(projectBaseYearParm);

        let projectionYears: ProjectionYear[] = [];
        if (this.IsProposal) {
          let pyear = new ProjectionYear();
          pyear.year = this.ProjectionYear.getFullYear();
          projectionYears.push(pyear);

          let projectYearParm = this.createProjectionParam(
            'Projection Year ' + paramSuffix + ' ' + pyear.year,
            this.selectdProjectionYearInstition,
            this.selectdProjectionYearValue,
            this.pBYPDDefaultValue,
            assessment.projectionBaseYear,
            this.ProjectionYear.getFullYear(),
            null!
          );
          assessment.parameters.push(projectYearParm);
        } else {
          this.projectionYears.map((y) => {
            let pyear = new ProjectionYear();
            pyear.year = y;
            projectionYears.push(pyear);

            let projectYearParm = this.createProjectionParam(
              'Projection Year ' + paramSuffix + ' ' + y,
              this.selectdProjectionYearInstition,
              this.selectdProjectionYearValue,
              this.pBYPDDefaultValue,
              assessment.projectionBaseYear,
              y,
              null!
            );
            assessment.parameters.push(projectYearParm);
          });
        }

        assessment.projectionYear = projectionYears;
      }

      if (this.IsProposal) {
        this.selectYears = [];
      }

      // this.assessmentProxy.createAssesment(assessment) .subscribe((res: any) => {
      //   console.log('Saved Assessment');
      //   console.log(res);

      //   if (this.IsProposal == false) {
      //     this.serviceProxy
      //       .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
      //         undefined,
      //         undefined,
      //         undefined,
      //         undefined,
      //         undefined,
      //         undefined,
      //         1000,
      //         0,
      //         0,
      //         0
      //       )
      //       .subscribe((res: any) => {
      //         this.projectApprovalStatus = res.data;

      //         let status = this.projectApprovalStatus.find((a) => a.id === 5);
      //         this.selectedClimateAction.projectApprovalStatus =
      //           status === undefined ? (null as any) : status;

      //         this.serviceProxy
      //           .updateOneBaseProjectControllerProject(
      //             this.selectedClimateAction.id,
      //             this.selectedClimateAction
      //           )
      //           .subscribe((res) => {});
      //       });
      //   }

      //   alert('Successfully Saved');
      //   this.savedAsessment = res;
      //   //this.updateAssesmentProject(res);
      //   this.isSave = true;
      // });
      console.log("my asse..",assessment);
      console.log("pasing", this.requiredParas)
      if (this.requiredParas){
        this.serviceProxy
          .createOneBaseAssesmentControllerAssessment(assessment)
          .subscribe((res: any) => {
            this.isDisableforSubmitButton = true;
            this.isSubmitted = true
            
            // console.log('....Saved Assessment',assessment);
            console.log("assess..",res);
  
            if (this.IsProposal == false) {
              this.serviceProxy
                .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  1000,
                  0,
                  0,
                  0
                )
                .subscribe((res: any) => {
                  this.projectApprovalStatus = res.data;
  
                  let status = this.projectApprovalStatus.find((a) => a.id === 5);
                  this.selectedClimateAction.projectApprovalStatus =
                    status === undefined ? (null as any) : status;
  
                  this.serviceProxy
                    .getOneBaseProjectControllerProject(
                      this.selectedClimateAction.id,
                      undefined,
                      undefined,
                      undefined
                    )
                    .subscribe((res) => {
                      res.projectApprovalStatus =
                        status === undefined ? (null as any) : status;
                      this.serviceProxy
                        .updateOneBaseProjectControllerProject(res.id, res)
                        .subscribe((res) => {});
                    });
                });
            }
  
            if(this.IsProposal == false)
            {
              this.messageService.add({severity:'success', summary:'Confirmed', detail:'Successfully send to  DC team!'});
              
  
              this.savedAsessment = res;
              this.getAssesmentResult(res.id);
              this.isSave = true;
            }
            else
            {
              this.messageService.add({severity:'success', summary:'Confirmed', detail:'Successfully created an assessment!'});
              
  
            this.savedAsessment = res;
            this.getAssesmentResult(res.id);
            this.isSave = true;
            }
           // alert('Successfully Saved');
           
          },err=>{console.log("saving error",err);
          this.messageService.add({severity:'error', summary:'Error Saving', detail:'Error saving in assessment!'});
        
        
        });
      } else {
        this.isSubmitted = true;
      }
    }
    
  }

  updateAssesmentProject(assessment: Assessment) {
    let proj = new Project();
    proj.id = assessment.project.id;
    assessment.project = proj;

    this.serviceProxy
      .updateOneBaseAssesmentControllerAssessment(assessment.id, assessment)
      .subscribe((res: any) => {
        console.log('Updated Assesment Project');
        console.log(res);
      });
  }

  getAssesmentResult(assesmentId: number) {
    let filter: string[] = new Array();

    this.assesmentYearProxy
      .getAllByAssessmentId(assesmentId)
      .subscribe((res) => {
        let assesYear = res;

        this.assesmentResaultProxy
          .getAssesmentResult(assesmentId, assesYear[0].ay_id, true,"1234")
          .subscribe((res) => {

         
            // this.assessmentResult = res;
           // console.log('getAssesmentResult...',res);
          });
      });
  }

  private createParam(
    section: ParameterSection,
    isBaseline: boolean,
    isProject: boolean,
    islekage: boolean,
    isProjection: boolean,
    assesmentYear: number,
    countryCode:string
  ) {
    let parameters: Parameter_Server[] = [];

    if (
      section !== null &&
      section !== undefined &&
      section.sectionparameters.length > 0
    ) {
      console.log("sectionparameters",section.sectionparameters)
      section.sectionparameters.map((sp: SectionParameter) => {
        sp.parameters.map((p: Parameter) => {
          let param = this.createServerParam(
            p,
            sp,
            assesmentYear,
            undefined,
            false,
            isBaseline,
            isProject,
            islekage,
            isProjection,
            countryCode
          );
          parameters.push(param);
          if (p.alternativeParameters.length > 0) {
            p.alternativeParameters.map((p: Parameter) => {
              let altParam = this.createServerParam(
                p,
                sp,
                assesmentYear,
                param,
                true,
                isBaseline,
                isProject,
                islekage,
                isProjection,
                countryCode
              );
              parameters.push(altParam);
            });
          }
        });
      });
    }
    return parameters;
  }

  createServerParam(
    p: Parameter,
    sp: SectionParameter,
    assesmentYear: number,
    pp: Parameter_Server | undefined,
    isAlternative: boolean,
    isBaseline: boolean,
    isProject: boolean,
    islekage: boolean,
    isProjection: boolean,
    countryCode:string
  ) {

    if (this.IsProposal){
      if (p.alternativeParameters.length==0){
        if (!p.isAlternativeParameter){
          if (!p.value && !p.institution){
            if((!p.defaultValue && p.isDefaultValue)){
              this.requiredParas = false
            }else if (!p.isDefaultValue && (!p.institution)){
              this.requiredParas = false
            } 
          }
        }
      }
      else{
        this.requiredParas = true
      }
      
    } else {
      if (!p.value && !p.institution){
        if((!p.defaultValue && p.isDefaultValue)){
          this.requiredParas = false
        }else if (!p.isDefaultValue && (!p.institution)){
          this.requiredParas = false
        } 
      } 
    }

    console.log("#############", p, this.requiredParas)
    // console.log()
      
    console.log(sp);
    let param = new Parameter_Server();
    param.name = `${p.parameterName} - ${sp.parameterHeader}`;
    param.originalName = p.parameterName;
    let inst = new Institution();
    inst.id = p.institution?.id;
    param.institution = inst;
    param.isAlternative = isAlternative;

    if (param.isAlternative) {
      if (pp !== undefined && pp.isHistorical){
        pp.institution = null!
      }
      param.parentParameter = pp!;
    }
    param.baseYear = this.baseYear.getFullYear();
    param.assessmentYear = assesmentYear;
    param.useDefaultValue = p.useDefaultValue;
    param.isBaseline = isBaseline;
    param.isProject = isProject;
    param.isLekage = islekage;
    param.isProjection = isProjection;
    param.route = sp.route;
    param.powerPlant = sp.powerPlant;
    param.feedstock = sp.feedstock;
    param.soil = sp.soil;
    param.stratum = sp.stratum;
    param.residue = sp.residue;
    param.landClearance = sp.landClearance;
    param.fuelType = sp.fuel;
    param.vehical = sp.vehical;
    param.value = p.value;
    if (p.isDefaultValue && this.requiredParas) {
      param.value = p.defaultValue.value;
      param.defaultValue = p.defaultValue;
      param.isDefault = p.isDefaultValue
      param.uomDataEntry = p.UOM;
      param.conversionValue = p.value;
    }
    if (this.IsProposal) {
      param.uomDataEntry = p.UOM;
      param.conversionValue = p.value;
    }
    if (p.isHistorical){
      param.isHistorical = p.isHistorical
      param.uomDataEntry = p.UOM;
      param.conversionValue = p.value;
    }
    param.uomDataRequest = p.UOM;
    param.methodologyCode = this.methodologyCode;
    param.methodologyVersion = this.methodologyVersion;
    param.code = p.Code;
    param.countryCodeExtended = countryCode;

    return param;
  }

  createProjectionParam(
    name: string,
    institution: Institution,
    value: string,
    useDefaultValue: boolean,
    projectionBaseYear: number,
    projectionYear: number,
    defaulteVlue: DefaultValue
  ) {
    let param = new Parameter_Server();
    param.name = name;
    param.originalName = name;
    param.institution = institution;
    param.baseYear = this.baseYear.getFullYear();
    param.useDefaultValue = useDefaultValue;
    param.isBaseline = false;
    param.isProject = false;
    param.isLekage = false;
    param.isProjection = true;
    param.projectionBaseYear = projectionBaseYear;
    param.projectionYear = projectionYear;
    param.value = value;
    // param.defaultValueI = defaulteVlue;
    if (
      this.selectedprojectIndicater ===
      this.ProjectIndicaterEnum[
        this.ProjectIndicaterEnum['Population Growth (POP)']
      ]
    )
      param.uomDataRequest = 'population';
    else {
      param.uomDataRequest = 'GDP';
    }

    return param;
  }

  onMethodologyChange($event: any) {
    this.isClimateActionListDisabled = true;
    this.clear();
    this.loadJson();
    this.methodAssessments = this.selectedMethodology.assessments
    console.log("this.selectedMethodology",this.selectedMethodology)
  }

  onBaselineScenarioChange(event: any){
    this.isMethodologyDisabled = true;
  }

  Changeobjective(event: any) {
    if (event.filter.length >= 3) {
      let vValue = this.assesmentObjective.find(
        (a: any) => a.name === event.filter
      );
      if (vValue === undefined || vValue === null) {
        this.showAddObjective = true;
        this.newObjective = event.filter;
      } else {
        this.showAddObjective = false;
        this.newObjective = '';
      }
    }
  }

  addObjective() {
    let assesmentObjective = new AssessmentObjective();
    assesmentObjective.objective = this.newObjective;
    this.assesmentObjective.push(assesmentObjective);
    // this.selectedObjective.push(assesmentObjective);
    this.showAddObjective = false;
    this.newObjective = '';
  }

  detail() {
    if (this.selectedClimateAction) {
      this.router.navigate(['/propose-project'], {
        queryParams: { id: this.selectedClimateAction.id },
      });
    }
  }

  clear() {
    this.blParameters = new ParameterSections();
    this.prParameters = new ParameterSections();
    this.lkParameters = new ParameterSections();
    // this.routes = [];
    // this.powerPlants = [];
    // this.baslineParam = [];
    // this.ProjectParam = [];
    // this.lekageParam = [];
    // this.methodologyCode = '';
    // this.useRoute = false;
    // this.usePowerPlant = false;
    this.baselineScenario = '';
    this.ProjectScenario = '';
    this.LeakageScenario = '';
    // this.blHasVehicale = false;
    // this.blHasFuel = false;
    // this.blHasRoute = false;
    // this.blHasPowerPlant = false;
    // this.prHasVehicale = false;
    // this.prHasFuel = false;
    // this.prHasRoute = false;
    // this.prHasPowerPlant = false;
    // this.lkHasVehicale = false;
    // this.lkHasRoute = false;
    // this.lkHasPowerPlant = false;
    // this.blVehicalValue = [];
    // this.blFuelValue = [];
    // this.prVehicalValue = [];
    // this.prFuelValue = [];
    // this.lkVehicalValue = [];
    // this.lkFuelValue = [];
    this.basllineSelection = [];
    this.projectSelection = [];
    this.lekageSelection = [];
    this.basllineSelection.push(new ParameterDimensionSelection().createNew());
    this.projectSelection.push(new ParameterDimensionSelection().createNew());
    this.lekageSelection.push(new ParameterDimensionSelection().createNew());

    this.showBaslineGenrate = true;
    this.showProjectGenrate = true;
    this.showLekageGenrate = true;
  }

  filterMethodology() {

    
    if(this.countOfMitigationActionDropDownList>1)
    {
      console.log("inside countOfMitigationActionDropDownList if .. ")
      this.methodologys = this.methodologysCopy;
      this.applicability = []
      this.selectedApplicability  = [];
      this.selectedEasyofdataCollection = '';
      this.arrEsy = []
      this.countOfMitigationActionDropDownList = 0;
      this.countOfMitigationActionDropDownList = this.countOfMitigationActionDropDownList+1;
    }

    if (this.selectedMitigationActionType !== undefined) {
      this.methodologys = this.methodologys.filter(
        (a) =>
          a.mitigationActionType?.id === this.selectedMitigationActionType?.id
      );

      
    }
    if (
      this.selectedApplicability !== undefined &&
      this.selectedApplicability.length > 0
    ) {



     // this.methodologys = this.methodologys.filter((a) =>this.selectedApplicability.find((b) => b.id === a.applicability?.id) !== undefined);
     let appliArr1:any[]=[];
     let val: any[]=[];
     for(let item of this.selectedApplicability)
     {
      let vals = this.methodologys.filter((a) =>a.applicability.id == item.id)
      Array.prototype.push.apply(appliArr1,vals);
   
     }

     setTimeout(() => {
      this.methodologys = appliArr1;
     
    }, 1000);
    



     
    }
    if (this.selectedEasyofdataCollection !== undefined && this.selectedEasyofdataCollection !== '') 
    {
     this.methodologys = this.methodologys.filter((a) => a.easenessOfDataCollection == this.selectedEasyofdataCollection);
    }
  }

  async onMitigationActionChange($event: any) {
    
    this.countOfMitigationActionDropDownList = this.countOfMitigationActionDropDownList +1;
    this.filterMethodology();
    let arr:any[]= []  
    for(let item of this.methodologys)
    {
       arr.push(item.id)
    } 
    let res2:any;
    let id = 1;
    res2 = await this.applicabilityControllerServiceProxy.getApplicability().toPromise();
   for(let item of res2)
    {
      let count = 0;
       for (let x of item.methodologies)
       {
          
          for(let y of arr)
          {
             if(x.id == y && count == 0)
             {
               count++;
              this.applicability.push(item)
             }
          }
       }
    } 
  
    
  }

  onApplicationAssesmentChange($event: any) {

    this.filterMethodology();

   
    for(let item of this.methodologys)
    {
     let x  = item.easenessOfDataCollection;
    
     this.arrEsy.push(x)

    }
    this.arrEsy = [...new Set(this.arrEsy)];

  }




  onEasyOFdataCollectionChange($event: any) {

    this.filterMethodology();
  }

  async ViewResultClick() {
   console.log("++++++++++++++++++final",this.uniqdefaultValues);
   for (let num of this.uniqdefaultValues){
   let result= await this.defaultValueControllerServiceProxy.createValue(num) .subscribe((res) => {});;
   
   }
   setTimeout(() => {
     
    this.router.navigate(['/result'], {
      queryParams: {
        id: this.savedAsessment.id,
        yr: this.assesmentYear.getFullYear(),
      },
    });           
    },2000);
    
  }

  async onAssesmentYearChange(event: any) {
    this.projectionBaseyears = [];
    if (this.IsProposal) {
      this.projectionBaseyears.push(this.assesmentYear.getFullYear());
      this.ProjectionbaseYear = this.projectionBaseyears[0];
    } else {
      // var min = Math.min(...this.selectYears);
      // var max = Math.max(...this.selectYears);

      // var maxDate = new Date();
      // maxDate.setFullYear(max);

      // var minDate = new Date();
      // minDate.setFullYear(min);

      // this.projectionBaseMaxDate = maxDate;
      // this.projectionBaseMinDate = minDate;
      this.projectionBaseyears.push(...this.selectYears);

     //console.log("selctYeras..",this.selectYears)
    
     this.warningMessage='';
     this.selectedApproch = '';
     this.assementYearAndTypeObjectList=[];
     for(let year of this.selectYears)
     {
 
      //
      let res2:any;
      res2 = await this.assesmentYearProxy.getAssessmentByYearAndProjectId(year.toString(),this.selectedClimateAction.id).toPromise();
      //this.assessmentList = res2;
      
 
      let objAsseType = {'year':0,'assessmentType':''}
      objAsseType['year'] = year;
      objAsseType['assessmentType'] = res2?.Assessment?.assessmentType;
      this.assementYearAndTypeObjectList.push(objAsseType);
 
     }
 
     console.log("assessmentByYearListr..",this.assementYearAndTypeObjectList)

    }

    
  }

  updateProjectApprovelState() {
    this.serviceProxy
      .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.projectApprovalStatus = res.data;

        let status = this.projectApprovalStatus.find((a) => a.id === 5);
        this.selectedClimateAction.projectApprovalStatus =
          status === undefined ? (null as any) : status;

        this.serviceProxy
          .updateOneBaseProjectControllerProject(
            this.selectedClimateAction.id,
            this.selectedClimateAction
          )
          .subscribe((res) => {});
      });
  }
//////
  isGuidedSelectionChange(event: any) {
    this.selectedMitigationActionType = undefined;
    this.selectedApplicability = [];
    this.selectedEasyofdataCollection = undefined;
    this.selectedMethodology = new Methodology();
    this.methodologys = this.methodologyList;

    console.log(this.methodologyList);
    console.log(this.methodologys);
  }

  isDirectSelectionChange(event: any) {
    this.selectedMitigationActionType = undefined;
    this.selectedApplicability = [];
    this.selectedEasyofdataCollection = undefined;
    this.selectedMethodology = new Methodology();
    this.methodologys = this.methodologyList;

    console.log(this.methodologyList);
    console.log(this.methodologys);
  }

  getOptions(blFuelValue: any) {
    
    if (blFuelValue) {
      blFuelValue = blFuelValue.filter((a: any) => a.name !== this.common);
    }

    return blFuelValue;
  }

  getCommon(value: any) {
    let common = undefined;
    if (value) {
      common = value.find((a: any) => a.name === this.common);
    }

    console.log("common",common)
    return common;
  }
}
function selectedClimateActionnt(arg0: string, selectedClimateActionnt: any) {
  throw new Error('Function not implemented.');
}


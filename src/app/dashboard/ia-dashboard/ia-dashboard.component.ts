import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Assessment, AssessmentResault, AssessmentYear, EmissionReductioDraftDataEntity, EmissionReductionDraftdataControllerServiceProxy, Institution, Ndc, NdcControllerServiceProxy, Parameter, ParameterControllerServiceProxy, ParameterRequest, Project, ProjectControllerServiceProxy, Sector, ServiceProxy, SubNdc, User, UserType } from 'shared/service-proxies/service-proxies';
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
  emissionReduction: EmissionReductioDraftDataEntity = new EmissionReductioDraftDataEntity();
  parameterList: Parameter[];
  cliamteActionsBySector: Project[];
  assessmentList: AssessmentResault[];
  climateActionIdList: number[] = new Array();
  assessmentListBySector: Assessment[] = [];
  finalAssessmentList: Assessment[] = [];
  request: ParameterRequest[] = new Array();
  assessmetYr: AssessmentYear[] = new Array();
  assessmentListId: number[] = new Array();
  yrGap: number;
  newYr: number;
  yrList: number[] = new Array();
  yrListGraph: string[] = new Array();
  postYrList: number[] = new Array();
  postresaultList: number[] = new Array();
  postIdLisst: number[] = new Array();
  paramaterRequest: number = 0;
  parameterPending: number = 0;
  parameterReview: number = 0;
  institutionId: number =0;
  basicData: any;
  unconditionalValue: number;
  conditionalValue: number;
  actualdata: number[][] = [];
  pid: number[] =[];
  subndcList: SubNdc[] = [];
  subNdcCopy : SubNdc[] = [];
  ndcList : Ndc[] = [];
  projectemreduct: number[]=[];
  data3:number[]=[];

  userCountryId:number = 0;
  sectorList: Sector[] = [];
  operationalProjectsCount: number = 0;
  countryId=1;
  loading: boolean;
  loadingCA: boolean;
  totalRecords: number = 0;
  totalRecordsCA: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  projects: Project[];

  activeprojects:activeproject[]=[];
  activeprojectson:activeproject[]=[];
  activeprojectsload:activeproject[]=[];

  actualValLst:number[]=new Array();
  unconValLst:number[]=new Array();
  conValLst:number[]=new Array();
  bauValLst:number[]=new Array();
  filter: string[] = new Array();
  currentYear:number=(new Date()).getFullYear();
  
  searchBy: any = {
    sector: 0,
    ndc: 0,
    subndc: 0,
  };

  //   horizontalOptions: any;
    lineStylesData: any;
    basicOptions1: any;
    basicOptions2: any;
    sectorId: number = 1;  // particular sector id from login
  

  //   config: AppConfig;
  //   constructor() { }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy,
    private emmissionProxy: EmissionReductionDraftdataControllerServiceProxy,
    private ndcProxy:NdcControllerServiceProxy,
    private paraProxy:ParameterControllerServiceProxy
  ) {


    this.basicOptions1 = {
      plugins: {
       
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          // x: {
          //   display:true,
          //   title:{
          //     display:true,
          //     text:'x-axis',
          //     font:{
          //       size:12
          //     }
          //   },
          //     ticks: {
          //         color: '#495057'
          //     },
          //     grid: {
          //         color: '#ebedef'
          //     }
          // },
          y: {
            display:true,
            title:{
              display:true,
              text:'Count',
              font:{
                size:12
              }
            },
              ticks: {
                  color: '#495057',
                  precision: 0
              },
              grid: {
                  color: '#ebedef'
              }
          },
        
      }
  };
  this.basicOptions2 = {
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
          display:true,
          title:{
            display:true,
            text:'Years',
            font:{
              size:12
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
          display:true,
          title:{
            display:true,
            text:'Emissions (tCO₂e)',
            font:{
              size:12
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

  userName:String;
  
ngOnInit(): void {   

  // let ids: Array<number>;
  // ids = [23, 34, 100, 124, 44]; 
  // console.log('aaaaaaaaaa',ids)
  const token = localStorage.getItem('access_token')!;
  this.userName = decode<any>(token).fname;
  const tokenPayload = decode<any>(token);
  this.userCountryId  = tokenPayload.countryId;
//     var canvas: any = document.getElementById('chart')!;
//    new Chart(canvas, {
//   type: 'line',
//   data: {
//     labels: ['1', '2', '3', '4', '5'],
//     datasets: [{
//       label: 'A',
//       yAxisID: 'A',
//       data: [100, 96, 84, 76, 69]
//     }, {
//       label: 'B',
//       yAxisID: 'B',
//       data: [1, 1, 1, 1, 0]
//     }]
//   },
//   options: {
//     scales: {
//       yAxes: [{
//         id: 'A',
//         type: 'linear',
//         position: 'left',
//       }, {
//         id: 'B',
//         type: 'linear',
//         position: 'right',
//         ticks: {
//           max: 1,
//           min: 0
//         }
//       }]
//     }
//   }
// });


// this.serviceProxy.getManyBaseNdcControllerNdc(
//   undefined,
//   undefined,
//   undefined,
//   undefined,
//   ['id,DESC'],
//   undefined,
//   1000,
//   0,
//   0,
//   0
//   )
this.ndcProxy.getDateRequest(0,0,[])
  .subscribe((res=>{
    for(let d of res.data){
      this.ndcList.push(d)
    }
    this.ndcList = this.ndcList.filter((o)=>o.country.id == this.userCountryId);
  }))

  // this.serviceProxy.getManyBaseSubNdcControllerSubNdc(
  //   undefined,
  //   undefined,
  //   undefined,
  //   undefined,
  //   ['id,DESC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  //   )
  //   .subscribe((res=>{
  //     for(let d of res.data){
  //       this.subndcList.push(d)
  //     }
  //       this.subNdcCopy = this.subndcList;

  //   }))
  let i =0;
    for(let y of this.projectemreduct){
      console.log('rtrtrtrtrrtrt',this.projectemreduct[i]);
      this.data3.push(this.projectemreduct[i]);
      i++;
      
    }


    this.route.queryParams
    .subscribe((params) => {
      const token = localStorage.getItem('access_token')!;
      const tokenPayload = decode<any>(token);
      // this.userId = params['id'];
      // console.log( "this.userId");
      console.log( tokenPayload)
      let filterByUserEmail: string[] = new Array();

      filterByUserEmail.push('email||$eq||'+ tokenPayload.usr)
      this.serviceProxy
      .getOneBaseUsersControllerUser(
        7,
        undefined,
        undefined,
        0,
      ).subscribe((res: any) =>{
        this.user = res;
        
        console.log('user...',this.user);
        this.institutionId = this.user.institution.id;

        // console.log('instiId',this.institutionId)



        //get institution and sector by user
        this.serviceProxy
        .getOneBaseInstitutionControllerInstitution(
          this.user.institution?.id,
          undefined,
          undefined,
          0
        ).subscribe((res: any) =>{
          this.institution = res;
          console.log('insssss',this.institution)
          this.sectorId = this.institution.sector.id
          // this.sectorId=1;
          console.log('sector..',this.institution.sector.id);
          this.sector = this.institution.sector.name;
        })

        // this.serviceProxy
        // .getOneBaseSectorControllerSector(
        //   this.sectorId,
        //   undefined,
        //   undefined,
        //   0,
        // ).subscribe((res: any) =>{
        //   this.sector = res.data;
        //   console.log('sector..',this.sector)
        // })

        //get emission reduction data by sector
        // this.serviceProxy
        // .getOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
        //   1,
        //   undefined,
        //   undefined,
        //   0
        // )
        this.emmissionProxy.getEmissionEeductionDraftDataForCountry()
        .subscribe((res: any)=>{
          this.emissionReduction = res;
      // console.log('eeeee',this.emissionReduction)
      this.unconditionalValue = this.emissionReduction.targetYearEmission - this.emissionReduction.unconditionaltco2;
      console.log('unconditional',this.unconditionalValue)
      this.conditionalValue = this.emissionReduction.targetYearEmission - this.emissionReduction.conditionaltco2;

      // console.log('baseyr...',this.emissionReduction.baseYear);
      // console.log('targetyr...',this.emissionReduction.targetYear);

      this.yrGap = parseInt(this.emissionReduction.targetYear) - parseInt(this.emissionReduction.baseYear)
      // console.log('gap..',this.yrGap)
      for(let a=0; a<=this.yrGap;a++){
        this.newYr = parseInt(this.emissionReduction.baseYear) + a;
        
        this.yrList.push(this.newYr);
        
      };
      let yearlstLength=this.yrList.length
      // console.log('firstyr list...',this.yrList[0])
      // for(let x=0;x<=this.yrList.length;x++){
        
      // }
      
     

      let filterBySector: string[] = new Array();

      filterBySector.push('sector.id||$eq||'+ this.sectorId)

      // this.serviceProxy
      // .getManyBaseProjectControllerProject(
      //   undefined,
      //   undefined,
      //   filterBySector,
      //   undefined,
      //   ['editedOn,DESC'],
      //   undefined,
      //   1000,
      //   0,
      //   0,
      //   0
      // ).subscribe((res: any)=>{

        this.climateactionserviceproxy.getProjectsForCountryAndSectorAdmins(0,0,0,[],0,0)
        .subscribe(async (res: any)=>{
        this.cliamteActionsBySector = res.items;
        // console.log("testqqqsdfffffsdfsfsd");
        
        // console.log('projects by sector',this.cliamteActionsBySector);
        for(let a=0;a<this.cliamteActionsBySector.length;a++){
          // console.log('proId....',this.cliamteActionsBySector[a]?.id)
          for(let b=0;b<this.cliamteActionsBySector[a]?.assessments.length;b++){
            this.assessmentListId.push(this.cliamteActionsBySector[a]?.assessments[b]?.id)

          }
        }
      //  console.log('assessment ListId...',this.assessmentListId)

          // if(this.assessmentListBySector[a]?.assessmentType == 'Ex-Post'){
    
        // console.log('yr list for final', this.yrList)

       

    for(let x=0; x<yearlstLength;x++){
            // console.log("work testay")
            let total = 0;
        let filter1: string[] = new Array();
        // console.log('this.yrList[x]',this.yrList[x]);
        // console.log('tasses',this.assessmentListId);

        let bauValue:number=((this.emissionReduction.targetYearEmission-this.emissionReduction.baseYearEmission)/yearlstLength )*x +this.emissionReduction.baseYearEmission;
        this.conValLst.push( !this.emissionReduction.conditionaltco2 && this.emissionReduction.conditionaltco2==0?0:((this.conditionalValue-this.emissionReduction.baseYearEmission)/yearlstLength)*x +this.emissionReduction.baseYearEmission);
        this.unconValLst.push(!this.emissionReduction.unconditionaltco2 && this.emissionReduction.unconditionaltco2==0?0:((this.unconditionalValue-this.emissionReduction.baseYearEmission)/yearlstLength)*x +this.emissionReduction.baseYearEmission);
        this. bauValLst.push(bauValue);

        filter1.push('assessmentYear.assessmentYear||$in||'+ this.yrList[x])  
        &
        filter1.push('assement.assessmentType||$eq||Ex-post') 
        & 
        filter1.push('assement.id||$in||'+ this.assessmentListId) 
        // console.log('filter1',filter1);

       let res= await this.serviceProxy
        .getManyBaseAssesmentResaultControllerAssessmentResault(
        undefined,
        undefined,
        filter1,
        undefined,
        ['assessmentYear.assessmentYear,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
        ).toPromise();
        this.assessmentList = res.data
        
        for(let assement of this.assessmentList){
         
          total += assement.totalEmission?Number(assement.totalEmission):0;
          console.log("total",total)

        }
        
          
          if(this.yrList[x]<=this.currentYear){this.actualValLst.push(bauValue-(total/1000000));}
        
        // .subscribe((res: any) =>{
        //   this.assessmentList = res.data
        //   console.log('aaaaaaaaaaa1111111',this.assessmentList);
        //   // console.log("work testay2")
        //   // console.log(res.data)

          
        //   for(let assement of this.assessmentList){
        //     // console.log("totalemition",assement.totalEmission)
        //     total += assement.totalEmission?Number(assement.totalEmission):0;
        //     // console.log(total)

        //   }
        //     // this.postYrList.push(total);
        //     if(this.yrList[x]<=this.currentYear){this.actualValLst.push(bauValue-(total/1000000));}
        //     this.actualValLst.push(total);
        // }); 
        
         

      //  noncon- 
      //  con- 
      //  bau- 

       



               
      };
      console.log('ac',this.actualValLst)
      // console.log('con',this.conValLst)
      // console.log('un',this.unconValLst)
      
      this.lineStylesData = {

        // labels: [this.emissionReduction.baseYear, this.emissionReduction.targetYear],
        labels: this.yrList,
  
        datasets: [
          {
            label: 'Actual',
            data: this.actualValLst,
            fill: false,
            borderColor: '#533440',
            tension: .4,
            
        }
        ,
          {
            label: 'Aggregated Actions-Conditional',
            // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue],
            data:this.conValLst,
            fill: true,
            borderColor: '#81B622',
            tension: .4,
            backgroundColor: '#81B622'
        },
          {
            label: 'Aggregated Actions-Unconditional',
            // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue],
            data:this.unconValLst,
            fill: true,
            tension: .4,
            borderColor: '#FFDB58',
            backgroundColor: '#FFDB58'
        },
            {
                label: 'BAU',
                // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission],
               data:this.bauValLst,
                fill: true,
                tension: .4,
                borderColor: '#FFA726',
                backgroundColor: '#FFA726'
            },
  
  
        ]
    };

      });

          
        })


      //Table 01...............

    // let filter: string[] = new Array();

    this.filter.push('mappedInstitution.id||$eq||'+ this.institutionId)


    console.log('filter',this.filter) 
    console.log("test1");
    console.log(this.institutionId);

    // this.serviceProxy
    // .getManyBaseProjectControllerProject(
    //   undefined,
    //   undefined,
    //   this.filter,
    //   undefined,
    //   ['editedOn,DESC'],
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0
    // )
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridDataCA(event);
    //Table 01...............END

    


    let filterPara: string[] = new Array();

    filterPara.push('institution.id||$eq||'+ this.institutionId)

  

    // this.serviceProxy
    // .getManyBaseParameterControllerParameter(
    //   undefined,
    //   undefined,
    //   filterPara,
    //   undefined,
    //   ['editedOn,DESC'],
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0
    // )
    this.paraProxy.getParameterForIaDash()
    .subscribe((res: any) => {
      this.parameterList = res;
     

      for(let a  of this.parameterList){
        
      
        
        if(a.parameterRequest.dataRequestStatus == 2){
          this.paramaterRequest++;
        }
        if(a.parameterRequest.dataRequestStatus == 4){
          this.parameterPending++;
        }
        if(a.parameterRequest.dataRequestStatus == 5){
          this.parameterReview++;
        }
      }
      
      console.log('request count',this.paramaterRequest);
      console.log('pending count',this.parameterPending);
      console.log('review count',this.parameterReview);


      this.basicData = {
        labels: ['Pending data requests', 'Pending data entry', 'Pending data review'],
        datasets: [
            {
                label: 'Data Requests',
                backgroundColor: '#42A5F5',
                data: [this.paramaterRequest, this.parameterPending, this.parameterReview]
            },
        ]
  }

        


        
      // }

    })

      })
    })

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);

 
    }


    loadCustomers(event: LazyLoadEvent) {
      console.log("HHHHHHHHHHHHHHHHHHHHHHHHHh")
      this.loading = true;

      console.log("filter====",this.filter)

      // this.serviceProxy
      // .getManyBaseProjectControllerProject(
      //   undefined,
      //   undefined,
      //   this.filter,
      //   undefined,
      //   ['editedOn,DESC'],
      //   undefined,
      //   undefined,
      //   event.rows,
      //   event.first,
      //   0
      // ).subscribe((res: any) => {
      //   console.log('tableclimate1------',res)
      //   this.climateactions = res.data;
      //   this.totalRecords = res.data.totalRecords;
      //   this.loading = false;


      //   console.log( this.institutionId)
  
      //   console.log('tableclimate2------',this.climateactions)
      // })
  
  
    }

    loadgridDataCA = (event: LazyLoadEvent) => {
      let pageNumber = event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    this.climateactionserviceproxy.getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
      pageNumber,
      this.rows,
      0,
      [],
      0,
      0,
      "1234"
      )
    .subscribe((res: any) => {
      console.log('table01..',res)
      this.climateactions = res.items;
      this.totalRecordsCA = res.meta.totalItems;
      this.loadingCA = false;
      
    })
    }

    loadgridData = (event: LazyLoadEvent) => {
      console.log('sector..aaaa',this.institution.sector?.id);
      console.log('event Date', event);
      this.loading = true;
      this.totalRecords = 0;
  
      let sectorId = this.sectorId;
      let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
      let subNdcId = this.searchBy.subndc ? this.searchBy.subndc.id : 0;
      let projectApprovalStatusId = ['','5'];
      console.log('fsectorId',sectorId)
      console.log('fndcId',ndcId)
      console.log('fsubNdcId',subNdcId)
      let pageNumber =
        event.first === 0 || event.first === undefined
          ? 1
          : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
      this.rows = event.rows === undefined ? 10 : event.rows;
      setTimeout(() => {
        this.climateactionserviceproxy
          .getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
            pageNumber,
            this.rows,
          
            // this.countryId,
            sectorId,
            projectApprovalStatusId,
            ndcId,
            subNdcId,
            "1234"   
          )
          .subscribe((a) => {
           // this.activeprojects = a.items;
  
           this.activeprojectsload=[];
          
            this.totalRecords = a.meta.totalItems;
            this.loading = false;
  
            this.projects = a.items;
            console.log(this.projects, 'kk');
        for(let project of a.items){
          console.log(project, 'kk');
          // if(project.projectStatus.id==1)  this.proposedProjectsCount+=1;
          // if(project.projectStatus.id==2)  this.underConstructionCount+=1;
          // if(project.projectStatus.id==3)  this.operationalProjectsCount+=1;
          let activeproject1:activeproject= {
            name : "",
            ertarget : 0,
            targetyear : '0',
            erarchievment : 0,
            archivmentyear : ""
          };
          activeproject1.name = project.climateActionName;
  
          let filter1: string[] = new Array();
          filter1.push('project.id||$eq||' + project.id);
        
  
          this.serviceProxy.getManyBaseAssesmentControllerAssessment(
            undefined,
            undefined,
            filter1,
            undefined,
            ['id,ASC'],
            undefined,
            1000,
            0,
            0,
            0
          ).subscribe((res=>{
          
            let sum=0;
            let targettotalemission = 0;
            let tarchievmenttotalem = 0;
            let minyear="2050";
            let maxyear="0";
            let targetyearrange = "-";
            let archiveyearrange = "-";
         
            if(res.data.length!=0){
              
              for(let dt of res.data){
                let filter2: string[] = new Array();
                filter2.push('assement.id||$eq||' + dt.id);
        
                for(let year of dt.assessmentYear){
                 // console.log("hhhhhhh",year.assessmentYear)
                  if(Number(year.assessmentYear)>Number(maxyear) ){
                        
                    maxyear = year.assessmentYear;
                  }
                  if(Number(year.assessmentYear)<Number(minyear) ){
                    minyear = year.assessmentYear;
                  }
                }
  
                if(dt.assessmentType=='Ex-Ante'){
                 
                  targetyearrange = minyear+"-"+maxyear
                }
                if(dt.assessmentType=='Ex-Post'){
                 
                  archiveyearrange = minyear+"-"+maxyear
                }
               
                activeproject1.targetyear = targetyearrange;
                activeproject1.archivmentyear = archiveyearrange;
                this.serviceProxy.getManyBaseAssesmentResaultControllerAssessmentResault(
                  undefined,
                  undefined,
                  filter2,
                  undefined,
                  ['id,ASC'],
                  undefined,
                  1000,
                  0,
                  0,
                  0
                ).subscribe((response=>{
                    for(let d of response.data){
                      sum=sum+ d.totalEmission; 
                      console.log('kkkkkkkkkkkkkkkkkkkkkkkkk',d)
                      
                    }
                  
                    if(dt.assessmentType=='Ex-Ante'){
                      targettotalemission = sum;
                      targetyearrange = minyear+"-"+maxyear
                    }
                    if(dt.assessmentType=='Ex-post'){
                      tarchievmenttotalem = sum;
                      archiveyearrange = minyear+"-"+maxyear
                    }
                    activeproject1.erarchievment = tarchievmenttotalem;
                    activeproject1.ertarget = targettotalemission;
                    activeproject1.targetyear = targetyearrange;
                    activeproject1.archivmentyear = archiveyearrange;
                }))
  
               // this.serviceproxy.getmanybaseasse
               
              }
            }
         
          }))
          
          this.activeprojectsload.push(activeproject1);
          console.log('ttttttttttttttttt',this.activeprojects)
        } 
      
        this.activeprojects = this.activeprojectsload;
      //   this.data = {
      //     labels: ['Proposed','Under construction','Operational'],
      //     datasets: [
      //         {
      //             data:[this.proposedProjectsCount,this.underConstructionCount,this.operationalProjectsCount],
      //             backgroundColor: [
      //                 "#FF6384",
      //                 "#36A2EB",
      //                 "#FFCE56"
      //             ],
      //             hoverBackgroundColor: [
      //                 "#FF6384",
      //                 "#36A2EB",
      //                 "#FFCE56"
      //             ]
      //         }
      //     ]
      // };
        console.log(this.operationalProjectsCount)
  
  
       
          });
          
      }, 1);
  
    }

    onSearch() {
      let event: any = {};
      event.rows = this.rows;
      event.first = 0;
  
      this.loadgridData(event);
    }
    onsectorChange(event:any){
      this.onSearch();
    }  
    onndcChange(event:any){
      this.subndcList = this.subNdcCopy
      this.subndcList = this.subndcList.filter((o)=>o.ndc.id == event.id);

      this.onSearch();
    } 
    onsubndcChange(event:any){
      this.onSearch();
    } 
  
  
    
    testoneeeaa(){
      // console.log('yr list..',this.yrList);
      // console.log('yr list..1111',this.yrList[0]);
      // console.log('total..',this.postYrList);
    }
    
}



export interface activeproject {
  name : string,
  ertarget : number,
  targetyear : string,
  erarchievment : number,
  archivmentyear : string
};


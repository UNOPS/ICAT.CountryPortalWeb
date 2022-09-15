import {HostListener, Component, OnInit, NgModule } from '@angular/core';
import { LazyLoadEvent ,PrimeNGConfig,Message,MessageService } from 'primeng/api';
import { from, Subscription } from 'rxjs';
import { AssesmentControllerServiceProxy, Assessment, AssessmentResault, AssessmentYear, AssessmentYearControllerServiceProxy, EmissionReductioDraftDataEntity, EmissionReductionDraftdataControllerServiceProxy, GetManyProjectResponseDto, Ndc, NdcControllerServiceProxy, Project, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy, ServiceProxy, SubNdc } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Chart } from 'chart.js';

declare module 'chart.js' {
  interface TooltipPositionerMap {
    myCustomPositioner: TooltipPositionerFunction<ChartType>;
  }
}

@Component({
  selector: 'app-ca-sa-dashboard',
  templateUrl: './ca-sa-dashboard.component.html',
  styleUrls: ['./ca-sa-dashboard.component.css'],
  
})

export class CASADashboardComponent implements OnInit {
  
  indtituteadmin: boolean = false;
  userType: string = "countryAdmin";
  countryAdmin : boolean = false;
  data: any;
  activeprojects1=["vv","df","d","d"];
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 5;
  last: number;
  event: any;
  subndcList: SubNdc[] = [];
  ndcList : Ndc[] = [];
  chartOptions: any;
  searchBy: any = {
    sector: 0,
    ndc: 0,
    subndc: 0,
  };

  searchBy1:any ={
    sector: 0,
  }
  sector: Sector;
  sectorList: Sector[] = [];
  subscription: Subscription;
  public i:number = 0;
  public id:string ='chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items:any =[];
  data1: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; }[]; };
  ind:number=1;
  countryId:number ;
  sectorId: number;
  projects: Project[];
  proposedProjectsCount: number = 0;
  underConstructionCount: number=0;
  operationalProjectsCount: number = 0;
  projectID: number=0;
  emissionReduction: EmissionReductioDraftDataEntity = new EmissionReductioDraftDataEntity();
  ndcprojectset = new Map<string, number>(); 
  horizontalOptions: any;
 
  showName:boolean=false;
  // basicData: { labels: string[]; datasets: { label: string; backgroundColor: string; data: number[]; } []; };
  basicData:any;
  
  basicOptions: any;
  project:number[]=[];
  projectemreduct: number[]=[];
  activps: Project[]=[];
  ndctotalemission:number[]=[];
  totalemission: number=0;
  em:number[]=[];
  ndcname: string[]=[];
  ndcnameForChart:string[]=[]
  ndcnameForChart2:number[]=[]
  totalem: number = 0;
  lineStylesData:any;
  total: number;
  num: number[]=[];
  emi:number[]=[];
  prnames: string[]=[];
  ndcprojectdetails: ndcdetails[]=[];
  datandc: ndcdetails;




  assessmetYr: AssessmentYear[] = new Array();
  assessmentListId: number[] = new Array();
  yrGap: number;
  newYr: number;
  yrList: number[] = new Array();
  yrListGraph: string[] = new Array();
  postYrList: number[] = new Array();
  postresaultList: number[] = new Array();
  postIdLisst: number[] = new Array();
  cliamteActionsBySector: Project[];
  assessmentList: AssessmentResault[];
  actualValLst:number[]=new Array();
  unconValLst:number[]=new Array();
  conValLst:number[]=new Array();
  bauValLst:number[]=new Array();
  currentYear:number=(new Date()).getFullYear();
 
  isNDCdata:boolean=false;

  responsiveOptions:any;
  
  screenWidth: number;
  constructor(private primengConfig: PrimeNGConfig,
    private emmissionProxy: EmissionReductionDraftdataControllerServiceProxy,
     private serviceproxy: ServiceProxy, 
     private assesmentserviceproxy: AssesmentControllerServiceProxy,
      private climateactionserviceproxy: ProjectControllerServiceProxy, 
      private ndcserviceproxy : NdcControllerServiceProxy,
      private asseyearproxy : AssessmentYearControllerServiceProxy,
      private sectorProxy: SectorControllerServiceProxy,
      private messageService: MessageService) {
    this.getScreenSize();
    this.chartOptions= {
      responsive: true,
      
     
    
 }
 this.data={
  labels: [
    "Data not available"
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [360],
    backgroundColor: [
      
      'rgb(54, 162, 235)',
      
    ],
    hoverOffset: 4
  }]
};

let s=new String("23")




    this.horizontalOptions = {
      // indexAxis: 'x',
      plugins: {

        tooltip:{ 
               


          callbacks: {
            label: function(context:{ chart:{_metasets:any;}; dataset: { label: string; }; parsed: { y: number | bigint | null; };dataIndex:number;raw:number; }) {
              console.log(context)
              // console.log(context.chart._metasets[3]._dataset.data)
              //   let baulst=context.chart._metasets[3]._dataset.data;
              //   let label = context.dataset.label || '';
                
               
                return ['Aggregated Actions : '+ context.dataset.label[context.dataIndex],
                        'Total emission :  ' + context.raw
                       ];
            }
        }
        },
        title: {
          display: true,
          text: 'Aggregated Actions Achievements',
          
          font:{
            size:24
          }
      },
          legend: {
              display:false,
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
              text:'Aggregated Actions',
              font:{
                size:12
              }},
              ticks: {
                  // display:false,
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
              text:'Emissions reduction (tCO' + '\u2082' +'e)',
              font:{
                size:12
              }},
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };

  this.responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
];

   }
  ndcids = new Set<number>();
  ndcem = new Map();
  data3:number[]=[];
  
  unconditionalValue: number;
  conditionalValue: number;

  activeprojects:activeproject[]=[];
  activeprojectson:activeproject[]=[];
  activeprojectsload:activeproject[]=[];
  ndcemMap = new Map();
  t: any = {};



 

  isCountryAdmin:boolean=false;


  userName:String;
  
 macGrapsForPosts:string[][]=[];
 macGrapsForAntes:string[][]=[];
  ngOnInit(): void {

    this.asseyearproxy.getAssessmentYearsForCountryAndSectorAdmins(1,10000,0,0)
    .subscribe(req=>{
     this.macGrapsForPosts=req;
      console.log("asseyear",req)
      this.macGrapsForPosts.forEach((element, index) => {
        this.macGrapsForPosts[index] = [element[0],'data:image/jpg;base64,'+element[1]]
      });

    //   this.asseyearproxy.getAssessmentYearsForCountryAndSectorAdmins(1,10000,0,1)
    // .subscribe(req=>{
    //  this.macGrapsForAntes=req;
    //   console.log("asseyear",req)
    //   this.macGrapsForAntes.forEach((element, index) => {
    //     this.macGrapsForAntes[index] = [element[0],'data:image/jpg;base64,'+element[1]]
    //   });

    // });

    });
    
    this.asseyearproxy.getAssessmentYearsForCountryAndSectorAdmins(0,0,0,1)
    .subscribe(req=>{
     this.macGrapsForAntes=req;
      console.log("asseyear",req)
      this.macGrapsForAntes.forEach((element, index) => {
        this.macGrapsForAntes[index] = [element[0],'data:image/jpg;base64,'+element[1]]
      });

    });
    
    this.primengConfig.ripple = true;
    const token = localStorage.getItem('access_token')!;
    const currenyUser=decode<any>(token);
    this.userName = currenyUser.fname;
    this.countryId = currenyUser.countryId;
    
    // this.userId = params['id'];
    // console.log( "this.userId");
    console.log("token",decode<any>(token))

    if(currenyUser.sectorId){
      this.serviceproxy.getOneBaseSectorControllerSector(currenyUser.sectorId,undefined,undefined,undefined)
      .subscribe(res=>{

       this.sector=res;
       console.log("ses",res);

      });
     
    
    }else{
      this.isCountryAdmin=true;
      this.sectorProxy.getCountrySector(currenyUser.countryId).subscribe((res: any) => {
        for(let d of res){
          this.sectorList.push(d)
        }
        console.log("++++" ,this.sectorList)
      });
      
      // this.serviceproxy.getManyBaseSectorControllerSector(
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
      //   ).subscribe((res=>{
      //     for(let d of res.data){
      //       this.sectorList.push(d)
      //     }
      //   }))
      //   console.log("++++" ,this.sectorList)

    }
    let event: any = {};
  event.rows = this.rows;
  event.first = 0;
  this.loadgridData2(event)


    this.onSearch1();
     //this.loadgridData1();
 


   
    // this.serviceproxy
    // .getOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
    //   1,
    //   undefined,
    //   undefined,
    //   undefined
    // )
    
    this.emmissionProxy.getEmissionEeductionDraftDataForCountry()
    .subscribe((res: any)=>{
      this.emissionReduction = res;
      // console.log('eeeee',this.emissionReduction)
      this.configEmissionTargetGraph();
      this.unconditionalValue = this.emissionReduction.targetYearEmission - this.emissionReduction.unconditionaltco2;
      // console.log('unconditional',this.unconditionalValue)
      this.conditionalValue = this.emissionReduction.targetYearEmission - this.emissionReduction.conditionaltco2;

      // console.log('baseyr...',this.emissionReduction.baseYear);
      // console.log('targetyr...',this.emissionReduction.targetYear);

      this.yrGap = parseInt(this.emissionReduction.targetYear) - parseInt(this.emissionReduction.baseYear)
      // console.log('gap..',this.yrGap)
      for(let a=0; a<=this.yrGap;a++){
        this.newYr = parseInt(this.emissionReduction.baseYear) + a;
        
        this.yrList.push(this.newYr);
        
      };
      let yearlstLength=this.yrList.length -1;
      
      // for(let x=0;x<=this.yrList.length;x++){
        
      // }
      
     

      // let filterBySector: string[] = new Array();

      // filterBySector.push('sector.id||$eq||'+ this.sectorId)
      // if(this.countryId != 0){

      //   filterBySector.push('country.id||$eq||'+ this.countryId)
      // }
      
      // this.serviceproxy
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
      // )
      
      this.climateactionserviceproxy.getProjectsForCountryAndSectorAdmins(0,0,0,[],0,0)
      .subscribe(async (res: any)=>{
        // console.log('projects by sector',res);
        this.cliamteActionsBySector = res.items;
        // console.log("testqqqsdfffffsdfsfsd");
        
        // console.log('projects by sector',this.cliamteActionsBySector);
        for(let a=0;a<this.cliamteActionsBySector.length;a++){
       
          for(let b=0;b<this.cliamteActionsBySector[a].assessments.length;b++){
            
            this.assessmentListId.push(this.cliamteActionsBySector[a].assessments[b]?.id)

          }
        }
      //  console.log('assessment ListId...',this.assessmentListId)

          // if(this.assessmentListBySector[a]?.assessmentType == 'Ex-Post'){
    
        // console.log('yr list for final', this.yrList)

    
    
    for(let x=0; x<=yearlstLength;x++){
     
            let total = 0;

            let bauValue:number=((this.emissionReduction.targetYearEmission-this.emissionReduction.baseYearEmission)/yearlstLength )*x +this.emissionReduction.baseYearEmission;
            this.conValLst.push( !this.emissionReduction.conditionaltco2 && this.emissionReduction.conditionaltco2==0?0:((this.conditionalValue-this.emissionReduction.baseYearEmission)/yearlstLength)*x +this.emissionReduction.baseYearEmission);
            this.unconValLst.push(!this.emissionReduction.unconditionaltco2 && this.emissionReduction.unconditionaltco2==0?0:((this.unconditionalValue-this.emissionReduction.baseYearEmission)/yearlstLength)*x +this.emissionReduction.baseYearEmission);
            this. bauValLst.push(bauValue);



        let filter1: string[] = new Array();
        // console.log('this.yrList[x]',this.yrList[x]);
        // console.log('tasses',this.assessmentListId);
        // filter1.push('assessmentYear.assessmentYear||$in||'+ this.yrList[x])  
        filter1.push('assessmentYear.assessmentYear||$eq||'+ this.yrList[x])  

        &
        filter1.push('assement.assessmentType||$eq||Ex-post') 
        & 
        filter1.push('assement.id||$in||'+ this.assessmentListId) 
        // filter1.push('assement.isProposal||$eq||' + 0);

        // console.log('filter1',filter1);

      let res= await this.serviceproxy
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
          // console.log("totalemi",assement.assessmentYear.assessmentYear,assement.totalEmission?Number(assement.totalEmission):0)
          // console.log("total",total)

        }
        
          
          if(this.yrList[x]<=this.currentYear){this.actualValLst.push(bauValue-(total/1000000));}
          // console.log("check",check)
        // .subscribe((res: any) =>{
        //   this.assessmentList = res.data
        //   // console.log('aaaaaaaaaaa1111111',this.assessmentList);
        //   // console.log("work testay2")
        //   // console.log(res.data)

          
        //   for(let assement of this.assessmentList){
        //     // console.log("totalemition",assement.assement.isProposal)
        //     total += assement.totalEmission?assement.totalEmission:0;
        //     console.log(total)

        //   }
        //     // this.postYrList.push(total);
            
        //     if(this.yrList[x]<=this.currentYear){this.actualValLst.push(bauValue-(total/1000000));}
            
        // },(errr)=>{
        //      console.log("error",errr)
        //   if(this.yrList[x]<=this.currentYear){this.actualValLst.push(0);}


        // }
        // ); 
        
         
    
 


       



               
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
            tooltip:{
              callbacks:'yes'
            }
            
        }
        ,
          {
            label: 'Aggregated Actions-Conditional',
            // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue],
            data:this.conValLst,
            fill: true,
            borderColor: '#81B622',
            tension: .4,
            backgroundColor: '#81B622',
            tooltip:{
              callbacks:'yes'
            }
            
        },
          {
            label: 'Aggregated Actions-Unconditional',
            // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue],
            data:this.unconValLst,
            fill: true,
            tension: .4,
            borderColor: '#FFDB58',
            backgroundColor: '#FFDB58',
            tooltip:{
              callbacks:'yes'
            }
        },
            {
                label: 'BAU',
                // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission],
               data:this.bauValLst,
                fill: true,
                tension: .4,
                borderColor: '#FFA726',
                backgroundColor: '#FFA726',
                tooltip:{
                  callbacks:'yes'
                }
            },
  
  
        ]
    };

      });
     
  

  //   this.horizontalOptions = {
  //     indexAxis: 'x',
  //     plugins: {
        
  //         legend: {
  //             labels: {
  //                 color: '#495057'
  //             }
  //         }
  //     },
  //     scales: {
  //         x: {
  //           display:true,
  //           title:{
  //             display:true,
  //             text:'NDCs',
  //             font:{
  //               size:12
  //             }},
  //             ticks: {
  //                 color: '#495057'
  //             },
  //             grid: {
  //                 color: '#ebedef'
  //             }
  //         },
  //         y: {
  //           display:true,
  //           title:{
  //             display:true,
  //             text:'Emmision(tCO2e)',
  //             font:{
  //               size:12
  //             }},
  //             ticks: {
  //                 color: '#495057'
  //             },
  //             grid: {
  //                 color: '#ebedef'
  //             }
  //         }
  //     }
  // };
  // console.log('iddd',this.ndcids)




    // let filter: string[] = new Array();
    // filter.push('country.id||$eq||' + this.countryId)
    // filter.push('projectApprovalStatus.id||$in||'+[1,5])
   
    // filter.push('sector.id||$eq||'+this.sectorId)
    // console.log(this.countryId)
    // console.log(this.sectorId)
    //filter.push('sector.id||$eq||' + this.sectorId);
  // this.serviceproxy.getManyBaseProjectControllerProject(
  //   undefined,
  //   undefined,
  //   filter,
  //   undefined,
  //   ['id,ASC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  // )
  this.climateactionserviceproxy.getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(0,0,0,['1 ','5'],0,0,"1234")
  .subscribe((res=>{
   
      this.projects=res.items;
      // console.log("projects")
      console.log("projects123",this.projects)
      this.onSearch();
      for(let project of this.projects){
       
        
        if(project.projectStatus.id==1)  this.proposedProjectsCount+=1;
        if(project.projectStatus.id==2)  this.underConstructionCount+=1;
        if(project.projectStatus.id==3)  this.operationalProjectsCount+=1;

        // console.log(this.proposedProjectsCount,'rrrrrrrrrrrrrrrrrrrrr')/
      
        // let activeproject1:activeproject= {
        //   name : "",
        //   ertarget : 0,
        //   targetyear : '0',
        //   erarchievment : 0,
        //   archivmentyear : ""
        // };
        // activeproject1.name = project.climateActionName;

        // let filter1: string[] = new Array();
        // filter1.push('project.id||$eq||' + project.id);
      
        // this.ndcids.add(project.ndc.id);
        
      
        //this.activeprojects.push(activeproject1);
      }
     
   
     

        this.data = {
          
        labels: ['Planned','Adopted','Implemented'],
        datasets: [
            {
                data:[this.proposedProjectsCount,this.underConstructionCount,this.operationalProjectsCount],
                backgroundColor: [
                    "#89CFF0",
                    "#0096FF",
                    "#00008B"
                ],
                hoverBackgroundColor: [
                  "#89CFF0",
                  "#0096FF",
                  "#00008B"
                ]
            }
        ]
    };

 

    let intest = 0;
    // for(let ndcid of this.ndcids){
      



      
    //   this.serviceproxy.getOneBaseNdcControllerNdc(ndcid,undefined,undefined,undefined)
    //   .subscribe((response1=>{
    //     let filter1: string[] = new Array();
    //     filter1.push('ndc.id||$eq||' +ndcid);
    //     console.log('resp',response1)
    //     // this.datandc.name = response1.name;
    //     this.serviceproxy.getManyBaseProjectControllerProject(
    //       undefined,
    //       undefined,
    //       filter1,
    //       undefined,
    //       ['id,ASC'],
    //       undefined,
    //       1000,
    //       0,
    //       0,
    //       0
    //     ).subscribe((res=>{
         
    //       this.datandc.cacount = res.data.length;
    //       this.ndcprojectdetails.push(this.datandc);
    //       console.log('olol',response1.name)
    //     }))


    //     this.ndcname.push(response1.name);
    //     let filternew: string[] = new Array();
    //     filternew.push('ndc.id||$eq||' + response1.id);
    //     let b:any = {};
    //     let totalem =0;
    //     let x =0;
    //     this.serviceproxy.getManyBaseAssesmentControllerAssessment(
    //       undefined,
    //       undefined,
    //       filternew,
    //       undefined,
    //       ['id,ASC'],
    //       undefined,
    //       1000,
    //       0,
    //       0,
    //       0
    //     ).subscribe((res=>{
         
    //       let ind = 0;
    //       for(let as of res.data){
            
    //         let filternew2: string[] = new Array();
    //         filternew2.push('assement.id||$eq||' + as.id);
    //         this.serviceproxy.getManyBaseAssesmentResaultControllerAssessmentResault(
    //           undefined,
    //           undefined,
    //           filternew2,
    //           undefined,
    //           ['id,ASC'],
    //           undefined,
    //           1000,
    //           0,
    //           0,
    //           0
    //         ).subscribe((resp=>{
              
    //             for(let d of resp.data){
    //               totalem=totalem + d.totalEmission;
    //               this.total = totalem;
    //             }
               
              
    //             this.t[response1.name] = totalem;
    //             this.ndcem.set(response1.name,totalem);
    //             this.num.push(totalem);
         
    //         //  // this.t = this.ndcem
    //       if(ind==resp.data.length){
    //         console.log('uhuh',  this.t.keys)
    //         this.num = [];
    //         for(let n of this.ndcname){
             
    //           this.num.push(this.t[n]);
    //         }
    //         console.log('oioio',this.num)
    //           this.basicData = {
    
    //             labels: this.ndcname,
    //             datasets: [
    //                 {
    //                     label: 'total emission for each ndc',
    //                     backgroundColor: '#42A5F5',
    //                     data: this.num
    //                 },
                    
    //             ]
    //         };
            
           
    //       }
               
    //          }))
        
    //        ++ind;
    //       }
          
        
    //       ++x;
    //     }))
    //         // console.log('ind',ind)
    //   }))


     

    // }
 
    
  
  })); 
    // for(let data of this.t){
      
    // }

    // this.serviceproxy.getManyBaseSectorControllerSector(
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
    //   ).subscribe((res=>{
    //     for(let d of res.data){
    //       this.sectorList.push(d)
    //     }
    //   }))

      // this.serviceproxy.getManyBaseNdcControllerNdc(
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
      // this.ndcserviceproxy.ndcSectorDetailsDashboard(0,0,0)
      //   .subscribe((res=>{
          
      //     for(let d of res.items){
      //       this.ndcList.push(d)
      //       for(let s of d.subNdc){

      //         // console.log("ssssss",s.name.length>30)
      //         if(s.name.length>20){
      //           s.name = s.name.substring(0,32)+"..........."
      //         }

      //         this.subndcList.push(s)
      //       }
      //     }
      //     console.log("NdcList---1",this.ndcList)
      //   }))
this.getNDC(0);
        // this.serviceproxy.getManyBaseSubNdcControllerSubNdc(
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
        //   ).subscribe((res=>{

        //     console.log("subNdcList---",res)

        //     for(let d of res.data){

        //       console.log("ssssss",d.name.length>30)
        //       if(d.name.length>20){
        //         d.name = d.name.substring(0,32)+"..........."
        //       }

        //       this.subndcList.push(d)
        //     }
        //   }))



  //       let i =0;
  //         for(let y of this.projectemreduct){
  //           console.log('rtrtrtrtrrtrt',this.projectemreduct[i]);
  //           this.data3.push(this.projectemreduct[i]);
  //           i++;
            
  //         }
  //   this.data1 = {
    
  //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //     datasets: [
  //         {
  //             label: 'First Dataset',
  //             data: this.data3,
  //             fill: false,
  //             borderColor: '#4bc0c0'
  //         },
         
  //     ]
  // }



//     this.chartOptions= {
//       responsive: true,
//       cutout:250,
     
    
//  }

    if(this.userType=="countryAdmin"){
      this.countryAdmin=true;
    }


    

//  // this.config = this.configService.config;
//   this.updateChartOptions();
//   // this.subscription = this.configService.configUpdate$.subscribe(config => {
//   //     this.config = config;
//   //     this.updateChartOptions();
//   // });
// }

// updateChartOptions() {
//   this.chartOptions = this.config && this.config.dark ? this.getDarkTheme() : this.getLightTheme();
// }

// getLightTheme() {
//   return {
//       plugins: {
//           legend: {
//               labels: {
//                   color: '#495057'
//               }
//           }
//       }
//   }
// }

// getDarkTheme() {
//   return {
//       plugins: {
//           legend: {
//               labels: {
//                   color: '#ebedef'
//               }
//           }
//       }
//   }
// }
  })
 

}
  // show(){

  //   console.log("asdaasd");
  // }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?: undefined) {
          
          this.screenWidth = window.innerWidth;
          // console.log( this.screenWidth);
    }



 getNDC=(sectorID:number)=>{

  this.ndcserviceproxy.ndcSectorDetailsDashboard(0,0,sectorID)
  .subscribe((res=>{
    
    for(let d of res.items){
      this.ndcList.push(d)
      for(let s of d.subNdc){

        // console.log("ssssss",s.name.length>30)
        if(s.name.length>20){
          s.name = s.name.substring(0,32)+"..........."
        }

        this.subndcList.push(s)
      }
    }
    console.log("NdcList---1",this.ndcList)
    console.log("NdcList---1",this.subndcList)
  }))




 }

configEmissionTargetGraph=()=>{
  this.basicOptions = {
      
    plugins: {
      tooltip: {
             


        callbacks: {
          label: function(context: { chart:{_metasets:any;}; dataset: { label: string; }; parsed: { y: number | bigint | null; };dataIndex:number;raw:number; }) {
            console.log(context)
            // console.log(context.chart._metasets[3]._dataset.data)
              let baulst=context.chart._metasets[3]._dataset.data;
              let label = context.dataset.label || '';


              if (label) {
                label += ' Emission : ';
            }
            if (context.parsed.y !== null) {
                label += Number(context.parsed.y).toFixed(2) +" MtCO₂e";
            }

              if(context.dataset.label=='Actual'){
                // console.log("Actual")
           let emissionReduction=  "Emission Reduction : " +  (baulst[ context.dataIndex]- Number(context.parsed.y)).toFixed(2) + " MtCO₂e" +" (" + (((baulst[ context.dataIndex]- Number(context.parsed.y))/baulst[ context.dataIndex])*100).toFixed(2) +"% of BAU Emission)";
                return [label,emissionReduction];
              }
              if(context.dataset.label=='BAU'){
                // console.log("BAU")
                return [label];
              }
              


              let prsntge= 'Emission reduction of '+context.dataset.label+ ' over BAU - '+((context.raw/baulst[ context.dataIndex])*100).toFixed(2) +'%'
              
              return [label,prsntge];
          }
      }
      },
      
     
      title: {
        
        display: true,
        text: `Emission Reduction Targets of ${this.emissionReduction.sector? this.emissionReduction.sector.name + " sector" :this.emissionReduction.country.name}`,
        
        font:{
          size:24
        }
    },
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
            text:'Emissions (MtCO₂e)',
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



  loadgridData = (event: LazyLoadEvent) => {
    // console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;
    // console.log('ffsectorId', this.searchBy.sector.id)
    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    let subNdcId = this.searchBy.subndc ? this.searchBy.subndc.id : 0;
    let projectApprovalStatusId = ['','5'];
    // console.log('ffsectorId',sectorId)
    // console.log('fndcId',ndcId)
    // console.log('fsubNdcId',subNdcId)
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 5: event.rows;
    // console.log("this.projects2222",this.rows);

    setTimeout(() => {
      // this.climateactionserviceproxy
      //   .getactiveClimateActionDetails(
      //     pageNumber,
      //     this.rows,
      //     // this.countryId,
      //     sectorId,
      //     ndcId,
      //     subNdcId,
      //     projectApprovalStatusId

          
      //   )
      this.climateactionserviceproxy.getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
        pageNumber,
        this.rows,
        sectorId,
        projectApprovalStatusId,
        ndcId,
        subNdcId,
        "1234")

        .subscribe((a) => {
         // this.activeprojects = a.items;

         this.activeprojectsload=[];
        
          this.totalRecords = a.meta.totalItems;
          this.loading = false;

          // this.projects = a.items;
          console.log("this.projects2222",a);
      for(let project of a.items){
        // console.log(project, 'kk');
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
        // filter1.push('Assessment.isProposal||$eq||' + 0);
      

        this.serviceproxy.getManyBaseAssesmentControllerAssessment(
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
          // console.log("dddddd",res)
          let sum=0;
          let targettotalemission = 0;
          let tarchievmenttotalem = 0;
          let minyear="0";
          let maxyear="0";
          let targetyearrange = "-";
          let archiveyearrange = "-";
       
          if(res.data.length!=0){
            
            for(let dt of res.data){
              // console.log("hhhhhhh",dt.isProposal)
              // let filter2: string[] = new Array();
              // filter2.push('assement.id||$eq||' + dt.id);
      
              for(let year of dt.assessmentYear){
                // console.log("hhhhhhh",year.assessmentYear)
                if(Number(year.assessmentYear)>Number(maxyear) ){
                      
                  maxyear = year.assessmentYear;
                }
                if(Number(minyear)!=0 && Number(year.assessmentYear)<Number(minyear) ){
                  minyear = year.assessmentYear;
                }else if(Number(minyear)==0){
                  minyear = year.assessmentYear;
                }
              }

              // if(dt.assessmentType=='Ex-ante'){
               
              //   targetyearrange = minyear+"-"+maxyear
              // }
              // if(dt.assessmentType=='Ex-post'){
               
              //   archiveyearrange = minyear+"-"+maxyear
              // }
             
              // activeproject1.targetyear = targetyearrange;
              // activeproject1.archivmentyear = archiveyearrange;
              // this.serviceproxy.getManyBaseAssesmentResaultControllerAssessmentResault(
              //   undefined,
              //   undefined,
              //   filter2,
              //   undefined,
              //   ['id,ASC'],
              //   undefined,
              //   1000,
              //   0,
              //   0,
              //   0
              // ).subscribe((response=>{
              //     for(let d of response.data){
              //       sum=sum+ d.totalEmission; 
              //       // console.log('kkkkkkkkkkkkkkkkkkkkkkkkk',d)
                    
              //     }
                
              //     if(dt.assessmentType=='Ex-ante'){
              //       targettotalemission = sum;
              //       targetyearrange = minyear+"-"+maxyear
              //     }
              //     if(dt.assessmentType=='Ex-post'){
              //       tarchievmenttotalem = sum;
              //       archiveyearrange = minyear+"-"+maxyear
              //     }
                 
              // }))
              for(let d of dt.assessmentResult){
                sum=sum + d.totalEmission?Number(d.totalEmission):0; 
                // console.log('kkkkkkkkkkkkkkkkkkkkkkkkk',sum)
                
              }
            
              if(dt.assessmentType=='Ex-ante'){
                targettotalemission = sum;
                targetyearrange = minyear+"-"+maxyear
              }
              if(dt.assessmentType=='Ex-post'){
                tarchievmenttotalem = sum;
                archiveyearrange = minyear+"-"+maxyear
              }

             // this.serviceproxy.getmanybaseasse
             
            }
            activeproject1.erarchievment = tarchievmenttotalem;
            activeproject1.ertarget = targettotalemission;
            activeproject1.targetyear = targetyearrange;
            activeproject1.archivmentyear = archiveyearrange;

          }
       
        }))
        
        this.activeprojectsload.push(activeproject1);
        
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
      // console.log(this.operationalProjectsCount)

   
      
        });
       
        // if(this.activeprojects.length!=0){
        //   for(let em of this.activeprojects){
        //     this.emi.push(em.erarchievment + em.ertarget);
        //     this.prnames.push(em.name);
        //     console.log('ttttttttttttttttt1',em)
        //     console.log('ttttttttttttttttt2',this.emi)
        //   }
        // }  
        
    }, 1);


  
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }
  onsectorChange(event:any){
    this.getNDC(this.searchBy.sector.id);
    this.onSearch();
  }  

  onsectorChange1(event:any){
    this.onSearch1();
  }  
  onndcChange(event:any){
    this.subndcList = [];
    this.subndcList= event.subNdc;
    this.onSearch();
  } 
  onsubndcChange(event:any){
    this.onSearch();
  } 
   
  onSearch1() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    // this.loadgridData1(event);
    this.loadgridData2(event);
  }
     
  testoneeeaa(){
    // console.log('yr list..',this.yrList);
    // console.log('yr list..1111',this.yrList[0]);
    // console.log('total..',this.postYrList);
  }



  // loadgridData1 = (event: LazyLoadEvent) => {
  //   console.log('event Date', event);
  //   this.loading = true;
  //   this.totalRecords = 0;

  //   let sectorId = this.searchBy1.sector ? this.searchBy.sector.id : 0;
  
  //   console.log('fsectorId',sectorId)
   
  //   let pageNumber =
  //     event.first === 0 || event.first === undefined
  //       ? 1
  //       : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
  //   this.rows = event.rows === undefined ? 10 : event.rows;
  //   // this.rows=1000
  //   setTimeout(() => {
  //     this.ndcserviceproxy
  //       .getDateRequest(
  //         0,
  //         0,
  //         this.isCountryAdmin?sectorId:0,
  //       )
  //       .subscribe((a) => {
            
  //    for(let ndc of a.items){
  //             console.log('aaaaaaa',ndc.id) 
  //     this.serviceproxy.getOneBaseNdcControllerNdc(ndc.id,undefined,undefined,undefined)
  //     .subscribe((response1=>{
  //       let filter1: string[] = new Array();
  //       filter1.push('ndc.id||$eq||' +ndc.id);
  //       console.log('resp',response1)
  //        //this.datandc.name = response1.name;
  //       this.serviceproxy.getManyBaseProjectControllerProject(
  //         undefined,
  //         undefined,
  //         filter1,
  //         undefined,
  //         ['id,ASC'],
  //         undefined,
  //         1000,
  //         0,
  //         0,
  //         0
  //       ).subscribe((res=>{
         
  //         //this.datandc.cacount = res.data.length;
  //         this.ndcprojectdetails.push(this.datandc);
  //         console.log('olol',response1.name)
  //       }))


  //       this.ndcname.push(response1.name);
  //       let filternew: string[] = new Array();
  //       filternew.push('ndc.id||$eq||' + response1.id);
  //       let b:any = {};
  //       let totalem =0;
  //       let x =0;
  //       this.serviceproxy.getManyBaseAssesmentControllerAssessment(
  //         undefined,
  //         undefined,
  //         filternew,
  //         undefined,
  //         ['id,ASC'],
  //         undefined,
  //         1000,
  //         0,
  //         0,
  //         0
  //       ).subscribe((res=>{
         
  //        console.log('assesment.....',res.data)
  //         let ind = 0;
  //         for(let as of res.data){
           
  //           let filternew2: string[] = new Array();
  //           filternew2.push('assement.id||$eq||' + as.id);
  //           this.serviceproxy.getManyBaseAssesmentResaultControllerAssessmentResault(
  //             undefined,
  //             undefined,
  //             filternew2,
  //             undefined,
  //             ['id,ASC'],
  //             undefined,
  //             1000,
  //             0,
  //             0,
  //             0
  //           ).subscribe((resp=>{
              
              
  //               for(let d of resp.data){
                  
  //                 totalem=totalem + d.totalEmission;
  //                 this.total = totalem;
  //               }
               
              
  //               this.t[response1.name] = totalem;
  //               this.ndcem.set(response1.name,totalem);
  //               this.num.push(totalem);
              
  //               // console.log(resp.data.length)
  //           //  // this.t = this.ndcem
  //         // if(ind==resp.data.length){
           
  //           // console.log('uhuh',  this.t.keys)
  //           this.num = [];
  //           this.ndcnameForChart=[];
  //           this.ndcnameForChart2=[]
  //           let count=0
  //           for(let n of this.ndcname){

  //            if(this.t[n] && this.t[n]>0){
            
  //             this.num.push(this.t[n]);

  //             this.ndcnameForChart.push(n)
  //              count=count+
  //             this.ndcnameForChart2.push(count)

  //            }

  //             // this.num.push(this.t[n]);

  //           }
  //           // for(let n of this.ndcname){
             
  //           //   this.num.push(this.t[n]);
  //           // }
  //           // console.log('oioio',this.num)
  //             this.basicData = {
    
  //               // labels: this.ndcnameForChart,
  //               labels: this.ndcnameForChart2,
  //               datasets: [
  //                   {
  //                       label: 'Total emissions reduction',
  //                       backgroundColor: '#42A5F5',
  //                       data: this.num
  //                   },
                    
  //               ]
  //           };
            
  //         //  console.log('num',this.num)

  //         // }
               
  //            }))
        
  //          ++ind;
  //         }
          
        
  //         ++x;
  //       }))
  //           // console.log('ind',ind)
  //     }))
  //           }


  //       });

  //   })}


    loadgridData2 = (event: LazyLoadEvent) => {
      // console.log('event Date', event);
      // this.loading = true;
      // this.totalRecords = 0;
      // console.log('getNdcForDashboard');
      let sectorId = this.searchBy1.sector ? this.searchBy1.sector.id : 0;
    
      // console.log('fsectorId',sectorId)
     
      // let pageNumber =
      //   event.first === 0 || event.first === undefined
      //     ? 1
      //     : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
      // this.rows = event.rows === undefined ? 10 : event.rows;
      // this.rows=1000
      setTimeout(() => {
        this.ndcserviceproxy
          .getNdcForDashboard(
            0,
            0,
            this.isCountryAdmin?sectorId:0,
          )
          .subscribe((a) => {
              let ndcNames:string[]=[]
              let ndcReduction:number[]=[]
              let xaxis:number[]=[];
            console.log('getNdcForDashboard',a);
            for(let ndc of a.items){
             
             let totalRduction:number=0;
             for(let assement of ndc.assesment){


               for(let assesrslt of assement.assessmentResult){
                // console.log('totalRduction123',assement.id,totalRduction)
                  totalRduction=totalRduction+assesrslt.totalEmission?Number(assesrslt.totalEmission):0;

               }



             }
            //  console.log('totalRduction',totalRduction)
             if(totalRduction!=0){
              
              ndcNames.push(ndc.name);
              ndcReduction.push(totalRduction);
              xaxis.push(ndcNames.length)
             }
             
             

            }
            this.isNDCdata=ndcNames.length>0?true:false;
            // console.log('getNdcForDashboardndcNames',ndcNames);
            // console.log('getNdcForDashboardndcReduction',ndcReduction);
            this.basicData = {
    
              // labels: this.ndcnameForChart,
              labels: xaxis,
              datasets: [
                  {
                      label: ndcNames,
                      backgroundColor: '#42A5F5',
                      data: ndcReduction
                  },
                  
              ]
          };
  
  
          });
  
      })}


}

export interface activeproject {
  name : string,
  ertarget : number,
  targetyear : string,
  erarchievment : number,
  archivmentyear : string
};

export interface ndcdetails {
  name : string,
  cacount : number,

};

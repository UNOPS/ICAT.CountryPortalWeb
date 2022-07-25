import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { reduce } from 'rxjs/operators';
import { AssesmentControllerServiceProxy, AssessmentYearControllerServiceProxy, Methodology, MethodologyControllerServiceProxy, ParameterRequestControllerServiceProxy, Project, ProjectControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-managedatastatus',
  templateUrl: './managedatastatus.component.html',
  styleUrls: ['./managedatastatus.component.css']
})
export class ManagedatastatusComponent implements OnInit {
  
  projectApprovalStatusId: number = 1; 
  methodologies:Methodology[];
  searchText: string;
  countryId:any=0;

  projects: Project[];

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null, 
  };

  first = 0;
  sectorId: number=1;


  constructor( private serviceProxy: ServiceProxy,
    private assesmentProxy:AssesmentControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private assYearProxy: AssessmentYearControllerServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    console.log("work");
  }
  @ViewChild("dt") table: Table;
  activeprojects:activeproject[]=[];
  activeprojectson:activeproject[]=[];
  activeprojectsload:activeproject[]=[];

  datarequests : datarequest[] = [];
  datarequests1 : datarequest ;
  asseYearId:any;
  alldatarequests : any ;

  
    ngOnInit() {
    
     

    this.serviceProxy
    .getManyBaseMethodologyControllerMethodology(
      undefined,
      undefined,
      undefined,
      undefined,
      ['version,ASC'],
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res: any) => {
      this.methodologies = res.data;
      // this.totalRecords = res.totalRecords;
      // console.log('this.methodologies............',this.methodologies)
      if(res.totalRecords !== null){
        this.last = res.count;
      }else{
        this.last =0;
      }
    })
  //  this.loadgridData();

  }


  
 

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  directToApprovePage(datarequests:any)
  {
    // getdetailsByAssessmentYearAndProjNameAndAsseType
    //  console.log("click",datarequests);
    //  let assementYear = datarequests.year;
    //  let assessmentType = datarequests.type;
    //  let climateActionName = datarequests.name;
     let assenmentYearId=datarequests.assenmentYearId
    //  this.assYearProxy
    //     .getdetailsByAssessmentYearAndProjNameAndAsseType(assessmentType,assementYear,climateActionName)
    //     .subscribe((a) => {
    //       // console.log(".....",a);
    //       this.asseYearId = a.id;
    //       // console.log('final result..',this.asseYearId)
    //       this.router.navigate(['/app-approve-data'], {
    //         queryParams: { id: this.asseYearId},
    //       });
    //     });
        this.router.navigate(['/app-approve-data'], {
          queryParams: { id:assenmentYearId},
        });

    //  console.log("clickdfg..",climateActionName);

    
  }
  // paginationselect=(event: LazyLoadEvent)=>{
  //   this.rows = event.rows?event.rows:this.rows;
  //    let first =event.first? +event.first:0;
  //   let end= first + +this.rows;
   
  //   console.log(event);
  //   console.log(this.rows);
   
  //   console.log(first);
  //   console.log(end);
  //   console.log(this.datarequests);
  //   console.log(this.datarequests.slice(event.first?event.first:0,end))
  //   this.alldatarequests=this.datarequests.length!=0?this.datarequests.slice(event.first?event.first:0,end):undefined;
  // }
  






   loadgridData (event: LazyLoadEvent) {
  

    this.loading = true;

    let filterText = this.searchBy.text ? this.searchBy.text : '';
    let projectStatusId = 0;

    let sectorId = this.sectorId;
    let statusId = 0;
    let mitigationActionTypeId = 0;
    //let projectApprovalStatusId = 1;
    // /console.log('fsectorId',sectorId)
    // console.log('fndcId',ndcId)
    // console.log('fsubNdcId',subNdcId)
   
    // sectorId=1;
    this.projectApprovalStatusId=5;
    this.countryId=0;

    let assessmentStatusName = '';
    let Active = 4;
    let editedOn = 0;
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        :( event.first / (event.rows === undefined ? 10 : event.rows) )+ 1;
    this.rows = event.rows === undefined ? 10: event.rows;

console.log("pageNumber",pageNumber)
console.log('this.rows',this.rows)
console.log('totalRecords',this.totalRecords)
  this.assYearProxy.assessmentYearForManageDataStatus(
    pageNumber,
    this.rows,
    filterText,
        projectStatusId,
        this.projectApprovalStatusId,
       // this.countryId,
       // sectorId,
        0
  ).subscribe(res=>{

console.log('assessmentYearForManageDataStatus',res)
this.loading = false;
// console.log('asses',res)

this.totalRecords=res.meta.totalItems;
this.datarequests=[];
for(let assementYear of res.items){
  let datarequests1:datarequest= {
    name : "",
    type : '',
    year : "",
    assenmentYearId:0,
    totalreqCount : 0,
    pendingreqCount : 0,
    pendingdataentries : 0,
    recieved : 0
  };


  // console.log( assesment.project.climateActionName)
  datarequests1.name = assementYear.assesment.project.climateActionName;
  datarequests1.year=assementYear.assessmentYear?assementYear.assessmentYear:"";
  datarequests1.type=assementYear.assesment.assessmentType;
  datarequests1.assenmentYearId=assementYear.id;

  // console.log("assesIs",assesment.id)
  this.parameterProxy
  .getDateRequestToManageDataStatus(assementYear.assesment.id,assementYear.assessmentYear)
  .subscribe(res=>{
    datarequests1.totalreqCount = res.length;

    console.log("dr_dataRequestStatus",res)

//  dr_dataRequestStatus
 for(let dr of res){
 
  if(dr.dr_dataRequestStatus==-1 || dr.dr_dataRequestStatus==1 || dr.dr_dataRequestStatus==2) {
    ++datarequests1.pendingreqCount;
  }
 
  if(dr.dr_dataRequestStatus==3 || dr.dr_dataRequestStatus==-9 || dr.dr_dataRequestStatus==4
    || dr.dr_dataRequestStatus==5|| dr.dr_dataRequestStatus==6|| dr.dr_dataRequestStatus==-6|| dr.dr_dataRequestStatus==-8){
    ++datarequests1.pendingdataentries;
  }
  
  if(dr.dr_dataRequestStatus==9|| dr.dr_dataRequestStatus==8|| dr.dr_dataRequestStatus==9|| dr.dr_dataRequestStatus==11){
    ++datarequests1.recieved;
  }


 }
 
  })
  
  this.datarequests.push(datarequests1); 


}



  })

    // this.datarequests=[];
    // this.assesmentProxy.assessmentForManageDataStatus(
    //   pageNumber,
    //   this.rows,
    //   filterText,
    //       projectStatusId,
    //       this.projectApprovalStatusId,
    //       this.countryId,
    //       sectorId,
    //       0
    //   ).subscribe(res=>{


        
    //     this.loading = false;
    //     console.log('asses',res)
        
    //     this.totalRecords=res.meta.totalItems;
      
    //     for(let assesment of res.items){

       
    //       for(let assementYear of assesment.assesmentYear){
    //         let datarequests1:datarequest= {
    //           name : "",
    //           type : '',
    //           year : "",
    //           assenmentYearId:0,
    //           totalreqCount : 0,
    //           pendingreqCount : 0,
    //           pendingdataentries : 0,
    //           recieved : 0
    //         };
  
  
    //         // console.log( assesment.project.climateActionName)
    //         datarequests1.name = assesment.project.climateActionName;
    //         datarequests1.year=assementYear.assessmentYear?assementYear.assessmentYear:"";
    //         datarequests1.type=assesment.assessmentType;
    //         datarequests1.assenmentYearId=assementYear.id;

    //         // console.log("assesIs",assesment.id)
    //         this.parameterProxy
    //         .getDateRequestToManageDataStatus(assesment.id,assementYear.assessmentYear)
    //         .subscribe(res=>{
    //           datarequests1.totalreqCount = res.length;
          
    //           console.log("dr_dataRequestStatus",res)
        
    //       //  dr_dataRequestStatus
    //        for(let dr of res){
           
    //         if(dr.dr_dataRequestStatus==-1 || dr.dr_dataRequestStatus==1 || dr.dr_dataRequestStatus==2) {
    //           ++datarequests1.pendingreqCount;
    //         }
           
    //         if(dr.dr_dataRequestStatus==3 || dr.dr_dataRequestStatus==-9 || dr.dr_dataRequestStatus==4
    //           || dr.dr_dataRequestStatus==5|| dr.dr_dataRequestStatus==6|| dr.dr_dataRequestStatus==-6|| dr.dr_dataRequestStatus==-8){
    //           ++datarequests1.pendingdataentries;
    //         }
            
    //         if(dr.dr_dataRequestStatus==9|| dr.dr_dataRequestStatus==8|| dr.dr_dataRequestStatus==9|| dr.dr_dataRequestStatus==11){
    //           ++datarequests1.recieved;
    //         }
  
  
    //        }
           
    //         })
            
    //         this.datarequests.push(datarequests1); 


    //       }


        
        
    //      }


 


    //   })





    // setTimeout(() => {
    //   this.climateactionserviceproxy
    //     .getAllProjectDetailsmanagedatastatus(
    //        1,
    //       100000,
    //       filterText,
    //       projectStatusId,
    //       this.projectApprovalStatusId,
    //       assessmentStatusName,
    //       Active,
    //       this.countryId,
    //       sectorId

          
    //     )
    //     .subscribe((a) => {
    //      // this.activeprojects = a.items;
    //      console.log(a)
    //      this.datarequests=[];
    //     //  console.log( 'TEST')
    //     //  console.log( this.datarequests)
    //       // this.totalRecords = a.meta.totalItems;
    //       this.loading = false;

    //       this.projects = a.items;
    //       // console.log('this.projects', 'kk');
    //       // console.log('kooo', this.projects);
    //   for(let project of a.items){
    //     // console.log(project, 'kk');
    //     // if(project.projectStatus.id==1)  this.proposedProjectsCount+=1;
    //     // if(project.projectStatus.id==2)  this.underConstructionCount+=1;
    //     // if(project.projectStatus.id==3)  this.operationalProjectsCount+=1;
        
        
    //     let filter1: string[] = new Array();
    //     filter1.push('project.id||$eq||' + project.id);
    //     filter1.push('isProposal||$eq||' + false);

    //     this.serviceProxy.getManyBaseAssesmentControllerAssessment(
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

    //       let datarequests1:datarequest= {
    //         name : "",
    //         type : '',
    //         year : "",
    //         totalreqCount : 0,
    //         pendingreqCount : 0,
    //         pendingdataentries : 0,
    //         recieved : 0
    //       };
  
         
  
    //       datarequests1.name = project.climateActionName;
    //       console.log('asses',res.data);
    //       // console.log(this.datarequests);
    //       this.totalRecords=res.data.length+this.totalRecords;
    //       if(res.data.length!=0){
            
    //         for(let dt of res.data){
    //           console.log(dt);
    //           datarequests1.year =dt.assessmentYear[0]?dt.assessmentYear[0].assessmentYear:'';
    //           datarequests1.pendingdataentries=0;
    //          datarequests1.pendingreqCount = 0;
    //          datarequests1.recieved =0;
    //          datarequests1.totalreqCount =0;
    //         //  datarequests1.year = 0;
    //          let totaldrcount = 0;
    //          let pendingreqcount = 0;
    //          let pendingdecount = 0;
    //          let reccount = 0;
    //           let filter2: string[] = new Array();
    //           filter2.push('assessment.id||$eq||' + dt.id);
    //           datarequests1.type = dt.assessmentType;
    //           // for(let year of dt.assessmentYear){
    //           //   console.log("hhhhhhh",year.assessmentYear)
    //           //   if(Number(year.assessmentYear)>Number(maxyear) ){
                      
    //           //     maxyear = year.assessmentYear;
    //           //   }
    //           //   if(Number(year.assessmentYear)<Number(minyear) ){
    //           //     minyear = year.assessmentYear;
    //           //   }
    //           // }

    //           // if(dt.assessmentType=='Ex-Ante'){
               
    //           //   targetyearrange = minyear+"-"+maxyear
    //           // }
    //           // if(dt.assessmentType=='Ex-post'){
               
    //           //   archiveyearrange = minyear+"-"+maxyear
    //           // }
             
    //           // activeproject1.targetyear = targetyearrange;
    //           // activeproject1.archivmentyear = archiveyearrange;
    //           this.serviceProxy.getManyBaseParameterControllerParameter(
    //             undefined,
    //             undefined,
    //             filter2,
    //             undefined,
    //             ['id,ASC'],
    //             undefined,
    //             1000,
    //             0,
    //             0,
    //             0
    //           ).subscribe((response=>{
    //             // console.log('hhhh',response.data)
    //             totaldrcount = response.data.length;
    //               for(let d of response.data){
    //                 // console.log('1111',d)
    //                 let filter3: string[] = new Array();
    //                 // datarequests1.year = d.assessmentYear;
    //                 filter3.push('parameter.id||$eq||' + d.id);
    //                 this.serviceProxy.getManyBaseParameterRequestControllerParameterRequest(
    //                   undefined,
    //                   undefined,
    //                   filter3,
    //                   undefined,
    //                   ['id,ASC'],
    //                   undefined,
    //                   1000,
    //                   0,
    //                   0,
    //                   0
    //                 ).subscribe((res=>{  

    //                   // console.log('oooo',res.data)
    //                      if(res.data.length>0) {if(res.data[0].dataRequestStatus==1 || res.data[0].dataRequestStatus==2 || res.data[0].dataRequestStatus==3) {
    //                         ++pendingreqcount;
    //                       }
                         
    //                       if(res.data[0].dataRequestStatus == 4){
    //                         ++pendingdecount;
    //                       }
                          
    //                       if(res.data[0].dataRequestStatus==5){
    //                         ++reccount;
    //                       }}

    //                   datarequests1.totalreqCount = totaldrcount;
    //                   datarequests1.pendingreqCount = pendingreqcount;
    //                   datarequests1.pendingdataentries =pendingdecount;
    //                   datarequests1.recieved = reccount;
    //                   // console.log('kjkj',reccount)
    //                 }))
                   

    //               }
                
                
                 
    //           }))
           
    //          this.datarequests.push(datarequests1);
           
    //          datarequests1.pendingdataentries=0;
    //          datarequests1.pendingreqCount = 0;
    //          datarequests1.recieved =0;
    //          datarequests1.totalreqCount =0;
    //         //  datarequests1.year =0;
    //         // console.log("datarequests");

           
    //         }
    //         // console.log("this.datarequests");
    //         // console.log(this.datarequests);
    //       }

          
       
    //     }));

    //     // this.alldatarequests=this.datarequests.slice(0,this.rows);       
    //   } 
    //   // this.rows=event.rows?event.rows:this.rows;
    //   // let first=event.first?event.first:0; 
    // //  this.datarequests= this.datarequests.slice(first,(first+ +this.rows));

    // // console.log(testu)
    // // console.log(testu[0])
   
     
    // //   this.data = {
    // //     labels: ['Proposed','Under construction','Operational'],
    // //     datasets: [
    // //         {
    // //             data:[this.proposedProjectsCount,this.underConstructionCount,this.operationalProjectsCount],
    // //             backgroundColor: [
    // //                 "#FF6384",
    // //                 "#36A2EB",
    // //                 "#FFCE56"
    // //             ],
    // //             hoverBackgroundColor: [
    // //                 "#FF6384",
    // //                 "#36A2EB",
    // //                 "#FFCE56"
    // //             ]
    // //         }
    // //     ]
    // // };
    //  // console.log(this.operationalProjectsCount)


     
    //     });
        
    // }, 1);

    
    // setTimeout(() => {

    //   console.log("tesstqq")
    //   this.alldatarequests= this.datarequests.slice(0, 10);
    // },1000)
   

  }

  // loadgridData = (event: LazyLoadEvent) => {
  //   console.log(event);
  //   this.loading = true;
  //   this.totalRecords = 0;

  //   let filtertext = this.searchBy.text ? this.searchBy.text : '';
    
  //   let pageNumber =
  //     event.first === 0 || event.first === undefined
  //       ? 1
  //       : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
  //   this.rows = event.rows === undefined ? 10 : event.rows;
  //   setTimeout(() => {
  //     this.parameterProxy
  //     .getDateRequest(
  //       pageNumber,
  //       this.rows,
  //       filtertext,
        
  //     ).subscribe((a) => {
  //         console.log('aaaaaaaaa',a)
  //         //this.totalRecords = a.meta.totalItems;
  //         this.loading = false;
  //       });
  //   }, 1);
  // };
  
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.methodologies
      ? this.first === this.methodologies.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.methodologies ? this.first === 0 : true;
  }
  
  status(){}

}

export interface activeproject {
  name : string,
  ertarget : number,
  targetyear : string,
  erarchievment : number,
  archivmentyear : string
};

export interface datarequest {
  name : string,
  type : string,
  // year : number,
  year : string,
  assenmentYearId:number,
  totalreqCount : number,
  pendingreqCount : number,
  pendingdataentries : number,
  recieved : number
};

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AssesmentControllerServiceProxy, AssesmentResaultControllerServiceProxy, Assessment, AssessmentResault, Project, ProjectControllerServiceProxy, ServiceProxy, TrackcaEntity } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 
@Component({
  selector: 'app-trackclimateactions',
  templateUrl: './trackclimateactions.component.html',
  styleUrls: ['./trackclimateactions.component.css']
})
export class TrackclimateactionsComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  loading:any;
  totalRecords:any;
  rows:any;
  status: string[];
  statusListObject: any[];
  statusList: string[] = [];
  years: any;
  selectedAssessemntYearObject:any;
  assessmentList:Assessment[]=[];
  assessmentList1: Assessment[]=[];
  assessmentResults: AssessmentResault[]=[];
  fileName: string='trackClimateActions.xlsx';
  public projectList:number[]=[];
  selectedprojects: number[];
  yrs: string[]=[];
  dbtrackcaprojectids: number[]=[];
  constructor(private serviceProxy: ServiceProxy,
    private climateactionserviceproxy: ProjectControllerServiceProxy, 
    private messageService :MessageService, 
    private router: Router,
    private location: Location,
    private assesmentserviceProxy: AssesmentControllerServiceProxy,
    private assesmentResaultProxy: AssesmentResaultControllerServiceProxy,
    private route: ActivatedRoute,) { }
  datarequests:any=['dd','dd','dd','dd']
  yearList:any=['test','test1']
  yearList2:string[] = [];
  uniqueYears:any[] = [];
  year:number;
  searchBy1:any={
    sector : 0
  }
  activeprojects:activeproject[]=[];
  activeprojects2:activeproject[]=[];
  activeprojectson:activeprojectsave[]=[];
  activeprojectsload:activeproject[]=[];
  instrumentList:string[]=[];
  selectedinstrument:any;
  projects: Project[];
  project:any;
  activeprojectson1:activeprojectsave[]=[];
  select:boolean=false;
  visibility5:boolean = false;
  sector:boolean =true;
  flag:number;
  recievedFlag:number;


  trackClimateActions:any[]=[];
  selectedYear:any = '';
  ndcList:any[] =[];
  selectedNdcIds:any='';
  isActivendc:boolean = true;
  response:any;
  excellist:any[] =[];

  ngOnInit(): void {


    this.route.queryParams.subscribe((params) => {
      this.recievedFlag = params['flag'];
      // this.assesMentYearId = 3;
      console.log('this.recievedFlag..,,', this.recievedFlag);
      this.onSearch();
    });

    
      
   


    
      this.serviceProxy.getManyBaseAssessmentYearControllerAssessmentYear(
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
      ).subscribe((res=>{
        this.yearList = res.data;

        setTimeout(() => {
      
          for(let x = 0;x<this.yearList.length;x++)
        {
       
           this.yearList2.push(this.yearList[x]?.assessmentYear);
        }
     
        this.uniqueYears = [...new Set(this.yearList2)];
        },1000);



        this.serviceProxy.getManyBaseNdcControllerNdc(
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
        ).subscribe((res=>{
          
         this.ndcList = res.data;
         console.log("ndclist..",this.ndcList)
  
        }));
  
        


      }));

      this.serviceProxy.getManyBaseProjectStatusControllerProjectStatus(
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
      ).subscribe((res=>{
        this.statusListObject = res.data;
        console.log("this.statusListObject....",this.statusListObject)

        if (this.statusListObject != undefined)
        {
          for(let x = 0;x<this.statusListObject.length;x++)
          {
         
             this.statusList.push(this.statusListObject[x]?.name);
          }
       
          console.log("this.statusList....",this.statusList)
        }

      
        
       

        
      }));
    
      this.instrumentList = ["regulatory","economic instrument", "other"]
     // this.statusList = ["planned", "adopted", "implemented"]


   

  }


  
  
  async loadgridData(event: LazyLoadEvent){

    console.log("this.recievedFlag....",this.recievedFlag)
    this.activeprojects = [];
    this.activeprojectson1 = [];
    this.activeprojectson = [];
    this.activeprojectsload = [];
 
    
     if(this.recievedFlag != undefined)
     {
       this.select = true;
       this.totalRecords = 0;
 
    
  
     let pageNumber =
       event.first === 0 || event.first === undefined
         ? 1
         : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
     this.rows = event.rows === undefined ? 10 : event.rows;
       //this.activeprojects;
       let filterX: string[] = new Array();
       filterX.push('flag||$eq||' +this.recievedFlag);
       this.serviceProxy.getManyBaseTrackClimateControllerTrackcaEntity(
         undefined,
         undefined,
         filterX,
         undefined,
         ['createdOn,DESC'],  //['createdOn, DESC'],
         undefined,
         1000,
         0,
         0,
         0
       ).subscribe((res=>{
 
 
         console.log("recievd track ca...",res.data);
 
        
         this.activeprojects = [];
         for(let z of res.data)
         {
          // console.log("z.status.toString()....",z.status.toString());
 
           let activeproject1:activeproject= {
             Name : z.climateActionName,
             Description : z.description,
             Objectives : z.objective,
             Type_Of_Instrument : z.instrument,
             Status : z.trackcaStatus,
             Sector_affected : z.sector,
             Gasses_affected : z.gassesAffected,
             ndc_ca: z.ndcs,
             startYear_of_implementation : z.startYearImplementation,
             implementing_entity_or_entities : z.implementingEntities,
             achieved : z.achieved,
             expected : z.expected,
             flag : z.flag,
            
           };
 
           this.activeprojects.push(activeproject1);
         //  console.log("(!)this.activeprojects...",this.activeprojects);
          
         }
 
        }))
     }
 
 
     else
     {
 
      
     this.loading = true;
     this.totalRecords = 0;
     console.log("yer....",this.selectedYear)
 
    
     let ndcId = 0;
     let filtertext ='';
    
     let pageNumber =
       event.first === 0 || event.first === undefined
         ? 1
         : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
     this.rows = event.rows === undefined ? 10 : event.rows;
     setTimeout(() => {
       this.serviceProxy.getManyBaseTrackClimateControllerTrackcaEntity(
         undefined,
         undefined,
         undefined,
         undefined,
         ['createdOn,DESC'],  //['createdOn, DESC'],
         undefined,
         1000,
         0,
         pageNumber,
         0
       ).subscribe((async res=>{
 
     if(res.data.length==0)
     { 
      // console.log("TRack CA jhas not....++++",res.data)
       this.flag = 1;
     }
     else
     {
      // console.log("TRack CA jhas....++++",res.data)
        let maxNumber = res.data[0].flag;
         this.flag = maxNumber +1;
     }
 
     this.climateactionserviceproxy.getTrackClimateActionsDetails(
       pageNumber, 
       this.rows, 
       filtertext, 
       this.selectedYear,
       this.selectedNdcIds,
       )
       .subscribe((a) => {
           this.trackClimateActions = a.items;
           this.totalRecords = a.meta.totalItems;
           console.log('first time climation....',this.trackClimateActions);
           console.log('totalRecords....',a.meta.totalItems);
 
           for(let project of this.trackClimateActions)
           {
           let activeproject2:activeprojectsave= {
             projectId:0,
             Name : "",
             Des : "",
             Obj : "",
             Instrument : "",
             Status : "",
             Sector : "",
             Gasses : "",
             ndcs:"",
             startYear: 2020,
             implementing : "",
             achieved : 0,
             expected : 0,
             years : "",
             flag : 0 
            
           };
          
           
           let activeproject1:activeproject= {
             Name : "",
             Description : "",
             Objectives : "",
             Type_Of_Instrument : "",
             Status : "",
             Sector_affected : "",
             Gasses_affected : "",
             ndc_ca:"",
             startYear_of_implementation : 2020,
             implementing_entity_or_entities : "",
             achieved : 0,
             expected : 0,
             flag : 0
            
           };
 
 
           activeproject1.Name = project.climateActionName;
           activeproject1.Description = project.description;
           activeproject1.Objectives = project.objective;
           activeproject1.Type_Of_Instrument = "";
           activeproject1.Status = project.projectStatus?.name;
           activeproject1.startYear_of_implementation = Number(project.proposeDateofCommence.toString().split("-")[0]);
          //activeproject1.startYear_of_implementation = 1995
           activeproject1.Sector_affected = "Transport";
           activeproject1.Gasses_affected = "CO2";
           activeproject1.ndc_ca = project.ndc?.name;
           activeproject1.implementing_entity_or_entities= this.project?.implementingEntity;
 
           if(project.assessment[0].assessmentType == 'Ex-ante')
           {
             activeproject1.expected = 12; 
           }
           else{
             activeproject1.achieved = 13;
           }
          
          
           activeproject1.flag = this.flag;
 
 
           this.activeprojectsload.push(activeproject1); // push one by one modified row for table
           console.log('this.activeprojectsload...',this.activeprojectsload)
 
 
 
           activeproject2.Name = activeproject1.Name;
           activeproject2.Des= activeproject1.Description;
           activeproject2.Instrument = activeproject1.Type_Of_Instrument;
           activeproject2.Gasses = activeproject1.Gasses_affected;
           activeproject2.ndcs = activeproject1.ndc_ca;
           activeproject2.Sector = activeproject1.Sector_affected;
           activeproject2.Status = activeproject1.Status;
           activeproject2.startYear = activeproject1.startYear_of_implementation;
           activeproject2.implementing = activeproject1.implementing_entity_or_entities;
           activeproject2.achieved = activeproject1.achieved;
           activeproject2.expected = activeproject1.expected
           activeproject2.projectId = project.id;
           activeproject2.years = this.selectedYear.toString();
           activeproject2.flag = this.flag;
          // console.log('activeproject2......',activeproject2);
           this.activeprojectson.push(activeproject2);
 
         }
          
         this.activeprojects = this.activeprojectsload;
         this.activeprojectson1 = this.activeprojectson;
         this.loading = false;
 
         });
 
       
       }))
 
        
        
         
     },);
 
     }
    
  
 
 
   
   }











   download(){


    for(let item of this.activeprojects)
    {

      let obj:excelTrackCas =
      {
       
      //  Original_Name_of_The_Parameter:'',
      Name:'',
      Description:'',
      Objectives:'',
      Type_of_Instrument:'',
      Status:'',
      Sector_Affected:'',
      Gasses_affected:'',
      NDC:'',
      StartYear_of_Implementation:'',
      Implementing_Entity_or_Entities:'',
      Achieved:'',
      Expected:'',


      }

      obj.Name = item.Name;
      obj.Description = item.Description;
      obj.Objectives = item.Objectives;
      obj.Type_of_Instrument = item.Type_Of_Instrument;
      obj.Status = item.Status;
      obj.Sector_Affected = item.Sector_affected;
      obj.Gasses_affected = item.Gasses_affected;
      obj.NDC = item.ndc_ca;
      obj.StartYear_of_Implementation = item.startYear_of_implementation;
      obj.Implementing_Entity_or_Entities = item.implementing_entity_or_entities;
      obj.Achieved = item.achieved;
      obj.Expected=item.expected;

      this.excellist.push(obj);

    }
 
   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excellist);
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, "Track CA");

  XLSX.writeFile(wb, this.fileName);

   /* save to file */
  // XLSX.writeFile(wb, this.fileName);
  }




  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  onyearChange(event: any) {
    
    this.isActivendc = false;
    this.onSearch();
 }

 onNDCChange(event:any){

  
  console.log("selcted ndc..",event)
  let ndcIdArray:any[]=[];
  for(let ndcObj of event)
  {
    ndcIdArray.push(ndcObj.id)
  }
  console.log("selcted ndcIds..",ndcIdArray)
  this.selectedNdcIds = ndcIdArray.join();
  console.log("selcted ndcIds string..",this.selectedNdcIds)

  //this.selectedNdcIds = event.id
  this.onSearch();
 }



  

 publish()
 {
// console.log('this.yrs.toString();.....',this.selectedYear.toString())

   this.visibility5 = true;

   this.activeprojectson1.forEach((project,index)=>{
     let trackca: TrackcaEntity = new TrackcaEntity();
     trackca.achieved = this.activeprojects[index].achieved;
     trackca.projectId = project.projectId;
     trackca.objective = this.activeprojects[index].Objectives;
     trackca.sector = this.activeprojects[index].Sector_affected;
     trackca.climateActionName = this.activeprojects[index].Name;
     trackca.description = this.activeprojects[index].Description;
     trackca.startYearImplementation = this.activeprojects[index].startYear_of_implementation;
     trackca.trackcaStatus = this.activeprojects[index].Status;
     trackca.expected = this.activeprojects[index].expected;
     trackca.gassesAffected = this.activeprojects[index].Gasses_affected;
     trackca.ndcs = this.activeprojects[index].ndc_ca;
     trackca.instrument = this.activeprojects[index].Type_Of_Instrument;
     trackca.implementingEntities = this.activeprojects[index].implementing_entity_or_entities;
     trackca.years  = this.selectedYear.toString();
     trackca.flag = this.activeprojects[index].flag;

     this.serviceProxy
     .createOneBaseTrackClimateControllerTrackcaEntity(trackca)
     .subscribe((resp=>{
       //  console.log('mm1',resp)
       //alert("hello");
       
       setTimeout(() => {
    
       
         this.router.navigate(['/track-ca-country']);
     
       },1000);
       }));
    
   
   })
    
   
   this.messageService.add({severity:'success', summary:'Confirmed', detail:'Successfully generated!'});

 }

}

export interface excelTrackCas
{
  Name:any,
  Description:any,
  Objectives:any,
  Type_of_Instrument:any,
  Status:any,
  Sector_Affected:any,
  Gasses_affected:any,
  NDC:any,
  StartYear_of_Implementation:any,
  Implementing_Entity_or_Entities:any,
  Achieved:any,
  Expected:any,

}

export interface activeproject {
 Name : string,
 Description : string,
 Objectives : string,
 Type_Of_Instrument : string,
 Status : string,
 Sector_affected : string,
 Gasses_affected : string,
 ndc_ca:string,
 startYear_of_implementation : number,
 implementing_entity_or_entities : string,
 achieved : number,
 expected : number,
 flag :number
};

export interface activeprojectsave {
 projectId : number,
 Name : string,
 Des : string,
 Obj : string,
 Instrument : string,
 Status : string,
 Sector : string,
 Gasses : string,
 ndcs:string,
 startYear : number,
 implementing : string,
 achieved : number,
 expected : number,
 years : string,
 flag :number
};

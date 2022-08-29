import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import {
  Assessment,
  MitigationActionType,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-active-climate-action',
  templateUrl: './active-climate-action.component.html',
  styleUrls: ['./active-climate-action.component.css']
})
export class ActiveClimateActionComponent implements OnInit,AfterViewInit{
  climateactions: Project[];
  climateaction: Project = new Project();
  sectors: Sector[];
  sectorName: string[] = [];
  sector: Sector = new Sector();
  cols: any;
  columns: any;
  options: any;
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  assessmentList: Assessment[] = [];
  assessmentList1:any = ['Proposal','Active']
  projectApprovalStatus: ProjectApprovalStatus[];
  selectedSectorType: Sector;
  selectedstatustype: ProjectStatus;
  searchText: string;
  asseStatus:any;
  asseType = ['MAC','Ex-ante','Ex-post'];
  countryId: number = 0;  // should assign particular country id from login
  sectorId: number = 0;  // should assign particular sector id from login
  
 
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  searchBy: any = {
    text: null,
    status: null,
    ApprovalStatus: null,
    assessmentStatus:null,
    assessmentType1: null,
    
  };
  selectedProject: Project;
  @ViewChild('op') overlay: any;
  first = 0;
  statusList: string[] = new Array();

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }


  onStatusChange(event: any) {
     this.onSearch();
  }

  ngOnInit(): void {


    this.serviceProxy.
       getManyBaseProjectStatusControllerProjectStatus(
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
       ).subscribe((res: any) => {
        this.projectStatusList = res.data;
      //  console.log("projectStatusList",res.data)
      });
    
      this.serviceProxy.getManyBaseAssesmentControllerAssessment(
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
       ).subscribe((res: any) => {
        this.assessmentList = res.data;
       // console.log("AssemntList",res.data)
      });

  }
  
  projectSummery() {
    this.router.navigate(['']);  //should insert summery page link
  }

  sendDetails(climateaction:Project)
  {
    this.router.navigate(['/active-result'], {
      queryParams: { id: climateaction.id },
    });
  }

  isMac(ast:any): boolean {
    if(ast){

      let x = ast.find((o: any)=>o.assessmentType == 'MAC');
      return x;
    }
    
   // console.log("our array obj ", ast);
   // console.log("we have ", x);
   return false;
    
  }

  isGhg(ast:any): boolean {

    if(ast){

      let x = ast.find((o: any)=>o.assessmentType == 'Ex-ante' || o.assessmentType == 'Ex-post' ); 
      return x;
    }

   // console.log("our array obj ", ast);
   // console.log("we have ", x);
    return false;
  }

  isTracking(ast:any): boolean {
    if(ast){

      let x = ast.find((o: any)=>o.assessmentType == 'Tracking');
      return x;
    }

   // console.log("our array obj ", ast);
   // console.log("we have ", x);
    return false;
    
    
   // console.log("our array obj ", ast);
    //console.log("we have ", x);
    
  }
 
//  climateaction.assessement.find(o=>o.assessementType === 'Ex-Ante'

  loadgridData = (event: LazyLoadEvent) => {
   
    //this.loading = true;
    this.totalRecords = 0;
    
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    if(this.searchBy.assessmentStatus != null)
    {
      if(this.searchBy.assessmentStatus == "Proposal")
      {
         this.asseStatus = 1;
      }
      else
      {
        this.asseStatus = 0;
      }
    }
    else
    {
      this.asseStatus = -1;
    }
    console.log("this.asseStatus...",this.asseStatus)
   // let assessmentStatusName = this.searchBy.assessmentStatus ? this.searchBy.assessmentStatus.assessmentStatus : '';
    //console.log("assessmentStatus",assessmentStatusName)
    let projectApprovalStatusId = this.searchBy.ApprovalStatus ? this.searchBy.ApprovalStatus.id : 0;
    let asseType = this.searchBy.assessmentType1?this.searchBy.assessmentType1:'';
    console.log("asseType...",asseType)
    if (this.searchBy.status !== null){
      this.searchBy.text = this.searchBy.status.name
    } else {
      this.searchBy.text = null
    }
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    //let isActive= 1;
    setTimeout(() => {
      this.projectProxy
        .getActiveClimateActionList(pageNumber, 
          this.rows, 
          filtertext, 
          projectApprovalStatusId,  
          this.asseStatus,
          this.sectorId,
          asseType,
          "1234")
        .subscribe((a) => {
          
          this.climateactions = a.items;
          this.totalRecords = a.meta.totalItems;

          
          this.climateactions.map(o=>{
            console.log("  assessement1", o)
            let filter1: string[] = new Array();
    filter1.push('project.id||$eq||' + o.id)
            this.serviceProxy.getManyBaseAssesmentControllerAssessment(
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
            ).subscribe(res=>{
              o.assessments=res.data;
              console.log("  assessement", res)


            })

            

          })
         // this.loading = false;
          console.log(" this.totalRecords", this.totalRecords)
          console.log("this.climateactions ", this.climateactions)
        });
    }, 1);
  };

}

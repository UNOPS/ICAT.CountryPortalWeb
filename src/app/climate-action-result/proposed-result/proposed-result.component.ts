import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import {
  AssesmentControllerServiceProxy,
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
  selector: 'app-proposed-result',
  templateUrl: './proposed-result.component.html',
  styleUrls: ['./proposed-result.component.css']
})
export class ProposedResultComponent implements OnInit, AfterViewInit {

 // id: string;
  assessments: Assessment[]= [];
   assessmentList: Assessment[] = [];
  project: any = [];
  searchText: string;
  assessmentStage: string = 'PRO-Asse';
  isProposal:number = 1;
  climateActionName : string;
 // pid:number=1

  countryId: number = 0;  // should assign particular country id from login
  sectorId: number = 0;  // should assign particular sector id from login
  
  
  
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  selectedProject: Assessment;
  ////////////////////////////////////
  searchBy: any = {
    text: null,
    assessmentType1: null,  
  };
  //////////////////////////////////////// 

  asseType = ['MAC','Ex-ante','Ex-post'];

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  @ViewChild('op') overlay: any;
  first = 0;
 // statusList: string[] = new Array();
  paramsObject:any = {};

  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private AssessmentProxy: AssesmentControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  onStatusChange(event: any) {
    this.onSearch();
 }

 toDetails(assessments: Assessment)
    {
      this.router.navigate(['/result'],{ 
        queryParams: { id: assessments.id, yr: assessments.assessmentYear[0]?.assessmentYear  } // need to add yr after list is done
      });  //should insert summery page link
    
    }


  toMacDetails(assessments: Assessment)
  {
    this.router.navigate(['/mac-result'],{
      queryParams: { id: assessments.id }
    });  //should insert summery page link
  
  }

 


  

  ngOnInit(): void {

    this.route.queryParamMap
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      //console.log("hiii",this.paramsObject.params.id);
      }
      );


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
        console.log("AssemntList",res.data)
      });
  /*
      this.serviceProxy.
      getOneBaseProjectControllerProject(
       this.paramsObject.params.id,
       undefined,
       undefined,
       undefined,
      
      ).subscribe((res: any) => {
       this.project = res;
       console.log("projectName2...",this.project)
     });
*/
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);

    }


    loadgridData = (event: LazyLoadEvent) => {
      // console.log("below loarding data")
       this.loading = true;
       this.totalRecords = 0;
      // console.log("status",this.searchBy.status)
       
      
      
       let filtertext = this.searchBy.text ? this.searchBy.text : '';
       let pageNumber =
         event.first === 0 || event.first === undefined
           ? 1
           : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
       this.rows = event.rows === undefined ? 10 : event.rows;
       let assmntType = this.searchBy.assessmentType1 ? this.searchBy.assessmentType1: '';
       let ctAction = this.searchBy.climateActionName1 ? this.searchBy.climateActionName1.climateActionName : '';
      // console.log("status",assmntType)
       setTimeout(() => {                                          
        this.AssessmentProxy
        .getAssmentDetails(pageNumber, this.rows, filtertext,assmntType,this.isProposal,this.paramsObject.params.id,ctAction)
        .subscribe((a) => {
          this.assessments = a.items;
          this.climateActionName = this.assessments[0]?.project.climateActionName;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
         console.log('hii Assessements ',this.assessments);
        });
       }, 1);
  };
  


  

}

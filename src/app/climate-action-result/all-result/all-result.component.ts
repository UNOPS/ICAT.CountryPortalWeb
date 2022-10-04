import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import {
  AssesmentControllerServiceProxy,
  Assessment,
  AssessmentYear,
  MitigationActionType,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-all-result',
  templateUrl: './all-result.component.html',
  styleUrls: ['./all-result.component.css'],
})
export class AllResultComponent implements OnInit, AfterViewInit {
  // id: string;
  assessments: Assessment[];
  assessmentList: Assessment[] = [];
  project: any = [];
  searchText: string;
  assessmentStage: string = 'CA-Asse'; // should togle
  isProposal: number = 1;
  // pid:number=1

  countryId: number = 0; // should assign particular country id from login
  sectorId: number = 0; // should assign particular sector id from login

  projects: Project[]=[];
  assignCAArray: any[] = [];

  loading: boolean;
  totalRecords: number = 0;
  itemsPerPage: number =0;
  rows: number = 10;
  last: number;
  event: any;
  selectedProject: Assessment;
  dataCollectionModuleStatus:number;
  dataCollectionGhgModuleStatus: number;
  ////////////////////////////////////
  searchBy: any = {
    text: null,
    assessmentType1: null,
    climateActionName1: null,
  };
  ////////////////////////////////////////

  asseType: string[] = [];
  count:number = 0;

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  // @ViewChild('op') overlay: any;
  // first = 0;
  // // statusList: string[] = new Array();
  // paramsObject: any = {};

  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  @ViewChild('op') overlay: any;
  first = 0;
  // statusList: string[] = new Array();
  paramsObject: any = {};

  toMacDetails(assessments: Assessment) {
    this.router.navigate(['/mac-result'], {
      queryParams: { id: assessments.id },
    }); //should insert summery page link
  }

  // toDetails() {
  //   this.router.navigate(['']); //should insert summery page
  // }

  toDetails(assessments: Assessment,assYr:AssessmentYear)
  {
    this.router.navigate(['/result'],{ 
      // queryParams: { id: assessments.id, yr: assessments.assessmentYear[0]?.assessmentYear  } // need to add yr after list is done
      queryParams: { id: assessments.id, yr: assYr.assessmentYear  } // need to add yr after list is done
    });  //should insert summery page link
  
  }

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private AssessmentProxy: AssesmentControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  handleChange(event:any)
  {
    
 console.log("my event is ..",event)
 console.log("my count is ..",this.count)

 if(event.index == 1)
 {
  
    this.searchBy.text = '';
    this.searchBy.assessmentType1='';
    this.searchBy.climateActionName1='';
    
    this.setActive();
 
 }
 else
 {
  this.searchBy.text = '';
  this.searchBy.assessmentType1='';
  this.searchBy.climateActionName1='';
  this.setPropose();
  }
 
 
  }

  setPropose() {
    this.isProposal = 1;
   // console.log("hiiiiii");
   this.AssessmentProxy.getAssmentDetails(
    0,
    0,
    '',
    '',
    this.isProposal,
    0,
    ''
  )
    .subscribe((res: any) => {
      // this.projects = res.data;
      // console.log('climateactionsyoooo', res);
      for(let a of res.items){   
        if (a !== null) {
       
       if (
         !this.assignCAArray.includes(
           a.project
             .climateActionName
         )
       ) {
        
         this.assignCAArray.push(
           a.project
             .climateActionName
         );
         this.projects.push(
          a.project
         );
       }
     }}
     console.log('climateactionsyoooo', res); 
    });


    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  setActive() {
    this.isProposal = 0;
   // console.log("byeee");
    // console.log(this.assessmentStage);
    this.AssessmentProxy.getAssmentDetails(
      0,
      0,
      '',
      '',
      this.isProposal,
      0,
      ''
    )
      .subscribe((res: any) => {
        // this.projects = res.data;
        // console.log('climateactionsyoooo', res);
        this.assignCAArray=[]
        this.projects=[]
        for(let a of res.items){   
          if (a !== null) {
         
         if (
           !this.assignCAArray.includes(
             a.project
               .climateActionName
           )
         ) {
          
           this.assignCAArray.push(
             a.project
               .climateActionName
           );
           this.projects.push(
            a.project
           );
         }
       }}
       console.log('climateactionsyoooo', res);
      });



    let event: any = {};
    event.rows = this.rows;
    event.first = 0;


    this.loadgridData(event);
  }

  onStatusChange(event: any) {
    this.onSearch();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);
   let model:number[]=[];
   this.dataCollectionModuleStatus =tokenPayload.moduleLevels[3];
   this.dataCollectionGhgModuleStatus =tokenPayload.moduleLevels[4];


    if (this.dataCollectionGhgModuleStatus) {
      this.asseType = ['Ex-ante','Ex-post'];
    } else {
      this.asseType = ['MAC','Ex-ante','Ex-post'];
    }
    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    this.AssessmentProxy.getAssmentDetails(
      0,
      0,
      '',
      '',
      this.isProposal,
      0,
      ''
    )
      .subscribe((res: any) => {
        // this.projects = res.data;
        // console.log('climateactionsyoooo', res);
        for(let a of res.items){   
          if (a !== null) {
         
         if (
           !this.assignCAArray.includes(
             a.project
               .climateActionName
           )
         ) {
          
           this.assignCAArray.push(
             a.project
               .climateActionName
           );
           this.projects.push(
            a.project
           );
         }
       }}
        
      });




    this.serviceProxy
      .getManyBaseAssesmentControllerAssessment(
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
        this.assessmentList = res.data;
        console.log('AssemntList', res.data);
      });

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
    let assmntType = this.searchBy.assessmentType1
      ? this.searchBy.assessmentType1
      : '';
    let ctAction = this.searchBy.climateActionName1
      ? this.searchBy.climateActionName1.climateActionName
      : '';
     console.log("status................",assmntType)
    let id = 0;

    setTimeout(() => {
      this.AssessmentProxy.getAssmentDetails(
        pageNumber,
        this.rows,
        filtertext,
        assmntType,
        this.isProposal,
        id,
        ctAction
      ).subscribe((a) => {
        this.assessments = a.items;
        this.totalRecords = a.meta.totalItems;
        this.loading = false;
        this.itemsPerPage = a.meta.itemsPerPage
        console.log('hii Assessements ', this.assessments);
      });
    }, 1);
  };
}

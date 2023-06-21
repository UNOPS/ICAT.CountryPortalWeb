import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LazyLoadEvent,
} from 'primeng/api';

import {
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-all-climate-action',
  templateUrl: './all-climate-action.component.html',
  styleUrls: ['./all-climate-action.component.css']
})
export class AllClimateActionComponent implements OnInit,AfterViewInit {
  climateactions: Project[];
  selectedClimateActions: Project[];
  climateaction: Project = new Project();
  relatedItems: Project[] = [];
  sectors: Sector[];
  sectorName: string[] = [];
  sector: Sector = new Sector();
  cols: any;
  columns: any;
  options: any;
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  projectApprovalStatus: ProjectApprovalStatus[];
  selectedSectorType: Sector;
  selectedstatustype: ProjectStatus;
  searchText: string;
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  searchBy: any = {
    text: null,
    status: null,
    ApprovalStatus: null,
    
  };

  countryId: number = 0;  // should assign particular country id from login
  sectorId: number = 0;  // should assign particular sector id from login

  
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
      // console.log("projectStatusList",res.data)
     });

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
       this.projectApprovalStatus = res.data.filter((a: { name: string; })=>a.name=="Accept" || a.name=="Active");
      // console.log("projectapprStatusList",res.data)
     });
 
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    let currentProgress = this.searchBy.currentProgress ? this.searchBy.currentProgress : '';
    let projectApprovalStatusId = this.searchBy.ApprovalStatus ? this.searchBy.ApprovalStatus.id : 0;
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber = 1
  
    // Removed as this executing in loadgridData as well
    // this.projectProxy
    //     .getAllClimateActionList(pageNumber, this.rows, filtertext, statusId,projectApprovalStatusId,currentProgress,this.sectorId,"1234")
    //     .subscribe((a) => {
    //       this.climateactions = a.items;
    //       this.totalRecords = a.meta.totalItems;
    //       // console.log('first time climation',this.climateactions);
    //     });
    
  }
 
  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }


  loadgridData = (event: LazyLoadEvent) => {
    //console.log("below loarding data")
   this.loading = true;
    this.totalRecords = 0;
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    let currentProgress = this.searchBy.currentProgress ? this.searchBy.currentProgress : '';
   // console.log("status",statusId)
    let projectApprovalStatusId = this.searchBy.ApprovalStatus ? this.searchBy.ApprovalStatus.id : 0;
   // console.log("projectApprovalStatusId",projectApprovalStatusId)
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    
    // setTimeout(() => {
      this.projectProxy
        .getAllClimateActionList(pageNumber, this.rows, filtertext, statusId,projectApprovalStatusId,currentProgress,this.sectorId,"1234")
        .subscribe((a) => {
          this.loading = false
          this.climateactions = a.items;
          this.totalRecords = a.meta.totalItems;
          // console.log('first time climation',this.climateactions);
        });
    // });
  };
  
  projectSummery() {
    this.router.navigate(['']);  //should insert summery page link
  }

  detail(climateactions: Project) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id },
    });
  } 
  addproject() {
    this.router.navigate(['/propose-project']);
  }
}

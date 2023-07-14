import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { environment } from 'environments/environment';
import {
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-all-climate-action',
  templateUrl: './all-climate-action.component.html',
  styleUrls: ['./all-climate-action.component.css'],
})
export class AllClimateActionComponent implements OnInit, AfterViewInit {
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
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;
  searchBy: any = {
    text: null,
    status: null,
    ApprovalStatus: null,
  };

  countryId = 0;
  sectorId = 0;

  selectedProject: Project;
  @ViewChild('op') overlay: any;

  first = 0;
  statusList: string[] = [];

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}

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
    this.serviceProxy
      .getManyBaseProjectStatusControllerProjectStatus(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.projectStatusList = res.data;
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
        0,
      )
      .subscribe((res: any) => {
        this.projectApprovalStatus = res.data.filter(
          (a: { name: string }) => a.name == 'Accept' || a.name == 'Active',
        );
      });

    const statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    const currentProgress = this.searchBy.currentProgress
      ? this.searchBy.currentProgress
      : '';
    const projectApprovalStatusId = this.searchBy.ApprovalStatus
      ? this.searchBy.ApprovalStatus.id
      : 0;
    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const pageNumber = 1;

    this.projectProxy
      .getAllClimateActionList(
        pageNumber,
        this.rows,
        filtertext,
        statusId,
        projectApprovalStatusId,
        currentProgress,
        this.sectorId,
        environment.apiKey1,
      )
      .subscribe((a) => {
        this.climateactions = a.items;
        this.totalRecords = a.meta.totalItems;
      });
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;
    const statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    const currentProgress = this.searchBy.currentProgress
      ? this.searchBy.currentProgress
      : '';
    const projectApprovalStatusId = this.searchBy.ApprovalStatus
      ? this.searchBy.ApprovalStatus.id
      : 0;
    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.projectProxy
        .getAllClimateActionList(
          pageNumber,
          this.rows,
          filtertext,
          statusId,
          projectApprovalStatusId,
          currentProgress,
          this.sectorId,
          environment.apiKey1,
        )
        .subscribe((a) => {
          this.loading = false
          this.climateactions = a.items;
          this.totalRecords = a.meta.totalItems;
        });
    });
  };

  projectSummery() {
    this.router.navigate(['']);
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

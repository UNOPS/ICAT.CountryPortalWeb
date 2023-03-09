import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';

import {
  Assessment,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-active-climate-action',
  templateUrl: './active-climate-action.component.html',
  styleUrls: ['./active-climate-action.component.css'],
})
export class ActiveClimateActionComponent implements OnInit, AfterViewInit {
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
  assessmentList1: any = ['Proposal', 'Active'];
  projectApprovalStatus: ProjectApprovalStatus[];
  selectedSectorType: Sector;
  selectedstatustype: ProjectStatus;
  searchText: string;
  asseStatus: any;
  asseType = ['MAC', 'Ex-ante', 'Ex-post'];
  countryId = 0;
  sectorId = 0;

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;
  searchBy: any = {
    text: null,
    status: null,
    ApprovalStatus: null,
    assessmentStatus: null,
    assessmentType1: null,
  };
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

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
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
      .getManyBaseAssessmentControllerAssessment(
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
        this.assessmentList = res.data;
      });
  }

  projectSummery() {
    this.router.navigate(['']);
  }

  sendDetails(climateaction: Project) {
    this.router.navigate(['/active-result'], {
      queryParams: { id: climateaction.id },
    });
  }

  isMac(ast: any): boolean {
    if (ast) {
      const x = ast.find((o: any) => o.assessmentType == 'MAC');
      return x;
    }

    return false;
  }

  isGhg(ast: any): boolean {
    if (ast) {
      const x = ast.find(
        (o: any) =>
          o.assessmentType == 'Ex-ante' || o.assessmentType == 'Ex-post',
      );
      return x;
    }

    return false;
  }

  isTracking(ast: any): boolean {
    if (ast) {
      const x = ast.find((o: any) => o.assessmentType == 'Tracking');
      return x;
    }

    return false;
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.totalRecords = 0;

    const statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    if (this.searchBy.assessmentStatus != null) {
      if (this.searchBy.assessmentStatus == 'Proposal') {
        this.asseStatus = 1;
      } else {
        this.asseStatus = 0;
      }
    } else {
      this.asseStatus = -1;
    }

    const projectApprovalStatusId = this.searchBy.ApprovalStatus
      ? this.searchBy.ApprovalStatus.id
      : 0;
    const asseType = this.searchBy.assessmentType1
      ? this.searchBy.assessmentType1
      : '';

    if (this.searchBy.status !== null) {
      this.searchBy.text = this.searchBy.status.name;
    } else {
      this.searchBy.text = null;
    }
    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.projectProxy
        .getActiveClimateActionList(
          pageNumber,
          this.rows,
          filtertext,
          projectApprovalStatusId,
          statusId,
          this.asseStatus,
          this.sectorId,
          asseType,
          '1234',
        )
        .subscribe((a) => {
          this.climateactions = a.items;
          this.totalRecords = a.meta.totalItems;

          this.climateactions.map((o) => {
            const filter1: string[] = [];
            filter1.push('project.id||$eq||' + o.id);
            this.serviceProxy
              .getManyBaseAssessmentControllerAssessment(
                undefined,
                undefined,
                filter1,
                undefined,
                undefined,
                undefined,
                1000,
                0,
                0,
                0,
              )
              .subscribe((res) => {
                o.assessments = res.data;
              });
          });
        });
    }, 1);
  };
}

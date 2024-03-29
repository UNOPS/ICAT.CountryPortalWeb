import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';

import {
  AssessmentControllerServiceProxy,
  Assessment,
  AssessmentYear,
  Project,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-all-result',
  templateUrl: './all-result.component.html',
  styleUrls: ['./all-result.component.css'],
})
export class AllResultComponent implements OnInit, AfterViewInit {
  assessments: Assessment[];
  assessmentList: Assessment[] = [];
  project: any = [];
  searchText: string;
  assessmentStage = 'CA-Asse';
  isProposal = 1;

  countryId = 0;
  sectorId = 0;

  projects: Project[] = [];
  assignCAArray: any[] = [];

  loading: boolean;
  spin: boolean = false;  
  totalRecords = 0;
  itemsPerPage = 0;
  rows = 10;
  last: number;
  event: any;
  selectedProject: Assessment;
  dataCollectionModuleStatus: number;
  dataCollectionGhgModuleStatus: number;
  searchBy: any = {
    text: null,
    assessmentType1: null,
    climateActionName1: null,
  };

  asseType: string[] = [];
  count = 0;

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  @ViewChild('op') overlay: any;
  first = 0;
  paramsObject: any = {};

  toMacDetails(assessments: Assessment) {
    this.router.navigate(['/mac-result'], {
      queryParams: { id: assessments.id },
    }).then(()=>{
      window.location.reload();
    }); 
  }

  toDetails(assessments: Assessment, assYr: AssessmentYear) {
    this.router.navigate(['/result'], {
      queryParams: { id: assessments.id, yr: assYr.assessmentYear },
    }).then(()=>{
      window.location.reload();
    }); 
  }

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private AssessmentProxy: AssessmentControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  handleChange(event: any) {
    if (event.index == 1) {
      this.searchBy.text = '';
      this.searchBy.assessmentType1 = '';
      this.searchBy.climateActionName1 = '';

      this.setActive();
    } else {
      this.searchBy.text = '';
      this.searchBy.assessmentType1 = '';
      this.searchBy.climateActionName1 = '';
      this.setPropose();
    }
  }

  setPropose() {
    this.isProposal = 1;
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  setActive() {
    this.isProposal = 0;
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  onStatusChange(event: any) {
    this.onSearch();
  }

  ngOnInit(): void {
    this.spin = true
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    const model: number[] = [];
    this.dataCollectionModuleStatus = tokenPayload.moduleLevels[3];
    this.dataCollectionGhgModuleStatus = tokenPayload.moduleLevels[4];

    if (this.dataCollectionGhgModuleStatus) {
      this.asseType = ['Ex-ante', 'Ex-post'];
    } else {
      this.asseType = ['MAC', 'Ex-ante', 'Ex-post'];
    }
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.spin = true;
    this.totalRecords = 0;

    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    const assmntType = this.searchBy.assessmentType1
      ? this.searchBy.assessmentType1
      : '';
    const ctAction = this.searchBy.climateActionName1
      ? this.searchBy.climateActionName1.climateActionName
      : '';

    const id = 0;

    setTimeout(() => {
      this.AssessmentProxy.getAssessmentDetailsForResult(
        pageNumber,
        this.rows,
        filtertext,
        assmntType,
        this.isProposal,
        id,
        ctAction,
      ).subscribe((a: any) => {
        this.assessments = a.items;
        this.totalRecords = a.meta.totalItems;
        this.loading = false;
        this.itemsPerPage = a.meta.itemsPerPage
        this.spin = false;
      });
    }, 1);
  };
}

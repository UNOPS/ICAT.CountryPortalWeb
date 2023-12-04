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
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-proposed-result',
  templateUrl: './proposed-result.component.html',
  styleUrls: ['./proposed-result.component.css'],
})
export class ProposedResultComponent implements OnInit, AfterViewInit {
  assessments: Assessment[] = [];
  assessmentList: Assessment[] = [];
  project: any = [];
  searchText: string;
  assessmentStage = 'PRO-Asse';
  isProposal = 1;
  climateActionName: string;

  countryId = 0;
  sectorId = 0;

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;
  selectedProject: Assessment;
  searchBy: any = {
    text: null,
    assessmentType1: null,
  };

  asseType = ['MAC', 'Ex-ante', 'Ex-post'];

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  @ViewChild('op') overlay: any;
  first = 0;
  paramsObject: any = {};

  onRowSelect(event: any) {
    this.selectedProject = event;
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

  onStatusChange(event: any) {
    this.onSearch();
  }

  toDetails(assessments: Assessment) {
    this.router.navigate(['/result'], {
      queryParams: {
        id: assessments.id,
        yr: assessments.assessmentYear[0]?.assessmentYear,
      },
    }).then(()=>{
      window.location.reload();
    });  
  }

  toMacDetails(assessments: Assessment) {
    this.router.navigate(['/mac-result'],{
      queryParams: { id: assessments.id },      
    }).then(()=>{
      window.location.reload();
    });    
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
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

    const event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const pageNumber =
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
    setTimeout(() => {
      this.AssessmentProxy.getAssmentDetails(
        pageNumber,
        this.rows,
        filtertext,
        assmntType,
        this.isProposal,
        this.paramsObject.params.id,
        ctAction,
      ).subscribe((a) => {
        this.assessments = a.items;
        this.climateActionName = this.assessments[0]?.project.climateActionName;
        this.totalRecords = a.meta.totalItems;
        this.loading = false;
      });
    }, 1);
  };
}

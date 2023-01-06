import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
// import { strictEqual } from 'assert';
import decode from 'jwt-decode';
import {
  DefaultValueControllerServiceProxy,
  MitigationActionType,
  Project,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-manage-default-values',
  templateUrl: './manage-default-values.component.html',
  styleUrls: ['./manage-default-values.component.css'],
})
export class ManageDefaultValuesComponent implements OnInit {
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
  confirm1: boolean = false;
  // sectorList: string[] = new Array();
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  mitigationActionList: MitigationActionType[] = [];

  selectedSectorType: Sector;
  selectedMitigationType: MitigationActionType;
  selectedstatustype: ProjectStatus;
  searchText: string;
  userCountryId:number;
  loading: boolean;
  totalRecords: number = 0;
  itemsPerPage: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    source: null,
    year: null,
    status: null,
    editedOn: null,
  };

  first = 0;

  cities: { name: string; id: number }[] = [
    { name: 'test', id: 1 },
    { name: 'test 2', id: 2 },
  ];

  // migrationActionList: string[] = new Array();
  statusList: string[] = new Array();
  // migrationAction: any;

  // products: { code: string; name: string }[] = [
  //   { code: 'test A', name: 'test 2' },
  //   { code: 'test B', name: 'test 3' },
  //   { code: 'test C', name: 'test 4' },
  // ];
  defaulValList:any[] = [];
  initdefaulValList:any[] = [];
  sourceList:any[] = [];
  yearsList:any[] = [];
  dropDownStatusList:any[] = ['Pending','Available'];
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private defaultProxy: DefaultValueControllerServiceProxy,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;


    this.serviceProxy
    .getManyBaseDefaultValueControllerDefaultValue(
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
      this.initdefaulValList = res.data;
      console.log('this.initdefaulValList....s', res.data);

      for(let item of this.initdefaulValList)
      {
        if (item.source !== null) this.sourceList.push(item.source);
        if (item.year !== null) this.yearsList.push(item.year);
      }
      this.sourceList = [...new Set(this.sourceList)];
      this.yearsList = [...new Set(this.yearsList)];
      console.log('this.yearsList....s', this.yearsList);
    });







  }

  
  onStatusChange(event: any) {
    this.onSearch();
 }
 

 ontextSearch()
 {
  this.onSearch();
 }





  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  // /////////////////////////////////////////////

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let source = this.searchBy.source ? this.searchBy.source : '';
    let year = this.searchBy.year ? this.searchBy.year : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let stats = this.searchBy.status ? this.searchBy.status : '';


    let mitTypeId = this.searchBy.mitigationAction
      ? this.searchBy.mitigationAction.id
      : 0;

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.defaultProxy.getDefaultvalueInfo(
        pageNumber, 
        this.rows, 
        filtertext,
        source,
        year,
        stats,
      ).subscribe(
        (res) => {
          console.log(res)
          this.defaulValList = res.items;
          console.log('this.defaulValList..',this.defaulValList)
          this.totalRecords = res.meta.totalItems;
          this.loading = false;
          this.itemsPerPage = res.meta.itemsPerPage;
        }
      );


    }, 1000);
  };
  // let name = this.searchBy.name ? this.searchBy.name : "";
  // let formulatonInstitute = this.searchBy.formulationinstitution ? this.searchBy.formulationinstitution : "";

  // let instutionId = this.searchBy.institution ? this.searchBy.institution.id : 0;
  // let searcSector = this.searchBy.sector ? this.searchBy.sector.id : 0;
  // let ccdCatagary = this.searchBy.climateChangeDataCategory ? this.searchBy.climateChangeDataCategory.id : 0;

  // let pageNumber = event.first === 0 ? 1 : 1;
  // let pagePerRow = event.rows;
  // let isApprove = this.searchApproveType ? this.searchApproveType.id : -1;

  // console.log(this.searchApproveType);
  // console.log(isApprove);

  // this.policyService.getPolicyList(pageNumber, pagePerRow, name, searcSector, ccdCatagary, instutionId, formulatonInstitute, isApprove).subscribe(res => {
  //   this.policyList = res.items;
  //   this.totalRecords = res.meta.totalItems;
  //   this.loading = false;

  // this.serviceProxy
  // .getManyBaseProjectControllerProject(
  //   pageNumber,

  // )

  // }
  // );
  // }

  // let filters = this.getSearchFilter();

  // this.serviceProxy
  //   .getManyBasePolicyControllerPolicy(
  //     undefined,
  //     undefined,
  //     filters.length > 0 ? filters : undefined,
  //     undefined,
  //     ["name,ASC"],
  //     undefined,
  //     event.rows,
  //     event.first,
  //     0,
  //     0
  //   )
  //   .subscribe((res) => {
  //     if (res && res.data && res.data.length > 0) {
  //       this.totalRecords = res.total;
  //       this.policyList = res.data;
  //     }

  //     this.loading = false;
  //   });

  ////////////////////////////////////////

  addproject() {
    this.router.navigate(['/propose-project']);
  }

  // applyFilterGlobal($event, stringVal) {
  //   this.dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }

  detail() {
    this.router.navigate(['/project-information']);
  }

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
    return this.climateactions
      ? this.first === this.climateactions.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.climateactions ? this.first === 0 : true;
  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    // this.onClimateActionStatusChange(a);
  }

  removeFromString(arr: string[], str: string) {
    let escapedArr = arr.map((v) => escape(v));
    let regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi'
    );
    return str.replace(regex, '');
  }

  toForm()
  {
    this.router.navigate(['app-manage-default-values-form'], {
      // queryParams: {
       
      //  // verificationStatus: object.verificationStatus,
      // },
    });
  }


}

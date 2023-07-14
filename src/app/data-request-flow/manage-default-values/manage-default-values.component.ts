import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import decode from 'jwt-decode';
import {
  DefaultValueControllerServiceProxy,
  MitigationActionType,
  Project,
  ProjectControllerServiceProxy,
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
  confirm1 = false;
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  mitigationActionList: MitigationActionType[] = [];

  selectedSectorType: Sector;
  selectedMitigationType: MitigationActionType;
  selectedstatustype: ProjectStatus;
  searchText: string;
  userCountryId: number;
  loading: boolean;
  totalRecords = 0;
  itemsPerPage = 0;
  rows = 10;
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

  statusList: string[] = [];

  defaulValList: any[] = [];
  initdefaulValList: any[] = [];
  sourceList: any[] = [];
  yearsList: any[] = [];
  dropDownStatusList: any[] = ['Pending', 'Available'];
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private defaultProxy: DefaultValueControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;

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
        0,
      )
      .subscribe((res: any) => {
        this.initdefaulValList = res.data;

        for (const item of this.initdefaulValList) {
          if (item.source !== null) this.sourceList.push(item.source);
          if (item.year !== null) this.yearsList.push(item.year);
        }
        this.sourceList = [...new Set(this.sourceList)];
        this.yearsList = [...new Set(this.yearsList)];
      });
  }

  onStatusChange(event: any) {
    this.onSearch();
  }

  ontextSearch() {
    this.onSearch();
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

    const source = this.searchBy.source ? this.searchBy.source : '';
    const year = this.searchBy.year ? this.searchBy.year : '';
    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const stats = this.searchBy.status ? this.searchBy.status : '';

    const mitTypeId = this.searchBy.mitigationAction
      ? this.searchBy.mitigationAction.id
      : 0;

    const editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.defaultProxy
        .getDefaultvalueInfo(
          pageNumber,
          this.rows,
          filtertext,
          source,
          year,
          stats,
        )
        .subscribe((res) => {
          this.defaulValList = res.items;

          this.totalRecords = res.meta.totalItems;
          this.loading = false;
          this.itemsPerPage = res.meta.itemsPerPage;
        });
    }, 1000);
  };

  addproject() {
    this.router.navigate(['/propose-project']);
  }

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
    const a: any = {};
    a.rows = this.rows;
    a.first = 0;
  }

  removeFromString(arr: string[], str: string) {
    const escapedArr = arr.map((v) => escape(v));
    const regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi',
    );
    return str.replace(regex, '');
  }

  toForm() {
    this.router.navigate(['app-manage-default-values-form'], {});
  }
}

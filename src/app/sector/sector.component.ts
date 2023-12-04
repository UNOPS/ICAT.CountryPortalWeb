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
  ProjectControllerServiceProxy,
  Sector,
  SectorControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css'],
})
export class SectorComponent implements OnInit, AfterViewInit {
  sectorsList: Sector[] = [];

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

  @ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
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
    setTimeout(() => {
      this.sectorProxy
        .getSectorDetails(pageNumber, this.rows, filtertext)
        .subscribe((a) => {
          this.sectorsList = a.items;
          this.totalRecords = a.items.length;
          this.loading = false;
        });
    });
  };

  toAddSector() {
    this.router.navigate(['add-sectors']);
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  getSubSectors = (skills: any): string =>
    skills.map(({ name }: { name: any }) => name).join(', ');
}

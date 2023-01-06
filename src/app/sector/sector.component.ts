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
  SectorControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit,AfterViewInit {

sectorsList: Sector[] = [];

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

  @ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

/*
    let pageNumber = 1;
    let filtertext ='';
    this.sectorProxy
    .getSectorDetails(pageNumber, this.rows, filtertext)
    .subscribe((a) => {
      this.sectorsList = a.items;
      this.totalRecords = a.meta.totalItems;
      this.loading = false;
     console.log('second time climation',this.sectorsList);
      //console.log('my staus...',this.climateaction.projectApprovalStatus?.name);
    });
    */
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);

  }


  loadgridData = (event: LazyLoadEvent) => {
    //console.log("below loarding data")
    this.loading = true;
    this.totalRecords = 0;
    
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
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
          console.log('this.sectorsList',this.sectorsList);
          //console.log('my staus...',this.climateaction.projectApprovalStatus?.name);
        });
    });
  };

  toAddSector()
  {
    this.router.navigate(['add-sectors']); 

  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
  }

  getSubSectors = (skills: any): string => skills.map(({name}:{name:any}) => name).join(', ');
 

}

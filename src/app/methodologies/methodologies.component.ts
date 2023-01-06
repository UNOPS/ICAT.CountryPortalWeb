import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Methodology, MethodologyControllerServiceProxy, ServiceProxy,  } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-methodologies',
  templateUrl: './methodologies.component.html',
  styleUrls: ['./methodologies.component.css']
})
export class MethodologiesComponent implements OnInit,AfterViewInit {

  methodologies:Methodology[];
  searchText: string;
  countryId:any=1;

  

  loading: boolean;
  totalRecords: number = 0;
  itemsPerPage: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    version: null,
    developedBy: null,
    applicablesector: null,
  };

  first = 0;


  constructor( private serviceProxy: ServiceProxy,
    private methodologyProxy: MethodologyControllerServiceProxy,
    private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild("dt") table: Table;

  ngOnInit(): void {
    this.onSearch() ;
    // var filter: any = ['isActive||$eq||' + 1];
    // this.serviceProxy
    // .getManyBaseMethodologyControllerMethodology(
    //   undefined,
    //   undefined,
    //   filter,
    //   undefined,
    //   ['version,ASC'],
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0
    // ).subscribe((res: any) => {
    //   this.methodologies = res.data;
    //   this.totalRecords = res.totalRecords;
    //   console.log('this.methodologies',this.methodologies)
    //   if(res.totalRecords !== null){
    //     this.last = res.count;
    //   }else{
    //     this.last =0;
    //   }
    // });
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
   

  }

  
 

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  onRedirect(meth: Methodology) {

    let docPath = meth?.documents;
   // console.log("docPath11...",docPath)
    console.log("docPath...", docPath)

    window.location.href = docPath;

    // this.object_array[0][8].document;



  }

  loadgridData = (event: LazyLoadEvent) => {
    console.log(event);
    this.loading = true;
    this.totalRecords = 0;

    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.methodologyProxy
      .getMethoDetails(
        pageNumber,
        this.rows,
        filtertext
      ).subscribe((a) => {
        
          this.methodologies = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
          this.itemsPerPage = a.meta.itemsPerPage;
        console.log('kkkk',this.methodologies)
         
        
        });
    }, 1);
  };
  
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
    return this.methodologies
      ? this.first === this.methodologies.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.methodologies ? this.first === 0 : true;
  }
  

}

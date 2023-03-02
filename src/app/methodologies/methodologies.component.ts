import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import {
  Methodology,
  MethodologyControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-methodologies',
  templateUrl: './methodologies.component.html',
  styleUrls: ['./methodologies.component.css'],
})
export class MethodologiesComponent implements OnInit, AfterViewInit {
  methodologies: Methodology[];
  searchText: string;
  countryId: any = 1;

  loading: boolean;
  totalRecords = 0;
  itemsPerPage = 0;
  rows = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    version: null,
    developedBy: null,
    applicablesector: null,
  };

  first = 0;

  constructor(
    private serviceProxy: ServiceProxy,
    private methodologyProxy: MethodologyControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild('dt') table: Table;

  ngOnInit(): void {
    this.onSearch();
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  onRedirect(meth: Methodology) {
    const docPath = meth?.documents;

    window.location.href = docPath;
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
      this.methodologyProxy
        .getMethoDetails(pageNumber, this.rows, filtertext)
        .subscribe((a) => {
          this.methodologies = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
          this.itemsPerPage = a.meta.itemsPerPage;
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

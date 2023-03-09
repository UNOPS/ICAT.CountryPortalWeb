import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import {
  Institution,
  InstitutionControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.css'],
})
export class InstitutionListComponent implements OnInit {
  institutions: Institution[];

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;
  status: number[] = [0, -10];

  userId = 1;

  searchBy: any = {
    text: null,
    type: null,
    category: null,
    address: null,
    admin: null,
    status: null,
  };

  first = 0;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private institutionProxy: InstitutionControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const event: any = {};
    this.loadgridData(event);
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

    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.institutionProxy
        .getInstiDetails(pageNumber, this.rows, filtertext, this.userId)
        .subscribe((a) => {
          this.institutions = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        });
    }, 100);
  };

  addInstitution() {
    this.router.navigate(['/institution']);
  }

  viewInstitution(institutions: Institution) {
    this.router.navigate(['/view-institution'], {
      queryParams: { id: institutions.id },
    });
  }
}

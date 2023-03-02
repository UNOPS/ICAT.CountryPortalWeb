import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import {
  Audit,
  AuditControllerServiceProxy,
  ServiceProxy,
  User,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
})
export class AuditComponent implements OnInit {
  loading: boolean;
  totalRecords = 0;
  itemsPerPage = 0;
  rows = 10;
  last: number;
  event: any;
  Date = new Date();
  status: string[] = [];
  activitie: any[] = [];
  searchText: string;
  activityList1: string[] = [];
  activityList: string[] = [];
  userTypeList: string[] = [];
  searchBy: any = {
    text: null,
    usertype: null,
    activity: null,
    editedOn: null,
  };

  loggedUser: User;
  insitutionId: number;

  first = 0;
  activities: Audit[];
  dateList: Date[] = [];

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private auditproxy: AuditControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  onactivityChange(event: any) {
    this.onSearch();
  }
  ondateChange(event: any) {
    this.onSearch();
  }
  onUTChange(event: any) {
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

    const usertype = this.searchBy.usertype ? this.searchBy.usertype : '';
    const action = this.searchBy.activity ? this.searchBy.activity : '';
    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    const editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.auditproxy
        .getAuditDetails(
          pageNumber,
          this.rows,
          usertype,
          action,
          editedOn,
          filtertext,
        )
        .subscribe((a) => {
          this.activities = a.items;

          for (const d of a.items) {
            this.activityList.push(d.action);
            if (!this.userTypeList.includes(d.userType)) {
              this.userTypeList.push(d.userType);
            }
            if (!this.status.includes(d.actionStatus)) {
              this.status.push(d.actionStatus);
            }
          }

          this.totalRecords = a.meta.totalItems;
          this.itemsPerPage = a.meta.itemsPerPage;
          this.loading = false;
        });
    }, 1000);
  };
}

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
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
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
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // this.serviceProxy
    //   .getManyBaseAuditControllerAudit(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
   
    let userName = localStorage.getItem('user_name')!;

    let filter1: string[] = [];
    filter1.push('username||$eq||' + userName);
    // lmFilter.push('LearningMaterial.isPublish||$eq||' + 1);

    // this.serviceProxy
    //   .getManyBaseUsersControllerUser(
    //     undefined,
    //     undefined,
    //     filter1,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {   


    //   this.loggedUser = res.data[0];

      
    //   this.insitutionId = this.loggedUser.institution.id
    //   });


    // this.serviceProxy
    //   .getManyBaseAuditControllerAudit(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    this.auditproxy
    .getAuditDetails(
      1,
      this.rows,
      '',
      '',
      '',
      ''
    )
      .subscribe((res) => {


        this.activities = res.items;
        console.log('this.activities',this.activities)
        
        // this.totalRecords = res.totalRecords;
        // if (res.totalRecords !== null) {
        //   this.last = res.count;
        // } else {
        //   this.last = 0;
        // }
        for (let d of res.items) {
          this.activityList.push(d.action);
          // this.dateList.push(d.editedOn.toDate());
          this.userTypeList.push(d.userType);
          console.log(this.dateList);
        }
        console.log('activities', this.activityList);
      });
  }

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
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let usertype = this.searchBy.usertype ? this.searchBy.usertype : '';
    let action = this.searchBy.activity ? this.searchBy.activity : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    console.log(
      moment(this.searchBy.editedOn).format('YYYY-MM-DD'),
      'jjjjjjjjjjjjjjjj'
    );
    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
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
          filtertext
        )
        .subscribe((a) => {
          this.activities = a.items;

          console.log(a, 'kk');
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        });
    }, 1000);
  };
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Institution,
  ServiceProxy,
  User,
  UsersControllerServiceProxy,
  UserType,
} from 'shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  rows = 10;

  loading: boolean;

  customers: User[];

  totalRecords: number;
  itemsPerPage = 0;
  userTypeSliceArray: any = [];

  searchText = '';
  searchEmailText: string;
  searchLastText: string;

  instuitutionList: Institution[];
  selctedInstuitution: Institution;

  userTypes: UserType[] = [];
  selctedUserType: UserType;

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    private serviceProxy: ServiceProxy,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userControllerService: UsersControllerServiceProxy,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.instuitutionList = res.data;
      });

    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        1,
        0
      )
      .subscribe((res) => {
        this.userTypes = res.data;
        this.userTypes = this.userTypes.filter((e) => e.id != 1)
      });
  }



  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadCustomers(event);
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;

    let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    let filterText = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber =
      event.first === 0 || event.first == undefined
        ? 1
        : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;
    setTimeout(() => {
      this.userControllerService
        .allUserDetails(pageNumber, this.rows, filterText, typeId)
        .subscribe((a) => {
          this.customers = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
          this.itemsPerPage = a.meta.itemsPerPage;
        });
    }, 1);
  }
  editUser(user: User) {

    this.router.navigate(['/user'], { queryParams: { id: user.id } });
  }

  viewUser(user: User) {
    this.router.navigate(['/view-user'], { queryParams: { id: user.id } });
  }

  EditUser(user: User) {
    this.router.navigate(['/user'], { queryParams: { id: user.id } });
  }

  new() {
    this.router.navigate(['/user-new']);
  }

  onTypeChange(event: any) {
    this.searchBy.userType = event;

    this.onSearch();
  }
}

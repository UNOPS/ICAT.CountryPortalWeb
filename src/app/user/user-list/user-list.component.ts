import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Institution,
  ServiceProxy,
  User,
  UsersControllerServiceProxy,
  UserType,
} from 'shared/service-proxies/service-proxies';
import { TableModule } from 'primeng/table';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  rows: number = 10;

  loading: boolean;

  customers: User[];

  totalRecords: number;
  userTypeSliceArray: any = [];

  searchText: string = '';
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
    private userControllerService: UsersControllerServiceProxy
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // this.serviceProxy.getManyBaseUserv2ControllerUser([],"{}",[],[],[],[],10,0,1,0).subscribe (res=> {
    //     console.log(res);
    //     this.customers = res.data;
    // } );

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
        0
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
       //console.log("my user types..",this.userTypes)
      });
  }

  // getFilter() {
  //   let filters: string[] = [];

  //   if (this.searchText && this.searchText.length > 0) {
  //     filters.push('firstName||$cont||' + this.searchText);
  //   }

  //   if (this.selctedInstuitution) {
  //     let filter = 'institution.id||$eq||' + this.selctedInstuitution.id;
  //     filters.push(filter);
  //   }

  //   return filters;
  // }
  // getFilterand() {
  //   let filters: string[] = [];

  //   if (this.searchText && this.searchText.length > 0) {
  //     filters.push('firstName||$cont||' + this.searchText);
  //   }

  //   if (this.searchLastText && this.searchLastText.length > 0) {
  //     filters.push('lastName||$cont||' + this.searchLastText);
  //   }

  //   if (this.searchEmailText && this.searchEmailText.length > 0) {
  //     filters.push('email||$cont||' + this.searchEmailText);
  //   }

  //   if (this.selctedUserType) {
  //     filters.push('userType.Id||$cont||' + this.selctedUserType.id);
  //   }

  //   if (this.selctedInstuitution) {
  //     let filter = 'institution.Id||$eq||' + this.selctedInstuitution.id;
  //     filters.push(filter);
  //   }

  //   console.log(filters);

  //   return filters;
  // }

  // getFilterOr() {
  //   let filters: string[] = [];

  //   // if (this.searchText && this.searchText.length > 0) {
  //   //   filters.push('email||$cont||' + this.searchText);
  //   //   filters.push('lastName||$cont||' + this.searchText);
  //   //   filters.push('firstName||$cont||' + this.searchText);
  //   // }

  //   // console.log(filters);

  //   return filters;
  // }

  // searchGain() {
  //   let a: any = {};
  //   a.rows = this.rows;
  //   a.first = 0;

  //   this.loadCustomers(a);
  // }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadCustomers(event);
  }

  loadCustomers(event: LazyLoadEvent) {
    console.log('loadCustomers===', event);
    this.loading = true;

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // this.serviceProxy
    //   .getManyBaseUsersControllerUser(
    //     undefined,
    //     undefined,
    //     this.getFilterand(),
    //     this.getFilterOr(),
    //     ['firstName,ASC'],
    //     ['institution'],
    //     event.rows,
    //     event.first,
    //     0,
    //     0
    //   )
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.totalRecords = res.total;
    //     this.customers = res.data;
    //     console.log('users....',this.customers)
    //     this.loading = false;
    //   });

    this.totalRecords = 0;

    let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    console.log('eventby filter...', this.searchBy.userType);
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
          console.log('new cutomersss', a);
          console.log('total..', this.totalRecords);
        });
    },1);
  }

  // onKeydown(event: any) {
  //   if (event.key === 'Enter') {
  //     console.log(event);
  //     this.searchGain();
  //   }
  // }

  editUser(user: User) {
    console.log('edit user', user);

    this.router.navigate(['/user'], { queryParams: { id: user.id } });
  }

  viewUser(user: User) {
    console.log('hit');
    this.router.navigate(['/view-user'], { queryParams: { id: user.id } });
  }

  EditUser(user: User) {
    console.log('hit');
    this.router.navigate(['/user'], { queryParams: { id: user.id } });
  }

  new() {
    this.router.navigate(['/user-new']);
  }

  onTypeChange(event: any) {
    this.searchBy.userType = event;
    console.log('selesct from drop down...', this.searchBy.userType1);
    //console.log('loading.....');
    this.onSearch();
    //console.log('resualt.....', event);
  }
}

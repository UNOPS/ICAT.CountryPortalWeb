import {
  ParameterHistoryControllerServiceProxy,
  UpdateDeadlineDto,
  User,
} from './../../../shared/service-proxies/service-proxies';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import decode from 'jwt-decode';
import {
  ParameterRequestControllerServiceProxy,
  Project,
  ProjectControllerServiceProxy,
  ServiceProxy,
  UsersControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assign-data-request',
  templateUrl: './assign-data-request.component.html',
  styleUrls: ['./assign-data-request.component.css'],
})
export class AssignDataRequestComponent implements OnInit, AfterViewInit {
  userList: User[];

  climateactions: Project[];
  assignCAArray: any[] = [];

  selectedAssignDataRequest: Project[];
  selectedParameters: any[];
  selectedUser: any;
  climateaction: Project = new Project();
  assignDataRequestList: any[];
  selectedDeadline: Date;
  minDate: Date;
  confirm1 = false;
  userName: string;

  searchText: string;

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    climateAction: null,
  };

  first = 0;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory = false;
  climateActionListFromBackend: any[] = [];
  userCountryId = 0;
  userSectorId = 0;
  climateactionsList: any[] = [];
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private messageService: MessageService,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private climateProxy: ProjectControllerServiceProxy,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.userName = localStorage.getItem('user_name')!;
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    this.climateActionListFromBackend = await this.parameterProxy
      .getClimateActionByDataRequestStatus()
      .toPromise();

    const filter2: string[] = [];

    filter2.push('projectApprovalStatus.id||$eq||' + 5);

    this.parameterProxy
      .getAssignDateRequest(0, 0, '', 0, this.userName, '1234')
      .subscribe((res) => {
        for (const a of res.items) {
          if (a.parameterId.Assessment !== null) {
            if (
              !this.assignCAArray.includes(
                a.parameterId.Assessment.Prject.climateActionName,
              )
            ) {
              this.assignCAArray.push(
                a.parameterId.Assessment.Prject.climateActionName,
              );
              this.climateactionsList.push(a.parameterId.Assessment.Prject);
            }
          }
        }
      });

    this.usersControllerServiceProxy
      .usersByInstitution(1, 1000, '', 9, this.userName)
      .subscribe((res: any) => {
        this.userList = res.items;
      });
  }

  onCAChange(event: any) {
    this.onSearch();
  }

  onAssignClick() {
    if (this.selectedParameters.length > 0) {
      this.confirm1 = true;
    }
  }

  onSearchClick(event: any) {
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

    const climateActionId = this.searchBy.climateAction
      ? this.searchBy.climateAction.id
      : 0;

    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.parameterProxy
        .getAssignDateRequest(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          this.userName,
          '1234',
        )
        .subscribe((a) => {
          if (a) {
            this.assignDataRequestList = a.items;
            this.totalRecords = a.meta.totalItems;
          }
          this.loading = false;
        });
    }, 1);
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

  getInfo(obj: any) {
    this.paraId = obj.parameterId.id;

    this.prHistoryProxy.getHistroyByid(this.paraId).subscribe((res) => {
      this.requestHistoryList = res;
    });

    this.displayHistory = true;
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
  onClickSave(status: number) {
    const userId: number = this.selectedUser ? this.selectedUser.id : 0;
    const idList = new Array<number>();
    if (userId > 0 && this.selectedParameters.length > 0) {
      for (let index = 0; index < this.selectedParameters.length; index++) {
        const element = this.selectedParameters[index];
        idList.push(element.id);
      }

      const inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.userId = userId;
      inputParameters.status = status;
      inputParameters.deadline = moment(this.selectedDeadline);

      this.parameterProxy.updateDeadlineDataEntry(inputParameters).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              status == 3
                ? 'A Data Entry Operator is saved successfully'
                : 'A Data Entry Operator is assigned successfully',
          });
          this.selectedParameters = [];
          this.onSearch();
          this.confirm1 = false;
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
          });
        },
      );
    }
  }
}

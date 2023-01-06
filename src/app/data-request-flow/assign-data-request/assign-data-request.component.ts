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
// import { strictEqual } from 'assert';
import {
  MitigationActionType,
  ParameterRequestControllerServiceProxy,
  Project,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
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
  confirm1: boolean = false;
  userName: string;

  searchText: string;

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    climateAction: null,
  };

  first = 0;
  paraId:number;
  requestHistoryList: any[] = [];
  displayHistory:boolean = false;
  climateActionListFromBackend:any[]=[];
  userCountryId:number = 0;
  userSectorId:number = 0;
  climateactionsList:any[] = [];
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private messageService: MessageService,
    private prHistoryProxy : ParameterHistoryControllerServiceProxy,
    private climateProxy:ProjectControllerServiceProxy
    
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    // this.totalRecords = 0;
    this.userName = localStorage.getItem('user_name')!;
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

   // let res2:any;
    this.climateActionListFromBackend = await this.parameterProxy.getClimateActionByDataRequestStatus().toPromise();
    //console.log("ca from backend...",res2)
      //this.assessmentList = res2;
    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
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
    //   .subscribe((res: any) => {
    //     this.climateactions = res.data;
    //     this.totalRecords = res.totalRecords;
    //     if (res.totalRecords !== null) {
    //       this.last = res.count;
    //     } else {
    //       this.last = 0;
    //     }

    //     console.log('climateactions', res.data);
    //   });

    let filter2: string[] = new Array();

    filter2.push('projectApprovalStatus.id||$eq||' + 5);

    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     filter2,
    //     undefined,
    //     undefined,
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
      // this.climateProxy.getProjectsForCountrySectorInstitution(1,10000,0,[],0,0)
      // .subscribe((res: any) => {
      
        
      //   this.climateactions = res.items;
      //   // console.log("country....", this.climateactions);
      //   // this.climateactionsList = this.climateactions.filter((o)=>o.country.id == this.userCountryId);
      //   // this.climateactions = this.climateActionListFromBackend;
      //   console.log('my list....s', res.data);
      // });
      this.parameterProxy
      .getAssignDateRequest(
        0,
        0,
        '',
        0,
        this.userName,
        "1234"
      )
      .subscribe((res) => {
       
        for(let a of res.items){
          // console.log("test countrya",a)
          
          if (a.parameterId.Assessment !== null) {
            if (
              !this.assignCAArray.includes(
                a.parameterId.Assessment.Prject
                  .climateActionName
              )
            ) {
             
              this.assignCAArray.push(
                a.parameterId.Assessment.Prject
                  .climateActionName
              );
              this.climateactionsList.push(
               a.parameterId.Assessment.Prject
              );
            }
          }
        
          
          
        }
       
      });



    this.usersControllerServiceProxy
      .usersByInstitution(1, 1000, '', 9, this.userName)
      .subscribe((res: any) => {
        this.userList = res.items;
        // this.totalRecords = res.itemCount;

        console.log('this.userList', this.userList);
      });
  }

  onCAChange(event: any) {
    console.log('selectedUser', this.selectedUser);

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
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  // /////////////////////////////////////////////

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let climateActionId = this.searchBy.climateAction
      ? this.searchBy.climateAction.id
      : 0;

    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      console.log('climateActionId', climateActionId);

      this.parameterProxy
        .getAssignDateRequest(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          this.userName,
          "1234"
        )
        .subscribe((a) => {
          console.log('aa', a);
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

  // applyFilterGlobal($event, stringVal) {
  //   this.dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }

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


  getInfo(obj: any)
  {
       console.log("dataRequestList...",obj)
       this.paraId = obj.parameterId.id;
       console.log("this.paraId...",this.paraId)

      // let x = 602;
       this.prHistoryProxy
       .getHistroyByid(this.paraId)  // this.paraId
       .subscribe((res) => {
         
        this.requestHistoryList =res;
         
       console.log('this.requestHistoryList...', this.requestHistoryList);
       
       });
      //  let filter1: string[] = [];
      //  filter1.push('parameter.id||$eq||' + this.paraId);
      //  this.serviceProxy
      //  .getManyBaseParameterRequestControllerParameterRequest(
      //    undefined,
      //    undefined,
      //    filter1,
      //    undefined,
      //    undefined,
      //    undefined,
      //    1000,
      //    0,
      //    0,
      //    0
      //  )
      //  .subscribe((res: any) => {
      //    this.requestHistoryList =res.data;
         
      //    console.log('this.requestHistoryList...', this.requestHistoryList);
      //  });

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
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    // this.onClimateActionStatusChange(a);
  }

  removeFromString(arr: string[], str: string) {
    let escapedArr = arr.map((v) => escape(v));
    let regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi'
    );
    return str.replace(regex, '');
  }
  onClickSave(status: number) {
    let userId: number = this.selectedUser ? this.selectedUser.id : 0;
    let idList = new Array<number>();
    if (userId > 0 && this.selectedParameters.length > 0) {
      console.log('userId', userId);
      for (let index = 0; index < this.selectedParameters.length; index++) {
        const element = this.selectedParameters[index];
        idList.push(element.id);
      }

      let inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.userId = userId;
      inputParameters.status = status;
      inputParameters.deadline = moment(this.selectedDeadline);
      console.log('inputParameters', inputParameters);
      this.parameterProxy.updateDeadlineDataEntry(inputParameters).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: status==3?'A Data Entry Operator is saved successfully':'A Data Entry Operator is assigned successfully',
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
        }
      );
    }
  }
}

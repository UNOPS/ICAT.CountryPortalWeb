import {
  AssessmentYearControllerServiceProxy,
  Institution,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestControllerServiceProxy,
  Project,
  ServiceProxy,
  UpdateDeadlineDto,
  User,
  UsersControllerServiceProxy,
} from './../../../shared/service-proxies/service-proxies';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import decode from 'jwt-decode';
@Component({
  selector: 'app-review-data',
  templateUrl: './review-data.component.html',
  styleUrls: ['./review-data.component.css'],
})
export class ReviewDataComponent implements OnInit {
  userList: User[];
  selectedUser: User;
  climateactions: Project[];
  selectedClimateActions: Project[];
  climateaction: Project = new Project();
  relatedItems: Project[] = [];
  yearList: any[] = [];
  assessmentList: any[] = [];
  assessmentType: string[] = ['Ex-ante','Ex-post','MAC'];
  cols: any;
  columns: any;
  options: any;
  confirm1: boolean = false;
  dataRequestList: any[] = [];
  minDate: Date;
  // sectorList: string[] = new Array();
  //mitigationActionList: MitigationActionType[] = [];
  selectedParameters: any[];
  selectedDeadline: Date;
  reasonForReject: string;
  userName: string;

  searchText: string;

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  asseType = ['MAC', 'Ex-ante', 'Ex-post'];
  searchBy: any = {
    text: null,
    year: null,
    type: null,
    climateaction: null,
  };

  first = 0;
  paraId:number;
  requestHistoryList: any[] = [];
  displayHistory:boolean = false;
  climateActionListFromBackend:any[]=[];


  climateactionsList:any[]=[];
  assignCAArray: any[] = [];

  userCountryId:number = 0;
  userSectorId:number = 0;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private messageService: MessageService,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private prHistoryProxy : ParameterHistoryControllerServiceProxy,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

   async ngOnInit(): Promise<void> {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    // this.totalRecords = 0;
    this.minDate = new Date();

    this.userName = localStorage.getItem('user_name')!;
    this.climateActionListFromBackend =  await this.parameterProxy.getClimateActionByDataRequestStatusSix().toPromise();
   
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
    //   });
    let filter2: string[] = new Array();

    filter2.push('projectApprovalStatus.id||$eq||' + 5);
  
    //this may be unnessesary plx check later
    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        filter2,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.climateactions = res.data;
        // this.climateactionsList = this.climateactions.filter((o:any)=>o.country.id == this.userCountryId);
        this.climateactions = this.climateActionListFromBackend;
        // console.log('my list....s', this.climateactions);
      });

      this.parameterProxy
        .getReviewDataRequest(
          0,
          0,
          '',
          0,
          '',
          '',
          this.userName,
          "1234"
        )
      .subscribe((res: any) => {
        console.log('my list....s', res.items);
        for(let a of res.items){   
          if (a.parameter.Assessment !== null) {
         
         if (
           !this.assignCAArray.includes(
             a.parameter.Assessment.Prject
               .climateActionName
           )
         ) {
          
           this.assignCAArray.push(
             a.parameter.Assessment.Prject
               .climateActionName
           );
           this.climateactionsList.push(
            a.parameter.Assessment.Prject
           );
         }
       }}
      });





    // this.usersControllerServiceProxy
    //   .allUserDetails(1, 1000, '', 1)
    //   .subscribe((res: any) => {
    //     this.userList = res.items;
    //     this.totalRecords = res.totalRecords;
    //   });
    this.usersControllerServiceProxy
      .usersByInstitution(1, 1000, '', 9, this.userName)
      .subscribe((res: any) => {
        this.userList = res.items;
        // this.totalRecords = res.totalRecords;

        console.log('this.userList', this.userList);
      });
  }

  onCAChange(event: any) {
    console.log('searchby', this.searchBy);
    this.assessmentYearProxy
      .getAllByProjectId(this.searchBy.climateaction.id)
      .subscribe((res: any) => {
        this.yearList = res;
      });
    this.onSearch();
  }

  onYearChange(event: any) {
    this.onSearch();
  }

  

  onReject()
{
  this.confirm1 = false;
}
  onAcceptClick() {
    console.log('onAcceptClick');
    if (this.selectedParameters) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to accept all the selected parameters?',
        accept: () => {
          ////////Inside Accept////////
          console.log('Inside Accept');
          let idList = new Array<number>();
          for (let index = 0; index < this.selectedParameters.length; index++) {
            const element = this.selectedParameters[index];
            idList.push(element.id);
          }

          let inputParameters = new UpdateDeadlineDto();
          inputParameters.ids = idList;
          inputParameters.status = 9;
          console.log("inputParameters..",inputParameters)
          this.parameterProxy.acceptReviewData(inputParameters).subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data is reviewed successfully',
              });
              this.selectedParameters = [];
              this.onSearch();
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Internal server error, please try again.',
              });
            }
          );
          //////End Accept////////
        },
      });
    }
  }
  onRejectClick() {
    if (this.selectedParameters.length > 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error.',
        detail: 'Only one parameter can be rejected at a time!',
      });
      return;
    }

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

    let climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
      : 0;
    let institutionId = this.searchBy.institution
      ? this.searchBy.institution.id
      : 0;
    let year = this.searchBy.year ? this.searchBy.year.assessmentYear : '';
    let type = this.searchBy.type ? this.searchBy.type : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    console.log('searchBy', this.searchBy);
    setTimeout(() => {
      this.parameterProxy
        .getReviewDataRequest(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          year,
          type,
          this.userName,
          "1234"
        )
        .subscribe((a) => {
          console.log('aa', a);
          if (a) {
            this.dataRequestList = a.items;
            console.log("this.dataRequestList...",this.dataRequestList)
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

  getInfo(obj: any)
  {
       console.log("dataRequestList...",obj)
       this.paraId = obj.parameter.id;
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

  reset() {
    this.first = 0;
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

  onRejectConfirm(status: number) {
    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      idList.push(element.id);
    }

    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = idList;
    inputParameters.status = status;
    inputParameters.userId = this.selectedUser ? this.selectedUser.id : 0;
    inputParameters.comment = this.reasonForReject;
    inputParameters.deadline = moment(this.selectedDeadline);
    this.parameterProxy.rejectReviewData(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully rejected the data',
        });
        this.selectedParameters = [];
        this.onSearch();
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
    this.confirm1 = false;
  }
}

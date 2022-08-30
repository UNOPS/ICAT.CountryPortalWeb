import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  AssesmentControllerServiceProxy,
  Parameter,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestQaStatus,
  QualityCheckControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { QcHistoryComponent } from '../qc-history/qc-history.component';
import decode from 'jwt-decode';
@Component({
  selector: 'app-parameter-summary',
  templateUrl: './parameter-summary.component.html',
  styleUrls: ['./parameter-summary.component.css'],
})
export class ParameterSummaryComponent implements OnInit, OnDestroy {
  @Input()
  header: string;
  @Input()
  scenario: string | undefined;
  @Input()
  assessmentYearId: number;

  @Input()
  isDisable: boolean;

  @Input()
  parameters: Parameter[];

  @Input()
  baseImage: string;

  @Input()
  assessmentType: string;

  @Output() isReadyToCal = new EventEmitter<boolean>();

  loading: boolean = false;
  commentRequried: boolean = false;
  drComment: string;
  selectdParameter: Parameter;
  isApprove: boolean;
  ref: DynamicDialogRef;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory: boolean = false;
  @ViewChild('opDR') overlayDR: any;
  userId: string = '';
  filteredUser: any;
  fullUser: string;
  assessmentYear: any;
  //:boolean;

  constructor(
    private qaServiceProxy: QualityCheckControllerServiceProxy,
    private messageService: MessageService,
    public dialogService: DialogService,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private assesmentProxy: AssesmentControllerServiceProxy
  ) {}

  ngOnInit(): void {
    console.log('parameters....m', this.parameters);
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userId = tokenPayload.usr;
    console.log('tthis.userId..', this.userId);

    this.serviceProxy
      .getOneBaseAssessmentYearControllerAssessmentYear(
        this.assessmentYearId,
        undefined,
        undefined,
        undefined
      )
      .subscribe((res: any) => {
        this.assessmentYear = res;
        console.log('Asseyear...', this.assessmentYear);
      });

    let projfilter: string[] = new Array();
    projfilter.push('email||$eq||' + this.userId);

    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        projfilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.filteredUser = res.data;
        this.fullUser =
          this.filteredUser[0].firstName + ' ' + this.filteredUser[0].lastName;
        console.log('filter user...', this.fullUser);
      });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  toOpenImage() {
    if (this.baseImage == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error,No Equation for this methodology!.',
      });
    } else {
      window.location.href = this.baseImage;
    }
  }

  checkApproval() {
    this.assesmentProxy
      .checkAssessmentReadyForCalculate(
        this.assessmentYear.assessment.id,
        Number(this.assessmentYear.assessmentYear)
      )
      .subscribe((r) => {
        console.log('checkAssessmentReadyForcal....', r);
        this.isReadyToCal.emit(r);
      });
  }

  approve(parameter: Parameter) {}

  reject(parameter: Parameter) {}

  drWithComment() {
    if (!this.isApprove && this.drComment === '') {
      this.commentRequried = true;
      return;
    }

    var qastatus = this.isApprove
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;
    this.qaServiceProxy
      .updateQCStatus(
        this.selectdParameter.id,
        this.assessmentYearId,
        qastatus,
        this.drComment,
        this.fullUser
      )
      .subscribe(
        (res: any) => {
          // console.log("res...",res)
          //  if(res.qaStatus == 4)
          //  {
          //    this.isDisable = true;
          //  }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated',
            closable: true,
          });

          var index = this.parameters.indexOf(this.selectdParameter);

          this.selectdParameter.parameterRequest.qaStatus = this.isApprove
            ? 4
            : 3;

          // this.parameters.splice(index, 0, this.selectdParameter);
          this.checkApproval(); //added by Kushan to fix Enable/Disable "Check Result" button on "Quality Control Details" page
          this.overlayDR.hide();
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
            sticky: true,
          });
        }
      );
  }

  onRowSelect(event: any, isApprove: boolean) {
    this.selectdParameter = event;
    this.isApprove = isApprove;
  }

  OnShowOerlayDR() {
    this.drComment = '';
    this.commentRequried = false;
  }

  getInfo(obj: any) {
    console.log('dataRequestList...', obj);
    this.paraId = obj.id;
    console.log('this.paraId...', this.paraId);

    // let x = 602;
    this.prHistoryProxy
      .getHistroyByid(this.paraId) // this.paraId
      .subscribe((res) => {
        this.requestHistoryList = res;

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

  historyClick(param: Parameter) {
    this.ref = this.dialogService.open(QcHistoryComponent, {
      header: 'History of ' + param.name.toLowerCase(),
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: param,
    });
  }
}

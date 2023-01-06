import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  AssessmentYear,
  AssessmentYearVerificationStatus,
  Parameter,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestQaStatus,
  QualityCheckControllerServiceProxy,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
  VerificationDetailVerificationStatus,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verify-parameter-section-admin',
  templateUrl: './verify-parameter-section-admin.component.html',
  styleUrls: ['./verify-parameter-section-admin.component.css'],
})
export class VerifyParameterSectionAdminComponent implements OnInit, OnDestroy {
  @Input()
  header: string;
  @Input()
  scenario: string | undefined;

  @Input()
  assessmentYear!: AssessmentYear;

  @Input()
  assessmenId: number;

  @Input()
  parameters: Parameter[];

  @Input()
  ResultValue: any | undefined;

  @Input()
  ResultLabel: string;

  @Input()
  isBaseline: boolean;

  @Input()
  isProject: boolean;

  @Input()
  multiResult: boolean;

  @Input()
  isLekage: boolean;

  @Input()
  isProjection: boolean;

  @Input()
  isAdmin: boolean;

  @Input()
  verificationDetails: VerificationDetail[];

  loading: boolean = false;
  commentRequried: boolean = false;
  drComment: string;
  selectdParameter: Parameter;
  isApprove: boolean;
  ref: DynamicDialogRef;
  @ViewChild('opDR') overlayDR: any;

  selectedParameter: Parameter[] = [];
  displayConcern: boolean = false;
  raiseConcernSection: string = '';
  concernVerificationDetails: VerificationDetail[];
  concernParam: Parameter | undefined;
  isProjectionResult = false;

  isParameter: boolean;
  isValue: boolean;

  loggedUser: User;
  paraId:number;
  requestHistoryList: any[] = [];
  displayHistory:boolean = false;

  constructor(
    private qaServiceProxy: QualityCheckControllerServiceProxy,
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private verificationProxy: VerificationControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private prHistoryProxy : ParameterHistoryControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    this.loadUser();
    if (this.multiResult) this.isProjectionResult = true;
  }

  loadUser() {
    let userName = localStorage.getItem('user_name')!;

    let filter1: string[] = [];
    filter1.push('username||$eq||' + userName);
    // lmFilter.push('LearningMaterial.isPublish||$eq||' + 1);

    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filter1,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.loggedUser = res.data[0];
      });
  }

  // ngOnChanges(changes: any) {

  // }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
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
    this.qaServiceProxy;
  }

  onRowSelect(event: any, isApprove: boolean) {
    this.selectdParameter = event;
    this.isApprove = isApprove;
  }

  OnShowOerlayDR() {
    this.drComment = '';
    this.commentRequried = false;
  }

  checkboxCheck(event: any, param: Parameter) {
    if (event.checked) {
      this.selectedParameter.push(param);
    } else {
      const index = this.selectedParameter.indexOf(param);
      this.selectedParameter.splice(index, 1);
    }
  }

  parameterAccept() {
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the parameter(s) ?',
      header: 'Accept Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.acceptParametrs();
      },
      reject: () => {},
    });
  }

  acceptParametrs() {
    let verificationDetails: VerificationDetail[] = [];

    this.selectedParameter.map((v) => {
      let verificationDetail = undefined;

      if (this.verificationDetails) {
        verificationDetail = this.verificationDetails.find(
          (a) => a.parameter && a.parameter.id == v.id
        );
      }
      let vd = new VerificationDetail();

      if (verificationDetail) {
        vd = verificationDetail;
      } else {
        vd.userVerifier = this.loggedUser.id;
        vd.assessmentId = this.assessmentYear.assessment.id;
        let assesmentYear = new AssessmentYear();
        assesmentYear.id = this.assessmentYear.id;
        vd.assessmentYear = assesmentYear;
        vd.year = Number(this.assessmentYear.assessmentYear);
        vd.createdOn = moment();

        let param = new Parameter();
        param.id = v.id;
        vd.parameter = param;

        if (this.header == 'Baseline Parameter') {
          vd.isBaseline = true;
        }
        if (this.header == 'Project Parameter') {
          vd.isProject = true;
        }
        if (this.header == 'Leakage Parameter') {
          vd.isLekage = true;
        }
        if (this.header == 'Projection Parameter') {
          vd.isProjection = true;
        }
      }

      vd.editedOn = moment();
      vd.updatedDate = moment();
      vd.isAccepted = true;
      vd.verificationStage = this.getverificationStage();
      vd.verificationStatus = Number(this.assessmentYear.verificationStatus);

      verificationDetails.push(vd);
    });

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'successfully Save.',
          closable: true,
        });
      });
  }

  getverificationStage() {
    let stage = 0;
    if (
      this.assessmentYear.verificationStatus === 1 ||
      this.assessmentYear.verificationStatus === 2 ||
      this.assessmentYear.verificationStatus === 3
    ) {
      stage = 1;
    } else if (this.assessmentYear.verificationStatus === 4) {
      stage = 2;
    } else if (this.assessmentYear.verificationStatus === 5) {
      stage = 3;
    }

    return stage;
  }

  raiseConcern(event: any, parameter: Parameter) {
    this.raiseConcernSection = parameter.name;
    this.isParameter = true;
    this.isValue = false;

    if (this.verificationDetails) {
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => !a.isResult && a.parameter && a.parameter.id == parameter.id
      );
    }

    this.concernParam = parameter;

    this.displayConcern = true;
  }

  raiseConcernResult(event: any) {
    this.raiseConcernSection = this.ResultLabel;
    this.isParameter = false;
    this.isValue = true;
    this.concernParam = undefined;

    if (this.verificationDetails) {
      if (this.isBaseline) {
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isBaseline
        );
      } else if (this.isProject) {
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isProject
        );
      } else if (this.isLekage) {
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isLekage
        );
      } else if (this.isProjection) {
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isProjection
        );
      }
    }

    this.displayConcern = true;
  }

  getInfo(obj: any)
  {
       console.log("dataRequestList...",obj)
       this.paraId = obj.id;
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

  parameterAction(event: any, parameter: Parameter) {
    let verificationDetails: VerificationDetail[] = [];

    let verificationDetail = undefined;

    if (this.verificationDetails) {
      verificationDetail = this.verificationDetails.find(
        (a) =>
          a.parameter &&
          a.parameter.id == parameter.id &&
          a.verificationStage == this.getverificationStage()
      );
    }
    let vd = new VerificationDetail();
    console.log(verificationDetail);
    if (verificationDetail) {
      vd = verificationDetail;
    } else {
      vd.assessmentId = this.assessmentYear.assessment.id;
      let assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assessmentYear.id;
      vd.assessmentYear = assesmentYear;
      vd.year = Number(this.assessmentYear.assessmentYear);
      vd.createdOn = moment();
      vd.isAccepted = false;
      let param = new Parameter();
      param.id = parameter.id;
      vd.parameter = param;

      if (this.header == 'Baseline Parameter') {
        vd.isBaseline = true;
      }
      if (this.header == 'Project Parameter') {
        vd.isProject = true;
      }
      if (this.header == 'Leakage Parameter') {
        vd.isLekage = true;
      }
      if (this.header == 'Projection Parameter') {
        vd.isProjection = true;
      }
    }

    vd.editedOn = moment();
    vd.updatedDate = moment();
    vd.verificationStage = this.getverificationStage();
    vd.verificationStatus = Number(this.assessmentYear.verificationStatus);
    vd.isDataRequested = true;
    verificationDetails.push(vd);

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'successfully Save.',
          closable: true,
        });
      });
  }
}

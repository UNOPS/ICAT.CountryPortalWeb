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
import { VerificationService } from 'shared/verification-service';

@Component({
  selector: 'app-verify-parameter-section',
  templateUrl: './verify-parameter-section.component.html',
  styleUrls: ['./verify-parameter-section.component.css'],
})
export class VerifyParameterSectionComponent implements OnInit, OnDestroy {
  @Input()
  header: string;
  @Input()
  scenario: string | undefined;

  @Input()
  assessmentYear: AssessmentYear;

  @Input()
  flag: number;

  @Input()
  assessmenId: number;

  @Input()
  parameters: any[];

  @Input()
  verificationStatus:number;

  @Input()
  ResultValue: any | undefined;

  @Input()
  ResultLabel: string;

  @Input()
  multiResult: boolean;

  @Input()
  isBaseline: boolean;

  @Input()
  isProject: boolean;

  @Input()
  isLekage: boolean;

  @Input()
  isProjection: boolean;

  @Input()
  isAdmin: boolean;

  @Input()
  isAccept: boolean;

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
  loggedUser: User;

  isParameter: boolean;
  isValue: boolean;

  paraId:number;
  requestHistoryList: any[] = [];
  displayHistory:boolean = false;

  isProjectionResult = false;
  isResultAccepted: boolean = false

  constructor(
    private qaServiceProxy: QualityCheckControllerServiceProxy,
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private verificationProxy: VerificationControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private prHistoryProxy : ParameterHistoryControllerServiceProxy,
    public verificationService: VerificationService
  ) {}

  async ngOnInit(): Promise<void> {

    this.loadUser();
    if (this.multiResult) this.isProjectionResult = true;

    console.log("verify parameters...",this.parameters)
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

  ngOnChanges(changes: any) {
    let column: string
    if (this.header == 'Baseline Parameter') {
      column = 'isBaseline'
    }
    if (this.header == 'Project Parameter') {
      column = 'isProject'
    }
    if (this.header == 'Leakage Parameter') {
      column = 'isLekage'
    }
    if (this.header == 'Projection Parameter') {
      column = 'isProjection'
    }

    let vd = this.verificationDetails.find((a: any )=> a.isResult === true && a[column] === true)
    if (vd?.isAccepted){
      this.isResultAccepted = true
    }

  }

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


  async onComplete(e: any){
    this.parameters = this.parameters.map(para => {
      if (para.id === this.concernParam?.id){
        para['isConcernRaised'] = true
        return para
      } else {
        return para
      }
    })
    this.verificationDetails = await this.verificationProxy.getVerificationDetails(this.assessmentYear.id).toPromise()
    if (e){
      this.displayConcern = false
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

    let parametersToUpdate = [...this.selectedParameter]
    this.selectedParameter = []

    parametersToUpdate.map((v) => {

      v.isAcceptedByVerifier = 1;

      this.serviceProxy
        .updateOneBaseParameterControllerParameter(
          v.id,
          v
        )
        .subscribe(
          (res) => {
          
            });


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
        // this.isAccept=true
        this.selectedParameter = []
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
    console.log("my para...",parameter);
    this.raiseConcernSection = parameter.name;
    this.isParameter = true;
    this.isValue = false;

    console.log('gggggggggggggggggggg');

    if (this.verificationDetails) {
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => !a.isResult && a.parameter && a.parameter.id == parameter.id
      );
    }

    console.log(this.concernVerificationDetails)

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

  resultAccept(){
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the result ?',
      header: 'Accept Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.acceptResult();

      },
      reject: () => {},
    });
  }

  acceptResult() {
    let verificationDetails: VerificationDetail[] = [];

    let parametersToUpdate = [...this.selectedParameter]
    this.selectedParameter = []

    let column: string

    if (this.header == 'Baseline Parameter') {
      column = 'isBaseline'
    }
    if (this.header == 'Project Parameter') {
      column = 'isProject'
    }
    if (this.header == 'Leakage Parameter') {
      column = 'isLekage'
    }
    if (this.header == 'Projection Parameter') {
      column = 'isProjection'
    }

    let verificationDetail = undefined;

    if (this.verificationDetails) {
      verificationDetail = this.verificationDetails.find(
        (a: any) => a.assessmentId === this.assessmentYear.assessment.id && a[column] == true && a.isResult === true
      );
    }
    let vd = new VerificationDetail();

    if (verificationDetail) {
      vd = verificationDetail;
    } else {
      console.log("new result")
      vd.userVerifier = this.loggedUser.id;
      vd.assessmentId = this.assessmentYear.assessment.id;
      let assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assessmentYear.id;
      vd.assessmentYear = assesmentYear;
      vd.year = Number(this.assessmentYear.assessmentYear);
      vd.createdOn = moment();
      vd.isResult = true


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
    console.log(vd)

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
        // this.isAccept=true
        this.isResultAccepted = true
      });
  }
}

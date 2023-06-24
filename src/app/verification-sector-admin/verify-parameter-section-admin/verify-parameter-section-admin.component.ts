import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  AssessmentResault,
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  AssessmentYearVerificationStatus,
  Parameter,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestQaStatus,
  ParameterVerifierAcceptance,
  QualityCheckControllerServiceProxy,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
  VerificationDetailVerificationStatus,
} from 'shared/service-proxies/service-proxies';
import { VerificationActionDialogComponent } from '../verification-action-dialog/verification-action-dialog.component';
import { VerificationService } from 'shared/verification-service';

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
  roundOneHeadTable: any;
  roundTwoHeadTable: any;
  roundThreeHeadTable: any;
  hasResultConcern: boolean;
  isResultActionDone: boolean = false
  canActiveResult: boolean = false;
  isCompleted: any;

  constructor(
    private qaServiceProxy: QualityCheckControllerServiceProxy,
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private verificationProxy: VerificationControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private prHistoryProxy : ParameterHistoryControllerServiceProxy,
    private assessmentYearControllerServiceProxy: AssessmentYearControllerServiceProxy,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    if (this.multiResult) this.isProjectionResult = true;

    // if (!this.ResultValue){
    //   this.ResultValue = new AssessmentResault()
    // }
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

  async ngOnChanges(changes: any) {
    console.log(this.ResultValue)
    let column: string = ''
    if (this.header == 'Baseline Parameters') {
      column = 'isBaseline'
    }
    if (this.header == 'Project Parameters') {
      column = 'isProject'
    }
    if (this.header == 'Leakage Parameters') {
      column = 'isLekage'
    }
    if (this.header == 'Projection Parameters') {
      column = 'isProjection'
    }
    console.log(column)

    let rounds = await this.verificationService.checkVerificationStage(this.assessmentYear)

    let stage: number
    if (rounds.roundOneHeadTable !== undefined){
      stage = 1
    } 
    if (rounds.roundTwoHeadTable !== undefined){
      stage = 2
    }
    if (rounds.roundThreeHeadTable !== undefined){
      stage = 3
    }

    let vd = this.verificationDetails.find((a: any )=> a.isResult === true && a[column] === true && a.verificationStage === stage)
    console.log(vd)
    if (vd?.explanation){
      this.hasResultConcern = true
    }
    if (vd?.rootCause || vd?.correctiveAction) this.canActiveResult = true
    if (vd?.action){
      this.isResultActionDone = true
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

    this.selectedParameter.map(async (v) => {
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
      vd.verificationStage = await this.getverificationStage();
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

  async getverificationStage() {
    let stage = 0;
    await this.checkVerificationStage()
    // if (this.assessmentYear.verificationStatus === 8){
    //   if (this.roundOneHeadTable !== undefined){
    //     stage = 1
    //   } else if (this.roundTwoHeadTable !== undefined){
    //     stage = 2
    //   } else {
    //     stage = 3
    //   }
    // } else {
    //   if (
    //     this.assessmentYear.verificationStatus === 1 ||
    //     this.assessmentYear.verificationStatus === 2 ||
    //     this.assessmentYear.verificationStatus === 3
    //   ) {
    //     stage = 1;
    //   } else if (this.assessmentYear.verificationStatus === 4) {
    //     stage = 2;
    //   } else if (this.assessmentYear.verificationStatus === 5) {
    //     stage = 3;
    //   }
    // }
    if (this.roundOneHeadTable !== undefined){
      stage = 1
    } 
    if (this.roundTwoHeadTable !== undefined){
      stage = 2
    } 
    if (this.roundThreeHeadTable !== undefined) {
      stage = 3
    }

    return stage;
  }

  raiseConcern(event: any, parameter: Parameter) {
    this.raiseConcernSection = parameter.name;
    this.isParameter = true;
    this.isValue = false;

    if (this.verificationDetails) {
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => !a.isResult && a.parameter && (a.parameter.id == parameter.id || a.parameter.id === parameter.previouseParameterId)
      );
    }


    this.concernParam = parameter;

    this.displayConcern = true;
  }

  raiseConcernResult(event: any) { //currently not using
    this.raiseConcernSection = this.ResultLabel;
    this.isParameter = false;
    this.isValue = true;
    this.concernParam = undefined;
    this.canActiveResult = true

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

  async onComplete(e: any){
    this.isCompleted = true
    this.parameters = this.parameters.map(para => {
      if (para.id === this.concernParam?.id){
        para['canActiveAction'] = true
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
    console.log(parameter)
    let action = "Previouse value: " + parameter.value + parameter.uomDataEntry
    let vd = undefined
    console.log("getverificationStage--------", this.getverificationStage())
    console.log(this.verificationDetails)
    if (this.verificationDetails){
      vd = this.verificationDetails.find(
        async (d) => 
        d.parameter &&
        d.parameter.id === parameter.id &&
        d.verificationStage === await this.getverificationStage()
      )

      console.log(vd)
    } else {
      console.log("no verification detail")
    }

    let data:any = {type: 'parameter'}

    data['parameter'] = parameter
    if (vd){
      data['verificationDetail'] = vd
    } else {
      data['verificationDetail'] = null
    }

    data['assessmentYear'] = this.assessmentYear
    

    this.ref = this.dialogService.open(VerificationActionDialogComponent, {
      header: parameter ? ('Enter value for ' + parameter.name.toLowerCase()):"Enter Aggregated Action",
      width: '40%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });

    this.ref.onClose.subscribe(async (res) => {
      console.log(res)
      if (res){
        if (res?.isEnterData){
          action = action + ", New value: " + res?.value
        } else {
          action = action + ", Requested data from " + res?.value
        }
        await this.saveVerificationDetails(action, parameter)
        this.isResultActionDone = true
      }
    })

    
  }

  async saveVerificationDetails(action: string, parameter?: Parameter ){
    let verificationDetails: VerificationDetail[] = [];
    
    let verificationStage = await this.getverificationStage()
    console.log(verificationStage)
    if (parameter){
      let verificationDetail = undefined;
  
      if (this.verificationDetails) {
        console.log(this.verificationDetails)
        verificationDetail = this.verificationDetails.find(
          (a) =>
            a.parameter &&
            a.parameter.id == parameter.id &&
            a.verificationStage == verificationStage
        );
      }
      let _vd = new VerificationDetail();
      console.log(verificationDetail);
      if (verificationDetail) {
        _vd = verificationDetail;
      } else {
        _vd.assessmentId = this.assessmentYear.assessment.id;
        let assesmentYear = new AssessmentYear();
        assesmentYear.id = this.assessmentYear.id;
        _vd.assessmentYear = assesmentYear;
        _vd.year = Number(this.assessmentYear.assessmentYear);
        _vd.createdOn = moment();
        _vd.isAccepted = false;
        let param = new Parameter();
        param.id = parameter.id;
        _vd.parameter = param;
  
        if (this.header == 'Baseline Parameter') {
          _vd.isBaseline = true;
        }
        if (this.header == 'Project Parameter') {
          _vd.isProject = true;
        }
        if (this.header == 'Leakage Parameter') {
          _vd.isLekage = true;
        }
        if (this.header == 'Projection Parameter') {
          _vd.isProjection = true;
        }
      }
  
      let filter = ['verifierAcceptance||$ne||' + ParameterVerifierAcceptance.REJECTED, 'previouseParameterId||$eq||' + parameter.id]
      let para = (await this.serviceProxy.getManyBaseParameterControllerParameter(
        undefined, undefined, filter, undefined, undefined, undefined, 100, 0, 1, 0
      ).toPromise()).data[0]
      _vd.parameter = para
  
      _vd.editedOn = moment();
      _vd.updatedDate = moment();
      _vd.verificationStage = await this.getverificationStage();
      _vd.verificationStatus = Number(this.assessmentYear.verificationStatus);
      _vd.isDataRequested = true;
      _vd.action = action
      verificationDetails.push(_vd);
    } else { //save verificationdetail for result
      let verificationDetail = undefined;
      let column: string = ''
      console.log(this.header)
      if (this.header == 'Baseline Parameters') {
        column = 'isBaseline'
      }
      if (this.header == 'Project Parameters') {
        column = 'isProject'
      }
      if (this.header == 'Leakage Parameters') {
        column = 'isLekage'
      }
      if (this.header == 'Projection Parameters') {
        column = 'isProjection'
      }
      console.log(column)
      if (this.verificationDetails) {
        console.log(this.verificationDetails)
        verificationDetail = this.verificationDetails.find(
          (a: any) =>
            a.isResult === true && a[column] === true &&
            a.verificationStage == verificationStage
        );
        console.log("selected verificationDetail", verificationDetail)
        let _vd = new VerificationDetail();
        if (verificationDetail) {
          _vd = verificationDetail;
        } else {
          _vd.assessmentId = this.assessmentYear.assessment.id;
          let assesmentYear = new AssessmentYear();
          assesmentYear.id = this.assessmentYear.id;
          _vd.assessmentYear = assesmentYear;
          _vd.year = Number(this.assessmentYear.assessmentYear);
          _vd.createdOn = moment();
          _vd.isAccepted = false;
    
          if (this.header == 'Baseline Parameters') {
            _vd.isBaseline = true;
          }
          if (this.header == 'Project Parameters') {
            _vd.isProject = true;
          }
          if (this.header == 'Leakage Parameters') {
            _vd.isLekage = true;
          }
          if (this.header == 'Projection Parameters') {
            _vd.isProjection = true;
          }
        }
        _vd.editedOn = moment();
        _vd.updatedDate = moment();
        _vd.verificationStage = await this.getverificationStage();
        _vd.verificationStatus = Number(this.assessmentYear.verificationStatus);
        _vd.action = action
        verificationDetails.push(_vd)
      }
    }
    console.log(verificationDetails)

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'successfully Save.',
          closable: true,
        });
        window.location.reload()
      });
  }

  onResultAction(){
    let scenario: string = ''
    if (this.header == 'Baseline Parameter') {
      scenario = 'baseline'
    }
    if (this.header == 'Project Parameter') {
      scenario = 'project'
    }
    if (this.header == 'Leakage Parameter') {
      scenario = 'leakage'
    }
    if (this.header == 'Projection Parameter') {
      scenario = 'projection'
    }
    let data:any = {type: 'result'}
    this.ref = this.dialogService.open(VerificationActionDialogComponent, {
      header: "Result action",
      width: '40%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });

    this.ref.onClose.subscribe(async (res) => {
      if (res){
        console.log(res)
        let result = await this.verificationProxy.sendResultToRecalculate(this.assessmentYear.id).toPromise()
        console.log(result)
        let comment = this.loggedUser.userType.name + '|' + res.result.comment
        await this.saveVerificationDetails(comment)
      }
    })
  }

  async checkVerificationStage() {
    if (this.assessmentYear.assessment.id){
      let verificationList = (await this.assessmentYearControllerServiceProxy
        .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assessmentYear.assessment.id, this.assessmentYear.assessmentYear)
        .toPromise())[0]?.verificationDetail;
      this.roundOneHeadTable = verificationList?.find((o: any) => o.verificationStage == 1);
      this.roundTwoHeadTable = verificationList?.find((o: any) => o.verificationStage == 2);
      this.roundThreeHeadTable = verificationList?.find((o: any) => o.verificationStage == 3);
    }
  }

  onHide() {
    if (!this.isCompleted){
      if (this.isValue) {
        this.canActiveResult = false
      }
    }
  }

}

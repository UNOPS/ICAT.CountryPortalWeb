import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  AssessmentControllerServiceProxy,
  AssessmentResultControllerServiceProxy,
  Assessment,
  AssessmentResult,
  AssessmentYear,
  Parameter,
  ProjectionResult,
  ProjectionResultControllerServiceProxy,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
  ParameterVerifierAcceptance,
} from 'shared/service-proxies/service-proxies';
import { VerificationService } from 'shared/verification-service';
import { environment } from 'environments/environment';

@Component({
  selector: 'verify-detail-detail',
  templateUrl: './verify-detail.component.html',
  styleUrls: ['./verify-detail.component.css'],
})
export class VerifyDetailComponent implements OnInit {
  assesMentYearId = 0;
  verificationStatus = 0;
  assessmentYear: AssessmentYear = new AssessmentYear();
  parameters: Parameter[] = [];
  baselineParameters: Parameter[] = [];
  projectParameters: Parameter[] = [];
  lekageParameters: Parameter[] = [];
  projectionParameters: Parameter[] = [];
  loading = false;
  assessmentResult: AssessmentResult = new AssessmentResult();
  projectionResult: ProjectionResult[] = [];
  selectdProjectionResult: ProjectionResult;
  isApprove = false;
  drComment = '';
  commentRequried = false;
  displayConcern = false;
  emissionReduction: number;

  assessmentResultComment = '';
  assessmentResultCommentRequried = false;

  selectdAssessmentType: number;
  isApproveAssessment = false;

  VerificationStatusEnum = VerificationStatus;
  concernVerificationDetails: VerificationDetail[] | undefined;
  verificationDetails: VerificationDetail[] = [];
  verificationDetailsFromDb: VerificationDetail[] = [];

  raiseConcernSection = '';
  concernIsMethodology: boolean;
  concernIsNdC: boolean;
  concernIsAssumption: boolean;

  loggedUser: User;
  flag: number;
  assumption:string = '';
  assessmentObjective:any

  isBaseAccept:boolean = true;
  isProjectAccept:boolean = true;
  isLeckegeAccept:boolean = true;
  isProjectionAccept:boolean = true;

  isNdcDisable:boolean = false;
  isNdcAccepted:boolean = false;
  isNdcDisableReject:boolean = false;
  isMethodology:boolean = false;
  isMethodologyReject:boolean = false;
  isAssumptions:boolean = false;
  isAssumptionAccepted:boolean = false;
  isAssumptionsReject:boolean = false;

  isTotal: boolean = false
  isMac: boolean = false
  isDifference: boolean = false

  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;
  isResultAccepted: boolean;
  isResultRaised: boolean;
  isResult: boolean;
  hasResultConcern: boolean;
  isMacResultAccepted: boolean;
  hasMacResultConcern: boolean;
  isCostResultAccepted: boolean;
  hasCostResultConcern: boolean;
  isCompleted: boolean = false

  constructor(
    private route: ActivatedRoute,
    private proxy: ServiceProxy,
    private assessmentProxy: AssessmentControllerServiceProxy,
    private assessmentResultProxy: AssessmentResultControllerServiceProxy,
    private projectionResultProxy: ProjectionResultControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private verificationProxy: VerificationControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private serviceProxy: ServiceProxy,
    public verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.assesMentYearId = params['id'];
      this.verificationStatus = +params['verificationStatus'];
      this.flag = params['flag'];

      this.assessmentYear = await this.proxy
      .getOneBaseAssessmentYearControllerAssessmentYear(
        this.assesMentYearId,
        undefined,
        undefined,
        undefined
      ).toPromise()
      await this.getVerificationDetail();
      this.getAssessment();
      this.getAssessmentResult(false);
      this.getProjectionReuslt();
    });

    this.loadUser();

    this.verificationProxy
      .getVerificationDetails(this.assesMentYearId)
      .subscribe((res) => {
        this.verificationDetailsFromDb = res;
        let ndcObj = this.verificationDetailsFromDb.filter((o)=>o.isNDC == true );
        ndcObj.forEach(ndc => {
          if (ndc.isAccepted){
            this.isNdcDisable = true;
            this.isNdcAccepted = true;
            this.isNdcDisableReject = true;
            return
          } else {
            if (ndc.explanation && ndc.verificationStage === this.getverificationStage()) {
              this.isNdcDisable = true;
            }
            this.isNdcAccepted = false;
            this.isNdcDisableReject = false;
          }
        })
        let methObject = this.verificationDetailsFromDb.find((o)=>o.isMethodology == true);
        if(methObject?.isAccepted == true)
        {
          this.isMethodology = true;
          this.isMethodologyReject = true;
        }
        if(methObject?.isAccepted == false)
        {
          this.isMethodology = true;
          this.isMethodologyReject = true;
        }

        let assumpObject = this.verificationDetailsFromDb.find((o)=>o.isAssumption == true);
        if(assumpObject?.isAccepted == true)
        {
          this. isAssumptions = true;
          this. isAssumptionsReject = true;
        }
        if(assumpObject?.isAccepted == false)
        {
          this. isAssumptions = true;
          this. isAssumptionsReject = true;
        }
        if(assumpObject?.isAccepted == true)
        {
          this.isAssumptions = true;
          this.isAssumptionAccepted = true;
          this.isAssumptionsReject = true;
        } else {
          if (assumpObject?.explanation){
            this.isAssumptions = true;
          }
          this.isAssumptionAccepted = false;
          this.isAssumptionsReject = false;
        }

        let totalResultObj = this.verificationDetailsFromDb.filter((o) => o.isTotal === true)
        totalResultObj.forEach(tot => {
          if (tot?.isAccepted){
            this.isResultAccepted = true
            return
          } else {
            if (tot?.explanation && tot.verificationStage === this.getverificationStage()){
              this.hasResultConcern = true
              return
            }
          }
        })

        let macResultObj = this.verificationDetailsFromDb.filter((o) => o.isMac === true)
        macResultObj.forEach(mac => {
          if (mac?.isAccepted){
            this.isMacResultAccepted = true
            return
          } else {
            if (mac?.explanation && mac.verificationStage === this.getverificationStage()){
              this.hasMacResultConcern = true
              return
            }
          }
        })

        let costObj = this.verificationDetailsFromDb.filter((o) => o.isDifference === true)
        costObj.forEach(cost => {
          if (cost?.isAccepted){
            this.isCostResultAccepted = true
            return
          } else {
            if (cost?.explanation && cost.verificationStage === this.getverificationStage()){
              this.hasCostResultConcern = true
              return
            }
          }
        })
      });


  
  }

  loadUser() {
    let userName = localStorage.getItem('user_name')!;

    let filter1: string[] = [];
    filter1.push('username||$eq||' + userName);

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
        0,
      )
      .subscribe((res: any) => {
        this.loggedUser = res.data[0];
      });
  }

  async getVerificationDetail() {
    this.verificationDetails = await this.verificationProxy.getVerificationDetails(this.assesMentYearId).toPromise()
  }

  getAssessmentResult(isCalculate: boolean) {
    this.assessmentResultProxy
      .getAssessmentResult(
        this.assessmentYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        'verify',
        environment.apiKey1
      )
      .subscribe((res) => {
        this.assessmentResult = res;
      });
  }

  getProjectionReuslt() {
    this.projectionResultProxy
      .getProjectionResult(
        this.assessmentYear.assessment.id,
        Number(this.assessmentYear.assessmentYear),
      )
      .subscribe((res) => {
        this.projectionResult = res;
      });
  }

  getResult(type: any){
    if (this.assessmentYear.assessment.assessmentType === 'MAC'){
      if (type === "baseline"){
        return this.assessmentResult.bsTotalAnnualCost
      } else if (type === "project"){
        return this.assessmentResult.psTotalAnnualCost
      } else {
        return ''
      }
    } else {
      if (type === "baseline"){
        return this.assessmentResult.baselineResult
      } else if (type === "project"){
        return this.assessmentResult.projectResult
      } else if (type === "lekage"){
        return this.assessmentResult.lekageResult
      } else {
        return ''
      }
    }
  }

  getParameters(asessmentYear: AssessmentYear) {
    let filter: string[] = new Array();
    filter.push('assessment.id||$eq||' + asessmentYear.assessment.id);
    filter.push('projectionYear||$eq||' + asessmentYear.assessmentYear);

    this.proxy
      .getManyBaseParameterControllerParameter(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        undefined
      )
      .subscribe((res) => {
        asessmentYear.assessment.parameters = res.data;
      });
  }

  getAssessment() {
    this.assessmentProxy
      .getAssment(
        this.assessmentYear.assessment.id,
        this.assessmentYear.assessmentYear
      )
      .subscribe(async (res) => {
        this.assessmentYear.assessment = res; 
        this.serviceProxy.getManyBaseAssessmentObjectiveControllerAssessmentObjective(
          undefined,
          undefined,
          ["assessmentId||$eq||"+ this.assessmentYear.assessment.id],
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0

          ).subscribe((res:any) => {
           if( res.data[0])
           {
            this.assessmentObjective = res.data[0].objective;
           }
           else{
             this.assessmentObjective = "N/A"
           }
        });


        this.parameters = this.assessmentYear.assessment.parameters;
        let reductionPara = this.parameters.find(o => o.name === 'Reduction')
        if (reductionPara){
          this.emissionReduction = +reductionPara?.value
        } 
        this.parameters = await Promise.all(
          this.parameters.map(para => {
            if (para.verifierAcceptance !== ParameterVerifierAcceptance.DATA_ENTERED){
              let v = this.verificationDetails.find(o => o.parameter.id === para.id)
              if (v){
                if (!v.isAccepted && (v.rootCause === null || v.correctiveAction === null || v.action === null)){
                  para['isConcernRaised'] = true
                }
              }
            }
            return para
          })
        ) 

        this.baselineParameters =
          this.assessmentYear.assessment.parameters.filter(
            (p) => p.isBaseline
            && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
          );
        
        for (let base of this.baselineParameters){
          if(base.isAcceptedByVerifier !=1){
            this.isBaseAccept =false;
          }
        }

        this.projectParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isProject
          && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
        );

        for (let base of this.projectParameters){
          if(base.isAcceptedByVerifier !=1){
            this.isProjectAccept =false;
          }
        }
        this.lekageParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isLekage
          && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
        );

        for (let base of this.lekageParameters){
          if(base.isAcceptedByVerifier !=1){
            this.isLeckegeAccept =false;
          }
        }
        
        
        this.projectionParameters =
          this.assessmentYear.assessment.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == Number(this.assessmentYear.assessmentYear)
              && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
          );

          for (let base of this.projectionParameters){
            if(base.isAcceptedByVerifier !=1){
              this.isProjectionAccept =false;
            }
          }
      });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag: this.flag },
    });
  }

  submit() {
    this.verificationProxy
      .getVerificationDetails(this.assesMentYearId)
      .subscribe((a) => {
        const notaccepted = a.filter((a) => !a.isAccepted);

        if (
          notaccepted &&
          notaccepted.length > 0 &&
          this.assessmentYear.verificationStatus === 3
        ) {
          this.assessmentYear.verificationStatus = 6;
        }
      });

    const assessment = new Assessment();
    assessment.id = this.assessmentYear.assessment.id;
    this.assessmentYear.assessment = assessment;
    this.proxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assessmentYear.id,
        this.assessmentYear,
      )
      .subscribe((a) => {
        alert('updates');
      });
  }

  back() {
    this.router.navigate(['/verification-verifier']);
  }

  calculateButtonDisable() {
    return !this.isAllSubmit();
  }

  isAllSubmit() {
    return (
      this.parameters.find((m) => m.parameterRequest?.qaStatus !== 4) ===
      undefined
    );
  }

  onRowSelect(event: any, isApprove: boolean) {
    this.selectdProjectionResult = event;
    this.isApprove = isApprove;
  }

  onRowSelectAssessment(event: any, isApprove: boolean) {
    this.selectdAssessmentType = event;
    this.isApproveAssessment = isApprove;
  }

  OnShowOerlayDR() {
    this.drComment = '';
    this.commentRequried = false;
  }

  OnShowOerlayDRAssessment() {
    this.assessmentResultComment = '';
    this.assessmentResultCommentRequried = false;
  }

  approve(parameter: ProjectionResult) {}

  reject(parameter: ProjectionResult) {}

  drWithComment() {
    if (!this.isApprove && this.drComment === '') {
      this.commentRequried = true;
      return;
    }

    const qastatus = this.isApprove
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;

    this.projectionResultProxy
      .updateQCStatus(
        this.selectdProjectionResult.id,
        this.selectdProjectionResult.projectionYear,
        qastatus,
        this.drComment,
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully updated.',
            closable: true,
          });

          const index = this.projectionResult.indexOf(
            this.selectdProjectionResult,
          );

          this.selectdProjectionResult.qcStatus = this.isApprove ? 4 : 3;

          this.overlayDRPro.hide();
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
            sticky: true,
          });
        },
      );
  }

  drWithCommentAssessment() {
    if (!this.isApproveAssessment && this.assessmentResultComment === '') {
      this.commentRequried = true;
      return;
    }

    const qastatus = this.isApproveAssessment
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;

    this.assessmentResultProxy
      .updateQCStatusAssessmentResult(
        this.assessmentResult.id,
        this.assessmentResult.assessmentYear.id,
        qastatus,
        this.selectdAssessmentType,
        this.assessmentResultComment,
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully updated.',
            closable: true,
          });

          const index = this.projectionResult.indexOf(
            this.selectdProjectionResult,
          );

          this.overlayDRAssemnet.hide();
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

  parameterAccept(isNdc: boolean, isMethodology: boolean , isAssumption:boolean) {
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the ' + (isMethodology? 'methodology ?' : (isNdc ? 'aggregated action and action area ?' : (isAssumption ? 'assumption ?' : 'parameter(s) ?'))),
      header: 'Accept Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.accept(isNdc, isMethodology, isAssumption);
      },
      reject: () => {},
    });
  }

  accept(IsNdc: boolean, isMethodology: boolean, isAssumption: boolean) {
    const verificationDetails: VerificationDetail[] = [];

    const currentVerification = this.verificationDetails.find(
      (a) =>
        a.isNDC == IsNdc &&
        a.isMethodology == isMethodology &&
        a.isAssumption == isAssumption &&
        a.verificationStage == this.getverificationStage(),
    );
    let vd = new VerificationDetail();

    if (currentVerification) {
      vd = currentVerification;
      vd.updatedDate = moment();
    } else {
      vd.userVerifier = this.loggedUser.id;
      vd.createdOn = moment();
      vd.updatedDate = moment();
      vd.assessmentId = this.assessmentYear.assessment.id;
      const assessmentYear = new AssessmentYear();
      assessmentYear.id = this.assessmentYear.id;
      vd.assessmentYear = assessmentYear;
      vd.year = Number(this.assessmentYear.assessmentYear);

      if (IsNdc) {
        vd.isNDC = true;
      }
      if (isMethodology) {
        vd.isMethodology = true;
      }
      if (isAssumption) {
        vd.isAssumption = true;
      }

      if (IsNdc) {
        this.isNdcDisable = true;
        this.isNdcDisableReject = true;
      }

      if (isMethodology) {
        this.isMethodology = true;
        this.isMethodologyReject = true;
      }

      if (isAssumption) {
        this.isAssumptions = true;
        this.isAssumptionsReject = true;
      }
    }

    vd.verificationStage = this.getverificationStage();
    vd.verificationStatus = Number(this.assessmentYear.verificationStatus);

    vd.isAccepted = true;

    verificationDetails.push(vd);

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully updated',
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

  raiseConcern(isNdc: boolean, isMethodology: boolean, isAssumption:boolean) {
    if (isMethodology){
      this.confirmationService.confirm({
        message: 'Please be aware that proceeding with this action will result in the failure of the assessment.<br>Are you absolutely sure you wish to continue?',
        header: 'Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
          this.raiseConcernSection = 'Methodology';
          this.concernVerificationDetails = this.verificationDetails.filter(
            (a) => a.isMethodology
          );
          this.concernIsMethodology = isMethodology;
          this.displayConcern = true;
          this.isMethodology = true;
          this.isMethodologyReject = true;
        },
        reject: () => {},
      });
    } else {
      if (isNdc) {
        this.raiseConcernSection = 'Aggregated Actions';
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isNDC
        );
      }
      if (isAssumption) {
        this.raiseConcernSection = 'Assumption';
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isAssumption
        );
      }
  
      this.concernIsNdC = isNdc;
      this.concernIsAssumption = isAssumption;
      this.displayConcern = true;
  
      if(isNdc)
      {
        this.isNdcDisable = true;
      }
  
      if(isAssumption)
      {
        this.isAssumptions = true;
      }
    }
  }

  toNonConformance() {
    this.router.navigate(['/non-conformance'], {
      queryParams: {
        id: this.assessmentYear.id,
        isVerificationHistory: this.flag,
        vStatus: this.verificationStatus,
      },
    });
  }

  async onComplete(e: any){
    this.isCompleted = true
    this.verificationDetails = await this.verificationProxy.getVerificationDetails(this.assessmentYear.id).toPromise()
    if (e){
      this.displayConcern = false
    }
  }

  onHide(){
    if (!this.isCompleted){
      if (this.concernIsNdC){
        this.isNdcDisable = false;
      }
      if (this.concernIsAssumption){
        this.isAssumptions = false;
      }
      if (this.concernIsMethodology){
        this.isMethodology = false
      }
    }
    this.concernIsNdC = false
    this.concernIsMethodology = false
    this.concernIsAssumption = false
  }

  async raiseConcernResult(column: string, section: string) {
    if (section == 'Emission Reduction'){
      this.isTotal = true
      this.hasResultConcern = true
    } else if (section === 'Mac Result'){
      this.isMac = true
      this.hasMacResultConcern = true
    } else if (section === 'Cost Difference'){
      this.isDifference = true
      this.hasCostResultConcern = true
    }
    this.raiseConcernSection = section;
    this.isResult = true;

    if (this.verificationDetails) {

      if(column == 'isTotal'){
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isTotal
        );
      }
        else if( column == 'isMac') {  this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isMac
        );}
        else if (column =='isDifference'){  this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isResult && a.isDifference
        );}
     
    }

    this.displayConcern = true;
  }

  resultAccept(column: string){
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the result ?',
      header: 'Accept Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.acceptResult(column);

      },
      reject: () => {},
    });
  }

  acceptResult(column: string) {
    let verificationDetails: VerificationDetail[] = [];

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
      vd.userVerifier = this.loggedUser.id;
      vd.assessmentId = this.assessmentYear.assessment.id;
      let assessmentYear = new AssessmentYear();
      assessmentYear.id = this.assessmentYear.id;
      vd.assessmentYear = assessmentYear;
      vd.year = Number(this.assessmentYear.assessmentYear);
      vd.createdOn = moment();
      vd.isResult = true
      if(column == 'isTotal'){vd.isTotal =true}
        else if( column == 'isMac') {vd.isMac =true}
        else if (column =='isDifference'){vd.isDifference=true}
    }

    vd.editedOn = moment();
    vd.updatedDate = moment();
    vd.isAccepted = true;
    vd.verificationStage = this.getverificationStage();
    vd.verificationStatus = Number(this.assessmentYear.verificationStatus);

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
        this.isResultAccepted = true
      });
  }
}

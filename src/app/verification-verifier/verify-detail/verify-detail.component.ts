import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  AssesmentControllerServiceProxy,
  AssesmentResaultControllerServiceProxy,
  Assessment,
  AssessmentResault,
  AssessmentYear,
  AssessmentYearVerificationStatus,
  Parameter,
  ParameterVerifierAcceptance,
  ProjectionResault,
  ProjectionResaultControllerServiceProxy,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';
import { VerificationService } from 'shared/verification-service';

@Component({
  selector: 'verify-detail-detail',
  templateUrl: './verify-detail.component.html',
  styleUrls: ['./verify-detail.component.css'],
})
export class VerifyDetailComponent implements OnInit {
  assesMentYearId: number = 0;
  verificationStatus: any = 0;
  assementYear: AssessmentYear = new AssessmentYear();
  parameters: any[] = [];
  baselineParameters: Parameter[] = [];
  projectParameters: Parameter[] = [];
  lekageParameters: Parameter[] = [];
  projectionParameters: Parameter[] = [];
  loading: boolean = false;
  assessmentResult: AssessmentResault = new AssessmentResault();
  projectionResult: ProjectionResault[] = [];
  selectdProjectionResult: ProjectionResault;
  isApprove: boolean = false;
  drComment = '';
  commentRequried: boolean = false;
  displayConcern: boolean = false;

  assesmentResultComment = '';
  assesmentResultCommentRequried: boolean = false;

  selectdAssementType: number;
  isApproveAssement: boolean = false;

  VerificationStatusEnum = VerificationStatus;
  concernVerificationDetails: VerificationDetail[] | undefined;
  verificationDetails: VerificationDetail[] = [];
  verificationDetailsFromDb: VerificationDetail[] = [];

  raiseConcernSection: string = '';
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

  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;

  constructor(
    private route: ActivatedRoute,
    private proxy: ServiceProxy,
    private assesmentProxy: AssesmentControllerServiceProxy,
    private assesmentResaultProxy: AssesmentResaultControllerServiceProxy,
    private projectionResultProxy: ProjectionResaultControllerServiceProxy,
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
      this.verificationStatus = params['verificationStatus'];
      console.log("verificationStatus",this.verificationStatus)
      this.flag = params['flag'];

      this.assementYear = await this.proxy
      .getOneBaseAssessmentYearControllerAssessmentYear(
        this.assesMentYearId,
        undefined,
        undefined,
        undefined
      ).toPromise()
      await this.getVerificationDetail();
      this.getAssesment();
      this.getAssesmentResult(false);
      this.getProjectionReuslt();
      console.log(this.verificationDetails)
    });

    this.loadUser();

    this.verificationProxy
      .getVerificationDetails(this.assesMentYearId)
      .subscribe((res) => {
        this.verificationDetailsFromDb = res;
        let ndcObj = this.verificationDetailsFromDb.find((o)=>o.isNDC == true);
        if(ndcObj?.isAccepted == true)
        {
          this.isNdcDisable = true;
          this.isNdcAccepted = true;
          this.isNdcDisableReject = true;
        } else {
          if (ndcObj?.explanation){
            this.isNdcDisable = true;
          }
          this.isNdcAccepted = false;
          this.isNdcDisableReject = false;
        }
        

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
      });


  
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

  async getVerificationDetail() {
    // await this.verificationProxy
    //   .getVerificationDetails(this.assesMentYearId)
    //   .subscribe((a) => {
    //     console.log(a)
    //     this.verificationDetails = a;
    //   });
    this.verificationDetails = await this.verificationProxy.getVerificationDetails(this.assesMentYearId).toPromise()
  }

  getAssesmentResult(isCalculate: boolean) {
    this.assesmentResaultProxy
      .getAssesmentResult(
        this.assementYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        "1234"
      )
      .subscribe((res) => {
        this.assessmentResult = res;
        console.log(res);
      });
  }

  getProjectionReuslt() {
    this.projectionResultProxy
      .getProjectionResult(
        this.assementYear.assessment.id,
        Number(this.assementYear.assessmentYear)
      )
      .subscribe((res) => {
        this.projectionResult = res;
      });
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

        console.log("veriifer parameters...",res.data);
      });
  }

  getAssesment() {
    this.assesmentProxy
      .getAssment(
        this.assementYear.assessment.id,
        this.assementYear.assessmentYear
      )
      .subscribe((res) => {
        console.log('rrrrrrrrrrrrrrrrr');
        console.log("para next...",res);

        this.assementYear.assessment = res;
        console.log("this.assementYear.assessment",  this.assementYear.assessment);

      console.log("this.assementYear.assessment.id",this.assementYear.assessment.id)  


        this.serviceProxy.getManyBaseAssessmentObjectiveControllerAssessmentObjective(
          undefined,
          undefined,
          ["assessmentId||$eq||"+ this.assementYear.assessment.id],
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0

          ).subscribe((res:any) => {
            console.log('asssmntObjective----',res);

           if( res.data[0])
           {
            this.assessmentObjective = res.data[0].objective;
           }
           else{
             console.log("N/A")
             this.assessmentObjective = "N/A"
           }
          console.log('asssmntObjectiveName----',this.assessmentObjective);
        });


        this.parameters = this.assementYear.assessment.parameters;

        this.parameters = this.parameters.map(para => {
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

        this.baselineParameters =
          this.assementYear.assessment.parameters.filter(
            (p) => p.isBaseline
            && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
          );
        
        for (let base of this.baselineParameters){
          if(base.isAcceptedByVerifier !=1){
            this.isBaseAccept =false;
          }
        }

        this.projectParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isProject
          && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
        );

        for (let base of this.projectParameters){
          if(base.isAcceptedByVerifier !=1){
            this.isProjectAccept =false;
          }
        }
        this.lekageParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isLekage
          && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
        );

        for (let base of this.lekageParameters){
          if(base.isAcceptedByVerifier !=1){
            this.isLeckegeAccept =false;
          }
        }
        
        
        this.projectionParameters =
          this.assementYear.assessment.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == Number(this.assementYear.assessmentYear)
              && ![ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED].includes(p.verifierAcceptance)
          );

          for (let base of this.projectionParameters){
            if(base.isAcceptedByVerifier !=1){
              this.isProjectionAccept =false;
            }
          }
          console.log("__________",this.projectionParameters)
      });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag:this.flag },
    });
  }

  submit() {
    this.verificationProxy
      .getVerificationDetails(this.assesMentYearId)
      .subscribe((a) => {
        var notaccepted = a.filter((a) => !a.isAccepted);

        if (
          notaccepted &&
          notaccepted.length > 0 &&
          this.assementYear.verificationStatus === 3
        ) {
          this.assementYear.verificationStatus = 6;
        }
      });

    //AssessmentYearVerificationStatus.NCRecieved;
    let assessment = new Assessment();
    assessment.id = this.assementYear.assessment.id;
    this.assementYear.assessment = assessment;
    this.proxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assementYear.id,
        this.assementYear
      )
      .subscribe((a) => {
        //rederict to NC Report
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
    this.selectdAssementType = event;
    this.isApproveAssement = isApprove;
  }

  OnShowOerlayDR() {
    this.drComment = '';
    this.commentRequried = false;
  }

  OnShowOerlayDRAssessment() {
    this.assesmentResultComment = '';
    this.assesmentResultCommentRequried = false;
  }

  approve(parameter: ProjectionResault) {}

  reject(parameter: ProjectionResault) {}

  drWithComment() {
    if (!this.isApprove && this.drComment === '') {
      this.commentRequried = true;
      return;
    }

    var qastatus = this.isApprove
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;

    this.projectionResultProxy
      .updateQCStatus(
        this.selectdProjectionResult.id,
        this.selectdProjectionResult.projectionYear,
        qastatus,
        this.drComment
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully updated.',
            closable: true,
          });

          var index = this.projectionResult.indexOf(
            this.selectdProjectionResult
          );

          this.selectdProjectionResult.qcStatus = this.isApprove ? 4 : 3;

          // this.parameters.splice(index, 0, this.selectdParameter);

          this.overlayDRPro.hide();
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

  drWithCommentAssesment() {
    if (!this.isApproveAssement && this.assesmentResultComment === '') {
      this.commentRequried = true;
      return;
    }

    var qastatus = this.isApproveAssement
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;

    this.assesmentResaultProxy
      .updateQCStatusAssesmentResult(
        this.assessmentResult.id,
        this.assessmentResult.assessmentYear.id,
        qastatus,
        this.selectdAssementType,
        this.assesmentResultComment
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully updated.',
            closable: true,
          });

          var index = this.projectionResult.indexOf(
            this.selectdProjectionResult
          );

          // this.projectionResult.qcStatus = this.isApprove ? 4 : 3;

          // this.parameters.splice(index, 0, this.selectdParameter);

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

  accept(IsNdc: boolean, isMethodology: boolean , isAssumption:boolean) {
    let verificationDetails: VerificationDetail[] = [];

    let currentVerification = this.verificationDetails.find(
      (a) =>
        a.isNDC == IsNdc &&
        a.isMethodology == isMethodology && 
        a.isAssumption == isAssumption &&
        a.verificationStage == this.getverificationStage()
    );
//
    let vd = new VerificationDetail();

    if (currentVerification) {
      vd = currentVerification;
      vd.updatedDate = moment();
    } else {
      vd.userVerifier = this.loggedUser.id;
      vd.createdOn = moment();
      vd.updatedDate = moment();
      vd.assessmentId = this.assementYear.assessment.id;
      let assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assementYear.id;
      vd.assessmentYear = assesmentYear;
      vd.year = Number(this.assementYear.assessmentYear);

      if (IsNdc) {
        vd.isNDC = true;
      }
      if (isMethodology) {
        vd.isMethodology = true;
      }
      if(isAssumption){
        vd.isAssumption = true;
      }


      if(IsNdc)
      {
        this.isNdcDisable = true;
        this.isNdcDisableReject = true;
      }

      if(isMethodology)
      {
        this.isMethodology = true;
        this.isMethodologyReject = true;
      }

      if(isAssumption)
      {
        this.isAssumptions = true;
        this.isAssumptionsReject = true;
      }


      
    }

    vd.verificationStage = this.getverificationStage();
    vd.verificationStatus = Number(this.assementYear.verificationStatus);

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
      this.assementYear.verificationStatus === 1 ||
      this.assementYear.verificationStatus === 2 ||
      this.assementYear.verificationStatus === 3
    ) {
      stage = 1;
    } else if (this.assementYear.verificationStatus === 4) {
      stage = 2;
    } else if (this.assementYear.verificationStatus === 5) {
      stage = 3;
    }

    return stage;
  }

  raiseConcern(isNdc: boolean, isMethodology: boolean, isAssumption:boolean) {
    if (isNdc) {
      this.raiseConcernSection = 'Aggregated Actions';
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.isNDC
      );
    }
    if (isMethodology) {
      this.raiseConcernSection = 'Methodology';
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.isMethodology
      );
    }
    if (isAssumption) {
      this.raiseConcernSection = 'Assumption';
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.isAssumption
      );
    }

    this.concernIsNdC = isNdc;
    this.concernIsMethodology = isMethodology;
    this.concernIsAssumption = isAssumption;
    this.displayConcern = true;

    if(isNdc)
    {
      this.isNdcDisable = true;
      // this.isNdcDisableReject = true;
    }

    if(isMethodology)
    {
      this.isMethodology = true;
      this.isMethodologyReject = true;
    }

    if(isAssumption)
    {
      this.isAssumptions = true;
      // this.isAssumptionsReject = true;
    }
  }

  toNonConformance() {
    this.router.navigate(['/non-conformance'], {
      queryParams: {
        id: this.assementYear.id,
        isVerificationHistory: this.flag,
        vStatus: this.verificationStatus,
      },
    });
  }

  async onComplete(e: any){
    this.verificationDetails = await this.verificationProxy.getVerificationDetails(this.assementYear.id).toPromise()
    if (e){
      this.displayConcern = false
    }
  }
}

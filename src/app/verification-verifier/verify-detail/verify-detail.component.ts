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
} from 'shared/service-proxies/service-proxies';
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
  assumption = '';
  assessmentObjective: any;

  isBaseAccept = true;
  isProjectAccept = true;
  isLeckegeAccept = true;
  isProjectionAccept = true;

  isNdcDisable = false;
  isNdcDisableReject = false;
  isMethodology = false;
  isMethodologyReject = false;
  isAssumptions = false;
  isAssumptionsReject = false;

  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;

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
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assesMentYearId = params['id'];
      this.verificationStatus = params['verificationStatus'];

      this.flag = params['flag'];

      this.proxy
        .getOneBaseAssessmentYearControllerAssessmentYear(
          this.assesMentYearId,
          undefined,
          undefined,
          undefined,
        )
        .subscribe((res) => {
          this.assessmentYear = res;
          this.getAssessment();
          this.getAssessmentResult(false);
          this.getVerificationDetail();
          this.getProjectionReuslt();
        });
    });

    this.loadUser();

    this.verificationProxy
      .getVerificationDetails(this.assesMentYearId)
      .subscribe((res) => {
        this.verificationDetailsFromDb = res;
        const ndcObj = this.verificationDetailsFromDb.find(
          (o) => o.isNDC == true,
        );
        if (ndcObj?.isAccepted == true) {
          this.isNdcDisable = true;
          this.isNdcDisableReject = true;
        }
        if (ndcObj?.isAccepted == false) {
          this.isNdcDisable = true;
          this.isNdcDisableReject = true;
        }

        const methObject = this.verificationDetailsFromDb.find(
          (o) => o.isMethodology == true,
        );
        if (methObject?.isAccepted == true) {
          this.isMethodology = true;
          this.isMethodologyReject = true;
        }
        if (methObject?.isAccepted == false) {
          this.isMethodology = true;
          this.isMethodologyReject = true;
        }

        const assumpObject = this.verificationDetailsFromDb.find(
          (o) => o.isAssumption == true,
        );
        if (assumpObject?.isAccepted == true) {
          this.isAssumptions = true;
          this.isAssumptionsReject = true;
        }
        if (assumpObject?.isAccepted == false) {
          this.isAssumptions = true;
          this.isAssumptionsReject = true;
        }
      });
  }

  loadUser() {
    const userName = localStorage.getItem('user_name')!;

    const filter1: string[] = [];
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
    await this.verificationProxy
      .getVerificationDetails(this.assesMentYearId)
      .subscribe((a) => {
        this.verificationDetails = a;
      });
  }

  getAssessmentResult(isCalculate: boolean) {
    this.assessmentResultProxy
      .getAssessmentResult(
        this.assessmentYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        environment.apiKey1,
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

  getParameters(asessmentYear: AssessmentYear) {
    const filter: string[] = [];
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
        undefined,
      )
      .subscribe((res) => {
        asessmentYear.assessment.parameters = res.data;
      });
  }

  getAssessment() {
    this.assessmentProxy
      .getAssment(
        this.assessmentYear.assessment.id,
        this.assessmentYear.assessmentYear,
      )
      .subscribe((res) => {
        this.assessmentYear.assessment = res;

        this.serviceProxy
          .getManyBaseAssessmentObjectiveControllerAssessmentObjective(
            undefined,
            undefined,
            ['assessmentId||$eq||' + this.assessmentYear.assessment.id],
            undefined,
            undefined,
            undefined,
            1000,
            0,
            0,
            0,
          )
          .subscribe((res: any) => {
            if (res.data[0]) {
              this.assessmentObjective = res.data[0].objective;
            } else {
              this.assessmentObjective = 'N/A';
            }
          });

        this.parameters = this.assessmentYear.assessment.parameters;

        this.baselineParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isBaseline,
        );

        for (const base of this.baselineParameters) {
          if (base.isAcceptedByVerifier != 1) {
            this.isBaseAccept = false;
          }
        }

        this.projectParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isProject,
        );

        for (const base of this.projectParameters) {
          if (base.isAcceptedByVerifier != 1) {
            this.isProjectAccept = false;
          }
        }
        this.lekageParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isLekage,
        );

        for (const base of this.lekageParameters) {
          if (base.isAcceptedByVerifier != 1) {
            this.isLeckegeAccept = false;
          }
        }

        this.projectionParameters = this.assessmentYear.assessment.parameters.filter(
          (p) =>
            p.isProjection &&
            p.projectionBaseYear == Number(this.assessmentYear.assessmentYear),
        );

        for (const base of this.projectionParameters) {
          if (base.isAcceptedByVerifier != 1) {
            this.isProjectionAccept = false;
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
        },
      );
  }

  parameterAccept(
    isNdc: boolean,
    isMethodology: boolean,
    isAssumption: boolean,
  ) {
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the parameter(s) ?',
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

  raiseConcern(isNdc: boolean, isMethodology: boolean, isAssumption: boolean) {
    if (isNdc) {
      this.raiseConcernSection = 'Aggregated Actions';
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.isNDC,
      );
    }
    if (isMethodology) {
      this.raiseConcernSection = 'Methodology';
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.isMethodology,
      );
    }
    if (isAssumption) {
      this.raiseConcernSection = 'Assumption';
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.isAssumption,
      );
    }

    this.concernIsNdC = isNdc;
    this.concernIsMethodology = isMethodology;
    this.concernIsAssumption = isAssumption;
    this.displayConcern = true;

    if (isNdc) {
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

  toNonConformance() {
    this.router.navigate(['/non-conformance'], {
      queryParams: {
        id: this.assessmentYear.id,
        isVerificationHistory: this.flag,
        vStatus: this.verificationStatus,
      },
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  AssesmentControllerServiceProxy,
  AssesmentResaultControllerServiceProxy,
  Assessment,
  AssessmentResault,
  AssessmentYear,
  Ndc,
  Parameter,
  Project,
  ProjectionResault,
  ProjectionResaultControllerServiceProxy,
  ServiceProxy,
  SubNdc,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verify-detail-sectorAdmin',
  templateUrl: './verify-detail.component.html',
  styleUrls: ['./verify-detail.component.css'],
})
export class VerifyDetailSectorAdminComponent implements OnInit {
  assesMentYearId = 0;
  verificationStatus = 0;
  assementYear: AssessmentYear = new AssessmentYear();
  parameters: Parameter[] = [];
  baselineParameters: Parameter[] = [];
  projectParameters: Parameter[] = [];
  lekageParameters: Parameter[] = [];
  projectionParameters: Parameter[] = [];
  loading = false;
  assessmentResult: AssessmentResault = new AssessmentResault();
  projectionResult: ProjectionResault[] = [];
  selectdProjectionResult: ProjectionResault;
  isApprove = false;
  drComment = '';
  commentRequried = false;
  displayConcern = false;
  flag = 1;
  assesmentResultComment = '';
  assesmentResultCommentRequried = false;
  assessmentObjective: any;

  selectdAssementType: number;
  isApproveAssement = false;

  ndcList: Ndc[];
  selectedNdc: Ndc;
  selectedSubNdc: SubNdc;

  VerificationStatusEnum = VerificationStatus;
  concernVerificationDetails: VerificationDetail[] | undefined;
  verificationDetails: VerificationDetail[] = [];

  raiseConcernSection = '';
  concernIsMethodology: boolean;
  concernIsNdC: boolean;
  concernIsAssumption: boolean;

  loggedUser: User;
  assumption = '';

  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;

  constructor(
    private route: ActivatedRoute,
    private assesmentProxy: AssesmentControllerServiceProxy,
    private assesmentResaultProxy: AssesmentResaultControllerServiceProxy,
    private projectionResultProxy: ProjectionResaultControllerServiceProxy,
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

      this.serviceProxy
        .getManyBaseNdcControllerNdc(
          undefined,
          undefined,
          undefined,
          undefined,
          ['name,ASC'],
          ['subNdc'],
          1000,
          0,
          0,
          0,
        )
        .subscribe((res: any) => {
          this.ndcList = res.data;
        });

      this.serviceProxy
        .getOneBaseAssessmentYearControllerAssessmentYear(
          this.assesMentYearId,
          undefined,
          undefined,
          undefined,
        )
        .subscribe((res) => {
          this.assementYear = res;

          this.serviceProxy
            .getManyBaseAssessmentObjectiveControllerAssessmentObjective(
              undefined,
              undefined,
              ['assessmentId||$eq||' + this.assementYear?.assessment?.id],
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
                this.assessmentObjective = res.data[0]?.objective;
              } else {
                this.assessmentObjective = '-';
              }
            });

          this.getAssesment();
          this.getProjectionResult();
          this.getAssesmentResult(false);
          this.getVerificationDetail();
        });
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

  getAssesmentResult(isCalculate: boolean) {
    this.assesmentResaultProxy
      .getAssesmentResult(
        this.assementYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        '1234',
      )
      .subscribe((res) => {
        this.assessmentResult = res;
      });
  }

  getProjectionResult() {
    this.projectionResultProxy
      .getProjectionResult(
        this.assementYear.assessment.id,
        Number(this.assementYear.assessmentYear),
      )
      .subscribe((res) => {
        this.projectionResult = res;
      });
  }

  getParameters(asessmentYear: AssessmentYear) {
    const filter: string[] = [];
    filter.push('assessment.id||$eq||' + asessmentYear.assessment.id);
    filter.push('projectionYear||$eq||' + asessmentYear.assessmentYear);

    this.serviceProxy
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

  getAssesment() {
    this.assesmentProxy
      .getAssment(
        this.assementYear.assessment.id,
        this.assementYear.assessmentYear,
      )
      .subscribe((res) => {
        this.assementYear.assessment = res;

        this.parameters = this.assementYear.assessment.parameters;

        this.baselineParameters =
          this.assementYear.assessment.parameters.filter((p) => p.isBaseline);

        this.projectParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isProject,
        );
        this.lekageParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isLekage,
        );

        this.projectionParameters =
          this.assementYear.assessment.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == Number(this.assementYear.assessmentYear),
          );
        const p = this.assementYear.assessment.parameters.filter(
          (p) => p.isProjection,
        );

        this.selectedNdc = this.ndcList.find(
          (a) => a.id == this.assementYear.assessment.ndc?.id,
        )!;

        this.selectedSubNdc = this.selectedNdc?.subNdc.find(
          (a) => a.id == this.assementYear.assessment.subNdc?.id,
        )!;
      });
  }

  back() {
    this.router.navigate(['/verification-sector-admin']);
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

  drWithCommentAssesment() {
    if (!this.isApproveAssement && this.assesmentResultComment === '') {
      this.commentRequried = true;
      return;
    }

    const qastatus = this.isApproveAssement
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;

    this.assesmentResaultProxy
      .updateQCStatusAssesmentResult(
        this.assessmentResult.id,
        this.assessmentResult.assessmentYear.id,
        qastatus,
        this.selectdAssementType,
        this.assesmentResultComment,
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully updated.',
            closable: true,
          });

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

  parameterAccept(isNdc: boolean, isMethodology: boolean) {
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the parameter(s) ?',
      header: 'Accept Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.accept(isNdc, isMethodology);
      },
      reject: () => {},
    });
  }

  accept(IsNdc: boolean, isMethodology: boolean) {
    const verificationDetails: VerificationDetail[] = [];

    const currentVerification = this.verificationDetails.find(
      (a) =>
        a.isNDC == IsNdc &&
        a.isMethodology == isMethodology &&
        a.verificationStage == this.getverificationStage(),
    );

    let vd = new VerificationDetail();

    if (currentVerification) {
      vd = currentVerification;
      vd.updatedDate = moment();
    } else {
      vd.createdOn = moment();
      vd.updatedDate = moment();
      vd.userVerifier = this.loggedUser.id;
      vd.assessmentId = this.assementYear.assessment.id;
      const assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assementYear.id;
      vd.assessmentYear = assesmentYear;
      vd.year = Number(this.assementYear.assessmentYear);

      if (IsNdc) {
        vd.isNDC = true;
      }
      if (isMethodology) {
        vd.isMethodology = true;
      }
    }

    if (this.assementYear.verificationStatus === 1) {
      vd.verificationStatus = 2;
      vd.verificationStage = 1;
    } else if (this.assementYear.verificationStatus === 3) {
      vd.verificationStatus = 4;
      vd.verificationStage = 2;
    } else {
      vd.verificationStatus = 5;
      vd.verificationStage = 3;
    }

    vd.isAccepted = true;

    verificationDetails.push(vd);

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Save.',
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

  raiseConcern(isNdc: boolean, isMethodology: boolean, isAssumption: boolean) {
    if (isNdc) {
      this.raiseConcernSection = 'NDC';
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
  }

  sendForVerification() {
    this.assementYear.verificationStatus = 2;
    this.assementYear.assessmentAssumption = this.assumption;
    const assessment = new Assessment();
    assessment.id = this.assementYear.assessment.id;
    this.assementYear.assessment = assessment;
    this.serviceProxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assementYear.id,
        this.assementYear,
      )
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Successfully sent to verification',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

  async ndcAction() {
    const action = `Ndc changed  Original Value : ${this.assementYear.assessment.project.ndc.name} New Value : ${this.selectedNdc.name} \n
      Sub Ndc changed  Original Value : ${this.assementYear.assessment.project.subNdc.name} New Value : ${this.selectedSubNdc.name} \n`;

    this.assementYear.assessment.project.ndc = this.selectedNdc;
    this.assementYear.assessment.project.subNdc = this.selectedSubNdc;

    const project: Project = await this.serviceProxy
      .getOneBaseProjectControllerProject(
        this.assementYear.assessment.project.id,
        undefined,
        undefined,
        undefined,
      )
      .toPromise();

    const ndc = new Ndc();
    ndc.id = this.selectedNdc.id;
    project.ndc = ndc;

    const subNdc = new SubNdc();
    subNdc.id = this.selectedSubNdc.id;
    project.subNdc = subNdc;

    this.serviceProxy
      .updateOneBaseProjectControllerProject(project.id, project)
      .subscribe(
        (res) => {
          this.saveVerificationDetails(true, false, action);
        },
        (error) => {},
      );
  }

  toNonConformance() {
    this.router.navigate(['/non-conformance'], {
      queryParams: { id: this.assementYear.id, flag: 'sec-admin' },
    });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag: this.flag },
    });
  }

  saveVerificationDetails(
    IsNdc: boolean,
    isMethodology: boolean,
    action: string,
  ) {
    const verificationDetails: VerificationDetail[] = [];

    const currentVerification = this.verificationDetails.find(
      (a) =>
        a.isNDC == IsNdc &&
        a.isMethodology == isMethodology &&
        a.verificationStage == this.getverificationStage(),
    );

    let vd = new VerificationDetail();

    if (currentVerification) {
      vd = currentVerification;
      const assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assementYear.id;
      vd.assessmentYear = assesmentYear;
      vd.updatedDate = moment();
    } else {
      vd.createdOn = moment();
      vd.updatedDate = moment();
      vd.userVerifier = this.loggedUser.id;
      vd.assessmentId = this.assementYear.assessment.id;
      const assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assementYear.id;
      vd.assessmentYear = assesmentYear;
      vd.year = Number(this.assementYear.assessmentYear);

      if (IsNdc) {
        vd.isNDC = true;
      }
      if (isMethodology) {
        vd.isMethodology = true;
      }
    }

    vd.action = action;
    vd.verificationStage = this.getverificationStage();

    verificationDetails.push(vd);

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Save.',
          closable: true,
        });
      });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import {
  AssessmentControllerServiceProxy,
  AssessmentResultControllerServiceProxy,
  Assessment,
  AssessmentResult,
  AssessmentYear,
  Parameter,
  ParameterControllerServiceProxy,
  ProjectionResult,
  ProjectionResultControllerServiceProxy,
  AssessmentYearControllerServiceProxy,
  ServiceProxy,
  VerificationDetail,
  ParameterVerifierAcceptance,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-quality-check-detail',
  templateUrl: './quality-check-detail.component.html',
  styleUrls: ['./quality-check-detail.component.css'],
})
export class QualityCheckDetailComponent implements OnInit {
  assesMentYearId = 0;
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

  assessmentResultComment = '';
  assessmentResultCommentRequried = false;

  selectdAssessmentType: number;
  isApproveAssessment = false;
  flag: number;
  macValList: any;
  discountrate: any = null;
  macResult: any;
  assessmentList1: Assessment[] = [];
  macValue: any = {
    DiscountRate: '',
    reduction: '',
    year: '',
    baseline: {
      bsTotalInvestment: '',
      bsAnnualOM: '',
      bsOtherAnnualCost: '',
      bsAnnualFuel: '',
      bsProjectLife: '',
    },
    project: {
      psTotalInvestment: '',
      psOtherAnnualCost: '',
      psAnnualOM: '',
      psAnnualFuel: '',
      psProjectLife: '',
    },
  };
  isDisable: boolean = false;
  asseYearId: number;
  asseId: number;
  asseResult: any[] = [];
  projectionResults: any[] = [];
  isReadyToCAl: boolean;
  flagQC: number = 1;
  baseImage: any;
  projectImage: any;
  projectionImage: any;
  leakageImage: any;
  resultImage: any;
  methodDocument: any;
  assessmentType: string;
  isbsResultButtonsDisable: boolean = false;
  isbsResultButtonsDisableReject: boolean = false;
  ispsResultButtonsDisable: boolean = false;
  ispsResultButtonsDisableReject: boolean = false;
  islkResultButtonsDisable: boolean = false;
  islkResultButtonsDisableReject: boolean = false;
  isteResultButtonsDisable: boolean = false;
  isteResultButtonsDisableReject: boolean = false;
  ismacResultButtonsDisable: boolean = false;
  ismacResultButtonsDisableReject: boolean = false;
  iscdResultButtonsDisable: boolean = false;
  iscdResultButtonsDisableReject: boolean = false;
  isbstacResultButtonsDisable: boolean = false;
  isbstacResultButtonsDisableReject: boolean = false;
  ispstacResultButtonsDisable: boolean = false;
  ispstacResultButtonsDisableReject: boolean = false;
  isProjectionResultButtonsDisable: boolean = false;
  isProjectionResultButtonsDisableReject: boolean = false;
  asseResultFromDB: AssessmentResult;

  isSubmitButtondisable: boolean = false;

  isApproveAllAssessmentResult: boolean = false;
  isApproveAllProjectionResult: boolean = false;
  verificationStatusIsNull: boolean = false;
  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;
  roundOneHeadTable: any;
  roundTwoHeadTable: any;
  roundThreeHeadTable: any;
  resultVds: any[] = []
  displayAction: boolean = false
  verificationList: VerificationDetail[]

  constructor(
    private route: ActivatedRoute,
    private proxy: ServiceProxy,
    private assessmentProxy: AssessmentControllerServiceProxy,
    private assessmentResultProxy: AssessmentResultControllerServiceProxy,
    private projectionResultProxy: ProjectionResultControllerServiceProxy,
    private assessmentYearControllerServiceProxy: AssessmentYearControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private paramProxy: ParameterControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assesMentYearId = params['id'];
      this.flag = params['flag'];
      this.proxy
        .getOneBaseAssessmentYearControllerAssessmentYear(
          this.assesMentYearId,
          undefined,
          undefined,
          undefined
        )
        .subscribe(async (res) => {
          this.assessmentYear = res;
          if (this.assessmentYear.qaStatus == 3 || this.assessmentYear.qaStatus == 4) {
            this.isSubmitButtondisable = true;
          }
          this.asseYearId = this.assessmentYear.id;
          this.asseId = this.assessmentYear.assessment.id;

          if (this.assessmentYear.verificationStatus == undefined || this.assessmentYear.verificationStatus == null || this.assessmentYear.verificationStatus === 8) {
            this.verificationStatusIsNull = true;

          }
          let filterResult: string[] = new Array();
          filterResult.push('assessmentYear.id||$eq||' + this.asseYearId) &
            filterResult.push('assessment.id||$eq||' + this.asseId);
          this.serviceProxy.getManyBaseAssessmentResultControllerAssessmentResult
            (
              undefined,
              undefined,
              filterResult,
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0
            )
            .subscribe(async (res: any) => {
              this.asseResult = res.data;
              if (this.asseResult.length > 0 && this.asseResult[0]?.isResultupdated && !this.asseResult[0].isResultRecalculating) {
                this.isReadyToCAl = false;
                this.isDisable = true;

                if (this.asseResult[0].qcStatusBaselineResult == 4) {
                  this.isbsResultButtonsDisable = true;
                  this.isbsResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatusBaselineResult == 3) {
                  this.isbsResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatuProjectResult == 4) {
                  this.ispsResultButtonsDisable = true;
                  this.ispsResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatuProjectResult == 3) {
                  this.ispsResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatusLekageResult == 4) {
                  this.islkResultButtonsDisable = true;
                  this.islkResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatusLekageResult == 3) {
                  this.islkResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatusTotalEmission == 4) {
                  this.isteResultButtonsDisable = true;
                  this.isteResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatusTotalEmission == 3) {
                  this.isteResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatusmacResult == 4) {
                  this.ismacResultButtonsDisable = true;
                  this.ismacResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatusmacResult == 3) {
                  this.ismacResultButtonsDisable = true;
                  this.ismacResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatuscostDifference == 4) {
                  this.iscdResultButtonsDisable = true;
                  this.iscdResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatuscostDifference == 3) {
                  this.iscdResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatuspsTotalAnnualCost == 4) {
                  this.ispstacResultButtonsDisable = true;
                  this.ispstacResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatuspsTotalAnnualCost == 3) {
                  this.ispstacResultButtonsDisableReject = true;
                }

                if (this.asseResult[0].qcStatusbsTotalAnnualCost == 4) {
                  this.isbstacResultButtonsDisable = true;
                  this.isbstacResultButtonsDisableReject = true;
                }
                if (this.asseResult[0].qcStatusbsTotalAnnualCost == 4) {
                  this.isbstacResultButtonsDisableReject = true;
                }

                this.isApproveAllAssessmentResult = await this.assessmentResultProxy.checkAllQCApprovmentAssessmentResult(this.asseResult[0].id).toPromise();
              }
              else {
                this.assessmentProxy
                  .checkAssessmentReadyForCalculate(this.assessmentYear.assessment.id, Number(this.assessmentYear.assessmentYear))
                  .subscribe((r) => {
                    this.isReadyToCAl = r;
                  });
              }
            });


          let filterProjectionResult: string[] = new Array();
          filterProjectionResult.push('assessment.id||$eq||' + this.asseId);
          this.serviceProxy.getManyBaseProjectionResultControllerProjectionResult
            (
              undefined,
              undefined,
              filterProjectionResult,
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0
            )
            .subscribe((res: any) => {
              this.projectionResults = res.data;

              if (this.projectionResults.length > 0) {
                if (this.projectionResults[0].qcStatus == 4) {
                  this.isProjectionResultButtonsDisable = true
                  this.isProjectionResultButtonsDisableReject = true;
                }
              }
            });

          this.getAssessment();
          this.getAssessmentResult(false);
          this.getProjectionResult();
          await this.getVerificationDetails()
        });
    });
  }

  async getVerificationDetails() {
    this.verificationList = (await this.assessmentYearControllerServiceProxy
      .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assessmentYear.assessment.id, this.assessmentYear.assessmentYear)
      .toPromise())[0]?.verificationDetail;
  }

  getAssessmentResult(isCalculate: boolean) {
    this.assessmentResultProxy
      .getAssessmentResult(
        this.assessmentYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        '',
        environment.apiKey1
        // true
      )
      .subscribe((res) => {
        this.assessmentResult = res;
        if (isCalculate) {
          this.getAssessmentResult(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Calculation completed.',
            closable: true,
          });
        }
      });
  }

  getProjectionResult() {
    this.projectionResultProxy
      .getProjectionResult(
        this.assessmentYear.assessment.id,
        Number(this.assessmentYear.assessmentYear),
      )
      .subscribe((res) => {
        this.projectionResult = res;
      });
  }

  addItem(newItem: boolean) {
    this.isReadyToCAl = newItem;
  }

  openDoc() {
    if (this.methodDocument == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error,No documents for this methodology!.',
      });
    } else {
      window.location.href = this.methodDocument;
    }
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

  parameterFilter(p: Parameter){
    if ((p.isDefault || p.isHistorical) && !p.previouseParameterId){
      return ![
        ParameterVerifierAcceptance.REJECTED,
        ParameterVerifierAcceptance.RETURNED,
        ParameterVerifierAcceptance.DATA_ENTERED
      ].includes(p.verifierAcceptance)
    } else {
      return ![
        ParameterVerifierAcceptance.REJECTED,
        ParameterVerifierAcceptance.RETURNED
      ].includes(p.verifierAcceptance)
    }
  }

  getAssessment() {
    this.assessmentProxy
      .getAssment(
        this.assessmentYear.assessment.id,
        this.assessmentYear.assessmentYear
      )
      .subscribe((res) => {
        this.assessmentYear.assessment = res;

        this.baseImage = this.assessmentYear.assessment?.methodology?.baselineImage;
        this.projectImage = this.assessmentYear.assessment?.methodology?.projectImage;
        this.projectionImage = this.assessmentYear.assessment?.methodology?.projectionImage;
        this.leakageImage = this.assessmentYear.assessment?.methodology?.leakageImage;
        this.resultImage = this.assessmentYear.assessment?.methodology?.resultImage;
        this.methodDocument = this.assessmentYear.assessment?.methodology?.documents;
        this.assessmentType = this.assessmentYear.assessment?.assessmentType;
        this.parameters = this.assessmentYear.assessment.parameters;

        let statusToRemove = [ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED]

        this.baselineParameters =
          this.assessmentYear.assessment.parameters.filter(
            (p) => p.isBaseline
              && this.parameterFilter(p)
          );

        this.projectParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isProject
            && this.parameterFilter(p)
        );
        this.lekageParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isLekage
            && this.parameterFilter(p)
        );
        this.projectionParameters =
          this.assessmentYear.assessment.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == Number(this.assessmentYear.assessmentYear)
              && this.parameterFilter(p)
          );
      });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag: this.flagQC },
    });
  }

  async submit() {
    let notReceived = 0
    let status = [ParameterVerifierAcceptance.RETURNED]
    for await (let para of this.assessmentYear.assessment.parameters) {
      if (status.includes(para.verifierAcceptance)) {
        notReceived += 1
      }
    }
    if (notReceived > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: "Warning",
        detail: "There are parameters in data collection path"
      })
    } else {
      if (this.assessmentYear.assessment.assessmentType != 'MAC') {
        this.getAssessmentResult(true);
      } else {
          this.toCalMacResult();
      }
      setTimeout(() => {
      this.isReadyToCAl = false;
      this.isDisable = true;
      window.location.reload()
    },5500);
    }
  }

  toCalMacResult() {
    let filter1: string[] = new Array();
    filter1.push('assessment.id||$eq||' + this.assessmentYear.assessment.id);
    this.serviceProxy
      .getManyBaseParameterControllerParameter(
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
        this.macValList = res.data;
        this.discountrate = this.macValList.find(
          (o: any) => o.name == 'Discount Rate'
        ).value;

        this.macValue = {
          DiscountRate: this.macValList.find(
            (o: any) => o.name == 'Discount Rate'
          ).value,
          reduction: this.macValList.find((o: any) => o.name == 'Reduction')
            .value,
          year: this.assessmentYear.assessmentYear,
          baseline: {
            bsTotalInvestment: Number(this.macValList.find(
              (o: any) => o.name == 'Baseline Scenario Total Investment'
            ).value),
            bsAnnualOM: Number(this.macValList.find(
              (o: any) => o.name == 'Baseline Scenario Annual O&M'
            ).value),
            bsOtherAnnualCost: Number(this.macValList.find(
              (o: any) => o.name == 'Baseline Scenario Other Annual Cost'
            ).value),
            bsAnnualFuel: Number(this.macValList.find(
              (o: any) => o.name == 'Baseline Scenario Annual Fuel'
            ).value),
            bsProjectLife: Number(this.macValList.find(
              (o: any) => o.name == 'Baseline Scenario Project Life'
            ).value),
          },
          project: {
            psTotalInvestment: Number(this.macValList.find(
              (o: any) => o.name == 'Project Scenario Total Investment'
            ).value),
            psOtherAnnualCost: Number(this.macValList.find(
              (o: any) => o.name == 'Project Scenario Other Annual Cost'
            ).value),
            psAnnualOM: Number(this.macValList.find(
              (o: any) => o.name == 'Project Scenario Annual O&M'
            ).value),
            psAnnualFuel: Number(this.macValList.find(
              (o: any) => o.name == 'Project Scenario Annual Fuel'
            ).value),
            psProjectLife: Number(this.macValList.find(
              (o: any) => o.name == 'Project Scenario Project Life'
            ).value),
          },
        };

        let macUrl = environment.baseUrlMac;
        let headers = new HttpHeaders().set('api-key', environment.apiKey1);
        this.httpClient.post<any>(macUrl, this.macValue, { 'headers': headers }).subscribe(
          (res) => {
            this.macResult = res;

            setTimeout(async () => {
              let filter = ['assessmentYear.id||$eq||' + this.assessmentYear.id]
              let assessmentResult
              let res = await this.serviceProxy.getManyBaseAssessmentResultControllerAssessmentResult(
                undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
              ).toPromise()

              if (res.data.length > 0) {
                assessmentResult = res.data[0]
              } else {
                assessmentResult = new AssessmentResult();
              }
              assessmentResult.bsTotalAnnualCost =
                this.macResult['baseLineAnnualCost'];
              assessmentResult.psTotalAnnualCost =
                this.macResult['projecrAnnualCost'];
              assessmentResult.costDifference =
                this.macResult['totalAnnualCost']; //this should be checked
              assessmentResult.macResult = this.macResult['mac']; //this.result.mac;
              assessmentResult.assessmentYear.id = this.assesMentYearId;
              assessmentResult.assessment.id = this.assessmentYear.assessment.id;
              assessmentResult.isResultupdated = true
              assessmentResult.isResultRecalculating = false
              this.assessmentResult = assessmentResult;
              this.serviceProxy
                .createOneBaseAssessmentResultControllerAssessmentResult(
                  this.assessmentResult
                )
                .subscribe((res: any) => {
                  if (res != null) {

                  }
                  setTimeout(() => {
                    this.serviceProxy
                      .getManyBaseAssessmentControllerAssessment(
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        ['editedOn,DESC'],
                        undefined,
                        1000,
                        0,
                        0,
                        0
                      )
                      .subscribe(
                        (res: any) => {
                          this.assessmentList1 = res.data;
                        },
                        (error) => {
                          this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error,please try again!.',
                          });
                        }
                      );
                  }, 1000);
                });
            }, 1000);
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Calculation Engine Error. Please Try again later!',
            });
          }
        );
      });
  }


  toOpenImage() {
    if (this.resultImage == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error,No Equation for this methodology!.',
      });
    }
    else {
      window.location.href = this.resultImage;
    }

  }


  back() {
    this.router.navigate(['/qc'], {});
  }

  calculateButtonDisable() {
    if (this.assessmentYear.assessment.assessmentType == 'MAC') {
      return false;
    } else {
      return !(
        this.isAllSubmit()
      );
    }
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

  approve(parameter: ProjectionResult) { }

  reject(parameter: ProjectionResult) { }

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
        async (res: any) => {
          if (res.qcStatus == 4) {
            this.isProjectionResultButtonsDisable = true;
            this.isProjectionResultButtonsDisableReject = true;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated.',
            closable: true,
          });

          var index = this.projectionResult.indexOf(
            this.selectdProjectionResult
          );
          this.selectdProjectionResult.qcStatus = this.isApprove ? 4 : 3;
          this.isApproveAllProjectionResult = await this.projectionResultProxy.checkAllQCApprovmentProjectionResult(this.asseId).toPromise();


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

    var qastatus = this.isApproveAssessment
      ? QuAlityCheckStatus.Pass
      : QuAlityCheckStatus.Fail;

    this.assessmentResultProxy
      .updateQCStatusAssessmentResult(
        this.assessmentResult.id,
        this.assessmentResult.assessmentYear.id,
        qastatus,
        this.selectdAssessmentType,
        this.assessmentResultComment
      )
      .subscribe(
        async (res: any) => {
          if (res.qcStatusBaselineResult == 4) {
            this.isbsResultButtonsDisable = true;
            this.isbsResultButtonsDisableReject = true;
          }
          if (res.qcStatusBaselineResult == 3) {
            this.isbsResultButtonsDisableReject = true;
          }

          if (res.qcStatuProjectResult == 4) {
            this.ispsResultButtonsDisable = true;
            this.ispsResultButtonsDisableReject = true;
          }
          if (res.qcStatuProjectResult == 3) {
            this.ispsResultButtonsDisableReject = true;
          }

          if (res.qcStatusLekageResult == 4) {
            this.islkResultButtonsDisable = true;
            this.islkResultButtonsDisableReject = true;
          }
          if (res.qcStatusLekageResult == 3) {
            //this.islkResultButtonsDisable = true;
            this.islkResultButtonsDisableReject = true;
          }

          if (res.qcStatusTotalEmission == 4) {
            this.isteResultButtonsDisable = true;
            this.isteResultButtonsDisableReject = true;
          }
          if (res.qcStatusTotalEmission == 3) {
            // this.isteResultButtonsDisable = true;
            this.isteResultButtonsDisableReject = true;
          }

          if (res.qcStatusmacResult == 4) {
            this.ismacResultButtonsDisable = true;
            this.ismacResultButtonsDisableReject = true;
          }
          if (res.qcStatusmacResult == 3) {
            // this.ismacResultButtonsDisable = true;
            this.ismacResultButtonsDisableReject = true;
          }

          if (res.qcStatuscostDifference == 4) {
            this.iscdResultButtonsDisable = true;
            this.iscdResultButtonsDisableReject = true;
          }
          if (res.qcStatuscostDifference == 3) {
            //this.iscdResultButtonsDisable = true;
            this.iscdResultButtonsDisableReject = true;
          }

          if (res.qcStatuspsTotalAnnualCost == 4) {
            this.ispstacResultButtonsDisable = true;
            this.ispstacResultButtonsDisableReject = true;
          }
          if (res.qcStatuspsTotalAnnualCost == 3) {
            // this.ispstacResultButtonsDisable = true;
            this.ispstacResultButtonsDisableReject = true;
          }

          if (res.qcStatusbsTotalAnnualCost == 4) {
            this.isbstacResultButtonsDisable = true;
            this.isbstacResultButtonsDisableReject = true;
          }
          if (res.qcStatusbsTotalAnnualCost == 3) {
            //this.isbstacResultButtonsDisable = true;
            this.isbstacResultButtonsDisableReject = true;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated.',
            closable: true,
          });

          const index = this.projectionResult.indexOf(
            this.selectdProjectionResult,
          );

          if (this.selectdAssessmentType === 1) {
            this.assessmentResult.qcStatusBaselineResult = this
              .isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 2) {
            this.assessmentResult.qcStatuProjectResult = this
              .isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 3) {
            this.assessmentResult.qcStatusLekageResult = this
              .isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 4) {
            this.assessmentResult.qcStatusTotalEmission = this
              .isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 6) {
            this.assessmentResult.qcStatusmacResult = this.isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 7) {
            this.assessmentResult.qcStatuscostDifference = this
              .isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 8) {
            this.assessmentResult.qcStatuspsTotalAnnualCost = this
              .isApproveAssessment
              ? 4
              : 3;
          } else if (this.selectdAssessmentType === 9) {
            this.assessmentResult.qcStatusbsTotalAnnualCost = this
              .isApproveAssessment
              ? 4
              : 3;
          }

          this.isApproveAllAssessmentResult = await this.assessmentResultProxy
            .checkAllQCApprovmentAssessmentResult(this.assessmentResult.id)
            .toPromise();

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




  async submitStatus() {
    let para = this.parameters;
    para = para.filter((o) => o.parameterRequest != null);
    let isallPass =
      para.find((m) => m.parameterRequest?.qaStatus !== 4) ===
      undefined;

    if (this.assessmentYear.assessment.assessmentType == 'MAC') {
      isallPass = true;
    }

    this.assessmentYear.qaStatus = isallPass ? 4 : 3;

    if (isallPass) {
      if (this.assessmentYear.verificationStatus === 8) {
        await this.checkVerificationStage()
        if (this.roundOneHeadTable != undefined) {
          this.assessmentYear.verificationStatus = 4;
        }

        if (this.roundTwoHeadTable != undefined) {
          this.assessmentYear.verificationStatus = 5;
        }

      } else {
        this.assessmentYear.verificationStatus = 1;
      }

    }

    let tempassessmentYear = this.assessmentYear;

    let assesemt = new Assessment();
    assesemt.id = tempassessmentYear.assessment.id;
    tempassessmentYear.assessment = assesemt;

    this.proxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assesMentYearId,
        tempassessmentYear,
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated.',
            closable: true,
          });
          this.assessmentYearControllerServiceProxy.email(this.assesMentYearId);
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
    this.isSubmitButtondisable = true;
  }

  async checkVerificationStage() {
    let verificationList = (await this.assessmentYearControllerServiceProxy
      .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assessmentYear.assessment.id, this.assessmentYear.assessmentYear)
      .toPromise())[0]?.verificationDetail;
    this.roundOneHeadTable = verificationList?.find((o: any) => o.verificationStage == 1);
    this.roundTwoHeadTable = verificationList?.find((o: any) => o.verificationStage == 2);
    this.roundThreeHeadTable = verificationList?.find((o: any) => o.verificationStage == 3);
  }

  async getResultInfo(type: any) {
    this.resultVds = []
    let verificationList = (await this.assessmentYearControllerServiceProxy
      .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assessmentYear.assessment.id, this.assessmentYear.assessmentYear)
      .toPromise())[0]?.verificationDetail;
    let column: string
    if (type === 'project') {
      column = 'isProject'
    } else if (type === 'baseline') {
      column = 'isBaseline'
    } else if (type === 'leakage') {
      column = 'isLekage'
    } else if (type === 'projection') {
      column = 'isProjection'
    } else if (type === 'bsTotal') {
      column = 'isBaseline'
    } else if (type === 'psTotal') {
      column = 'isProject'
    } else if (type === 'final') {
      column = 'isTotal'
    } else if (type === 'mac') {
      column = 'isMac'
    } else if (type === 'difference') {
      column = 'isDifference'
    }

    let vd = verificationList.filter((o: any) => o.isResult === true && o[column] === true)
    vd.sort((a: any, b: any) => a.verificationStage - b.verificationStage);
    this.resultVds = vd
    this.resultVds = this.resultVds.map(res => {
      let comment = res.action?.split('|')
      if (comment) {
        res['commentBy'] = comment[0]
        res['comment'] = comment[1]
        return res
      }
    })

    this.displayAction = true
  }

  checkShowInfo(type: string) {
    let column: string
    if (type === 'project') {
      column = 'isProject'
    } else if (type === 'baseline') {
      column = 'isBaseline'
    } else if (type === 'leakage') {
      column = 'isLekage'
    } else if (type === 'projection') {
      column = 'isProjection'
    } else if (type === 'bsTotal') {
      column = 'isBaseline'
    } else if (type === 'psTotal') {
      column = 'isProject'
    } else if (type === 'final') {
      column = 'isTotal'
    } else if (type === 'mac') {
      column = 'isMac'
    } else if (type === 'difference') {
      column = 'isDifference'
    }

    let vd = this.verificationList?.find((o: any) => o.isResult === true && o[column] === true && o.action)

    if (vd) {
      return true
    } else {
      return false
    }
  }
}

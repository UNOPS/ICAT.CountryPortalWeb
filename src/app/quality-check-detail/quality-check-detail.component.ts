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
  isDisable = false;
  asseYearId: number;
  asseId: number;
  asseResult: any[] = [];
  projectionResults: any[] = [];
  isReadyToCAl: boolean;
  flagQC = 1;
  baseImage: any;
  projectImage: any;
  projectionImage: any;
  leakageImage: any;
  resultImage: any;
  methodDocument: any;
  assessmentType: string;
  isbsResultButtonsDisable = false;
  isbsResultButtonsDisableReject = false;
  ispsResultButtonsDisable = false;
  ispsResultButtonsDisableReject = false;
  islkResultButtonsDisable = false;
  islkResultButtonsDisableReject = false;
  isteResultButtonsDisable = false;
  isteResultButtonsDisableReject = false;
  ismacResultButtonsDisable = false;
  ismacResultButtonsDisableReject = false;
  iscdResultButtonsDisable = false;
  iscdResultButtonsDisableReject = false;
  isbstacResultButtonsDisable = false;
  isbstacResultButtonsDisableReject = false;
  ispstacResultButtonsDisable = false;
  ispstacResultButtonsDisableReject = false;
  isProjectionResultButtonsDisable = false;
  isProjectionResultButtonsDisableReject = false;
  asseResultFromDB: AssessmentResult;

  isSubmitButtondisable = false;

  isApproveAllAssessmentResult = false;
  verificationStatusIsNull = false;
  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;

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
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assesMentYearId = params['id'];
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
          if (
            this.assessmentYear.qaStatus == 3 ||
            this.assessmentYear.qaStatus == 4
          ) {
            this.isSubmitButtondisable = true;
          }
          this.asseYearId = this.assessmentYear.id;
          this.asseId = this.assessmentYear.assessment.id;

          if (
            this.assessmentYear.verificationStatus == undefined ||
            this.assessmentYear.verificationStatus == null
          ) {
            this.verificationStatusIsNull = true;
          }

          const filterResult: string[] = [];
          filterResult.push('assessmentYear.id||$eq||' + this.asseYearId) &
            filterResult.push('assessment.id||$eq||' + this.asseId);
          this.serviceProxy
            .getManyBaseAssessmentResultControllerAssessmentResult(
              undefined,
              undefined,
              filterResult,
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0,
            )
            .subscribe(async (res: any) => {
              this.asseResult = res.data;

              if (this.asseResult.length > 0) {
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

                this.isApproveAllAssessmentResult = await this.assessmentResultProxy
                  .checkAllQCApprovmentAssessmentResult(this.asseResult[0].id)
                  .toPromise();
              } else {
                this.assessmentProxy
                  .checkAssessmentReadyForCalculate(
                    this.assessmentYear.assessment.id,
                    Number(this.assessmentYear.assessmentYear),
                  )
                  .subscribe((r) => {
                    this.isReadyToCAl = r;
                  });
              }
            });

          const filterProjectionResult: string[] = [];
          filterProjectionResult.push('assessment.id||$eq||' + this.asseId);
          this.serviceProxy
            .getManyBaseProjectionResultControllerProjectionResult(
              undefined,
              undefined,
              filterProjectionResult,
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0,
            )
            .subscribe((res: any) => {
              this.projectionResults = res.data;

              if (this.projectionResults.length > 0) {
                if (this.projectionResults[0].qcStatus == 4) {
                  this.isProjectionResultButtonsDisable = true;
                  this.isProjectionResultButtonsDisableReject = true;
                }
              }
            });

          this.getAssessment();
          this.getAssessmentResult(false);
          this.getProjectionResult();
        });
    });
  }

  getAssessmentResult(isCalculate: boolean) {
    this.assessmentResultProxy
      .getAssessmentResult(
        this.assessmentYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        '1234',
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

  getAssessment() {
    this.assessmentProxy
      .getAssment(
        this.assessmentYear.assessment.id,
        this.assessmentYear.assessmentYear,
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

        this.baselineParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isBaseline,
        );

        this.projectParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isProject,
        );
        this.lekageParameters = this.assessmentYear.assessment.parameters.filter(
          (p) => p.isLekage,
        );
        this.projectionParameters = this.assessmentYear.assessment.parameters.filter(
          (p) =>
            p.isProjection &&
            p.projectionBaseYear == Number(this.assessmentYear.assessmentYear),
        );
      });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag: this.flagQC },
    });
  }

  submit() {
    if (this.assessmentYear.assessment.assessmentType != 'MAC') {
      this.getAssessmentResult(true);
    } else {
      this.toCalMacResult();
    }
    this.isReadyToCAl = false;
    this.isDisable = true;
  }

  toCalMacResult() {
    const filter1: string[] = [];
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
        0,
      )
      .subscribe((res: any) => {
        this.macValList = res.data;

        this.discountrate = this.macValList.find(
          (o: any) => o.name == 'Discount Rate',
        ).value;

        this.macValue = {
          DiscountRate: this.macValList.find(
            (o: any) => o.name == 'Discount Rate',
          ).value,
          reduction: this.macValList.find((o: any) => o.name == 'Reduction')
            .value,
          year: this.assessmentYear.assessmentYear,
          baseline: {
            bsTotalInvestment: Number(
              this.macValList.find(
                (o: any) => o.name == 'Baseline Scenario Total Investment',
              ).value,
            ),
            bsAnnualOM: Number(
              this.macValList.find(
                (o: any) => o.name == 'Baseline Scenario Annual O&M',
              ).value,
            ),
            bsOtherAnnualCost: Number(
              this.macValList.find(
                (o: any) => o.name == 'Baseline Scenario Other Annual Cost',
              ).value,
            ),
            bsAnnualFuel: Number(
              this.macValList.find(
                (o: any) => o.name == 'Baseline Scenario Annual Fuel',
              ).value,
            ),
            bsProjectLife: Number(
              this.macValList.find(
                (o: any) => o.name == 'Baseline Scenario Project Life',
              ).value,
            ),
          },
          project: {
            psTotalInvestment: Number(
              this.macValList.find(
                (o: any) => o.name == 'Project Scenario Total Investment',
              ).value,
            ),
            psOtherAnnualCost: Number(
              this.macValList.find(
                (o: any) => o.name == 'Project Scenario Other Annual Cost',
              ).value,
            ),
            psAnnualOM: Number(
              this.macValList.find(
                (o: any) => o.name == 'Project Scenario Annual O&M',
              ).value,
            ),
            psAnnualFuel: Number(
              this.macValList.find(
                (o: any) => o.name == 'Project Scenario Annual Fuel',
              ).value,
            ),
            psProjectLife: Number(
              this.macValList.find(
                (o: any) => o.name == 'Project Scenario Project Life',
              ).value,
            ),
          },
        };

        const macUrl = environment.baseUrlMac;
        const headers = new HttpHeaders().set('api-key', '1234');

        this.httpClient
          .post<any>(macUrl, this.macValue, { headers: headers })
          .subscribe(
            (res) => {
              this.macResult = res;

              setTimeout(() => {
                const assessmentResult = new AssessmentResult();
                assessmentResult.bsTotalAnnualCost = this.macResult[
                  'baseLineAnnualCost'
                ];
                assessmentResult.psTotalAnnualCost = this.macResult[
                  'projecrAnnualCost'
                ];
                assessmentResult.costDifference = this.macResult[
                  'totalAnnualCost'
                ];
                assessmentResult.macResult = this.macResult['mac'];
                assessmentResult.assessmentYear.id = this.assesMentYearId;
                assessmentResult.assessment.id = this.assessmentYear.assessment.id;
                this.assessmentResult = assessmentResult;

                this.serviceProxy
                  .createOneBaseAssessmentResultControllerAssessmentResult(
                    this.assessmentResult,
                  )
                  .subscribe((res: any) => {
                    if (res != null) {
                      window.location.reload();
                    }
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
                        0,
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
                        },
                      );
                  });
              }, 1000);
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Calculation Engine Error. Please Try again later!',
              });
            },
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
    } else {
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
      return !this.isAllSubmit();
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
        (res: any) => {
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
            this.islkResultButtonsDisableReject = true;
          }

          if (res.qcStatusTotalEmission == 4) {
            this.isteResultButtonsDisable = true;
            this.isteResultButtonsDisableReject = true;
          }
          if (res.qcStatusTotalEmission == 3) {
            this.isteResultButtonsDisableReject = true;
          }

          if (res.qcStatusmacResult == 4) {
            this.ismacResultButtonsDisable = true;
            this.ismacResultButtonsDisableReject = true;
          }
          if (res.qcStatusmacResult == 3) {
            this.ismacResultButtonsDisableReject = true;
          }

          if (res.qcStatuscostDifference == 4) {
            this.iscdResultButtonsDisable = true;
            this.iscdResultButtonsDisableReject = true;
          }
          if (res.qcStatuscostDifference == 3) {
            this.iscdResultButtonsDisableReject = true;
          }

          if (res.qcStatuspsTotalAnnualCost == 4) {
            this.ispstacResultButtonsDisable = true;
            this.ispstacResultButtonsDisableReject = true;
          }
          if (res.qcStatuspsTotalAnnualCost == 3) {
            this.ispstacResultButtonsDisableReject = true;
          }

          if (res.qcStatusbsTotalAnnualCost == 4) {
            this.isbstacResultButtonsDisable = true;
            this.isbstacResultButtonsDisableReject = true;
          }
          if (res.qcStatusbsTotalAnnualCost == 3) {
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
        },
      );
  }

  submitStatus() {
    let para = this.parameters;
    para = para.filter((o) => o.parameterRequest != null);
    let isallPass =
      para.find((m) => m.parameterRequest?.qaStatus !== 4) === undefined;

    if (this.assessmentYear.assessment.assessmentType == 'MAC') {
      isallPass = true;
    }

    this.assessmentYear.qaStatus = isallPass ? 4 : 3;

    if (isallPass) {
      this.assessmentYear.verificationStatus = 1;
    }

    const tempassessmentYear = this.assessmentYear;

    const assesemt = new Assessment();
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
        },
      );
    this.isSubmitButtondisable = true;
  }
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  ServiceProxy,
  Assessment,
  VerificationDetail,
  AssessmentYearControllerServiceProxy,
  AssessmentYear,
  ParameterVerifierAcceptance,
} from 'shared/service-proxies/service-proxies';


@Component({
  selector: 'app-nonconformance-report',
  templateUrl: './nonconformance-report.component.html',
  styleUrls: ['./nonconformance-report.component.css']
})
export class NonconformanceReportComponent implements OnInit, AfterViewInit {


  c = { name: 'ovindu', age: '25' };

  assmentYearList: any;

  assessment: Assessment[] = [];
  verificationList: VerificationDetail[] = [];
  verificationList2: VerificationDetail[] = [];

  roundOneList: VerificationDetail[] = [];
  roundTwoList: VerificationDetail[] = [];
  roundThreeList: VerificationDetail[] = [];

  roundOnendcList: any;
  roundOnemethodologyList: any;
  roundOneprojectList: any;
  roundOneprojectionList: any;
  roundOnelekageList: any;
  roundOnebaseleineList: any;
  roundOneAssumptionList: any;
  roundOneResultList: any;

  roundTwondcList: any;
  roundTwomethodologyList: any;
  roundTwoprojectList: any;
  roundTwoprojectionList: any;
  roundTwolekageList: any;
  roundTwobaseleineList: any;
  roundTwoAssumptionList: any;
  roundTwoResultList: any;

  roundThreendcList: any;
  roundThreemethodologyList: any;
  roundThreeprojectList: any;
  roundThreeprojectionList: any;
  roundThreelekageList: any;
  roundThreebaseleineList: any;
  roundThreeAssumptionList: any;
  roundThreeResultList: any;

  roundOneHeadTable: any;
  roundTwoHeadTable: any;
  roundThreeHeadTable: any;

  ndcList: any;
  methodologyList: any;
  projectList: any;
  projectionList: any;
  lekageList: any;
  baseleineList: any;
  mydate: any = '2022-02-29';
  dateGenerated: any;
  assumptionList: any;


  assesMentYearId: any;
  recievdAssementYear: any;
  assessmentId: any;
  assementYear: AssessmentYear = new AssessmentYear();
  flag: string;
  isVerificationHistory: number;

  roundOneVerifier: any;
  roundTwoVerifier: any;
  roundThreeVerifier: any;
  vStatus: number;
  VerificationStatusEnum = VerificationStatus;

  verificationStatus: string[] = [

    VerificationStatus[VerificationStatus['Pre Assessment']],
    VerificationStatus[VerificationStatus['Initial Assessment']],
    VerificationStatus[VerificationStatus['Final Assessment']],

  ];

  isReviewComplete: boolean = true
  verificationRound: number


  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private assYearProxy: AssessmentYearControllerServiceProxy,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assesMentYearId = params['id'];
      this.flag = params['flag'];
      this.isVerificationHistory = params['isVerificationHistory'];
      this.vStatus = params['vStatus'];

      this.serviceProxy
        .getOneBaseAssessmentYearControllerAssessmentYear(
          this.assesMentYearId,
          undefined,
          undefined,
          undefined
        )
        .subscribe(async (res) => {
          this.assementYear = res;
          this.recievdAssementYear = this.assementYear.assessmentYear;
          this.assessmentId = this.assementYear.assessment.id;

          let assessment = await this.serviceProxy.getOneBaseAssesmentControllerAssessment(this.assementYear.assessment.id, undefined, undefined, 0).toPromise()

          this.assYearProxy
            .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assessmentId, this.recievdAssementYear)
            .subscribe(async (a) => {
              this.assmentYearList = a;
              this.verificationList = a[0]?.verificationDetail;

              this.roundOneList = this.verificationList.filter((o: any) => o.verificationStage == 1 && o.isAccepted == 0);
              this.roundTwoList = this.verificationList.filter((o: any) => o.verificationStage == 2 && o.isAccepted == 0);
              this.roundThreeList = this.verificationList.filter((o: any) => o.verificationStage == 3 && o.isAccepted == 0);

              this.roundOneHeadTable = this.verificationList?.find((o: any) => o.verificationStage == 1);
              if (this.roundOneHeadTable != null) {
                this.verificationRound = 1
                let verifierId = this.roundOneHeadTable.userVerifier;

                this.serviceProxy.
                  getOneBaseUsersControllerUser(
                    verifierId,
                    undefined,
                    undefined,
                    undefined,

                  ).subscribe((res: any) => {
                    this.roundOneVerifier = res;
                  });

              }
              this.roundTwoHeadTable = this.verificationList?.find((o: any) => o.verificationStage == 2);
              if (this.roundTwoHeadTable != null) {
                this.verificationRound = 2
                let verifierId = this.roundTwoHeadTable.userVerifier;

                this.serviceProxy.
                  getOneBaseUsersControllerUser(
                    verifierId,
                    undefined,
                    undefined,
                    undefined,

                  ).subscribe((res: any) => {
                    this.roundTwoVerifier = res;
                  });

              }
              this.roundThreeHeadTable = this.verificationList?.find((o: any) => o.verificationStage == 3);

              await this.checkReviewComplete(this.verificationList, assessment.parameters)

              this.roundOnendcList = this.roundOneList.filter((o: any) => o.isNDC == true);
              this.roundOnemethodologyList = this.roundOneList.filter((o: any) => o.isMethodology == true);
              this.roundOneprojectList = this.roundOneList.filter((o: any) => o.isProject == true && !o.isResult);
              this.roundOneprojectionList = this.roundOneList.filter((o: any) => o.isProjection == true && !o.isResult);
              this.roundOnelekageList = this.roundOneList.filter((o: any) => o.isLekage == true && !o.isResult);
              this.roundOnebaseleineList = this.roundOneList.filter((o: any) => o.isBaseline == true && !o.isResult);
              this.roundOneAssumptionList = this.roundOneList.filter((o: any) => o.isAssumption == true);
              this.roundOneResultList = this.roundOneList.filter((o: any) => o.isResult === true);

              this.roundTwondcList = this.roundTwoList.filter((o: any) => o.isNDC == true);
              this.roundTwomethodologyList = this.roundTwoList.filter((o: any) => o.isMethodology == true);
              this.roundTwoprojectList = this.roundTwoList.filter((o: any) => o.isProject == true && !o.isResult);
              this.roundTwoprojectionList = this.roundTwoList.filter((o: any) => o.isProjection == true && !o.isResult);
              this.roundTwolekageList = this.roundTwoList.filter((o: any) => o.isLekage == true && !o.isResult);
              this.roundTwobaseleineList = this.roundTwoList.filter((o: any) => o.isBaseline == true && !o.isResult);
              this.roundThreeAssumptionList = this.roundTwoList.filter((o: any) => o.isAssumption == true);
              this.roundTwoResultList = this.roundTwoList.filter((o: any) => o.isResult === true);

              this.roundThreendcList = this.roundThreeList.filter((o: any) => o.isNDC == true);
              this.roundThreemethodologyList = this.roundThreeList.filter((o: any) => o.isMethodology == true);
              this.roundThreeprojectList = this.roundThreeList.filter((o: any) => o.isProject == true && !o.isResult);
              this.roundThreeprojectionList = this.roundThreeList.filter((o: any) => o.isProjection == true && !o.isResult);
              this.roundThreelekageList = this.roundThreeList.filter((o: any) => o.isLekage == true && !o.isResult);
              this.roundThreebaseleineList = this.roundThreeList.filter((o: any) => o.isBaseline == true && !o.isResult);
              this.roundThreeAssumptionList = this.roundThreeList.filter((o: any) => o.isAssumption == true);
              this.roundThreeResultList = this.roundTwoList.filter((o: any) => o.isResult === true);
            }
              ,
              (error) => {

              });


        });
    });
  }

  async checkReviewComplete(vdList: any, parameters: any) {
    this.isReviewComplete = true
    let hasBaseline = false
    let hasProject = false
    let hasLekage = false
    let hasProjection = false
    let parentIds: any[] = []

    for await (let para of parameters) {
      if (para.verifierAcceptance !== ParameterVerifierAcceptance.REJECTED) {
        if (para.isBaseline) hasBaseline = true
        if (para.isProject) hasProject = true
        if (para.isLekage) hasLekage = true
        if (para.isProjection) hasProjection = true
        let vd = vdList.find((o: any) => o.parameter?.id === para.id && (o.isAccepted || o.verificationStatus === this.assementYear.verificationStatus))
        if (vd === undefined) {
          if (para.hasChild && !para.value) {
            parentIds.push(para.id)
          } else {
            if (para.isAlternative) {
              if (parentIds.includes(para.parentParameterId)) {
                this.isReviewComplete = false
                parentIds.splice(parentIds.indexOf(para.parentParameterId), 1)
                break;
              }
            } else {
              this.isReviewComplete = false
              break;
            }
          }
        }
        if (!this.isReviewComplete && parentIds.length > 0) this.isReviewComplete = false
      }
    }

    if (this.isReviewComplete) {
      let columns: string[] = []
      if (this.assementYear.assessment.assessmentType === 'MAC') { columns = [...['isAssumption']] }
      else { columns = [...['isNDC', 'isMethodology', 'isAssumption']] }
      for await (let col of columns) {
        let vd = vdList.find((o: any) => o[col] && (o.isAccepted || o.verificationStatus === this.assementYear.verificationStatus))
        if (vd === undefined) {
          this.isReviewComplete = false
          break;
        }
      }
    }
  }

  toPopUp(item: any) { }

  toDownload() {

    var data = document.getElementById('content')!;

    html2canvas(data).then((canvas) => {
      const componentWidth = data.offsetWidth
      const componentHeight = data.offsetHeight

      const orientation = componentWidth >= componentHeight ? 'l' : 'p'

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation,
        unit: 'px'
      })

      pdf.internal.pageSize.width = componentWidth
      pdf.internal.pageSize.height = componentHeight

      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
      pdf.save('download.pdf')
    })
  }

  toChangeStatus() {
    if (this.assementYear.verificationStatus === 8) { //assessment returned
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Cannot submit. Values are not recieved for some parameters.'
      });
    } else {
      if (this.flag == 'sec-admin') {
        this.assementYear.verificationStatus = 2;
        this.assementYear.editedOn = moment();

        if (this.roundOneHeadTable != undefined) {
          this.assementYear.verificationStatus = 4;
        }

        if (this.roundTwoHeadTable != undefined) {
          this.assementYear.verificationStatus = 5;
        }

        this.serviceProxy
          .updateOneBaseAssessmentYearControllerAssessmentYear(this.assementYear.id, this.assementYear)
          .subscribe(
            (res) => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'successfully updated !!' });

            },
          );

      }
      else {
        this.assementYear.verificationStatus = 1; //Nc REcieved
        this.assementYear.editedOn = moment();
        if (this.roundOneHeadTable != undefined) {
          if (this.roundOneList.length != 0) {
            this.assementYear.verificationStatus = 3; //Nc REcieved
          }
          else {
            this.assementYear.verificationStatus = 7;
          }
        }

        if (this.roundTwoHeadTable != undefined) {
          if (this.roundTwoList.length != 0) {
            this.assementYear.verificationStatus = 3; //Nc REcieved
          }
          else {
            this.assementYear.verificationStatus = 7;
          }
        }

        if (this.roundThreeHeadTable != undefined) {
          if (this.roundThreeList.length != 0) {
            this.assementYear.verificationStatus = 6; //Nc REcieved
          }
          else {
            this.assementYear.verificationStatus = 7;
          }
        }

        this.serviceProxy
          .updateOneBaseAssessmentYearControllerAssessmentYear(this.assementYear.id, this.assementYear)
          .subscribe(
            (res) => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'successfully updated!' });
            },
          );
      }
    }
  }

  toDetailPage() {
    if (this.flag == "sec-admin") {
      this.router.navigate(['/verification-sector-admin/detail'], {
        queryParams: {
          id: this.assementYear.id,
          verificationStatus: this.assementYear.verificationStatus,
        },
      });
    }
    else {
      this.router.navigate(['/verification-verifier/detail'], {
        queryParams: {
          id: this.assementYear.id,
          verificationStatus: this.assementYear.verificationStatus,
        },
      });

    }
  }

  disableSubmit() {
    if (this.flag === 'sec-admin') {
      return ((this.assementYear.verificationStatus !== 3) || this.assementYear.verificationStatus === 7 || this.assementYear.verificationStatus === 6)
    } else {
      if (!this.isReviewComplete) {
        return true
      }
      return (this.assementYear.verificationStatus === 3 || this.assementYear.verificationStatus === 8 || this.assementYear.verificationStatus === 7 || this.assementYear.verificationStatus === 6)
    }
  }

  getSubmitLabel() {
    if (this.flag === 'sec-admin') {
      if ((this.assementYear.verificationStatus !== 3 && this.assementYear.verificationStatus !== 8) || this.assementYear.verificationStatus === 7) {
        return "Submitted"
      }
    } else {
      if (this.assementYear.verificationStatus === 3 || this.assementYear.verificationStatus === 8 || this.assementYear.verificationStatus === 7) {
        return "Submitted"
      }
    }

    return "Submit"
  }

  getStatus() {
    if (this.assementYear.verificationStatus === 3) {
      if (this.flag === 'sec-admin') {
        return 'NC Received'
      } else {
        return 'NC Sent'
      }
    } else {
      return VerificationStatus[this.assementYear.verificationStatus]
    }
  }

}

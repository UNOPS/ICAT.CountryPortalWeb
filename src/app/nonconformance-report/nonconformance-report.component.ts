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
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-nonconformance-report',
  templateUrl: './nonconformance-report.component.html',
  styleUrls: ['./nonconformance-report.component.css'],
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

  roundTwondcList: any;
  roundTwomethodologyList: any;
  roundTwoprojectList: any;
  roundTwoprojectionList: any;
  roundTwolekageList: any;
  roundTwobaseleineList: any;
  roundTwoAssumptionList: any;

  roundThreendcList: any;
  roundThreemethodologyList: any;
  roundThreeprojectList: any;
  roundThreeprojectionList: any;
  roundThreelekageList: any;
  roundThreebaseleineList: any;
  roundThreeAssumptionList: any;

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
  recievdAssessmentYear: any;
  assessmentId: any;
  assessmentYear: AssessmentYear = new AssessmentYear();
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

  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private assYearProxy: AssessmentYearControllerServiceProxy,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {}

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
          undefined,
        )
        .subscribe((res) => {
          this.assessmentYear = res;

          this.recievdAssessmentYear = this.assessmentYear.assessmentYear;
          this.assessmentId = this.assessmentYear.assessment.id;

          this.assYearProxy
            .getVerificationDeatilsByAssessmentIdAndAssessmentYear(
              this.assessmentId,
              this.recievdAssessmentYear,
            )
            .subscribe(
              (a) => {
                this.assmentYearList = a;

                this.verificationList = a[0]?.verificationDetail;
                this.roundOneList = this.verificationList.filter(
                  (o: any) => o.verificationStage == 1 && o.isAccepted == 0,
                );

                this.roundTwoList = this.verificationList.filter(
                  (o: any) => o.verificationStage == 2 && o.isAccepted == 0,
                );
                this.roundThreeList = this.verificationList.filter(
                  (o: any) => o.verificationStage == 3 && o.isAccepted == 0,
                );

                this.roundOneHeadTable = this.verificationList?.find(
                  (o: any) => o.verificationStage == 1,
                );

                if (this.roundOneHeadTable != null) {
                  const verifierId = this.roundOneHeadTable.userVerifier;

                  this.serviceProxy
                    .getOneBaseUsersControllerUser(
                      verifierId,
                      undefined,
                      undefined,
                      undefined,
                    )
                    .subscribe((res: any) => {
                      this.roundOneVerifier = res;
                    });
                }
                this.roundTwoHeadTable = this.verificationList?.find(
                  (o: any) => o.verificationStage == 2,
                );
                if (this.roundTwoHeadTable != null) {
                  const verifierId = this.roundTwoHeadTable.userVerifier;

                  this.serviceProxy
                    .getOneBaseUsersControllerUser(
                      verifierId,
                      undefined,
                      undefined,
                      undefined,
                    )
                    .subscribe((res: any) => {
                      this.roundTwoVerifier = res;
                    });
                }
                this.roundThreeHeadTable = this.verificationList?.find(
                  (o: any) => o.verificationStage == 3,
                );
                if (this.roundThreeHeadTable != null) {
                  const verifierId = this.roundThreeHeadTable.userVerifier;

                  this.serviceProxy
                    .getOneBaseUsersControllerUser(
                      verifierId,
                      undefined,
                      undefined,
                      undefined,
                    )
                    .subscribe((res: any) => {
                      this.roundThreeVerifier = res;
                    });
                }

                this.roundOnendcList = this.roundOneList.filter(
                  (o: any) => o.isNDC == true,
                );

                this.roundOnemethodologyList = this.roundOneList.filter(
                  (o: any) => o.isMethodology == true,
                );
                this.roundOneprojectList = this.roundOneList.filter(
                  (o: any) => o.isProject == true,
                );
                this.roundOneprojectionList = this.roundOneList.filter(
                  (o: any) => o.isProjection == true,
                );
                this.roundOnelekageList = this.roundOneList.filter(
                  (o: any) => o.isLekage == true,
                );
                this.roundOnebaseleineList = this.roundOneList.filter(
                  (o: any) => o.isBaseline == true,
                );
                this.roundOneAssumptionList = this.roundOneList.filter(
                  (o: any) => o.isAssumption == true,
                );

                this.roundTwondcList = this.roundTwoList.filter(
                  (o: any) => o.isNDC == true,
                );
                this.roundTwomethodologyList = this.roundTwoList.filter(
                  (o: any) => o.isMethodology == true,
                );
                this.roundTwoprojectList = this.roundTwoList.filter(
                  (o: any) => o.isProject == true,
                );
                this.roundTwoprojectionList = this.roundTwoList.filter(
                  (o: any) => o.isProjection == true,
                );
                this.roundTwolekageList = this.roundTwoList.filter(
                  (o: any) => o.isLekage == true,
                );
                this.roundTwobaseleineList = this.roundTwoList.filter(
                  (o: any) => o.isBaseline == true,
                );
                this.roundThreeAssumptionList = this.roundTwoList.filter(
                  (o: any) => o.isAssumption == true,
                );

                this.roundThreendcList = this.roundThreeList.filter(
                  (o: any) => o.isNDC == true,
                );
                this.roundThreemethodologyList = this.roundThreeList.filter(
                  (o: any) => o.isMethodology == true,
                );
                this.roundThreeprojectList = this.roundThreeList.filter(
                  (o: any) => o.isProject == true,
                );
                this.roundThreeprojectionList = this.roundThreeList.filter(
                  (o: any) => o.isProjection == true,
                );
                this.roundThreelekageList = this.roundThreeList.filter(
                  (o: any) => o.isLekage == true,
                );
                this.roundThreebaseleineList = this.roundThreeList.filter(
                  (o: any) => o.isBaseline == true,
                );
                this.roundThreeAssumptionList = this.roundThreeList.filter(
                  (o: any) => o.isAssumption == true,
                );
              },
              (error) => {},
            );
        });
    });
  }

  toPopUp(item: any) {}

  toDownload() {
    const data = document.getElementById('content')!;

    html2canvas(data).then((canvas) => {
      const componentWidth = data.offsetWidth;
      const componentHeight = data.offsetHeight;

      const orientation = componentWidth >= componentHeight ? 'l' : 'p';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
      });

      pdf.internal.pageSize.width = componentWidth;
      pdf.internal.pageSize.height = componentHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      pdf.save('download.pdf');
    });
  }

  toChangeStatus() {
    if (this.flag == 'sec-admin') {
      this.assessmentYear.verificationStatus = 2;
      this.assessmentYear.editedOn = moment();

      if (this.roundOneHeadTable != undefined) {
        this.assessmentYear.verificationStatus = 4;
      }

      if (this.roundTwoHeadTable != undefined) {
        this.assessmentYear.verificationStatus = 5;
      }

      this.serviceProxy
        .updateOneBaseAssessmentYearControllerAssessmentYear(
          this.assessmentYear.id,
          this.assessmentYear,
        )
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated !!',
          });
        });
    } else {
      this.assessmentYear.verificationStatus = 1;
      this.assessmentYear.editedOn = moment();

      if (this.roundOneHeadTable != undefined) {
        if (this.roundOneList.length != 0) {
          this.assessmentYear.verificationStatus = 3;
        } else {
          this.assessmentYear.verificationStatus = 7;
        }
      }

      if (this.roundTwoHeadTable != undefined) {
        if (this.roundTwoList.length != 0) {
          this.assessmentYear.verificationStatus = 3;
        } else {
          this.assessmentYear.verificationStatus = 7;
        }
      }

      if (this.roundThreeHeadTable != undefined) {
        if (this.roundThreeList.length != 0) {
          this.assessmentYear.verificationStatus = 6;
        } else {
          this.assessmentYear.verificationStatus = 7;
        }
      }

      this.serviceProxy
        .updateOneBaseAssessmentYearControllerAssessmentYear(
          this.assessmentYear.id,
          this.assessmentYear,
        )
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated!',
          });
        });
    }
  }

  toDetailPage() {
    if (this.flag == 'sec-admin') {
      this.router.navigate(['/verification-sector-admin/detail'], {
        queryParams: {
          id: this.assessmentYear.id,
        },
      });
    } else {
      this.router.navigate(['/verification-verifier/detail'], {
        queryParams: {
          id: this.assessmentYear.id,
        },
      });
    }
  }
}

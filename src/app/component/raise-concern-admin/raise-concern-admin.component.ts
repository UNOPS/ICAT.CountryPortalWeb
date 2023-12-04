import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  Parameter,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-raise-concern-admin',
  templateUrl: './raise-concern-admin.component.html',
  styleUrls: ['./raise-concern-admin.component.css'],
})
export class RaiseConcernAdminComponent implements OnInit {
  @Input()
  area: string;

  @Input()
  verificationDetails: VerificationDetail[] | undefined;

  @Input()
  assessmentYear: AssessmentYear;

  @Input()
  isNdC: boolean;

  @Input()
  isMethodology: boolean;

  @Input()
  isParameter: boolean;

  @Input()
  isResult: boolean;

  @Input()
  isBaseline: boolean;

  @Input()
  isProject: boolean;

  @Input()
  isLekage: boolean;

  @Input()
  isProjection: boolean;

  @Input()
  parameter: Parameter;

  @Output()
  onCompleteConcern = new EventEmitter<boolean>();

  lastConcernDate: Date = new Date();

  commentRequried: boolean = false;
  comment: string = '';
  verificationRound: number = 0;
  verificationDetail: VerificationDetail | undefined;
  explanation: string = '';
  correctiveAction: string = '';
  rootCause: string = '';

  rootCausetRequried: boolean = false;
  correctiveActionRequried: boolean = false;

  loggedUser: User;
  roundOneHeadTable: any;
  roundTwoHeadTable: any;
  roundThreeHeadTable: any;

  constructor(
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceProxy: ServiceProxy,
    private assessmentYearControllerServiceProxy: AssessmentYearControllerServiceProxy
  ) {}

  ngOnInit(): void {
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

  async ngOnChanges(changes: any) {
    this.explanation = '';
    this.correctiveAction = '';
    this.rootCause = '';

    this.rootCausetRequried = false;
    this.correctiveActionRequried = false;

    if (this.assessmentYear && this.assessmentYear !== undefined) {
      await this.checkVerificationStage()
      if (this.roundOneHeadTable !== undefined){
        this.verificationRound = 1
      }
      if (this.roundTwoHeadTable !== undefined){
        this.verificationRound = 2
      }
      if (this.roundThreeHeadTable !== undefined){
        this.verificationRound = 3
      }
    }

    if (this.verificationDetails && this.verificationDetails.length > 0) {
      this.verificationDetail = this.verificationDetails.find(
        (a) => a.verificationStage == this.verificationRound
      );

      if (this.verificationDetail) {
        this.rootCause = this.verificationDetail.rootCause;
        this.correctiveAction = this.verificationDetail.correctiveAction;
        this.lastConcernDate = this.verificationDetail.updatedDate?.toDate()
        this.explanation = this.verificationDetail.explanation
      }
    }
  }

  onComplete() {
    if (
      (!this.rootCause || this.rootCause == '') &&
      (!this.correctiveAction || this.correctiveAction == '')
    ) {
      this.rootCausetRequried = true;
      this.correctiveActionRequried = true;
      return;
    } else {
      this.rootCausetRequried = false;
      this.correctiveActionRequried = false;
    }

    const verificationDetails: VerificationDetail[] = [];

    let vd = new VerificationDetail();

    if (this.verificationDetail) {
      vd = this.verificationDetail;
      vd.updatedDate = moment();
      vd.editedOn = moment();
    } else {
      vd.createdOn = moment();
      vd.userVerifier = this.loggedUser.id;
      vd.assessmentId = this.assessmentYear.assessment.id;
      const assessmentYear = new AssessmentYear();
      assessmentYear.id = this.assessmentYear.id;
      vd.assessmentYear = assessmentYear;
      vd.year = Number(this.assessmentYear.assessmentYear);
      vd.isBaseline = this.isBaseline;
      vd.isProject = this.isProject;
      vd.isLekage = this.isLekage;
      vd.isProjection = this.isProjection;
      vd.isResult = this.isResult;

      if (this.isNdC) {
        vd.isNDC = true;
      }
      if (this.isMethodology) {
        vd.isMethodology = true;
      }

      if (this.isParameter) {
        const param = new Parameter();
        param.id = this.parameter.id;
        vd.parameter = param;
      }

      vd.verificationStatus = Number(this.assessmentYear.verificationStatus);
    }

    vd.rootCause = this.rootCause;
    vd.correctiveAction = this.correctiveAction;
    vd.verificationStage = this.verificationRound;
    vd.isAccepted = false;

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
        this.onCompleteConcern.emit(true)
      });
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
}

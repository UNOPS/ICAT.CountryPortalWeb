import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  AssessmentYear,
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

  lastConcernDate: Date = new Date();

  commentRequried = false;
  comment = '';
  verificationRound = 0;
  verificationDetail: VerificationDetail | undefined;
  explanation = '';
  correctiveAction = '';
  rootCause = '';

  rootCausetRequried = false;
  correctiveActionRequried = false;

  loggedUser: User;

  constructor(
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceProxy: ServiceProxy,
  ) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: any) {
    this.explanation = '';
    this.correctiveAction = '';
    this.rootCause = '';

    this.rootCausetRequried = false;
    this.correctiveActionRequried = false;

    if (this.assessmentYear && this.assessmentYear !== undefined) {
      if (
        this.assessmentYear.verificationStatus === 1 ||
        this.assessmentYear.verificationStatus === 2 ||
        this.assessmentYear.verificationStatus === 3
      ) {
        this.verificationRound = 1;
      } else if (this.assessmentYear.verificationStatus === 4) {
        this.verificationRound = 2;
      } else if (this.assessmentYear.verificationStatus === 5)
        this.verificationRound = 3;
    }

    if (this.verificationDetails && this.verificationDetails.length > 0) {
      const concernDetails = this.verificationDetails.find(
        (a) => a.explanation !== undefined && a.explanation !== null,
      );

      if (concernDetails) {
        this.explanation = concernDetails.explanation;
      }

      if (concernDetails && concernDetails.updatedDate !== undefined) {
        this.lastConcernDate = concernDetails.updatedDate.toDate();
        this.explanation = concernDetails.explanation;
      }

      this.verificationDetail = this.verificationDetails.find(
        (a) => a.verificationStage == this.verificationRound,
      );

      if (this.verificationDetail) {
        this.rootCause = this.verificationDetail.rootCause;
        this.correctiveAction = this.verificationDetail.correctiveAction;
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
      });
  }
}

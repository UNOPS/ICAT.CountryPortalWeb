import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  AssessmentYearVerificationStatus,
  Parameter,
  ParameterVerifierAcceptance,
  ServiceProxy,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-raise-concern',
  templateUrl: './raise-concern.component.html',
  styleUrls: ['./raise-concern.component.css'],
})
export class RaiseConcernComponent implements OnInit {
  @Input()
  area: string;

  @Input()
  verificationDetails: VerificationDetail[] | undefined;

  @Input()
  assesmentYear: AssessmentYear;

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
  isAssumption: boolean;

  @Input()
  parameter: Parameter;

  @Output()
  onCompleteConcern = new EventEmitter<boolean>();

  lastConcernDate: Date = new Date();

  commentRequried: boolean = false;
  comment: string = '';
  verificationRound: number = 0;
  verificationDetail: VerificationDetail | undefined;
  loggedUser: User;
  roundOneHeadTable: any;
  roundTwoHeadTable: any;
  roundThreeHeadTable: any;

  constructor(
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private router: Router,
    private serviceProxy: ServiceProxy,
    private assessmentYearControllerServiceProxy: AssessmentYearControllerServiceProxy
  ) {}

  ngOnInit(): void {
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

  async ngOnChanges(changes: any) {
    this.commentRequried = false;
    this.comment = '';
    if (this.assesmentYear && this.assesmentYear !== undefined) {
      await this.checkVerificationStage()
      if (
        this.assesmentYear.verificationStatus === 1 ||
        this.assesmentYear.verificationStatus === 2 ||
        this.assesmentYear.verificationStatus === 3
      ) {
        this.verificationRound = 1;
      } else if (this.assesmentYear.verificationStatus === 4) {
        this.verificationRound = 2;
      } else if (this.assesmentYear.verificationStatus === 5)
        this.verificationRound = 3;
        
      // if (this.roundOneHeadTable !== undefined){
      //   this.verificationRound = 2
      // } else {
      //   this.verificationRound = 1;
      // }
      // if (this.roundTwoHeadTable !== undefined && this.assesmentYear.verificationStatus < 4){
      //   this.verificationRound = 3
      // }
      // if (this.roundThreeHeadTable !== undefined){
      //   this.verificationRound = 3
      // }
    }

    if (this.verificationDetails && this.verificationDetails.length > 0) {
      let concernDetails = this.verificationDetails.find(
        (a) => a.explanation !== undefined && a.explanation !== null
      );

      if (concernDetails && concernDetails.updatedDate !== undefined) {
        this.lastConcernDate = concernDetails.updatedDate.toDate();
      }

      this.verificationDetail = this.verificationDetails.find(
        (a) => a.verificationStage == this.verificationRound
      );

      if (this.verificationDetail) {
        this.comment = this.verificationDetail.explanation;
      }
    }
  }

  async onComplete() {
    if (!this.comment || this.comment == '') {
      this.commentRequried = true;
      return;
    } else {
      this.commentRequried = false;
    }

    let verificationDetails: VerificationDetail[] = [];

    let vd = new VerificationDetail();

    if (this.verificationDetail) {
      vd = this.verificationDetail;
      vd.updatedDate = moment();
    } else {
      vd.createdOn = moment();
      vd.assessmentId = this.assesmentYear.assessment.id;
      vd.userVerifier = this.loggedUser.id;
      let assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assesmentYear.id;
      vd.assessmentYear = assesmentYear;
      vd.year = Number(this.assesmentYear.assessmentYear);
      vd.isBaseline = this.isBaseline;
      vd.isProject = this.isProject;
      vd.isLekage = this.isLekage;
      vd.isProjection = this.isProjection;
      vd.isResult = this.isResult;
      vd.isAssumption = this.isAssumption

      if (this.isNdC) {
        vd.isNDC = true;
      }
      if (this.isMethodology) {
        vd.isMethodology = true;
        let asssessmentYear = await this.serviceProxy.getOneBaseAssessmentYearControllerAssessmentYear(
          assesmentYear.id, undefined, undefined, 0
        ).toPromise()
        asssessmentYear.verificationStatus = 6
        asssessmentYear.editedOn = moment();
        this.serviceProxy.updateOneBaseAssessmentYearControllerAssessmentYear(
          asssessmentYear.id, asssessmentYear
        ).subscribe(res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The assessment is failed',
            closable: true,
          });
        })

      }

      if (this.isParameter) {
        let param = new Parameter();
        param.id = this.parameter.id;
        vd.parameter = param;
      }

      vd.verificationStatus = Number(this.assesmentYear.verificationStatus);
    }

    if (this.isParameter){
      if (this.verificationRound > 1){
        let para = vd.parameter
        para.verifierAcceptance = ParameterVerifierAcceptance.PENDING
        await this.serviceProxy.updateOneBaseParameterControllerParameter(para.id, para).toPromise()
      }
    }

   

    vd.explanation = this.comment;
    vd.verificationStage = this.verificationRound;
    vd.isAccepted = false;

    verificationDetails.push(vd);

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        console.log(4);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'successfully Save.',
          closable: true,
        });
        console.log("onCompleteConcern")
        this.onCompleteConcern.emit(true)
        if (this.isMethodology) window.location.reload()
      });

    // this.router.navigate(['/non-conformance'], {
    //    queryParams: { id: this.assesmentYear.id },
    //  });
  }

  async checkVerificationStage() {
    if (this.assesmentYear.assessment.id){
      let verificationList = (await this.assessmentYearControllerServiceProxy
        .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assesmentYear.assessment.id, this.assesmentYear.assessmentYear)
        .toPromise())[0]?.verificationDetail;
      this.roundOneHeadTable = verificationList?.find((o: any) => o.verificationStage == 1);
      this.roundTwoHeadTable = verificationList?.find((o: any) => o.verificationStage == 2);
      this.roundThreeHeadTable = verificationList?.find((o: any) => o.verificationStage == 3);
    }
  }
}

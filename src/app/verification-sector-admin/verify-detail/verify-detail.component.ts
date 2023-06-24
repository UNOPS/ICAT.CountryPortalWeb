import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  AssesmentControllerServiceProxy,
  AssesmentResaultControllerServiceProxy,
  Assessment,
  AssessmentResault,
  AssessmentYear,
  AssessmentYearVerificationStatus,
  Ndc,
  Parameter,
  ParameterVerifierAcceptance,
  Project,
  ProjectionResault,
  ProjectionResaultControllerServiceProxy,
  ServiceProxy,
  SubNdc,
  User,
  VerificationControllerServiceProxy,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';
import { VerificationActionDialogComponent } from '../verification-action-dialog/verification-action-dialog.component';

@Component({
  selector: 'app-verify-detail-sectorAdmin',
  templateUrl: './verify-detail.component.html',
  styleUrls: ['./verify-detail.component.css'],
})
export class VerifyDetailComponentSectorAdmin implements OnInit {

  assesMentYearId: number = 0;
  verificationStatus: number = 0;
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
  flag:number = 1;
  assesmentResultComment = '';
  assesmentResultCommentRequried: boolean = false;
  assessmentObjective:any

  selectdAssementType: number;
  isApproveAssement: boolean = false;

  ndcList: Ndc[];
  selectedNdc: Ndc;
  selectedSubNdc: SubNdc;

  VerificationStatusEnum = VerificationStatus;
  concernVerificationDetails: VerificationDetail[] | undefined;
  verificationDetails: VerificationDetail[] = [];

  raiseConcernSection: string = '';
  concernIsMethodology: boolean;
  concernIsNdC: boolean;
  concernIsAssumption: boolean;


  loggedUser: User;
  assumption:string = '';

  isMethodologyAccepted: boolean = false
  hasMethodologyConcern: boolean = false
  isNdcAccepted: boolean = false
  hasNdcConcern: boolean = false
  hasAssumptionConcern: boolean = false
  isAssumptionAccepted: boolean = false
  isTotalResultAccepted: boolean = false
  hasTotalResultConcern: boolean = false
  isMacResultAccepted: boolean = false
  hasMacResultConcern: boolean = false
  isCostResultAccepted: boolean = false
  hasCostResultConcern: boolean = false
  hasMacComment: boolean = false
  hasCostComment: boolean = false
  canActiveNdcAction: boolean = false
  canActiveAssumption: boolean = false
  canActiveTotalAction: boolean = false
  canActiveMacAction: boolean = false
  canActiveDifferenceAction: boolean = false

  ref: DynamicDialogRef;

  @ViewChild('opDRPro') overlayDRPro: any;
  @ViewChild('opDRAss') overlayDRAssemnet: any;
  concernIsTotal: boolean = false;
  concernIsMac: boolean = false;
  concernIsDiff: boolean = false;
  isCompleted: boolean = false;

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
    public dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assesMentYearId = params['id'];
      this.verificationStatus = params['verificationStatus'];

      this.loadUser()

      this.serviceProxy
        .getManyBaseNdcControllerNdc(
          undefined,
          undefined,
          undefined,
          // ['sector.id||$eq||' + this.project.sector.id],
          undefined,
          ['name,ASC'],
          ['subNdc'],
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.ndcList = res.data;
        });

      this.serviceProxy
        .getOneBaseAssessmentYearControllerAssessmentYear(
          this.assesMentYearId,
          undefined,
          undefined,
          undefined
        )
        .subscribe(async (res) => {
          this.assementYear = res;


          this.serviceProxy.getManyBaseAssessmentObjectiveControllerAssessmentObjective(
            undefined,
            undefined,
            ["assessmentId||$eq||"+ this.assementYear?.assessment?.id],
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
              this.assessmentObjective = res.data[0]?.objective;
             }
             else{
               console.log("N/A")
               this.assessmentObjective = "-"
             }
            console.log('asssmntObjectiveName----',this.assessmentObjective);
          });
          
          await this.getVerificationDetail();
          this.getAssesment();
          this.getProjectionResult();
          this.getAssesmentResult(false);
          
        });
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
    //     this.verificationDetails = a;
    //   });
    this.verificationDetails = await this.verificationProxy.getVerificationDetails(this.assesMentYearId).toPromise()
    for await (let v of this.verificationDetails){
      if (v.isMethodology){
        if (v.isAccepted){
          this.isMethodologyAccepted = true
        }
        if (v.explanation){
          this.hasMethodologyConcern = true
        }
      } else if (v.isNDC){
        if (v.isAccepted){
          this.isNdcAccepted = true
        }
        if (v.explanation){
          this.hasNdcConcern = true
        }
        if (v.rootCause || v.correctiveAction){
          this.canActiveNdcAction = true
        }
      } else if (v.isAssumption){
        if (v.isAccepted){
          this.isAssumptionAccepted = true
        } 
        if (v.explanation){
          this.hasAssumptionConcern = true
        }
      } else if (v.isTotal){
        if (v.isAccepted){
          this.isTotalResultAccepted = true
        }
        if (v.explanation){
          this.hasTotalResultConcern = true
        }
        if (v.rootCause || v.explanation) this.canActiveTotalAction  = true
      } else if (v.isMac){
        if (v.isAccepted){
          this.isMacResultAccepted = true
        }
        if (v.explanation){
          this.hasMacResultConcern = true
        }
        if (v.action){
          this.hasMacComment = true
        }
        if (v.rootCause || v.explanation) this.canActiveMacAction = true
      } else if (v.isDifference){
        if (v.isAccepted){
          this.isCostResultAccepted = true
        }
        if (v.explanation){
          this.hasCostResultConcern = true
        } 
        if (v.action){
          this.hasCostComment = true
        }
        if (v.rootCause || v.explanation) this.canActiveDifferenceAction = true
      }
    }
  }

  getAssesmentResult(isCalculate: boolean) {
    this.assesmentResaultProxy
      .getAssesmentResult(
        this.assementYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        'sec-admin',
        "1234"
      )
      .subscribe((res) => {
        this.assessmentResult = res;
        console.log("this.assessmentResult...",this.assessmentResult);
      });
  }

  getProjectionResult() {
    this.projectionResultProxy
      .getProjectionResult(
        this.assementYear.assessment.id,
        Number(this.assementYear.assessmentYear)
      )
      .subscribe((res) => {
        this.projectionResult = res;
        console.log("ffffffffffffff",res)
      });
  }

  getParameters(asessmentYear: AssessmentYear) {
    let filter: string[] = new Array();
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
        undefined
      )
      .subscribe((res) => {
        asessmentYear.assessment.parameters = res.data;
      });
  }

  parameterFilter(p: Parameter){
    if (p.isDefault || p.isHistorical){
      return ![
        ParameterVerifierAcceptance.REJECTED, 
        ParameterVerifierAcceptance.RETURNED,].includes(p.verifierAcceptance)
    } else {
      return ![
        ParameterVerifierAcceptance.REJECTED, 
        ParameterVerifierAcceptance.RETURNED,
        ParameterVerifierAcceptance.DATA_ENTERED
      ].includes(p.verifierAcceptance)
    }
  }

  getAssesment() {
    let statusToRemove = [
      ParameterVerifierAcceptance.REJECTED, 
      ParameterVerifierAcceptance.RETURNED,
      ParameterVerifierAcceptance.DATA_ENTERED
    ]
    this.assesmentProxy
      .getAssment(
        this.assementYear.assessment.id,
        this.assementYear.assessmentYear
      )
      .subscribe((res) => {
        this.assementYear.assessment = res;

        this.parameters = this.assementYear.assessment.parameters;

        this.parameters = this.parameters.map(para => {
          let v = this.verificationDetails.find(o => o.parameter.id === para.id)
          if (v){
            if (v.explanation){
              para['isConcernRaised'] = true
            }
            if (v.rootCause || v.correctiveAction){
              para['canActiveAction'] = true
            }
          }
          return para
        })

        this.baselineParameters =
          this.assementYear.assessment.parameters.filter(
            (p) => p.isBaseline && this.parameterFilter(p)
          );

        this.projectParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isProject && this.parameterFilter(p)
        );
        this.lekageParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isLekage && this.parameterFilter(p)
        );

        this.projectionParameters =
          this.assementYear.assessment.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == Number(this.assementYear.assessmentYear)
              && this.parameterFilter(p)
          );
        let p = this.assementYear.assessment.parameters.filter(
          (p) => p.isProjection
        );
        console.log(res);

        this.selectedNdc = this.ndcList.find(
          (a) => a.id == this.assementYear.assessment.ndc?.id
        )!;

        this.selectedSubNdc = this.selectedNdc?.subNdc.find(
          (a) => a.id == this.assementYear.assessment.subNdc?.id
        )!;
      });
  }

  // detail() {
  //   this.router.navigate(['/qc']);
  // }

  // async submit() {

  //   await this.getVerificationDetail();

  //   this.assementYear.verificationStatus = 3;
  //   //AssessmentYearVerificationStatus.NCRecieved;
  //   let assessment = new Assessment();
  //   assessment.id = this.assementYear.assessment.id;
  //   this.assementYear.assessment = assessment;
  //   this.proxy
  //     .updateOneBaseAssessmentYearControllerAssessmentYear(
  //       this.assementYear.id,
  //       this.assementYear
  //     )
  //     .subscribe((a) => {
  //       //rederict to NC Report
  //       alert('updates');
  //     });
  // }

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

  parameterAccept(isNdc: boolean, isMethodology: boolean) {
    this.confirmationService.confirm({
      message: 'Are sure you want to accept the ' + isMethodology ? 'methodology ?': 'parameter(s) ?',
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
    let verificationDetails: VerificationDetail[] = [];

    let currentVerification = this.verificationDetails.find(
      (a) =>
        a.isNDC == IsNdc &&
        a.isMethodology == isMethodology &&
        a.verificationStage == this.getverificationStage()
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
    }

    if (
      this.assementYear.verificationStatus === 1
      //AssessmentYearVerificationStatus.Pending
    ) {
      vd.verificationStatus = 2;
      // VerificationDetailVerificationStatus.PreAssessment;
      vd.verificationStage = 1;
    } else if (
      this.assementYear.verificationStatus === 3
      // AssessmentYearVerificationStatus.NCRecieved
    ) {
      vd.verificationStatus = 4;
      //VerificationDetailVerificationStatus.InitialAssessment;
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

  raiseConcern(isNdc: boolean, isMethodology: boolean, isAssumption:boolean, isResult:boolean, column?: string) {
    if (isNdc) {
      this.raiseConcernSection = 'NDC';
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
    if (isResult){
      if (column === 'isTotal'){
        this.raiseConcernSection = 'Emission Reduction'
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a)=> a.isTotal
        )
      } else if (column === 'isMac'){
        this.raiseConcernSection = 'Mac Result'
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isMac
        )
      } else if (column === 'isDifference'){
        this.raiseConcernSection = 'Cost Difference'
        this.concernVerificationDetails = this.verificationDetails.filter(
          (a) => a.isDifference
        )
      }
    }

    this.canActiveNdcAction = true
    this.canActiveTotalAction = true
    this.canActiveMacAction = true
    this.canActiveDifferenceAction = true

    this.concernIsNdC = isNdc;
    this.concernIsMethodology = isMethodology;
    this.concernIsAssumption = isAssumption;
    this.concernIsTotal = isResult && column == 'isTotal'
    this.concernIsMac = isResult && column === 'isMac'
    this.concernIsDiff = isResult && column === 'isDifference'
    this.displayConcern = true;
  }

  sendForVerification() {
    //console.log("come inside to method ->",this.assumption)

    // this.serviceProxy
    // .getOneBaseAssessmentYearControllerAssessmentYear(
    //   this.assesMentYearId,
    //   undefined,
    //   undefined,
    //   undefined
    // )
    // .subscribe((res) => {
    //   res.assessmentAssumption = this.assumption;
    //   this.serviceProxy
    //     .updateOneBaseAssessmentYearControllerAssessmentYear(res.id, res)
    //     .subscribe((res) => {});
    // });


   

    this.assementYear.verificationStatus = 2;
    this.assementYear.assessmentAssumption = this.assumption;
    let assessment = new Assessment();
    assessment.id = this.assementYear.assessment.id;
    this.assementYear.assessment = assessment;
    this.serviceProxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assementYear.id,
        this.assementYear
      )
      .subscribe((a) => {
        //rederict to NC Report
       // alert('updates');
      
       this.messageService.add({severity:'success', summary:'Confirmed', detail:'Successfully sent to verification'});
      // window.location.reload();
      setTimeout(() => {
        window.location.reload();
      },1000);
      });
  }

  async ndcAction() {

    let data = {
      type: 'ndc',
      assessmentYear: this.assementYear
    }

    this.ref = this.dialogService.open(VerificationActionDialogComponent, {
      header: "Enter Aggregated Action",
      width: '40%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });

    this.ref.onClose.subscribe(async (res) => {
      console.log(res)
      this.selectedNdc = res.result.ndc
      this.selectedSubNdc = res.result.subNdc
      let action = `Ndc changed,  Original Value : ${this.assementYear.assessment.project.ndc.name} New Value : ${this.selectedNdc.name} \n`;

      if (this.assementYear.assessment.project.subNdc !== null || this.selectedSubNdc !== undefined){
        action = action + `Sub Ndc changed,  Original Value : ${this.assementYear.assessment.project.subNdc?.name} New Value : ${this.selectedSubNdc?.name} \n`
      }

      this.assementYear.assessment.project.ndc = this.selectedNdc;
      this.assementYear.assessment.project.subNdc = this.selectedSubNdc;

      console.log("ndcAction", this.assementYear.assessment)
      let assessment = await this.serviceProxy.getOneBaseAssesmentControllerAssessment(
        this.assementYear.assessment.id,
        undefined,
        undefined,
        0
      ).toPromise()

      let project: Project = await this.serviceProxy.getOneBaseProjectControllerProject(
        this.assementYear.assessment.project.id,
        undefined,
        undefined,
        undefined).toPromise()

      let ndc = new Ndc();
      ndc.id = this.selectedNdc.id;
      project.ndc = ndc;

      let subNdc = new SubNdc();
      subNdc.id = this.selectedSubNdc?.id;
      project.subNdc = subNdc;

      assessment.ndc = ndc
      assessment.subNdc = subNdc

      await this.serviceProxy.updateOneBaseAssesmentControllerAssessment(
        assessment.id,
        assessment
      ).toPromise()

      this.serviceProxy
        .updateOneBaseProjectControllerProject(
          project.id,
          project
        )
        .subscribe(
          (res) => {
            console.log(res)
            this.saveVerificationDetails(true, false, action);
          },
          (error) => {
            console.log('Error', error);
          }
        );

    })

  }

  toNonConformance() {
    this.router.navigate(['/non-conformance'], {
      queryParams: { id: this.assementYear.id, flag: 'sec-admin' },
    });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag:this.flag },
    });
  }

  saveVerificationDetails(
    IsNdc: boolean,
    isMethodology: boolean,
    action: string
  ) {
    let verificationDetails: VerificationDetail[] = [];

    let currentVerification = this.verificationDetails.find(
      (a) =>
        a.isNDC == IsNdc &&
        a.isMethodology == isMethodology &&
        a.verificationStage == this.getverificationStage()
    );

    let vd = new VerificationDetail();

    if (currentVerification) {     
      vd = currentVerification;
      let assesmentYear = new AssessmentYear();
      assesmentYear.id = this.assementYear.id;  
     vd.assessmentYear=assesmentYear;
      vd.updatedDate = moment();
    } else {
      vd.createdOn = moment();
      vd.updatedDate = moment();
      vd.userVerifier = this.loggedUser.id;
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

  getResult(type: any){
    if (this.assementYear.assessment.assessmentType === 'MAC'){
      if (type === "baseline"){
        return this.assessmentResult.bsTotalAnnualCost
      } else if (type === "project"){
        return this.assessmentResult.psTotalAnnualCost
      } else {
        return ''
      }
    } else {
      if (type === "baseline"){
        return this.assessmentResult.baselineResult
      } else if (type === "project"){
        return this.assessmentResult.projectResult
      } else if (type === "lekage"){
        return this.assessmentResult.lekageResult
      } else {
        return ''
      }
    }
  }

  onComplete(e:any){
    this.isCompleted = true
    if (e){
      this.displayConcern = false
    }
  }

  onResultAction(column: string){
   
    let data:any = {type: 'result'}
    this.ref = this.dialogService.open(VerificationActionDialogComponent, {
      header: "Result action",
      width: '40%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });

    this.ref.onClose.subscribe(async (res) => {
      if (res){
        console.log(res)
        let result = await this.verificationProxy.sendResultToRecalculate(this.assementYear.id).toPromise()
        console.log(result)
        let comment = this.loggedUser.userType.name + '|' + res.result.comment
        await this.saveVerificationDetailsResult(column, comment)
      }
    })
  }

  async saveVerificationDetailsResult(column: string, action: string) {
    let verificationDetail = undefined;
    let verificationStage = await this.getverificationStage()
    let verificationDetails = []
    console.log(column)
    if (this.verificationDetails) {
      console.log(this.verificationDetails)
      verificationDetail = this.verificationDetails.find(
        (a: any) =>
          a.isResult === true && a[column] === true &&
          a.verificationStage == verificationStage
      );
      console.log("selected verificationDetail", verificationDetail)
      let _vd = new VerificationDetail();
      if (verificationDetail) {
        _vd = verificationDetail;
      } else {
        _vd.assessmentId = this.assementYear.assessment.id;
        let assesmentYear = new AssessmentYear();
        assesmentYear.id = this.assementYear.id;
        _vd.assessmentYear = assesmentYear;
        _vd.year = Number(this.assementYear.assessmentYear);
        _vd.createdOn = moment();
        _vd.isAccepted = false;
        if(column == 'isTotal'){_vd.isTotal =true}
        else if( column == 'isMac') {_vd.isMac =true}
        else if (column =='isDifference'){_vd.isDifference=true}

      //  _vd[column] = true
      }
      _vd.editedOn = moment();
      _vd.updatedDate = moment();
      _vd.verificationStage = await this.getverificationStage();
      _vd.verificationStatus = Number(this.assementYear.verificationStatus);
      _vd.action = action
      verificationDetails.push(_vd)
    }

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'successfully Save.',
          closable: true,
        });
        window.location.reload()
      });
  }

  onHide() {
    if(!this.isCompleted) {
      if (this.concernIsNdC){
        this.canActiveNdcAction = false
      } else if(this.concernIsTotal){
        this.canActiveTotalAction = false
      } else if (this.concernIsMac){
        this.canActiveMacAction = false
      } else if (this.concernIsDiff){
        this.canActiveDifferenceAction = false
      }
    }
  }
}

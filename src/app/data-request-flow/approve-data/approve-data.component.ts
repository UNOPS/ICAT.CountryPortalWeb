import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  AssessmentControllerServiceProxy,
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  DataVerifierDto,
  InstitutionControllerServiceProxy,
  Parameter,
  ParameterControllerServiceProxy,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestControllerServiceProxy,
  ParameterVerifierAcceptance,
  ServiceProxy,
  UpdateDeadlineDto,
  UpdateValueEnterData,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-approve-data',
  templateUrl: './approve-data.component.html',
  styleUrls: ['./approve-data.component.css'],
})
export class ApproveDataComponent implements OnInit {
  assessmentYearId: number = 0;
  assessmentYear: any;
  assementYearDetails: AssessmentYear = new AssessmentYear();
  parameters: Parameter[] = [];
  baselineParameters: Parameter[] = [];
  baselineParametersAcceptcount :number =0;
  baselineParameterscount:number =0;
  projectParameters: Parameter[] = [];
  projectParametersAcceptcount :number =0;
  projectParameterscount:number =0;
  lekageParameters: Parameter[] = [];
  lekageParametersAcceptcount :number =0;
  projectionParameters: Parameter[] = [];
  projectionParametersAcceptcount :number =0;
  loading: boolean = false;
  confirm1: boolean;
  institutionList: any[] = [];
  selectedInstitution: any;
  selectedDeadline: Date;
  selectedQCDeadline: Date;
  reasonForReject: string;
  minDate: Date;
  selectedParameters: any[] = [];
  selectedBaselineParameters: any[] = [];
  selectedProjectParameters: any[] = [];
  selectedLeakageParameters: any[] = [];
  selectedProjectionParameters: any[] = [];

  headerlcimateActionName: string;
  headerAssessmentType: string;
  headerNDCName: string;
  headerSubNDCName: string;
  headerBaseYear: string;
  headerAssessmentYear: number;
  userName: string;
  enableQCButton = false;
  isRejectButtonDisable = false;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory = false;
  buttonLabel = 'Send to QC';
  isOpenPopUp = false;
  isHideRejectButton = false;
  hideAllButtons: any;
  finalQC: any;

  constructor(
    private route: ActivatedRoute,
    private proxy: ServiceProxy,
    private assessmentProxy: AssessmentControllerServiceProxy,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private messageService: MessageService,
    private serviceProxy: ServiceProxy,
    private parameterControlProxy: ParameterControllerServiceProxy,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private instProxy: InstitutionControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name')!;
    this.route.queryParams.subscribe((params) => {
      this.assessmentYearId = params['id'];
    });

    this.serviceProxy
      .getOneBaseAssessmentYearControllerAssessmentYear(
        this.assessmentYearId,
        undefined,
        undefined,
        undefined
      )
      .subscribe(async (res: any) => {
        this.finalQC = res;
        this.assessmentYear = res
        if (this.finalQC != null) {
          if (this.finalQC.qaStatus != 4) {
            this.isRejectButtonDisable = false;
            if(this.finalQC.qaStatus==1){
              await this.checkQC()
              if (this.finalQC.verificationStatus === 8){
                if (this.enableQCButton){
                  this.isHideRejectButton = true;
                } else {
                  this.isHideRejectButton = false
                }
              } else {
                this.isHideRejectButton = true;
              }
            }
            else {this.isHideRejectButton = false;}
          }
        }
      });

    this.assessmentYearProxy
      .getAssessmentByYearId(this.assessmentYearId, this.userName)
      .subscribe(async (res) => {
        if (res) {
          this.hideAllButtons = res?.qaStatus;
          this.assessmentYear = res;
          this.headerlcimateActionName =
            res.assessment?.Project.climateActionName;
          this.headerAssessmentType = res.assessment?.assessmentType;
          this.headerNDCName = res.assessment?.ndc?.name;
          this.headerSubNDCName = res.assessment?.subNdc?.name;
          this.headerAssessmentYear = res?.assessmentYear;
          this.headerBaseYear = res?.assessment?.baseYear;
        }

        this.getAssessment();
        if (this.finalQC?.qaStatus == null) {
          this.checkQC();
        }
      });

    const filter2: string[] = [];

    filter2.push('type.id||$eq||' + 3);

    this.instProxy.getInstitutionforApproveData().subscribe((a: any) => {
      this.institutionList = a;
    });
  }


  getAssessment() {
    this.assessmentProxy
      .getAssessmentsForApproveData(
        this.assessmentYear.assessment.id,
        this.assessmentYear.assessmentYear,
        this.userName
      )
      .subscribe((res) => {
        this.assementYearDetails.assessment = res;

        this.parameters = this.assementYearDetails.assessment?.parameters;

        let statusToRemove = [ParameterVerifierAcceptance.REJECTED]

        this.baselineParameters =
          this.assementYearDetails.assessment?.parameters.filter(
            (p) => p.isBaseline  && !statusToRemove.includes(p.verifierAcceptance) && p.institution
          );
            if(this.baselineParameters){
              for(let n of this.baselineParameters){
                this.baselineParameterscount += 1;
                if(n.parameterRequest.dataRequestStatus==11){
                  this.baselineParametersAcceptcount +=1;
                }
              }
            }
          
        this.projectParameters =
          this.assementYearDetails?.assessment?.parameters.filter(
            (p) => p.isProject  && !statusToRemove.includes(p.verifierAcceptance) && p.institution
          );
          if(this.projectParameters){
            for(let n of this.projectParameters){
              this.projectParameterscount += 1;
              if(n.parameterRequest.dataRequestStatus==11){
                this.projectParametersAcceptcount +=1;
              }
            }
          }
         
        this.lekageParameters =
          this.assementYearDetails?.assessment?.parameters.filter(
            (p) => p.isLekage  && !statusToRemove.includes(p.verifierAcceptance) && p.institution
          );
          if(this.lekageParameters){
            for(let n of this.lekageParameters){
              this.lekageParametersAcceptcount += 1;
              if(n.parameterRequest.dataRequestStatus==11){
                this.lekageParametersAcceptcount +=1;
              }
            }
          }
        
        this.projectionParameters =
          this.assementYearDetails?.assessment?.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == this.headerAssessmentYear &&
              !statusToRemove.includes(p.verifierAcceptance) && p.institution
          );
          if(this.projectionParameters){
            for(let n of this.projectionParameters){
              if(n.parameterRequest.dataRequestStatus==11){
                this.projectionParametersAcceptcount +=1;
              }
            }
          }
      });
  }

  async checkQC() {
    let r = await this.assessmentProxy.checkAssessmentReadyForQC(
      this.assessmentYear.assessment.id, this.assessmentYear.assessmentYear
    ).toPromise()
    if (r) {
      this.enableQCButton = r;
      this.isRejectButtonDisable = !r;
    }
  }
  onRejectClick() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    if (this.selectedParameters.length > 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Only one Parameter can be selected at a time for Rejection!',
      });
      this.clearParameters();
      return;
    }

    if (this.selectedParameters.length > 0) {
      this.confirm1 = true;
    } else {
      this.clearParameters();
    }
  }

  onRejectConfirm() {
    this.selectedParameters.push(
      ...this.selectedBaselineParameters,
      ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters,
      ...this.selectedProjectionParameters,
    );
    const idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      if (
        element.parameterRequest.dataRequestStatus &&
        element.parameterRequest.dataRequestStatus == 9
      ) {
        idList.push(element.parameterRequest.id);
      }
    }
    if (idList.length > 0) {
      const inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.status = -9;
      inputParameters.comment = this.reasonForReject;
      inputParameters.deadline = moment(this.selectedDeadline);
      this.parameterProxy.rejectReviewData(inputParameters).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data was rejected successfully',
          });
          const updateInstitutionDto = new UpdateValueEnterData();
          updateInstitutionDto.id = idList[0];
          updateInstitutionDto.institutionId = this.selectedInstitution.id;
          this.parameterControlProxy
            .updateInstitution(updateInstitutionDto)
            .subscribe();
          this.clearParameters();
          this.getAssessment();
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
          });
        },
      );
    }
    this.confirm1 = false;
    this.clearParameters();
  }

  onClickQC() {
    this.isHideRejectButton = true;

    this.assessmentYear.qaDeadline = this.selectedQCDeadline;

    this.proxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assessmentYear.id,
        this.assessmentYear,
      )
      .subscribe((res) => {});

    const inputParameters = new DataVerifierDto();
    inputParameters.ids = [this.assessmentYearId];
    inputParameters.status = 1;

    this.buttonLabel = 'Sent';
    this.enableQCButton = false;
    this.isRejectButtonDisable = false;

    this.assessmentYearProxy.acceptQC(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data is sent to QC successfully',
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      },
    );
    this.isRejectButtonDisable = true;
    this.isOpenPopUp = false;
  }

  onOpenPopUP() {
    this.isOpenPopUp = true;
  }

  getInfo(obj: any) {
    this.paraId = obj.id;

    this.prHistoryProxy.getHistroyByid(this.paraId).subscribe((res) => {
      this.requestHistoryList = res;
    });

    this.displayHistory = true;
  }

  onAcceptClick() {
    this.selectedParameters.push(
      ...this.selectedBaselineParameters,
      ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters,
      ...this.selectedProjectionParameters,
    );

    if (this.selectedParameters.length > 0) {
      const idList = new Array<number>();
      for (let index = 0; index < this.selectedParameters.length; index++) {
        const element = this.selectedParameters[index];

        if (
          element.parameterRequest.dataRequestStatus &&
          element.parameterRequest.dataRequestStatus == 9
        ) {
          idList.push(element.parameterRequest.id);
        }
      }
      if (idList.length > 0) {
        let inputParameters = new UpdateDeadlineDto();
        inputParameters.ids = idList;
        inputParameters.status = 11;
        inputParameters.verificationStatus = this.assessmentYear.verificationStatus
        this.parameterProxy.acceptReviewData(inputParameters).subscribe(
          async (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data is approved successfully',
            });
            this.clearParameters();
            this.getAssessment();
            this.checkQC();
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Internal server error, please try again.',
            });
          }
        );
      }
    }
    this.selectedParameters = []
    this.baselineParametersAcceptcount = 0
    this.projectParametersAcceptcount = 0
  }

  clearParameters() {
    this.selectedParameters = [];
    this.selectedBaselineParameters = [];
    this.selectedLeakageParameters = [];
    this.selectedProjectParameters = [];
    this.selectedProjectionParameters = [];
  }

  disableAccept() {
    return (this.isHideRejectButton || this.enableQCButton) ||
      (this.baselineParameters?.length == this.baselineParametersAcceptcount) &&
      (this.projectParameters?.length == this.projectParametersAcceptcount) &&
      (this.lekageParameters?.length === this.lekageParametersAcceptcount) &&
      (this.projectionParameters?.length === this.projectionParametersAcceptcount)
  }

  disableReject() {
    return this.isRejectButtonDisable ||
      (this.baselineParameters?.length == this.baselineParametersAcceptcount) &&
      (this.projectParameters?.length == this.projectParametersAcceptcount) &&
      (this.lekageParameters?.length === this.lekageParametersAcceptcount) &&
      (this.projectionParameters?.length === this.projectionParametersAcceptcount)
  }

  getAcceptLabel() {
    return ((this.baselineParameters?.length == this.baselineParametersAcceptcount) &&
      (this.projectParameters?.length == this.projectParametersAcceptcount) &&
      (this.lekageParameters?.length === this.lekageParametersAcceptcount) &&
      (this.projectionParameters?.length === this.projectionParametersAcceptcount)) ? 'Accepted' : 'Accept'
  }
}

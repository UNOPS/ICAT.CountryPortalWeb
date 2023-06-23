import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  AssesmentControllerServiceProxy,
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
  assesmentYearId: number = 0;
  assementYear: any;
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
  enableQCButton: boolean = false;
  isRejectButtonDisable: boolean = false;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory: boolean = false;
  buttonLabel: string = 'Send to QC';
  isOpenPopUp: boolean = false;
  isHideRejectButton: boolean = false;
  hideAllButtons: any;
  finalQC: any;


  constructor(
    private route: ActivatedRoute,
    private proxy: ServiceProxy,
    private assesmentProxy: AssesmentControllerServiceProxy,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private messageService: MessageService,
    private serviceProxy: ServiceProxy,
    private parameterControlProxy: ParameterControllerServiceProxy,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private instProxy: InstitutionControllerServiceProxy
  ) { }

  ngOnInit(): void {
    /*
    this.route.queryParams.subscribe((params) => {
      this.assessmentId = params['id'];
      console.log('id...', this.assessmentId);
    });
    */
    this.userName = localStorage.getItem('user_name')!;
    this.route.queryParams.subscribe((params) => {
      this.assesmentYearId = params['id'];
      // this.assesMentYearId = 3;
      console.log('my id..,,', this.assesmentYearId);
    });

    this.serviceProxy
      .getOneBaseAssessmentYearControllerAssessmentYear(
        this.assesmentYearId,
        undefined,
        undefined,
        undefined
      )
      .subscribe(async (res: any) => {
        this.finalQC = res;
        this.assementYear = res
        if (this.finalQC != null) {
          // if (this.finalQC.qaStatus != null) {
          //   console.log('Asseyear...', this.finalQC.qaStatus);
          //   this.isRejectButtonDisable = true;
          //   this.isHideRejectButton = true;
          // }
          if (this.finalQC.qaStatus != 4) {
            console.log('Asseyear...', this.finalQC.qaStatus);
            this.isRejectButtonDisable = false;
            if(this.finalQC.qaStatus==1){
              console.log("qa status")
              await this.checkQC()
              if (this.finalQC.verificationStatus === 8){
                console.log(this.enableQCButton)
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
        //  this.assessmentYear = res;
        //  console.log("Asseyear...",this.assessmentYear)
      });

    this.assessmentYearProxy
      .getAssessmentByYearId(this.assesmentYearId, this.userName)
      .subscribe(async (res) => {
        if (res) {
          this.hideAllButtons = res?.qaStatus;
          console.log('qc staysu..', this.hideAllButtons);
          this.assementYear = res;
          this.headerlcimateActionName =
            res.assessment?.Project.climateActionName;
          this.headerAssessmentType = res.assessment?.assessmentType;
          this.headerNDCName = res.assessment?.ndc?.name;
          this.headerSubNDCName = res.assessment?.subNdc?.name;
          this.headerAssessmentYear = res?.assessmentYear;
          this.headerBaseYear = res?.assessment?.baseYear;
        }
        console.log('res', res);
        this.getAssesment();
        if (this.finalQC?.qaStatus == null) {
          await this.checkQC();
        }
      });

    // this.proxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res) => {
    //     this.institutionList = res.data;
    //   });
    let filter2: string[] = new Array();

    filter2.push('type.id||$eq||' + 3);

    // this.proxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     filter2,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    this.instProxy.getInstitutionforApproveData().subscribe((a: any) => {
      console.log('my institutions', a);
      this.institutionList = a;
    });
  }

  // getParameters(asessmentYear: AssessmentYear) {
  //   let filter: string[] = new Array();
  //   filter.push('assessment.id||$eq||' + asessmentYear.assessment.id);
  //   filter.push('projectionYear||$eq||' + asessmentYear.assessmentYear);

  //   this.proxy
  //     .getManyBaseParameterControllerParameter(
  //       undefined,
  //       undefined,
  //       filter,
  //       undefined,
  //       undefined,
  //       undefined,
  //       1000,
  //       0,
  //       0,
  //       undefined
  //     )
  //     .subscribe((res) => {
  //       asessmentYear.assessment.parameters = res.data;
  //     });
  // }

  getAssesment() {
    this.assesmentProxy
      .getAssessmentsForApproveData(
        this.assementYear.assessment.id,
        this.assementYear.assessmentYear,
        this.userName
      )
      .subscribe((res) => {
        console.log('assessment', res);
        this.assementYearDetails.assessment = res;

        this.parameters = this.assementYearDetails.assessment?.parameters;

        let statusToRemove = [ParameterVerifierAcceptance.REJECTED]

        this.baselineParameters =
          this.assementYearDetails.assessment?.parameters.filter(
            (p) => p.isBaseline  && !statusToRemove.includes(p.verifierAcceptance) && p.institution
          );
          console.log(this.baselineParameters)
            if(this.baselineParameters){
              for(let n of this.baselineParameters){
                this.baselineParameterscount += 1;
                console.log("baselineParameterscount",this.baselineParameterscount)
                if(n.parameterRequest.dataRequestStatus==11){
                  this.baselineParametersAcceptcount +=1;
                  console.log("baselineParametersAcceptcount",this.baselineParametersAcceptcount)
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
              // this.projectionParametersAcceptcount += 1;
              if(n.parameterRequest.dataRequestStatus==11){
                this.projectionParametersAcceptcount +=1;
              }
            }
          }
         
        console.log('projectionParameters', this.projectionParameters);
      });
  }

  async checkQC() {
    // this.assesmentProxy
    //   .checkAssessmentReadyForQC(
    //     this.assementYear.assessment.id,
    //     this.assementYear.assessmentYear
    //   )
    //   .subscribe((r) => {
    //     console.log('checkAssessmentReadyForQC', r);
    //     if (r) {
    //       console.log('check res...', r);
    //       this.enableQCButton = r;
    //       this.isRejectButtonDisable = !r;
    //     }
    //   });
    // console.log(this.assementYear)
    let r = await this.assesmentProxy.checkAssessmentReadyForQC(
      this.assementYear.assessment.id, this.assementYear.assessmentYear
    ).toPromise()
    // console.log('checkAssessmentReadyForQC', r);
    if (r) {
      // console.log('check res...', r);
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
      this.clearParameters()
      return;
    }

    if (this.selectedParameters.length > 0) {
      this.confirm1 = true;
    } else {
      this.clearParameters();
    }
  }

  onRejectConfirm() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    let idList = new Array<number>();
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
          let updateInstitutionDto = new UpdateValueEnterData();
          updateInstitutionDto.id = idList[0];
          updateInstitutionDto.institutionId = this.selectedInstitution.id;
          this.parameterControlProxy
            .updateInstitution(updateInstitutionDto)
            .subscribe();
          this.clearParameters();
          this.getAssesment();
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
    this.confirm1 = false;
    this.clearParameters();
  }

  onClickQC() {
    this.isHideRejectButton = true; 
    // console.log('selected qc dead line..', this.selectedQCDeadline);
    this.assementYear.qaDeadline = this.selectedQCDeadline;
    // console.log('qc dead line..', this.assementYear);
    this.proxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assementYear.id,
        this.assementYear
      )
      .subscribe((res) => {
        // console.log('my updatedt asse year..', res);
      });

    let inputParameters = new DataVerifierDto();
    inputParameters.ids = [this.assesmentYearId];
    inputParameters.status = 1;
    // console.log('inputParameters', inputParameters);
    this.buttonLabel = 'Sent';
    this.enableQCButton = false;
    this.isRejectButtonDisable = false;
    // console.log('sent');
    this.assessmentYearProxy.acceptQC(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data is sent to QC successfully',
        });

        //  this.selectedParameters = [];
        //  this.onSearch();
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
    this.isRejectButtonDisable = true;
    this.isOpenPopUp = false;
  }

  onOpenPopUP() {
    this.isOpenPopUp = true;
  }

  getInfo(obj: any) {
    // console.log('dataRequestList...', obj);
    this.paraId = obj.id;
    // console.log('this.paraId...', this.paraId);

    // let x = 602;
    this.prHistoryProxy
      .getHistroyByid(this.paraId) // this.paraId
      .subscribe((res) => {
        this.requestHistoryList = res;

        // console.log('this.requestHistoryList...', this.requestHistoryList);
      });
    //  let filter1: string[] = [];
    //  filter1.push('parameter.id||$eq||' + this.paraId);
    //  this.serviceProxy
    //  .getManyBaseParameterRequestControllerParameterRequest(
    //    undefined,
    //    undefined,
    //    filter1,
    //    undefined,
    //    undefined,
    //    undefined,
    //    1000,
    //    0,
    //    0,
    //    0
    //  )
    //  .subscribe((res: any) => {
    //    this.requestHistoryList =res.data;

    //    console.log('this.requestHistoryList...', this.requestHistoryList);
    //  });

    this.displayHistory = true;
  }

  onAcceptClick() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    // console.log('selectedParameters', this.selectedParameters);
    if (this.selectedParameters.length > 0) {
      let idList = new Array<number>();
      for (let index = 0; index < this.selectedParameters.length; index++) {
        const element = this.selectedParameters[index];
        // console.log('Review parameter Accept', element);
        if (
          element.parameterRequest.dataRequestStatus &&
          element.parameterRequest.dataRequestStatus == 9
        ) {
          // if not rejected parameter to continue
          idList.push(element.parameterRequest.id);
        }
      }
      if (idList.length > 0) {
        let inputParameters = new UpdateDeadlineDto();
        inputParameters.ids = idList;
        inputParameters.status = 11;
        inputParameters.verificationStatus = this.assementYear.verificationStatus
        // console.log('inputParameters', inputParameters);
        this.parameterProxy.acceptReviewData(inputParameters).subscribe(
          async (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data is approved successfully',
            });
            this.clearParameters();
            this.getAssesment();
            await this.checkQC();
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
    // this.getAssesment()
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
      (this.projectParameters?.length == this.projectParametersAcceptcount)&&
      (this.lekageParameters?.length === this.lekageParametersAcceptcount) &&
      (this.projectionParameters?.length === this.projectionParametersAcceptcount)
  }

  getAcceptLabel() {
    return ((this.baselineParameters?.length == this.baselineParametersAcceptcount) &&
      (this.projectParameters?.length == this.projectParametersAcceptcount)&&
      (this.lekageParameters?.length === this.lekageParametersAcceptcount) &&
      (this.projectionParameters?.length === this.projectionParametersAcceptcount)) ? 'Accepted' : 'Accept'
  }
}

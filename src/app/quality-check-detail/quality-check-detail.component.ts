import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuAlityCheckStatus } from 'app/Model/QuAlityCheckStatus.enum';

import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  AssesmentControllerServiceProxy,
  AssesmentResaultControllerServiceProxy,
  Assessment,
  AssessmentResault,
  AssessmentYear,
  Parameter,
  ParameterControllerServiceProxy,
  ProjectionResault,
  ProjectionResaultControllerServiceProxy,
  AssessmentYearControllerServiceProxy,
  ServiceProxy,
  ParameterVerifierAcceptance,
  AssessmentYearVerificationStatus,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-quality-check-detail',
  templateUrl: './quality-check-detail.component.html',
  styleUrls: ['./quality-check-detail.component.css'],
})
export class QualityCheckDetailComponent implements OnInit {
  assesMentYearId: number = 0;
  assementYear: AssessmentYear = new AssessmentYear();
  parameters: Parameter[] = [];
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

  assesmentResultComment = '';
  assesmentResultCommentRequried: boolean = false;

  selectdAssementType: number;
  isApproveAssement: boolean = false;
  flag:number;
  macValList: any;
  discountrate: any = null;
  macResult: any;
  assessmentList1: Assessment[] = [];
  macValue: any = {
    DiscountRate: '',
    reduction: '',
    year: '',
    baseline: {
      //baseline details
      bsTotalInvestment: '',
      bsAnnualOM: '',
      bsOtherAnnualCost: '',
      bsAnnualFuel: '',
      bsProjectLife: '',
    },
    project: {
      // project details
      psTotalInvestment: '',
      psOtherAnnualCost: '',
      psAnnualOM: '',
      psAnnualFuel: '',
      psProjectLife: '',
    },
  };
  isDisable:boolean = false;
  asseYearId:number;
  asseId:number;
  asseResult:any [] = [];
  projectionResults:any[]= [];
  isReadyToCAl:boolean;
  flagQC:number = 1;
  baseImage:any;
  projectImage:any;
  projectionImage:any;
  leakageImage:any;
  resultImage:any;
  methodDocument:any;
  assessmentType:string;
  isbsResultButtonsDisable:boolean= false;
  isbsResultButtonsDisableReject:boolean= false;
  ispsResultButtonsDisable:boolean= false;
  ispsResultButtonsDisableReject:boolean= false;
  islkResultButtonsDisable:boolean= false;
  islkResultButtonsDisableReject:boolean= false;
  isteResultButtonsDisable:boolean= false;
  isteResultButtonsDisableReject:boolean= false;
  ismacResultButtonsDisable:boolean= false;
  ismacResultButtonsDisableReject:boolean= false;
  iscdResultButtonsDisable:boolean= false;
  iscdResultButtonsDisableReject:boolean= false;
  isbstacResultButtonsDisable:boolean= false;
  isbstacResultButtonsDisableReject:boolean= false;
  ispstacResultButtonsDisable:boolean= false;
  ispstacResultButtonsDisableReject:boolean= false;
  isProjectionResultButtonsDisable:boolean= false;
  isProjectionResultButtonsDisableReject:boolean= false;
  asseResultFromDB:AssessmentResault;

  isSubmitButtondisable:boolean=false;

  isApproveAllAssesmentResult:boolean=false;
  isApproveAllProjectionResult:boolean=false;
  verificationStatusIsNull:boolean=false;
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
    private assesmentProxy: AssesmentControllerServiceProxy,
    private assesmentResaultProxy: AssesmentResaultControllerServiceProxy,
    private projectionResultProxy: ProjectionResaultControllerServiceProxy,
    private  assessmentYearControllerServiceProxy:AssessmentYearControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private paramProxy: ParameterControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private httpClient: HttpClient
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
          undefined
        )
        .subscribe(async (res) => {
          this.assementYear = res;
          if(this.assementYear.qaStatus== 3 || this.assementYear.qaStatus== 4 )
          {
            this.isSubmitButtondisable = true;
          }
          this.asseYearId = this.assementYear.id;
          this.asseId = this.assementYear.assessment.id;
         
          
            if(this.assementYear.verificationStatus==undefined || this.assementYear.verificationStatus == null || this.assementYear.verificationStatus === 8 ){
              this.verificationStatusIsNull=true;
             
            }
         



         
          let filterResult: string[] = new Array();
          filterResult.push('assessmentYear.id||$eq||' +this.asseYearId)&
          filterResult.push('assement.id||$eq||' +this.asseId);
          //filterResult.push('Assessment.assessmentType||$in||' +this.approachList);
          this.serviceProxy.getManyBaseAssesmentResaultControllerAssessmentResault
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
          //  console.log('this.asseResult...', this.asseResult);

           if(this.asseResult.length > 0 && this.asseResult[0]?.isResultupdated && !this.asseResult[0].isResultRecalculating)
           {
             this.isReadyToCAl = false;
            //  console.log("this.isReadyToCAl..",this.isReadyToCAl)
             this.isDisable = true;

             if(this.asseResult[0].qcStatusBaselineResult == 4)
             {
              this.isbsResultButtonsDisable = true;
              this.isbsResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatusBaselineResult == 3)
             {
             // this.isbsResultButtonsDisable = true;
              this.isbsResultButtonsDisableReject = true;
             }

             if(this.asseResult[0].qcStatuProjectResult == 4)
             {
              this.ispsResultButtonsDisable = true;
              this.ispsResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatuProjectResult == 3)
             {
              //this.ispsResultButtonsDisable = true;
              this.ispsResultButtonsDisableReject = true;
             }

             if(this.asseResult[0].qcStatusLekageResult == 4)
             {
              this.islkResultButtonsDisable = true;
              this. islkResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatusLekageResult == 3)
             {
              //this.islkResultButtonsDisable = true;
              this.islkResultButtonsDisableReject = true;
             }

             if(this.asseResult[0].qcStatusTotalEmission == 4)
             {
              this.isteResultButtonsDisable = true;
              this.isteResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatusTotalEmission == 3)
             {
              //this.isteResultButtonsDisable = true;
              this.isteResultButtonsDisableReject = true;
             }

             if(this.asseResult[0].qcStatusmacResult == 4)
             {
              this.ismacResultButtonsDisable = true;
              this.ismacResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatusmacResult == 3)
             {
              this.ismacResultButtonsDisable = true;
              this.ismacResultButtonsDisableReject = true;
             }

             if(this.asseResult[0].qcStatuscostDifference == 4)
             {
              this.iscdResultButtonsDisable = true;
              this.iscdResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatuscostDifference == 3)
             {
              //this.iscdResultButtonsDisable = true;
              this.iscdResultButtonsDisableReject = true;
             }
             
             if(this.asseResult[0].qcStatuspsTotalAnnualCost == 4)
             {
              this.ispstacResultButtonsDisable = true;
              this.ispstacResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatuspsTotalAnnualCost == 3)
             {
              //this.ispstacResultButtonsDisable = true;
              this.ispstacResultButtonsDisableReject = true;
             }

             if(this.asseResult[0].qcStatusbsTotalAnnualCost == 4)
             {
              this.isbstacResultButtonsDisable = true;
              this. isbstacResultButtonsDisableReject = true;
             }
             if(this.asseResult[0].qcStatusbsTotalAnnualCost == 4)
             {
              //this.isbstacResultButtonsDisable = true;
              this. isbstacResultButtonsDisableReject = true;
             }

             this.isApproveAllAssesmentResult= await this.assesmentResaultProxy.checkAllQCApprovmentAssessmentResult(this.asseResult[0].id).toPromise();
           }
           else{
            this.assesmentProxy
            .checkAssessmentReadyForCalculate( this.assementYear.assessment.id,Number( this.assementYear.assessmentYear))
            .subscribe((r) => {
              // console.log('checkAssessmentReadyForcal....', r);
              this.isReadyToCAl = r;
              // console.log("this.isReadyToCAl..from back",this.isReadyToCAl)
              //this.isReadyToCal.emit(r);
            });
            
           }
           
          });


          let filterProjectionResult: string[] = new Array();
        //  filterResult.push('assessmentYear.id||$eq||' +this.asseYearId)&
          filterProjectionResult.push('assement.id||$eq||' +this.asseId);
          //filterResult.push('Assessment.assessmentType||$in||' +this.approachList);
          this.serviceProxy.getManyBaseProjectionResaultControllerProjectionResault
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

          if(this.projectionResults.length > 0)
           {

            if(this.projectionResults[0].qcStatus == 4)
            {
              this.isProjectionResultButtonsDisable= true
              this.isProjectionResultButtonsDisableReject= true;
            }

           }

          });



          this.getAssesment();
          this.getAssesmentResult(false);
          this.getProjectionResult();
          await this.getVerificationDetails()
        });
    });



  }

  async getVerificationDetails(){
    this.verificationList = (await this.assessmentYearControllerServiceProxy
      .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assementYear.assessment.id, this.assementYear.assessmentYear)
      .toPromise())[0]?.verificationDetail;
  }


 

  getAssesmentResult(isCalculate: boolean) {

    // console.log(' this.assementYear.assessment.id', this.assementYear.assessment.id,)
    // console.log('this.assesMentYearId',this.assesMentYearId)
    this.assesmentResaultProxy
      .getAssesmentResult(
        this.assementYear.assessment.id,
        this.assesMentYearId,
        isCalculate,
        '',
        "1234"
        // true
      )
      .subscribe((res) => {
        this.assessmentResult = res;
        // console.log('assessmentResult',res)
        if (isCalculate) {
          this.getAssesmentResult(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Calculation completed.',
            closable: true,
          });
          // } else {
          //   this.messageService.add({
          //     severity: 'success',
          //     summary: 'Success',
          //     detail: 'Calculation completed.',
          //     closable: true,
          //   });
        }
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
      });
  }

  addItem(newItem: boolean) {

    //this.items.push(newItem);
    this.isReadyToCAl = newItem;
   // this.isReadyToCAl = true;
    // console.log("ccc result..",newItem)
  }


  openDoc()
  {
    if(this.methodDocument == null)
    {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error,No documents for this methodology!.',
      });
    }
    else{
      window.location.href =  this.methodDocument;
    }

    //window.location.href =  this.methodDocument;
   
  }

  getParameters(asessmentYear: AssessmentYear) {
    let filter: string[] = new Array();
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
        undefined
      )
      .subscribe((res) => {
        // console.log(this.parameters);
        asessmentYear.assessment.parameters = res.data;
      });
  }

  parameterFilter(p: Parameter){
    if (p.isDefault || p.isHistorical){
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

  getAssesment() {
    this.assesmentProxy
      .getAssment(
        this.assementYear.assessment.id,
        this.assementYear.assessmentYear
      )
      .subscribe((res) => {
        this.assementYear.assessment = res;

        this.baseImage = this.assementYear.assessment?.methodology?.baselineImage;
        this.projectImage = this.assementYear.assessment?.methodology?.projectImage;
        this.projectionImage = this.assementYear.assessment?.methodology?.projectionImage;
        this.leakageImage = this.assementYear.assessment?.methodology?.leakageImage;
        this.resultImage = this.assementYear.assessment?.methodology?.resultImage;
        this.methodDocument = this.assementYear.assessment?.methodology?.documents;
        this.assessmentType = this.assementYear.assessment?.assessmentType;
        // console.log("parameter meth..",this.baseImage)
        // this.paramProxy
        //   .parameterByAssesment(this.assementYear.assessment.id)
        //   .subscribe((res) => {
        //     console.log('wwwwwwwwwwwwwwwwww');
        //     console.log(res);
        //   });

        this.parameters = this.assementYear.assessment.parameters;
        // console.log("para....w",this.parameters)

        let statusToRemove = [ParameterVerifierAcceptance.REJECTED, ParameterVerifierAcceptance.RETURNED]

        this.baselineParameters =
          this.assementYear.assessment.parameters.filter(
            (p) => p.isBaseline
            && this.parameterFilter(p)
          );

        this.projectParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isProject
          && this.parameterFilter(p)
        );
        this.lekageParameters = this.assementYear.assessment.parameters.filter(
          (p) => p.isLekage
          && this.parameterFilter(p)
        );
        this.projectionParameters =
          this.assementYear.assessment.parameters.filter(
            (p) =>
              p.isProjection &&
              p.projectionBaseYear == Number(this.assementYear.assessmentYear)
              && this.parameterFilter(p)
          );
      });
  }

  detail(climateactions: any) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag:this.flagQC },
    });
  }

  async submit() {
    let notReceived = 0
    let status = [ ParameterVerifierAcceptance.RETURNED]
    for await (let para of this.assementYear.assessment.parameters){
      if (status.includes(para.verifierAcceptance) ){
        notReceived += 1
      }
    }
    if (notReceived > 0){
      this.messageService.add({
        severity: 'warn',
        summary: "Warning",
        detail: "There are parameters in data collection path"
      })
    } else {
      // console.log("cccccccccc",this.assementYear.assessment.assessmentType)
      if (this.assementYear.assessment.assessmentType != 'MAC') {
        // console.log("cccccccccc",this.assementYear.assessment.assessmentType)
        this.getAssesmentResult(true);
      } else {
        // console.log("cccccccccc",this.assementYear.assessment.assessmentType)
        this.toCalMacResult();
      }
      this.isReadyToCAl = false;
      this.isDisable = true;
      // window.location.reload()
    }
  }

  toCalMacResult() {
    let filter1: string[] = new Array();
    filter1.push('assessment.id||$eq||' + this.assementYear.assessment.id);
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
        // console.log('this.macValList...', this.macValList);
        this.discountrate = this.macValList.find(
          (o: any) => o.name == 'Discount Rate'
        ).value;
        // console.log('this.assementYear...', this.assementYear.assessmentYear);

        this.macValue = {
          DiscountRate: this.macValList.find(
            (o: any) => o.name == 'Discount Rate'
          ).value,
          reduction: this.macValList.find((o: any) => o.name == 'Reduction')
            .value,
          year: this.assementYear.assessmentYear,
          baseline: {
            //baseline details
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
            // project details
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
        let headers = new HttpHeaders().set('api-key','1234');
        //  console.log("my url...",Url)
        //let fullUrl = 'http://35.154.205.109:3600/mac';
        // console.log("going to call cal engine...,macUrl")
        this.httpClient.post<any>(macUrl, this.macValue,{'headers':headers}).subscribe(
          (res) => {
            // this.load();
            this.macResult = res;
            // console.log("=================================");
            // console.log('my mac...', res);
            // console.log("my mac111...",res['baseLineAnnualCost']);

            setTimeout(() => {
              let assessmentResult = new AssessmentResault();
              assessmentResult.bsTotalAnnualCost =
                this.macResult['baseLineAnnualCost'];
              assessmentResult.psTotalAnnualCost =
                this.macResult['projecrAnnualCost'];
              assessmentResult.costDifference =
                this.macResult['totalAnnualCost']; //this should be checked
              assessmentResult.macResult = this.macResult['mac']; //this.result.mac;
              assessmentResult.assessmentYear.id = this.assesMentYearId;
              assessmentResult.assement.id = this.assementYear.assessment.id;
              this.assessmentResult = assessmentResult;

              // console.log('assessmentResult...', this.assessmentResult);

              this.serviceProxy
                .createOneBaseAssesmentResaultControllerAssessmentResault(
                  this.assessmentResult
                )
                .subscribe((res: any) => {
                  if(res!= null)
                  {
                      // console.log("going to reload the page...")
                      setTimeout(() => {
                        },500);
                      window.location.reload();
                     
                  }
                  this.serviceProxy
                    .getManyBaseAssesmentControllerAssessment(
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
                });
            }, 1000);
          },
          (err) =>{
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Calculation Engine Error. Please Try again later!',
            });

            console.log(
              'cal engine issue please chacke the engine..........................======='
            )
          }
         
            
        );
      });
  }


  toOpenImage()
  {
    if(this.resultImage == null )
    {
     this.messageService.add({
       severity: 'error',
       summary: 'Error',
       detail: 'Error,No Equation for this methodology!.',
     });
    }
    else{
     window.location.href =  this.resultImage;
    }

  }

  
  back() {

    this.router.navigate(['/qc'], {
     
    });
    // console.log(
    //   this.parameters.find((m) => m.parameterRequest.qaStatus !== 4) ===
    //     undefined
    // );



  }

  calculateButtonDisable() {
    if (this.assementYear.assessment.assessmentType == 'MAC') {
      return false;
    } else {
      return !(
        // this.projectionResult.length > 0 ||
        // this.assessmentResult.id > 0 ||
        this.isAllSubmit()
      );
    }
  }

  isAllSubmit() {
    // console.log(this.parameters.find((m) => m.parameterRequest.qaStatus !== 4)  );

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
    // console.log("this.selectdAssementType...",this.selectdAssementType)
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

  async drWithComment() {
    
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
        async (res:any) => {
          if(res.qcStatus == 4)
          {
            this.isProjectionResultButtonsDisable= true
            this.isProjectionResultButtonsDisableReject= true;
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
          // console.log(this.selectdProjectionResult);
          this.selectdProjectionResult.qcStatus = this.isApprove ? 4 : 3;

          this.isApproveAllProjectionResult=await this.projectionResultProxy.checkAllQCApprovmentProjectionResult(this.asseId).toPromise();
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
    // console.log("hii there...")
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
        async (res:any) => {

          // console.log("result...fr",res)
          if(res.qcStatusBaselineResult == 4)
          {
            this.isbsResultButtonsDisable = true;
            this.isbsResultButtonsDisableReject = true;
          }
          if(res.qcStatusBaselineResult == 3)
          {
            //this.isbsResultButtonsDisable = true;
            this.isbsResultButtonsDisableReject = true;
          }

          if(res.qcStatuProjectResult == 4)
          {
            this.ispsResultButtonsDisable = true;
            this.ispsResultButtonsDisableReject = true;
          }
          if(res.qcStatuProjectResult == 3)
          {
            //this.ispsResultButtonsDisable = true;
            this.ispsResultButtonsDisableReject = true;
          }

          if(res.qcStatusLekageResult == 4)
          {
            this.islkResultButtonsDisable = true;
            this. islkResultButtonsDisableReject = true;
          }
          if(res.qcStatusLekageResult == 3)
          {
            //this.islkResultButtonsDisable = true;
            this. islkResultButtonsDisableReject = true;
          }

          if(res.qcStatusTotalEmission == 4)
          {
          this.isteResultButtonsDisable = true;
          this.isteResultButtonsDisableReject = true;
          }
          if(res.qcStatusTotalEmission == 3)
          {
         // this.isteResultButtonsDisable = true;
          this.isteResultButtonsDisableReject = true;
          }

          if(res.qcStatusmacResult == 4)
          {
          this.ismacResultButtonsDisable = true;
          this.ismacResultButtonsDisableReject = true;
          }
          if(res.qcStatusmacResult == 3)
          {
         // this.ismacResultButtonsDisable = true;
          this.ismacResultButtonsDisableReject = true;
          }

          if(res.qcStatuscostDifference == 4)
          {
          this.iscdResultButtonsDisable = true;
          this.iscdResultButtonsDisableReject =true;
          }
          if(res.qcStatuscostDifference == 3)
          {
          //this.iscdResultButtonsDisable = true;
          this.iscdResultButtonsDisableReject =true;
          }

          if(res.qcStatuspsTotalAnnualCost == 4)
          {
          this.ispstacResultButtonsDisable = true;
          this.ispstacResultButtonsDisableReject = true;
          }
          if(res.qcStatuspsTotalAnnualCost == 3)
          {
         // this.ispstacResultButtonsDisable = true;
          this.ispstacResultButtonsDisableReject = true;
          }

          if(res.qcStatusbsTotalAnnualCost == 4)
          {
          this.isbstacResultButtonsDisable = true;
          this.isbstacResultButtonsDisableReject = true;
          }
          if(res.qcStatusbsTotalAnnualCost == 3)
          {
          //this.isbstacResultButtonsDisable = true;
          this.isbstacResultButtonsDisableReject = true;
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

          // console.log(this.assessmentResult);
          if (this.selectdAssementType === 1) {
            this.assessmentResult.qcStatusBaselineResult = this
              .isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 2) {
            this.assessmentResult.qcStatuProjectResult = this.isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 3) {
            this.assessmentResult.qcStatusLekageResult = this.isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 4) {
            this.assessmentResult.qcStatusTotalEmission = this.isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 6) {
            this.assessmentResult.qcStatusmacResult = this.isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 7) {
            this.assessmentResult.qcStatuscostDifference = this
              .isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 8) {
            this.assessmentResult.qcStatuspsTotalAnnualCost = this
              .isApproveAssement
              ? 4
              : 3;
          } else if (this.selectdAssementType === 9) {
            this.assessmentResult.qcStatusbsTotalAnnualCost = this
              .isApproveAssement
              ? 4
              : 3;
          }
          //this.assessmentResult.qcStatus = this.isApprove ? 4 : 3;

          // this.parameters.splice(index, 0, this.selectdParameter);
          this.isApproveAllAssesmentResult= await this.assesmentResaultProxy.checkAllQCApprovmentAssessmentResult(this.assessmentResult.id).toPromise();

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
    para = para.filter((o)=>o.parameterRequest != null);
    let isallPass =
      para.find((m) => m.parameterRequest?.qaStatus !== 4) ===
      undefined;

    //  console.log('is true..',isallPass)
    // console.log('isallPass..',isallPass)

    if (this.assementYear.assessment.assessmentType == 'MAC') {
      isallPass = true;
    }

    this.assementYear.qaStatus = isallPass ? 4 : 3;

    if (isallPass) {
      if (this.assementYear.verificationStatus === 8) {
        await this.checkVerificationStage()
        if (this.roundOneHeadTable != undefined) {
          this.assementYear.verificationStatus = 4;
        }

        if (this.roundTwoHeadTable != undefined) {
          this.assementYear.verificationStatus = 5;
        }

      } else {
        this.assementYear.verificationStatus = 1;
      }

    }

    let tempassementYear = this.assementYear;

    let assesemt = new Assessment();
    assesemt.id = tempassementYear.assessment.id;
    tempassementYear.assessment = assesemt;

    this.proxy
      .updateOneBaseAssessmentYearControllerAssessmentYear(
        this.assesMentYearId,
        tempassementYear
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully updated.',
            closable: true,
           
          });
          this.assessmentYearControllerServiceProxy.email( this.assesMentYearId)
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
      .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assementYear.assessment.id, this.assementYear.assessmentYear)
      .toPromise())[0]?.verificationDetail;
    this.roundOneHeadTable = verificationList?.find((o: any) => o.verificationStage == 1);
    this.roundTwoHeadTable = verificationList?.find((o: any) => o.verificationStage == 2);
    this.roundThreeHeadTable = verificationList?.find((o: any) => o.verificationStage == 3);
  }

  async getResultInfo(type: any){
    this.resultVds = []
    // console.log("get result info", type)
    let verificationList = (await this.assessmentYearControllerServiceProxy
      .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assementYear.assessment.id, this.assementYear.assessmentYear)
      .toPromise())[0]?.verificationDetail;
    let column: string
    if (type === 'project'){
      column = 'isProject'
    } else if (type === 'baseline'){
      column = 'isBaseline'
    } else if (type === 'leakage'){
      column = 'isLekage'
    } else if (type === 'projection'){
      column = 'isProjection'
    } else if (type === 'bsTotal'){
      column = 'isBaseline'
    } else if (type === 'psTotal'){
      column = 'isProject'
    }

    let vd = verificationList.filter((o:any) => o.isResult === true && o[column] === true)
    vd.sort((a: any,b: any) => a.verificationStage - b.verificationStage);
    this.resultVds = vd
    this.resultVds = this.resultVds.map(res => {
      let comment = res.action?.split('|')
      if (comment){
        res['commentBy'] = comment[0]
        res['comment'] = comment[1]
        return res
      }
    })
    
    this.displayAction = true
  }

  checkShowInfo(type: string){
    let column: string
    if (type === 'project'){
      column = 'isProject'
    } else if (type === 'baseline'){
      column = 'isBaseline'
    } else if (type === 'leakage'){
      column = 'isLekage'
    } else if (type === 'projection'){
      column = 'isProjection'
    }
   
    let vd = this.verificationList?.find((o: any) => o.isResult === true && o[column] === true)

    if (vd){
      return true
    } else {
      return false
    }
  }
}

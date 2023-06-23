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
  LearningMaterialControllerServiceProxy,
  ServiceProxy,
  LearningMaterial,
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
export class NonconformanceReportComponent implements OnInit,AfterViewInit {


  c = {name: 'ovindu',age:'25'};

  assmentYearList:any;
  
  assessment : Assessment[] = [];
  verificationList :VerificationDetail[] = [];
  verificationList2 :VerificationDetail[] = [];

  roundOneList:VerificationDetail[] = [];
  roundTwoList:VerificationDetail[] = [];
  roundThreeList:VerificationDetail[] = [];

  roundOnendcList:any;
  roundOnemethodologyList:any;
  roundOneprojectList:any;
  roundOneprojectionList:any;
  roundOnelekageList:any;
  roundOnebaseleineList:any;
  roundOneAssumptionList:any;
  roundOneResultList: any;

  roundTwondcList:any;
  roundTwomethodologyList:any;
  roundTwoprojectList:any;
  roundTwoprojectionList:any;
  roundTwolekageList:any;
  roundTwobaseleineList:any;
  roundTwoAssumptionList:any;
  roundTwoResultList: any;

  roundThreendcList:any;
  roundThreemethodologyList:any;
  roundThreeprojectList:any;
  roundThreeprojectionList:any;
  roundThreelekageList:any;
  roundThreebaseleineList:any;
  roundThreeAssumptionList:any;
  roundThreeResultList: any;

  roundOneHeadTable:any;
  roundTwoHeadTable:any;
  roundThreeHeadTable:any;

  ndcList :any;
  methodologyList:any;
  projectList:any;
  projectionList:any;
  lekageList:any;
  baseleineList:any;
  mydate:any = '2022-02-29';
  dateGenerated:any;
  assumptionList:any;


  assesMentYearId:any;
  recievdAssementYear:any;
  assessmentId:any;
  assementYear: AssessmentYear = new AssessmentYear();
  flag:string;
  isVerificationHistory:number;

  roundOneVerifier:any;
  roundTwoVerifier:any;
  roundThreeVerifier:any;
  vStatus:number;
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
    private messageService :MessageService,
    
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
    // this.assesMentYearId = 3;
      // console.log("this.flag..,,",params)

      this.serviceProxy
        .getOneBaseAssessmentYearControllerAssessmentYear(
          this.assesMentYearId,
          undefined,
          undefined,
          undefined
        )
        .subscribe(async (res) => {
          this.assementYear = res;
         // console.log("my year........", this.assementYear);
          this.recievdAssementYear =this.assementYear.assessmentYear;
          this.assessmentId = this.assementYear.assessment.id;
         // console.log("my year111..",this.recievdAssementYear);
         // console.log("my id111...", this.assessmentId);

         let assessment = await this.serviceProxy.getOneBaseAssesmentControllerAssessment(this.assementYear.assessment.id, undefined, undefined, 0).toPromise()
       
          this.assYearProxy
          .getVerificationDeatilsByAssessmentIdAndAssessmentYear(this.assessmentId,this.recievdAssementYear)
          .subscribe(async (a) => {
           // console.log("ass year list",this.verificationList)
            this.assmentYearList = a;
            //console.log("big list=========", a);
            this.verificationList = a[0]?.verificationDetail;
            
            // console.log("this.verificationList=========", this.verificationList);
            this.roundOneList = this.verificationList.filter((o: any)=>o.verificationStage == 1 && o.isAccepted == 0);
            // console.log("this.roundOneList=========", this.roundOneList);
            this.roundTwoList= this.verificationList.filter((o: any)=>o.verificationStage == 2 && o.isAccepted == 0);
            this.roundThreeList= this.verificationList.filter((o: any)=>o.verificationStage == 3 && o.isAccepted == 0);

            this.roundOneHeadTable = this.verificationList?.find((o: any)=>o.verificationStage == 1);
            // console.log("this.roundThreeList...",this.roundThreeList)
            if(this.roundOneHeadTable !=null)
            {
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
             // console.log("this.roundOneVerifier...",this.roundOneVerifier)
            });

            }
            this.roundTwoHeadTable = this.verificationList?.find((o: any)=>o.verificationStage == 2);
            if(this.roundTwoHeadTable !=null)
            {
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
              // console.log("this.roundTwoHeadTable...",this.roundTwoHeadTable)
              // console.log("verifierId...",verifierId)
              // console.log("this.roundTwoVerifier...",this.roundTwoVerifier)
            });

            }
            this.roundThreeHeadTable = this.verificationList?.find((o: any)=>o.verificationStage == 3);
            // if(this.roundThreeHeadTable !=null)
            // {
            //   this.verificationRound = 3
            //   let verifierId = this.roundThreeHeadTable.userVerifier;

            //   this.serviceProxy.
            //   getOneBaseUsersControllerUser(
            //   verifierId,
            //   undefined,
            //   undefined,
            //   undefined,
              
            //   ).subscribe((res: any) => {
            //   this.roundThreeVerifier = res;
            //  // console.log("this.roundThreeVerifier...",this.roundThreeVerifier)
            // });

            // }

            await this.checkReviewComplete(this.verificationList, assessment.parameters)
            // console.log(this.isReviewComplete)

           // console.log("round one head table=========", this.roundOneHeadTable);
            // above roundone..roundtwo lists shows verification details for
            // partcular assessment in particular ass year with concerned raised
  
            this.roundOnendcList = this.roundOneList.filter((o: any)=>o.isNDC == true);
            // console.log("this.roundOnendcList...",this.roundOnendcList);
            this.roundOnemethodologyList = this.roundOneList.filter((o: any)=>o.isMethodology == true);
            this.roundOneprojectList = this.roundOneList.filter((o: any)=>o.isProject == true && !o.isResult);
            this.roundOneprojectionList = this.roundOneList.filter((o: any)=>o.isProjection == true && !o.isResult);
            this.roundOnelekageList = this.roundOneList.filter((o: any)=>o.isLekage == true && !o.isResult);
            this.roundOnebaseleineList = this.roundOneList.filter((o: any)=>o.isBaseline == true && !o.isResult);
            this.roundOneAssumptionList = this.roundOneList.filter((o: any)=>o.isAssumption == true);
            this.roundOneResultList = this.roundOneList.filter((o: any) => o.isResult === true);

            this.roundTwondcList = this.roundTwoList.filter((o: any)=>o.isNDC == true);
            this.roundTwomethodologyList = this.roundTwoList.filter((o: any)=>o.isMethodology == true);
            this.roundTwoprojectList = this.roundTwoList.filter((o: any)=>o.isProject == true && !o.isResult);
            this.roundTwoprojectionList = this.roundTwoList.filter((o: any)=>o.isProjection == true && !o.isResult);
            this.roundTwolekageList = this.roundTwoList.filter((o: any)=>o.isLekage == true && !o.isResult);
            this.roundTwobaseleineList = this.roundTwoList.filter((o: any)=>o.isBaseline == true && !o.isResult);
            this.roundThreeAssumptionList = this.roundTwoList.filter((o: any)=>o.isAssumption == true);
            this.roundTwoResultList = this.roundTwoList.filter((o: any) => o.isResult === true);
    
            this.roundThreendcList = this.roundThreeList.filter((o: any)=>o.isNDC == true);
            this.roundThreemethodologyList = this.roundThreeList.filter((o: any)=>o.isMethodology == true);
            this.roundThreeprojectList = this.roundThreeList.filter((o: any)=>o.isProject == true && !o.isResult);
            this.roundThreeprojectionList = this.roundThreeList.filter((o: any)=>o.isProjection == true && !o.isResult);
            this.roundThreelekageList = this.roundThreeList.filter((o: any)=>o.isLekage == true && !o.isResult);
            this.roundThreebaseleineList = this.roundThreeList.filter((o: any)=>o.isBaseline == true && !o.isResult);
            this.roundThreeAssumptionList = this.roundThreeList.filter((o: any)=>o.isAssumption == true);
            this.roundThreeResultList = this.roundTwoList.filter((o: any) => o.isResult === true);
    
  
  
          // console.log('this.assmentYearList',this.assmentYearList);
          // console.log('this.verificationList',this.verificationList);
           //console.log('this.roundOneList',this.roundOneList);
           //console.log('this.roundTwoList',this.roundTwoList);
          }
          ,
          (error)=>{
            console.log("errrrrrrrrrrrrrrrrrrrrrrrrr")
          });


        });
    });
    

   // let assessmentYear = '2025';
   // let assessmentId = 1;


  }

  async checkReviewComplete(vdList: any, parameters: any) {
    this.isReviewComplete = true
    let hasBaseline = false
    let hasProject = false
    let hasLekage = false
    let hasProjection = false

    console.log(this.verificationRound)

    for await (let para of parameters) {
      if (para.verifierAcceptance !== ParameterVerifierAcceptance.REJECTED){
        if (para.isBaseline) hasBaseline = true
        if (para.isProject) hasProject = true
        if (para.isLekage) hasLekage = true
        if (para.isProjection) hasProjection = true
        let vd = vdList.find((o: any) => o.parameter?.id === para.id && (o.isAccepted || o.verificationStage === this.verificationRound))
        if (vd === undefined) {
          if (!para.isAlternative){
            this.isReviewComplete = false
            break;
          }
        }
      }
    }

    console.log(this.isReviewComplete)

    if (this.isReviewComplete){
      let columns: string[] = []
      if (this.assementYear.assessment.assessmentType === 'MAC'){columns = [...['isAssumption']]}
      else {columns = [...['isNDC', 'isMethodology', 'isAssumption']]}
      for await (let col of columns){
        let vd = vdList.find((o: any) => o[col] && (o.isAccepted || o.verificationStage === this.verificationRound))
        if (vd === undefined){
          this.isReviewComplete = false
          break;
        }
      }
    }

    console.log(this.isReviewComplete)

    // if (this.isReviewComplete){ 
    //   let resultColumns = []
    //   if (hasBaseline) resultColumns.push('isBaseline')
    //   if (hasProject) resultColumns.push('isProject')
    //   if (hasLekage) resultColumns.push('isLekage')
    //   if (hasProjection) resultColumns.push('isProjection')
    //   for (let col of resultColumns){
    //     let vd = vdList.find((o: any) => o[col] && o.isResult && (o.isAccepted || o.verificationStage === this.verificationRound))
    //     if (vd === undefined){
    //       this.isReviewComplete = false
    //       break;
    //     }
    //   }
    // }
  }

  toPopUp(item:any)
  {
 //console.log("click");
  }

  toDownload()
  {

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
    // var data = document.getElementById('content')!;
    // // console.log('daaaa', data);
    //  html2canvas(data).then((canvas) => {
    //    var imaWidth = 200; //123
    //    var pageHeight = 350; //500
    //    var imgHeight = (canvas.height * imaWidth) / canvas.width;
    //   // console.log('size', canvas.height); // 4346
    //   // console.log('size....', canvas.width); //2006
    //    var heightLeft = imgHeight;
    //    var text =
    //      'Downolad date ' +
    //      moment().format('YYYY-MM-DD HH:mm:ss');
 
    //    const contentDataURL = canvas.toDataURL('image/png');
    //    let pdf = new jsPDF('p', 'mm', 'a4');
    //    var position = 0;
    //    pdf.addImage(contentDataURL, 'PNG', 10, position, imaWidth, imgHeight);
    //    pdf.text(text, 297, 297);
    //    pdf.save('');
    //  });
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
        // need to get relevent assse year row
        this.assementYear.verificationStatus = 1; //Nc REcieved
        this.assementYear.editedOn = moment();

        // then update the object
        // then need to send the updte crud
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
              // console.log("++++++++++++++++++++++", this.assementYear)
            },
          );

      }
    }

  }

  toDetailPage()
  {

    if(this.flag == "sec-admin")
    {
      this.router.navigate(['/verification-sector-admin/detail'], {
        queryParams: {
          id: this.assementYear.id,
         verificationStatus: this.assementYear.verificationStatus,
        },
      });

    }
    else
    {
      this.router.navigate(['/verification-verifier/detail'], {
        queryParams: {
          id: this.assementYear.id,
         verificationStatus: this.assementYear.verificationStatus,
        },
      });

    }

   
  }

  disableSubmit(){
    if (this.flag === 'sec-admin'){
      return ((this.assementYear.verificationStatus !== 3) || this.assementYear.verificationStatus === 7 || this.assementYear.verificationStatus === 6)
    } else {
      if (!this.isReviewComplete){
        return true
      } 
      return (this.assementYear.verificationStatus === 3 || this.assementYear.verificationStatus === 8 || this.assementYear.verificationStatus === 7 || this.assementYear.verificationStatus === 6)
    }
  }

  getSubmitLabel(){
    if (this.flag === 'sec-admin'){
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

  getStatus(){
    if (this.assementYear.verificationStatus === 3){
      if (this.flag === 'sec-admin'){
        return 'NC Received'
      } else {
        return 'NC Sent'
      }
    } else {
      return VerificationStatus[this.assementYear.verificationStatus]
    }
  }

}

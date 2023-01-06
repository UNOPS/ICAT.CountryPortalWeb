import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExcecutiveSummaryGraph } from '../Dto/executiveSummaryGraphDto';
import { ExcecutiveSummeryReport } from '../Dto/executiveSummeryReportDto';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import {
  AssessmentResault,
  AssessmentYear,
  AssessmentYearControllerServiceProxy,
  EmissionReductioDraftDataEntity,
  EmissionReductionDraftdataControllerServiceProxy,
  Project,
  ReportControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css'],
})
export class FinalReportComponent implements OnInit {
  report: ExcecutiveSummeryReport;
  basicData: any;
  basicOptions: any;

  executiveSummery: any[];
  parameterExecutiveSummery: any[];
  sortedYearList: string;
  graphData: ExcecutiveSummaryGraph[] = [];
  lebals: string[] = [];
  dataSetMac: number[] = [];
  dataSetPost: number[] = [];
  dataSetAnth: number[] = [];
  totalExAnthe: number = 0;
  totalExPost: number = 0;
  totalMac: number = 0;
  climetActionIdList: number[] = [];
  //Report Data
  sectorList: string = '';
  country: string = '';
  targetYear: string = '';
  maxYear: number = 0;
  arr: Array<any>;
  reportConcatArray: Array<any>;


  ////Graph2 Data
  cliamteActionsBySector: Project[];
  assessmentList: AssessmentResault[];
  actualValLst: number[] = new Array();
  unconValLst: number[] = new Array();
  conValLst: number[] = new Array();
  bauValLst: number[] = new Array();
  assessmetYr: AssessmentYear[] = new Array();
  assessmentListId: number[] = new Array();
  yrGap: number;
  newYr: number;
  yrList: number[] = new Array();
  yrListGraph: string[] = new Array();
  postYrList: number[] = new Array();
  postresaultList: number[] = new Array();
  postIdLisst: number[] = new Array();
  emissionReduction: EmissionReductioDraftDataEntity =
    new EmissionReductioDraftDataEntity();
  unconditionalValue: number;
  conditionalValue: number;
  lineStylesData: any;
  reportDataConvertExcel: any[] = [];
  reportParameterValueExcel: any[] = [];
  reportParameterFilterValueExcel: any[] = [];
  SERVER_URL = environment.baseUrlAPIDocReportChartDownloadAPI; 

  allsectorSelect:boolean=false;
  sectorIdList:number[]=[];
  /////End Graph2 Data
  currentYear: number = (new Date()).getFullYear();

  constructor(
    private serviceproxy: ServiceProxy,
    private route: ActivatedRoute,
    //  private reportSelection: ReportComponent,
    private cdr: ChangeDetectorRef,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private emissionReductionDraftDataProxy:EmissionReductionDraftdataControllerServiceProxy,
    private reportProxy: ReportControllerServiceProxy,
    private http: HttpClient,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    //this.sendexecutiveSummeryData()
    //this.paraListFilter()

    this.report = JSON.parse(decodeURI(this.route.snapshot.params['reports']));

    console.log('this.report', this.report);
    if (this.report) {
      //  this.executiveSummery = this.report.executiveSummery;
      this.allsectorSelect=this.report.selectAllSectors;
      this.sectorIdList=this.report.sectorIds
      this.sectorList = this.report.sectors.join(', ');
      this.climetActionIdList = this.report.climateActionIds;
      this.sortedYearList = this.report.years.sort((a, b) => a - b).join(', ');
      this.country = this.report.country;
      this.maxYear = Math.max(...this.report.years);

      this.assessmentYearProxy
        .getDataForReportNew(
          this.report.projIds.toString(),
          this.report.assessType.toString(),
          this.report.yearIds.toString(),
          this.report.macAssecmentType.toString()
        )
        .subscribe((res: any) => {
          this.executiveSummery = res;
          console.log("========this.executiveSummery++++++", this.executiveSummery);
          for(let sum of this.executiveSummery){
            if (sum.Type == 'Ex-post') {
              console.log("========this.executiveSummery++++++", Number(sum.Result));
              this.totalExPost = this.totalExPost + Number(sum.Result);
            }
          }

          this.mappingGraph2Data();
          // this.mappingGraphData();
        });


      this.assessmentYearProxy
        .getDataForParameterReportNew(
          this.report.projIds.toString(),
          this.report.assessType.toString(),
          this.report.yearIds.toString(),
          this.report.macAssecmentType.toString()
        )
        .subscribe((res: any) => {
          this.parameterExecutiveSummery = res;
          // console.log("========this.parameterExecutiveSummery++++++", this.parameterExecutiveSummery);
        
          // this.mappingGraphData();
        });
    }



    // Graph Data Mapping

    // this.basicData = {
    //   labels: this.lebals, //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     // {
    //     //   label: 'MAC',
    //     //   backgroundColor: '#42A5F5',
    //     //   data: this.dataSetMac, //[65, 59, 80, 81, 56, 55, 40],
    //     // },
    //     {
    //       label: 'Ex Anth',
    //       backgroundColor: '#00a800',
    //       data: this.dataSetAnth, //[28, 48, 40, 19, 86, 27, 90],
    //     },
    //     {
    //       label: 'Ex-post',
    //       backgroundColor: '#FFA326',
    //       data: this.dataSetPost, //[28, 48, 40, 19, 86, 27, 90],
    //     },
    //   ],
    // };
    this.applyLightTheme();
   
  }

  printPage() {
    window.print();
  }
  // mappingGraphData() {
  //   for (let index = 0; index < this.report.years.length; index++) {
  //     let graphItem = new ExcecutiveSummaryGraph();
  //     graphItem.year = this.report.years[index].toString();

  //     for (let index2 = 0; index2 < this.executiveSummery.length; index2++) {
  //       let element = this.executiveSummery[index2];
  //       console.log('element', element);
  //       if (element) {
  //         if (element.Type == 'Ex-ante' && element.Year == graphItem.year) {
  //           graphItem.anth = element.Result;
  //           this.totalExAnthe = this.totalExAnthe + Number(element.Result);
  //         }
  //         if (element.Type == 'Ex-post' && element.Year == graphItem.year) {
  //           graphItem.post = element.Result;
  //           this.totalExPost = this.totalExPost + Number(element.Result);
  //         }
  //         if (element.Type == 'MAC' && element.Year == graphItem.year) {
  //           graphItem.mac = element.MACResult;
  //           this.totalMac = this.totalMac + Number(element.MACResult);
  //         }
  //       }
  //     }
  //     this.graphData.push(graphItem);
  //   }

  //   for (let index3 = 0; index3 < this.graphData.length; index3++) {
  //     this.lebals.push(this.graphData[index3].year);
  //     this.dataSetMac.push(this.graphData[index3].mac);
  //     this.dataSetAnth.push(this.graphData[index3].anth);
  //     this.dataSetPost.push(this.graphData[index3].post);
  //   }
  //   console.log('graphData', this.graphData);
  // }

  applyLightTheme() {
    // this.basicOptions = {
    //   plugins: {
    //     legend: {
    //       labels: {
    //         color: '#495057',
    //       },
    //     },
    //   },
    //   scales: {
    //     x: {
    //       ticks: {
    //         color: '#495057',
    //       },
    //       grid: {
    //         color: '#ebedef',
    //       },
    //     },
    //     y: {
    //       ticks: {
    //         color: '#495057',
    //       },
    //       grid: {
    //         color: '#ebedef',
    //       },
    //     },
    //   },
    // };

    // this.basicOptions = {
    //   plugins: {
    //     title: {
    //       display: true,
    //       text: 'Emission Reduction Targets',

    //       font: {
    //         size: 24,
    //       },
    //     },
    //     legend: {
    //       labels: {
    //         color: '#495057',
    //       },
    //     },
    //   },
    //   scales: {
    //     x: {
    //       display: true,
    //       title: {
    //         display: true,
    //         text: 'Year',
    //         font: {
    //           size: 12,
    //         },
    //       },
    //       ticks: {
    //         color: '#495057',
    //       },
    //       grid: {
    //         color: '#ebedef',
    //       },
    //     },
    //     y: {
    //       display: true,
    //       title: {
    //         display: true,
    //         text: 'Emmision(MtCO' + '\u2082' + 'e)',
    //         font: {
    //           size: 12,
    //         },
    //       },

    //       ticks: {
    //         color: '#495057',
    //       },
    //       grid: {
    //         color: '#ebedef',
    //       },
    //     },
    //   },
    // };
  }

  mappingGraph2Data() {
    // this.serviceproxy
    //   .getOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
    //     1,
    //     undefined,
    //     undefined,
    //     undefined
    //   )
    
    let setSectorId:number=this.sectorIdList[0];
    if(this.allsectorSelect){
      setSectorId=0;
    }
    this.emissionReductionDraftDataProxy.getEmissionReductionDraftDataForReport(setSectorId)
      .subscribe((res: any) => {
        this.emissionReduction = res;
        this.configEmissionTargetGraph();
        let baseYear:number=Number(this.emissionReduction.baseYear)
        let targetYear:number = Number(this.emissionReduction.targetYear);
        this.targetYear = this.emissionReduction.targetYear;
        console.log('this.emissionReduction', this.emissionReduction);
        this.unconditionalValue =
          this.emissionReduction.targetYearEmission -
          this.emissionReduction.unconditionaltco2;
        console.log('unconditional', this.unconditionalValue);
        this.conditionalValue =
          this.emissionReduction.targetYearEmission -
          this.emissionReduction.conditionaltco2;
        //   });

        // this.yrList = this.report.years;
        // console.log('yr list for final', this.yrList)
        // let yearlstLength = this.report.years.length;

         for(let year = baseYear;year<=targetYear;year++ )
          {
            this.yrList.push(year)
          }

          let yearlstLength = targetYear-baseYear;
        for (let x = 0; x <= yearlstLength; x++) {

          let bauValue: number = ((this.emissionReduction.targetYearEmission - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission;
          this.conValLst.push(this.emissionReduction.conditionaltco2 && this.emissionReduction.conditionaltco2 != 0 ?  ((this.conditionalValue - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission:0);
          this.unconValLst.push(this.emissionReduction.unconditionaltco2 && this.emissionReduction.unconditionaltco2 != 0 ? ((this.unconditionalValue - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission:0);
          this.bauValLst.push(bauValue);
          // console.log("work testay")
          let total = 0;

          for(let sum of this.executiveSummery){
            if (sum.Type == 'Ex-post' && Number(sum.Year)==this.yrList[x]) {
              console.log("========this.executiveSummery++++++", Number(sum.Result));
              total = total + Number(sum.Result);
            }
          }
          if (this.yrList[x] <= this.currentYear) { this.actualValLst.push(bauValue - total/1000000); }
     
        }
    

        this.lineStylesData = {
          // labels: [this.emissionReduction.baseYear, this.emissionReduction.targetYear],
          labels: this.yrList,

          datasets: [
            {
              label: 'Actual',
              data: this.actualValLst,
              fill: false,
              borderColor: '#533440',
              tension: 0.4,
            },
            {
              label: 'NDC-Conditional',
              // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue],
              data: this.conValLst,
              fill: true,
              borderColor: '#81B622',
              tension: 0.4,
              backgroundColor: '#81B622',
            },
            {
              label: 'NDC-Unconditional',
              // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue],
              data: this.unconValLst,
              fill: true,
              tension: 0.4,
              borderColor: '#FFDB58',
              backgroundColor: '#FFDB58',
            },
            {
              label: 'BAU',
              // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission],
              data: this.bauValLst,
              fill: true,
              tension: 0.4,
              borderColor: '#FFA726',
              backgroundColor: '#FFA726',
            },
          ],
        };
        // let filterBySector: string[] = new Array();

        // filterBySector.push('id||$in||' + this.climetActionIdList);

        // this.serviceproxy
        //   .getManyBaseProjectControllerProject(
        //     undefined,
        //     undefined,
        //     filterBySector,
        //     undefined,
        //     ['editedOn,DESC'],
        //     undefined,
        //     1000,
        //     0,
        //     0,
        //     0
        //   )
        //   .subscribe((res: any) => {
        //     this.cliamteActionsBySector = res.data;
        //     console.log(
        //       'this.cliamteActionsBySector',
        //       this.cliamteActionsBySector
        //     );

        //     // console.log('projects by sector',this.cliamteActionsBySector);
        //     for (let a = 0; a < this.cliamteActionsBySector.length; a++) {
        //       // console.log('proId....',this.cliamteActionsBySector[a]?.id)
        //       for (
        //         let b = 0;
        //         b < this.cliamteActionsBySector[a]?.assessments.length;
        //         b++
        //       ) {
        //         this.assessmentListId.push(
        //           this.cliamteActionsBySector[a]?.assessments[b]?.id
        //         );
        //       }
        //     }
        //     //  console.log('assessment ListId...',this.assessmentListId)

        //     // if(this.assessmentListBySector[a]?.assessmentType == 'Ex-Post'){
        //     this.yrList = this.report.years;
        //     console.log('yr list for final', this.yrList)
        //     let yearlstLength = this.report.years.length;
        //     for (let x = 0; x < yearlstLength; x++) {

        //       let bauValue: number = ((this.emissionReduction.targetYearEmission - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission;
        //       this.conValLst.push(!this.emissionReduction.conditionaltco2 && this.emissionReduction.conditionaltco2 == 0 ? 0 : ((this.conditionalValue - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission);
        //       this.unconValLst.push(!this.emissionReduction.unconditionaltco2 && this.emissionReduction.unconditionaltco2 == 0 ? 0 : ((this.unconditionalValue - this.emissionReduction.baseYearEmission) / yearlstLength) * x + this.emissionReduction.baseYearEmission);
        //       this.bauValLst.push(bauValue);
        //       // console.log("work testay")
        //       let total = 0;

        //       for(let sum of this.executiveSummery){
        //         if (sum.Type == 'Ex-post' && Number(sum.Year)==this.yrList[x]) {
        //           console.log("========this.executiveSummery++++++", Number(sum.Result));
        //           total = total + Number(sum.Result);
        //         }
        //       }
        //       if (this.yrList[x] <= this.currentYear) { this.actualValLst.push(bauValue - total); }
        //       // let filter1: string[] = new Array();
        //       // console.log('this.yrList[x]', this.yrList[x]);
        //       // console.log('tasses', this.assessmentListId);
        //       // filter1.push(
        //       //   'assessmentYear.assessmentYear||$in||' + this.yrList[x]
        //       // ) &
        //       //   filter1.push('assement.assessmentType||$eq||Ex-post') &
        //       //   filter1.push('assement.id||$in||' + this.assessmentListId);
        //       // // console.log('filter1',filter1);

        //       // this.serviceproxy
        //       //   .getManyBaseAssesmentResaultControllerAssessmentResault(
        //       //     undefined,
        //       //     undefined,
        //       //     filter1,
        //       //     undefined,
        //       //     ['assessmentYear.assessmentYear,ASC'],
        //       //     undefined,
        //       //     1000,
        //       //     0,
        //       //     0,
        //       //     0
        //       //   )
        //       //   .subscribe((res: any) => {
        //       //     this.assessmentList = res.data;
        //       //     console.log('aaaaaaaaaaa1111111', this.assessmentList);
        //       //     // console.log("work testay2")
        //       //     // console.log(res.data)

        //       //     for (let assement of this.assessmentList) {
        //       //       console.log('totalemition', assement.totalEmission);
        //       //       total += assement.totalEmission
        //       //         ? assement.totalEmission
        //       //         : 0;
        //       //       console.log(total);
        //       //     }
        //       //     // this.postYrList.push(total);
        //       //     if (this.yrList[x] <= this.currentYear) { this.actualValLst.push(bauValue - total); }
        //       //     // this.actualValLst.push(total);
        //       //   });



        //       //  noncon-
        //       //  con-
        //       //  bau-
        //     }
        //     console.log('ac', this.actualValLst);
        //     // console.log('con',this.conValLst)
        //     // console.log('un',this.unconValLst)

        //     this.lineStylesData = {
        //       // labels: [this.emissionReduction.baseYear, this.emissionReduction.targetYear],
        //       labels: this.yrList,

        //       datasets: [
        //         {
        //           label: 'Actual',
        //           data: this.actualValLst,
        //           fill: false,
        //           borderColor: '#533440',
        //           tension: 0.4,
        //         },
        //         {
        //           label: 'NDC-Conditional',
        //           // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue],
        //           data: this.conValLst,
        //           fill: true,
        //           borderColor: '#81B622',
        //           tension: 0.4,
        //           backgroundColor: '#81B622',
        //         },
        //         {
        //           label: 'NDC-Unconditional',
        //           // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue],
        //           data: this.unconValLst,
        //           fill: true,
        //           tension: 0.4,
        //           borderColor: '#FFDB58',
        //           backgroundColor: '#FFDB58',
        //         },
        //         {
        //           label: 'BAU',
        //           // data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission],
        //           data: this.bauValLst,
        //           fill: true,
        //           tension: 0.4,
        //           borderColor: '#FFA726',
        //           backgroundColor: '#FFA726',
        //         },
        //       ],
        //     };
        //   });
      });
  }
  configEmissionTargetGraph=()=>{
    this.basicOptions = {
        
      plugins: {
        tooltip: {
               
  
  
          callbacks: {
            label: function(context: { chart:{_metasets:any;}; dataset: { label: string; }; parsed: { y: number | bigint | null; };dataIndex:number;raw:number; }) {
              console.log(context)
              // console.log(context.chart._metasets[3]._dataset.data)
                let baulst=context.chart._metasets[3]._dataset.data;
                let label = context.dataset.label || '';
  
  
                if (label) {
                  label += ' Emission : ';
              }
              if (context.parsed.y !== null) {
                  label += Number(context.parsed.y).toFixed(2) +" MtCO₂e";
              }
  
                if(context.dataset.label=='Actual'){
                  // console.log("Actual")
             let emissionReduction=  "Emission Reduction : " +  (baulst[ context.dataIndex]- Number(context.parsed.y)).toFixed(2) + " MtCO₂e" +" (" + ((baulst[ context.dataIndex]- Number(context.parsed.y))/baulst[ context.dataIndex]).toFixed(2) +"% of BAU Emission)";
                  return [label,emissionReduction];
                }
                if(context.dataset.label=='BAU'){
                  // console.log("BAU")
                  return [label];
                }
                
  
  
                let prsntge= 'Emission reduction of '+context.dataset.label+ ' over BAU : '+(((baulst[ context.dataIndex]-context.raw)/baulst[ context.dataIndex])*100).toFixed(2) +'%'
                
                return [label,prsntge];
            }
        }
        },
        
       
        title: {
          
          display: true,
          text: `Emission Reduction Targets of ${this.emissionReduction.sector? this.emissionReduction.sector.name + " sector" :this.emissionReduction.country.name}`,
          
          font:{
            size:24
          }
      },
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          
          x: {
              display:true,
              title:{
                display:true,
                text:'Years',
                font:{
                  size:12
                }
              },
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
            display:true,
            title:{
              display:true,
              text:'Emissions (MtCO₂e)',
              font:{
                size:12
              }
            },
            
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };
  
  }

  async sendexecutiveSummeryData() {
    for await (let element of this.executiveSummery) {
      let res = await this.reportProxy.getParameterData(element.assesmentId, element.Year).toPromise();
      this.reportParameterValueExcel.push(res);

    }
  }





  async excelDataFilter() {

    this.reportDataConvertExcel = []



    this.executiveSummery.map((e, index) => {
      let SCA_No = "SCA_" + (index + 1)
      let Ndc = e.NDC
      let ActionArea = e.SNDC ? e.SNDC : "N/A"
      let ClimateAction = e.ClimateAction;
      let Description = `${e.ClimateAction} ${e.Institution} by ${e.ProjectOwner} to ${e.objective}. Action includes ${e.ProjectScope}. The geographical boundary of the project includes ${e.SubnOne}, ${e.SubnTwo}, ${e.SubnThree}. ${e.ProjectStatus} It is expected that the project will ${e.OutCome}. In addition, mitigation action has various sustainable development benefits such as ${e.DirectB} and ${e.IndreactB}`
      let TypeOfAssesment = e.Type == "MAC" ? "MAC " + e.TypeOfMac : "GHG " + e.Type
      let AssesmentYear = e.Year
      let BaseYear = e.BaseYear
      let Methodology = e.MethName
      let GeographicBoundary = e.SubnOne + ", " + e.SubnTwo + ", " + e.SubnThree
      let TemporalBoundary = new Date(e.ProposeDateCommence).getFullYear() + " - " + e.PrjectionYear
      let Transportsubsector = e.TsubSector
      let UpstreamDownstream = e.UpDownStream
      let GHGsIncluded = e.GhgInc
      let BaselineScenario = e.BaseS
      let BaselineEmissions = e.BaseR
      let ProjectScenario = e.ProjectS
      let ProjectEmissions = e.ProjectR
      let LekageScenario = e.LeakageS ? e.LeakageS : "N/A"
      let LekageEmissions = e.LeakageR ? e.LeakageR : "N/A"
      let EmissionReduction = e.Result ? e.Result : e.EmmisionValue ? e.EmmisionValue : "N/A"
      let MAC = e.MACResult ? e.MACResult : "N/A"


      let obj = {
        SCA_No,
        Ndc,
        ActionArea,
        ClimateAction,
        Description,
        TypeOfAssesment,
        AssesmentYear,
        BaseYear,
        Methodology,
        GeographicBoundary,
        TemporalBoundary,
        Transportsubsector,
        UpstreamDownstream,
        GHGsIncluded,
        BaselineScenario,
        BaselineEmissions,
        ProjectScenario,
        ProjectEmissions,
        LekageScenario,
        LekageEmissions,
        EmissionReduction,
        MAC,
      }

      this.reportDataConvertExcel.push(obj)

    })
    await this.sendexecutiveSummeryData()

  }

  async downloadChart() {
    console.log("fire ++++");

    // let datetime: string = new Date().getTime().toString();

    // let chartName = `chart_${datetime}`;

 let namechart= await this.reportProxy.getChartDownlordData(
      // this.report.years.map(String),
      this.report.projIds,
      this.report.assessType,
      this.report.yearIds,
      this.report.selectAllSectors,
      this.report.sectorIds.map(String),


    ).toPromise();
    console.log("imah", namechart.name);
    // console.log("===this.report.years==",this.report.years);
    

      const link = document.createElement('a');
      // link.style.display = 'none';
      // link.download = namechart.name;
      link.href = this.SERVER_URL+'/'+namechart.name
      link.click();
      link.remove()
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    console.log("=== url ===", url);

    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  async download() {
    await this.excelDataFilter()

    console.log("=====this.reportParameterValueExcel", this.reportParameterValueExcel);

    for (let i = 0; i < this.reportParameterValueExcel.length; i++) {
      for (let j = 0; j < this.reportParameterValueExcel[i].length; j++) {
        let element = this.reportParameterValueExcel[i][j];
        let Type = element.isBaseline ? "Basline" : element.isProject ? "Project" : element.isLekage ? "Lekage" : "N/A"
        let KeyIndicators = element.name
        let Value = element.value
        let Unit = element.uomDataRequest


        let secondObj = {
          Type,
          KeyIndicators,
          Value,
          Unit
        }
        this.reportParameterValueExcel[i][j] = secondObj;
        console.log("===== secondObj +++", secondObj);
      }
    }


    /* table id is passed over here */
    //let element = document.getElementById(this.table.nativeElement);
    //  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.activeprojects);

    //  /* generate workbook and add the worksheet */
    //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // const wt: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arr);

    console.log("this.report.reportName", this.report.reportName);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportDataConvertExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // XLSX.utils.book_append_sheet(wb, ws, this.report.reportName);
    XLSX.utils.book_append_sheet(wb, ws, 'Summary report');

    var number = 1;
    for (let i = 0; i < this.reportParameterValueExcel.length; i++) {
      let ele = this.reportParameterValueExcel[i]
      // for (let ele of this.reportParameterValueExcel) {
      var wt: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ele);
      XLSX.utils.book_append_sheet(wb, wt, `SCA_${number + i}`);
    }
    // XLSX.utils.book_append_sheet(wb, ws, 'test');



    XLSX.writeFile(wb, (this.report.reportName ? this.report.reportName : 'Summary report') + '.xlsx');

    /* save to file */
    //  XLSX.writeFile(wb, this.fileName);
  }
}

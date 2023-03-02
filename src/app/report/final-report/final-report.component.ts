import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExcecutiveSummaryGraph } from '../Dto/executiveSummaryGraphDto';
import { ExcecutiveSummeryReport } from '../Dto/executiveSummeryReportDto';
import { HttpClient } from '@angular/common/http';
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
  totalExAnthe = 0;
  totalExPost = 0;
  totalMac = 0;
  climetActionIdList: number[] = [];
  sectorList = '';
  country = '';
  targetYear = '';
  maxYear = 0;
  arr: Array<any>;
  reportConcatArray: Array<any>;

  cliamteActionsBySector: Project[];
  assessmentList: AssessmentResault[];
  actualValLst: number[] = [];
  unconValLst: number[] = [];
  conValLst: number[] = [];
  bauValLst: number[] = [];
  assessmetYr: AssessmentYear[] = [];
  assessmentListId: number[] = [];
  yrGap: number;
  newYr: number;
  yrList: number[] = [];
  yrListGraph: string[] = [];
  postYrList: number[] = [];
  postresaultList: number[] = [];
  postIdLisst: number[] = [];
  emissionReduction: EmissionReductioDraftDataEntity =
    new EmissionReductioDraftDataEntity();
  unconditionalValue: number;
  conditionalValue: number;
  lineStylesData: any;
  reportDataConvertExcel: any[] = [];
  reportParameterValueExcel: any[] = [];
  reportParameterFilterValueExcel: any[] = [];
  SERVER_URL = environment.baseUrlAPIDocReportChartDownloadAPI;

  allsectorSelect = false;
  sectorIdList: number[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(
    private serviceproxy: ServiceProxy,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private emissionReductionDraftDataProxy: EmissionReductionDraftdataControllerServiceProxy,
    private reportProxy: ReportControllerServiceProxy,
    private http: HttpClient,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.report = JSON.parse(decodeURI(this.route.snapshot.params['reports']));

    if (this.report) {
      this.allsectorSelect = this.report.selectAllSectors;
      this.sectorIdList = this.report.sectorIds;
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
          this.report.macAssecmentType.toString(),
        )
        .subscribe((res: any) => {
          this.executiveSummery = res;
          for (const sum of this.executiveSummery) {
            if (sum.Type == 'Ex-post') {
              this.totalExPost = this.totalExPost + Number(sum.Result);
            }
          }

          this.mappingGraph2Data();
        });

      this.assessmentYearProxy
        .getDataForParameterReportNew(
          this.report.projIds.toString(),
          this.report.assessType.toString(),
          this.report.yearIds.toString(),
          this.report.macAssecmentType.toString(),
        )
        .subscribe((res: any) => {
          this.parameterExecutiveSummery = res;
        });
    }

    this.applyLightTheme();
  }

  printPage() {
    window.print();
  }

  applyLightTheme() {}

  mappingGraph2Data() {
    let setSectorId: number = this.sectorIdList[0];
    if (this.allsectorSelect) {
      setSectorId = 0;
    }
    this.emissionReductionDraftDataProxy
      .getEmissionReductionDraftDataForReport(setSectorId)
      .subscribe((res: any) => {
        this.emissionReduction = res;
        this.configEmissionTargetGraph();
        const baseYear = Number(this.emissionReduction.baseYear);
        const targetYear = Number(this.emissionReduction.targetYear);
        this.targetYear = this.emissionReduction.targetYear;

        this.unconditionalValue =
          this.emissionReduction.targetYearEmission -
          this.emissionReduction.unconditionaltco2;

        this.conditionalValue =
          this.emissionReduction.targetYearEmission -
          this.emissionReduction.conditionaltco2;

        for (let year = baseYear; year <= targetYear; year++) {
          this.yrList.push(year);
        }

        const yearlstLength = targetYear - baseYear;
        for (let x = 0; x <= yearlstLength; x++) {
          const bauValue: number =
            ((this.emissionReduction.targetYearEmission -
              this.emissionReduction.baseYearEmission) /
              yearlstLength) *
              x +
            this.emissionReduction.baseYearEmission;
          this.conValLst.push(
            this.emissionReduction.conditionaltco2 &&
              this.emissionReduction.conditionaltco2 != 0
              ? ((this.conditionalValue -
                  this.emissionReduction.baseYearEmission) /
                  yearlstLength) *
                  x +
                  this.emissionReduction.baseYearEmission
              : 0,
          );
          this.unconValLst.push(
            this.emissionReduction.unconditionaltco2 &&
              this.emissionReduction.unconditionaltco2 != 0
              ? ((this.unconditionalValue -
                  this.emissionReduction.baseYearEmission) /
                  yearlstLength) *
                  x +
                  this.emissionReduction.baseYearEmission
              : 0,
          );
          this.bauValLst.push(bauValue);
          let total = 0;

          for (const sum of this.executiveSummery) {
            if (sum.Type == 'Ex-post' && Number(sum.Year) == this.yrList[x]) {
              total = total + Number(sum.Result);
            }
          }
          if (this.yrList[x] <= this.currentYear) {
            this.actualValLst.push(bauValue - total / 1000000);
          }
        }

        this.lineStylesData = {
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
              data: this.conValLst,
              fill: true,
              borderColor: '#81B622',
              tension: 0.4,
              backgroundColor: '#81B622',
            },
            {
              label: 'NDC-Unconditional',
              data: this.unconValLst,
              fill: true,
              tension: 0.4,
              borderColor: '#FFDB58',
              backgroundColor: '#FFDB58',
            },
            {
              label: 'BAU',
              data: this.bauValLst,
              fill: true,
              tension: 0.4,
              borderColor: '#FFA726',
              backgroundColor: '#FFA726',
            },
          ],
        };
      });
  }
  configEmissionTargetGraph = () => {
    this.basicOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: {
              chart: { _metasets: any };
              dataset: { label: string };
              parsed: { y: number | bigint | null };
              dataIndex: number;
              raw: number;
            }) {
              const baulst = context.chart._metasets[3]._dataset.data;
              let label = context.dataset.label || '';

              if (label) {
                label += ' Emission : ';
              }
              if (context.parsed.y !== null) {
                label += Number(context.parsed.y).toFixed(2) + ' MtCO₂e';
              }

              if (context.dataset.label == 'Actual') {
                const emissionReduction =
                  'Emission Reduction : ' +
                  (
                    baulst[context.dataIndex] - Number(context.parsed.y)
                  ).toFixed(2) +
                  ' MtCO₂e' +
                  ' (' +
                  (
                    (baulst[context.dataIndex] - Number(context.parsed.y)) /
                    baulst[context.dataIndex]
                  ).toFixed(2) +
                  '% of BAU Emission)';
                return [label, emissionReduction];
              }
              if (context.dataset.label == 'BAU') {
                return [label];
              }

              const prsntge =
                'Emission reduction of ' +
                context.dataset.label +
                ' over BAU : ' +
                (
                  ((baulst[context.dataIndex] - context.raw) /
                    baulst[context.dataIndex]) *
                  100
                ).toFixed(2) +
                '%';

              return [label, prsntge];
            },
          },
        },

        title: {
          display: true,
          text: `Emission Reduction Targets of ${
            this.emissionReduction.sector
              ? this.emissionReduction.sector.name + ' sector'
              : this.emissionReduction.country.name
          }`,

          font: {
            size: 24,
          },
        },
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Years',
            font: {
              size: 12,
            },
          },
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Emissions (MtCO₂e)',
            font: {
              size: 12,
            },
          },

          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  };

  async sendexecutiveSummeryData() {
    for await (const element of this.executiveSummery) {
      const res = await this.reportProxy
        .getParameterData(element.assesmentId, element.Year)
        .toPromise();
      this.reportParameterValueExcel.push(res);
    }
  }

  async excelDataFilter() {
    this.reportDataConvertExcel = [];

    this.executiveSummery.map((e, index) => {
      const SCA_No = 'SCA_' + (index + 1);
      const Ndc = e.NDC;
      const ActionArea = e.SNDC ? e.SNDC : 'N/A';
      const ClimateAction = e.ClimateAction;
      const Description = `${e.ClimateAction} ${e.Institution} by ${e.ProjectOwner} to ${e.objective}. Action includes ${e.ProjectScope}. The geographical boundary of the project includes ${e.SubnOne}, ${e.SubnTwo}, ${e.SubnThree}. ${e.ProjectStatus} It is expected that the project will ${e.OutCome}. In addition, mitigation action has various sustainable development benefits such as ${e.DirectB} and ${e.IndreactB}`;
      const TypeOfAssesment =
        e.Type == 'MAC' ? 'MAC ' + e.TypeOfMac : 'GHG ' + e.Type;
      const AssesmentYear = e.Year;
      const BaseYear = e.BaseYear;
      const Methodology = e.MethName;
      const GeographicBoundary =
        e.SubnOne + ', ' + e.SubnTwo + ', ' + e.SubnThree;
      const TemporalBoundary =
        new Date(e.ProposeDateCommence).getFullYear() + ' - ' + e.PrjectionYear;
      const Transportsubsector = e.TsubSector;
      const UpstreamDownstream = e.UpDownStream;
      const GHGsIncluded = e.GhgInc;
      const BaselineScenario = e.BaseS;
      const BaselineEmissions = e.BaseR;
      const ProjectScenario = e.ProjectS;
      const ProjectEmissions = e.ProjectR;
      const LekageScenario = e.LeakageS ? e.LeakageS : 'N/A';
      const LekageEmissions = e.LeakageR ? e.LeakageR : 'N/A';
      const EmissionReduction = e.Result
        ? e.Result
        : e.EmmisionValue
        ? e.EmmisionValue
        : 'N/A';
      const MAC = e.MACResult ? e.MACResult : 'N/A';

      const obj = {
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
      };

      this.reportDataConvertExcel.push(obj);
    });
    await this.sendexecutiveSummeryData();
  }

  async downloadChart() {
    const namechart = await this.reportProxy
      .getChartDownlordData(
        this.report.projIds,
        this.report.assessType,
        this.report.yearIds,
        this.report.selectAllSectors,
        this.report.sectorIds.map(String),
      )
      .toPromise();

    const link = document.createElement('a');
    link.href = this.SERVER_URL + '/' + namechart.name;
    link.click();
    link.remove();
  }

  downLoadFile(data: any, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);

    const pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  async download() {
    await this.excelDataFilter();

    for (let i = 0; i < this.reportParameterValueExcel.length; i++) {
      for (let j = 0; j < this.reportParameterValueExcel[i].length; j++) {
        const element = this.reportParameterValueExcel[i][j];
        const Type = element.isBaseline
          ? 'Basline'
          : element.isProject
          ? 'Project'
          : element.isLekage
          ? 'Lekage'
          : 'N/A';
        const KeyIndicators = element.name;
        const Value = element.value;
        const Unit = element.uomDataRequest;

        const secondObj = {
          Type,
          KeyIndicators,
          Value,
          Unit,
        };
        this.reportParameterValueExcel[i][j] = secondObj;
      }
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.reportDataConvertExcel,
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Summary report');

    const number = 1;
    for (let i = 0; i < this.reportParameterValueExcel.length; i++) {
      const ele = this.reportParameterValueExcel[i];
      const wt: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ele);
      XLSX.utils.book_append_sheet(wb, wt, `SCA_${number + i}`);
    }

    XLSX.writeFile(
      wb,
      (this.report.reportName ? this.report.reportName : 'Summary report') +
        '.xlsx',
    );
  }
}

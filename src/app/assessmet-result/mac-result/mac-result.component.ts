import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Assessment,
  AssessmentObjective,
  AssessmentResult,
  Ndc,
  Parameter,
  Project,
  ProjectionResult,
  ServiceProxy,
  SubNdc,
} from 'shared/service-proxies/service-proxies';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-mac-result',
  templateUrl: './mac-result.component.html',
  styleUrls: ['./mac-result.component.css'],
})
export class MacResultComponent implements OnInit {
  assessment: Assessment = new Assessment();
  project: Project = new Project();
  filteredParameters: Parameter[] = [];
  resultList: AssessmentResult = new AssessmentResult();
  ndc: Ndc = new Ndc();
  subNdc: SubNdc = new SubNdc();
  projectStartDate: string;
  assessmentYear: string;
  objectiveOfAssessment: string;
  discountRate: number;

  bsTotalInvestment: number;
  bsProjectLife: number;
  bsAnnualOM: number;
  bsAnnualFuelCost: number;
  bsOtherAnnualCost: number;
  bsTotalAnnualCost: number;

  psTotalInvestment: number;
  psProjectLife: number;
  psAnnualOM: number;
  psAnnualFuelCost: number;
  psOtherAnnualCost: number;
  psTotalAnnualCost: number;

  projectEmission: AssessmentResult[];
  leakageEmission: AssessmentResult[];
  baseParameter: Parameter[];
  proParameter: Parameter[];
  lParameter: AssessmentResult[];
  bresult: AssessmentResult[];
  projectionData: ProjectionResult[];
  assessmentId = 0;
  projctId = 0;
  ndcId = 0;
  subNdcId = 0;
  typeArray: number[] = [];
  dateList: number[] = [];
  projectionList: number[] = [];
  basicData: any;
  basicOptions: any;
  title: string;

  getDiscountRate: any;
  getBsTotalInvestment: any = 0;
  getBsProjectLife: any = 0;
  getBsAnnualOM: any;
  getBsAnnualFuelCost: any;
  getBsOtherAnnualCost: any;

  getPsTotalInvestment: any = 0;
  getPsProjectLife: any = 0;
  getPsAnnualOM: any;
  getPsAnnualFuelCost: any;
  getPsOtherAnnualCost: any = 0;

  getReduction: any;
  getBsTotalAnnualCost: any = 0;
  getPsTotalAnnualCost: any = 0;
  getCostDifference: any = 0;
  getMacValue: any = 0;

  objectiveList: AssessmentObjective[] = [];

  projectName: string;
  fileName = 'macParameters.xlsx';
  excellist: excelMacParameter[] = [];
  disableExcelButton = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assessmentId = params['id'];
    })
    setTimeout(() => {
    this.serviceProxy
      .getOneBaseAssessmentControllerAssessment(
        this.assessmentId,
        undefined,
        undefined,
        0,
      )
      .subscribe((res: any) => {
        this.assessment = res;

        this.projctId = this.assessment.project.id;

        this.assessmentYear = this.assessment.assessmentYear[0]?.assessmentYear;

        const objectiveFilter: string[] = [];

        if (this.assessmentId != 0) {
          objectiveFilter.push('assessmentId||$eq||' + this.assessmentId);
        }

        this.serviceProxy
          .getManyBaseAssessmentObjectiveControllerAssessmentObjective(
            undefined,
            undefined,
            objectiveFilter,
            undefined,
            undefined,
            undefined,
            1000,
            0,
            0,
            0,
          )
          .subscribe((res: any) => {
            this.objectiveList = res.data;
            this.objectiveOfAssessment = this.objectiveList[0]?.objective;
          });

        this.serviceProxy
          .getOneBaseProjectControllerProject(
            this.projctId,
            undefined,
            undefined,
            0,
          )
          .subscribe((res: any) => {
            this.project = res;

            this.ndc = this.project?.ndc;
            this.subNdc = this.project?.subNdc;
            this.projectStartDate = moment(
              this.project?.proposeDateofCommence,
            ).format('YYYY-MM-DD');
            this.projectName = this.project?.climateActionName;
            if (this.project?.projectApprovalStatus?.name == 'Active') {
              this.title = 'approved';
            } else {
              this.title = 'proposed';
            }

            const parameterFilter: string[] = [];

            if (this.assessmentId != 0) {
              parameterFilter.push('assessment.id||$eq||' + this.assessmentId) &
                parameterFilter.push(
                  'Parameter.assessmentYear||$eq||' + this.assessmentYear,
                );
            }

            this.serviceProxy
              .getManyBaseParameterControllerParameter(
                undefined,
                undefined,
                parameterFilter,
                undefined,
                undefined,
                undefined,
                1000,
                0,
                0,
                0,
              )
              .subscribe((res: any) => {
                this.filteredParameters = res.data;

                this.getBsTotalInvestment = this.filteredParameters.find(
                  (o: any) => o.name == 'Baseline Scenario Total Investment',
                )?.value;
                this.getBsProjectLife = this.filteredParameters.find(
                  (o: any) => o.name == 'Baseline Scenario Project Life',
                )?.value;
                this.getBsAnnualOM = this.filteredParameters.find(
                  (o: any) => o.name == 'Baseline Scenario Annual O&M',
                )?.value;
                this.getBsAnnualFuelCost = this.filteredParameters.find(
                  (o: any) => o.name == 'Baseline Scenario Annual Fuel',
                )?.value;
                this.getBsOtherAnnualCost = this.filteredParameters.find(
                  (o: any) => o.name == 'Baseline Scenario Other Annual Cost',
                )?.value;

                this.getPsTotalInvestment = this.filteredParameters.find(
                  (o: any) => o.name == 'Project Scenario Total Investment',
                )?.value;
                this.getPsProjectLife = this.filteredParameters.find(
                  (o: any) => o.name == 'Project Scenario Project Life',
                )?.value;
                this.getPsAnnualOM = this.filteredParameters.find(
                  (o: any) => o.name == 'Project Scenario Annual O&M',
                )?.value;
                this.getPsAnnualFuelCost = this.filteredParameters.find(
                  (o: any) => o.name == 'Project Scenario Annual Fuel',
                )?.value;
                this.getPsOtherAnnualCost = this.filteredParameters.find(
                  (o: any) => o.name == 'Project Scenario Other Annual Cost',
                )?.value;

                this.getDiscountRate = this.filteredParameters.find(
                  (o: any) => o.name == 'Discount Rate',
                )?.value;
                this.getReduction = this.filteredParameters.find(
                  (o: any) => o.name == 'Reduction',
                )?.value;
              });

            const resultFilter: string[] = [];
            resultFilter.push('assessment.id||$eq||' + this.assessmentId) &
              resultFilter.push(
                'assessmentYear.assessmentYear||$eq||' + this.assessmentYear,
              );

            this.serviceProxy
              .getManyBaseAssessmentResultControllerAssessmentResult(
                undefined,
                undefined,
                resultFilter,
                undefined,
                undefined,
                undefined,
                1000,
                0,
                0,
                0,
              )
              .subscribe((res: any) => {
                this.resultList = res.data[0];
                this.getCostDifference = this.resultList?.costDifference;
                this.getPsTotalAnnualCost = this.resultList?.psTotalAnnualCost;
                this.getBsTotalAnnualCost = this.resultList?.bsTotalAnnualCost;
                this.getMacValue = this.resultList?.macResult;
              });
          });
      })},500)
  }

  public download() {
    const data = document.getElementById('content')!;

    html2canvas(data).then((canvas) => {
      const imaWidth = 200;
      const imgHeight = (canvas.height * imaWidth) / canvas.width;
      const text =
        'Downolad date ' +
        moment().format('YYYY-MM-DD HH:mm:ss') +
        '  Assessment date ' +
        this.assessmentYear +
        ' text-based to be added';

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 10, position, imaWidth, imgHeight);
      pdf.text(text, 0, 290);
      pdf.save('');
    });
  }

  async downloadExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const nameValuePairs = [
      [
        'Assessment Name',
        `Assessment of ${this.title} Specific Climate Action - ${this.project.climateActionName}`,
      ],
      ['Aggregated Actions', this.ndc ? this.ndc.name : '-'],
      ['Action Areas', this.subNdc ? this.subNdc.name : '-'],
      ['Project Start Date', this.projectStartDate],
      ['Assessment Year', this.assessmentYear],
      ['Objective of Assessment', this.objectiveOfAssessment],
      ['Discount Rate', this.getDiscountRate],
      ['Assessment Type', this.assessment.assessmentType],
    ];
  
    const namevalue = XLSX.utils.sheet_add_aoa(worksheet, nameValuePairs);

    const tableData = [
      [
        'Parameter Name',
        'Entered Value',
        'Unit',
        'Institution',
        'Baseline Parameter',
        'Project_Parameter',
      ],
    ];
    for (let x of this.filteredParameters) {
      tableData.push([
        x.name,
        x.value,
        x.uomDataEntry,
        x?.institution ? x?.institution?.name : 'N/A',
        x.isBaseline ? 'Yes' : 'No',
        x.isProject?'Yes':'No'

      ]);
    }
   
    const tableRange = XLSX.utils.sheet_add_aoa(worksheet, tableData, {
      origin: 'A10',
    });
   
    const result = [
      [
        'Cost Defference',
        this.getCostDifference+' $'
      ],
      [
        'Emission Reduction',
        this.getReduction+' tCO2e'
      ],
      [
        'MAC',
        this.getMacValue+' USD/tCO2e'
      ],
    ];

     XLSX.utils.sheet_add_aoa(worksheet, result, {
      origin: 'A'+(this.filteredParameters.length+12),
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  }

  back() {
    this.location.back();
  }
}

export interface excelMacParameter {
  Parameter_Name: any;
  Entered_Value: any;
  Unit: any;
  Institution: any;
  Assessment_Type: any;
  Baseline_Parameter: any;
  Project_Parameter: any;
  Assessment_Year: any;
  cost_defference: any;
  emission_reduction: any;
  MAC: any;
}

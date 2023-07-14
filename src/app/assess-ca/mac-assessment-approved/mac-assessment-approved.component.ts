import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService, SelectItem } from 'primeng/api';
import {
  Assessment,
  AssessmentObjective,
  AssessmentYear,
  Institution,
  Project,
  ServiceProxy,
  Parameter as Parameter_Server,
  AssessmentControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-mac-assessment-approved',
  templateUrl: './mac-assessment-approved.component.html',
  styleUrls: ['./mac-assessment-approved.component.css'],
})
export class MacAssessmentApprovedComponent implements OnInit, AfterViewInit {
  @Input() IsProposal: boolean;
  climateActions: Project[] = [];
  assessments: any[] = [];
  assessmentsByYear: Assessment[][] = [];
  filteredAssessments: any[] = [];
  ndc: any = '';
  instiTutionList: Institution[];
  subNdc: any = '';
  projectStartDate: any = '';
  asseYear = '';
  details: any[] = [];
  uniqueYears: SelectItem[] = [];
  years: number[] = [];
  selectYears: any;
  slectedProject: Project = new Project();
  project: Project = new Project();
  createdAssessment: Assessment = new Assessment();

  approachList: any = ['Ex-ante', 'Ex-post'];
  @ViewChild('op') overlay: any;

  selectedApproachList: any[] = [];
  objectiveOfAsse = '';

  proposedAssessmentDetails: any = [];

  uomDiscountrate = '%';
  uomCost = '$';
  uomReduction = 'tCo2e';
  uomLife = 'years';

  selectedApproch: Assessment[] = [];
  discountrate: Institution = new Institution();
  bsOtherAnnualCost: Institution = new Institution();
  bsTotalInvestment: Institution = new Institution();
  psTotalInvestment: Institution = new Institution();
  bsAnnualOM: Institution = new Institution();
  psAnnualOM: Institution = new Institution();
  bsAnnualFuel: Institution = new Institution();
  psAnnualFuel: Institution = new Institution();
  bsProjectLife: Institution = new Institution();
  psProjectLife: Institution = new Institution();
  psOtherAnnualCost: Institution = new Institution();
  emptyObj: Institution;
  emptyVal: string;

  duration: number;
  baseScenarioProjectLife: number;
  projectScenarioTotalInvestment: number;
  baseScenarioTotalInvestment: number;
  isDiasbaleEye = true;
  noUniqueYears = false;

  checkedbsAnnualfuelCost = false;
  checkedpsAnnualfuelCost = false;

  checkedbsProjectLife = false;
  checkedpsProjectLife = false;

  checkedbsOM = false;
  checkedpsOM = false;

  checkedDiscountRate = false;

  macDefaultValues: any;
  bsAnnualFuelCostList: any;
  psAnnualFuelCostList: any;
  bsAnnualFuelObject: any;

  bsDefaultValList: any;
  psDefaultValList: any;

  bsProjectLifeList: any;
  psProjectLifeList: any;

  bsAnnualOMlist: any;
  psAnnualOMlist: any;

  discountRateList: any;

  bsAnnualFuelName: any;

  discountRateDisplay: string;
  bsProjectLifeDisplay: string;
  psProjectLifeDisplay: string;
  bsOM: string;
  psOM: string;
  bsfuelCost: string;
  psfuelCost: string;

  psAnnualOMDefaultVAl: any;
  bsAnnualOMDefaulVAl: any;
  psAnnualFuelDefaultVal: any;
  bsAnnualFuelDefaulVAl: any;
  discountrateDefaultVAl: any;

  macValue: any = {
    parameters: {
      DiscountRate: '',
      reduction: '',
      year: '',
      baseline: {
        bsTotalInvestment: '',
        bsAnnualOM: '',
        bsOtherAnnualCost: '',
        bsAnnualFuel: '',
        bsProjectLife: '',
      },
      project: {
        psTotalInvestment: '',
        psOtherAnnualCost: '',
        psAnnualOM: '',
        psAnnualFuel: '',
        psProjectLife: '',
      },
    },
  };

  userCountryId = 0;
  userSectorId = 0;

  isDisableSaveButton = false;

  constructor(
    private serviceProxy: ServiceProxy,
    private assessmentServiceProxy: AssessmentControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    const projfilter: string[] = [];
    projfilter.push('projectApprovalStatus.id||$in||' + [1, 5]);
    projfilter.push('country.id||$eq||' + this.userCountryId);
    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        projfilter,
        undefined,
        ['id,DESC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.climateActions = res.data;
      });

    const filter2: string[] = [];
    filter2.push('type.id||$eq||' + 3);
    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        filter2,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.instiTutionList = res.data;
        this.instiTutionList = this.instiTutionList.filter(
          (o) => o.country.id == this.userCountryId,
        );
      });

    const filterMac: string[] = [];
    filterMac.push('isMac||$eq||' + 1);
    this.serviceProxy
      .getManyBaseDefaultValueControllerDefaultValue(
        undefined,
        undefined,
        filterMac,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.macDefaultValues = res.data;

        this.bsDefaultValList = this.macDefaultValues.filter(
          (o: any) => o.scenario == 'baseLine',
        );
        this.psDefaultValList = this.macDefaultValues.filter(
          (o: any) => o.scenario == 'project',
        );

        this.bsProjectLifeList = this.bsDefaultValList.filter(
          (o: any) => o.parameterName == 'Project Life',
        );
        this.psProjectLifeList = this.psDefaultValList.filter(
          (o: any) => o.parameterName == 'Project Life',
        );

        this.bsAnnualFuelCostList = this.bsDefaultValList.filter(
          (o: any) => o.parameterName == 'Annual Fuel Cost',
        );
        this.psAnnualFuelCostList = this.psDefaultValList.filter(
          (o: any) => o.parameterName == 'Annual Fuel Cost',
        );

        this.bsAnnualOMlist = this.bsDefaultValList.filter(
          (o: any) => o.parameterName == 'Annual O&M',
        );
        this.psAnnualOMlist = this.psDefaultValList.filter(
          (o: any) => o.parameterName == 'Annual O&M',
        );

        this.discountRateList = this.macDefaultValues.filter(
          (o: any) => o.scenario == null,
        );
      });
  }

  onChange(event: any) {
    this.isDiasbaleEye = false;

    const filter1: string[] = [];
    filter1.push('project.id||$eq||' + this.slectedProject.id) &
      filter1.push('Assessment.assessmentType||$in||' + this.approachList) &
      filter1.push('Assessment.isProposal||$eq||' + 0);
    filter1.push('assessmentYear.verificationStatus||$eq||' + 7);

    this.ndc = this.slectedProject.ndc?.name;
    this.subNdc = this.slectedProject.subNdc?.name;
    this.projectStartDate = moment(
      this.slectedProject.proposeDateofCommence,
    ).format('YYYY-MM-DD');

    this.baseScenarioTotalInvestment = this.slectedProject.baseScenarioTotalInvestment;
    this.projectScenarioTotalInvestment = this.slectedProject.projectScenarioTotalInvestment;
    this.baseScenarioProjectLife = this.slectedProject.baseScenarioProjectLife;
    this.duration = this.slectedProject.duration;

    this.assessmentServiceProxy
      .assessmentForMAC(this.slectedProject.id)
      .subscribe((res: any) => {
        this.assessments = res;

        this.getYears();
      });
  }

  getYears() {
    this.selectedApproch = [];
    if (this.details.length == 0) {
      for (let x = 0; x < this.assessments.length; x++) {
        this.details.push(this.assessments[x].ay_assessmentYear);
      }
    }
    this.uniqueYears = [...new Set(this.details)];
    this.uniqueYears = this.uniqueYears.map((year) => {
      return { label: year.toString(), value: year };
    });
    this.uniqueYears = this.uniqueYears.sort((a, b) => a.value - b.value);
    if (this.uniqueYears.length === 0) {
      this.noUniqueYears = true;
    } else {
      this.noUniqueYears = false;
    }
  }

  getAssessmentApproachesForAYear(yr: any, index: number) {
    const filter1: string[] = [];
    filter1.push('project.id||$eq||' + this.slectedProject.id) &
      filter1.push('Assessment.assessmentType||$in||' + this.approachList) &
      filter1.push('Assessment.isProposal||$eq||' + 0) &
      filter1.push('assessmentYear.assessmentYear||$eq||' + yr);

    this.serviceProxy
      .getManyBaseAssessmentControllerAssessment(
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
        this.assessmentsByYear[index] = res.data;
      });
  }

  getSelectedApproach() {}

  getSelectedIns() {}

  onChangeDefaultValues(event: any) {}

  onStatusChangebsAnnualFuel(event: any) {
    this.bsAnnualFuelDefaulVAl = Number(event.value);
    this.bsfuelCost = event.administrationLevel;
  }

  onStatusChangepsAnnualFuel(event: any) {
    this.psAnnualFuelDefaultVal = Number(event.value);
    this.psfuelCost = event.administrationLevel;
  }

  onStatusChangebsProjectLife(event: any) {
    this.baseScenarioProjectLife = Number(event.value);
    this.bsProjectLifeDisplay = event.administrationLevel;
  }

  onStatusChangepsProjectLife(event: any) {
    this.duration = Number(event.value);
    this.psProjectLifeDisplay = event.administrationLevel;
  }

  onStatusChangebsAnnualOM(event: any) {
    this.bsAnnualOMDefaulVAl = Number(event.value);
    this.bsOM = event.administrationLevel;
  }

  onStatusChangepsAnnualOM(event: any) {
    this.psAnnualOMDefaultVAl = Number(event.value);
    this.psOM = event.administrationLevel;
  }

  onStatusChangexxDiscountRate(event: any) {
    this.discountrateDefaultVAl = Number(event.value);
    this.discountRateDisplay = event.administrationLevel;
  }

  detail() {
    if (this.slectedProject) {
      this.router.navigate(['/propose-project'], {
        queryParams: { id: this.slectedProject.id },
      });
    }
  }

  createAssessments(data: NgForm) {
    if (data.form.valid) {
      for (const ass of this.selectedApproch) {
        if (ass?.assessmentResult.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `There is no result for selected assessment in assessment year ${ass.assessmentYear[0].assessmentYear}. `,
            closable: true,
          });
          return;
        }
      }

      for (let x = 0; x < this.selectedApproch.length; x++) {
        const assessment = new Assessment();

        assessment.projectDuration = this.slectedProject.duration;
        assessment.projectStartDate = moment(
          this.slectedProject.proposeDateofCommence,
        );
        assessment.emmisionReductionValue = this.selectedApproch[
          x
        ]?.assessmentResult[0].totalEmission;
        assessment.ghgAssessTypeForMac = this.selectedApproch[
          x
        ]?.assessmentType;
        assessment.assessmentType = 'MAC';
        assessment.project = this.slectedProject;
        assessment.isProposal = this.IsProposal;

        const assessmentYars: AssessmentYear[] = [];
        const assessmentObjective: AssessmentObjective[] = [];
        const parameters: Parameter_Server[] = [];
        const ae = new AssessmentYear();
        const ao = new AssessmentObjective();
        ae.assessmentYear = this.selectedApproch[
          x
        ].assessmentYear[0].assessmentYear;
        assessmentYars.push(ae);
        ao.objective = this.objectiveOfAsse;
        assessmentObjective.push(ao);

        if (this.discountrateDefaultVAl != null) {
          const discountrateParams = this.createParam(
            'Discount Rate',
            this.emptyObj,
            this.discountrateDefaultVAl,
            this.emptyVal,
            this.uomDiscountrate,
            true,
            false,
            false,
            false,
            this.selectedApproch[x]?.assessmentYear[0]?.assessmentYear,
          );
          parameters.push(...discountrateParams!);
        } else {
          const discountrateParams = this.createParam(
            'Discount Rate',
            this.discountrate,
            this.emptyVal,
            this.emptyVal,
            this.uomDiscountrate,
            true,
            false,
            false,
            false,
            this.selectedApproch[x]?.assessmentYear[0]?.assessmentYear,
          );
          parameters.push(...discountrateParams!);
        }

        const reductionParams = this.createParam(
          'Reduction',
          this.emptyObj,
          this.selectedApproch[x]?.assessmentResult[0].totalEmission.toString(),
          this.uomReduction,
          this.emptyVal,
          false,
          false,
          false,
          false,
          this.selectedApproch[x]?.assessmentYear[0]?.assessmentYear,
        );
        parameters.push(...reductionParams!);

        if (this.baseScenarioTotalInvestment == 0) {
          const bsTotalInvestmentParams = this.createParam(
            'Baseline Scenario Total Investment',
            this.bsTotalInvestment,
            this.emptyVal,
            this.emptyVal,
            this.uomCost,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsTotalInvestmentParams!);
        } else {
          const bsTotalInvestmentParams = this.createParam(
            'Baseline Scenario Total Investment',
            this.emptyObj,
            this.baseScenarioTotalInvestment.toString(),
            this.uomCost,
            this.emptyVal,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsTotalInvestmentParams!);
        }

        if (this.bsAnnualOMDefaulVAl != null) {
          const bsAnnualOMParams = this.createParam(
            'Baseline Scenario Annual O&M',
            this.emptyObj,
            this.bsAnnualOMDefaulVAl,
            this.emptyVal,
            this.uomCost,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsAnnualOMParams!);
        } else {
          const bsAnnualOMParams = this.createParam(
            'Baseline Scenario Annual O&M',
            this.bsAnnualOM,
            this.emptyVal,
            this.emptyVal,
            this.uomCost,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsAnnualOMParams!);
        }

        const bsOtherAnnualCostParams = this.createParam(
          'Baseline Scenario Other Annual Cost',
          this.bsOtherAnnualCost,
          this.emptyVal,
          this.emptyVal,
          this.uomCost,
          true,
          false,
          false,
          false,
          this.selectedApproch[x].assessmentYear[0].assessmentYear,
        );
        parameters.push(...bsOtherAnnualCostParams!);

        if (this.baseScenarioProjectLife == 0) {
          const bsProjectLifeParams = this.createParam(
            'Baseline Scenario Project Life',
            this.bsProjectLife,
            this.emptyVal,
            this.emptyVal,
            this.uomLife,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsProjectLifeParams!);
        } else {
          const bsProjectLifeParams = this.createParam(
            'Baseline Scenario Project Life',
            this.emptyObj,
            this.baseScenarioProjectLife.toString(),
            this.uomLife,
            this.emptyVal,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsProjectLifeParams!);
        }

        if (this.bsAnnualFuelDefaulVAl != null) {
          const bsAnnualFuelParams = this.createParam(
            'Baseline Scenario Annual Fuel',
            this.emptyObj,
            this.bsAnnualFuelDefaulVAl,
            this.emptyVal,
            this.uomCost,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsAnnualFuelParams!);
        } else {
          const bsAnnualFuelParams = this.createParam(
            'Baseline Scenario Annual Fuel',
            this.bsAnnualFuel,
            this.emptyVal,
            this.emptyVal,
            this.uomCost,
            true,
            false,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...bsAnnualFuelParams!);
        }

        if (this.projectScenarioTotalInvestment == 0) {
          const psTotalInvestmentParams = this.createParam(
            'Project Scenario Total Investment',
            this.psTotalInvestment,
            this.emptyVal,
            this.emptyVal,
            this.uomCost,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psTotalInvestmentParams!);
        } else {
          const psTotalInvestmentParams = this.createParam(
            'Project Scenario Total Investment',
            this.emptyObj,
            this.projectScenarioTotalInvestment.toString(),
            this.uomCost,
            this.emptyVal,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psTotalInvestmentParams!);
        }

        if (this.psAnnualOMDefaultVAl != null) {
          const psAnnualOMParams = this.createParam(
            'Project Scenario Annual O&M',
            this.emptyObj,
            this.psAnnualOMDefaultVAl,
            this.emptyVal,
            this.uomCost,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psAnnualOMParams!);
        } else {
          const psAnnualOMParams = this.createParam(
            'Project Scenario Annual O&M',
            this.psAnnualOM,
            this.emptyVal,
            this.emptyVal,
            this.uomCost,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psAnnualOMParams!);
        }

        const psOtherAnnualCostParams = this.createParam(
          'Project Scenario Other Annual Cost',
          this.psOtherAnnualCost,
          this.emptyVal,
          this.emptyVal,
          this.uomCost,
          false,
          true,
          false,
          false,
          this.selectedApproch[x].assessmentYear[0].assessmentYear,
        );
        parameters.push(...psOtherAnnualCostParams!);

        if (this.duration == 0) {
          const psProjectLifeParams = this.createParam(
            'Project Scenario Project Life',
            this.psProjectLife,
            this.emptyVal,
            this.emptyVal,
            this.uomLife,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psProjectLifeParams!);
        } else {
          const psProjectLifeParams = this.createParam(
            'Project Scenario Project Life',
            this.emptyObj,
            this.duration.toString(),
            this.uomLife,
            this.emptyVal,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psProjectLifeParams!);
        }

        if (this.psAnnualFuelDefaultVal != null) {
          const psAnnualFuelParams = this.createParam(
            'Project Scenario Annual Fuel',
            this.emptyObj,
            this.psAnnualFuelDefaultVal,
            this.emptyVal,
            this.uomCost,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psAnnualFuelParams!);
        } else {
          const psAnnualFuelParams = this.createParam(
            'Project Scenario Annual Fuel',
            this.psAnnualFuel,
            this.emptyVal,
            this.emptyVal,
            this.uomCost,
            false,
            true,
            false,
            false,
            this.selectedApproch[x].assessmentYear[0].assessmentYear,
          );
          parameters.push(...psAnnualFuelParams!);
        }

        assessment.assessmentYear = assessmentYars;
        assessment.assessmentObjective = assessmentObjective;
        assessment.parameters = parameters;

        this.serviceProxy
          .createOneBaseAssessmentControllerAssessment(assessment)
          .subscribe((res: any) => {
            this.isDisableSaveButton = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully sent to Data Collection Team! ',
              closable: true,
            });

            setTimeout(() => {}, 2000);
          });
      }
    }
  }

  private createParam(
    name: string,
    institution: Institution,
    value: string,
    uomDataEntry: string,
    uomDataRequest: string,
    isBaseline: boolean,
    isProject: boolean,
    islekage: boolean,
    isProjection: boolean,
    assessmentYear: string,
  ) {
    const parameters: Parameter_Server[] = [];

    const param = this.createServerParam(
      name,
      institution,
      value,
      uomDataEntry,
      uomDataRequest,
      assessmentYear,
      undefined,
      false,
      isBaseline,
      isProject,
      islekage,
      isProjection,
    );
    parameters.push(param);
    return parameters;
  }

  createServerParam(
    name: string,
    institution: Institution,
    value: string,
    uomDataEntry: string,
    uomDataRequest: string,
    assessmentYear: string,
    pp: Parameter_Server | undefined,
    isAlternative: boolean,
    isBaseline: boolean,
    isProject: boolean,
    islekage: boolean,
    isProjection: boolean,
  ) {
    const param = new Parameter_Server();
    param.name = name;
    param.institution = institution;
    param.value = value;
    param.uomDataEntry = uomDataEntry;
    param.uomDataRequest = uomDataRequest;
    param.isAlternative = isAlternative;

    param.assessmentYear = +assessmentYear;
    param.isBaseline = isBaseline;
    param.isProject = isProject;
    param.isLekage = islekage;
    param.isProjection = isProjection;

    return param;
  }
}

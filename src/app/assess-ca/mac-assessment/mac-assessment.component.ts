import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import {
  Assessment,
  AssessmentYear,
  Project,
  ServiceProxy,
  Parameter as Parameter_Server,
  AssessmentObjective,
  AssessmentResultControllerServiceProxy,
  AssessmentResult,
  ProjectApprovalStatus,
} from 'shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mac-assessment',
  templateUrl: './mac-assessment.component.html',
  styleUrls: ['./mac-assessment.component.css'],
})
export class MacAssessmentComponent implements OnInit, AfterViewInit {
  @Input()
  IsProposal: boolean;

  climateActions: Project[] = [];
  assessments: Assessment[] = [];
  newAssessments: any[] = [];
  asseYear: string;
  asseYearNew: string;
  details: any[] = [];
  objectiveOfAsse = '';
  slectedProject: Project = new Project();
  ndc: any = '';
  projectApprovalStatus: ProjectApprovalStatus[];
  isDisabled = true;
  projectStartDate: any;
  @ViewChild('op') overlay: any;
  choosenValMethod: any = '';
  reduction: any = '';
  ghgAssessmentTypeForMac: any = '';
  proposedAssessmentDetails: any = [];
  subNdc: any = '';
  discountrate: any = null;

  uomDiscountrate = '%';
  uomCost = '$';
  uomReduction = 'tCo2e';
  uomLife = 'years';

  bsOtherAnnualCost: any = null;
  bsTotalInvestment: any = null;
  psTotalInvestment: any = null;
  bsAnnualOM: any = null;
  psAnnualOM: any = null;
  bsAnnualFuel: any = null;
  psAnnualFuel: any = null;
  bsProjectLife: any = null;
  psProjectLife: any = null;
  psOtherAnnualCost: any = null;
  approachList: any = ['Ex-ante', 'Ex-post'];

  assessmentList1: Assessment[] = [];
  createdMacAssessment: Assessment = new Assessment();
  createdMacAssessmentId: number;
  createdMacAssessmentYear: AssessmentYear = new AssessmentYear();
  createdMacAssessmentYearId: number;
  calculate = true;
  result: any;
  years: number[] = [];
  macResults: any;
  macValue: any = {
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
  };

  userCountryId = 0;
  userSectorId = 0;

  isDiasbaleEye = true;

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

  isDisableSaveButton = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private assessmentResultService: AssessmentResultControllerServiceProxy,
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  formatYear() {
    const x = JSON.stringify(this.asseYearNew);

    this.asseYear = (Number(x.split('-')[0].substring(1)) + 1).toString();
  }
  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    const year = moment().year();
    for (let i = 1; i < 10; i++) {
      this.years.push(year - i);
      this.years.push(year + i);
    }

    this.years = this.years.sort();

    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        undefined,
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
        this.climateActions = this.climateActions.filter((o) => {
          if (o.country !== undefined) {
            return o.country.id == this.userCountryId;
          } else return false;
        });
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
    filter1.push('project.id||$eq||' + this.slectedProject.id);
    this.ndc = this.slectedProject.ndc?.name;
    this.subNdc = this.slectedProject.subNdc?.name;
    this.projectStartDate = moment(
      this.slectedProject.proposeDateofCommence,
    ).format('YYYY-MM-DD');
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
        this.assessments = res.data;
      });
  }

  onChangeDefaultValues(event: any) {}

  onStatusChangebsAnnualFuel(event: any) {
    this.bsAnnualFuel = Number(event.value);
    this.bsfuelCost = event.administrationLevel;
  }

  onStatusChangepsAnnualFuel(event: any) {
    this.psAnnualFuel = Number(event.value);
    this.psfuelCost = event.administrationLevel;
  }

  onStatusChangebsProjectLife(event: any) {
    this.bsProjectLife = Number(event.value);
    this.bsProjectLifeDisplay = event.administrationLevel;
  }

  onStatusChangepsProjectLife(event: any) {
    this.psProjectLife = Number(event.value);
    this.psProjectLifeDisplay = event.administrationLevel;
  }

  onStatusChangebsAnnualOM(event: any) {
    this.bsAnnualOM = Number(event.value);
    this.bsOM = event.administrationLevel;
  }

  onStatusChangepsAnnualOM(event: any) {
    this.psAnnualOM = Number(event.value);
    this.psOM = event.administrationLevel;
  }

  onStatusChangexxDiscountRate(event: any) {
    this.discountrate = Number(event.value);
    this.discountRateDisplay = event.administrationLevel;
  }

  mouseEnter() {
    this.getData();
  }

  filterYear() {
    this.isDisabled = false;
    const filter1: string[] = [];
    filter1.push('project.id||$eq||' + this.slectedProject.id) &
      filter1.push('assessmentYear.assessmentYear||$eq||' + this.asseYear) &
      filter1.push('Assessment.assessmentType||$in||' + this.approachList);

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
        this.newAssessments = res.data;
      });
  }

  getData() {
    if (this.details.length == 0) {
      for (let x = 0; x < this.newAssessments.length; x++) {
        if (this.newAssessments[x]?.assessmentResult[0] != undefined) {
          this.details.push({
            projData:
              this.newAssessments[x]?.assessmentResult[0]?.totalEmission +
              '__' +
              this.newAssessments[x]?.methodology?.displayName +
              '__' +
              this.newAssessments[x]?.assessmentType,
          });
        }
      }
    }
  }

  viewChoosenVal(event: any) {
    this.reduction = this.choosenValMethod.projData.split('__', 2)[0];
    this.ghgAssessmentTypeForMac = this.choosenValMethod.projData.split(
      '__',
      3,
    )[2];
  }

  onDiscountChange($event: any) {}

  removeDroplistVal() {
    this.choosenValMethod = '';
  }

  setValues() {
    this.macValue = {
      DiscountRate: this.discountrate,
      reduction: this.reduction,
      year: this.asseYear,
      baseline: {
        bsTotalInvestment: this.bsTotalInvestment,
        bsAnnualOM: this.bsAnnualOM,
        bsOtherAnnualCost: this.bsOtherAnnualCost,
        bsAnnualFuel: this.bsAnnualFuel,
        bsProjectLife: this.bsProjectLife,
      },
      project: {
        psTotalInvestment: this.psTotalInvestment,
        psOtherAnnualCost: this.psOtherAnnualCost,
        psAnnualOM: this.psAnnualOM,
        psAnnualFuel: this.psAnnualFuel,
        psProjectLife: this.psProjectLife,
      },
    };
  }

  detail() {
    if (this.slectedProject) {
      this.router.navigate(['/propose-project'], {
        queryParams: { id: this.slectedProject.id },
      });
    }
  }

  createAssessmentCA(data: NgForm) {
    this.macValue = {
      DiscountRate: this.discountrate,
      reduction: this.reduction,
      year: this.asseYear,
      baseline: {
        bsTotalInvestment: this.bsTotalInvestment,
        bsAnnualOM: this.bsAnnualOM,
        bsOtherAnnualCost: this.bsOtherAnnualCost,
        bsAnnualFuel: this.bsAnnualFuel,
        bsProjectLife: this.bsProjectLife,
      },
      project: {
        psTotalInvestment: this.psTotalInvestment,
        psOtherAnnualCost: this.psOtherAnnualCost,
        psAnnualOM: this.psAnnualOM,
        psAnnualFuel: this.psAnnualFuel,
        psProjectLife: this.psProjectLife,
      },
    };

    if (data.form.valid) {
      const assessment = new Assessment();
      assessment.projectDuration = this.slectedProject.duration;
      assessment.projectStartDate = moment(
        this.slectedProject.proposeDateofCommence,
      );
      assessment.emmisionReductionValue = this.reduction;
      assessment.assessmentType = 'MAC';
      assessment.ghgAssessTypeForMac = this.ghgAssessmentTypeForMac;
      assessment.project = this.slectedProject;
      assessment.isProposal = this.IsProposal;

      const assessmentYars: AssessmentYear[] = [];
      const assessmentObjective: AssessmentObjective[] = [];
      const parameters: Parameter_Server[] = [];
      const ae = new AssessmentYear();
      const ao = new AssessmentObjective();
      ae.assessmentYear = this.asseYear;
      assessmentYars.push(ae);
      ao.objective = this.objectiveOfAsse;

      assessmentObjective.push(ao);

      const discountrateParams = this.createParam(
        'Discount Rate',
        this.discountrate,
        this.uomDiscountrate,
        false,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...discountrateParams!);

      const reductionParams = this.createParam(
        'Reduction',
        this.reduction,
        this.uomReduction,
        false,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...reductionParams!);

      const bsTotalInvestmentParams = this.createParam(
        'Baseline Scenario Total Investment',
        this.bsTotalInvestment,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...bsTotalInvestmentParams!);

      const bsAnnualOMParams = this.createParam(
        'Baseline Scenario Annual O&M',
        this.bsAnnualOM,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...bsAnnualOMParams!);

      const bsOtherAnnualCostParams = this.createParam(
        'Baseline Scenario Other Annual Cost',
        this.bsOtherAnnualCost,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...bsOtherAnnualCostParams!);

      const bsProjectLifeParams = this.createParam(
        'Baseline Scenario Project Life',
        this.bsProjectLife,
        this.uomLife,
        true,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...bsProjectLifeParams!);

      const bsAnnualFuelParams = this.createParam(
        'Baseline Scenario Annual Fuel',
        this.bsAnnualFuel,
        this.uomCost,
        true,
        false,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...bsAnnualFuelParams!);

      const psTotalInvestmentParams = this.createParam(
        'Project Scenario Total Investment',
        this.psTotalInvestment,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...psTotalInvestmentParams!);

      const psAnnualOMParams = this.createParam(
        'Project Scenario Annual O&M',
        this.psAnnualOM,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...psAnnualOMParams!);

      const psOtherAnnualCostParams = this.createParam(
        'Project Scenario Other Annual Cost',
        this.psOtherAnnualCost,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...psOtherAnnualCostParams!);

      const psProjectLifeParams = this.createParam(
        'Project Scenario Project Life',
        this.psProjectLife,
        this.uomLife,
        false,
        true,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...psProjectLifeParams!);

      const psAnnualFuelParams = this.createParam(
        'Project Scenario Annual Fuel',
        this.psAnnualFuel,
        this.uomCost,
        false,
        true,
        false,
        false,
        this.asseYear,
      );
      parameters.push(...psAnnualFuelParams!);

      assessment.assessmentYear = assessmentYars;
      assessment.assessmentObjective = assessmentObjective;
      assessment.parameters = parameters;

      this.serviceProxy
        .createOneBaseAssessmentControllerAssessment(assessment)
        .subscribe((res: any) => {
          this.isDisableSaveButton = true;

          this.serviceProxy
            .getManyBaseAssessmentControllerAssessment(
              undefined,
              undefined,
              undefined,
              undefined,
              ['editedOn,DESC'],
              undefined,
              1,
              0,
              0,
              0,
            )
            .subscribe((res: any) => {
              this.createdMacAssessment = res.data[0];

              this.createdMacAssessmentId = this.createdMacAssessment.id;
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail:
                  'You have successfully Created & Wait for few seconds!.',
              });
              this.serviceProxy
                .getManyBaseAssessmentYearControllerAssessmentYear(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  ['id,DESC'],
                  undefined,
                  1,
                  0,
                  0,
                  0,
                )
                .subscribe((res: any) => {
                  this.createdMacAssessmentYear = res.data[0];

                  this.createdMacAssessmentYearId = this.createdMacAssessmentYear.id;

                  const macUrl = environment.baseUrlMac;
                  const headers = new HttpHeaders().set(
                    'api-key',
                    environment.apiKey1,
                  );

                  this.httpClient
                    .post<any>(macUrl, this.macValue, { headers: headers })
                    .subscribe((res) => {
                      this.result = res;

                      const asrslt = new AssessmentResult();
                      asrslt.bsTotalAnnualCost = res['baseLineAnnualCost'];
                      asrslt.psTotalAnnualCost = res['projecrAnnualCost'];
                      asrslt.costDifference = res['totalAnnualCost'];
                      asrslt.macResult = res['mac'];
                      asrslt.assessmentYear.id = this.createdMacAssessmentYearId;
                      asrslt.assessment.id = this.createdMacAssessmentId;

                      this.serviceProxy
                        .createOneBaseAssessmentResultControllerAssessmentResult(
                          asrslt,
                        )
                        .subscribe((res: any) => {
                          this.serviceProxy
                            .getManyBaseAssessmentControllerAssessment(
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              ['editedOn,DESC'],
                              undefined,
                              1,
                              0,
                              0,
                              0,
                            )
                            .subscribe(
                              (res: any) => {
                                this.assessmentList1 = res.data;

                                this.router.navigate(['/mac-result'], {
                                  queryParams: {
                                    id: this.assessmentList1[0]?.id,
                                  },
                                });
                              },
                              (error) => {
                                this.bsOtherAnnualCost = '';
                                this.bsTotalInvestment = '';
                                this.psTotalInvestment = '';
                                this.bsAnnualOM = '';
                                this.psAnnualOM = '';
                                this.bsAnnualFuel = '';
                                this.psAnnualFuel = '';
                                this.bsProjectLife = '';
                                this.psProjectLife = '';
                                this.psOtherAnnualCost = '';

                                this.messageService.add({
                                  severity: 'error',
                                  summary: 'Error',
                                  detail: 'Error,please try again!.',
                                });
                              },
                            );
                        });
                    });
                });
            });
        });
    }
  }

  private createParam(
    name: string,
    value: string,
    UOMDataentry: string,
    isBaseline: boolean,
    isProject: boolean,
    islekage: boolean,
    isProjection: boolean,
    assessmentYear: string,
  ) {
    const parameters: Parameter_Server[] = [];

    const param = this.createServerParam(
      name,
      value,
      UOMDataentry,
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
    value: string,
    UOMDataentry: string,
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
    param.isAlternative = isAlternative;
    param.uomDataEntry = UOMDataentry;
    param.assessmentYear = +assessmentYear;
    param.isBaseline = isBaseline;
    param.isProject = isProject;
    param.isLekage = islekage;
    param.isProjection = isProjection;
    param.value = value;

    return param;
  }
}

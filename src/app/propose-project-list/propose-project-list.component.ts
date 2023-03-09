import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import {
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx';
import { environment } from 'environments/environment.prod';
@Component({
  selector: 'app-propose-project-list',
  templateUrl: './propose-project-list.component.html',
  styleUrls: ['./propose-project-list.component.css'],
})
export class ProposeProjectListComponent implements OnInit, AfterViewInit {
  climateactions: Project[];
  selectedClimateActions: Project[];
  climateaction: Project = new Project();
  relatedItems: Project[] = [];
  sectors: Sector[];
  sectorName: string[] = [];
  sector: Sector = new Sector();
  cols: any;
  columns: any;
  options: any;
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  projectApprovalStatus: ProjectApprovalStatus[];

  selectedSectorType: Sector;
  selectedstatustype: ProjectStatus;
  searchText: string;

  loading: boolean;
  totalRecords = 0;
  isActive = false;
  rows = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    status: null,
    ApprovalStatus: null,
  };

  countryId = 0;
  sectorId = 0;

  rejectComment: string;
  rejectCommentRequried: boolean;
  selectedProject: Project;
  selectedProjects: any[] = [];
  fileName = 'Climate Actions Details.xlsx';
  isChecked = true;
  @ViewChild('op') overlay: any;

  drComment: string;
  drCommentRequried: boolean;
  @ViewChild('opDR') overlayDR: any;

  first = 0;

  cities: { name: string; id: number }[] = [
    { name: 'test', id: 1 },
    { name: 'test 2', id: 2 },
  ];

  statusList: string[] = [];
  flag = 1;
  selectedCities: string[] = [];
  caList: climateAction[] = [];
  conList: conatctDetails[] = [];
  generalDetailsList: generalDetailsOfCA[] = [];
  locationDetailsList: locationMap[] = [];
  outcomesList: outcomes[] = [];
  stakeholderList: stakeholders[] = [];
  financilaBackgroundList: financialBackground[] = [];

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  onRowSelected(event: Project) {}

  rejectWithComment() {
    if (
      this.rejectComment === '' ||
      this.rejectComment === null ||
      this.rejectComment === undefined
    ) {
      this.rejectCommentRequried = true;
    } else {
      this.selectedProject.projectRejectComment = this.rejectComment;
      this.updateProjectApprovalStatus(this.selectedProject, 2);
    }
  }

  drWithComment() {
    if (
      this.drComment === '' ||
      this.drComment === null ||
      this.drComment === undefined
    ) {
      this.drCommentRequried = true;
    } else {
      this.selectedProject.projectDataRequsetComment = this.drComment;
      this.updateProjectApprovalStatus(this.selectedProject, 3);
    }
  }

  OnShowOerlay() {
    this.rejectComment = '';
    this.rejectCommentRequried = false;
  }

  OnShowOerlayDR() {
    this.drComment = '';
    this.drCommentRequried = false;
  }

  ngOnInit(): void {
    this.getProjectApprovalStatus();
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    const currentProgress = this.searchBy.currentProgress
      ? this.searchBy.currentProgress
      : '';
    const projectApprovalStatusId = this.searchBy.ApprovalStatus
      ? this.searchBy.ApprovalStatus.id
      : 0;

    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    const Active = 0;
    setTimeout(() => {
      this.projectProxy
        .getProjectList(
          pageNumber,
          this.rows,
          filtertext,
          statusId,
          projectApprovalStatusId,
          currentProgress,
          Active,
          this.sectorId,
          environment.apiKey1,
        )
        .subscribe((a) => {
          this.climateactions = a.items;

          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        });
    }, 1);
  };

  getProjectApprovalStatus() {
    this.serviceProxy
      .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.projectApprovalStatus = res.data;
      });
  }

  updateProjectApprovalStatus(project: Project, aprovalStatus: number) {
    const status = this.projectApprovalStatus.find(
      (a) => a.id === aprovalStatus,
    );
    project.projectApprovalStatus =
      status === undefined ? (null as any) : status;
    if (aprovalStatus === 1) {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to approve ' +
          project.climateActionName +
          ' ?',
        accept: () => {
          this.updateStatus(project, aprovalStatus);
        },
      });
    }
    if (aprovalStatus === 2) {
      this.updateStatus(project, aprovalStatus);
      this.overlay.hide();
    }
    if (aprovalStatus === 3) {
      this.updateStatus(project, aprovalStatus);
      this.overlayDR.hide();
    }
  }

  updateStatus(project: Project, aprovalStatus: number) {
    this.serviceProxy
      .updateOneBaseProjectControllerProject(project.id, project)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              aprovalStatus === 1 || aprovalStatus === 2
                ? project.climateActionName +
                  ' is successfully ' +
                  (aprovalStatus === 1 ? 'Approved.' : 'Rejected')
                : 'Data request sent successfully.',
            closable: true,
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
            sticky: true,
          });
        },
      );
  }

  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Are you sure?',
      detail: 'Confirm to proceed',
    });
  }

  onStatusChange(event: any) {
    this.onSearch();
  }

  addproject() {
    const project: Project = new Project();
    project.climateActionName = 'Anonymous Climate Action';
    project.telephoneNumber = '999999999999';
    project.proposeDateofCommence = moment(Date.now());
    project.endDateofCommence = moment(Date.now());

    this.serviceProxy.createOneBaseProjectControllerProject(project).subscribe(
      (res) => {
        this.router.navigate(['/propose-project'], {
          queryParams: { anonymousId: res.id },
        });
      },

      (err) => {},
    );
  }

  sendDetails(climateactions: Project) {
    this.router.navigate(['/propose-result'], {
      queryParams: { id: climateactions.id },
    });
  }

  detail(climateactions: Project) {
    this.router.navigate(['/propose-project'], {
      queryParams: { id: climateactions.id, flag: this.flag },
    });
  }

  removeFromString(arr: string[], str: string) {
    const escapedArr = arr.map((v) => escape(v));
    const regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi',
    );
    return str.replace(regex, '');
  }

  toGhGAsse() {
    this.router.navigate(['/ghg-impact'], {});
  }

  async toDownloadCAs() {
    for (const x of this.selectedProjects) {
      const ca: climateAction = {
        Climate_Action_Name: '',
        Country: '',
        Current_tatus_of_the_Climate_Action: '',
        Sector: '',
        Aggregated_Actions: '',
        Action_Areas: '',
        Scope_of_the_Climate_Action: '',
      };

      const conDetails: conatctDetails = {
        Contact_Person_FullName: '',
        Email: '',
        Contact_Person_Designation: '',
        Telephone_Number: '',
        Mobile_Number: '',
        project_Proponent: '',
      };

      const generalDetails: generalDetailsOfCA = {
        Propose_Date_of_Commence: '',
        Duration: '',
        Objective_of_the_Climate_Action: '',
        Project_owner: '',
      };

      const locate: locationMap = {
        Sub_National_Levl1: '',
        Sub_National_Levl2: '',
        Sub_National_Levl3: '',
        Longitude: '',
        Latitude: '',
      };

      const outcome: outcomes = {
        Outcome: '',
        Current_Progress: '',
        GHG_Emission_Reduction: '',
        Adaptation_Benefits: '',
        Direct_SDBenefit: '',
        Indirect_SDBenefit: '',
      };

      const stkholders: stakeholders = {
        Implementing_Entity: '',
        Executing_Entity: '',
        Parties_Involved: '',
        Beneficiaries: '',
      };

      const financialBAckground: financialBackground = {
        Donors: '',
        Investors: '',
        Funding_Organization: '',
        Initial_Investment: '',
        Annual_Funding: '',
        Annual_Revenue: '',
        Expected_Recurrent_Expenditure: '',
      };

      ca.Climate_Action_Name = x.climateActionName;
      ca.Country = x.country?.name;
      ca.Current_tatus_of_the_Climate_Action = x.projectStatus?.name;
      ca.Sector = x.sector?.name;
      ca.Aggregated_Actions = x.NDC?.name;
      ca.Action_Areas = x.subNDC?.name;
      ca.Scope_of_the_Climate_Action = x.projectScope;
      this.caList.push(ca);

      conDetails.Contact_Person_FullName = x.contactPersoFullName;
      conDetails.Email = x.email;
      conDetails.Contact_Person_Designation = x.contactPersonDesignation;
      (conDetails.Telephone_Number = x.telephoneNumber),
        (conDetails.Mobile_Number = x.mobileNumber),
        (conDetails.project_Proponent = x.institution),
        this.conList.push(conDetails);

      generalDetails.Duration = x.duration;
      generalDetails.Objective_of_the_Climate_Action = x.objective;
      generalDetails.Propose_Date_of_Commence = x.proposeDateofCommence;
      generalDetails.Project_owner = x.projectOwer?.name;
      this.generalDetailsList.push(generalDetails);

      (locate.Sub_National_Levl1 = x.subNationalLevl1),
        (locate.Sub_National_Levl2 = x.subNationalLevl2),
        (locate.Sub_National_Levl3 = x.subNationalLevl3),
        (locate.Latitude = x.latitude),
        (locate.Longitude = x.longitude),
        this.locationDetailsList.push(locate);

      (outcome.Outcome = x.outcome),
        (outcome.Adaptation_Benefits = x.adaptationBenefits),
        (outcome.Current_Progress = x.currentProgress),
        (outcome.Direct_SDBenefit = x.directSDBenefit),
        (outcome.GHG_Emission_Reduction = x.chgEmissions),
        (outcome.Indirect_SDBenefit = x.indirectSDBenefit),
        this.outcomesList.push(outcome);

      (stkholders.Executing_Entity = x.executingEntity),
        (stkholders.Implementing_Entity = x.implementingEntity),
        (stkholders.Beneficiaries = x.beneficiaries),
        (stkholders.Parties_Involved = x.partiesInvolved),
        this.stakeholderList.push(stkholders);

      (financialBAckground.Annual_Funding = x.annualFunding),
        (financialBAckground.Annual_Revenue = x.annualRevenue),
        (financialBAckground.Donors = x.donors),
        (financialBAckground.Expected_Recurrent_Expenditure =
          x.expectedRecurrentExpenditure),
        (financialBAckground.Funding_Organization = x.fundingOrganization),
        (financialBAckground.Initial_Investment = x.initialInvestment),
        (financialBAckground.Investors = x.investors),
        this.financilaBackgroundList.push(financialBAckground);
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws_ca: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.caList);
    const ws_conDetails: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.conList,
    );
    const ws_generalDetailsList: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.generalDetailsList,
    );
    const ws_locationDetailsList: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.locationDetailsList,
    );
    const ws_outcomesList: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.outcomesList,
    );
    const ws_stakeholderList: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.stakeholderList,
    );
    const ws_financilaBackgroundList: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.financilaBackgroundList,
    );

    XLSX.utils.book_append_sheet(wb, ws_ca, 'Climate Action');
    XLSX.utils.book_append_sheet(wb, ws_conDetails, 'Contact Details');
    XLSX.utils.book_append_sheet(
      wb,
      ws_generalDetailsList,
      'General Details of CA',
    );
    XLSX.utils.book_append_sheet(wb, ws_locationDetailsList, 'Location');
    XLSX.utils.book_append_sheet(wb, ws_outcomesList, 'Outcomes_Benefits');
    XLSX.utils.book_append_sheet(wb, ws_stakeholderList, 'Stakeholders');
    XLSX.utils.book_append_sheet(
      wb,
      ws_financilaBackgroundList,
      'Financial Background',
    );

    if (this.selectedProjects.length > 0) {
      XLSX.writeFile(wb, this.fileName);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please first select climate actions before download!',
      });
    }
  }

  buttonEnable() {
    this.isChecked = false;
  }
}

export interface climateAction {
  Climate_Action_Name: string;
  Country: string;
  Current_tatus_of_the_Climate_Action: any;
  Sector: any;
  Aggregated_Actions: any;
  Action_Areas: any;
  Scope_of_the_Climate_Action: any;
}
export interface conatctDetails {
  Contact_Person_FullName: string;
  Email: string;
  Contact_Person_Designation: string;
  Telephone_Number: string;
  Mobile_Number: string;
  project_Proponent: any;
}

export interface generalDetailsOfCA {
  Propose_Date_of_Commence: any;
  Duration: any;
  Objective_of_the_Climate_Action: any;
  Project_owner: any;
}

export interface locationMap {
  Sub_National_Levl1: any;
  Sub_National_Levl2: any;
  Sub_National_Levl3: any;
  Longitude: any;
  Latitude: any;
}

export interface outcomes {
  Outcome: any;
  Current_Progress: any;
  GHG_Emission_Reduction: any;
  Adaptation_Benefits: any;
  Direct_SDBenefit: any;
  Indirect_SDBenefit: any;
}

export interface stakeholders {
  Implementing_Entity: any;
  Executing_Entity: any;
  Parties_Involved: any;
  Beneficiaries: any;
}

export interface financialBackground {
  Donors: any;
  Investors: any;
  Funding_Organization: any;
  Initial_Investment: any;
  Annual_Funding: any;
  Annual_Revenue: any;
  Expected_Recurrent_Expenditure: any;
}

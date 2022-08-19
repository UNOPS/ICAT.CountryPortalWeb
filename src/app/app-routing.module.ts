import { DataRequestComponent } from './data-request-flow/data-request/data-request.component';
import { ProposeProjectComponent } from './propose-project/propose-project.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCountryComponent } from './country-profile/edit-country/edit-country.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
import { ViewCountryComponent } from './country-profile/view-country/view-country.component';
import { CountryNdcComponent } from './country-ndc/country-ndc.component';
import { MethodologiesComponent } from './methodologies/methodologies.component';
import { ProjectInformationComponent } from './climate-action/project-information/project-information.component';
import { AddNdcComponent } from './country-ndc/add-ndc/add-ndc.component';
import { EditNdcComponent } from './country-ndc/edit-ndc/edit-ndc.component';
import { ProposeProjectListComponent } from './propose-project-list/propose-project-list.component';
import { InstitutionComponent } from './institution/add-institution/institution.component';
import { LoginLayoutComponent } from './login/login-layout/login-layout.component';
import { InstitutionListComponent } from './institution/institution-list/institution-list.component';
import { EditInstitutionComponent } from './institution/edit-institution/edit-institution.component';
// import { ViewInstitutionComponent } from './institution/view-institution/view-institution.component';
import { AuditComponent } from './audit/audit.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { AllClimateActionComponent } from './all-climate-action/all-climate-action.component';
import { ActiveClimateActionComponent } from './active-climate-action/active-climate-action.component';

import { GhgImpactComponent } from './assess-ca/ghg-impact/ghg-impact.component';
import { LearningMaterialComponent } from './learning-material/learning-material.component';
import { ActiveResultComponent } from './climate-action-result/active-result/active-result.component';
import { ProposedResultComponent } from './climate-action-result/proposed-result/proposed-result.component';
import { MacAssessmentComponent } from './assess-ca/mac-assessment/mac-assessment.component';
import { AllResultComponent } from './climate-action-result/all-result/all-result.component';
import { ManagedatastatusComponent } from './managedatastatus/managedatastatus.component';
import { ResultComponent } from './view-climate-action-results/proposed-result/result.component';
import { MacTabComponent } from './assess-ca/mac-tab/mac-tab.component';
import { IaDashboardComponent } from './dashboard/ia-dashboard/ia-dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { MacResultComponent } from './assessmet-result/mac-result/mac-result.component';

import { ManageDefaultValuesComponent } from './data-request-flow/manage-default-values/manage-default-values.component';
import { EnterDataComponent } from './data-request-flow/enter-data/enter-data.component';
import { AssignDataRequestComponent } from './data-request-flow/assign-data-request/assign-data-request.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { ReportComponent } from './report/report.component';
import { QualityCheckDetailComponent } from './quality-check-detail/quality-check-detail.component';
import { ReviewDataComponent } from './data-request-flow/review-data/review-data.component';
import { TrackclimateactionsComponent } from './trackclimateactions/trackclimateactions.component';
import { ApproveDataComponent } from './data-request-flow/approve-data/approve-data.component';
import { ViewInstitutionComponent } from './institution/view-institution/view-institution.component';
import { SummarytrackclimateactionsComponent } from './trackclimateactions/summarytrackclimateactions/summarytrackclimateactions.component';
import { ViewUserComponent } from './user/view-user/view-user.component';
import { FinalReportComponent } from './report/final-report/final-report.component';
import { AssignVerifiersComponent } from './data-request-flow/assign-verifiers/assign-verifiers.component';
import { VerifyCaComponent } from './verification-verifier/verify/verify-ca.component';
import { VerifyHistoryComponent } from './verification-verifier/verify-history/verify-history.component';
import { VerificationSectorAdminComponent } from './verification-sector-admin/verification-sector-admin.component';
import { NonconformanceReportComponent } from './nonconformance-report/nonconformance-report.component';
import { SectorComponent } from './sector/sector.component';

import { VerifyDetailComponent } from './verification-verifier/verify-detail/verify-detail.component';
import { RoleGuardService } from './auth/role-guard.service';
import { SummarytrackclimateactionsCountryComponent } from './trackclimateactions-country/summarytrackclimateactions-country/summarytrackclimateactions-country.component';
import { TrackclimateactionsCountryComponent } from './trackclimateactions-country/trackclimateactions-country.component';
import { VerifyDetailComponentSectorAdmin } from './verification-sector-admin/verify-detail/verify-detail.component';
import { DefaultValueFormComponent } from './data-request-flow/manage-default-values/default-value-form/default-value-form.component';

export enum UserRoles {
  COUNTRY_ADMIN = 'Country Admin',
  VERIFIER = 'Verifier',
  SECTOR_ADMIN = 'Sector Admin',
  MRV_ADMIN = 'MRV Admin',
  TT = 'Technical Team',
  DCT = 'Data Collection Team',
  QC = 'QC Team',
  INS_ADMIN = 'Institution Admin',
  DEO = 'Data Entry Operator',
}
export enum CountryModule {
  CLIMATE_ACTION_MODULE = 0,
  GHG_MODULE = 1,
  MAC_MODULE = 2,
  DATACOLLECTION_MODULE = 3,
  
}
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.VERIFIER,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
        UserRoles.DCT,
        UserRoles.QC,
      ],
      
    },
  },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' }, // redirect to `first-component`
  { path: 'login', component: LoginLayoutComponent },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.SECTOR_ADMIN,
        UserRoles.INS_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
        UserRoles.DCT
      
      ],
    },
  },
  {
    path: 'user',
    component: UserFormComponent,
    // canActivate: [RoleGuard],
    // data: {
    //   expectedRoles: ['ccs-admin', 'ins-admin']
    // }
  },
  {
    path: 'user-new',
    component: UserFormComponent,
    // canActivate: [RoleGuard],
    // data: {
    //   expectedRoles: ['ccs-admin', 'ins-admin']
    // }
  },
  // {
  //   path: 'qc',
  //   component: QualityCheckComponent,
  //   canActivate: [RoleGuardService],
  //   data: {
  //     expectedRoles: ['ccs-admin', 'ins-admin'],
  //   },
  // },
  {
    path: 'qc',
    component: QualityCheckComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.QC,UserRoles.MRV_ADMIN,],
    },
  }, //new

  { path: 'qc/detail', component: QualityCheckDetailComponent },
  {
    path: 'view-country',
    component: ViewCountryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.COUNTRY_ADMIN],
    },
  },
  { path: 'edit-country', component: EditCountryComponent },
  {
    path: 'climate-action',
    component: ClimateActionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.INS_ADMIN,
        UserRoles.DEO,
        UserRoles.SECTOR_ADMIN,
      ],
    },
  },
  {
    path: 'all-climate-action',
    component: AllClimateActionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
    },
  },
  {
    path: 'active-climate-action',
    component: ActiveClimateActionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
      expectedModules: [
        CountryModule.DATACOLLECTION_MODULE,
        
        
      ],
    },
  },
  { path: 'project-information', component: ProjectInformationComponent },
  { path: 'ndc', component: CountryNdcComponent },
  {
    path: 'activity',
    component: AuditComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.VERIFIER,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
        UserRoles.DCT,
        UserRoles.QC,
        UserRoles.INS_ADMIN,
        UserRoles.DEO,
      ],
    },
  },
  { path: 'addndc', component: AddNdcComponent },
  { path: 'editndc', component: EditNdcComponent },
  {
    path: 'methodologies',
    component: MethodologiesComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.VERIFIER,
        UserRoles.TT,
        UserRoles.DCT,
        UserRoles.QC,
      ],
    },
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'propose-project', component: ProposeProjectComponent },
  {
    path: 'propose-project-list',
    component: ProposeProjectListComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
    },
  },
  { path: 'institution', component: InstitutionComponent },
  {
    path: 'institution-list',
    component: InstitutionListComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
        UserRoles.DCT,
      ],
    },
  },
  { path: 'edit-institution', component: EditInstitutionComponent },
  { path: 'view-institution', component: ViewInstitutionComponent },
  // { path: 'view-institution/:id', component: ViewInstitutionComponent}
  {
    path: 'ghg-impact',
    component: GhgImpactComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
      expectedModules: [
        CountryModule.MAC_MODULE,
        CountryModule.DATACOLLECTION_MODULE,
        CountryModule.GHG_MODULE,
        
      ],
    },
  },
  {
    path: 'learning-material',
    component: LearningMaterialComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.VERIFIER,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
        UserRoles.DCT,
        UserRoles.QC,
        UserRoles.INS_ADMIN,
        UserRoles.DEO,
      ],
    },
  },
  {
    path: 'result',
    component: ResultComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
    },
  },
  // { path: 'ca-result', component: CaResultComponent},
  { path: 'learning-material', component: LearningMaterialComponent },
  { path: 'learning-material', component: LearningMaterialComponent },
  { path: 'active-result', component: ActiveResultComponent },
  { path: 'propose-result', component: ProposedResultComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'loard-more', component: LoardMoreComponent },
  {
    path: 'mac-tab',
    component: MacTabComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
      expectedModules: [
        CountryModule.MAC_MODULE,
        CountryModule.DATACOLLECTION_MODULE,
        
      ],
    },
  },
  {
    path: 'all-result',
    component: AllResultComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
      expectedModules: [
        CountryModule.MAC_MODULE,
        CountryModule.GHG_MODULE
        
      ],
    },
  },
  // { path: 'ia-dashboard', component: IaDashboardComponent},
  { path: 'manage-datastatus', component: ManagedatastatusComponent },
  {
    path: 'ia-dashboard',
    component: IaDashboardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.INS_ADMIN, UserRoles.DEO],
    },
  },
  // { path: 'ia-dashboard', component: IaDashboardComponent},
  { path: 'mac-result', component: MacResultComponent },
  {
    path: 'ia-dashboard',
    component: IaDashboardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.INS_ADMIN, UserRoles.DEO],
    },
  },
  {
    path: 'app-manage-default-values',
    component: ManageDefaultValuesComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.DCT,UserRoles.MRV_ADMIN,],
    },
  },
  {
    path: 'app-manage-default-values-form',
    component: DefaultValueFormComponent,
  },
  { path: 'track-ca', component: TrackclimateactionsComponent },
  {
    path: 'track-ca-summary',
    component: SummarytrackclimateactionsComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
    },
  },
  {
    path: 'track-ca-summary-country',
    component: SummarytrackclimateactionsCountryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.SECTOR_ADMIN,
      ],
      expectedModules: [
        CountryModule.DATACOLLECTION_MODULE,
        
      ],
    },
  },
  { path: 'track-ca-country', component: TrackclimateactionsCountryComponent },
  {
    path: 'app-enter-data',
    component: EnterDataComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.INS_ADMIN, UserRoles.DEO],
    },
  },
  {
    path: 'app-data-request',
    component: DataRequestComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.DCT,UserRoles.MRV_ADMIN,],
    },
  },
  {
    path: 'app-assign-data-request',
    component: AssignDataRequestComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.INS_ADMIN],
    },
  },
  {
    path: 'app-review-data',
    component: ReviewDataComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.INS_ADMIN],
    },
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.COUNTRY_ADMIN,
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
      expectedModules: [
        CountryModule.DATACOLLECTION_MODULE,
        
      ],
    },
  },
  {
    path: 'app-managedatastatus',
    component: ManagedatastatusComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.DCT,UserRoles.MRV_ADMIN],
    },
  },
  { path: 'report', component: ReportComponent },
  { path: 'app-approve-data', component: ApproveDataComponent },
  { path: 'view-user', component: ViewUserComponent },
  { path: 'final-report/:reports', component: FinalReportComponent },
  {
    path: 'app-assign-verifiers',
    component: AssignVerifiersComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.COUNTRY_ADMIN],
      expectedModules: [
        CountryModule.DATACOLLECTION_MODULE,
        
      ],
    },
  },
  {
    path: 'verification-verifier',
    component: VerifyCaComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.VERIFIER],
    },
  },
  { path: 'non-conformance', component: NonconformanceReportComponent },
  { path: 'view-sector', component: SectorComponent },
  {
    path: 'verification-history',
    component: VerifyHistoryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [UserRoles.VERIFIER],
    },
  },
  {
    path: 'verification-sector-admin',
    component: VerificationSectorAdminComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.SECTOR_ADMIN,
        UserRoles.MRV_ADMIN,
        UserRoles.TT,
      ],
      expectedModules: [
        CountryModule.DATACOLLECTION_MODULE,
        
      ],
    },
  },
  {
    path: 'verification-sector-admin/detail',
    component: VerifyDetailComponentSectorAdmin,
  },
  { path: 'verification-verifier/detail', component: VerifyDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

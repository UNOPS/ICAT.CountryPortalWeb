import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule } from 'primeng/carousel';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCountryComponent } from './country-profile/edit-country/edit-country.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { InputMaskModule } from 'primeng/inputmask';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ChartModule } from 'primeng/chart';
import { TreeModule } from 'primeng/tree';
import { ReactiveFormsModule} from '@angular/forms' 
import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProposeProjectComponent } from './propose-project/propose-project.component';
import { ViewCountryComponent } from './country-profile/view-country/view-country.component';
import { environment } from '../environments/environment';
import { CountryNdcComponent } from './country-ndc/country-ndc.component';
import {
  API_BASE_URL,
  DocumentControllerServiceProxy,
  ProjectControllerServiceProxy,
  MethodologyControllerServiceProxy,
  ServiceProxy,
  LearningMaterialControllerServiceProxy,
  UsersControllerServiceProxy,
  AuthControllerServiceProxy,
  InstitutionControllerServiceProxy,
  AuditControllerServiceProxy,
  ParameterControllerServiceProxy,
  AssessmentYearControllerServiceProxy,
  ParameterRequestControllerServiceProxy,
  QualityCheckControllerServiceProxy,
  VerificationControllerServiceProxy,
  NdcControllerServiceProxy,
  ReportControllerServiceProxy,
  SectorControllerServiceProxy,
  UnitConversionControllerServiceProxy,
  UserTypeControllerServiceProxy,
  EmissionReductionDraftdataControllerServiceProxy,
  ParameterHistoryControllerServiceProxy,
  DefaultValueControllerServiceProxy,
  ApplicabilityControllerServiceProxy,
  TrackClimateControllerServiceProxy,
  AssessmentControllerServiceProxy,
  AssessmentResultControllerServiceProxy,
  ProjectionResultControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { ProjectInformationComponent } from './climate-action/project-information/project-information.component';
import { MethodologiesComponent } from './methodologies/methodologies.component';
import { AddNdcComponent } from './country-ndc/add-ndc/add-ndc.component';
import { EditNdcComponent } from './country-ndc/edit-ndc/edit-ndc.component';
import { DocumentUploadComponent } from './shared/document-upload/document-upload.component';
import { ProposeProjectListComponent } from './propose-project-list/propose-project-list.component';
import { InstitutionComponent } from './institution/add-institution/institution.component';
import { AuditComponent } from './audit/audit.component';
import { LoginLayoutComponent } from './login/login-layout/login-layout.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { LoginLayoutService } from './login/login-layout/login-layout.service';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { InstitutionListComponent } from './institution/institution-list/institution-list.component';
import { EditInstitutionComponent } from './institution/edit-institution/edit-institution.component';
import { AllClimateActionComponent } from './all-climate-action/all-climate-action.component';
import { ActiveClimateActionComponent } from './active-climate-action/active-climate-action.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { GhgImpactComponent } from './assess-ca/ghg-impact/ghg-impact.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { LearningMaterialComponent } from './learning-material/learning-material.component';
import { DocumentComponent } from './learning-material/document/document.component';
import { ProposedResultComponent } from './climate-action-result/proposed-result/proposed-result.component';
import { ActiveResultComponent } from './climate-action-result/active-result/active-result.component';
import { AllResultComponent } from './climate-action-result/all-result/all-result.component';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { FuelParameterComponent } from './component/fuel-parameter/fuel-parameter.component';
import { PowerPlantParameterComponent } from './component/power-plant-parameter/power-plant-parameter.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ManagedatastatusComponent } from './managedatastatus/managedatastatus.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { GhgAssessmentComponent } from './component/ghg-assessment/ghg-assessment.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { MacResultComponent } from './assessmet-result/mac-result/mac-result.component';
import { MacTabComponent } from './assess-ca/mac-tab/mac-tab.component';
import { MacAssessmentApprovedComponent } from './assess-ca/mac-assessment-approved/mac-assessment-approved.component';
import { MacAssessmentComponent } from './assess-ca/mac-assessment/mac-assessment.component';
import { DatePipe } from '@angular/common';
import { DataRequestComponent } from './data-request-flow/data-request/data-request.component';
import { ManageDefaultValuesComponent } from './data-request-flow/manage-default-values/manage-default-values.component';
import { EnterDataComponent } from './data-request-flow/enter-data/enter-data.component';
import { AssignDataRequestComponent } from './data-request-flow/assign-data-request/assign-data-request.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { ResultComponent } from './view-climate-action-results/proposed-result/result.component';
import { VehicalParameterComponent } from './component/vehical-parameter/vehical-parameter.component';
import { RouteParameterComponent } from './component/route-parameter/route-parameter.component';
import { ReportComponent } from './report/report.component';
import { DocumentReportComponent } from './report/document-report/document-report.component';
import { QualityCheckDetailComponent } from './quality-check-detail/quality-check-detail.component';
import { ParameterSummaryComponent } from './component/parameter-summary/parameter-summary.component';
import { ReviewDataComponent } from './data-request-flow/review-data/review-data.component';
import { QcHistoryComponent } from './component/qc-history/qc-history.component';
import { TrackclimateactionsComponent } from './trackclimateactions/trackclimateactions.component';
import { ApproveDataComponent } from './data-request-flow/approve-data/approve-data.component';
import { SummarytrackclimateactionsComponent } from './trackclimateactions/summarytrackclimateactions/summarytrackclimateactions.component';
import { ViewUserComponent } from './user/view-user/view-user.component';
import { ViewInstitutionComponent } from './institution/view-institution/view-institution.component';
import { FinalReportComponent } from './report/final-report/final-report.component';
import { AssignVerifiersComponent } from './data-request-flow/assign-verifiers/assign-verifiers.component';
import { VerifyCaComponent } from './verification-verifier/verify/verify-ca.component';
import { VerifyHistoryComponent } from './verification-verifier/verify-history/verify-history.component';
import { VerificationSectorAdminComponent } from './verification-sector-admin/verification-sector-admin.component';
import { NonconformanceReportComponent } from './nonconformance-report/nonconformance-report.component';
import { SectorComponent } from './sector/sector.component';
import { TrackclimateactionsCountryComponent } from './trackclimateactions-country/trackclimateactions-country.component';
import { SummarytrackclimateactionsCountryComponent } from './trackclimateactions-country/summarytrackclimateactions-country/summarytrackclimateactions-country.component';
import { VerifyDetailComponent } from './verification-verifier/verify-detail/verify-detail.component';
import { VerifyParameterSectionComponent } from './verification-verifier/verify-parameter-section/verify-parameter-section.component';
import { RoleGuardService } from './auth/role-guard.service';
import { RaiseConcernComponent } from './component/raise-concern/raise-concern.component';
import { VerifyDetailSectorAdminComponent } from './verification-sector-admin/verify-detail/verify-detail.component';
import { VerifyParameterSectionAdminComponent } from './verification-sector-admin/verify-parameter-section-admin/verify-parameter-section-admin.component';
import { RaiseConcernAdminComponent } from './component/raise-concern-admin/raise-concern-admin.component';
import { RaiseConcernSectionComponent } from './component/raise-concern-section/raise-concern-section.component';
import { TokenInterceptor } from './shared/token-interceptor ';
import { SharedDataService } from 'shared/shared-data-services';
import { ViewDatarequestHistoryComponent } from './component/view-datarequest-history/view-datarequest-history.component';
import { DefaultValueFormComponent } from './data-request-flow/manage-default-values/default-value-form/default-value-form.component';
import {MessageModule} from 'primeng/message';
import { FeedstockParameterComponent } from './component/feedstock-parameter/feedstock-parameter.component';
import { SoilParameterComponent } from './component/soil-parameter/soil-parameter.component';
import { StratumParameterComponent } from './component/stratum-parameter/stratum-parameter.component';
import { ResidueParameterComponent } from './component/residue-parameter/residue-parameter.component';
import {PasswordModule} from 'primeng/password';
import { VerificationActionDialogComponent } from './verification-sector-admin/verification-action-dialog/verification-action-dialog.component';
import { SetPasswordComponent } from './login/set-password/set-password.component';
import { VerificationService } from 'shared/verification-service';
import { DirectDefaultValueFormComponent } from './data-request-flow/manage-default-values/default-value-form/direct-default-value-form/direct-default-value-form.component';

export function getRemoteServiceBaseUrl(): string {
  return environment.baseUrlAPI;
}


@NgModule({
  declarations: [
    AppComponent,
    ViewUserComponent,
    ProposeProjectComponent,
    EditCountryComponent,
    ClimateActionComponent,
    ViewCountryComponent,
    CountryNdcComponent,
    ProjectInformationComponent,
    MethodologiesComponent,
    AddNdcComponent,
    EditNdcComponent,
    DocumentUploadComponent,
    ProposeProjectListComponent,
    InstitutionComponent,
    LoginLayoutComponent,
    ForgotPasswordComponent,
    LoginFormComponent,
    InstitutionListComponent,
    EditInstitutionComponent,
    AuditComponent,
    LoginLayoutComponent,
    ForgotPasswordComponent,
    LoginFormComponent,
    AllClimateActionComponent,
    ActiveClimateActionComponent,
    UserListComponent,
    UserFormComponent,
    GhgImpactComponent,
    LearningMaterialComponent,
    DocumentComponent,
    ResultComponent,
    DocumentReportComponent,
    ProposedResultComponent,
    ActiveResultComponent,
    MacAssessmentComponent,
    VehicalParameterComponent,
    RouteParameterComponent,
    FuelParameterComponent,
    PowerPlantParameterComponent,
    AllResultComponent,
    ManagedatastatusComponent,
    MacTabComponent,
    MacAssessmentApprovedComponent,
    GhgAssessmentComponent,
    LandingPageComponent,
    LoardMoreComponent,
    MacResultComponent,
    DataRequestComponent,
    ManageDefaultValuesComponent,
    EnterDataComponent,
    AssignDataRequestComponent,
    QualityCheckComponent,
    ReportComponent,
    DocumentReportComponent,
    QualityCheckDetailComponent,
    ParameterSummaryComponent,
    ReviewDataComponent,
    QcHistoryComponent,
    TrackclimateactionsComponent,
    ApproveDataComponent,
    ViewInstitutionComponent,
    SummarytrackclimateactionsComponent,
    FinalReportComponent,
    AssignVerifiersComponent,
    VerifyCaComponent,
    VerifyHistoryComponent,
    VerificationSectorAdminComponent,
    NonconformanceReportComponent,
    SectorComponent,
    TrackclimateactionsCountryComponent,
    SummarytrackclimateactionsCountryComponent,
    VerifyDetailComponent,
    VerifyParameterSectionComponent,
    RaiseConcernComponent,
    VerifyDetailSectorAdminComponent,
    VerifyParameterSectionAdminComponent,
    RaiseConcernAdminComponent,
    RaiseConcernSectionComponent,
    GhgAssessmentComponent,
    ViewDatarequestHistoryComponent,
    DefaultValueFormComponent,
    FeedstockParameterComponent,
    SoilParameterComponent,
    StratumParameterComponent,
    ResidueParameterComponent,
    VerificationActionDialogComponent,
    SetPasswordComponent,
    DirectDefaultValueFormComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DashboardModule,
    ReactiveFormsModule,
    NgImageSliderModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    FileUploadModule,
    AutoCompleteModule,
    StepsModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    DialogModule,
    ListboxModule,
    TableModule,
    InputNumberModule,
    InputMaskModule,
    TabViewModule,
    AccordionModule,
    CardModule,
    SliderModule,
    ToggleButtonModule,
    SplitButtonModule,
    SelectButtonModule,
    TooltipModule,
    ProgressBarModule,
    ConfirmDialogModule,
    GMapModule,
    ChartModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    TreeModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MessagesModule,
    ToastModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    PaginatorModule,
    CarouselModule,
    DynamicDialogModule,
    PasswordModule
  ],
  providers: [
    LoginLayoutService,
    ConfirmationService,
    ServiceProxy,
    LearningMaterialControllerServiceProxy,
    DocumentControllerServiceProxy,
    ConfirmationService,
    ProjectControllerServiceProxy,
    MethodologyControllerServiceProxy,
    UsersControllerServiceProxy,
    AuthControllerServiceProxy,
    InstitutionControllerServiceProxy,
    AuditControllerServiceProxy,
    AssessmentControllerServiceProxy,
    ParameterControllerServiceProxy,
    ParameterRequestControllerServiceProxy,
    AssessmentYearControllerServiceProxy,
    QualityCheckControllerServiceProxy,
    VerificationControllerServiceProxy,
    NdcControllerServiceProxy,
    ReportControllerServiceProxy,
    AssessmentResultControllerServiceProxy,
    ProjectionResultControllerServiceProxy,
    UnitConversionControllerServiceProxy,
    UserTypeControllerServiceProxy,
    TrackClimateControllerServiceProxy,
    ProjectControllerServiceProxy,
    DatePipe,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    Location,
    SectorControllerServiceProxy,
    RoleGuardService,
    SharedDataService,
    EmissionReductionDraftdataControllerServiceProxy,
    ParameterHistoryControllerServiceProxy,
    DefaultValueControllerServiceProxy,
    ApplicabilityControllerServiceProxy,
    VerificationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

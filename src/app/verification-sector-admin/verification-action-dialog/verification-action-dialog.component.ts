import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssessmentYear, ChangeParameterValue, Institution, InstitutionControllerServiceProxy, Ndc, Parameter, Project, ServiceProxy, SubNdc, UnitConversionControllerServiceProxy, User, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { AppService } from 'shared/AppService';

@Component({
  selector: 'app-verification-action-dialog',
  templateUrl: './verification-action-dialog.component.html',
  styleUrls: ['./verification-action-dialog.component.css']
})
export class VerificationActionDialogComponent implements OnInit {

  isEnterData: boolean = true

  correctValue: number
  correctUnit: any
  selectedInstitution: Institution
  parameter: Parameter
  instiTutionList: Institution[];
  verificationDetail: VerificationDetail

  unitList: any[] = []
  unit: any = {ur_fromUnit:null}

  ref: DynamicDialogConfig
  type: string
  ndcList: Ndc[]
  userCountryId:number = 0;
  userSectorId:number = 0;
  selectedNdc: Ndc
  selectedSubNdc: SubNdc
  assessmentYear: AssessmentYear

  loggedUser: User
  resultComment: string
  scenario: string

  constructor(
    public config: DynamicDialogConfig,
    private unitConversionControllerServiceProxy: UnitConversionControllerServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy,
    private verificationControllerServiceProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private serviceProxy: ServiceProxy,
    private appService: AppService
  ) { 
    console.log("config data--------", config.data)
    this.parameter = this.config.data['parameter'];
    this.verificationDetail = config.data['verificationDetail']
    this.type = config.data['type']
    this.assessmentYear = config.data['assessmentYear']
  }

  async ngOnInit(): Promise<void> {

    this.loggedUser = await this.appService.getLoggedUser()

    if (this.type === 'ndc') {
      const token = localStorage.getItem('access_token')!;
      const tokenPayload = decode<any>(token);
      this.userCountryId = tokenPayload.countryId;
      this.userSectorId = tokenPayload.sectorId;
      this.serviceProxy
        .getManyBaseNdcControllerNdc(
          undefined,
          undefined,
          undefined,
          undefined,
          ['name,ASC'],
          ['subNdc'],
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.ndcList = res.data;
          this.ndcList = this.ndcList.filter((o) => o.country.id == this.userCountryId && o.sector.id == this.userSectorId);
          console.log("+++++++++", this.ndcList)
        });
    } else if (this.type === 'parameter') {
      let _unit
      if (this.parameter.uomDataRequest){
        _unit = this.parameter.uomDataRequest
      } else if (this.parameter.uomDataEntry){
        _unit = this.parameter.uomDataEntry
      } else {
        _unit = ''
      }
      let res = await this.unitConversionControllerServiceProxy.getUnitTypes(_unit).toPromise()
      if (res.length > 0){
        this.unitList = res
      } else {
        this.unit.ur_fromUnit = this.parameter.uomDataRequest ? this.parameter.uomDataRequest : this.parameter.uomDataEntry
        this.unitList.push(this.unit)
      }
  
      let ins = await this.instituationProxy.getInstitutionforAssesment().toPromise()
      if (ins.length > 0){
        this.instiTutionList = ins
      }
    }

  }

  async sendValueForVerification(_isEnterData: boolean) {
    console.log("clicked")
    if (this.type === 'parameter') {
      if (_isEnterData) {
        // enter direct value
        console.log("enter direct value", this.correctValue, this.correctUnit)
        console.log("selected parameter", this.parameter)
        let body = new ChangeParameterValue()
        let para = new Parameter()
        para.id = this.parameter.id
        body.parameter = para
        body.isDataEntered = _isEnterData
        body.concern = this.verificationDetail?.explanation
        body.correctData = {
          value: this.correctValue,
          unit: this.correctUnit.ur_fromUnit
        }
        let user = new User()
        user.id = this.loggedUser.id
        body.user = user
        console.log(body)
        let res = await this.verificationControllerServiceProxy.changeParameterValue(body).toPromise()
        if (res.status === 'saved') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Value changed successfully',
            closable: true,
          });
          this.dialogRef.close({isEnterData: _isEnterData, value: this.correctValue + this.correctUnit.ur_fromUnit})
        }
        console.log(res)

      } else {
        // data collection path
        let body = new ChangeParameterValue()
        let para = new Parameter()
        para.id = this.parameter.id
        body.parameter = para
        body.isDataEntered = _isEnterData
        body.concern = this.verificationDetail?.explanation
        body.correctData = {
          institution: this.selectedInstitution,
          unit: this.correctUnit.ur_fromUnit
        }
        let res = await this.verificationControllerServiceProxy.changeParameterValue(body).toPromise()
        if (res.status === 'saved') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Value changed successfully',
            closable: true,
          });
          this.dialogRef.close({isEnterData: _isEnterData, value: this.selectedInstitution.name})
        }
        console.log(res)
      }
    } else if (this.type === 'ndc') {
      this.dialogRef.close({result: {ndc: this.selectedNdc, subNdc: this.selectedSubNdc}})
      // let action = `Ndc changed  Original Value : ${this.assessmentYear.assessment.project.ndc.name} New Value : ${this.selectedNdc.name} \n
      // Sub Ndc changed  Original Value : ${this.assessmentYear.assessment.project.subNdc?.name} New Value : ${this.selectedSubNdc?.name} \n`;

      // this.assessmentYear.assessment.project.ndc = this.selectedNdc;
      // this.assessmentYear.assessment.project.subNdc = this.selectedSubNdc;

      // // console.log("ndcAction", this.assementYear.assessment)

      // let project: Project = await this.serviceProxy.getOneBaseProjectControllerProject(
      //   this.assessmentYear.assessment.project.id,
      //   undefined,
      //   undefined,
      //   undefined).toPromise()

      // let ndc = new Ndc();
      // ndc.id = this.selectedNdc.id;
      // project.ndc = ndc;

      // let subNdc = new SubNdc();
      // subNdc.id = this.selectedSubNdc?.id;
      // project.subNdc = subNdc;

      // this.serviceProxy
      //   .updateOneBaseProjectControllerProject(
      //     project.id,
      //     project
      //   )
      //   .subscribe(
      //     (res) => {
      //       console.log(res)
      //       // this.saveVerificationDetails(true, false, action);
      //     },
      //     (error) => {
      //       console.log('Error', error);
      //     }
      //   );
    } else if (this.type === 'result'){
      this.dialogRef.close({result: {comment: this.resultComment}})
    }
  }

  checkEnable() {
    return (!this.correctValue && !this.correctUnit && this.selectedNdc === undefined && this.resultComment === undefined) ||
      (this.correctValue === undefined && this.correctUnit === undefined && !this.selectedNdc && this.resultComment === undefined)  ||
      (this.correctValue === undefined && this.correctUnit === undefined && this.selectedNdc === undefined && !this.resultComment)

  }

}

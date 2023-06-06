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
  defaultValues: any = [];
  selectedDefault: any

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

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    if (this.type === 'ndc') {
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
      
      await this.getUnits()
      await this.getInstitutions()
    }
    if (this.parameter.isDefault){
      await this.getDefaultValues()
    }

  }

  async getUnits(){
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
  }

  async getInstitutions(){
    let ins = await this.instituationProxy.getInstitutionforAssesment().toPromise()
    if (ins.length > 0){
      this.instiTutionList = ins
    } 
  }

  async getDefaultValues() {
    let uniqueNames: string[] = []
    let res = await this.serviceProxy
      .getManyBaseDefaultValueControllerDefaultValue(
        undefined,
        undefined,
        ['country.id||$eq||' + this.userCountryId],
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).toPromise()

    let _defaultValues: any = res.data;
    _defaultValues.map(
      (a: any) =>
        (a.name = `${a.value} - ${a.unit} - ${a.administrationLevel} - ${a.source}  - ${a.year}`)
    );
    let names: string[] = []
    if (this.parameter.vehical && this.parameter.vehical !== ""){
      names.push(this.parameter.vehical)
    }
    if (this.parameter.fuelType && this.parameter.fuelType !== ""){
      names.push(this.parameter.fuelType)
    }
    if (this.parameter.route && this.parameter.route !== ""){
      names.push(this.parameter.route)
    }
    if (this.parameter.feedstock && this.parameter.feedstock !== ""){
      names.push(this.parameter.feedstock)
    }
    if (this.parameter.soil && this.parameter.soil !== ""){
      names.push(this.parameter.soil)
    }
    if (this.parameter.stratum && this.parameter.stratum !== ""){
      names.push(this.parameter.stratum)
    }
    if (this.parameter.landClearance && this.parameter.landClearance !== ""){
      names.push(this.parameter.landClearance)
    }
    _defaultValues.forEach((val: any) => {
      let deName = val.parameterName + " " + val.administrationLevel + " " + val.country.id;
      names.forEach(name => {
        let paraName = this.parameter.originalName + " " + name + " " + this.loggedUser.country.id
        if (paraName === deName){
          this.defaultValues.push(val)
        }
      })
    })
  }

  getHistoricalValues(){
    
  }

  async sendValueForVerification(_isEnterData: boolean) {
    console.log("clicked")
    if ((this.correctValue && this.correctUnit) || (this.selectedInstitution && this.correctUnit)
      || this.resultComment || (this.selectedDefault && this.correctUnit)) {
      if (this.type === 'parameter') {
        if (_isEnterData) {
          // enter direct value
          let body = new ChangeParameterValue()
          let para = new Parameter()
          para.id = this.parameter.id
          body.parameter = para
          body.isDataEntered = _isEnterData
          body.concern = this.verificationDetail?.explanation
          let user = new User()
            user.id = this.loggedUser.id
            body.user = user
          if (this.parameter.isDefault){
            // Manage default values\
            body.correctData = {
              defaultValue: this.selectedDefault,
              unit: this.correctUnit.ur_fromUnit
            }
            body.isDefault = true
            
          } else if (this.parameter.isHistorical){
            //Manage historical values
          } else {
            console.log("enter direct value", this.correctValue, this.correctUnit)
            console.log("selected parameter", this.parameter)
           
            body.correctData = {
              value: this.correctValue,
              unit: this.correctUnit.ur_fromUnit
            }
            
            console.log(body)
          }
          let res = await this.verificationControllerServiceProxy.changeParameterValue(body).toPromise()
          if (res.status === 'saved') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully sent to Data Collection Team',
              closable: true,
            });
            if (this.parameter.isDefault){
              this.dialogRef.close({ isEnterData: _isEnterData, value: this.selectedDefault.value + this.correctUnit.ur_fromUnit })
            } else {
              this.dialogRef.close({ isEnterData: _isEnterData, value: this.correctValue + this.correctUnit.ur_fromUnit })
            }
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
              detail: 'Successfully sent to Data Collection Team',
              closable: true,
            });
            this.dialogRef.close({ isEnterData: _isEnterData, value: this.selectedInstitution.name })
          }
          console.log(res)
        }
      } else if (this.type === 'ndc') {
        this.dialogRef.close({ result: { ndc: this.selectedNdc, subNdc: this.selectedSubNdc } })
      } else if (this.type === 'result') {
        this.dialogRef.close({ result: { comment: this.resultComment } })
      }
    }
  }

  checkEnable() {
    return (!this.correctValue && !this.correctUnit && this.selectedNdc === undefined && this.resultComment === undefined) ||
      (this.correctValue === undefined && this.correctUnit === undefined && !this.selectedNdc && this.resultComment === undefined)  ||
      (this.correctValue === undefined && this.correctUnit === undefined && this.selectedNdc === undefined && !this.resultComment)

  }

  getSubmitLabel(){
    // type === 'ndc' ? 'Send for verification' : (type === 'result' ? 'Send to QC' :
    //                  (isEnterData ? 'Send to QC' : 'Send to DC team'))

    if (this.type === 'ndc'){
      return 'Send for verification'
    } else {
      if (this.type === 'result') {
        return 'Send to QC'
      } else {
        if (this.isEnterData){
          if (this.parameter.isDefault || this.parameter.isHistorical){
            return 'Send to verifier'
          } else {
            return 'Send to DC team'
          }
        } else {
          return 'Send to DC team'
        }
      }
    }
  }

}

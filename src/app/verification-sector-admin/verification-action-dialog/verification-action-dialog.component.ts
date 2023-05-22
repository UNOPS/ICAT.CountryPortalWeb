import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangeParameterValue, Institution, InstitutionControllerServiceProxy, Parameter, UnitConversionControllerServiceProxy, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';

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

  constructor(
    public config: DynamicDialogConfig,
    private unitConversionControllerServiceProxy: UnitConversionControllerServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy,
    private verificationControllerServiceProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef
  ) { 
    console.log("config data--------", config.data)
    this.parameter = this.config.data['parameter'];
    this.verificationDetail = config.data['verificationDetail']
  }

  async ngOnInit(): Promise<void> {
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

  async sendValueForVerification(_isEnterData: boolean){
    console.log("clicked")
    if (_isEnterData){
      // enter direct value
      console.log("enter direct value", this.correctValue, this.correctUnit)
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
      let res = await this.verificationControllerServiceProxy.changeParameterValue(body).toPromise()
      if (res.status === 'saved') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Value changed successfully',
          closable: true,
        });
        this.dialogRef.close()
      }
      console.log(res)

    } else {
      // data collection path
    }
  }

}

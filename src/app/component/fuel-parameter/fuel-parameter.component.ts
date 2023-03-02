import { Component, Input, OnInit } from '@angular/core';
import ParameterSections from 'app/Model/parameter-sections';
import decode from 'jwt-decode';
import {
  Institution,
  InstitutionControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-fuel-parameter',
  templateUrl: './fuel-parameter.component.html',
  styleUrls: ['./fuel-parameter.component.css'],
})
export class FuelParameterComponent implements OnInit {
  @Input()
  parameterSection: ParameterSections;

  @Input()
  isDisableforSubmitButton: boolean;

  @Input()
  IsProposal: boolean;
  userCountryId = 0;
  userSectorId = 0;
  @Input()
  infos: any;

  @Input()
  isSubmitted: boolean;

  instiTutionList: Institution[];
  isHistoricalValue = false;
  checked: number[] = [];

  constructor(
    private serviceProxy: ServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    this.instituationProxy
      .getInstitutionforAssesment()
      .subscribe((res: any) => {
        this.instiTutionList = res;
      });
  }

  onSelectHistoricalVal(event: any, idxSec: any, idxPara: any) {
    this.parameterSection.fuelSection.sectionparameters[idxSec].parameters[
      idxPara
    ]['value'] = event.value.value;
  }

  onChangeIshistorical(e: any, i: number) {
    if (e.checked) {
      this.checked.push(i);
    } else {
      this.checked.splice(this.checked.indexOf(i), 1);
    }
  }

  changeUnit(e: any, idxSec: any, idxPara: any) {
    const values = this.parameterSection.fuelSection.sectionparameters[
      idxSec
    ].parameters[idxPara].historicalValues.filter(
      (val) =>
        val.unit ===
        this.parameterSection.fuelSection.sectionparameters[idxSec].parameters[
          idxPara
        ].UOM,
    );
    values.sort((a: any, b: any) => b.year - a.year);
    this.parameterSection.fuelSection.sectionparameters[idxSec].parameters[
      idxPara
    ].displayhisValues = values;
  }
}

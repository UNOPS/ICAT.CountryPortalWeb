import { Component, Input, OnInit } from '@angular/core';
import ParameterSections from 'app/Model/parameter-sections';
import decode from 'jwt-decode';
import {
  Institution,
  InstitutionControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-stratum-parameter',
  templateUrl: './stratum-parameter.component.html',
  styleUrls: ['./stratum-parameter.component.css'],
})
export class StratumParameterComponent implements OnInit {
  @Input() parameterSection: ParameterSections;
  @Input() isDisableforSubmitButton: boolean;
  @Input() IsProposal: boolean;
  @Input()
  infos: any;
  @Input()
  isSubmitted: boolean;

  userCountryId = 0;
  userSectorId = 0;

  instiTutionList: Institution[];
  isHistoricalValue = false;

  constructor(
    private instituationProxy: InstitutionControllerServiceProxy
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    this.instituationProxy
      .getInstitutionforAssessment()
      .subscribe((res: any) => {
        this.instiTutionList = res;
      });
  }

  onSelectHistoricalVal(event: any, idxSec: any, idxPara: any) {
    this.parameterSection.stratumSection.sectionparameters[idxSec].parameters[
      idxPara
    ]['value'] = event.value.value;
    this.parameterSection.stratumSection.sectionparameters[idxSec].parameters[
      idxPara
    ]['historicalParaID'] = event.value.id;
  }

  changeUnit(e: any, idxSec: any, idxPara: any) {
    const values = this.parameterSection.stratumSection.sectionparameters[
      idxSec
    ].parameters[idxPara].historicalValues.filter(
      (val) =>
        val.unit ===
        this.parameterSection.stratumSection.sectionparameters[idxSec]
          .parameters[idxPara].UOM,
    );
    values.sort((a: any, b: any) => b.year - a.year);
    this.parameterSection.stratumSection.sectionparameters[idxSec].parameters[
      idxPara
    ].displayhisValues = values;
  }
}

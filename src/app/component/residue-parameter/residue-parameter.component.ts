import { Component, Input, OnInit } from '@angular/core';
import ParameterSections from 'app/Model/parameter-sections';
import decode from 'jwt-decode';
import {
  Institution,
  InstitutionControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-residue-parameter',
  templateUrl: './residue-parameter.component.html',
  styleUrls: ['./residue-parameter.component.css'],
})
export class ResidueParameterComponent implements OnInit {
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

  constructor(private instituationProxy: InstitutionControllerServiceProxy) {}

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
    this.parameterSection.residueSection.sectionparameters[idxSec].parameters[
      idxPara
    ]['value'] = event.value.value;
  }

  changeUnit(e: any, idxSec: any, idxPara: any) {
    const values = this.parameterSection.residueSection.sectionparameters[
      idxSec
    ].parameters[idxPara].historicalValues.filter(
      (val) =>
        val.unit ===
        this.parameterSection.residueSection.sectionparameters[idxSec]
          .parameters[idxPara].UOM,
    );
    values.sort((a: any, b: any) => b.year - a.year);
    this.parameterSection.residueSection.sectionparameters[idxSec].parameters[
      idxPara
    ].displayhisValues = values;
  }
}

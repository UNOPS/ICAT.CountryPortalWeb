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
  isDisableforSubmitButton:boolean;

  @Input()
  IsProposal: boolean;
  userCountryId:number = 0;
  userSectorId:number = 0;

  instiTutionList: Institution[];

  constructor(
    private serviceProxy: ServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy
  ) {}

  ngOnInit(): void {
    console.log("fuel paramters", this.parameterSection)
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;


    this.instituationProxy
      .getInstitutionforAssesment()
      .subscribe((res: any) => {
        this.instiTutionList = res;
        //this.instiTutionList = this.instiTutionList.filter((o)=>o.country?.id == this.userCountryId);
      });
  }
}

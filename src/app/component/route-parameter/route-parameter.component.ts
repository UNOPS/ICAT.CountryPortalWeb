import { Component, Input, OnInit } from '@angular/core';
import ParameterSections from 'app/Model/parameter-sections';
import decode from 'jwt-decode';
import {
  Institution,
  InstitutionControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-route-parameter',
  templateUrl: './route-parameter.component.html',
  styleUrls: ['./route-parameter.component.css'],
})
export class RouteParameterComponent implements OnInit {
  @Input()
  parameterSection: ParameterSections;

  @Input()
  IsProposal: boolean;
  @Input()
  isDisableforSubmitButton:boolean;
  @Input()
  infos: any;
  @Input()
  isSubmitted: boolean
  
  instiTutionList: Institution[];
  isHistoricalValue: boolean = false;

  userCountryId:number = 0;
  userSectorId:number = 0;

  constructor(
    private serviceProxy: ServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;


    this.instituationProxy
      .getInstitutionforAssesment()
      .subscribe((res: any) => {
        this.instiTutionList = res;
       // this.instiTutionList = this.instiTutionList.filter((o)=>o.country?.id == this.userCountryId);
       
      });
  }

  onSelectHistoricalVal(event:any, idxSec:any, idxPara:any){
    console.log(event.value.value)
    this.parameterSection.routeSection.sectionparameters[idxSec].parameters[idxPara]["value"] = event.value.value
  }

  changeUnit(e: any, idxSec:any, idxPara:any ){
    console.log(e.value)
    let values = this.parameterSection.routeSection.sectionparameters[idxSec].parameters[idxPara].historicalValues.filter(
      (val) => val.unit === this.parameterSection.routeSection.sectionparameters[idxSec].parameters[idxPara].UOM
    )
    values.sort((a: any,b: any) => b.year - a.year);
    this.parameterSection.routeSection.sectionparameters[idxSec].parameters[idxPara].displayhisValues = values

  }

}

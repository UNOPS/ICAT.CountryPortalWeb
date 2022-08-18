import { Component, Input, OnInit } from '@angular/core';
import ParameterSections from 'app/Model/parameter-sections';
import decode from 'jwt-decode';
import {
  Institution,
  InstitutionControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-vehical-parameter',
  templateUrl: './vehical-parameter.component.html',
  styleUrls: ['./vehical-parameter.component.css'],
})
export class VehicalParameterComponent implements OnInit {
  @Input()
  parameterSection: ParameterSections;

  @Input()
  IsProposal: boolean;

  @Input()
  isDisableforSubmitButton:boolean;

  @Input()
  infos: any;

  userCountryId:number = 0;
  userSectorId:number = 0;

  instiTutionList: Institution[];
  isHistoricalValue: boolean = false;
  checked: number[] = [];

  constructor(
    private serviceProxy: ServiceProxy,
    private instituationProxy: InstitutionControllerServiceProxy
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;

    console.log("country id  ovindu...",this.userCountryId)
    this.instituationProxy
      .getInstitutionforAssesment()
      .subscribe((res: any) => {
        this.instiTutionList = res;

        // if(this.instiTutionList.length != 0 && this.userCountryId != 0)
        // {
        //   this.instiTutionList = this.instiTutionList.filter((o)=>o.country?.id == this.userCountryId);
        // }
        
       
        console.log("vehicle ins  ovindu...",this.instiTutionList)
      });
  }

  onSelectHistoricalVal(event:any, idxSec:any, idxPara:any){
    console.log(event.value.value)
    this.parameterSection.vehicalSection.sectionparameters[idxSec].parameters[idxPara]["value"] = event.value.value
  }

  onChangeIshistorical(e: any, i: number){
    if (e.checked){
      this.checked.push(i)
    } else {
      this.checked.splice(this.checked.indexOf(i), 1)
    }
  }
}
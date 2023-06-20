import { Component, Input, OnInit } from '@angular/core';
import ParameterSections from 'app/Model/parameter-sections';
import decode from 'jwt-decode';
import { Institution, InstitutionControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-feedstock-parameter',
  templateUrl: './feedstock-parameter.component.html',
  styleUrls: ['./feedstock-parameter.component.css']
})
export class FeedstockParameterComponent implements OnInit {
  @Input() parameterSection: ParameterSections;
  @Input() isDisableforSubmitButton:boolean;
  @Input() IsProposal: boolean;
  @Input()
  infos: any;
  @Input()
  isSubmitted: boolean
  
  userCountryId:number = 0;
  userSectorId:number = 0;

  instiTutionList: Institution[];
  isHistoricalValue: boolean = false;

  constructor(
    
    private instituationProxy: InstitutionControllerServiceProxy
  ) { }

  ngOnInit(): void {
    console.log("feedstock parameter", this.parameterSection, this.isDisableforSubmitButton, this.IsProposal)
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

  onSelectHistoricalVal(event:any, idxSec:any, idxPara:any){
    console.log(event.value.value)
    this.parameterSection.feedstockSection.sectionparameters[idxSec].parameters[idxPara]["value"] = event.value.value
    this.parameterSection.feedstockSection.sectionparameters[idxSec].parameters[idxPara]["historicalParaID"] = event.value.id
  }

  changeUnit(e: any, idxSec:any, idxPara:any ){
    console.log(e.value)
    let values = this.parameterSection.feedstockSection.sectionparameters[idxSec].parameters[idxPara].historicalValues.filter(
      (val) => val.unit === this.parameterSection.feedstockSection.sectionparameters[idxSec].parameters[idxPara].UOM
    )
    values.sort((a: any,b: any) => b.year - a.year);
    this.parameterSection.feedstockSection.sectionparameters[idxSec].parameters[idxPara].displayhisValues = values

  }

}

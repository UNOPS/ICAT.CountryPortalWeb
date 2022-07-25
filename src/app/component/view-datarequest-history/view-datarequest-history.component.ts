import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { datarequest } from 'app/managedatastatus/managedatastatus.component';
import { DataRequestStatus } from 'app/Model/DataRequestStatus.enum';
import { ParameterHistoryAction } from 'app/Model/ParameterHistoryAction.enum';
import { ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-view-datarequest-history',
  templateUrl: './view-datarequest-history.component.html',
  styleUrls: ['./view-datarequest-history.component.css']
})
export class ViewDatarequestHistoryComponent implements OnInit {

  ParameterHistoryActionEnum = ParameterHistoryAction;
  DataRequestStatusEnum = DataRequestStatus;

  // ParameterHistoryAction: string[] = [
  //   ParameterHistoryAction[ParameterHistoryAction.QC],
  //   ParameterHistoryAction[ParameterHistoryAction.DataRequest],
  //   ParameterHistoryAction[ParameterHistoryAction.AssignDataRequest],
  //   ParameterHistoryAction[ParameterHistoryAction.EnterData],
  //   ParameterHistoryAction[ParameterHistoryAction.ReviewData],
  //   ParameterHistoryAction[ParameterHistoryAction.ApproveData],
  //   ParameterHistoryAction[ParameterHistoryAction.AssignVerifier],
  //   ParameterHistoryAction[ParameterHistoryAction.Verifier],
  // ];

  @Input()
  parameterId: number;
  @Input()
  listOfHistory: any[] = [];
  flag:number;


  constructor(
    private router: Router,
    public serviceProxy: ServiceProxy
  ) 
  { }

  ngOnInit(): void {

  

    this.flag = 8888;
    console.log("this.flag..",this.flag)

   
    // lmFilter.push('LearningMaterial.isPublish||$eq||' + 1);

    


      

  }

}

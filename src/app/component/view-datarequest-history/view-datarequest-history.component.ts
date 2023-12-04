import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataRequestStatus } from 'app/Model/DataRequestStatus.enum';
import { ParameterHistoryAction } from 'app/Model/ParameterHistoryAction.enum';
import { ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-view-datarequest-history',
  templateUrl: './view-datarequest-history.component.html',
  styleUrls: ['./view-datarequest-history.component.css'],
})
export class ViewDatarequestHistoryComponent implements OnInit {
  ParameterHistoryActionEnum = ParameterHistoryAction;
  DataRequestStatusEnum = DataRequestStatus;

  @Input()
  parameterId: number;
  @Input()
  listOfHistory: any[] = [];
  flag: number;

  constructor(
    private router: Router,
    public serviceProxy: ServiceProxy
  ) { }

  ngOnInit(): void {
    this.flag = 8888;
  }
}

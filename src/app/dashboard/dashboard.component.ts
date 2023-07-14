import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  indtituteadmin = false;
  userType = 'countryAdmin';
  countryAdmin = false;
  data: any;
  activeprojects = ['vv', 'df', 'd', 'd'];
  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;
  chartOptions: any;
  searchBy: any = {
    text: null,
    sector: null,
    NDC: null,
    subNDC: null,
  };
  sectorList: string[] = [];
  subscription: Subscription;
  public i = 0;
  public id = 'chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items: any = [];
  data1: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
    }[];
  };
  constructor() {}

  ngOnInit(): void {}
}

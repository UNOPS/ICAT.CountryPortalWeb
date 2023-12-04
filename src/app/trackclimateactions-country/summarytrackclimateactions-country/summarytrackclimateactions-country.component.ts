import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  ServiceProxy,
  TrackcaEntity,
  TrackClimateControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-summarytrackclimateactions-country',
  templateUrl: './summarytrackclimateactions-country.component.html',
  styleUrls: ['./summarytrackclimateactions-country.component.css']
})
export class SummarytrackclimateactionsCountryComponent implements OnInit {

  activities: TrackcaEntity[] = [];
  totalRecords: any;
  rows: any;
  activeprojects: activeproject[] = [];
  finalRecords: activeproject[] = [];
  flagIds: any[] = [];
  records: TrackcaEntity[] = [];

  loading: boolean = false

  constructor(
    private serviceProxy: ServiceProxy,
    private router: Router,
    private activerouter: ActivatedRoute,
    private trckCAProxy: TrackClimateControllerServiceProxy,) { }

  ngOnInit(): void {
    this.loading = true
    this.trckCAProxy.getTrackClimateActionDetails()
      .subscribe((async res => {
        this.activities = res;

        if (this.activities != undefined) {
          this.flagIds = this.activities.map(x => x.flag)
        }

        this.flagIds = [...new Set(this.flagIds)];
        for await (let y of this.flagIds) {
          this.records = this.activities.filter((o) => o.flag == y);

          let record: activeproject = {
            Years: this.records[0].years,
            Sectors: "Transport",
            GeneratedDate: moment(this.records[0].createdOn).format('YYYY-MM-DD HH:mm:ss'),
            ActualEmissionReduction: 0,
            ExpectedEmissionReduction: 0,
            flag: y,
          };

          for await (let x of this.records) {
            record.ActualEmissionReduction = record.ActualEmissionReduction + x.achieved;
            record.ExpectedEmissionReduction = record.ExpectedEmissionReduction + x.expected;
          }

          this.finalRecords.push(record);

        }

        this.loading = false
      }))

  }
  generate() {
    this.router.navigate(['/track-ca-country'])
  }

  sendDetails(finalRecords: any) {
    this.router.navigate(['/track-ca-country'], {
      queryParams: { flag: finalRecords.flag },
    });
  }
}

export interface activeproject {
  Years: string;
  Sectors: string;
  GeneratedDate: string;
  ActualEmissionReduction: number;
  ExpectedEmissionReduction: number;
  flag: number;
}

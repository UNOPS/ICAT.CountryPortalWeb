import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  ServiceProxy,
  TrackcaEntity,
  TrackClimateControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-summarytrackclimateactions',
  templateUrl: './summarytrackclimateactions.component.html',
  styleUrls: ['./summarytrackclimateactions.component.css'],
})
export class SummarytrackclimateactionsComponent implements OnInit {
  activities: TrackcaEntity[] = [];
  totalRecords: any;
  rows: any;
  activeprojects: activeproject[] = [];
  finalRecords: activeproject[] = [];
  flagIds: any[] = [];
  records: TrackcaEntity[] = [];
  constructor(
    private serviceProxy: ServiceProxy,
    private router: Router,
    private activerouter: ActivatedRoute,
    private trckCAProxy: TrackClimateControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    this.serviceProxy
      .getManyBaseTrackClimateControllerTrackcaEntity(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.activities = res.data;

        if (this.activities != undefined) {
          for (const x of this.activities) {
            this.flagIds.push(x.flag);
          }
        }

        setTimeout(() => {
          this.flagIds = [...new Set(this.flagIds)];

          for (const y of this.flagIds) {
            this.records = this.activities.filter((o) => o.flag == y);

            const record: activeproject = {
              Years: this.records[0].years,
              Sectors: 'Transport',
              GeneratedDate: moment(this.records[0].createdOn).format(
                'YYYY-MM-DD HH:mm:ss',
              ),
              ActualEmissionReduction: 0,
              ExpectedEmissionReduction: 0,
              flag: y,
            };

            for (const x of this.records) {
              record.ActualEmissionReduction =
                record.ActualEmissionReduction + x.achieved;
              record.ExpectedEmissionReduction =
                record.ExpectedEmissionReduction + x.expected;
            }

            this.finalRecords.push(record);
          }
        }, 1000);
      });
  }
  generate() {
    this.router.navigate(['/track-ca-country']);
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

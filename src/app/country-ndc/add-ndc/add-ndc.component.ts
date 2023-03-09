import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  Country,
  Ndc,
  Sector,
  ServiceProxy,
  SubNdc,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-add-ndc',
  templateUrl: './add-ndc.component.html',
  styleUrls: ['./add-ndc.component.css'],
})
export class AddNdcComponent implements OnInit {
  subndc: any;
  subndcs: SubNdc[] = [];
  subndcval: any;
  values: { testvalue: any }[];
  rowIndex = 0;
  ndc: any;
  sector: Sector = new Sector();
  latestndcId: number;
  countryId: any;
  sectorId: any;
  data1: any;
  newndc: Ndc;
  ndcsetid: any;
  selectedtypeId: any;
  confirm4 = false;
  confirm3 = false;

  constructor(
    private router: Router,
    private serviceproxy: ServiceProxy,
    private activerouter: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  confirm2 = false;
  subNdc: any;
  data: any;
  country: Country;
  ngOnInit(): void {
    this.newndc = new Ndc();

    this.activerouter.queryParams.subscribe((params) => {
      this.countryId = params['countryId'];
      this.sectorId = params['sectorId'];
      this.ndcsetid = params['ndcsetid'];

      this.selectedtypeId = params['ndcsetid'];
    });

    this.serviceproxy
      .getOneBaseCountryControllerCountry(
        this.countryId,
        undefined,
        undefined,
        undefined,
      )
      .subscribe((res) => {
        this.country = res;
      });

    this.serviceproxy
      .getOneBaseSectorControllerSector(
        this.sectorId,
        undefined,
        undefined,
        undefined,
      )
      .subscribe((res) => {
        this.sector = res;
      });

    this.values = [{ testvalue: "this.data.find('name')" }];
  }
  saveNDCs() {
    this.confirm2 = true;
  }

  Back() {
    this.router
      .navigate(['/ndc'], {
        queryParams: { selectedtypeId: this.selectedtypeId },
      })
      .then(() => {});
  }
  save() {
    this.confirm2 = true;
    if (this.ndc != null || this.ndc != undefined) {
      this.serviceproxy
        .getOneBaseNdcSetControllerNdcSet(
          this.ndcsetid,
          undefined,
          undefined,
          undefined,
        )
        .subscribe((res) => {
          this.newndc.name = this.ndc;
          this.newndc.set = res;
          this.newndc.editedOn = moment();
          this.newndc.sortOrder = 1;
          this.newndc.createdOn = moment();
          this.newndc.description = 'test';
          this.newndc.country = this.country;
          this.newndc.sector = this.sector;
          this.newndc.subNdc = this.subndcs;

          this.serviceproxy
            .createOneBaseNdcControllerNdc(this.newndc)
            .subscribe(
              (res) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Aggregated Actions  has saved successfully ',
                  closable: true,
                });
                for (const s of this.subndcs) {
                  s.ndc = res;

                  this.serviceproxy
                    .createOneBaseSubNdcControllerSubNdc(s)
                    .subscribe(
                      (res) => {},

                      (err) => {
                        this.messageService.add({
                          severity: 'error',
                          summary: 'Error.',
                          detail:
                            'Internal server error,Problem occured while saving subNDC.',
                          sticky: true,
                        });
                      },
                    );
                }
              },

              (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error.',
                  detail: 'Internal server error, please try again.',
                  sticky: true,
                });
              },
            );
          setTimeout(() => {
            this.Back();
          }, 1000);
        });
      this.confirm3 = true;
    } else {
      this.confirm4 = true;
    }
  }
  addnewsub() {
    const sub = new SubNdc();
    sub.description = 'des';
    sub.createdOn = moment();
    this.subndcs.push(sub);

    this.values.push({ testvalue: 'FS1201' });

    this.rowIndex = this.rowIndex + 1;
  }
  sub(event: any) {}
  OnInput(event: any) {}

  removesub() {
    this.subndcs.splice(-1);
  }
  test() {
    window.location.reload();
  }
}

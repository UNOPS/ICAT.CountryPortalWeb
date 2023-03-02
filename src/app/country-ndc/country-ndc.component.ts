import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import decode from 'jwt-decode';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Country,
  EmissionReductioDraftDataEntity,
  Ndc,
  NdcSet,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-country-ndc',
  templateUrl: './country-ndc.component.html',
  styleUrls: ['./country-ndc.component.css'],
  providers: [MessageService],
})
export class CountryNdcComponent implements OnInit {
  xy = true;
  flights: any;
  value7: any;
  cities: any;
  data1: Ndc = new Ndc();
  data: Ndc[];
  defoultNDC = false;
  addNDC = false;
  ndcsector = false;
  name: any;
  des: any;
  id: any;
  dec: any;
  newndc: any;
  span: HTMLElement;
  editndc = false;
  tbdata: any;
  test: any;
  setno: any;
  display = false;
  check: any;
  selectedValues: string[] = [];
  activendcdialog = false;
  active = true;
  confirm1 = false;
  confirm2 = false;
  countryId: any;
  sectorId: any = 1;
  set: any;
  ndcsetDto: NdcSet = new NdcSet();
  country: Country;
  selectedtype: NdcSet = new NdcSet();
  value: any;
  latestset: NdcSet = new NdcSet();
  sector: Sector;
  selectedndc = true;
  count: any;
  isChangeAssignData = true;
  selectedndcIdsArry: any = [];
  checkboxdis = false;
  submitdate: any;
  confirm3 = false;
  confirm4 = false;
  display1 = false;
  display2 = false;
  year = '';
  baEmission = 0;
  unCEmission = 0;
  CEmission = 0;
  targetYear = '';
  targetYearEmission = 0;
  display3 = false;
  display4 = false;

  yrList: number[] = [];
  yrListGraph: string[] = [];
  postYrList: number[] = [];
  postresaultList: number[] = [];
  postIdLisst: number[] = [];

  unconditionalValue: number;
  conditionalValue: number;
  isNewNDAC = true;

  totalRecords: number;
  rows = 10;
  emissionReduction: EmissionReductioDraftDataEntity =
    new EmissionReductioDraftDataEntity();

  lineStylesData: any;
  basicOptions: any;

  constructor(
    private messageService: MessageService,
    private serviceproxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activerouter: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    this.countryId = tokenPayload.countryId;
    if (tokenPayload.sectorId) {
      this.sectorId = tokenPayload.sectorId;
    }

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

    const mngNdcFilter: string[] = [];
    mngNdcFilter.push('country.id||$eq||' + this.countryId);
    mngNdcFilter.push('sector.id||$eq||' + this.sectorId);

    this.serviceproxy
      .getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
        undefined,
        undefined,
        mngNdcFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        if (res.data.length == 0) {
          this.isNewNDAC = true;
          this.emissionReduction.sector = this.sector;
          this.emissionReduction.country = this.country;
        } else {
          this.isNewNDAC = false;

          this.emissionReduction = res.data[0];

          this.targetYear = this.emissionReduction.targetYear;

          this.CEmission = this.emissionReduction.conditionaltco2;
          this.unCEmission = this.emissionReduction.unconditionaltco2;
          this.baEmission = this.emissionReduction.baseYearEmission;
          this.year = this.emissionReduction.baseYear;
          this.targetYearEmission = this.emissionReduction.targetYearEmission;
        }
      });

    this.lineStylesData = {
      labels: this.yrList,

      datasets: [
        {
          label: 'Actual',
          data: this.postYrList,
          fill: false,
          borderColor: '#533440',
          tension: 0.4,
        },
        {
          label: 'NDC-Conditional',
          data: [
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.conditionalValue,
            this.conditionalValue,
            this.conditionalValue,
            this.conditionalValue,
            this.conditionalValue,
          ],
          fill: true,
          borderColor: '#81B622',
          tension: 0.4,
          backgroundColor: '#81B622',
        },
        {
          label: 'NDC-Unconditional',
          data: [
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.unconditionalValue,
            this.unconditionalValue,
            this.unconditionalValue,
            this.unconditionalValue,
            this.unconditionalValue,
          ],
          fill: true,
          tension: 0.4,
          borderColor: '#FFDB58',
          backgroundColor: '#FFDB58',
        },
        {
          label: 'BAU',
          data: [
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.baseYearEmission,
            this.emissionReduction.targetYearEmission,
            this.emissionReduction.targetYearEmission,
            this.emissionReduction.targetYearEmission,
            this.emissionReduction.targetYearEmission,
            this.emissionReduction.targetYearEmission,
          ],
          fill: true,
          tension: 0.4,
          borderColor: '#FFA726',
          backgroundColor: '#FFA726',
        },
      ],
    };

    if (!this.ndcsector) {
      this.defoultNDC = true;
    }
    const filter: string[] = [];
    filter.push('country.id||$eq||' + this.countryId);
    filter.push('sector.id||$eq||' + this.sectorId);
    const ndcFilter: string[] = [];
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.name||$eq||' + this.selectedtype.name);

    const countryFilter: string[] = [];
    countryFilter.push('country.id||$eq||' + this.countryId);

    this.serviceproxy
      .getManyBaseNdcSetControllerNdcSet(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ['id,DESC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.selectedtype = res.data[0];
        const ndcFilter: string[] = [];
        ndcFilter.push('country.id||$eq||' + this.countryId);
        ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
        ndcFilter.push('sector.id||$eq||' + this.sectorId);

        this.serviceproxy
          .getManyBaseNdcControllerNdc(
            undefined,
            undefined,
            ndcFilter,
            undefined,
            undefined,
            undefined,
            this.rows,
            0,
            1,
            0,
          )
          .subscribe((res: any) => {
            this.id = res.data[0]?.id;
            this.dec = res.data[0]?.dec;
            this.name = res.data[0]?.name;
            this.test = 'Transport';
            this.data = res.data;
            this.totalRecords = res.total;
          });
      });

    this.serviceproxy
      .getManyBaseNdcSetControllerNdcSet(
        undefined,
        undefined,
        countryFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.setno = res.data;
      });

    this.newndc = [{ one: ' ' }, { one: ' ' }];

    this.value = this.selectedtype;
  }

  addNewNDC() {
    this.defoultNDC = false;
    this.ndcsector = true;
    this.router.navigate(['/addndc'], {
      queryParams: {
        countryId: this.countryId,
        sectorId: this.sectorId,
        ndcsetid: this.selectedtype.id,
      },
    });
  }

  addNew() {
    const el = document.createElement(
      '<input type="text" class="p-inputtext" pInputText placeholder="NDC name" style = "width:100%"/>',
    );
    this.newndc.push(el);
  }
  selectset(r: any) {}

  selectSector(sector: any) {
    this.addNDC = true;
  }

  addsub() {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <br>
      <label style="color: blue">Name of the Sub NDC</label><br>
      <input type="text" class="p-inputtext" pInputText  placeholder="Sub nDC Name" style = "width:100%"/><br><br>`;
    window.document.querySelector('.showInputField')!.appendChild(row);
  }
  checkbox(ndcid: any, isselect: any) {
    if (isselect == 'check') {
      this.selectedndcIdsArry.push(ndcid);
    } else {
      this.selectedndcIdsArry.pop(ndcid);
    }

    if (this.selectedndcIdsArry.length != 0) this.selectedndc = false;
    else this.selectedndc = true;
  }

  editSubNDC(ndcid: any, ndcname: any) {
    this.router.navigate(['/editndc'], {
      queryParams: { ndcname: ndcname, ndcid: ndcid },
    });
  }

  Back() {
    this.defoultNDC = true;
    this.ndcsector = false;
    this.addNDC = false;
    this.editndc = false;
  }

  showDialog() {
    this.display = true;
  }

  activate() {
    this.confirmationService.confirm({
      message:
        'Please confirm you want to activate selected aggregated action. You can not modify aggregated action after activation.',
      accept: () => {
        this.active = true;
        this.selectedndc = true;
        for (const ndcid of this.selectedndcIdsArry) {
          this.serviceproxy
            .getOneBaseNdcControllerNdc(ndcid, undefined, undefined, undefined)
            .subscribe((res) => {
              res.status = 1;
              this.serviceproxy
                .updateOneBaseNdcControllerNdc(ndcid, res)
                .subscribe(
                  (res) => {
                    this.serviceproxy
                      .getManyBaseSubNdcControllerSubNdc(
                        undefined,
                        undefined,
                        ['ndc.id||$eq||' + ndcid],
                        undefined,
                        undefined,
                        undefined,
                        1000,
                        0,
                        0,
                        0,
                      )
                      .subscribe((res) => {
                        for (const sub of res.data) {
                          sub.status = 1;
                          this.serviceproxy
                            .updateOneBaseSubNdcControllerSubNdc(sub.id, sub)
                            .subscribe(
                              (res) => {},
                              (err) => {
                                this.messageService.add({
                                  severity: 'error',
                                  summary: 'Error in Updating SubNDC!!',
                                  detail: err,
                                });
                              },
                            );
                        }
                      });
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Activated',
                      detail:
                        'Selected Aggregated Actions set Activated  successfully.',
                    });
                  },
                  (err) => {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error in Updating!!',
                      detail: err,
                    });
                  },
                );
            });
        }
      },
    });
  }

  onRowEditInit(rowData: any) {}
  onRowEditCancel(rowData: any) {}

  ActivateNDCs() {
    this.activendcdialog = true;
  }

  saveNDCs() {
    this.defoultNDC = false;
    this.ndcsector = true;
  }
  saveSetofNDcs() {
    this.ndcsetDto.country = this.country;
    this.ndcsetDto.name = this.set;
    const dateObj = new Date(this.submitdate);
    const momentObj = moment(dateObj);
    this.ndcsetDto.submissionDate = momentObj;
    this.confirm2 = true;

    if (this.ndcsetDto.name != null || this.submitdate != null) {
      this.serviceproxy
        .createOneBaseNdcSetControllerNdcSet(this.ndcsetDto)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Saved',
              detail: ' Aggregated Actions set saved  successfully.',
            });

            this.set = ' ';
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error in Saving!!',
              detail: err,
            });
          },
        );
    } else {
      this.confirm4 = true;
    }
  }

  saveTargets() {
    this.display2 = true;

    this.year = this.emissionReduction.baseYear;
    this.baEmission = this.emissionReduction.baseYearEmission;
    this.targetYear = this.emissionReduction.targetYear;
    this.targetYearEmission = this.emissionReduction.targetYearEmission;
    this.unCEmission = this.emissionReduction.unconditionaltco2;
    this.CEmission = this.emissionReduction.conditionaltco2;

    if (
      !this.year ||
      this.year.length == 0 ||
      this.year == ' ' ||
      !/^-?\d+$/.test(this.year) ||
      !this.baEmission ||
      !this.targetYear ||
      this.targetYear.length == 0 ||
      this.targetYear == ' ' ||
      !/^-?\d+$/.test(this.targetYear)
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error in Saving!!',
      });
    } else if (this.year.length != 4 || this.targetYear.length != 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error in Saving!!',
        detail: 'year sould have 4 digits',
      });
    } else {
      if (!this.isNewNDAC) {
        this.serviceproxy
          .updateOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
            this.emissionReduction.id,
            this.emissionReduction,
          )
          .subscribe((res) => {
            if (res == null) {
              this.display3 = true;
            }

            if (res != undefined && res != null) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'successfully updated.',
                closable: true,
              });

              this.display1 = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error in updating!!',
              });
            }
          });
      } else {
        this.serviceproxy
          .createOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
            this.emissionReduction,
          )
          .subscribe((res) => {
            if (res == null) {
              this.display3 = true;
            }

            if (res != undefined && res != null) {
              this.emissionReduction = res;
              this.messageService.add({
                severity: 'success',
                summary: 'Succesfully Saved!!',
              });
              this.isNewNDAC = false;
              this.display1 = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error in Saving!!',
              });
            }
          });
      }
    }
  }

  onSetChange(event: any) {
    this.rows = 10;
    const ndcFilter: string[] = [];
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
    ndcFilter.push('sector.id||$eq||' + this.sectorId);

    this.serviceproxy
      .getManyBaseNdcControllerNdc(
        undefined,
        undefined,
        ndcFilter,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        1,
        0,
      )
      .subscribe((res: any) => {
        this.id = res.data[0]?.id;
        this.dec = res.data[0]?.dec;
        this.name = res.data[0]?.name;
        this.test = 'Transport';
        this.data = res.data;
        this.totalRecords = res.total;
      });
  }

  loadGridData(event: any) {
    this.rows = 10;
    const ndcFilter: string[] = [];
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
    ndcFilter.push('sector.id||$eq||' + this.sectorId);

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    this.serviceproxy
      .getManyBaseNdcControllerNdc(
        undefined,
        undefined,
        ndcFilter,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        pageNumber,
        0,
      )
      .subscribe((res: any) => {
        this.id = res.data[0]?.id;
        this.dec = res.data[0]?.dec;
        this.name = res.data[0]?.name;
        this.test = 'Transport';
        this.data = res.data;
        this.totalRecords = res.total;
      });
  }
  addndc() {}
  close() {
    window.location.reload();
  }

  close1() {}

  targets() {
    this.display1 = true;
  }
  closeDialog() {}
}

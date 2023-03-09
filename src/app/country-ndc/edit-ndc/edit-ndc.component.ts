import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

import {
  Ndc,
  ProjectControllerServiceProxy,
  ServiceProxy,
  SubNdc,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-ndc',
  templateUrl: './edit-ndc.component.html',
  styleUrls: ['./edit-ndc.component.css'],
})
export class EditNdcComponent implements OnInit {
  ndcname: any;
  ndceditname = false;
  ndcid: any;
  data: SubNdc[] = [];
  visibility2 = false;
  visibility3 = false;
  visibility5 = false;

  subndcname: any;
  subndc: any;
  subndcs: string[];
  subndcs1: SubNdc[];
  Deactivate = 'Delete';
  visibility1 = false;
  hasProject = false;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private activateroute: ActivatedRoute,
    private serviceproxy: ServiceProxy,
    private projectproxy: ProjectControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    this.activateroute.queryParams.subscribe((params) => {
      this.ndcname = params['ndcname'];
      this.ndcid = params['ndcid'];
    });

    const filter: string[] = [];
    filter.push('ndc.id||$eq||' + this.ndcid);
    this.serviceproxy
      .getManyBaseSubNdcControllerSubNdc(
        undefined,
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.data = res.data;
      });

    this.serviceproxy
      .getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined)
      .subscribe((res) => {
        this.projectproxy
          .getProjectsForCountrySectorInstitution(0, 0, 0, [], this.ndcid, 0)
          .subscribe((res) => {
            this.hasProject = res.meta.totalItems > 0 ? true : false;
          });
        if (res.status == 1) {
          this.Deactivate = 'Deactivate';
          this.ndceditname = true;
        }
      });
  }

  async save() {
    const ndc = new Ndc();
    ndc.name = this.ndcname;
    ndc.subNdc = this.data;
    this.serviceproxy
      .updateOneBaseNdcControllerNdc(this.ndcid, ndc)
      .subscribe((res) => {});
    this.data.forEach(async (sub) => {
      sub.ndc.id = this.ndcid;

      if (sub.id != undefined) {
        const result = await this.serviceproxy
          .updateOneBaseSubNdcControllerSubNdc(sub.id, sub)
          .toPromise();
      } else {
        const result = await this.serviceproxy
          .createOneBaseSubNdcControllerSubNdc(sub)
          .toPromise();

        sub.id = result.id;
      }
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail: `${this.ndcname} Aggregated Actions updated successfully`,
    });
  }

  Back() {
    this.serviceproxy
      .getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined)
      .subscribe((res) => {
        this.router.navigate(['/ndc'], {
          queryParams: { selectedtypeId: res.set.id },
        });
      });
  }
  addsub() {
    const ndc = new SubNdc();
    this.data.push(ndc);
  }

  confirmDelet() {
    this.Deactivate = 'deactivate';
    this.confirmationService.confirm({
      message: `Are you sure that you want to ${this.Deactivate} this aggregated action?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletendc();
      },
      reject: (type: ConfirmEventType) => {},
    });
  }
  deletendc() {
    let ndc = new Ndc();

    this.serviceproxy
      .getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined)
      .subscribe(async (res) => {
        if (res.status != 1) {
          ndc = res;
          if (res.subNdc.length != 0) {
            for await (const d of this.data) {
              this.serviceproxy
                .deleteOneBaseSubNdcControllerSubNdc(d.id)
                .subscribe(
                  (res) => {
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Confirmed',
                      detail: `successfully deleted subNDC ${d.name} `,
                    });
                  },
                  (err) => {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'try again',
                      detail: `erro deleted subNDC ${d.name} `,
                    });
                  },
                );
            }

            this.serviceproxy
              .deleteOneBaseNdcControllerNdc(this.ndcid)
              .subscribe(
                (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: `successfully deleted Aggregated Action ${ndc.name} `,
                  });
                },
                (err) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'try again',
                    detail: `erro deleted Aggregated Action ${ndc.name} `,
                  });
                },
              );
          } else {
            this.serviceproxy
              .deleteOneBaseNdcControllerNdc(this.ndcid)
              .subscribe(
                (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: `successfully deleted Aggregated Action ${ndc.name} `,
                  });
                },
                (err) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'try again',
                    detail: `erro deleted Aggregated Action ${ndc.name} `,
                  });
                },
              );
          }
          this.router.navigate(['/ndc']);
        } else {
          this.Deactivate = 'Deactivate';
          this.serviceproxy
            .getOneBaseNdcControllerNdc(
              this.ndcid,
              undefined,
              undefined,
              undefined,
            )
            .subscribe(
              (res) => {
                res.status = 0;
                this.serviceproxy
                  .updateOneBaseNdcControllerNdc(this.ndcid, res)
                  .subscribe((res) => {
                    this.serviceproxy
                      .getManyBaseSubNdcControllerSubNdc(
                        undefined,
                        undefined,
                        ['ndc.id||$eq||' + this.ndcid],
                        undefined,
                        undefined,
                        undefined,
                        1000,
                        0,
                        0,
                        0,
                      )
                      .subscribe(
                        (res) => {
                          for (const sub of res.data) {
                            sub.status = 0;
                            this.serviceproxy
                              .updateOneBaseSubNdcControllerSubNdc(sub.id, sub)
                              .subscribe(
                                (res) => {},
                                (err) => {
                                  this.messageService.add({
                                    severity: 'error',
                                    summary: 'try again',
                                    detail: 'erro in deactivated',
                                  });
                                },
                              );
                          }
                        },
                        (err) => {
                          this.messageService.add({
                            severity: 'error',
                            summary: 'try again',
                            detail: 'erro in deactivated',
                          });
                        },
                      );

                    this.Deactivate = 'Delete';
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Deactivated',
                      detail: `${res.name} successfully deactivated `,
                    });
                  });
              },
              (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Confirmed',
                  detail: 'erro in deactivated',
                });
              },
            );
        }
      });
  }
  confirmsubDelet() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Action Areas?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletesub();
      },
      reject: (type: ConfirmEventType) => {},
    });
  }

  deletesub() {
    this.serviceproxy
      .deleteOneBaseSubNdcControllerSubNdc(this.data[this.data.length - 1].id)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'successfully deletd ',
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'erro in delete',
          });
        },
      );

    this.data.splice(-1);
  }

  test() {
    this.router.navigate(['/ndc']).then(() => {
      window.location.reload();
    });
  }
}

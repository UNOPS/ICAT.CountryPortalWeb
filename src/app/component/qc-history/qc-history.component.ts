import { Component, Input, OnInit } from '@angular/core';
import Parameter from 'app/Model/parameter';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ParameterControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-qc-history',
  templateUrl: './qc-history.component.html',
  styleUrls: ['./qc-history.component.css'],
})
export class QcHistoryComponent implements OnInit {
  parameter: any;
  parameters: any[] = [];
  constructor(
    public config: DynamicDialogConfig,
    private paramterProxy: ParameterControllerServiceProxy
  ) {
    this.parameter = this.config.data;
  }

  ngOnInit(): void {
    console.log("this.parameter.name..",this.parameter.name);
    this.paramterProxy
      .getParameterHistoryForQA(this.parameter.name)
      .subscribe((res) => {
        this.parameters = res;
        console.log("this.parameter.name....",this.parameters);
      });
  }
}

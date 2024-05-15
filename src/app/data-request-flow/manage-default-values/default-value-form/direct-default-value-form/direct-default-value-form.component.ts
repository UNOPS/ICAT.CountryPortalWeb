import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import decode from 'jwt-decode';
import { DefaultValue, DefaultValueControllerServiceProxy, DefaultValueDtos, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-direct-default-value-form',
  templateUrl: './direct-default-value-form.component.html',
  styleUrls: ['./direct-default-value-form.component.css']
})
export class DirectDefaultValueFormComponent implements OnInit {

  parentParametersList: any[] = [];
  parentParameter: any;
  userCountry: string;
  userCountryId: number;
  value:number;
  Years: any[] = [];
  selectedYears: any;
  institution: any;
  uniqName: any[] = [];
  countryObj: any;
  paraYear: any[] = [];
  sendDefaultValueDtos= new DefaultValueDtos();

  constructor(
    private serviceProxy: ServiceProxy,
    // private cdr: ChangeDetectorRef,
    private defaultProxy: DefaultValueControllerServiceProxy,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;

    this.serviceProxy
    .getOneBaseCountryControllerCountry(
      this.userCountryId,
      undefined,
      undefined,
      undefined,
    )
    .subscribe((res) => {
      this.countryObj = res;
      this.userCountry = this.countryObj.name;
    });

  for (let x = 2000; x <= 2050; x++) {
    if (!this.paraYear.includes(x)) {
      this.Years.push(x);
    }
  }

    const filter2: string[] = [];
    filter2.push('parentId||$isnull||' + 'true') &
      filter2.push('isMac||$isnull||' + 'true');
    this.serviceProxy
      .getManyBaseDefaultValueControllerDefaultValue(
        undefined,
        undefined,
        filter2,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((a: any) => {
        const List: DefaultValue[] = a.data;
        List.forEach((a) => {
          const name = a.parameterName + ' - ' + a.administrationLevel;
          if (!this.uniqName.includes(name)) {
            a.parameterName = name;
            this.uniqName.push(name);
            this.parentParametersList.push(a);
          }
        });
      });
  }

  saveForm(formData: NgForm) {

    if (formData.valid) {
      const name = this.parentParameter.parameterName;
      this.sendDefaultValueDtos.parameterName = name.split(' - ', 1)[0];
      this.sendDefaultValueDtos.parentId = this.parentParameter.id;
      this.sendDefaultValueDtos.administrationLevel = name.split(' - ', 2)[1];
      this.sendDefaultValueDtos.source = this.institution;
      this.sendDefaultValueDtos.year = this.selectedYears;
      this.sendDefaultValueDtos.country = this.countryObj;
      this.sendDefaultValueDtos.value =this.value;

      this.defaultProxy
        .sendDefaultValue(this.sendDefaultValueDtos)
        .subscribe((a) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Default value added successfully ',
            closable: true,
          });
        });
      setTimeout(() => {
        this.onBackClick();
      }, 1);
    }
   

  }

  getSelectedParentParameter() {
    const filter: string[] = [];
    filter.push(
      'parameterName||$eq||' +
        this.parentParameter.parameterName.split(' - ', 1)[0],
    );
    filter.push(
      'administrationLevel||$eq||' + this.parentParameter.administrationLevel,
    );
    this.serviceProxy
      .getManyBaseDefaultValueControllerDefaultValue(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        res.data.forEach((a) => {
          if (a.value != null || a.value != undefined) {
            this.paraYear.push(a.year);
            const index = this.Years.indexOf(a.year);
            if (index > -1) {
              this.Years.splice(index, 1);
            }
          }
        });
      });
  }


  onBackClick() {
    this.router.navigate(['/app-manage-default-values']);
  }

}

import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DefaultValue, DefaultValueControllerServiceProxy, DefaultValueDtos, Institution, ServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-default-value-form',
  templateUrl: './default-value-form.component.html',
  styleUrls: ['./default-value-form.component.css']
})
export class DefaultValueFormComponent implements OnInit,AfterViewInit {
  Years:any[] = []
  paraYear:any[]=[];
  parentParametersList:any[] = [];
  uniqName:any[] = [];
  parentParameter:any;
  parameterName:string;
  adminLevel:string
  instiTutionList:Institution[] = [];
  institution:any;
  selectedYears:any;
  deadLine:Date;
  userCountry:string;
  userCountryId :number;
  countryObj:any;
  Date =new Date()


  sendDefaultValueDtos : any = new DefaultValueDtos();
  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private defaultProxy: DefaultValueControllerServiceProxy,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;

    this.serviceProxy
    .getOneBaseCountryControllerCountry(
      this.userCountryId ,
      undefined,
      undefined,
      undefined
    )
    .subscribe((res) => {
      console.log('coou', res);
      this.countryObj = res;
      this.userCountry = this.countryObj.name;
    });

    for(let x = 2000; x<= 2050;x++)
    {
      console.log
      if(!this.paraYear.includes(x)){
        this.Years.push(x)
      }
       
    }

    //this.filter2.push('mrvInstitution||$notnull||'+'')
    let filter2: string[] = new Array();
    filter2.push('parentId||$isnull||'+'true')&
    filter2.push('isMac||$isnull||'+'true');
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
        0
      )
      .subscribe((a: any) => {
        let List:DefaultValue[] = a.data;
        List.forEach((a)=>{
          let name=a.parameterName+ " - "+ a.administrationLevel;
          if(!this.uniqName.includes(name)){
            a.parameterName=name
            this.uniqName.push(name);
            this.parentParametersList.push(a);
            
          }
          
        })
//parentId
         console.log('this.parentParametersList..', this.parentParametersList);
      });




      let filterIns: string[] = new Array();
    filterIns.push('type.id||$eq||' +3)
    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        filterIns,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.instiTutionList = res.data;
        this.instiTutionList = this.instiTutionList.filter((o)=>o.country.id == this.userCountryId);
        console.log('my institutions', res.data);
      });

  }

  getSelectedParentParameter()
  {
    let filter: string[] = new Array();
        filter.push('parameterName||$eq||' + this.parentParameter.parameterName.split(" - ",1)[0]);
        filter.push('administrationLevel||$eq||' + this.parentParameter.administrationLevel);
        this.serviceProxy.getManyBaseDefaultValueControllerDefaultValue(
          undefined,
          undefined,
          filter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        ).subscribe((res)=>{
          console.log("res",res)
          res.data.forEach((a)=>{
            if(a.value!=null || a.value!=undefined){
              this.paraYear.push(a.year);
              const index = this.Years.indexOf(a.year);
              if (index > -1) { // only splice array when item is found
                this.Years.splice(index, 1); // 2nd parameter means remove one item only
              }
            }
          })
        })
    console.log('this.parameter..', this.parentParameter);
  }

  onBackClick() {
    this.router.navigate(['/app-manage-default-values']);
  }


  saveForm(formData: NgForm) {
    console.log("hii")
    
    

      if (formData.valid) {

        
        let name=this.parentParameter.parameterName;
        console.log("++++++++++",name)
        this.sendDefaultValueDtos.parameterName = name.split(" - ",1)[0];
        this.sendDefaultValueDtos.parentId = this.parentParameter.id;
        this.sendDefaultValueDtos.administrationLevel =name.split(" - ",2)[1];;
        this.sendDefaultValueDtos.source = this.institution;
        this.sendDefaultValueDtos.deadLine = this.deadLine;
        this.sendDefaultValueDtos.year = this.selectedYears;
        this.sendDefaultValueDtos.country = this.countryObj;
        this.sendDefaultValueDtos.unit= this.parentParameter.unit;

        console.log("this.sendDefaultValueDtos.year..",this.sendDefaultValueDtos)
        let filter: string[] = new Array();
        filter.push('parameterName||$eq||' + this.sendDefaultValueDtos.parameterName);
        filter.push('administrationLevel||$eq||' + this.sendDefaultValueDtos.administrationLevel);
        // this.serviceProxy.getManyBaseDefaultValueControllerDefaultValue(
        //   undefined,
        //   undefined,
        //   filter,
        //   undefined,
        //   ['ASC'],
        //   undefined,
        //   1000,
        //   0,
        //   0,
        //   0
        // ).subscribe((res)=>{
          
        // })
        

        this.defaultProxy.sendDefaultValue(this.sendDefaultValueDtos)
        .subscribe((a) => {
          console.log("my response..",a)
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Default value added successfully ',
            closable: true,
          });
        });
        setTimeout(() => {
          this.onBackClick()
        }, 1);
       
      }
    
  }

}





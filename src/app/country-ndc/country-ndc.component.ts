import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import decode from 'jwt-decode';


import { ConfirmationService, MessageService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
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
  xy: boolean = true;
  flights: any;
  value7: any;
  cities: any;
  data1: Ndc = new Ndc();
  data: Ndc[];
  defoultNDC: boolean = false;
  addNDC: boolean = false;
  ndcsector: boolean = false;
  name: any;
  des: any;
  id: any;
  dec: any;
  newndc: any;
  span: HTMLElement;
  editndc: boolean = false;
  tbdata: any;
  test: any;
  setno: any;
  display: boolean = false;
  check: any;
  selectedValues: string[] = [];
  activendcdialog: boolean = false;
  active: boolean = true;
  confirm1: boolean = false;
  confirm2: boolean = false;
  countryId: any;
  sectorId: any  = 1;
  set: any;
  ndcsetDto: NdcSet = new NdcSet();
  country: Country;
  selectedtype: NdcSet = new NdcSet();
  value: any;
  latestset: NdcSet = new NdcSet();
  sector: Sector;
  selectedndc: boolean = true;
  count: any;
  isChangeAssignData: boolean = true;
  selectedndcIdsArry: any = new Array();
  checkboxdis:boolean=false;
  submitdate:any;
  confirm3: boolean=false;
  confirm4: boolean = false;
  display1: boolean = false;
  display2: boolean = false;
  year='';
  baEmission= 0;
  unCEmission=0;
  CEmission = 0;
  targetYear= '';
  targetYearEmission= 0;
  display3: boolean = false;
  display4: boolean = false;

  yrList: number[] = new Array();
  yrListGraph: string[] = new Array();
  postYrList: number[] = new Array();
  postresaultList: number[] = new Array();
  postIdLisst: number[] = new Array();

  unconditionalValue: number;
  conditionalValue: number;
  isNewNDAC:boolean = true;


  totalRecords:number;
  rows:number=10;
  emissionReduction: EmissionReductioDraftDataEntity = new EmissionReductioDraftDataEntity();


  //   horizontalOptions: any;
  lineStylesData: any;
  basicOptions: any;

  constructor(private messageService: MessageService, private serviceproxy:ServiceProxy, private confirmationService: ConfirmationService, private router: Router, private activerouter: ActivatedRoute) { }

  ngOnInit(): void {


    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    this.countryId = tokenPayload.countryId;
    if(tokenPayload.sectorId){
      this.sectorId =tokenPayload.sectorId;
    }


    console.log("tokenPayload===",tokenPayload)


    console.log(this.selectedtype, 'fff');
    this.serviceproxy
      .getOneBaseCountryControllerCountry(
        this.countryId,
        undefined,
        undefined,
        undefined
      )
      .subscribe((res) => {
        console.log('coou', res);
        this.country = res;
      });

    this.serviceproxy
    .getOneBaseSectorControllerSector(
      this.sectorId,
      undefined,
      undefined,
      undefined
    )
    .subscribe((res) => {
      console.log('coou', res);
      this.sector = res;
    });


    console.log("asdefc")
    let mngNdcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
    mngNdcFilter.push('country.id||$eq||' + this.countryId);
    mngNdcFilter.push('sector.id||$eq||' + this.sectorId);
    console.log(mngNdcFilter)
    this.serviceproxy.getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
      undefined,
      undefined,
      mngNdcFilter,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    
    ).subscribe((res=>{
      if(res.data.length==0){
        
        this.isNewNDAC=true;
        this.emissionReduction.sector=this.sector;
        this.emissionReduction.country=this.country;
        console.log("work2",this.sector)
      
      }else{
        
        this.isNewNDAC=false;
        console.log("emistio aresdy",res.data[0]);
        this.emissionReduction=res.data[0];

        this.targetYear=this.emissionReduction.targetYear;
         
        this.CEmission=this.emissionReduction.conditionaltco2;
        this.unCEmission=this.emissionReduction.unconditionaltco2;
        this.baEmission=this.emissionReduction.baseYearEmission;
        this.year=this.emissionReduction.baseYear;
        this.targetYearEmission=this.emissionReduction.targetYearEmission;
        console.log(this.emissionReduction);
      }
    }))


  this.lineStylesData = {
    
    // labels: [this.emissionReduction.baseYear, this.emissionReduction.targetYear],
    labels: this.yrList,

    datasets: [
      {
        label: 'Actual',
        data: this.postYrList,
        fill: false,
        borderColor: '#533440',
        tension: .4,
        
    }
    ,
      {
        label: 'NDC-Conditional',
        data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue,this.conditionalValue],
        fill: true,
        borderColor: '#81B622',
        tension: .4,
        backgroundColor: '#81B622'
    },
      {
        label: 'NDC-Unconditional',
        data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue,this.unconditionalValue],
        fill: true,
        tension: .4,
        borderColor: '#FFDB58',
        backgroundColor: '#FFDB58'
    },
        {
            label: 'BAU',
            data: [this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.baseYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission,this.emissionReduction.targetYearEmission],
            fill: true,
            tension: .4,
            borderColor: '#FFA726',
            backgroundColor: '#FFA726'
        },


    ]
};





    // this.activerouter.queryParams.subscribe((params=>{
    //     this.selectedtype.id=params['selectedtypeId']
    //     console.log( this.selectedtype.id,'888888888888888888888888888888888888888')
    // }))
    //console.log(this.data[0].isSelected,'kk')
  

    if (!this.ndcsector) {
      this.defoultNDC = true;
    }
    let filter: string[] = new Array();
    filter.push('country.id||$eq||' + this.countryId);
    filter.push('sector.id||$eq||' + this.sectorId);
    let ndcFilter: string[] = new Array();
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.name||$eq||' + this.selectedtype.name);

    let countryFilter: string[] = new Array();
    countryFilter.push('country.id||$eq||' + this.countryId);
    console.log('testrrr',this.countryId);
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
        0
      )
      .subscribe((res) => {
        this.selectedtype = res.data[0];
        let ndcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
        ndcFilter.push('country.id||$eq||' + this.countryId);
        ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
        ndcFilter.push('sector.id||$eq||' + this.sectorId);
        console.log('sss', this.selectedtype);
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
            0
          )
          .subscribe((res: any) => {
            this.id = res.data[0]?.id;
            this.dec = res.data[0]?.dec;
            this.name = res.data[0]?.name;
            this.test = 'Transport';
            this.data = res.data;
            this.totalRecords=res.total;
            //this.count = res.data.subndc.length;
            console.log(
              res,
              'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
            );
            console.log('111', this.selectedtype);
          });
        //this.setno = res.data[0];
      });
   

    // this.serviceproxy.getManyBaseNdcSetControllerNdcSet(
    //   undefined,
    //   undefined,
    //   countryFilter,
    //   undefined,
    //   ['id,DESC'],
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0).subscribe((res:any)=>{
    //     console.log("exxx",res.data)
    //     this.latestset=res.data[0];
    //     this.value = res.data[0]
    //   });

    //     let ndc1Filter: string[] = new Array();
    //     ndc1Filter.push('country.id||$eq||' + this.countryId);
    //     ndc1Filter.push('set.id||$eq||' + this.latestset.id);

    // this.serviceproxy.getManyBaseNdcControllerNdc(
    //   undefined,
    //   undefined,
    //   ndc1Filter,
    //   undefined,
    //   undefined,
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0).subscribe((res: any)=>{

    //     this.id=res.data[0]?.id;
    //     this.dec=res.data[0]?.dec;
    //     this.name=res.data[0]?.name
    //     this.test="Transport";
    //     this.data = res.data;
    //     console.log('111',this.selectedtype)

    //   });

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
        0
      )
      .subscribe((res: any) => {
        console.log('response1111', res.data);
        this.setno = res.data;
      });

    //this.span = document.createElement('<label style="color: blue">Name of the Sub NDC</label><br><input type="text" class="p-inputtext" pInputText  placeholder="Sub nDC Name" style = "width:100%"/><br><br><button class="fas fa-plus"   pButton type="button" style="background-color: #c6cfd7;border-color: transparent"><i class="pi pi-plus" style="font-size: 1rem; color: #000;" ></i></button>');
    console.log(this.defoultNDC);

    this.newndc = [{ one: ' ' }, { one: ' ' }];

    // this.flights = [
    //   { "flightNumber" : this.data.find('name'), "origin": "LAX", "destination" : "LHR"},
    //   {"flightNumber" : "FS1201", "origin": "jjj", "destination" : "jjjjnn"}
    //   ];

    this.value = this.selectedtype;


  



  }













  addNewNDC() {
    // var ndc = new Ndc();
    // ndc.name = "testndc";
    // this.data.push(ndc);
    this.defoultNDC = false;
    this.ndcsector = true;
    // console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',this.selectedtype.id)
    this.router.navigate(['/addndc'], {
      queryParams: {
        countryId: this.countryId,
        sectorId: this.sectorId,
        ndcsetid: this.selectedtype.id,
      },
    });
  }

  addNew() {
    var el = document.createElement(
      '<input type="text" class="p-inputtext" pInputText placeholder="NDC name" style = "width:100%"/>'
    );
    this.newndc.push(el);
  }
  selectset(r: any) {
    console.log('rr', r);
  }

  selectSector(sector: any) {
    this.addNDC = true;
    console.log(sector.value);
  }

  addsub() {
    let row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <br>
      <label style="color: blue">Name of the Sub NDC</label><br>
      <input type="text" class="p-inputtext" pInputText  placeholder="Sub nDC Name" style = "width:100%"/><br><br>`;
    window.document.querySelector('.showInputField')!.appendChild(row);
  }
  checkbox(ndcid: any, isselect: any) {
    //this.selectedndc = false;
    console.log('ddd', ndcid, ' ', isselect);
    if (isselect == 'check') {
      this.selectedndcIdsArry.push(ndcid);
      console.log('bbbbb', this.selectedndcIdsArry);
    } else {
      this.selectedndcIdsArry.pop(ndcid);
      console.log('bbbbb', this.selectedndcIdsArry);
    }

    if (this.selectedndcIdsArry.length != 0) this.selectedndc = false;
    else this.selectedndc = true;
  }

  editSubNDC(ndcid: any, ndcname: any) {
    console.log(ndcname);
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
        'Please confirm you want to Activate selected NDC. you can’t modify NDC names after Activation',
      accept: () => {
        this.active = true;
        // this.confirm1 = true;
        this.selectedndc = true;
        for (let ndcid of this.selectedndcIdsArry) {
          this.serviceproxy
            .getOneBaseNdcControllerNdc(ndcid, undefined, undefined, undefined)
            .subscribe((res) => {
              res.status = 1;
              this.serviceproxy
                .updateOneBaseNdcControllerNdc(ndcid, res)
                .subscribe((res) => {
                  console.log('done');
                  //update sub ndcs status
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
                      0
                    )
                    .subscribe((res) => {
                      console.log(res, 'oooooooooooooo');
                      for (let sub of res.data) {
                        sub.status = 1;
                        this.serviceproxy
                          .updateOneBaseSubNdcControllerSubNdc(sub.id, sub)
                          .subscribe((res) => {
                            console.log('don sub ndc');
                          }
                          ,err=>{

                            this.messageService.add( {
                              severity: 'error',
                              summary: 'Error in Updating SubNDC!!',
                              detail:err
                      
                            });
                    
                    
                          });
                      }

                     

                    });
                    this.messageService.add( {
                      severity: 'success',
                      summary: 'Activated',
                      detail: 'Selected NDC set Activated  successfully.',
                      // closable: true,
                    });


                },err=>{

                  this.messageService.add( {
                    severity: 'error',
                    summary: 'Error in Updating!!',
                    detail:err
            
                  });
          
          
                });
            });
        }
        // window.location.reload();
        //Actual logic to perform a confirmation
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
    console.log(this.defoultNDC);
  }
  saveSetofNDcs() {
    console.log('fff', this.ndcsetDto.country);
    this.ndcsetDto.country = this.country;
    this.ndcsetDto.name = this.set;
    var dateObj = new Date(this.submitdate);
    var momentObj = moment(dateObj);
    this.ndcsetDto.submissionDate = momentObj;
    this.confirm2 = true;
    console.log(this.set, 'dd');

    if(this.ndcsetDto.name!=null|| this.submitdate!=null){
      // this.confirm3 = true;
      this.serviceproxy
      .createOneBaseNdcSetControllerNdcSet(this.ndcsetDto)
      .subscribe((res) => {
        console.log('success', res);


        this.messageService.add( {
          severity: 'success',
          summary: 'Saved',
          detail: ' NDC set saved  successfully.',
          // closable: true,
        });

        this.set = ' ';
      },err=>{

        this.messageService.add( {
          severity: 'error',
          summary: 'Error in Saving!!',
          detail:err
  
        });


      });
    } else{
      this.confirm4=true;
    }
    
  }

  saveTargets(){
    // console.log("first123")
    // console.log(this.emissionReduction.baseYear);
    // console.log(this.emissionReduction.baseYearEmission);
    // console.log(this.baEmission);
    this.display2 =true;
    
    // let emissionDraftData = new EmissionReductioDraftDataEntity();
    // emissionDraftData.sector = this.sector;
    // emissionDraftData.country = this.country;
    // emissionDraftData.baseYear = this.year;
    // emissionDraftData.baseYearEmission = this.baEmission;
    // emissionDraftData.targetYear = this.targetYear;
    // emissionDraftData.targetYearEmission = this.targetYearEmission;
    // emissionDraftData.unconditionaltco2 = this.unCEmission;
    // emissionDraftData.conditionaltco2 = this.CEmission;
    // console.log(emissionDraftData)

 
   this.year=this.emissionReduction.baseYear;
    this.baEmission=this.emissionReduction.baseYearEmission;
    this.targetYear=this.emissionReduction.targetYear;
    this.targetYearEmission=this.emissionReduction.targetYearEmission;
    this.unCEmission=this.emissionReduction.unconditionaltco2;
    this.CEmission=this.emissionReduction.conditionaltco2;
    console.log(this.emissionReduction)
    if(!this.year || this.year.length==0||this.year==' ' ||!(/^-?\d+$/.test(this.year))
     || !this.baEmission 
     || !this.targetYear|| this.targetYear.length==0 
     || this.targetYear==' '|| !(/^-?\d+$/.test(this.targetYear))){
      this.messageService.add( {
        severity: 'error',
        summary: 'Error in Saving!!',

      });
    }else if(this.year.length!=4 || this.targetYear.length!=4){
      this.messageService.add( {
        severity: 'error',
        summary: 'Error in Saving!!',
        detail:'year sould have 4 digits'

      });
    }
    else{
      console.log("save");
      
      if(!this.isNewNDAC){
        console.log("update");
      this.serviceproxy.updateOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(this.emissionReduction.id,this.emissionReduction).
          subscribe((res=>{
            if(res==null){
              this.display3 =true;
            }
                console.log('ressss',res)
                if(res!=undefined && res!=null){
                  this.messageService.add( {
                    severity: 'success',
                    summary: 'Success',
                    detail: 'successfully updated.',
                    closable: true,
                  });
                  
                  this.display1 =false;
                }else{
                  this.messageService.add( {
                    severity: 'error',
                    summary: 'Error in updating!!',
            
                  });
                }
                
            
          }))

      }
      else{
        console.log("new");
        this.serviceproxy.createOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(this.emissionReduction).
          subscribe((res=>{
            if(res==null){
              this.display3 =true;
            }
            
                console.log('ressss',res)
                if(res!=undefined && res!=null){
                  this.emissionReduction=res;
                  this.messageService.add( {
                    severity: 'success',
                    summary: 'Succesfully Saved!!',
                  
                  });
                  this.isNewNDAC=false;
                  this.display1 =false;
                }else{
                  this.messageService.add( {
                    severity: 'error',
                    summary: 'Error in Saving!!',
            
                  });
                }
                
            
          }))



      }
        
      
    }

    // this.year='';
    //         this.targetYear='';
    //         this.targetYearEmission=0;
    //         this.baEmission=0;
    //         this.unCEmission=0;
    //         this.CEmission=0;
    //         this.year ='';
   
  }

  onSetChange(event: any) {
    this.rows=10;
    let ndcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
    ndcFilter.push('sector.id||$eq||' + this.sectorId);
    console.log('sss', this.selectedtype);
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
        0
      )
      .subscribe((res: any) => {
        this.id = res.data[0]?.id;
        this.dec = res.data[0]?.dec;
        this.name = res.data[0]?.name;
        this.test = 'Transport';
        this.data = res.data;
        this.totalRecords=res.total;
        //this.count = res.data.subndc.length;
        console.log(
          res,
          'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
        );
        console.log('111', this.selectedtype);
      });
  }

  loadGridData(event: any) {
    this.rows=10;
    let ndcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
    ndcFilter.push('sector.id||$eq||' + this.sectorId);
    console.log('sss', this.selectedtype);

    let pageNumber =
    event.first === 0 || event.first === undefined
      ? 1
      : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
  this.rows = event.rows === undefined ? 10: event.rows;

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
        0
      )
      .subscribe((res: any) => {
        this.id = res.data[0]?.id;
        this.dec = res.data[0]?.dec;
        this.name = res.data[0]?.name;
        this.test = 'Transport';
        this.data = res.data;
        this.totalRecords=res.total;
        //this.count = res.data.subndc.length;
        console.log(
          res,
          'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
        );
        console.log('111', this.selectedtype);
      });
  }
  addndc() {
    //   let row = document.createElement('div');
    //   row.className = 'row';
    //   row.innerHTML = `
    //   <div class="row p-2">
    //   <div  style="float:left;width: 100%;">
    //   <label style="color: blue">Name of the NDC</label><br>
    //   <input type="text" class="p-inputtext" pInputText placeholder="NDC name" style = "width:100%"/>
    //  <div style="float:right;width: 100%;">
    //   <label style="color: blue">Name of the Sub NDC</label><br>
    //   <input type="text" class="p-inputtext" pInputText  placeholder="Sub nDC Name" style = "width:100%"/>
    //  </div>
    //  </div> `;
    //   window.document.querySelector('.showInputFieldNDC')!.appendChild(row);
  }
  close() {
    console.log('test');
    window.location.reload();
  }

  close1(){}
  // targets(){}

  targets() {
    this.display1 = true;
  }
  closeDialog(){}

}

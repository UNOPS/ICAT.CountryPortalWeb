import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {  MessageService } from 'primeng/api';
import { Country, Ndc, Sector, ServiceProxy, SubNdc } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-add-ndc',
  templateUrl: './add-ndc.component.html',
  styleUrls: ['./add-ndc.component.css']
})
export class AddNdcComponent implements OnInit {
  
  subndc: any;
//  subndcs: { createdBy: any;createdOn: any;editedBy: any;editedOn: any;status: any;id: any; name: any;description: any;sortOrder: any; ndcId:any }[];
 subndcs: SubNdc[]=new Array();
  subndcval:any;
  values: { testvalue: any; }[];
  rowIndex: number = 0;
  ndc: any;
  sector: Sector=new Sector();
  latestndcId: number;
  countryId: any;
  sectorId: any;
  data1: any;
  newndc:Ndc;
  ndcsetid:any;
  selectedtypeId: any;
  confirm4: boolean = false;
  confirm3: boolean = false;

  constructor(private router: Router, private serviceproxy:ServiceProxy, private activerouter: ActivatedRoute,private messageService: MessageService,) { }

  confirm2: boolean = false;
  subNdc: any;
  data: any;
  country: Country;
  ngOnInit(): void {
    this.newndc = new Ndc();
    // this.subndc =[
    //   { "testvalucreatedBy" : "test", "createdOn":new Date(), "editedBy":"ted", "editedOn":new Date(), "status":0,"id":1,"description":"test":}
    //   ];

    this.activerouter.queryParams.subscribe((params=>{
      this.countryId=params['countryId'];
      this.sectorId=params['sectorId'];
      this.ndcsetid=params['ndcsetid'];
      console.log('dddd',this.countryId,   this.sectorId)
      this.selectedtypeId = params['ndcsetid'];
    }));
    
    this.serviceproxy.getOneBaseCountryControllerCountry(
      this.countryId,
      undefined,
      undefined,
      undefined).subscribe((res=>{
        console.log('coou',res)
        this.country = res;
      }))
  
      this.serviceproxy.getOneBaseSectorControllerSector(
        this.sectorId,
        undefined,
        undefined,
        undefined).subscribe((res=>{
          console.log('coou',res)
          this.sector = res;
        }))
    
     this.values = [
      { "testvalue" : "this.data.find('name')"}
      ];
  }
  saveNDCs(){
    this.confirm2 = true;

  }
 
  Back(){
    this.router.navigate(['/ndc'],
    { queryParams: { selectedtypeId: this.selectedtypeId }}).then(() => {
      // window.location.reload();
    });
  }
   save(){
   this.confirm2 = true;
   if(this.ndc!=null || this.ndc!=undefined){
   this.serviceproxy.getOneBaseNdcSetControllerNdcSet(this.ndcsetid,undefined,undefined,undefined).subscribe((res=>{
    this.newndc.name=this.ndc;
    this.newndc.set = res;
    this.newndc.editedOn = moment();
    this.newndc.sortOrder=1;
    this.newndc.createdOn= moment();
    this.newndc.description = "test";
    this.newndc.country = this.country;
    this.newndc.sector = this.sector;
    this.newndc.subNdc = this.subndcs;
    //console.log("999v",this.newndc)
   
    // newndc.subNdc;
   
    this.serviceproxy.createOneBaseNdcControllerNdc(this.newndc).subscribe(

      (res) => {
        console.log('update',res)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 
          'Aggregated Actions  has saved successfully ' ,
          closable: true,
        });
        for(let s of this.subndcs){
          s.ndc=res;
          
  
          this.serviceproxy.createOneBaseSubNdcControllerSubNdc(s).subscribe(
            (res) => {
              console.log('update',res)
              // this.messageService.add({
              //   severity: 'success',
              //   summary: 'Success',
              //   detail: 
              //   'project  has updated successfully ' ,
              //   closable: true,
              // });
            },
           
              (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error.',
                  detail: 'Internal server error,Problem occured while saving subNDC.',
                  sticky: true,
                });              
            }
          
           )
        }




      },
     
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
            sticky: true,
          });              
      }
    
    );
    setTimeout(() => {
      this.Back();    
    },1000);



    // this.serviceproxy.createOneBaseNdcControllerNdc(this.newndc).subscribe((res=>{
    //   console.log(res,"99991")
    //   this.selectedtypeId =  res.id;
    //   for(let s of this.subndcs){
    //     s.ndc=res;
        

    //     this.serviceproxy.createOneBaseSubNdcControllerSubNdc(s).subscribe((res=>{
    //       console.log('tttt',res)
          
    //     })
        
    //      )
    //   }


    // }));
   

   }));
   this.confirm3=true;
  }else{
    this.confirm4=true;
  }
     
    // this.router.navigate(['/ndc']);
}
addnewsub(){
  
  let sub = new SubNdc();
  //sub.name = this.subndc;
  sub.description="des";
  sub.createdOn = moment();
  this.subndcs.push(sub);
     console.log(this.subndcs,'lll') ;  
  this.values.push({"testvalue" : "FS1201"})
  console.log('333', this.subndc)
  this.rowIndex=this.rowIndex+1;
  
}
sub(event:any){
  console.log('cdc', event.value)
}
OnInput(event:any){

}

removesub(){
  
  this.subndcs.splice(-1);
  console.log(this.subndcs,'xsxsxssssssssssssssssss')
}
test(){
  console.log("testtttt")

      window.location.reload();
  
}
}


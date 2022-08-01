import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

import { Ndc, ProjectControllerServiceProxy, ServiceProxy, SubNdc } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-ndc',
  templateUrl: './edit-ndc.component.html',
  styleUrls: ['./edit-ndc.component.css']
})
export class EditNdcComponent implements OnInit {

  ndcname: any;
  ndceditname: boolean=false;
  ndcid: any;
  data: SubNdc[]=new Array();
  visibility2: boolean = false;
  visibility3:boolean = false;
  visibility5: boolean = false;

  subndcname: any;
  subndc: any;
  subndcs: string[];
  subndcs1: SubNdc[];
  Deactivate:string = "Delete";
  visibility1:boolean = false;
  hasProject:boolean=false
  constructor(private confirmationService: ConfirmationService,
     private messageService: MessageService,
     private router: Router,
      private activateroute: ActivatedRoute,
       private serviceproxy: ServiceProxy,
       private projectproxy:ProjectControllerServiceProxy) { }

  ngOnInit(): void {
   
    this.activateroute.queryParams.subscribe(params=>{
          console.log("param",params)
          this.ndcname = params['ndcname'];
          this.ndcid = params['ndcid'];
    });

let filter: string[] = new Array();  // countryFilter.push(this.countryId); 
        filter.push('ndc.id||$eq||' + this.ndcid);  

  this.serviceproxy.getManyBaseSubNdcControllerSubNdc(
    undefined,
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
  ).subscribe((res=>{
    console.log('222',res.data);
    //this.subndcname = res.data.
    this.data = res.data;
  }));

  this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res=>{
    
   
    this.projectproxy.getProjectsForCountrySectorInstitution(0,0,0,[],this.ndcid,0).subscribe(res=>{
console.log('proj',res)
     this.hasProject=res.meta.totalItems>0?true:false;

    });
      if(res.status==1){
        this.Deactivate = "Deactivate";
        this.ndceditname = true;
      }
  }))
  }

  async save(){
    let ndc = new Ndc();
    ndc.name = this.ndcname;
    ndc.subNdc=this.data;
    this.serviceproxy.updateOneBaseNdcControllerNdc(this.ndcid, ndc).subscribe((res=>{
      console.log(res,'res')

    }))
     this.data.forEach(async sub=>{
      sub.ndc.id = this.ndcid;
      console.log(ndc.id, 'subbbb')
      if(sub.id!=undefined){
        console.log('tttt1')
     let result= await this.serviceproxy.updateOneBaseSubNdcControllerSubNdc(sub.id,sub).toPromise()
     console.log('tttt11',result)
    //  .subscribe((res=>{
    //     this.messageService.add({severity:'success', summary:'Updated', detail:`${res.name} subNDC updated successfully`});
    //     console.log(res, '77')
    //   }))
    }else{
      console.log('tttt2')
     let result=await this.serviceproxy.createOneBaseSubNdcControllerSubNdc(sub).toPromise()
     console.log('tttt11',result)
     sub.id=result.id
      // .subscribe((res=>{
      //   this.messageService.add({severity:'success', summary:'Saved', detail:`${res.name} subNDC saved successfully`});
      //   sub=res;
      //   console.log('tttt2',res)
      // }))
    } 




     })
     console.log('testdddbbbb', this.data)
    // for await (let sub of this.data){
      //console.log(sub, 'subbbb')
    //   sub.ndc.id = this.ndcid;
    //   console.log(ndc.id, 'subbbb')
    //   if(sub.id!=undefined){
    //     console.log('tttt1')
    //  let result= await this.serviceproxy.updateOneBaseSubNdcControllerSubNdc(sub.id,sub).toPromise()
    //  console.log('tttt11',result)
    // //  .subscribe((res=>{
    // //     this.messageService.add({severity:'success', summary:'Updated', detail:`${res.name} subNDC updated successfully`});
    // //     console.log(res, '77')
    // //   }))
    // }else{
    //   console.log('tttt2')
    //  let result=await this.serviceproxy.createOneBaseSubNdcControllerSubNdc(sub).toPromise()
    //  console.log('tttt11',result)
    //   // .subscribe((res=>{
    //   //   this.messageService.add({severity:'success', summary:'Saved', detail:`${res.name} subNDC saved successfully`});
    //   //   sub=res;
    //   //   console.log('tttt2',res)
    //   // }))
    // }
    // }
    console.log('tttt3')
    this.messageService.add({severity:'success', summary:'Updated', detail:`${this.ndcname} Aggregated Actions updated successfully`});
    // this.visibility3=true;
    //this.router.navigate(['/ndc']);
  }

  Back(){
    this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res=>{
      
      this.router.navigate(['/ndc'],
    { queryParams: { selectedtypeId:res.set.id}});
    }))
    
  }
  addsub(){
   // this.subndcs.push(this.subndc)
   let ndc = new SubNdc();
   this.data.push(ndc);
  }
  

  confirmDelet() {
    this.Deactivate="deactivate"
    this.confirmationService.confirm({
        message: `Are you sure that you want to ${this.Deactivate} this aggregated action?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log('comfirm1')
          this.deletendc()
            
        },
        reject: (type: ConfirmEventType) => {
          // console.log('comfirm2')
          //   switch(type) {
          //       case ConfirmEventType.REJECT:
          //           this.messageService.add({severity:'info', summary:'Rejected', detail:'You have rejected'});
          //       break;
          //       case ConfirmEventType.CANCEL:
          //           this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
          //       break;
          //   }
        }
    });
}
  deletendc(){
   let ndc = new Ndc();
    console.log("ggg",this.data)
    this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid,undefined,undefined,undefined).subscribe((async res=>{
      if(res.status!=1){
      ndc=res;
      if(res.subNdc.length!=0){
        
        for await(let d of this.data){
          this.serviceproxy.deleteOneBaseSubNdcControllerSubNdc(d.id).subscribe(res=>{
            console.log(res,'res')
            this.messageService.add({severity:'info', summary:'Confirmed', detail:`successfully deleted subNDC ${d.name} `});
          },err=>{

            this.messageService.add({severity:'error', summary:'try again', detail:`erro deleted subNDC ${d.name} `});
  
          })
        }

        this.serviceproxy.deleteOneBaseNdcControllerNdc(this.ndcid).subscribe((res=>{
          console.log(res),'example';
          this.messageService.add({severity:'info', summary:'Confirmed', detail:`successfully deleted Aggregated Action ${ndc.name} `});
        }),err=>{

          this.messageService.add({severity:'error', summary:'try again', detail:`erro deleted Aggregated Action ${ndc.name} `});

        })
        
      }else {
        this.serviceproxy.deleteOneBaseNdcControllerNdc(this.ndcid).subscribe(res=>{
          console.log(res),'example';
          this.messageService.add({severity:'info', summary:'Confirmed', detail:`successfully deleted Aggregated Action ${ndc.name} `});
        },err=>{

          this.messageService.add({severity:'error', summary:'try again', detail:`erro deleted Aggregated Action ${ndc.name} `});

        })
      } 
      //  this.visibility2 = true;
        this.router.navigate(['/ndc']);
    }else{
        this.Deactivate = "Deactivate";
        this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res=>{
          res.status  = 0;
          this.serviceproxy.updateOneBaseNdcControllerNdc(this.ndcid,res).subscribe((res=>{
            console.log('done')
            //update sub ndcs status
            this.serviceproxy.getManyBaseSubNdcControllerSubNdc(
              undefined,
              undefined,
              ['ndc.id||$eq||' + this.ndcid],
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0
            ).subscribe((res=>{
              console.log(res, 'oooooooooooooo')
              for(let sub of res.data){
                sub.status = 0;
                this.serviceproxy.updateOneBaseSubNdcControllerSubNdc(sub.id,sub).subscribe((res=>{
                  console.log("don sub ndc")
                  
                }),err=>{

                  this.messageService.add({severity:'error', summary:'try again', detail:'erro in deactivated'});
        
                })
              }
            }),err=>{

              this.messageService.add({severity:'error', summary:'try again', detail:'erro in deactivated'});
    
            })
 
            this.Deactivate = "Delete";
            this.messageService.add({severity:'success', summary:'Deactivated', detail:`${res.name} successfully deactivated `});
          }))
        }),err=>{

          this.messageService.add({severity:'error', summary:'Confirmed', detail:'erro in deactivated'});

        })
        // this.visibility5 = true;
      }
    }))
    
  
    //this.router.navigate(['/ndc']);
  }
  confirmsubDelet() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this Action Areas?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
       
          this.deletesub()
            
        },
        reject: (type: ConfirmEventType) => {
          console.log('comfirm2')
            // switch(type) {
            //     case ConfirmEventType.REJECT:
            //         this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
            //     break;
            //     case ConfirmEventType.CANCEL:
            //         this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
            //     break;
            // }
        }
    });
}

  deletesub(){
    console.log(this.data[this.data.length-1],'88888')
    this.serviceproxy.deleteOneBaseSubNdcControllerSubNdc(this.data[this.data.length-1].id).subscribe((res=>{
      console.log(res)
      this.messageService.add({severity:'info', summary:'Confirmed', detail:'successfully deletd '});
    }),err=>{

      this.messageService.add({severity:'info', summary:'Confirmed', detail:'erro in delete'});

    });
    
    this.data.splice(-1);
    console.log(this.data,'88888')
    // this.visibility1 = true;
  }

  test(){
    console.log("testtttt")
    this.router.navigate(['/ndc']).then(() => {
        window.location.reload();
      });
  }


}

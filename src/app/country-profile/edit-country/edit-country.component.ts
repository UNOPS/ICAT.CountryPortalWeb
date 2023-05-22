import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Country, DocumentControllerServiceProxy, Documents, DocumentsDocumentOwner, Sector, ServiceProxy } from 'shared/service-proxies/service-proxies';
import { ConfirmationService, MessageService } from 'primeng/api';
import decode from 'jwt-decode';
@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.css']
})
export class EditCountryComponent implements OnInit {

 country: Country = new Country();
 sector: Sector = new Sector();
 sectors: Sector[];
 sectorUpdated: any;
 countryId: number;
 isSaving: boolean = false;
 sectorList: Sector[];
 value: any;
 confirm: boolean = false;
 confirmSector: boolean = false;
 documents: Documents[] = [];
 documentsDocumentOwnerNC: DocumentsDocumentOwner =
 DocumentsDocumentOwner.CountryNC;
 documentsDocumentOwnerBUR: DocumentsDocumentOwner =
 DocumentsDocumentOwner.CountryBUR;
 documentsDocumentOwnerBTR: DocumentsDocumentOwner =
 DocumentsDocumentOwner.CountryBTR;
 documentsDocumentOwnerNDC: DocumentsDocumentOwner =
 DocumentsDocumentOwner.CountryNDC;
 documentsDocumentOwnerGHG: DocumentsDocumentOwner =
 DocumentsDocumentOwner.CountryGHG;

  constructor(private route: Router,
    private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private docService: DocumentControllerServiceProxy,
    private messageService :MessageService,) { }

  ngOnInit(): void {


    const token = localStorage.getItem('access_token')!;
  
      const tokenPayload = decode<any>(token);
      this.countryId=tokenPayload.countryId;
    this.serviceProxy
    .getOneBaseCountryControllerCountry(
      this.countryId,                        // country ID is request
      undefined,
      undefined,
      0,
    ).subscribe((res: any) => {
      this.country = res;
      // console.log(this.country);
      // this.countryId = this.country.id;
      // console.log('########333');
      // console.log(this.countryId);
    });

    let countryFilter: string[] = new Array();
    // countryFilter.push(this.countryId);
  
    countryFilter.push('country.id||$eq||' + 1);



    this.serviceProxy
    .getManyBaseSectorControllerSector(
      undefined,
      undefined,
      countryFilter,
      undefined,
      undefined,
      ['country'],
      1000,
      0,
      0,
      0
    ).subscribe((res) => {
      console.log("sec",res);
      this.sectors=res.data;
      // this.sectors = res.data;
      // console.log(this.sectors);
    });
    }

  // saveForm(formData: NgForm) {
  //   if (formData.valid) {
  //     // console.log("new country"+this.country);
    
  //     this.serviceProxy
  //       .updateOneBaseCountryControllerCountry(1, this.country)
  //       .subscribe(
  //         (res) => {
  //           this.country = res;
  //           console.log("new country"+this.country);
  //           this.isSaving = false;
  //         }
  //       );

  //     console.log(formData);
  //   }
  // }



  // Update start merge requets
  
  // saveForm(formData: NgForm) {
    
        

  //     console.log(formData);
    
  // }
  
  //END

  saveCountry(country: Country){
    console.log("this.countryId",this.countryId);
    this.serviceProxy
    .updateOneBaseCountryControllerCountry(this.countryId, country)
    .subscribe((res) => {
      this.country = res;
      // this.confirm = true;
      this.messageService.add({severity:'success', summary:'Saved', detail:'Country profile successfully updated'});
      // this.back();
    },err=>{
      
      this.messageService.add({severity:'error', summary:'Error', detail:'Error in updating.'});
    })
    // console.log("aceepted");
   
    // if(this.confirm==true){
    //   this.route.navigate(['/view-country'])
    // }
  }

  saveSector(sector: Sector[]){

    for(let sector of this.sectors){
      // console.log("aaaaaaaa",sector)

      this.serviceProxy
      .updateOneBaseSectorControllerSector(sector.id, sector)
      .subscribe((res)=>{
        // console.log("backend.", sector2)
        // sector = res;
        console.log("final sector id",sector.id)
        console.log("res",res)
        this.confirmSector = true;
        // this.route.navigate(['/view-country'])
        // sectors.push(res)
        // console.log("sectors list",sectors)
        // console.log("final sector",sector2)
      })
      
      
       };   
  
  }
  // console.log("sector list",this.sectors)
  // console.log

  //   this.serviceProxy
  //   .updateOneBaseSectorControllerSector(1, sector)
  //   .subscribe((res) => {
  //     this.sector = res;
  //     console.log("sectorUpdate", sector.description)
  //     this.route.navigate(['/view-country'])
      
  //   })
  //   // console.log("aceepted sector")
  // }
  // }

    //   this.confirmationService.confirm({
    //     message: 'Save success !',
    //     header: 'Save',
    //     acceptIcon: 'icon-not-visible',
    //     rejectIcon: 'icon-not-visible',
    //     rejectButtonStyleClass: 'p-button-text',
    //     rejectVisible: false,
    //     acceptLabel: 'Ok',
    //     accept: () => {
    //     },
    //     reject: () => {},
    //   });

     
    // },
    // (error) => {
    //   this.confirmationService.confirm({
    //     message: 'An error occurred, please try again.',
    //     header: 'Error',
    //     acceptIcon: 'icon-not-visible',
    //     rejectIcon: 'icon-not-visible',
    //     rejectButtonStyleClass: 'p-button-text',
    //     rejectVisible: false,
    //     acceptLabel: 'Ok',
    //     accept: () => {
    //       //this.onBackClick();
    //     },
    //     reject: () => {},
    //   });
  
      
    //   console.log('Error', error);
    //   this.isSaving = false;
    // }
  // );



  // saveSector(sector: Sector){

  //   console.log("update", sector)
  //   this.serviceProxy
  //   .updateOneBaseSectorControllerSector(1, sector)
  //   .subscribe((res)=>{
  //     this.confirmationService.confirm({
  //       message: 'Save success !',
  //       header: 'Save',
  //       acceptIcon: 'icon-not-visible',
  //       rejectIcon: 'icon-not-visible',
  //       rejectButtonStyleClass: 'p-button-text',
  //       rejectVisible: false,
  //       acceptLabel: 'Ok',
  //       accept: () => {
  //       },
  //       reject: () => {},
  //     });

  //     console.log("aceepted sector")
  //   },
  //   (error) => {
  //     this.confirmationService.confirm({
  //       message: 'An error occurred, please try again.',
  //       header: 'Error',
  //       acceptIcon: 'icon-not-visible',
  //       rejectIcon: 'icon-not-visible',
  //       rejectButtonStyleClass: 'p-button-text',
  //       rejectVisible: false,
  //       acceptLabel: 'Ok',
  //       accept: () => {
  //         //this.onBackClick();
  //       },
  //       reject: () => {},
  //     });
  
      
  //     console.log('Error', error);
  //     this.isSaving = false;
  //   }
  // );
  // }


  back(){
    this.route.navigate(['/view-country'])
  }

  delete(){
    this.docService
    .deleteDoc(1);
  }
  
      
}
  
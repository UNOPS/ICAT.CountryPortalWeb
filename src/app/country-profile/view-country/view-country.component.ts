import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Country, DocumentControllerServiceProxy, Documents, DocumentsDocumentOwner, EmissionReductioDraftDataEntity, Sector, SectorControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrls: ['./view-country.component.css']
})
export class ViewCountryComponent implements OnInit {
  country: Country = new Country();
  sectors: Sector[];
  tabs:any;

  stateOptions = [{label: 'For Country', value: true}, {label: 'For a Sector', value: false}];
  isCountry:boolean=true;
  countryId: number;
  sectorId: number = 1;


  documents: Documents[] = [];
  testss: Documents = new Documents();
  listDocumentsNC: Documents[] = [];
  listDocumentsBUR: Documents[] = [];
  listDocumentsBTR: Documents[] = [];
  listDocumentsNDC: Documents[] = [];
  listDocumentsGHG: Documents[] = [];
  documentsDocumentOwnerNC: DocumentsDocumentOwner =
  DocumentsDocumentOwner.CountryNC;
  documentsDocumentOwnerBUR: DocumentsDocumentOwner =
  DocumentsDocumentOwner.CountryBUR;
  documentsDocumentOwnerBTR: DocumentsDocumentOwner =
  DocumentsDocumentOwner.CountryBTR;
  documentsDocumentOwnerNDC: DocumentsDocumentOwner =
  DocumentsDocumentOwner.CountryNDC;
  display1: boolean = false;
  SERVER_URL = environment.baseUrlAPIDocdownloadAPI;


  isNewNDAC:boolean = true;
  emissionReduction: EmissionReductioDraftDataEntity = new EmissionReductioDraftDataEntity();
  sector: Sector;

  year='';
  baEmission= 0;
  unCEmission=0;
  CEmission = 0;
  targetYear= '';
  targetYearEmission= 0;

  display2: boolean = false;
  display3: boolean = false;
  display4: boolean = false;


  selectedSector:Sector;
  // tabs: any;
  // countryname: 'Sri Lanka'

  constructor(private router: Router,
    private activateroute: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private sectorProxy: SectorControllerServiceProxy,
    private documentProxy:DocumentControllerServiceProxy) { }

  ngOnInit(): void {

    
    // this.activateroute.queryParams.subscribe(params=>{
    //   console.log("params",params)
    //   if(params!==null){
    //     this.countryId = 1;
    //   }
    // })
    const token = localStorage.getItem('access_token')!;
  
      const tokenPayload = decode<any>(token);
      this.countryId=tokenPayload.countryId;
     


      console.log("view country", this.countryId);
      // this.router.navigate(['/parameter'], { queryParams: { id: parameter.id } });
      let mngNdcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
      mngNdcFilter.push('country.id||$eq||' + this.countryId);
      mngNdcFilter.push('sector.id||$isnull||');
      console.log(mngNdcFilter)
      this.serviceProxy.getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
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



        this.serviceProxy
        .getOneBaseCountryControllerCountry(
          this.countryId,                        // country ID is request
          undefined,
          undefined,
          0,
        ).subscribe((res2: any) => {
          this.country = res2;
          this.countryId = this.country.id;

          if(res.data.length==0){
          
            this.isNewNDAC=true;
            // this.emissionReduction.sector=this.sector;
            this.emissionReduction.country=this.country;
            console.log("this.country",this.country)
          
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




         
        });
       
      }))
      



  
 



  // CountryNC = 4,
  // CountryBUR = 5,
  // CountryBTR = 6,
  // CountryNDC = 7,

  this.documentProxy.getDocumentsForViweCountry(-4).subscribe(res=>{

    console.log("listDocumentsNC",res)

    this.listDocumentsNC = res;


  })
  this.documentProxy.getDocumentsForViweCountry(-5).subscribe(res=>{

    console.log("listDocumentsBUR",res)
    this.listDocumentsBUR = res;



  })
  this.documentProxy.getDocumentsForViweCountry(-6).subscribe(res=>{

    console.log("listDocumentsBTR",res)
    this.listDocumentsBTR = res;



  })
  this.documentProxy.getDocumentsForViweCountry(-7).subscribe(res=>{

    this.listDocumentsNDC = res;
    console.log("listDocumentsNDC",res)




  })
  this.documentProxy.getDocumentsForViweCountry(-8).subscribe(res=>{
    this.listDocumentsGHG = res;
    console.log("listDocumentsGHG",res)




  })

  // let filter1: string[] = new Array();
  // let filter2: string[] = new Array();
  // let filter3: string[] = new Array();
  // let filter4: string[] = new Array();
  // let filter5: string[] = new Array();

  // filter1.push('documentOwner||$eq||' + 4); 
  // filter2.push('documentOwner||$eq||' + 5); 
  // filter3.push('documentOwner||$eq||' + 6); 
  // filter4.push('documentOwner||$eq||' + 7);
  // filter5.push('documentOwner||$eq||' + 8);  

  // this.serviceProxy
  // .getManyBaseDocumentControllerDocuments(
  //   undefined,
  //   undefined,
  //   filter1,
  //   undefined,
  //   ['createdOn,DESC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  // ).subscribe((res: any)=>{
  //   this.listDocumentsNC = res.data;
  //   console.log('all documentsNC',this.listDocumentsNC);
  //   console.log('1st one', this.listDocumentsNC[0]);


  // })

  // this.serviceProxy
  // .getManyBaseDocumentControllerDocuments(
  //   undefined,
  //   undefined,
  //   filter2,
  //   undefined,
  //   ['createdOn,DESC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  // ).subscribe((res: any)=>{
  //   this.listDocumentsBUR = res.data;
  //   console.log('all documentsBUR',this.listDocumentsBUR);

  // })

  // this.serviceProxy
  // .getManyBaseDocumentControllerDocuments(
  //   undefined,
  //   undefined,
  //   filter3,
  //   undefined,
  //   ['createdOn,DESC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  // ).subscribe((res: any)=>{
 
  //   this.listDocumentsBTR = res.data;
  //   console.log('all documentsBTR',this.listDocumentsBTR);

  // })

  // this.serviceProxy
  // .getManyBaseDocumentControllerDocuments(
  //   undefined,
  //   undefined,
  //   filter4,
  //   undefined,
  //   ['createdOn,DESC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  // ).subscribe((res: any)=>{
    
  //   this.listDocumentsNDC = res.data;
  //   console.log('all documents btrNDC',this.listDocumentsNDC);

  // })

  // this.serviceProxy
  // .getManyBaseDocumentControllerDocuments(
  //   undefined,
  //   undefined,
  //   filter5,
  //   undefined,
  //   ['createdOn,DESC'],
  //   undefined,
  //   1000,
  //   0,
  //   0,
  //   0
  // ).subscribe((res: any)=>{
  //   this.listDocumentsGHG = res.data;
  //   console.log('all documentsBUR',this.listDocumentsGHG);

  // })


  


  // this.tabs = [{"name":"abc", "NDC":"abcNDC","nameEmission":"abcEmission"},{"name":"abc11","NDC":"abc11NDC","nameEmission":"abc11Emission"},{"name":"abc22","NDC":"abc22NDC","nameEmission":"abc22Emission"}];
  // this.countryId = this.country.id;  


  let countryFilter: string[] = new Array();
  // countryFilter.push(this.countryId);

  countryFilter.push('country.id||$eq||' + this.countryId);      // country id is the request
 
  this.sectorProxy.getCountrySector(this.countryId).subscribe((res: any) => {
    this.sectors=res;
  });
  
  // this.serviceProxy
  // .getManyBaseSectorControllerSector(
  //   undefined,
  //   undefined,
  //   undefined,
  //   undefined,
  //   undefined,
  //   ['country'],
  //   1000,
  //   0,
  //   0,
  //   0
  // ).subscribe((res) => {
  //   console.log("sec",res);
  //   this.sectors=res.data;
  //   // this.sectors = res.data;
  //   // console.log(this.sectors);
  // });



  }
edit(){
  this.router.navigate(['edit-country']);
}

ndc(){
  this.router.navigate(['ndc'])
}

viewmore(){
  this.display1 = true;
}




saveTargets(){
   console.log("first123")
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
  
  console.log('this.emissionReduction',this.emissionReduction)
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

    if(this.emissionReduction.conditionaltco2){
      console.log("save666");
    }else{
      this.emissionReduction.conditionaltco2 = 0;
    }
    
    if(!this.isNewNDAC){
      console.log("update");
    this.serviceProxy.updateOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(this.emissionReduction.id,this.emissionReduction).
        subscribe((res=>{
          if(res==null){
            this.display3 =true;
          }
              console.log('ressss',res)
              if(res!=undefined && res!=null){
                this.messageService.add( {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Successfully updated.',
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
      if(this.emissionReduction.conditionaltco2){

      }else{
        this.emissionReduction.conditionaltco2 = 0;
      }
      
      
      // console.log("this.emissionReductionnew",this.emissionReduction);
      this.serviceProxy.createOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(this.emissionReduction).
        subscribe(res=>{
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
              
          
        },err=>{

          this.messageService.add( {
            severity: 'error',
            summary: 'Error in Saving!!',
    
          });

        })



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
targets() {
  this.display4 = true;
}

onSectorChange(evet?:any){
console.log('evet',evet)
console.log('selectedSector',this.selectedSector)

// if(evet===null || evet.toString()=='false'){
//   console.log('evet null')
//   this.emissionReduction = new EmissionReductioDraftDataEntity();
//   this.isNewNDAC=true;
// }

// else
 if(evet.toString()=='true'){
  let mngNdcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
  mngNdcFilter.push('country.id||$eq||' + this.countryId);
  mngNdcFilter.push('sector.id||$isnull||' +this.selectedSector.id);
  console.log(mngNdcFilter)
  this.serviceProxy.getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
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
      this.emissionReduction = new EmissionReductioDraftDataEntity();
      this.isNewNDAC=true;
      // this.emissionReduction.sector=this.sector;
      this.emissionReduction.country=this.country;
      // console.log("this.country",this.country)
    
    }else{
      
      this.isNewNDAC=false;
      // console.log("emistio aresdy",res.data[0]);
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


}else{
  // console.log('evetfalse',evet)
  let mngNdcFilter: string[] = new Array(); // countryFilter.push(this.countryId);
  mngNdcFilter.push('country.id||$eq||' + this.countryId);
  mngNdcFilter.push('sector.id||$eq||' + evet.id);
  console.log(mngNdcFilter)
  this.serviceProxy.getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
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
    
    if(res.count==0){
      
      let newSecter:Sector=new Sector();
      newSecter.id=evet.id
      this.isNewNDAC=true;
      this.emissionReduction = new EmissionReductioDraftDataEntity();
     
      this.emissionReduction.sector=newSecter;
     
      this.emissionReduction.country=this.country;
      
      // console.log("work2",this.sector)
    
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

}






}

}

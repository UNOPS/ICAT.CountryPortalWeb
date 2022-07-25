import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Country, Institution, InstitutionCategory, InstitutionControllerServiceProxy, InstitutionType, Sector, ServiceProxy, User, UserType } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {

  isSaving: boolean = false;
  insName:boolean =false;
  institution: Institution = new Institution();
  sectorList: Sector[] = [];
  typeList: InstitutionType[] = [];
  selectedTypeList: string[] = [];
  selectedTypeList1: string[] = [];
  categoryList: InstitutionCategory[] = [];
  institutionId: number = 0;
  title: string;
  user: User = new User();
  userId: number = 0;
  userType: UserType = new UserType();
  type: InstitutionType = new InstitutionType();
  Deactivate: string = "Deactivate";
  deletedAt: Date;
  isNew: boolean = true;


  intype: InstitutionType;
  insector: Sector;
  country: Country;
  countryId: number;


  incategory: InstitutionCategory;
  inname: string;
  inmail: string;
  intelephoneNumber: string;
  indescription: string;
  inaddress: string;


  sectorAdminId: number = 2;
  institutionAdminId: number = 0;

  rejectComment: string;
  rejectCommentRequried: boolean;
  savedInstitution: Institution;
  statusUpdate = 0;
  @ViewChild('op') overlay: any;
  usrrole: any;
  sectorId: any;
 // userCountryId:number = 0;
  userSectorId:number = 0;
  dataCollectionModuleStatus:number;
  internalTeam:boolean = false;
  constructor(private serviceProxy: ServiceProxy,
    // private typeService: InstitutionTypeControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private institutionProxy: InstitutionControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }



  OnShowOerlay() {
    this.rejectComment = '';
    this.rejectCommentRequried = false;
  }

  ngOnInit(): void {

    // this.route.queryParams.subscribe((params) => {
    //   this.institutionId = params['id'];
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);

    console.log("tokenPayload==", tokenPayload)
    this.usrrole = tokenPayload.roles[0];
    this.sectorId = tokenPayload.sectorId;
    this.countryId = tokenPayload['countryId'];
    this.dataCollectionModuleStatus =tokenPayload.moduleLevels[3];
    console.log("usrrole==", this.usrrole)

    if(this.usrrole == "Sector Admin" || this.usrrole =="MRV Admin"){
      this.internalTeam = true
    }

    this.route.queryParams.subscribe((params => {
      this.institutionId = params['id'];

      console.log('dddd', this.institutionId);


      if (this.institutionId && this.institutionId > 0) {
        this.isNew = false;
        this.serviceProxy
          .getOneBaseInstitutionControllerInstitution(
            this.institutionId,
            undefined,
            undefined,
            0
          ).subscribe((res) => {
            this.institution = res;
            console.log('rrrr', res);

            this.intype = this.institution?.type;
            console.log("intype..", this.intype)
            // if(this.usrrole = 'Data Collection Team')
            // {
            //   this.intype = this.institution?.type.filter((o)=>o.name == 'Data Provider');
            // }


            // insector
            // country
            // incategory
            // inname
            // inmail
            // intelephoneNumber
            // indescription
            // inaddress

          })
      }

      // if(this.institutionId == 0){
      //   this.title = "Add institution" 
      // }else{
      //   this.title = "View institution"


      // }
    }));




    // this.getDeletedAtStatus();

    // this.route.queryParams.subscribe((params) => {
    //   this.user.id = 1;
    //   this.userId = this.user.id;

    // this.serviceProxy
    // .getOneBaseUsersControllerUser(
    //   this.userId,
    //   undefined,
    //   undefined,
    //   0,
    // ).subscribe((res: any) => {
    //   this.user = res;
    //   this.userType.id = this.user.userType.id;
    //   this.userId = this.userType.id;
    //   console.log('userType',this.userId);
    //   console.log('country',this.user.country)
    //   // console.log('user',this.user);

    // // if(this.userType.id == 1){ //1= sector admin
    // //   console.log('userType.........',this.userType.id)
    // //  this.selectedTypeList = ['data provider', 'External']
    // //   console.log('selectedTypeList1',this.selectedTypeList)
    // // }else(this.userType.id == 2) // 2== country admin
    // // this.selectedTypeList = ['ndc']
    // //   console.log('selectedTypeList2',this.selectedTypeList)
    // })
    // });



    // this.typeService
    // .findAllTypesByUserType(
    //   this.userId
    // ).subscribe((res: any) => {
    //   this.selectedTypeList = res.data;
    //   console.log('aLtype',this.selectedTypeList);
    // });

    this.serviceProxy
      .getManyBaseInstitutionTypeControllerInstitutionType(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,    //name: "UNFCCC Focal Point"
        0,
        0
      ).subscribe((res: any) => {
        this.selectedTypeList = res.data;
        if(this.dataCollectionModuleStatus == 0){
          console.log('dataCollectionModuleStatus',this.dataCollectionModuleStatus)
          this.selectedTypeList = this.selectedTypeList.filter((o: any) => o.name != "Data provider" && o.name != "Data Collection Team"&& o.name != "QC Team");
       
       
        }
        if (this.usrrole == "Technical Team") {

          this.selectedTypeList1 = this.selectedTypeList.filter((o: any) => o.name != "UNFCCC Focal Point" && o.name != "NDC Unit" && o.name != "Technical Team" && o.name != "Data Collection Team" && o.name != "QC Team");
        }
        else if (this.usrrole == "Data Collection Team") {
          this.selectedTypeList1 = this.selectedTypeList.filter((o: any) => o.name == "Data provider");
        }
        else if (this.usrrole == "Country Admin") {
          this.selectedTypeList1 = this.selectedTypeList;
        }
        else {

          this.selectedTypeList1 = this.selectedTypeList.filter((o: any) => o.name != "UNFCCC Focal Point" && o.name != "NDC Unit");
        }


      });

    this.serviceProxy
      .getManyBaseInstitutionCategoryControllerInstitutionCategory(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe((res: any) => {
        // console.log("category",res)
        this.categoryList = res.data;
        console.log('cat list', this.categoryList)
      });


    let filter: string[] = new Array();

    if (this.sectorId) {
      filter.push('id||$eq||' + this.sectorId)

    }

    this.serviceProxy
      .getManyBaseSectorControllerSector(
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
      ).subscribe((res: any) => {
        this.sectorList = res.data;
        console.log("seclist------",res.data)
       // this.sectorList = this.sectorList.filter((o)=>o.id == this.sectorId);
        console.log('sector........', this.sectorList);
      //  this.insector = this.sectorList[0];


      });

  }

  onInstitutionChange(event:any)
{

  if(['Data Collection Team','QC Team','Technical Team'].includes(event.name)){
  this.inname = event.name
  }
  else{
    this.inname = ""

  }

}
onInstitutionNameChange(event:any){
  this.institutionProxy.getInsti(
    event,
    this.userId,
  ).subscribe((a) => {
    if(a.length>0 && event.length>0){
      this.insName=true;
    }
    else this.insName=false;
    });
}

  async saveForm(formData: NgForm) {


    if (formData.valid) {

      console.log("formData===")



      let secternew = new Sector();
      let country = new Country();
      country.id = this.countryId;
      console.log('country', country)
      secternew.id = this.insector.id;
      let institution = new Institution();
      // console.log('user logged',this.userId);
      console.log(this.insector)

      institution.name = this.inname;
      institution.description = this.indescription;
      institution.category = this.incategory;
      institution.type = this.intype;
      institution.address = this.inaddress;
      institution.sector = secternew;
      institution.country = country;
      institution.telephoneNumber = this.intelephoneNumber;
      institution.email = this.inmail;

      // console.log('institution........gggg',institution);


      if (institution.sector) {
        let sector = new Sector();
        sector.id = this.insector.id;
        this.institution.sector = sector;
        // console.log('entered sector',this.institution.sector)
      }



      if (this.institution.type) {
        let type = new InstitutionType();
        type.id = this.intype.id;
        this.institution.type = type;
      }

      if (this.institution.category) {
        let category = new InstitutionCategory();
        category.id = this.incategory.id;
        this.institution.category = category;
      }

      if (institution.id !== 0) {


        console.log('institution........', institution)


        this.serviceProxy
          .createOneBaseInstitutionControllerInstitution(institution)
          .subscribe(
            (res) => {
              console.log('resss', res)
              
              
              this.messageService.add({severity:'success', summary:'Success', detail:institution.name +' has saved successfully',  closable: true,});
            
              
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
            this.onBackClick();    
          },1000);
        // this.isSaving = false;
        console.log(formData);
      }

    } else {
      alert('Fill all the mandetory fields')
    }
    // }
  }
  
  

  deleteInstitution(institution: Institution) {
    // let dateTure = moment(deletedAt).isSame(moment());

    // if(institution.status == 0){ 
    this.confirmationService.confirm({
      message: 'confirm you want to deactivate institution, this action will also deactivate users associated with the institution?',
      accept: () => {
        console.log('delevting', institution)
        this.updateStatus(institution);
        this.institutionProxy
          .deactivateInstitution(institution.id)
          .subscribe((res) => {

            this.confirmationService.confirm({

              accept: () => {
                console.log('delevted sucess')

              }
            })

          })

      },
    });
    // }
    // )
    // }
  }

  

  updateStatus(institution: Institution) {

    console.log('sta', institution.status)

    let statusUpdate = 1;
    this.institution.status = statusUpdate;


    let sector = new Sector();
    sector.id = this.institution.sector?.id;
    this.institution.sector = sector;


    if (this.institution.type) {
      let type = new InstitutionType();
      type.id = this.institution.type?.id;
      this.institution.type = type;
    }

    if (this.institution.category) {
      let category = new InstitutionCategory();
      category.id = this.institution.category?.id;
      this.institution.category = category;
    }

    // if(this.institution.status){
    //   let status 
    // }

    this.serviceProxy

      .updateOneBaseInstitutionControllerInstitution(institution.id, institution)
      .subscribe((res) => {
        console.log('done............'),
          this.messageService.add({
            severity: 'success',
            summary: 'Deactivated successfully',
            detail:
              institution.status === 1
                ? this.institution.name + ' is deactivated' : '',
            closable: true,
          });
      },
        (err) => {
          console.log('error............'),
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Failed to deactivate, please try again.',
              sticky: true,
            });
        }
      );

  }

  activateInstitution(institution: Institution) {
    // alert('helloooo')
    // this.confirmationService.confirm({
    // message: 'confirm you want to deactivate institution, this action will also deactivate users associated with the institution?',
    // accept: () => {
    // console.log('activating....',institution)
    // // this.updateStatus(institution);
    // // this.institutionProxy
    // // .deactivateInstitution(institution.id)
    // // .subscribe((res) => {

    //   this.confirmationService.confirm({

    //     accept: () => {
    //       console.log('activate sucess')

    //     }
    // })

    // })

    // },
    // });




    console.log('sta', institution.status)


    if (institution.status == 1) {
      this.statusUpdate = 0;


    }
    else {
      this.statusUpdate = 1;

    }

    //  let statusUpdate = 0;
    this.institution.status = this.statusUpdate;


    let sector = new Sector();
    sector.id = this.institution.sector?.id;
    this.institution.sector = sector;


    if (this.institution.type) {
      let type = new InstitutionType();
      type.id = this.institution.type?.id;
      this.institution.type = type;
    }

    if (this.institution.category) {
      let category = new InstitutionCategory();
      category.id = this.institution.category?.id;
      this.institution.category = category;
    }

    // if(this.institution.status){
    //   let status 
    // }

    this.serviceProxy

      .updateOneBaseInstitutionControllerInstitution(institution.id, institution)
      .subscribe((res) => {
        console.log('done............'),
          this.messageService.add({
            severity: 'success',
            summary: 'Activated successfully',
            detail:
              institution.status === 0
                ? this.institution.name + ' is activated' : '',

            closable: true,
          });
      },
        (err) => {
          console.log('error............'),
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Failed to activate, please try again.',
              sticky: true,
            });
        }
      );

  }



  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Are you sure?',
      detail: 'Confirm to proceed',
    });
  }


  onBackClick() {
    this.router.navigate(['/institution-list']);
  }

  edit(institution: Institution) {
    this.router.navigate(['edit-institution'], {
      queryParams: { id: institution.id }
    });
  }


}

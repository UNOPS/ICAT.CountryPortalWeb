import { Component, OnInit } from '@angular/core';
import {
  Country,
  Institution,
  InstitutionCategory,
  InstitutionControllerServiceProxy,
  InstitutionType,
  ServiceProxy,
  User,
  UserType,
  UserTypeControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng//api';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { flatten } from '@angular/compiler';
import decode from 'jwt-decode';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [ConfirmationService],
})
export class UserFormComponent implements OnInit {
  temp1: string;
  temp2: string;
  temp3: string;

  user: User = new User();

  userTypes: any[] = [];
  selectedUserTypesFordrop: UserType[] = [];
  selecteduserType: any = {};

  sss:any = {
    ae_createdBy: null,
      ae_createdOn: null,
      ae_description: "MRV Admin",
      ae_editedBy: null,
      ae_editedOn: null,
      ae_id: 4,
      ae_name: "MRV Admin",
      ae_sortOrder: 4,
      ae_status: 0,
      int_institutionTypeId: 2,
      int_userTypeId: 4}

  institutions: Institution[] = [];

  userTitles: { id: number; name: string }[] = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Mrs.' },
    { id: 3, name: 'Ms.' },
    { id: 4, name: 'Dr.' },
    { id: 5, name: 'Professor' },
  ];
  selecteduserTitle: { id: number; name: string };

  isNewUser: boolean = true;
  editUserId: number;
  isEmailUsed: boolean = false;
  usedEmail: string = '';

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  countryId: number;
  sectorId:number;
  userRole:string;

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private UserTypeServiceProxy: UserTypeControllerServiceProxy,
    private instProxy:InstitutionControllerServiceProxy
  ) {}

  ngOnInit(): void {

    console.log("ngonitit")
    const token = localStorage.getItem('access_token')!;
  
      const tokenPayload = decode<any>(token);
      this.countryId=tokenPayload.countryId;

      let country=new Country()
       country.id=this.countryId;
      // country.id=2;
      this.sectorId = tokenPayload.sectorId;
      this.userRole = tokenPayload.roles[0]
      console.log("user role..",this.userRole)

    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.telephone = '';
    this.user.country=country;

    this.route.queryParams.subscribe((params) => {
      this.editUserId = params['id'];
      if (this.editUserId && this.editUserId > 0) {
        
        this.isNewUser = false;
        this.serviceProxy
          .getOneBaseUsersControllerUser(
            this.editUserId,
            undefined,
            undefined,
            0
          )
          .subscribe((res: any) => {
            console.log('getUser====', res);
          //  this.onInstitutionChange2(res);
            //this.selecteduserType = 
            this.onInstitutionChange2(res);
            this.user = res;
            this.selecteduserType={"ae_name":this.user.userType.description,
                                     "ae_id" : this.user.userType.id      }
            this.selectedUserTypesFordrop.push(this.selecteduserType)
            

          

          

     

            // this.institutions.forEach((ins) => {
            //   if (ins.id == this.user.institution.id) {
            //     this.user.institution = ins;
            //     console.log('ins set =======================');
            //   }
            // });
          });
      }
    });

    this.UserTypeServiceProxy.getUserTypes().subscribe((res: any) => {
      console.log('userTypes res ============', res);
      this.userTypes = res;
      console.log('userTypes============', this.userTypes);
    });

    // this.serviceProxy
    //   .getManyBaseUserTypeControllerUserType(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     ['institutionType'],
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     console.log('userTypes res ============', res);
    //     this.userTypes = res.data;
    //     console.log('userTypes============', this.userTypes);
    //   });

    // this.serviceProxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     1,
    //     0
    //   )




      this.instProxy.getInstitutionForManageUsers(0,0)
      .subscribe((res) => {
        console.log('institutions res ============', res);
        this.institutions = res.items;

        if (this.user?.institution) {
          this.institutions.forEach((ins: Institution) => {
            if (ins.id == this.user.institution.id) {
              let cat = ins.category;
              let type = ins.type;
              ins.category = new InstitutionCategory(cat)
              ins.type = new InstitutionType(type)
              let _ins = new Institution(ins)
              console.log(_ins)
              this.user.institution = _ins;
              console.log('ins set =======================');
            }
          });
        }
        console.log('institutions============', this.institutions);
        // remove UNFCCC Focal Point type institution
        // this.institutions = this.institutions.filter((o)=> o.type.id != 1);

        
        

       if(this.userRole == 'Data Collection Team')
       {
        this.institutions = this.institutions.filter((o)=>o.country.id == this.countryId && o.sectorId == this.sectorId && o.type.id == 3);
       }


      });
  }

  onChangeUser(event: any) {
    //console.log(event);
    // this.user.title = event.value?.name;
  }

  async saveUser(userForm: NgForm) {
    console.log('userForm================', userForm);
   

    if (userForm.valid) {
      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = '';

        let tempUsers = await this.serviceProxy
          .getManyBaseUsersControllerUser(
            undefined,
            undefined,
            ['email||$eq||' + this.user.email],
            undefined,
            ['firstName,ASC'],
            ['institution'],
            1,
            0,
            0,
            0
          )
          .subscribe((res) => {
            if (res.data.length > 0) {
              this.isEmailUsed = true;
              this.usedEmail = res.data[0].email;
              // alert("Email address is already in use, please select a diffrent email address to create a new user.")
              // this.confirmationService.confirm({
              //   message:
              //     'Email address is already in use, please select a diffrent email address to create a new user.!',
              //   header: 'Error!',
              //   //acceptIcon: 'icon-not-visible',
              //   rejectIcon: 'icon-not-visible',
              //   rejectVisible: false,
              //   acceptLabel: 'Ok',
              //   accept: () => {
              //     // this.onBackClick();
              //   },

              //   reject: () => {},
              // });
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Email address is already in use, please select a diffrent email address to create a new user.!',
                sticky: true,
              });
            } else {
              // create user
              this.user.username = this.user.email;
              this.user.status = 0;
              // this.user.status = 1;

              let userType = new UserType();
               userType.id = this.selecteduserType.ae_id;
              this.user.userType = userType;

              let insTemp = this.user.institution;
              this.user.institution = new Institution();
              this.user.institution.id = insTemp.id;
              this.coreatingUser = true;
              console.log("userd",this.user)


              this.serviceProxy
                .createOneBaseUsersControllerUser(this.user)
                .subscribe(
                  (res) => {
                    // this.confirmationService.confirm({
                    //   message: 'User is created successfully!',
                    //   header: 'Confirmation',
                    //   //acceptIcon: 'icon-not-visible',
                    //   rejectIcon: 'icon-not-visible',
                    //   rejectVisible: false,
                    //   acceptLabel: 'Ok',
                    //   accept: () => {
                    //     this.onBackClick();
                    //   },

                    //   reject: () => {},
                    // });
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'User is created successfully!',
                      closable: true,
                    });
                  },
                  (error) => {
                    this.coreatingUser = false;
                    alert('An error occurred, please try again.');
                    console.log('Error', error);
                  },
                  () => {
                    this.coreatingUser = false;
                  }
                );
                setTimeout(() => {
                  this.onBackClick();    
                },1000);
            }
          });

        // this.serviceProxy.createOneBaseUserv2ControllerUser(this.user).subscribe(res => {
        //   alert("User created !");
        //   //this.DisplayAlert('User created !', AlertType.Message);

        //   console.log("edit user", res.id);

        //   this.router.navigate(['/user'], { queryParams: { id: res.id } });

        // }, error => {
        //   alert("An error occurred, please try again.")
        //   // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        //   console.log("Error", error);
        // });
      } else {
        // let insTemp = this.user.institution
        // this.user.institution = new Institution();
        // this.user.institution.id = insTemp.id;
        //update user
        this.serviceProxy
          .updateOneBaseUsersControllerUser(this.user.id, this.user)
          .subscribe(
            (res) => {
              // this.confirmationService.confirm({
              //   message: 'User is updated successfully!',
              //   header: 'Confirmation',
              //   //acceptIcon: 'icon-not-visible',
              //   rejectIcon: 'icon-not-visible',
              //   rejectVisible: false,
              //   acceptLabel: 'Ok',
              //   accept: () => {
              //     // this.onBackClick();
              //   },

              //   reject: () => {},
              // });
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully Saved',
                closable: true,
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again.',
                closable: true,
              });
              // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

              console.log('Error', error);
            }
          );
          setTimeout(() => {
            this.onBackClick();    
          },1000);
      }
    }
    else{
      alert("Fill all the mandetory fields")
    }
  }

  onBackClick() {
    this.router.navigate(['/user-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteUser();
      },
      reject: () => {},
    });
    // this.router.navigate(['/user-list']);
  }

  deleteUser() {
    this.serviceProxy
      .deleteOneBaseUsersControllerUser(this.user.id)
      .subscribe((res) => {
        //this.DisplayAlert('Deleted successfully.', AlertType.Message);
        // this.confirmationService.confirm({
        //   message: 'User is deleted successfully!',
        //   header: 'Delete Confirmation',
        //   //acceptIcon: 'icon-not-visible',
        //   rejectIcon: 'icon-not-visible',
        //   rejectVisible: false,
        //   acceptLabel: 'Ok',
        //   accept: () => {
        //     this.onBackClick();
        //   },

        //   reject: () => {},
        // });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Delete Confirmation',
          closable: true,
        });
      });
  }
  

 async onInstitutionChange(event: any) {
    console.log('event====1',event);
  
    let tempList= this.userTypes

//in here check if there are any users  for inst type 1,2,3 for that certent country

    // if(event.type.id==1){
    //   let res= await this.instProxy.getInstitutionForUsers(event.id,3).toPromise()
    // }
 
    
     if(event.type.id==2){
      let res= await this.instProxy.getInstitutionForUsers(event.id,3).toPromise()
    
      if(res==1){
   
       tempList= tempList.filter((a)=> a.ae_name!="Sector Admin")
      }
    }
    else if(event.type.id==3){
      
      let res= await this.instProxy.getInstitutionForUsers(event.id,8).toPromise();
     
      if(res==1){
        tempList= tempList.filter((a)=> a.ae_name!="Institution Admin")
       }
    }

    if(this.userRole ==="Institution Admin"){
      this.selectedUserTypesFordrop = tempList.filter((a)=> a.ae_name==="Data Entry Operator")
      // console.log(this.userTypes) 
       }
  else{
 
    this.selectedUserTypesFordrop = tempList.filter(
      (a) => a.int_institutionTypeId === event.type.id
    );



  }

    console.log('eventtypeID===', event.type.id);
    console.log('selectedUserTypesFordrop=====',this.selectedUserTypesFordrop);

  }

  onInstitutionChange2(aaa: any) {
    console.log('event====',aaa.institution);

  
    this.selectedUserTypesFordrop = this.userTypes.filter(
      (a) => a.int_institutionTypeId ===  1//aaa.institution.type.id
    );
    console.log('eventtypeID===', aaa.institution.type.id);
    console.log('selectedUserTypesFordrop=====',this.selectedUserTypesFordrop);

  }
  
}

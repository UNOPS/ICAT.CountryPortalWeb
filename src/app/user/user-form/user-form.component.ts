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
import { Router } from '@angular/router';
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

  sss: any = {
    ae_createdBy: null,
    ae_createdOn: null,
    ae_description: 'MRV Admin',
    ae_editedBy: null,
    ae_editedOn: null,
    ae_id: 4,
    ae_name: 'MRV Admin',
    ae_sortOrder: 4,
    ae_status: 0,
    int_institutionTypeId: 2,
    int_userTypeId: 4,
  };

  institutions: Institution[] = [];

  userTitles: { id: number; name: string }[] = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Mrs.' },
    { id: 3, name: 'Ms.' },
    { id: 4, name: 'Dr.' },
    { id: 5, name: 'Professor' },
  ];
  selecteduserTitle: { id: number; name: string };

  isNewUser = true;
  editUserId: number;
  isEmailUsed = false;
  usedEmail = '';

  alertHeader = 'User';
  alertBody: string;
  showAlert = false;

  coreatingUser = false;
  countryId: number;
  sectorId: number;
  userRole: string;

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private UserTypeServiceProxy: UserTypeControllerServiceProxy,
    private instProxy: InstitutionControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);
    this.countryId = tokenPayload.countryId;

    const country = new Country();
    country.id = this.countryId;
    this.sectorId = tokenPayload.sectorId;
    this.userRole = tokenPayload.roles[0];

    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.telephone = '';
    this.user.country = country;

    this.route.queryParams.subscribe((params) => {
      this.editUserId = params['id'];
      if (this.editUserId && this.editUserId > 0) {
        this.isNewUser = false;
        this.serviceProxy
          .getOneBaseUsersControllerUser(
            this.editUserId,
            undefined,
            undefined,
            0,
          )
          .subscribe((res: any) => {
            this.onInstitutionChange2(res);
            this.user = res;
            this.selecteduserType = {
              ae_name: this.user.userType.description,
              ae_id: this.user.userType.id,
            };
            this.selectedUserTypesFordrop.push(this.selecteduserType);
          });
      }
    });

    this.UserTypeServiceProxy.getUserTypes().subscribe((res: any) => {
      this.userTypes = res;
    });

    this.instProxy.getInstitutionForManageUsers(0, 0).subscribe((res) => {
      this.institutions = res.items;

      if (this.user?.institution) {
        this.institutions.forEach((ins: Institution) => {
          if (ins.id == this.user.institution.id) {
            const cat = ins.category;
            const type = ins.type;
            ins.category = new InstitutionCategory(cat);
            ins.type = new InstitutionType(type);
            const _ins = new Institution(ins);

            this.user.institution = _ins;
          }
        });
      }

      if (this.userRole == 'Data Collection Team') {
        this.institutions = this.institutions.filter(
          (o) =>
            o.country.id == this.countryId &&
            o.sectorId == this.sectorId &&
            o.type.id == 3,
        );
      }
    });
  }

  onChangeUser(event: any) {}

  async saveUser(userForm: NgForm) {
    if (userForm.valid) {
      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = '';

        const tempUsers = await this.serviceProxy
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
            0,
          )
          .subscribe((res) => {
            if (res.data.length > 0) {
              this.isEmailUsed = true;
              this.usedEmail = res.data[0].email;

              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail:
                  'Email address is already in use, please select a diffrent email address to create a new user.!',
                sticky: true,
              });
            } else {
              this.user.username = this.user.email;
              this.user.status = 0;

              const userType = new UserType();
              userType.id = this.selecteduserType.ae_id;
              this.user.userType = userType;

              const insTemp = this.user.institution;
              this.user.institution = new Institution();
              this.user.institution.id = insTemp.id;
              this.coreatingUser = true;

              this.serviceProxy
                .createOneBaseUsersControllerUser(this.user)
                .subscribe(
                  (res) => {
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
                  },
                  () => {
                    this.coreatingUser = false;
                  },
                );
              setTimeout(() => {
                this.onBackClick();
              }, 1000);
            }
          });
      } else {
        this.serviceProxy
          .updateOneBaseUsersControllerUser(this.user.id, this.user)
          .subscribe(
            (res) => {
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
            },
          );
        setTimeout(() => {
          this.onBackClick();
        }, 1000);
      }
    } else {
      alert('Fill all the mandetory fields');
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
  }

  deleteUser() {
    this.serviceProxy
      .deleteOneBaseUsersControllerUser(this.user.id)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Delete Confirmation',
          closable: true,
        });
      });
  }

  async onInstitutionChange(event: any) {
    let tempList = this.userTypes;

    if (event.type.id == 2) {
      const res = await this.instProxy
        .getInstitutionForUsers(event.id, 3)
        .toPromise();

      if (res == 1) {
        tempList = tempList.filter((a) => a.ae_name != 'Sector Admin');
      }
    } else if (event.type.id == 3) {
      const res = await this.instProxy
        .getInstitutionForUsers(event.id, 8)
        .toPromise();

      if (res == 1) {
        tempList = tempList.filter((a) => a.ae_name != 'Institution Admin');
      }
    }

    if (this.userRole === 'Institution Admin') {
      this.selectedUserTypesFordrop = tempList.filter(
        (a) => a.ae_name === 'Data Entry Operator',
      );
    } else {
      this.selectedUserTypesFordrop = tempList.filter(
        (a) => a.int_institutionTypeId === event.type.id,
      );
    }
  }

  onInstitutionChange2(aaa: any) {
    this.selectedUserTypesFordrop = this.userTypes.filter(
      (a) => a.int_institutionTypeId === 1,
    );
  }
}

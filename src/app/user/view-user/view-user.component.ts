import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import {
  Institution,
  ServiceProxy,
  User,
  UsersControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit {
  user: User = new User();
  institutions: Institution[] = [];

  isNewUser = true;
  editUserId: number;
  isActive = 0;
  itsMe = false;
  checkRole = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private userControllerService: UsersControllerServiceProxy,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);

    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.telephone = '';

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
            this.user = res;

            this.isActive = this.user.status;
            this.itsMe = this.user.username == tokenPayload.usr;
            let loggedUserRole = tokenPayload.roles[0]
            if (this.user.userType.name == "Country Admin") {

            }
            else if (this.user.userType.name == "Sector Admin") {

              this.checkRole = loggedUserRole != "Country Admin"

            }
            else if (this.user.userType.name == "MRV Admin") {
              this.checkRole = loggedUserRole != "Sector Admin" || loggedUserRole != "MRV Admin"

            }
            else if (this.user.userType.name == "Technical Team" || this.user.userType.name == "QC Team" || this.user.userType.name == "Data Collection Team") {
              this.checkRole = loggedUserRole != "Sector Admin" && loggedUserRole != "MRV Admin"

            }
            else if (this.user.userType.name == "Institution Admin" || this.user.userType.name == "Data Entry Operator") {
              this.checkRole = loggedUserRole != "Sector Admin" && loggedUserRole != "MRV Admin" && loggedUserRole != "Technical Team" && loggedUserRole != "Data Collection Team"

            }
            else { }
            this.institutions.forEach((ins) => {
              if (ins.id == this.user.institution.id) {
                this.user.institution = ins;
              }
            });
          });
      }
    });
  }
  onBackClick() {
    this.router.navigate(['/user-list']);
  }
  onDeleteClick() {
    this.userControllerService.changeStatus(this.user.id, this.isActive == 0 ? 1 : 0).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully ${this.isActive == 0 ? 'Deactivate' : 'activate'}` });
      this.user = res;
      this.isActive = this.user.status;
    });
  }

  confirmDeletUser() {
    this.confirmationService.confirm({
      message: `Are you sure that you want to ${this.isActive == 0 ? 'deactivate' : 'activate'} this User?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDeleteClick()

      },
      reject: (type: ConfirmEventType) => {
      }
    });
  }
}

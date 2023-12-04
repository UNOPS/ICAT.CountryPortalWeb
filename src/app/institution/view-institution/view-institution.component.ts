import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Institution,
  InstitutionCategory,
  InstitutionControllerServiceProxy,
  InstitutionType,
  Sector,
  ServiceProxy,
  User,
  UsersControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

@Component({
  selector: 'app-view-institution',
  templateUrl: './view-institution.component.html',
  styleUrls: ['./view-institution.component.css'],
})
export class ViewInstitutionComponent implements OnInit {
  userId = 0;
  user: User = new User();
  userTypeId = 0;
  typeList: InstitutionType[] = [];
  selectedTypeList: InstitutionType[] = [];
  categoryList: InstitutionCategory[] = [];
  sectorList: Sector[] = [];
  institutionId = 0;
  title: string;
  institution: Institution = new Institution();

  rejectComment: string;
  rejectCommentRequried: boolean;
  savedInstitution: Institution;
  statusUpdate: number;
  @ViewChild('op') overlay: any;
  userName: string;

  constructor(
    private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private institutionProxy: InstitutionControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private userProxy: UsersControllerServiceProxy,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  OnShowOerlay() {
    this.rejectComment = '';
    this.rejectCommentRequried = false;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const currenyUser = decode<any>(token);
    this.userName = currenyUser.usr;

    this.userProxy.findUserByUserName(this.userName).subscribe((res: any) => {
      this.user = res;
    });

    this.userId = 4;

    this.serviceProxy
      .getOneBaseUsersControllerUser(this.userId, undefined, undefined, 0)
      .subscribe((res: any) => {
        this.userTypeId = this.user.userType.id;

        this.serviceProxy
          .getManyBaseInstitutionTypeControllerInstitutionType(
            undefined,
            undefined,
            undefined,
            undefined,
            ['name,ASC'],
            undefined,
            1000,
            0,
            0,
            0,
          )
          .subscribe((res: any) => {
            this.selectedTypeList = res.data;

            if (this.userTypeId == 1) {
              this.typeList.push(this.selectedTypeList[0]);
            }
            if (this.userTypeId == 2) {
              this.typeList.push(this.selectedTypeList[1]);
              this.typeList.push(this.selectedTypeList[2]);
            }
          });
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
        0,
      )
      .subscribe((res: any) => {
        this.categoryList = res.data;
      });

    this.serviceProxy
      .getManyBaseSectorControllerSector(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.sectorList = res.data;
      });

    this.route.queryParams.subscribe((params) => {
      this.institutionId = params['id'];
      this.serviceProxy
        .getOneBaseInstitutionControllerInstitution(
          this.institutionId,
          undefined,
          undefined,
          0,
        )
        .subscribe((res) => {
          this.institution = res;
        });
    });

    if (this.institutionId == 0) {
      this.title = 'Add Institution';
    } else {
      this.title = 'View Institution';
    }
  }

  deleteInstitution(institution: Institution) {
    this.confirmationService.confirm({
      message:
        'Confirm you want to deactivate institution, this action will also deactivate users associated with the institution?',
      accept: () => {
        this.updateStatus(institution);
        this.institutionProxy
          .deactivateInstitution(institution.id)
          .subscribe((res) => {
            this.confirmationService.confirm({
              accept: () => {},
            });
          });
      },
    });
  }

  updateStatus(institution: Institution) {
    const statusUpdate = 1;
    this.institution.status = statusUpdate;

    const sector = new Sector();
    sector.id = this.institution.sector?.id;
    this.institution.sector = sector;

    if (this.institution.type) {
      const type = new InstitutionType();
      type.id = this.institution.type?.id;
      this.institution.type = type;
    }

    if (this.institution.category) {
      const category = new InstitutionCategory();
      category.id = this.institution.category?.id;
      this.institution.category = category;
    }

    this.serviceProxy

      .updateOneBaseInstitutionControllerInstitution(
        institution.id,
        institution,
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deactivated successfully',
            detail:
              institution.status === 1
                ? this.institution.name + ' is deactivated'
                : '',
            closable: true,
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Failed Deactiavted, please try again.',
            sticky: true,
          });
        },
      );
  }

  activateInstitution(institution: Institution) {
    if (this.user.institution.id != institution.id) {
      if (institution.status == 1) {
        this.statusUpdate = 0;
      } else {
        this.statusUpdate = 1;
      }
    } else {
      alert('Can not deactivate your own institution');
      return;
    }

    this.institution.status = this.statusUpdate;

    const sector = new Sector();
    sector.id = this.institution.sector?.id;
    this.institution.sector = sector;

    if (this.institution.type) {
      const type = new InstitutionType();
      type.id = this.institution.type?.id;
      this.institution.type = type;
    }

    if (this.institution.category) {
      const category = new InstitutionCategory();
      category.id = this.institution.category?.id;
      this.institution.category = category;
    }

    this.serviceProxy

      .updateOneBaseInstitutionControllerInstitution(
        institution.id,
        institution,
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary:
              institution.status === 0
                ? 'Activated successfully'
                : 'Decativated successfully',
            detail:
              institution.status === 0
                ? this.institution.name + ' is activated'
                : this.institution.name + 'is decativated',
            closable: true,
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Failed Deactiavted, please try again.',
            sticky: true,
          });
        },
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
      queryParams: { id: institution.id },
    });
  }
}

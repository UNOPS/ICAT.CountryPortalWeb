import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Country,
  Institution,
  InstitutionCategory,
  InstitutionControllerServiceProxy,
  InstitutionType,
  Sector,
  SectorControllerServiceProxy,
  ServiceProxy,
  User,
  UserType,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css'],
})
export class InstitutionComponent implements OnInit {
  isSaving = false;
  insName = false;
  institution: Institution = new Institution();
  sectorList: Sector[] = [];
  typeList: InstitutionType[] = [];
  selectedTypeList: string[] = [];
  selectedTypeList1: string[] = [];
  categoryList: InstitutionCategory[] = [];
  institutionId = 0;
  title: string;
  user: User = new User();
  userId = 0;
  userType: UserType = new UserType();
  type: InstitutionType = new InstitutionType();
  Deactivate = 'Deactivate';
  deletedAt: Date;
  isNew = true;

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

  sectorAdminId = 2;
  institutionAdminId = 0;

  rejectComment: string;
  rejectCommentRequried: boolean;
  savedInstitution: Institution;
  statusUpdate = 0;
  @ViewChild('op') overlay: any;
  usrrole: any;
  sectorId: any;
  telephoneLength:number;
  userSectorId:number = 0;
  dataCollectionModuleStatus:number;
  internalTeam:boolean = false;
  constructor(
    private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private institutionProxy: InstitutionControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private sectorProxy: SectorControllerServiceProxy,
    private cdr: ChangeDetectorRef,
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

    const tokenPayload = decode<any>(token);

    this.usrrole = tokenPayload.roles[0];
    this.sectorId = tokenPayload.sectorId;
    this.countryId = tokenPayload['countryId'];
    this.dataCollectionModuleStatus = tokenPayload.moduleLevels[3];

    if (this.usrrole == 'Sector Admin' || this.usrrole == 'MRV Admin') {
      this.internalTeam = true;
    }

    this.route.queryParams.subscribe((params) => {
      this.institutionId = params['id'];

      if (this.institutionId && this.institutionId > 0) {
        this.isNew = false;
        this.serviceProxy
          .getOneBaseInstitutionControllerInstitution(
            this.institutionId,
            undefined,
            undefined,
            0,
          )
          .subscribe((res) => {
            this.institution = res;

            this.intype = this.institution?.type;
          });
      }
    });

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
        if (this.dataCollectionModuleStatus == 0) {
          this.selectedTypeList = this.selectedTypeList.filter(
            (o: any) =>
              o.name != 'Data provider' &&
              o.name != 'Data Collection Team' &&
              o.name != 'QC Team',
          );
        }
        if (this.usrrole == 'Technical Team') {
          this.selectedTypeList1 = this.selectedTypeList.filter(
            (o: any) =>
              o.name != 'UNFCCC Focal Point' &&
              o.name != 'NDC Unit' &&
              o.name != 'Technical Team' &&
              o.name != 'Data Collection Team' &&
              o.name != 'QC Team',
          );
        } else if (this.usrrole == 'Data Collection Team') {
          this.selectedTypeList1 = this.selectedTypeList.filter(
            (o: any) => o.name == 'Data provider',
          );
        } else if (this.usrrole == 'Country Admin') {
          this.selectedTypeList1 = this.selectedTypeList;
        } else {
          this.selectedTypeList1 = this.selectedTypeList.filter(
            (o: any) => o.name != 'UNFCCC Focal Point' && o.name != 'NDC Unit',
          );
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
        0,
      )
      .subscribe((res: any) => {
        this.categoryList = res.data;
      });

    const filter: string[] = [];

    if (this.sectorId) {
      filter.push('id||$eq||' + this.sectorId);
    }

    this.sectorProxy.getCountrySector(this.countryId).subscribe((res: any) => {
      this.sectorList = res;
    });
  }

  onInstitutionChange(event: any) {
    if (
      ['Data Collection Team', 'QC Team', 'Technical Team'].includes(event.name)
    ) {
      this.inname = event.name;
    } else {
      this.inname = '';
    }
  }
  onInstitutionNameChange(event: any) {
    this.institutionProxy.getInsti(event, this.userId).subscribe((a) => {
      if (a.length > 0 && event.length > 0) {
        this.insName = true;
      } else this.insName = false;
    });
  }

  async saveForm(formData: NgForm) {
    if (formData.valid) {
      const secternew = new Sector();
      const country = new Country();
      country.id = this.countryId;

      secternew.id = this.insector.id;
      const institution = new Institution();

      institution.name = this.inname;
      institution.description = this.indescription;
      institution.category = this.incategory;
      institution.type = this.intype;
      institution.address = this.inaddress;
      institution.sector = secternew;
      institution.country = country;
      institution.telephoneNumber = this.intelephoneNumber;
      institution.email = this.inmail;

      if (institution.sector) {
        const sector = new Sector();
        sector.id = this.insector.id;
        this.institution.sector = sector;
      }

      if (this.institution.type) {
        const type = new InstitutionType();
        type.id = this.intype.id;
        this.institution.type = type;
      }

      if (this.institution.category) {
        const category = new InstitutionCategory();
        category.id = this.incategory.id;
        this.institution.category = category;
      }

      if (institution.id !== 0) {
        this.serviceProxy
          .createOneBaseInstitutionControllerInstitution(institution)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: institution.name + ' has saved successfully',
                closable: true,
              });
              setTimeout(() => {
                this.onBackClick();
              }, 1000);
            },

            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Internal server error, please try again.',
                sticky: true,
              });
            },
          );
       
      }
    } else {
      alert('Fill all the mandetory fields');
    }
  }

  deleteInstitution(institution: Institution) {
    this.confirmationService.confirm({
      message:
        'confirm you want to deactivate institution, this action will also deactivate users associated with the institution?',
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
            detail: 'Failed to deactivate, please try again.',
            sticky: true,
          });
        },
      );
  }

  activateInstitution(institution: Institution) {
    if (institution.status == 1) {
      this.statusUpdate = 0;
    } else {
      this.statusUpdate = 1;
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
            summary: 'Activated successfully',
            detail:
              institution.status === 0
                ? this.institution.name + ' is activated'
                : '',

            closable: true,
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Failed to activate, please try again.',
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

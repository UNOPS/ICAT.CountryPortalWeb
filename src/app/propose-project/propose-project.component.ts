import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import {} from 'googlemaps';
import {
  CaActionHistory,
  Country,
  Documents,
  DocumentsDocumentOwner,
  FinancingScheme,
  Institution,
  Ndc,
  NdcControllerServiceProxy,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
  SubNdc,
  User,
  SectorControllerServiceProxy,
  UsersControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import jspdf from 'jspdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import decode from 'jwt-decode';

/// <reference types="googlemaps" />

@Component({
  selector: 'app-propose-project',
  templateUrl: './propose-project.component.html',
  styleUrls: ['./propose-project.component.css'],
  providers: [MessageService],
})
export class ProposeProjectComponent implements OnInit {
  isSaving: boolean = false;
  project: Project = new Project();
  selectedcitie: any = {};
  ndcList: Ndc[];
  options: any;
  relatedItem: Project[] = [];
  exsistingPrpject: boolean = false;
  countryList: Country[] = [];
  projectOwnerList: ProjectOwner[] = [];
  projectStatusList: ProjectStatus[] = [];
  sectorList: Sector[] = [];
  financingSchemeList: FinancingScheme[] = [];
  documents: Documents[] = [];
  documentsDocumentOwner: DocumentsDocumentOwner =
    DocumentsDocumentOwner.Project;
  editEntytyId: number = 0;
  anonymousEditEntytyId: number = 0;
  documentOwnerId: number = 0;
  proposeDateofCommence: Date;
  endDateofCommence: Date;
  isLoading: boolean = false;
  isDownloading: boolean = true;
  isDownloadMode: number = 0;
  flag: number = 0;
  isCity: number = 0;
  isMapped: number;
  likelyHood: number;
  isLikelyhoodFromDb: number;
  isPoliticalPreferenceFromDb: number;
  isFinancialFeciabilityFromDb: number;
  isAvailabiltyOfTEchFromDb: number;
  isPoliticalPreference: number = 1;
  isFinancialFeciability: number = 1;
  isAvailabiltyOfTEch: number = 1;
  selectedProject: Project;
  originalNdc: string = '';
  originalSubNdc: string = '';
  commentForJustification: string = '';
  originalApprovalStatus: string = '';
  updatedApprovalStatus: string = '';
  historyList: any[] = [];
  ndcupdatehistoryList: any[] = [];
  statusupdatehistoryList: any[] = [];
  proposedDate: string = '';
  isActionButtonSectionEnabled: boolean = false;
  userName: string = '';
  drCommentRequried: boolean;
  drComment: string;
  rejectCommentRequried: boolean;
  rejectComment: string;
  loggedUser: User;
  fullname: string = '';
  isGHG: number = 0;
  selectedApproch: string;
  approachList: string[] = ['AR1', 'AR2', 'AR3', 'AR4', 'AR5'];

  institutionList: Institution[] = [];
  institutionTypeID: number = 3;
  selectedInstitution: Institution;
  selectedDocuments: Documents[] = [];
  counID:number;

  telephoneLength:number;
  mask:string;

  isSector: boolean = false;

  @ViewChild('gmap') gmap: any;
  @ViewChild('op') overlay: any;
  @ViewChild('opDR') overlayDR: any;
  projectApprovalStatus: ProjectApprovalStatus[];
  overlays: any[];

  title = 'htmltopdf';
  wid: number;
  hgt: number;
  textdlod: any = 'Downloaded date ' + moment().format('YYYY-MM-DD HH:mm:ss');

  getUserEnterdCountry: any = '';
  disbaleNdcmappedFromDB: number;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  constructor(
    private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageService: MessageService,
    private projectProxy: ProjectControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy
  ) // private usersControllerServiceProxy: UsersControllerServiceProxy,
  // private ndcProxy:NdcControllerServiceProxy
  {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    this.counID= countryId;
    this.userName = localStorage.getItem('user_name')!;
    let filterUser: string[] = [];
    filterUser.push('username||$eq||' + this.userName);
    

    if (countryId>0){
      this.sectorProxy.getCountrySector(countryId).subscribe((res: any) => {
        this.sectorList = res;
        console.log("++++" ,this.sectorList)
      });
    }
    

    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filterUser,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.loggedUser = res.data[0];
        this.fullname =
          this.loggedUser.firstName + ' ' + this.loggedUser.lastName;
        // console.log("this.loggedUser...",this.fullname)
      });

    this.route.queryParams.subscribe((params) => {
      this.editEntytyId = 0;
      this.anonymousEditEntytyId = 0;
      this.documentOwnerId = 0;
      this.editEntytyId = params['id'];
      this.anonymousEditEntytyId = params['anonymousId'];
      if (this.editEntytyId > 0) {
        this.documentOwnerId = this.editEntytyId;
      } else if (this.anonymousEditEntytyId > 0) {
        this.documentOwnerId = this.anonymousEditEntytyId;
      }

      this.flag = params['flag'];
      if (this.flag == 1) {
        this.isDownloading = false;
      }
    });

    // console.log("this.anonymousEditEntytyId",this.anonymousEditEntytyId," this.editEntytyId", this.editEntytyId)
    if (countryId) {
      this.serviceProxy
        .getOneBaseCountryControllerCountry(
          countryId,
          undefined,
          undefined,
          undefined
        )
        .subscribe((res) => {
          this.project.country = res;
          this.isSector = true;

          this.telephoneLength =res.telephoneLength;
          this.mask = res.uniqtelephone + " ";
          let y =3;
          for(let x=0;x<this.telephoneLength-1;x++){
            if (x==y){
              y +=3;
              this.mask += "-9"
            }
            else {
              this.mask += "9"
            }    
          }
          // console.log('tokenPayloadmasssge',res);
        });
    } else {
      this.mask ="+99 999 999-9999"
      this.project.country = new Country();
    }
    // this.project.country = new Country();

    this.options = {
      center: { lat: 18.7322, lng: 15.4542 },
      zoom: 2,
    };

    this.project.longitude = 0.0;
    this.project.latitude = 0.0;

    let countryaFilter: string[] = new Array();

    countryaFilter.push('country.id||$eq||' + 1);
    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     countryaFilter,
    //     undefined,
    //     ['climateActionName,ASC'],
    //     ['country'],
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     console.log('***************************');
    //     console.log(res.data);
    //   });

    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.countryList = res.data;
      });

    this.serviceProxy
      .getManyBaseProjectOwnerControllerProjectOwner(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.projectOwnerList = res.data;
      });

    this.serviceProxy
      .getManyBaseProjectStatusControllerProjectStatus(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.projectStatusList = res.data;
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
        0
      )
      .subscribe((res: any) => {
        
        // this.sectorList = res.data;

        if (token && this.editEntytyId && this.editEntytyId > 0) {
          this.serviceProxy
            .getOneBaseProjectControllerProject(
              this.editEntytyId,
              undefined,
              undefined,
              0
            )
            .subscribe(async (res1) => {
              this.project = res1;
              this.project.ndc = res1.ndc;
              this.project.sector =res1.sector;
              this.isCity=res1.subNationalLevl1?1:0;
              const latitude = parseFloat(this.project.latitude + '');
              const longitude = parseFloat(this.project.longitude + '');
              await this.addMarker(longitude, latitude);
              // console.log(latitude);
              // console.log(longitude);

              let map = this.gmap.getMap();
              this.updateMapBoundaries(map, longitude, latitude);

              console.log('ths.project,,,..', this.project);
              this.likelyHood = this.project.likelyhood;
              this.isPoliticalPreference = this.project.politicalPreference;
              this.isFinancialFeciability = this.project.financialFecialbility;
              this.isAvailabiltyOfTEch = this.project.availabilityOfTechnology;
              this.originalApprovalStatus =
                this.project.projectApprovalStatus == undefined
                  ? 'Propose'
                  : this.project.projectApprovalStatus?.name;
              this.proposedDate = this.project.createdOn.toString();
              this.isMapped = this.project?.isMappedCorrectly;
              this.disbaleNdcmappedFromDB = this.project?.isMappedCorrectly;
              this.isLikelyhoodFromDb = this.project?.likelyhood;
              this.isPoliticalPreferenceFromDb =
                this.project?.politicalPreference;
              this.isFinancialFeciabilityFromDb =
                this.project?.financialFecialbility;
              this.isAvailabiltyOfTEchFromDb =
                this.project.availabilityOfTechnology;
              var sector = this.sectorList.find(
                (a) => a.id === this.project?.sector?.id
              );
              // this.project.sector = sector != undefined ? sector : new Sector();
              console.log('this.project.sector...', this.project.sector);
              this.onSectorChange(true);
              this.proposeDateofCommence = new Date(
                this.project.proposeDateofCommence.year(),
                this.project.proposeDateofCommence.month(),
                this.project.proposeDateofCommence.date()
              );
              this.endDateofCommence = new Date(
                this.project.endDateofCommence.year(),
                this.project.endDateofCommence.month(),
                this.project.endDateofCommence.date()
              );

              this.isLoading = false;
              if (this.flag == 1) {
                //this.isDownloading = false;
                this.originalNdc = this.project.ndc?.name;
                this.originalSubNdc = this.project.subNdc?.name;
              }

              let histryFilter: string[] = new Array();
              histryFilter.push('project.id||$eq||' + this.project.id);
              //console.log("id......",this.project.id)
              this.serviceProxy
                .getManyBaseCaActionHistoryControllerCaActionHistory(
                  undefined,
                  undefined,
                  histryFilter,
                  undefined,
                  ['createdOn,ASC'],
                  undefined,
                  1000,
                  0,
                  0,
                  0
                )
                .subscribe((res: any) => {
                  this.historyList = res.data;
                  this.ndcupdatehistoryList = this.historyList.filter(
                    (o) => o.isNdcAndSubNdc == 1
                  );
                  this.statusupdatehistoryList = this.historyList.filter(
                    (o) => o.isApprovalAction == 1
                  );
                  console.log('this.historyList..', res.data);
                });
            });
        }

        //Anonymous form
        if (this.anonymousEditEntytyId && this.anonymousEditEntytyId > 0) {
          // this.serviceProxy
          //   .getOneBaseProjectControllerProject(
          //     this.anonymousEditEntytyId,
          //     undefined,
          //     undefined,
          //     0
          //   )
          this.projectProxy
            .getProjectByIdAnonymous(this.anonymousEditEntytyId)
            .subscribe(async (res) => {
              this.project = res;

              // @ts-ignore
              this.project.duration=null;

              const latitude = parseFloat(this.project.latitude + '');
              const longitude = parseFloat(this.project.longitude + '');
              await this.addMarker(longitude, latitude);
              // console.log(latitude);
              // console.log(longitude);

              let map = this.gmap.getMap();
              this.updateMapBoundaries(map, longitude, latitude);

              console.log('ths.project,,,..', this.project);
              this.likelyHood = this.project.likelyhood;
              this.isPoliticalPreference = this.project.politicalPreference;
              this.isFinancialFeciability = this.project.financialFecialbility;
              this.isAvailabiltyOfTEch = this.project.availabilityOfTechnology;
              this.originalApprovalStatus =
                this.project.projectApprovalStatus == undefined
                  ? 'Propose'
                  : this.project.projectApprovalStatus?.name;
              this.proposedDate = this.project.createdOn.toString();
              this.isMapped = this.project?.isMappedCorrectly;
              this.disbaleNdcmappedFromDB = this.project?.isMappedCorrectly;
              this.isLikelyhoodFromDb = this.project?.likelyhood;
              this.isPoliticalPreferenceFromDb =
                this.project?.politicalPreference;
              this.isFinancialFeciabilityFromDb =
                this.project?.financialFecialbility;
              this.isAvailabiltyOfTEchFromDb =
                this.project.availabilityOfTechnology;
              var sector = this.sectorList.find(
                (a) => a.id === this.project?.sector?.id
              );
              // this.project.sector = sector != undefined ? sector : new Sector();
              // console.log('this.project.sector...', this.project.sector);
              // this.onSectorChange(true);
              // this.proposeDateofCommence = new Date(
              //   this.project.proposeDateofCommence.year(),
              //   this.project.proposeDateofCommence.month(),
              //   this.project.proposeDateofCommence.date()
              // );
              // this.endDateofCommence = new Date(
              //   this.project.endDateofCommence.year(),
              //   this.project.endDateofCommence.month(),
              //   this.project.endDateofCommence.date()
              // );
              this.project.climateActionName = '';
              this.project.telephoneNumber = '';

              if (countryId) {
                this.serviceProxy
                  .getOneBaseCountryControllerCountry(
                    countryId,
                    undefined,
                    undefined,
                    undefined
                  )
                  .subscribe((res) => {
                    this.project.country = res;
                    this.isSector = true;
                    this.getUserEnterdCountry = this.project.country;
                  });
              } else {
                this.project.country = new Country();
              }

              this.isLoading = false;
              if (this.flag == 1) {
                //this.isDownloading = false;
                this.originalNdc = this.project.ndc?.name;
                this.originalSubNdc = this.project.subNdc?.name;
              }

              let histryFilter: string[] = new Array();
              histryFilter.push('project.id||$eq||' + this.project.id);
              //console.log("id......",this.project.id)
              this.serviceProxy
                .getManyBaseCaActionHistoryControllerCaActionHistory(
                  undefined,
                  undefined,
                  histryFilter,
                  undefined,
                  ['createdOn,ASC'],
                  undefined,
                  1000,
                  0,
                  0,
                  0
                )
                .subscribe((res: any) => {
                  this.historyList = res.data;
                  this.ndcupdatehistoryList = this.historyList.filter(
                    (o) => o.isNdcAndSubNdc == 1
                  );
                  this.statusupdatehistoryList = this.historyList.filter(
                    (o) => o.isApprovalAction == 1
                  );
                  console.log('this.historyList..', res.data);
                });
            });
        }
      });

    this.serviceProxy
      .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
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
      )
      .subscribe((res: any) => {
        this.projectApprovalStatus = res.data;
      });

    this.serviceProxy
      .getManyBaseFinancingSchemeControllerFinancingScheme(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.financingSchemeList = res.data;
      });

    let institutionListFilter: string[] = new Array();

    institutionListFilter.push('type.Id||$eq||' + this.institutionTypeID);
    console.log(institutionListFilter);
    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        institutionListFilter,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.institutionList = res.data;
        console.log('list of institutions', this.institutionList);
        // this.project.mappedInstitution
      });

    if (this.editEntytyId && this.editEntytyId != 0) {
      let docFilter: string[] = new Array();

      docFilter.push('documentOwnerId||$eq||' + this.editEntytyId);
      this.serviceProxy
        .getManyBaseDocumentControllerDocuments(
          undefined,
          undefined,
          docFilter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.selectedDocuments = res.data;
          console.log('selectedDocuments...', this.selectedDocuments);
        });
    }

    //Anonymous form
    else if (this.anonymousEditEntytyId && this.anonymousEditEntytyId != 0) {
      let docFilter: string[] = new Array();

      docFilter.push('documentOwnerId||$eq||' + this.anonymousEditEntytyId);
      this.serviceProxy
        .getManyBaseDocumentControllerDocuments(
          undefined,
          undefined,
          docFilter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.selectedDocuments = res.data;
          console.log('selectedDocuments...anno', this.selectedDocuments);
        });
    }
  }
  changInstitute(event: any) {
    console.log(this.project.mappedInstitution);
  }

  //
  async saveForm(formData: NgForm) {
    console.log('hii');
    console.log(formData.form.valid)
    console.log(formData)
    if (this.exsistingPrpject) {
      return;
    }
    const dumpSerctor=this.project.sector;
    const dumpNdc=this.project.ndc;
    const dumpSubNdc=this.project.subNdc;


   
    if (this.project.sector) {
      let sector = new Sector();
      sector.id = this.project.sector.id;
      this.project.sector = sector;
    }
   

    this.project.proposeDateofCommence = moment(this.proposeDateofCommence);
    this.project.endDateofCommence = moment(this.endDateofCommence);
    // this.project.mappedInstitution=this.selectedInstitution;/

    //     console.log("project")
    //  console.log(this.project)
    //  console.log(this.selectedInstitution)


    if (this.project.ndc) {
      this.project.currentNdc = this.project.ndc.name;
      this.project.previousNdc = this.project.ndc.name;
      let ndc = new Ndc();
      ndc.id = this.project.ndc?.id;
      this.project.ndc = ndc;
    }

    if (this.project.subNdc) {
      this.project.currentSubNdc = this.project.subNdc.name;
      this.project.previousSubNdc = this.project.subNdc.name;
      let subned = new SubNdc();
      subned.id = this.project.subNdc?.id;
      this.project.subNdc = subned;
    }

    if (this.project.institution) {
      let insti = new Institution();
      insti.id = this.project.mappedInstitution?.id;
      this.project.mappedInstitution = insti;
    }

    if (formData.form.valid && this.project.id > 0) {
      if (this.anonymousEditEntytyId > 0) {
        let prAprSts = new ProjectApprovalStatus();
        prAprSts.id = 4;
        this.project.projectApprovalStatus = prAprSts;
        this.projectProxy.updateProjectAnonymous(this.project).subscribe(
          (res) => {
            if (res == true) {
              this.isSaving = true;
              console.log('update', res);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project has updated successfully ',
                closable: true,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Internal server error, please try again.',
                sticky: true,
              });
            }
          },

          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Internal server error, please try again.',
              sticky: true,
            });
          },()=>{
            this.project.sector=dumpSerctor;
    this.project.ndc=dumpNdc;
    this.project.subNdc=dumpSubNdc; 
          }
        );
      } else {
        // console.log('formData.form.valid', formData.form.valid);
        this.serviceProxy
          .updateOneBaseProjectControllerProject(this.project.id, this.project)
          .subscribe(
            (res) => {
              this.isSaving = true;
              console.log('update', res);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'project  has updated successfully ',
                closable: true,
              });
            },

            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Internal server error, please try again.',
                sticky: true,
              });
            },()=>{
              this.project.sector=dumpSerctor;
      this.project.ndc=dumpNdc;
      this.project.subNdc=dumpSubNdc; 
            }
            // (res) => {
            //   this.confirmationService.confirm({
            //     message: 'Save success !',
            //     header: 'Save',
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
          );
      }
    } else {
      if (formData.form.valid) {
        let prAprSts = new ProjectApprovalStatus();
        prAprSts.id = 4;
        this.project.projectApprovalStatus = prAprSts;

        this.messageService.clear();
        this.serviceProxy
          .createOneBaseProjectControllerProject(this.project)
          .subscribe(
            (res) => {
              console.log('save', res);
              this.isSaving = true;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'project  has save successfully',
                closable: true,
              });
            },

            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Please Fill All Mandatory Fileds',
                sticky: true,
              });
            },()=>{
              this.project.sector=dumpSerctor;
      this.project.ndc=dumpNdc;
      this.project.subNdc=dumpSubNdc; 
            }
          );

        console.log(formData);
      }
    }

  }

  onnameKeyDown(event: any) {
    console.log('============= Event ===============');

    let skipWord = ['of', 'the', 'in', 'On', '-', '_', '/'];
    let searchText = this.removeFromString(
      skipWord,
      this.project.climateActionName
    ).trim();

    if (!searchText || searchText?.length < 4) {
      console.log('========== Return');
      this.relatedItem = [];
      return;
    }

    this.exsistingPrpject = false;

    let words = searchText.split(' ');

    let orfilter: string[] = new Array();
    // for (const w of words) {
    //   orfilter.push('climateActionName||$cont||' + w.trim());
    // }
    let filter: string[] = new Array();
    if(this.counID > 0){
      filter.push('country.id||$eq||' + this.counID);
    }
    

    filter.push('climateActionName||$cont||' + searchText);

    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        10,
        0,
        0,
        0
      )
      .subscribe((res) => {
        if (this.project.climateActionName && res) {
          this.relatedItem = res.data;
          console.log(
            this.relatedItem.find(
              (a) => a.climateActionName === this.project.climateActionName
            )
          );
          if (
            this.relatedItem.find(
              (a) =>
                a.climateActionName.toLocaleLowerCase() ===
                this.project.climateActionName.toLocaleLowerCase()
            )
          ) {
            this.exsistingPrpject = true;
          }
        } else {
          this.relatedItem = [];
        }
      });

    setTimeout(() => {
      this.setMarkerOnUpdateInit();
    }, 3000);
  }

  onCountryChnage() {
    this.getUserEnterdCountry = this.project.country;

    this.onSectorChange(event);

    this.sectorProxy.getCountrySector(this.project.country.id).subscribe((res: any) => {
      this.sectorList = res;
      console.log("++++" ,this.sectorList)
    });
  }

  onSectorChange(event: any) {
    if (this.project.sector && this.project.country) {
      this.serviceProxy
        .getManyBaseNdcControllerNdc(
          undefined,
          undefined,
          [
            'sector.id||$eq||' + this.project.sector.id,
            'country.id||$eq||' + this.project.country.id,
          ],
          undefined,
          ['name,ASC'],
          ['subNdc'],
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.ndcList = res.data;
          if (event === true) {
            var ndc = this.ndcList?.find((a) => a.id === this.project?.ndc?.id);
            this.project.ndc = ndc !== undefined ? ndc : new Ndc();
            if (this.project.subNdc) {
              var subNdc: SubNdc = this.project.ndc.subNdc?.find(
                (a) => a.id === this.project.subNdc.id
              )!;
              this.project.subNdc = subNdc;
            }
          }
        });
    } else {
      this.ndcList = [];
    }
  }

  escape(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  removeFromString(arr: string[], str: string) {
    let escapedArr = arr.map((v) => escape(v));
    let regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi'
    );
    return str.replace(regex, '');
  }

  /**
   * set project location coordinates on select through map
   * @param longitude
   * @param latitude
   */
  setCoordinatesToProject = (longitude: number, latitude: number) => {
    this.project.latitude = latitude;
    this.project.longitude = longitude;
  };

  /**
   * on click on the map
   * @param event
   */
  async handleMapClick(event: any) {
    if (!this.editEntytyId || this.editEntytyId == 0) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      await this.addMarker(longitude, latitude);
      this.setCoordinatesToProject(longitude, latitude);

      let map = this.gmap.getMap();
      this.updateMapBoundaries(map, longitude, latitude);
    }
  }

  /**
   * update coordinates on drop marker
   * @param event
   */
  handleMarkerDragEnd(event: any) {
    if (!this.editEntytyId || this.editEntytyId == 0) {
      const latitude = event.originalEvent.latLng.lat();
      const longitude = event.originalEvent.latLng.lng();
      //this.addMarker(longitude, latitude);
      this.setCoordinatesToProject(longitude, latitude);

      let map = this.gmap.getMap();
      this.updateMapBoundaries(map, longitude, latitude);
    }
  }

  async setMarkerOnUpdateInit() {
    const latitude = Number(this.project.latitude);
    const longitude = Number(this.project.longitude);
    await this.addMarker(longitude, latitude);
    console.log(latitude);
    console.log(longitude);

    let map = this.gmap.getMap();
    this.updateMapBoundaries(map, longitude, latitude);
  }

  /**
   * update map boundaries on coordinates change
   * @param map
   * @param longitude
   * @param latitude
   */
  updateMapBoundaries = (map: any, longitude: any, latitude: any) => {
    if (longitude && latitude) {
      map.setCenter({ lat: latitude, lng: longitude });
      if (map.getZoom() < 10) {
        map.setZoom(10);
      }

      if (!map.getZoom()) {
        map.setZoom(10);
      }
    } else {
      map.setCenter({ lat: 9, lng: 80 });
      map.setZoom(6);
      this.overlays = [];
    }
  };

  /**
   * add marker on map
   * @param longitude
   * @param latitude
   */
  async addMarker(longitude: number, latitude: number) {
    var marker = await new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      title: this.project.climateActionName,
      draggable: true,
    });
    this.overlays = [marker];
  }

  /**
   * on change the latitude input value
   * @param event
   */
  onLatitudeChange = async (event: any) => {
    let map = this.gmap.getMap();
    if (event.value && this.project.longitude) {
      const latitude = Number(event.value);
      const longitude = Number(this.project.longitude);
      await this.addMarker(longitude, latitude);
      this.updateMapBoundaries(map, longitude, latitude);
    } else {
      this.updateMapBoundaries(map, null, null);
    }
  };

  /**
   * on change the longitude input value
   * @param event
   */
  onLongitudeChange = async (event: any) => {
    let map = this.gmap.getMap();
    if (event.value && this.project.latitude) {
      const latitude = Number(this.project.latitude);
      const longitude = Number(event.value);
      await this.addMarker(longitude, latitude);
      this.updateMapBoundaries(map, longitude, latitude);
    } else {
      this.updateMapBoundaries(map, null, null);
    }
  };

  back() {
    this.location.back();
  }
  confirmBack(label:string) {
    this.confirmationService.confirm({
        message:(label=='cancel'?'Your filled data will be lost. ':'') + 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.location.back();
        },
        reject: (type: any) => {
           
        }
    });
}
  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  enableActionButtonsarea() {
    this.isActionButtonSectionEnabled = true;
  }

  updateProjectApprovalStatus(project: Project, aprovalStatus: number) {
    if (this.isMapped != undefined) {
      this.originalApprovalStatus =
        project.projectApprovalStatus === undefined
          ? 'Propose'
          : project.projectApprovalStatus.name;

      if (aprovalStatus == 1) {
        this.updatedApprovalStatus = 'Accept';
      }
      if (aprovalStatus == 2) {
        this.updatedApprovalStatus = 'Reject';
      }
      if (aprovalStatus == 3) {
        this.updatedApprovalStatus = 'Data Request';
      }

      let status = this.projectApprovalStatus.find(
        (a) => a.id === aprovalStatus
      );

      // project.projectApprovalStatus = status === undefined ? (null as any) : status;
      if (aprovalStatus === 1) {
        // window.alert(project.projectApprovalStatus.name)
        this.confirmationService.confirm({
          message:
            'Are you sure you want to approve ' +
            project.climateActionName +
            ' ?',
          accept: () => {
            //window.alert(project.projectApprovalStatus)
            project.projectApprovalStatus =
              status === undefined ? (null as any) : status;
            console.log('my project..,', project);
            this.updateStatus(project, aprovalStatus);
          },
          reject: () => {},
        });
      }
      if (aprovalStatus === 2) {
        this.confirmationService.confirm({
          message:
            'Are you sure you want to reject ' +
            project.climateActionName +
            ' ?',
          accept: () => {
            project.projectApprovalStatus =
              status === undefined ? (null as any) : status;
            this.updateStatus(project, aprovalStatus);
          },
          reject: () => {},
        });
      }
      if (aprovalStatus === 3) {
        this.confirmationService.confirm({
          message:
            'Are you sure you want to data request ' +
            project.climateActionName +
            ' ?',
          accept: () => {
            project.projectApprovalStatus =
              status === undefined ? (null as any) : status;
            this.updateStatus(project, aprovalStatus);
          },
          reject: () => {},
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Please check whether Aggregated Actions and Action areas is correctly mapped or not',
        closable: true,
      });
    }
  }

  updateStatus(project: Project, aprovalStatus: number) {

    const dumpSerctor=this.project.sector;
    const dumpNdc=this.project.ndc;
    const dumpSubNdc=this.project.subNdc;
    
    let sector = new Sector();
    sector.id = project.sector.id;
    project.sector = sector;

    project.proposeDateofCommence = moment(this.proposeDateofCommence);
    project.endDateofCommence = moment(this.endDateofCommence);
    // this.project.mappedInstitution=this.selectedInstitution;/

    //     console.log("project")
    //  console.log(this.project)
    //  console.log(this.selectedInstitution)

    if (project.ndc) {
      let ndc = new Ndc();
      ndc.id = project.ndc?.id;
      project.ndc = ndc;
    }

    if (project.subNdc) {
      let subned = new SubNdc();
      subned.id = project.subNdc?.id;
      project.subNdc = subned;
    }

    if (project.institution) {
      let insti = new Institution();
      insti.id = project.mappedInstitution?.id;
      project.mappedInstitution = insti;
    }

    project.politicalPreference = this.isPoliticalPreference;
    project.likelyhood = this.likelyHood;
    project.availabilityOfTechnology = this.isAvailabiltyOfTEch;
    project.financialFecialbility = this.isFinancialFeciability;
    // project.actionJustification = this.commentForJustification;
    project.isMappedCorrectly = this.isMapped;
    console.log('project.actionJustification..', project.actionJustification);

    this.serviceProxy
      .updateOneBaseProjectControllerProject(project.id, project)
      .subscribe(
        (res) => {
          // window.alert("yess..")
          // console.log(res);

          let actionObject = new CaActionHistory();
          actionObject.isApprovalAction = 1;
          actionObject.previousAction = this.originalApprovalStatus;
          actionObject.currentAction = this.updatedApprovalStatus;
          actionObject.actionUser = this.fullname;
          //  actionObject.isNdcAndSubNdc = 1;
          //  actionObject.currentNdcs = this.project.currentNdc;
          //  actionObject.previousNdcs = this.project.previousNdc;
          //  actionObject.currentSubNdcs = this.project.currentSubNdc;
          //  actionObject.previousSubNdcs = this.project.previousSubNdc;
          actionObject.project = this.project;

          this.serviceProxy
            .createOneBaseCaActionHistoryControllerCaActionHistory(actionObject)
            .subscribe(
              (res) => {
                console.log('save', res);
                // this.messageService.add({
                //   severity: 'success',
                //   summary: 'Success',
                //   detail: 'project  has save successfully',
                //   closable: true,
                // });
              },err=>{

              },()=>{
            this.project.sector=dumpSerctor;
    this.project.ndc=dumpNdc;
    this.project.subNdc=dumpSubNdc; 
          }

              // (err) => {
              //   this.messageService.add({
              //     severity: 'error',
              //     summary: 'Error.',
              //     detail: 'Internal server error, please try again.',
              //     sticky: true,
              //   });
              // }
            );

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              aprovalStatus === 1 || aprovalStatus === 2
                ? project.climateActionName +
                  ' is successfully ' +
                  (aprovalStatus === 1 ? 'Approved.' : 'Rejected')
                : 'Data request sent successfully.',
            closable: true,
          });
        },
        (err) => {
          //window.alert("nooo..")
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
            sticky: true,
          });
        }
      );
  }

  drWithComment() {
    if (
      this.drComment === '' ||
      this.drComment === null ||
      this.drComment === undefined
    ) {
      this.drCommentRequried = true;
    } else {
      this.selectedProject.projectDataRequsetComment = this.drComment;

      if (this.isMapped != undefined) {
        this.updateProjectApprovalStatus(this.selectedProject, 3);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Please check whether Aggregated Actions and Action Areas is correctly mapped or not',
          closable: true,
        });
      }
    }
  }

  rejectWithComment() {
    if (
      this.rejectComment === '' ||
      this.rejectComment === null ||
      this.rejectComment === undefined
    ) {
      this.rejectCommentRequried = true;
    } else {
      this.selectedProject.projectRejectComment = this.rejectComment;
      //this.updateProjectApprovalStatus(this.selectedProject, 2);
    }
  }

  OnShowOerlayDR() {
    this.drComment = '';
    this.drCommentRequried = false;
  }
  OnShowOerlay() {
    this.rejectComment = '';
    this.rejectCommentRequried = false;
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

  toUpdateNdcs() {
    console.log('this.project....', this.project);

    let sector = new Sector();
    sector.id = this.project.sector.id;
    sector.name = this.project.sector.name;
    this.project.sector = sector;

    this.project.proposeDateofCommence = moment(this.proposeDateofCommence);
    this.project.endDateofCommence = moment(this.endDateofCommence);
    // this.project.mappedInstitution=this.selectedInstitution;/

    //     console.log("project")
    //  console.log(this.project)
    //  console.log(this.selectedInstitution)

    if (this.project.ndc) {
      this.project.currentNdc = this.project.ndc.name;
      this.project.previousNdc = this.originalNdc;
      this.originalNdc = this.project.ndc.name;

      // let ndc = new Ndc();
      // ndc.id = this.project.ndc?.id;
      // ndc.name = this.project.ndc?.name;
      // this.project.ndc = ndc;
    }

    if (this.project.subNdc) {
      this.project.currentSubNdc = this.project.subNdc.name;
      this.project.previousSubNdc = this.originalSubNdc;
      this.originalSubNdc = this.project.subNdc.name;

      // let subned = new SubNdc();
      // subned.id = this.project.subNdc?.id;
      // subned.name = this.project.subNdc?.name;
      // this.project.subNdc = subned;
    }

    if (this.project.institution) {
      let insti = new Institution();
      insti.id = this.project.mappedInstitution?.id;
      this.project.mappedInstitution = insti;
    }


    if (this.project.id > 0) {
      this.serviceProxy
        .updateOneBaseProjectControllerProject(this.project.id, this.project)
        .subscribe(
          (res) => {
            let historyObject = new CaActionHistory();
            historyObject.isNdcAndSubNdc = 1;
            historyObject.currentNdcs = this.project.currentNdc;
            historyObject.previousNdcs = this.project.previousNdc;
            historyObject.currentSubNdcs = this.project.currentSubNdc;
            historyObject.previousSubNdcs = this.project.previousSubNdc;
            historyObject.actionUser = this.fullname;
            historyObject.project = this.project;

            this.serviceProxy
              .createOneBaseCaActionHistoryControllerCaActionHistory(
                historyObject
              )
              .subscribe(
                (res) => {
                  console.log('save', res);
                  // this.messageService.add({
                  //   severity: 'success',
                  //   summary: 'Success',
                  //   detail: 'project  has save successfully',
                  //   closable: true,
                  // });
                }

                // (err) => {
                //   this.messageService.add({
                //     severity: 'error',
                //     summary: 'Error.',
                //     detail: 'Internal server error, please try again.',
                //     sticky: true,
                //   });
                // }
              );

            console.log('update....', res, this.project);
            this.isMapped = 1
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Aggregated Actions and SubNdc  has updated successfully ',
              closable: true,
            });
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
    }
  }

  toDownload() {
    this.isDownloadMode = 1;
    this.isDownloading = true;

// console.log('thi.selectedDocuments', this.selectedDocuments);
    setTimeout(() => {
      // var data = document.getElementById('content')!;

      //  html2canvas(data).then((canvas) => {
      //    var imaWidth = 120; //123
      //    var pageHeight = 400; //500
      //   // var imgHeight = (canvas.height * imaWidth) / canvas.width;
      //   var imgHeight = 800;
      //   // console.log('size', canvas.height); // 4346
      //   // console.log('size....', canvas.width); //2006
      //    var heightLeft = imgHeight;
      //    var text =
      //      'Downolad date ' +
      //      moment().format('YYYY-MM-DD HH:mm:ss');

      //    const contentDataURL = canvas.toDataURL('image/png');
      //    let pdf = new jsPDF('p', 'mm', 'a4');
      //    var position = 0;
      //    pdf.addImage(contentDataURL, 'PNG', 10, position, imaWidth, imgHeight);
      //    pdf.text(text, 297, 297);
      //    pdf.save('');
      //  });

      // var divHeight = $('#pdfTable').height();
      // var divWidth = $('#pdfTable').width();

      var data = document.getElementById('content')!;

      html2canvas(data).then((canvas) => {
        const componentWidth = data.offsetWidth;
        const componentHeight = data.offsetHeight;

        const orientation = componentWidth >= componentHeight ? 'l' : 'p';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation,
          unit: 'px',
        });

        pdf.internal.pageSize.width = componentWidth;
        pdf.internal.pageSize.height = componentHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
        pdf.save('download.pdf');
        this.isDownloadMode = 0;
        this.isDownloading = false;
      });
    }, 1);
  }
}

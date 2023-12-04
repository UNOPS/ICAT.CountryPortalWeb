import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import {
  Country,
  DocumentControllerServiceProxy,
  Documents,
  DocumentsDocumentOwner,
  EmissionReductioDraftDataEntity,
  Sector,
  SectorControllerServiceProxy,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrls: ['./view-country.component.css'],
})
export class ViewCountryComponent implements OnInit {
  country: Country = new Country();
  sectors: Sector[];
  tabs: any;

  stateOptions = [
    { label: 'For Country', value: true },
    { label: 'For a Sector', value: false },
  ];
  isCountry = true;
  countryId: number;
  sectorId = 1;

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
  display1 = false;
  SERVER_URL = environment.baseUrlAPIDocdownloadAPI;

  isNewNDAC = true;
  emissionReduction: EmissionReductioDraftDataEntity =
    new EmissionReductioDraftDataEntity();
  sector: Sector;

  year = '';
  baEmission = 0;
  unCEmission = 0;
  CEmission = 0;
  targetYear = '';
  targetYearEmission = 0;

  display2 = false;
  display3 = false;
  display4 = false;

  selectedSector: Sector;

  constructor(
    private router: Router,
    private activateroute: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private sectorProxy: SectorControllerServiceProxy,
    private documentProxy: DocumentControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);
    this.countryId = tokenPayload.countryId;

    const mngNdcFilter: string[] = [];
    mngNdcFilter.push('country.id||$eq||' + this.countryId);
    mngNdcFilter.push('sector.id||$isnull||');

    this.serviceProxy
      .getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
        undefined,
        undefined,
        mngNdcFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.serviceProxy
          .getOneBaseCountryControllerCountry(
            this.countryId,
            undefined,
            undefined,
            0,
          )
          .subscribe((res2: any) => {
            this.country = res2;
            this.countryId = this.country.id;

            if (res.data.length == 0) {
              this.isNewNDAC = true;
              this.emissionReduction.country = this.country;
            } else {
              this.isNewNDAC = false;

              this.emissionReduction = res.data[0];

              this.targetYear = this.emissionReduction.targetYear;

              this.CEmission = this.emissionReduction.conditionaltco2;
              this.unCEmission = this.emissionReduction.unconditionaltco2;
              this.baEmission = this.emissionReduction.baseYearEmission;
              this.year = this.emissionReduction.baseYear;
              this.targetYearEmission =
                this.emissionReduction.targetYearEmission;
            }
          });
      });

    this.documentProxy.getDocumentsForViweCountry(-4).subscribe((res) => {
      this.listDocumentsNC = res;
    });
    this.documentProxy.getDocumentsForViweCountry(-5).subscribe((res) => {
      this.listDocumentsBUR = res;
    });
    this.documentProxy.getDocumentsForViweCountry(-6).subscribe((res) => {
      this.listDocumentsBTR = res;
    });
    this.documentProxy.getDocumentsForViweCountry(-7).subscribe((res) => {
      this.listDocumentsNDC = res;
    });
    this.documentProxy.getDocumentsForViweCountry(-8).subscribe((res) => {
      this.listDocumentsGHG = res;
    });

    const countryFilter: string[] = [];

    countryFilter.push('country.id||$eq||' + this.countryId);

    this.sectorProxy.getCountrySector(this.countryId).subscribe((res: any) => {
      this.sectors = res;
    });
  }
  edit() {
    this.router.navigate(['edit-country']);
  }

  ndc() {
    this.router.navigate(['ndc']);
  }

  viewmore() {
    this.display1 = true;
  }

  saveTargets() {
    this.display2 = true;

    this.year = this.emissionReduction.baseYear;
    this.baEmission = this.emissionReduction.baseYearEmission;
    this.targetYear = this.emissionReduction.targetYear;
    this.targetYearEmission = this.emissionReduction.targetYearEmission;
    this.unCEmission = this.emissionReduction.unconditionaltco2;
    this.CEmission = this.emissionReduction.conditionaltco2;

    if (
      !this.year ||
      this.year.length == 0 ||
      this.year == ' ' ||
      !/^-?\d+$/.test(this.year) ||
      !this.baEmission ||
      !this.targetYear ||
      this.targetYear.length == 0 ||
      this.targetYear == ' ' ||
      !/^-?\d+$/.test(this.targetYear)
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error in Saving!!',
      });
    } else if (this.year.length != 4 || this.targetYear.length != 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error in Saving!!',
        detail: 'year sould have 4 digits',
      });
    } else {
      if (this.emissionReduction.conditionaltco2) {
      } else {
        this.emissionReduction.conditionaltco2 = 0;
      }

      if (!this.isNewNDAC) {
        this.serviceProxy
          .updateOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
            this.emissionReduction.id,
            this.emissionReduction,
          )
          .subscribe((res) => {
            if (res == null) {
              this.display3 = true;
            }

            if (res != undefined && res != null) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully updated.',
                closable: true,
              });

              this.display1 = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error in updating!!',
              });
            }
          });
      } else {
        if (this.emissionReduction.conditionaltco2) {
        } else {
          this.emissionReduction.conditionaltco2 = 0;
        }

        this.serviceProxy
          .createOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
            this.emissionReduction,
          )
          .subscribe(
            (res) => {
              if (res == null) {
                this.display3 = true;
              }

              if (res != undefined && res != null) {
                this.emissionReduction = res;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succesfully Saved!!',
                });
                this.isNewNDAC = false;
                this.display1 = false;
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error in Saving!!',
                });
              }
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error in Saving!!',
              });
            },
          );
      }
    }
  }
  targets() {
    this.display4 = true;
  }

  onSectorChange(evet?: any) {
    if (evet.toString() == 'true') {
      const mngNdcFilter: string[] = [];
      mngNdcFilter.push('country.id||$eq||' + this.countryId);
      mngNdcFilter.push('sector.id||$isnull||');

      this.serviceProxy
        .getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
          undefined,
          undefined,
          mngNdcFilter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0,
        )
        .subscribe((res) => {
          if (res.data.length == 0) {
            this.emissionReduction = new EmissionReductioDraftDataEntity();
            this.isNewNDAC = true;
            this.emissionReduction.country = this.country;
          } else {
            this.isNewNDAC = false;

            this.emissionReduction = res.data[0];

            this.targetYear = this.emissionReduction.targetYear;

            this.CEmission = this.emissionReduction.conditionaltco2;
            this.unCEmission = this.emissionReduction.unconditionaltco2;
            this.baEmission = this.emissionReduction.baseYearEmission;
            this.year = this.emissionReduction.baseYear;
            this.targetYearEmission = this.emissionReduction.targetYearEmission;
          }
        });
    } else {

      if(this.selectedSector){

        const mngNdcFilter: string[] = [];
        mngNdcFilter.push('country.id||$eq||' + this.countryId);
        mngNdcFilter.push('sector.id||$eq||' + this.selectedSector.id);
  
        this.serviceProxy
          .getManyBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(
            undefined,
            undefined,
            mngNdcFilter,
            undefined,
            undefined,
            undefined,
            1000,
            0,
            0,
            0,
          )
          .subscribe((res) => {
            if (res.count == 0) {
              const newSecter: Sector = new Sector();
              newSecter.id = evet.id;
              this.isNewNDAC = true;
              this.emissionReduction = new EmissionReductioDraftDataEntity();
  
              this.emissionReduction.sector = newSecter;
  
              this.emissionReduction.country = this.country;
            } else {
              this.isNewNDAC = false;
  
              this.emissionReduction = res.data[0];
  
              this.targetYear = this.emissionReduction.targetYear;
  
              this.CEmission = this.emissionReduction.conditionaltco2;
              this.unCEmission = this.emissionReduction.unconditionaltco2;
              this.baEmission = this.emissionReduction.baseYearEmission;
              this.year = this.emissionReduction.baseYear;
              this.targetYearEmission = this.emissionReduction.targetYearEmission;
            }
          });
      }
     
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Country,
  DocumentControllerServiceProxy,
  Documents,
  DocumentsDocumentOwner,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { ConfirmationService, MessageService } from 'primeng/api';
import decode from 'jwt-decode';
@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.css'],
})
export class EditCountryComponent implements OnInit {
  country: Country = new Country();
  sector: Sector = new Sector();
  sectors: Sector[];
  sectorUpdated: any;
  countryId: number;
  isSaving = false;
  sectorList: Sector[];
  value: any;
  confirm = false;
  confirmSector = false;
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

  constructor(
    private route: Router,
    private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private docService: DocumentControllerServiceProxy,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);
    this.countryId = tokenPayload.countryId;
    this.serviceProxy
      .getOneBaseCountryControllerCountry(
        this.countryId,
        undefined,
        undefined,
        0,
      )
      .subscribe((res: any) => {
        this.country = res;
      });

    const countryFilter: string[] = [];

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
        0,
      )
      .subscribe((res) => {
        this.sectors = res.data;
      });
  }

  saveCountry(country: Country) {
    this.serviceProxy
      .updateOneBaseCountryControllerCountry(this.countryId, country)
      .subscribe((res) => {
        this.country = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Country profile successfully updated',
        });

        setTimeout(() => {
          this.back();
        }, 1000);
      });


  }

  saveSector(sector: Sector[]) {
    for (const sector of this.sectors) {
      this.serviceProxy
        .updateOneBaseSectorControllerSector(sector.id, sector)
        .subscribe((res) => {
          this.confirmSector = true;
        });
    }
  }

  back() {
    this.route.navigate(['/view-country']);
  }

  delete() {
    this.docService.deleteDoc(1);
  }
}

import { Component, OnInit } from '@angular/core';
import decode from 'jwt-decode';
@Component({
  selector: 'app-ghg-impact',
  templateUrl: './ghg-impact.component.html',
  styleUrls: ['./ghg-impact.component.css'],
})
export class GhgImpactComponent implements OnInit {
  dataCollectionModuleStatus: number;
  dataCollectionGhgModuleStatus: number;
  constructor() {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    const model: number[] = [];
    this.dataCollectionModuleStatus = tokenPayload.moduleLevels[3];
    this.dataCollectionGhgModuleStatus = tokenPayload.moduleLevels[4];
  }
}

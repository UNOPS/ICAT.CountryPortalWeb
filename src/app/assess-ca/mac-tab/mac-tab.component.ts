import { Component, OnInit } from '@angular/core';
import decode from 'jwt-decode';
@Component({
  selector: 'app-mac-tab',
  templateUrl: './mac-tab.component.html',
  styleUrls: ['./mac-tab.component.css'],
})
export class MacTabComponent implements OnInit {
  dataCollectionModuleStatus: number;
  constructor() {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    const model: number[] = [];
    this.dataCollectionModuleStatus = tokenPayload.moduleLevels[3];
  }
}

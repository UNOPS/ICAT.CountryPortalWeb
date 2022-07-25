import { Component, OnInit } from '@angular/core';
import decode from 'jwt-decode';
@Component({
  selector: 'app-ghg-impact',
  templateUrl: './ghg-impact.component.html',
  styleUrls: ['./ghg-impact.component.css'],
})
export class GhgImpactComponent implements OnInit {


  dataCollectionModuleStatus:number
  constructor() {}

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);
   let model:number[]=[];
   this.dataCollectionModuleStatus =tokenPayload.moduleLevels[3];

  }
}

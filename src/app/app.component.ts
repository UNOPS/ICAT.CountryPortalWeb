import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RoleGuardService } from './auth/role-guard.service';
import decode from 'jwt-decode';
import { SharedDataService } from 'shared/shared-data-services';
import { Subject } from 'rxjs/internal/Subject';
import { CountryModule } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, DialogService],
})
export class AppComponent implements OnInit {
  title = 'icat-country-portal-web-app';
  togglemenu = true;
  innerWidth = 0;
  showLeftMenu = true;
  showTopMenu = true;
  fname = '';
  lname = '';
  urole = '';
  anonimousId: any;
  instName = '';
  moduleLevels: number[] = [1];
  models = CountryModule;
  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };
  userActivity: any;
  countryId: number;
  userInactive: Subject<any> = new Subject();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:mousemove')
  @HostListener('document:keypress')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  constructor(
    private roleGuardService: RoleGuardService,
    private router: Router,
    private sharedDataService: SharedDataService,
  ) {
    this.userRoles = [
      { name: 'Country Admin', role: '1' },
      { name: 'Verifier', role: '2' },
      { name: 'Sector Admin', role: '3' },
      { name: 'MRV Admin', role: '4' },
      { name: 'Technical Team', role: '5' },
      { name: 'Data Collection Team', role: '6' },
      { name: 'QC Team', role: '7' },
      { name: 'Institution Admin', role: '8' },
      { name: 'Data Entry Operator', role: '9' },
    ];

    this.router.events.subscribe((event: any) => {
      if (event && event.url) {
        this.showLeftMenu = true;
        this.showTopMenu = true;

        if (event.url == '/login') {
          this.showLeftMenu = false;
          this.showTopMenu = false;

          return;
        }
        if (event.url == '/landing-page') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/loard-more') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
        }
        if (event.url == '/landing-page#about-tool') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/landing-page#Knowledge-Base') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/landing-page#Case-studies') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/propose-project') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url.includes('/propose-project?anonymousId')) {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url.includes('/final-report')) {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
      }
    });
  }

  ngOnInit() {
    this.sharedDataService.currentMessage.subscribe((message: string) => {
      if (message == 'login_success') {
        this.setLoginRole();
      }
    });

    this.innerWidth = window.innerWidth;
    this.setLoginRole();

    this.setTimeout();
    this.userInactive.subscribe(() => {
      this.logout();
    });
  }

  setTimeout() {
    this.userActivity = setTimeout(() => {
      if (this.userRole.role != -1) {
        this.userInactive.next(undefined);
      }
    }, 600000);
  }

  getModel = (a: number): boolean => this.moduleLevels.includes(a);

  setLoginRole() {
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);

    this.fname = tokenPayload.fname;
    this.lname = tokenPayload.lname;
    this.urole = tokenPayload.roles[0];
    this.countryId = tokenPayload.countryId;
    this.instName = tokenPayload.instName ? tokenPayload.instName : '';
    this.moduleLevels = this.roleGuardService.checkModels();
    [1, 2, 3].some(this.getModel);

    if (this.roleGuardService.checkRoles(['Country Admin'])) {
      this.userRole = this.userRoles[0];
    } else if (this.roleGuardService.checkRoles(['Verifier'])) {
      this.userRole = this.userRoles[1];
    } else if (this.roleGuardService.checkRoles(['Sector Admin'])) {
      this.userRole = this.userRoles[2];
    } else if (this.roleGuardService.checkRoles(['MRV Admin'])) {
      this.userRole = this.userRoles[3];
    } else if (this.roleGuardService.checkRoles(['Technical Team'])) {
      this.userRole = this.userRoles[4];
    } else if (this.roleGuardService.checkRoles(['Data Collection Team'])) {
      this.userRole = this.userRoles[5];
    } else if (this.roleGuardService.checkRoles(['QC Team'])) {
      this.userRole = this.userRoles[6];
    } else if (this.roleGuardService.checkRoles(['Institution Admin'])) {
      this.userRole = this.userRoles[7];
    } else if (this.roleGuardService.checkRoles(['Data Entry Operator'])) {
      this.userRole = this.userRoles[8];
    }
  }
  logout() {
    localStorage.setItem('access_token', '');
    localStorage.setItem('user_name', '');
    this.userRole = { name: 'Guest', role: '-1' };
    this.router.navigate(['/login']);
  }
}

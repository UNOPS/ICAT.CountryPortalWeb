import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let grant = false;
    let moduleGrant = false;
    let roles: any[] = [];
    let moduleLevels: number[];

    const expectedRoles1 = route.data['expectedRoles'];
    const expectedModules = route.data['expectedModules'];

    const token = localStorage.getItem('access_token')!;
    if (token) {
      const tokenPayload = decode<any>(token);

      roles = tokenPayload['roles'];
      moduleLevels = tokenPayload['moduleLevels'];

      if (this.isTokenExpire(tokenPayload)) {
        this.router.navigate([' ']);
        return false;
      }

      expectedRoles1.forEach((role: any) => {
        if (roles.indexOf(role) > -1) {
          grant = true;
        }
      });

      if (expectedModules) {
        skip: {
          for (const a of expectedModules) {
            if (moduleLevels[a] == 1) {
              moduleGrant = true;
              break skip;
            }
          }
        }
      } else {
        moduleGrant = true;
      }
    }

    if (!grant || !moduleGrant) {
      this.router.navigate([' ']);

      return false;
    }
    return true;
  }

  isTokenExpire(tokenPayload: any) {
    const expiry = tokenPayload['exp'];
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  getDefaultRoles() {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const roles: any[] = tokenPayload['roles'];
    if (roles.length > 0) {
      return roles[0];
    }
    return '';
  }

  getAllRoles() {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const roles: any[] = tokenPayload['roles'];
    return roles;
  }
  checkRoles(expectedRoles: string[]): boolean {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const roles: any[] = tokenPayload['roles'];

    let grant = false;

    expectedRoles.forEach((role) => {
      if (roles.indexOf(role) > -1) {
        grant = true;
      }
    });

    return grant;
  }

  checkModels(): number[] {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    const model: number[] = [];
    const modelsStatus = tokenPayload.moduleLevels;

    for (let i = 0; i < modelsStatus.length; i++) {
      if (modelsStatus[i] == 1) {
        model.push(i);
        if (i === 4) {
          model.push(0);
          model.push(1);
        }
      }
    }

    return model;
  }
}

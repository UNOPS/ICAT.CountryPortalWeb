import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { CountryModule } from 'app/app-routing.module';
//import { AuthService } from './auth.service';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(
    // public auth: AuthService,
    public router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    let grant = false;
    let moduleGrant=false
    let roles: any[] = [];
    let moduleLevels: number[];

    const expectedRoles1 = route.data['expectedRoles'];
    const expectedModules = route.data['expectedModules'];
    // console.log('expectedModules=========', expectedModules);
    const token = localStorage.getItem('access_token')!;
    if (token) {
      // decode the token to get its payload
      const tokenPayload = decode<any>(token);

      // console.log('tokenPayload=========', tokenPayload);

      roles = tokenPayload['roles'];
      moduleLevels = tokenPayload['moduleLevels'];
      // console.log('expectedModules=========', moduleLevels);
      if (this.isTokenExpire(tokenPayload)) {
        this.router.navigate([' ']);
        return false;
      }

      expectedRoles1.forEach((role: any) => {
        if (roles.indexOf(role) > -1) {
          grant = true;
        }
      });

      if(expectedModules){
    
    skip:  { for(let a of expectedModules){
         if(moduleLevels[a]==1){
         
          moduleGrant=true;
          break skip;
         }
        

       }}
    

      }else{
       
        moduleGrant= true;
      
      }
      



    }

    if (!grant || !moduleGrant) {
      console.log('expectedModules555=========',moduleGrant);
      this.router.navigate([' ']);

      // if (roles.indexOf('ccs-admin') > -1) {
      //   this.router.navigate(['/home']);
      // } else if (roles.indexOf('ccs-deo') > -1) {
      //   this.router.navigate(['/institution-assigneddata']);
      // } else if (roles.indexOf('ins-admin') > -1) {
      //   this.router.navigate(['/institution-home']);
      // } else if (roles.indexOf('ins-deo') > -1) {
      //   this.router.navigate(['/institution-assigneddata']);
      // } else if (roles.indexOf('public-user') > -1) {
      //   this.router.navigate(['/data/parameters']);
      // }

      return false;
    }
    return true;
  }

  isTokenExpire(tokenPayload: any) {
    const expiry = tokenPayload['exp'];

    console.log('current=========', new Date().getTime() / 1000);
    console.log('expire=========', expiry);

    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  getDefaultRoles() {
    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);

    console.log('tokenPayload=========', tokenPayload);
    // debugger;
    let roles: any[] = tokenPayload['roles'];
    if (roles.length > 0) {
      return roles[0];
    }
    return '';
  }

  getAllRoles() {
    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);

    console.log('tokenPayload=========', tokenPayload);
    // debugger;
    let roles: any[] = tokenPayload['roles'];
    return roles;
  }
  checkRoles(expectedRoles: string[]): boolean {
    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);

    console.log('tokenPayload=========', tokenPayload);
    // debugger;
    let roles: any[] = tokenPayload['roles'];

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
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);
   let model:number[]=[];
   const modelsStatus=tokenPayload.moduleLevels;

for(let i=0;i<modelsStatus.length;i++){
   if(modelsStatus[i]==1){
     model.push(i)
   }

}
    
console.log('model',model)
    return model;
  }
}

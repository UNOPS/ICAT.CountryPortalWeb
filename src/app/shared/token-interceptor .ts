import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';
// import { AppService } from './app-service';

@Injectable()
export class TokenInterceptor {

  /**
   * Creates an instance of TokenInterceptor.
   * @param {OidcSecurityService} auth
   * @memberof TokenInterceptor
   */
  constructor() { }

  /**
   * Intercept all HTTP request to add JWT token to Headers
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof TokenInterceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let access_token = localStorage.getItem('access_token');
    // console.log("access_token========================", access_token);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`
      }
    });

    return next.handle(request);
  }
}
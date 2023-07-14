import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const access_token = localStorage.getItem('access_token');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return next.handle(request);
  }
}

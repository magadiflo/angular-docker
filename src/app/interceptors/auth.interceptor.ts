import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../service/authentication.service';
import { environment } from '../../environments/environment';

const HOST: string = environment.apiUrl;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(`${HOST}/user/login`) ||
      request.url.includes(`${HOST}/user/register`)) {
      return next.handle(request);
    }

    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    const authRequest = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    console.log(`AuthInterceptor => Bearer ${token}`);

    return next.handle(authRequest);
  }
}

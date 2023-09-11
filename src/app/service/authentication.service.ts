import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtHelperService } from "@auth0/angular-jwt";

import { USER, USERS, TOKEN } from '../constant/global.constant';
import { environment } from '../../environments/environment';
import { User } from '../model/user';

const HOST: string = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string = '';
  private loggedInUsername: string = '';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(user: User): Observable<HttpResponse<User>> {
    //*observe: 'response', significa que HttpClient devolverá toda la respuesta completa, 
    //*incluyendo encabezados y todo. Esto lo hacemos por que el token que nos devuelve el backend 
    //*viene en el encabezado, y si no ponemos esa opción por defecto solo nos devolverá el cuerpo de la petición.
    //*Como resultado, devuelve un Observable de tipo HttpResponse en lugar de solo los datos JSON contenidos en el cuerpo.
    return this.http.post<User>(`${HOST}/user/login`, user, { observe: 'response' });
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${HOST}/user/register`, user);
  }

  logOut(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem(USER);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USERS);
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem(TOKEN, token);
  }

  addUserToLocalCache(user: User): void {
    localStorage.setItem(USER, JSON.stringify(user));
  }

  getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem(USER)!);
  }

  loadToken(): void {
    this.token = localStorage.getItem(TOKEN)!;
  }

  getToken(): string {
    return this.token;
  }

  isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null && this.jwtHelper.decodeToken(this.token).sub != '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    }
    this.logOut();
    return false;
  }

}

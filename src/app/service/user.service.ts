import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { USERS } from '../constant/global.constant';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/custom-http-response';

const HOST: string = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${HOST}/user/list`);
  }

  addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${HOST}/user/add`, formData);
  }

  updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${HOST}/user/update`, formData);
  }

  resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${HOST}/user/reset-password/${email}`);
  }

  /**
   ** reportProgress: true, mostrará algún progreso de cualquier solicitud HTTP.
   ** observe: 'events', debemos usar esta opción si deseamos ver todos los eventos, 
   **     incluido el progreso de las transferencias. Además, debemos devolver 
   **     un Observable de tipo HttpEvent.
   */
  updateProfileImage(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post<User>(`${HOST}/user/update-profile-image`, formData, { reportProgress: true, observe: 'events' });
  }

  deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${HOST}/user/delete/${username}`);
  }

  addUsersToLocalCache(users: User[]): void {
    localStorage.setItem(USERS, JSON.stringify(users));
  }

  getUsersFromLocalCache(): User[] | null {
    return localStorage.getItem(USERS) ? JSON.parse(localStorage.getItem(USERS)!) : null;
  }

  createUserFromData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNotLocked', JSON.stringify(user.notLocked));
    return formData;
  }

}

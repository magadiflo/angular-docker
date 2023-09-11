import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { NotificationType } from '../enum/notification-type.enum';
import { HeaderType } from '../enum/header-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigate(['/user', 'management']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onLogin(user: User): void {
    this.showLoading = true;
    const loginSub = this.authenticationService.login(user)
      .subscribe({
        next: (resp: HttpResponse<User>) => {
          const token = resp.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token!);
          this.authenticationService.addUserToLocalCache(resp.body!);
          this.router.navigate(['/user', 'management']);
          this.showLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, err.error.message);
          this.showLoading = false;
        },
        complete: () => console.log('Subscripción login() completa!')
      });

    this.subscriptions.push(loginSub);
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (!message) {
      message = 'An error ocurred. Please, try again';
    }
    this.notificationService.notify(notificationType, message);
  }
}

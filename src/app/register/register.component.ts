import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  showLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigate(['/user', 'management']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onRegister(user: User): void {
    this.showLoading = true;
    const loginSub = this.authenticationService.register(user)
      .subscribe({
        next: (resp: User) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${resp.firstName}. 
          Please check your email for password to log in.`);
        },
        error: (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, err.error.message);
          this.showLoading = false;
        },
        complete: () => console.log('Subscripción register() completa!')
      });

    this.subscriptions.push(loginSub);
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (!message) {
      message = 'An error ocurred. Please, try again';
    }
    this.notificationService.notify(notificationType, message);
  }

}

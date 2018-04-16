import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from 'oidc-client';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  user$ : Observable<User>;
  constructor(private authService: AuthService) { 
    //this.user$ = this.authService.UserSubject.asObservable();
  }

  ngOnInit() {
    // this.authService.UserObservable.subscribe(user => {
    //   let tokenExpired = user ? user.expired : true;

    //   console.log(`WelcomeComponent - UserObservable updated - token is expired or unavailable: ${tokenExpired}`);
    // })

 // var a =  this.authService.UserSubject.asObservable()
    // this.authService.UserSubject.subscribe(user => {
    //   let tokenExpired = user ? user.expired : true;

    //   console.log(`UserStatusComponent - user$ updated - token is expired or unavailable: ${tokenExpired}`);
    // })
  //  this.authService.UserObservable
  //  this.user$ = this.authService.UserSubject.asObservable();
    // this.user$.subscribe(user => {
    //   let tokenExpired = user ? user.expired : true;

    //   console.log(`UserStatusComponent - user$ updated - token is expired or unavailable: ${tokenExpired}`);
    // })


    this.user$ = this.authService.UserSubject.asObservable();
    

  }
}

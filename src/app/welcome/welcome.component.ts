import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // this.authService.UserObservable.subscribe(user => {
    //   let tokenExpired = user ? user.expired : true;

    //   console.log(`WelcomeComponent - UserObservable updated - token is expired or unavailable: ${tokenExpired}`);
    // })

        //get the observable
    //    this.user$ = this.authService.UserSubject;

        //this.authService.UserObservable.subscribe(user=>{
        this.authService.UserSubject.subscribe(user=>
        {
            console.log(`WelcomeComponent.ngOnInit - UserSubject UPDATED - user.expired: ${user.expired}, expires_in : ${user.expires_in}, user.expires_at : ${user.expires_at}`);
         
        })

  }

}

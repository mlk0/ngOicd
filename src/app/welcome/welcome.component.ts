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

    //this component does not need to be subscribed to the UserSubject
    //here the subscription is being made only to confirm that the update to the user
    //will be propagated through the app.
    this.authService.UserSubject.subscribe(user => {
      console.log(`WelcomeComponent.ngOnInit - UserSubject UPDATED - user.expired: ${user.expired}, expires_in : ${user.expires_in}, user.expires_at : ${user.expires_at}`);

    })

  }

}

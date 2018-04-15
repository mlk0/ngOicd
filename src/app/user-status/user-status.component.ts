import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

   
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.UserObservable.subscribe(user => {
      let tokenExpired = user ? user.expired : true;

      console.log(`WelcomeComponent - UserObservable updated - token is expired or unavailable: ${tokenExpired}`);
    })
  }
}

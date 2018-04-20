import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  env: any;
  title = 'app';

  signOut(){
     this.authService.signout();
  }


  clearState(){
    this.authService.clearState();
  }

  removeUser(){
    this.authService.removeUser();
  }

  constructor(private authService : AuthService) { 
    this.env = environment;
  }

  ngOnInit() {
    // this.authService.UserObservable.subscribe(user=>{
    //  let tokenExpired = user ? user.expired  : true;     

    //   console.log(`WelcomeComponent - UserObservable updated - token is expired or unavailable: ${tokenExpired}`);
    // })
  }
  
}

import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private authService : AuthService) { }

  ngOnInit() {
    // this.authService.UserObservable.subscribe(user=>{
    //  let tokenExpired = user ? user.expired  : true;     

    //   console.log(`WelcomeComponent - UserObservable updated - token is expired or unavailable: ${tokenExpired}`);
    // })
  }
  
}

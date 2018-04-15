import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
    console.log("ngOnInit of AuthCallbackComponent")
    //this.authService.completeAuthentication();
    
    // this.authService.completeAuthenticationAndSetOriginallyRequestedRoute().then(
    //   function (originallyRequestedRoute : string) {
    //     console.log(`completeAuthenticationAndSetOriginallyRequestedRoute.then - originallyRequestedRoute : ${originallyRequestedRoute}`);

    //   }
    // );

    this.authService.completeAuthenticationAndSetOriginallyRequestedRouteAndUserObservable();
    
  }

}

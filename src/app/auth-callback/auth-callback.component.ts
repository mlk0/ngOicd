import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, UrlSegment } from '@angular/router';

@Component({
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
    console.log("ngOnInit of AuthCallbackComponent")
    //this.authService.completeAuthentication();
    
    // this.authService.completeAuthenticationAndSetOriginallyRequestedRoute().then(
    //   function (originallyRequestedRoute : string) {
    //     console.log(`completeAuthenticationAndSetOriginallyRequestedRoute.then - originallyRequestedRoute : ${originallyRequestedRoute}`);

    //   }
    // );

   // this.authService.completeAuthenticationAndSetOriginallyRequestedRouteAndUserObservable();


   this.authService.completeAuthentication().then(c=>{
    console.log(`AuthCallbackComponent.completeAuthentication`);

    this.authService.isLoggedInX().then(r=>console.log('AuthCallbackComponent isLoggedInX call to refresh the UserSubject'));


    var requestedRoute = localStorage.getItem('requestedRoute');
 
 

    console.log(`AuthCallbackComponent.completeAuthentication - requestedRoute : ${requestedRoute}`);
    if(requestedRoute){
      this.router.navigateByUrl(requestedRoute);
    }

   });
    
  }

}

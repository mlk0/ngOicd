import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    
    console.log(`in AuthGuardService, guarding : ${route.url.toString()}`);


    let isUserLoggedIn = this.authService.isLoggedInX();
    
    console.log(`AuthGuardService.canActivate - authService.isLoggedIn() : ${isUserLoggedIn}}`)

    isUserLoggedIn.then(isLoggedIn=>{
      if(isLoggedIn)
        return true;
      else{
        localStorage.setItem('requestedRoute', JSON.stringify(route.url));
        this.authService.startAuthentication();
        return false;
      }
    });
    return isUserLoggedIn;


    // if(this.authService.isUserLoggedIn()){
    //   console.log(`AuthGuardService.canActivate - authService.isLoggedIn() : TRUE`);
    //   return true;
    // }


   // this.authService.isLoggedIn(state.url).subscribe(isLoggedIn=>{
    //   console.log(`AuthGuardService.canActivate - authService.isLoggedIn() : ${isLoggedIn}`);
    //   if(isLoggedIn){
    //     return true;
    //   }

    // this.authService.isLoggedIn(state.url).subscribe(isLoggedIn=>{
    //   console.log(`AuthGuardService.canActivate - authService.isLoggedIn() : ${isLoggedIn}`);
    //   if(isLoggedIn){
    //     return true;
    //   }

    //   this.authService.startAuthenticationAndSetOriginallyRequestedRoute(state.url);
    //   return false;
    // })

    // return this.authService.isLoggedIn(state.url);


  //  if(this.authService.isLoggedIn()){
  //     console.log(`AuthGuardService.canActivate - authService.isLoggedIn() : TRUE`);
  //     return true;
  //   }
   

   // console.log(`AuthGuardService.canActivate - authService.isLoggedIn() : FALSE`);
    
    //if the user is not logged in (so either the user instance is null or has an expired token), just start the authentiacation
    //this.authService.startAuthentication();    


 
    // this.authService.startAuthenticationAndSetOriginallyRequestedRoute(state.url);
    // return false;
  }

  constructor(private authService : AuthService) { 
  }

}

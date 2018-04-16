import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { Observable, Subject } from 'rxjs/Rx';
 

@Injectable()
export class AuthService {

  UserObservable: Observable<User>;
  UserSubject = new Subject<User>();

  //entry point into the oidc-client library where all interactions with oidc library are encapsulated
  private manager: UserManager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {

    this.UserObservable = this.UserSubject.asObservable();

    //as soon as initialiazing the AuthService, get the user object through the UserManager
    this.manager.getUser().then(user => {
      this.user = user;

      //trigger the update to all the subsribers to the UserSubject
      this.UserSubject.next(user);  
   
    });

    //this.UserObservable = Observable.fromPromise(this.manager.getUser());
    //this.UserObservable = this.UserSubject.asObservable();
    
  }

  isUserLoggedIn(): boolean {
    //if we have a user and if we do, well check if it is still has a valid (not expired) token
    return this.user != null && !this.user.expired;
  }

  //guard can subscribe to this and decide when to continue the redirection
  isLoggedIn(requestedRoute : string): Observable<boolean> {

    let userPromise = this.manager.getUser();
    this.UserObservable = Observable.fromPromise(userPromise);

    return Observable.fromPromise(userPromise)
    .map<User, boolean>((user) => {

      //update all those subsribed to the UserSubject
      this.UserSubject.next(user);

      if (user && !user.expired) {
        return true;
      } else {

        return false;
      }
    });
  }

  isLoggedInX(): Promise<boolean> {

    return this.manager.getUser().then(user => {
      this.user = user;
    
      // console.log(`AuthService.isLoggedInX, user : ${JSON.stringify(user) }`);
      //trigger the update to all the subsribers to the UserSubject

      if(user){
        this.UserSubject.next(user);
      }
      

      if (user && !user.expired) {

        console.log(`AuthService.isLoggedInX, return TRUE`);
        console.log(`isLoggedInX - user.expired: ${user.expired}, expires_in : ${user.expires_in}, user.expires_at : ${user.expires_at}`);
      

        return true;
      } else {
        console.log(`AuthService.isLoggedInX, return FALSE`);
        
        return false;
      }

    });
  }

  // isLoggedInY(): boolean {

  //   let promise = this.manager.getUser().then(user => {
  //     this.user = user;

  //     //trigger the update to all the subsribers to the UserSubject
  //     this.UserSubject.next(user);

  //     if (user && !user.expired) {
  //       return true;
  //     } else {
  //       return false;
  //     }

  //   });

  //   // var a = yield promise;
  //   // |         return a;

  //   let a = await promise; 
   
  //  return a;

  // }


  getClaims(): any {
    //return the claims attached to the user, available on the profile property on the User object. Since we have set filterProtocolClaims to true
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    //generate an authorization header from the User object. 
    //Requires the type of the token (its scheme, probably Bearer) and the access token itself. 
    //the user is being retrieved from the identity server all along the returned token. 
    //So the expectation is that token_type is being already set to the correct schema that is most often Bearer
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    console.log(`AuthService.startAuthentication`);
    //will initiate opening of the signin page hosted in the identity server (as it is configured in the UserManagerSettings)
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    //once the user provided the authentication credentials and successfully singed in in identity server
    //the redirection to the configured UserManagerSettings.redirect_uri neeeds to happen from where call to AuthService.completeAuthentication can be made
    //and this will ultimately achieve update of the refreshed user instance, potentially with a new token and new expiration
    //signinRedirectCallback method will receive and handle incoming tokens, including token validation
    //if UserManagerSettings.loadUserInfo is set to true, it will also call the user info endpoint to get any extra identity data it has been authorized to access.
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;

      this.UserSubject.next(user);
      
    });
  }

  // private requestedRoute: string = "";
  // startAuthenticationAndSetOriginallyRequestedRoute(originallyRequestedRoute : string): Promise<void> {
  //   console.log(`AuthService.startAuthenticationAndSetOriginallyRequestedRoute - originallyRequestedRoute : ${originallyRequestedRoute}`);
  //   this.requestedRoute = originallyRequestedRoute;
    
  //   //will initiate opening of the signin page hosted in the identity server (as it is configured in the UserManagerSettings)
  //   return this.manager.signinRedirect();
  // }

  
  // completeAuthenticationAndSetOriginallyRequestedRoute(): Promise<string> {

  //   this.manager.signinSilentCallback()
  //   .then(r=>{
  //     console.log(r);
  //   })
  //   //once the user provided the authentication credentials and successfully singed in in identity server
  //   //the redirection to the configured UserManagerSettings.redirect_uri neeeds to happen from where call to AuthService.completeAuthentication can be made
  //   //and this will ultimately achieve update of the refreshed user instance, potentially with a new token and new expiration
  //   //signinRedirectCallback method will receive and handle incoming tokens, including token validation
  //   //if UserManagerSettings.loadUserInfo is set to true, it will also call the user info endpoint to get any extra identity data it has been authorized to access.
  //   return this.manager.signinRedirectCallback().then(user => {
     
     
  //     this.user = user; 
  //     return this.requestedRoute;
  //   });
  // }


  // completeAuthenticationAndSetOriginallyRequestedRouteAndUserObservable(){

  //   this.UserObservable = Observable.fromPromise(this.manager.signinRedirectCallback());
 
  // }

}


/*
The UserManager’s constructor requires a settings object of UserManagerSettings. 
getClientSettings will provide the settings.
*/
export function getClientSettings(): UserManagerSettings {
  return {
    //TODO:  1. update this to read from ENV file,  
    //FIXME: 2. tokenize the environment.prod.ts  
    //TODO:  3. provide the environment specific token values in Octopus
    authority: 'https://localhost:44300/identity', //'http://localhost:5555/',
    client_id: 'js', //'angular_spa',
    redirect_uri: 'http://localhost:4200/auth-callback',  //registered URI that the OpenID Connect provider can redirect a user to once they log out
    post_logout_redirect_uri: 'http://localhost:4200/',
    
    //TODO: try with both id_token and token
    response_type: 'token', //"id_token token",

    scope: 'customer', //"openid profile api1",
    filterProtocolClaims: true, // protocol level claims such as nbf, iss, at_hash, and nonce from being extracted from the identity token as profile data. These claims aren’t typically of much use outside of token validation
    loadUserInfo: true, //allows the library to automatically call the OpenID Connect Provider’s User Info endpoint using the received access token, in order to access additional identity data about the authenticated user. This is true by default
  
    //REVIEW: https://www.scottbrady91.com/OpenID-Connect/Silent-Refresh-Refreshing-Access-Tokens-when-using-the-Implicit-Flow
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  
    ,ui_locales:"en-CA"
    ,accessTokenExpiringNotificationTime: 4
    ,acr_values : "productcode:ESDH-MIA"

  };
}
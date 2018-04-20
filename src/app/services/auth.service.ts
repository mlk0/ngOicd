import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { Observable, Subject } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
 

@Injectable()
export class AuthService {

  UserObservable: Observable<User>;
  UserSubject : Subject<User>;

  //entry point into the oidc-client library where all interactions with oidc library are encapsulated
  private manager: UserManager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {

    this.UserSubject = new Subject<User>();
    this.UserObservable = this.UserSubject.asObservable();

    //as soon as initialiazing the AuthService, get the user object through the UserManager
    this.manager.getUser().then(user => {
      this.user = user;

      
      //trigger the update to all the subsribers to the UserSubject
      this.UserSubject.next(user);  
   
    });
 
   

    this.manager.events.addUserLoaded(function(){
      console.log("tuserLoaded");
    });

    this.manager.events.addUserUnloaded(function(){
      console.log("userUnloaded");
    });

    this.manager.events.addAccessTokenExpiring(function(){
      console.log("accessTokenExpiring");
    });

    this.manager.events.addAccessTokenExpired(function(){
      console.log("accessTokenExpired");
    });


    this.manager.events.addSilentRenewError(function(){
      console.log("userSignedOut");
    });

    this.manager.events.addUserSignedOut(function(){
      console.log("userSignedOut");
    });
    

  }

 

  
  isLoggedInX(): Promise<boolean> {

    return this.manager.getUser().then(user => {
      this.user = user;
    
     

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

      console.log('AuthService.completeAuthentication - refreshing the retrieved user >>>>>>>>>>> ')
    
      this.UserSubject.next(user);
      
    });
  }

 
 
 


  signout() {
    this.manager.getUser().then(user => {
      return this.manager.signoutRedirect({ id_token_hint: user.id_token }).then(resp => {
        console.log('signoutRedirect - completed', resp);
        setTimeout(5000, () => {
          console.log('testing to see if fired...');
        });
      }).catch(function (err) {
        console.log(err);
      });
    });
  };
  
  signoutCallback() {
    //not working as I expect
    this.manager.signoutRedirectCallback().then(resp=>{
      console.log('signoutRedirectCallback - completed', resp);
      this.isLoggedInX().then(u=>{
        console.log("isLoggedInX after signoutRedirectCallback ")
      });
    })

   
  };



  clearState() {
    //clearStaleState: Removes stale state entries in storage for incomplete authorize requests.
    this.manager.clearStaleState().then(function () {
      console.log('clearStateState success');
    }).catch(function (e) {
      console.log('clearStateState error', e.message);
    });
  }

  removeUser() {
    this.manager.removeUser().then(() => {
      console.log('user removed');
    }).catch(function (err) {
      console.log(err);
    });
  }




}















/*
The UserManager’s constructor requires a settings object of UserManagerSettings. 
getClientSettings will provide the settings.
*/
export function getClientSettings() : UserManagerSettings {
  
console.log('in getClientSettings');
// console.log(environment);


  let userManagerSettings = 
  {
    //TODO:  1. update this to read from ENV file,  
    //FIXME: 2. tokenize the environment.prod.ts  
    //TODO:  3. provide the environment specific token values in Octopus
   // authority: 'https://localhost:44300/identity', 
   //authority: 'https://dev-ws-esa.np.dhltd.com/identity',
   //authority: 'https://apigatewaypat.dh.com/es/sb/identity',
   authority: `${environment.API_HOST}/identity`,
    
   //client_id: 'js', 
   client_id: environment.IDENTITY_CLIENT_ID,
   

    redirect_uri: `${environment.CLIENT_HOST}/auth-callback`, // 'http://localhost:4200/auth-callback',  //registered URI that the OpenID Connect provider can redirect a user to once they log out
    post_logout_redirect_uri: environment.CLIENT_HOST,
    
    //TODO: try with both id_token and token
    response_type: 'token', //"id_token token",
    // response_type: 'id_token token',
    // response_type: 'token id_token',

    //scope: "openid profile api1",
    // scope: 'openid profile customer',
    // scope: 'openid customer',
    //scope: 'openid',
    scope: 'customer',
    

    filterProtocolClaims: true, // protocol level claims such as nbf, iss, at_hash, and nonce from being extracted from the identity token as profile data. These claims aren’t typically of much use outside of token validation
    loadUserInfo: true, //allows the library to automatically call the OpenID Connect Provider’s User Info endpoint using the received access token, in order to access additional identity data about the authenticated user. This is true by default
  
    //REVIEW: https://www.scottbrady91.com/OpenID-Connect/Silent-Refresh-Refreshing-Access-Tokens-when-using-the-Implicit-Flow
    automaticSilentRenew: true,
    silent_redirect_uri: `${environment.CLIENT_HOST}/silent-refresh.html`,
    revokeAccessTokenOnSignout : false,

    ui_locales:"en-CA",
    accessTokenExpiringNotificationTime: 4,
    acr_values: `productcode:${environment.PRODUCT_CODE}`, //acr_values :  "productcode:ESDH-MIA"
    
  };

  console.log(userManagerSettings);

  return userManagerSettings;
}
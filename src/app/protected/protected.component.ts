import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'oidc-client';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent implements OnInit {
  
  user$ : Observable<User>;
  user : User;

  fg: FormGroup;
  fb: FormBuilder;
  constructor(private authService : AuthService, formBuilder : FormBuilder) {
     
      this.fb = formBuilder;
      this.fg = formBuilder.group({     
      });

      var textInputFormControl = formBuilder.control('');
      this.fg.addControl('textInput',textInputFormControl);

   }

  ngOnInit() {

    //get the observable
    this.user$ = this.authService.UserObservable;

      //this.authService.UserObservable.subscribe(user=>{
      this.user$.subscribe(user=>
      {
         let tokenExpired = user ? user.expired  : true;     

          console.log(`ProtectedComponent.ngOnInit - UserObservable updated - user.expired: ${user.expired}, expires_in : ${user.expires_in}, user.expires_at : ${user.expires_at}`);
          this.user = user;
      })


  }


  fgSubmit(fg : FormGroup){

    console.log(fg.value);

    console.log(`ProtectedComponent.fgSubmit - UserObservable state - user.expired: ${this.user.expired}, expires_in : ${this.user.expires_in}, user.expires_at : ${this.user.expires_at}`);
          
    this.authService.isLoggedIn("dasd").subscribe(isLoggedIn =>  {
      console.log(`it is really logged in : ${isLoggedIn}`);

      if(isLoggedIn){

      }
      else{

      }
    
    });

  }

  // fgSubmitX(fg : FormGroup){
  //   console.log(fg);
  //   console.log(fg.value);

  //   this.authService.isLoggedIn("dasd").subscribe(isLoggedIn =>  {
  //     if(isLoggedIn){
  //       console.log("it is really logged in");
        
  //       this.user$.subscribe(user=>{
  //         let tokenExpired = user ? user.expired  : true;     
 
  //      console.log(`tokenExpired : ${tokenExpired}`);
  //      console.log(`user.expires_in: ${user.expires_in}`);
  //    })


  //     }
  //     else{


  //       this.user$.subscribe(user=>{
  //         let tokenExpired = user ? user.expired  : true;  
  //         console.log(`tokenExpired: ${tokenExpired}`);
  //      console.log(`user.expires_in: ${user.expires_in}`);

  //     });

  //   }

  //   this.authService.UserObservable.subscribe(u=>{
  //     console.log(u.expired);
  //     console.log(u.expires_at);
  //     console.log(u.expires_in);
  //   });

  // }

}

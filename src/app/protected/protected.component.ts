import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'oidc-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

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
     
        //get the observable
        this.user$ = this.authService.UserObservable;
         

        //this.authService.UserObservable.subscribe(user=>{
        this.user$.subscribe(user=>
        {
           let tokenExpired = user ? user.expired  : true;     
  
            console.log(`ProtectedComponent.ngOnInit - UserSubject UPDATED - user.expired: ${user.expired}, expires_in : ${user.expires_in}, user.expires_at : ${user.expires_at}`);
            this.user = user;
        })


      this.fb = formBuilder;
      this.fg = formBuilder.group({     
      });

      var textInputFormControl = formBuilder.control('');
      this.fg.addControl('textInput',textInputFormControl);
      

   }

 



  ngOnInit() {




  }




  fgSubmit(fg : FormGroup){

    console.log(fg.value);

    //check if the user is still valid before calling any API
    this.authService.isLoggedInX().then(isUserLoggedIn=>{
      console.log(`ProtectedComponent.fgSubmit - isUserLoggedIn : ${isUserLoggedIn}`);
    });
 
  }
 

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { NotSecuredComponent } from './not-secured/not-secured.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserStatusComponent } from './user-status/user-status.component';
 
// import { FormBuilderComponent } from './form-builder/form-builder.component';


@NgModule({
  declarations: [
    AppComponent,
    ProtectedComponent,
    AuthCallbackComponent,
    NotSecuredComponent,
    WelcomeComponent,
    UserStatusComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [AuthGuardService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

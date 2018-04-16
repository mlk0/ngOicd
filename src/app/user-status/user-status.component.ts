import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from 'oidc-client';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  expiresAtDate: Date;
  
  user$ : Observable<User>;
  constructor(private authService: AuthService) { 
   
  }

  ngOnInit() {
    this.user$ = this.authService.UserObservable;

    this.user$.subscribe(u=>{
     this.expiresAtDate = new Date(u.expires_at*1000);
    })
  }
}

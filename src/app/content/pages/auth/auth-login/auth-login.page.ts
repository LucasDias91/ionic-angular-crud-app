import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.page.html',
  styleUrls: ['./auth-login.page.scss'],
})
export class AuthLoginPage implements OnInit {
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription
  size: string = '12';

  constructor() { }

  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      if(window.screen.height < 401){
        this.size = '6';
        return;
      }
      this.size = '12';
    })
    console.log()
  }

  login() {

  }

  register() {

  }

  resetPassword() {
    
  }
 
}

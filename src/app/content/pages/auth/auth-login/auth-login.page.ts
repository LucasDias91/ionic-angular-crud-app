import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Login } from 'src/app/core/models/authentication/login';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.page.html',
  styleUrls: ['./auth-login.page.scss'],
})
export class AuthLoginPage implements OnInit {
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription
  size: string = '12';
  loadingAfterSubmit: boolean = false;
  errorMsg: string = '';
  form: FormGroup;

  constructor(private navController: NavController,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.resizeEvent();
  }

  createForm() {
    const patternEmail: string = "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.pattern(patternEmail)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])]
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const login = this.prepareLogin();
    console.log(login)

  }

  prepareLogin() {
    const login = new Login();
    login.grant_type = 'password';
    login.username = this.form.get('username').value;
    login.password = this.form.get('password').value;
    return login;
  }

  login(login: Login) {
    this.loadingAfterSubmit = true;
    setTimeout(() => {
      this.loadingAfterSubmit = false;
    }, 3000)
  }

  register() {
    this.navController.navigateForward(['auth/register'])
  }

  resetPassword() {

  }

  resizeEvent() {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      if (window.screen.height < 401) {
        this.size = '6';
        return;
      }
      this.size = '12';
    });
  }


}

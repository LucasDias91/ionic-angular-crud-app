import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Login } from 'src/app/core/models/authentication/login';
import { AuthenticationService } from 'src/app/core/services/auth/authentication.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SweetAlertService } from 'src/app/core/services/sweetAlert/sweet-alert.service';

let _subscritions$: Subscription[] = [];

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.page.html',
  styleUrls: ['./auth-login.page.scss'],
})
export class AuthLoginPage implements OnInit, OnDestroy {
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription
  size: string = '12';
  loadingAfterSubmit: boolean = false;
  errorMsg: string = '';
  form: FormGroup;

  constructor(private navController: NavController,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    public loadingService: LoadingService,
    private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    this.createForm();
    this.resizeEvent();
    
    
  }

  ngOnDestroy() {
    _subscritions$.map((sub)=> sub.unsubscribe())
  }

  createForm() {
    const patternEmail: string = "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(patternEmail)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
      keep_login: [localStorage.getItem('keep_login') == "true"]
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const login = this.prepareLogin();
    console.log(login)
    this.login(login)

  }

  login(login: Login) {
    this.loadingService.presentLoading('Entrando...')
    _subscritions$.push(this.authService.login(login).pipe(
      finalize(()=>{
        this.loadingService.dismissLoading();
      })
    ).subscribe((accessData)=>{
      localStorage.setItem('keep_login', login.keep_login.toString())
        this.navController.navigateRoot['/']
      },(err)=>{
        console.log(err)
        if(err.error.statusCode == 3) {
          this.sweetAlertService.presentAlert('error','OPS!', 'Usuário ou senha inválidos. Tente novamente!');
          return
        }
        this.sweetAlertService.presentAlert('error','OPS!', 'Não foi possível efeturar o login. Entre em contato com o Lucas Dias!');
              //this.sweetAlertService.presentAlert()
      }))
  }

  prepareLogin() {
    const login = new Login();
    login.keep_login =  this.form.get('keep_login').value;
    login.grantType = 'password';
    login.email = this.form.get('email').value;
    login.password = this.form.get('password').value;
    return login;
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

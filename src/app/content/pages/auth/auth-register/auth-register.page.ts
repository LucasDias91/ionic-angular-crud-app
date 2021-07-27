import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from 'src/app/core/models/authentication/register';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.page.html',
  styleUrls: ['./auth-register.page.scss'],
})
export class AuthRegisterPage implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const patternEmail: string = "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      avatar: [null],
      name: [null,Validators.compose([Validators.required, Validators.pattern(patternEmail)]) ],
      email: [null,Validators.compose([Validators.required, Validators.pattern(patternEmail)]) ],
      password: [null,Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)]) ],
      confirm_password: [null,Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)]) ],
    })
  }

  takePicture() {

  }

  onSubmit() {

  }

  prepareRegister() {
    const _resgister = new Register();
    
  }

}

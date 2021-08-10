import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthRegisterPageRoutingModule } from './auth-register-routing.module';

import { AuthRegisterPage } from './auth-register.page';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AuthRegisterPageRoutingModule
  ],
  declarations: [AuthRegisterPage],
  providers: [Camera]
})
export class AuthRegisterPageModule {}

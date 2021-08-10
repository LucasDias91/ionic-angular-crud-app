import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'ngx-auth';
import { Subscription } from 'rxjs';
import { Register } from 'src/app/core/models/authentication/register';
import { AuthenticationService } from 'src/app/core/services/auth/authentication.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/camera/ngx';

let subscriptions$: Subscription[] = [];

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.page.html',
  styleUrls: ['./auth-register.page.scss'],
})
export class AuthRegisterPage implements OnInit, OnDestroy {
  form: FormGroup;
  loadingAfterSubmit: boolean = false;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    private loadingService: LoadingService,
    private actionSheetController: ActionSheetController,
    private camera: Camera) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    subscriptions$.map((sub)=> sub.unsubscribe());
  }

  createForm() {
    const patternEmail: string = "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      avatar64: ['./../../../../../assets/images/no-user.jpg'],
      name: [null, Validators.compose([Validators.required, Validators.pattern(patternEmail)])],
      email: [null, Validators.compose([Validators.required, Validators.pattern(patternEmail)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
      confirm_password: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
    })
  }

 
  onSubmit() {
    if (this.form.valid) {
      return
    }
    const register = this.prepareRegister();
    //this.loadingService.isLoading()
    this.register(register)
  }

  register(register: Register) {
    subscriptions$.push(
      this.authService.postRegister(register)
                   .subscribe((accessData)=>{
                     this.modalCtrl.dismiss(register);
                   },()=>{

                   })
    )
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selecione a fonte da imagem",
      buttons: [{
        text: 'Carregar da galeria',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Usar a camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'Cancelar'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 60,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit : false,
      destinationType: this.camera.DestinationType.DATA_URL
    };

    this.camera.getPicture(options)
      .then(imagePath => {
        const base64image = 'data:image/jpeg;base64,' + imagePath;
        this.form.controls['avatar64'].setValue(base64image);
      });
  }

  prepareRegister() {
    const register = new Register();
    const controls = this.form.controls;
    register.avatar = controls.avatar.value;
    register.name = controls.name.value;
    register.email = controls.email.value;
    register.password = controls.password.value;
    register.confirm_password = controls.confirm_password.value;
    return register;
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

}

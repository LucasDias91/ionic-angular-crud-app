import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  SweetAlertOptions:     SweetAlertOptions
  constructor() { }


  presentAlert(icon: SweetAlertIcon, title: string = '', text: string = '', footer: string = '') {
    Swal.fire({
      //icon: icon,
      //title: title,
      customClass:{
        footer: 'container',
        confirmButton: 'top-margin',
        actions: 'vertical-buttons',
      },
      confirmButtonColor: '#1CE98E',
   
      text: text,
       footer: footer
    })
  }
}

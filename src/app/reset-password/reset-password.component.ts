import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  onSubmit() {
    this.afAuth.sendPasswordResetEmail(this.email)
      .then(() => this.message = 'Correo de restablecimiento enviado. Revisa tu bandeja de entrada.')
      .catch(error => this.message = 'Error al enviar el correo de restablecimiento: ' + error);
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}

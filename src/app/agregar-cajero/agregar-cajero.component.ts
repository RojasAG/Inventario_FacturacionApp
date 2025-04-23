import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-cajero',
  templateUrl: './agregar-cajero.component.html',
  styleUrls: ['./agregar-cajero.component.scss']
})
export class AgregarCajeroComponent {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private snackBar: MatSnackBar
  ) {}

  async agregarCajero() {
    if (!this.email) {
      this.snackBar.open('Debe ingresar un correo electrónico', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    if (!this.password) {
      this.snackBar.open('Debe ingresar una contraseña', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      const user = userCredential.user;

      if (user) {
        this.snackBar.open('Cajero agregado exitosamente', 'Cerrar', {
          duration: 3000,
        });

        // Limpiar campos del formulario
        this.email = '';
        this.password = '';
      }
    } catch (error: any) {
      this.handleFirebaseError(error);
    }
  }

  private handleFirebaseError(error: any) {
    let message = 'Error al agregar cajero';
    if (error.code === 'auth/email-already-in-use') {
      message = 'El correo electrónico ya está en uso.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'El correo electrónico no es válido. Debe tener un formato correcto, como usuario@gmail.com';
    } else if (error.code === 'auth/weak-password') {
      message = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
    }

    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
    });
    console.error('Error al crear el cajero', error);
  }
}

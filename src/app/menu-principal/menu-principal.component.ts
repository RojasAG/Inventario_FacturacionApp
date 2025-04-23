import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthfirebaseService } from '../services/authfirebase.service';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { slideInAnimation } from '../../animations';


@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  animations: [slideInAnimation]
})
export class MenuPrincipalComponent {

  user: any = null;

  constructor(private afAuth: AngularFireAuth, 
    private router: Router, 
    private authService: AuthfirebaseService, 
    private firebase: FirestoreserviceService,
  ) {}


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }

  openModal() {
    document.getElementById('user-info-modal')!.style.display = 'block';
  }

  goToAddProduct() {
    this.router.navigate(['menu-principal/agregar-producto']);
  }

  goToViewProducts() {
    this.router.navigate(['menu-principal/ver-productos']);
  }

  goToViewInvoices() {
    this.router.navigate(['menu-principal/ver-facturas']);
  }
  goToViewClosures(){
    //this.actualizar();
    this.router.navigate(['menu-principal/ver-cierres']);
    
  }
  goToViewInvoicesDelete(){
    this.router.navigate(['menu-principal/ver-facturas-borradas']);
  }

  goToInfoFact(){
    this.router.navigate(['menu-principal/ver-info-fact']);
  }

  actualizar(){
    this.firebase.borrarTodosLosCierresDeCaja();
  }
}

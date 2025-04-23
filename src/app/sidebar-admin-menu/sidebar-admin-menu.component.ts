import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthfirebaseService } from '../services/authfirebase.service';
import { FirestoreserviceService } from '../services/firestoreservice.service';

@Component({
  selector: 'sidebar-admin-menu',
  templateUrl: './sidebar-admin-menu.component.html',
  styleUrls: ['./sidebar-admin-menu.component.scss']
})
export class SidebarAdminMenuComponent {

  user: any = null;
  menuOpen: boolean = false; // Iniciar como colapsado

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
  
  goToViewProducts() {
    this.router.navigate(['menu-principal/ver-productos']);
  }

  goToViewInvoices() {
    this.router.navigate(['menu-principal/ver-facturas-admin']);
  }

  goToViewClosures() {
    this.router.navigate(['menu-principal/ver-cierres']);
  }

  goToViewInvoicesDelete() {
    this.router.navigate(['menu-principal/ver-facturas-borradas']);
  }

  goToInfoFact() {
    this.router.navigate(['menu-principal/ver-info-fact']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const hostElement = document.querySelector('.main-container') as HTMLElement;
    
    if (this.menuOpen) {
      hostElement.classList.remove('menu-collapsed');
      hostElement.classList.add('menu-expanded');
    } else {
      hostElement.classList.remove('menu-expanded');
      hostElement.classList.add('menu-collapsed');
    }
  }

  verCierresMensuales(){
    this.router.navigate(['/menu-principal/ver-cierres-mes']);
  }

  agregarCajero(){
    this.router.navigate(['/menu-principal/agregar-cajero']);
  }
  
}

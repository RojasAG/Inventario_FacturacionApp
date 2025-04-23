import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent {

  constructor(private afAuth: AngularFireAuth, 
    private router:Router){}
    
  verProductos() {
    // Lógica para abrir el modal
    const modalElement = document.getElementById('verProductosModal');
    if (modalElement) {
      modalElement.style.display = 'block';
    }
  }


  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }

  verFacturas(){
    this.router.navigate(['/menu-cajero/ver-factura-cajero']);
  }

  verCierresDiarios(){
    this.router.navigate(['/menu-cajero/ver-cierres']);
  }

}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-facturas-cierre',
  templateUrl: './ver-facturas-cierre.component.html',
  styleUrls: ['./ver-facturas-cierre.component.scss']
})
export class VerFacturasCierreComponent implements OnInit {
  facturas: any[] = [];
  facturaIds: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private firestoreService: FirestoreserviceService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const storedFacturaIds = localStorage.getItem('facturaIds');
    if (storedFacturaIds) {
      this.facturaIds = JSON.parse(storedFacturaIds);
      this.cargarFacturas();
    }
  }

  cargarFacturas(): void {
    this.firestoreService.obtenerFacturasPorIds(this.facturaIds).subscribe(facturas => {
      this.facturas = facturas;
    });
  }

  goBack(): void {
    this.router.navigate(['/menu-principal/ver-cierres']);
  }

  get paginatedFacturas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.facturas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.applyAnimation().then(() => {
        this.currentPage++;
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.applyAnimation().then(() => {
        this.currentPage--;
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.facturas.length / this.itemsPerPage);
  }

  applyAnimation(): Promise<void> {
    return new Promise((resolve) => {
      const facturasTable = document.querySelector('.facturas-table');
      if (facturasTable) {
        this.renderer.addClass(facturasTable, 'fade-leave');
        setTimeout(() => {
          this.renderer.removeClass(facturasTable, 'fade-leave');
          this.renderer.addClass(facturasTable, 'fade-enter');
          setTimeout(() => {
            this.renderer.removeClass(facturasTable, 'fade-enter');
            resolve();
          }, 500); // Duración del efecto fade-in
        }, 500); // Duración del efecto fade-out
      } else {
        resolve();
      }
    });
  }
}

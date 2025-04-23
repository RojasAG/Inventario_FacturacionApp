import { Component, OnInit } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VerFacturaBorradaModalComponent } from '../ver-factura-borrada-modal/ver-factura-borrada-modal.component';


@Component({
  selector: 'app-ver-facturas-borradas',
  templateUrl: './ver-facturas-borradas.component.html',
  styleUrls: ['./ver-facturas-borradas.component.scss']
})
export class VerFacturasBorradasComponent implements OnInit {
  facturasBorradas: any[] = [];
  searchTerm: string = '';
  searchDate: string = '';

  constructor(private firestoreService: FirestoreserviceService, private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.firestoreService.obtenerFacturasBorradas().subscribe(facturas => {
      this.facturasBorradas = facturas;
    });
  }

  buscarFactura(): void {
    if (this.searchTerm || this.searchDate) {
      this.firestoreService.obtenerFacturasBorradas().subscribe(facturas => {
        this.facturasBorradas = facturas.filter(factura => {
          const clienteMatch = factura.clienteNombre.toLowerCase().includes(this.searchTerm.toLowerCase());
          const idMatch = factura.id.toLowerCase().includes(this.searchTerm.toLowerCase());
          const dateMatch = this.searchDate ? this.formatDate(factura.fecha.toDate()) === this.searchDate : true;  // Compara con la fecha buscada
          
          return (clienteMatch || idMatch) && dateMatch;
        });
      });
    } else {
      this.firestoreService.obtenerFacturasBorradas().subscribe(facturas => {
        this.facturasBorradas = facturas;
      });
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
  }

  formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);  // Formatea la fecha como YYYY-MM-DD
  }

  // Lógica de paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;

  get facturasPaginadas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.facturasBorradas.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.facturasBorradas.length) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.facturasBorradas.length / this.itemsPerPage);
  }

  verFactura(facturaId: string): void {
    const facturaSeleccionada = this.facturasBorradas.find(factura => factura.id === facturaId);
    if (facturaSeleccionada) {
      this.dialog.open(VerFacturaBorradaModalComponent, {
        width: '600px',
        data: facturaSeleccionada
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Producto } from '../interfaces/producto.interface';

@Component({
  selector: 'app-ver-productos-modal',
  templateUrl: './ver-productos-modal.component.html',
  styleUrls: ['./ver-productos-modal.component.scss']
})
export class VerProductosModalComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  paginatedProductos: Producto[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor(private firestoreService: FirestoreserviceService) {}

  ngOnInit() {
    this.firestoreService.obtenerProductos().subscribe(data => {
      this.productos = data;
      this.filteredProductos = data;
      this.calculateTotalPages();
      this.updatePaginatedProductos();
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('verProductosModal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }

  buscarProducto() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProductos = this.productos.filter(producto =>
      producto.codigo.toLowerCase().includes(term) ||
      producto.descripcion.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePaginatedProductos();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredProductos.length / this.itemsPerPage);
  }

  updatePaginatedProductos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProductos = this.filteredProductos.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProductos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProductos();
    }
  }
}

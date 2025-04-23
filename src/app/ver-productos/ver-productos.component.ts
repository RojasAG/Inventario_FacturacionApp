import { Component, OnInit, Renderer2 } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Producto } from '../interfaces/producto.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.scss']
})
export class VerProductosComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  searchTerm: string = '';
  productoSeleccionado: Producto | null = null;
  mostrarAgregar: boolean = false;
  mostrarBorrar: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 7;

  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(private productoService: FirestoreserviceService, 
    private router: Router, private renderer: Renderer2,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe((data: Producto[]) => {
      this.productos = data.map(producto => ({
        ...producto,
        precio: producto.precio !== null ? producto.precio : 0 // Si el precio es null, se asigna 0
      }));
      this.filteredProductos = this.productos;
    });
    this.renderer.addClass(document.body, 'menu-collapsed');
  }

  buscarProducto() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProductos = this.productos.filter(producto =>
      producto.codigo.toLowerCase().includes(term) ||
      producto.descripcion.toLowerCase().includes(term)
    );
    this.currentPage = 1;  // Reset page to 1 after search
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = { ...producto };
  }

  cerrarModificacion() {
    this.productoSeleccionado = null;
  }

  mostrarAgregarProducto() {
    this.mostrarAgregar = true;
  }

  cerrarAgregar() {
    this.mostrarAgregar = false;
  }

  mostrarBorrarProducto() {
    this.mostrarBorrar = true;
  }

  cerrarBorrar() {
    this.mostrarBorrar = false;
  }

  productoBorrado(producto: Producto) {
    this.productos = this.productos.filter(p => p.codigo !== producto.codigo);
    this.filteredProductos = this.filteredProductos.filter(p => p.codigo !== producto.codigo);
    this.cerrarBorrar();
  }

  regresarAlMenu() {
    this.router.navigate(['/menu-principal']);
  }

  get paginatedProductos(): Producto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProductos.slice(start, end);
  }

  async nextPage() {
    if (this.currentPage < this.totalPages) {
      //await this.applyAnimation();
      this.currentPage++;
    }
  }
  
  async prevPage() {
    if (this.currentPage > 1) {
      //await this.applyAnimation();
      this.currentPage--;
    }
  }
  

  get totalPages(): number {
    return Math.ceil(this.filteredProductos.length / this.itemsPerPage);
  }

  formatPrice(price: number | null): string {
    if (price === null) {
      return 'N/A'; // O cualquier otro valor que desees mostrar en lugar de null
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).format(price);
  }

  applyAnimation(): Promise<void> {
    return new Promise((resolve) => {
      const table = document.querySelector('.table-responsive');
      if (table) {
        this.renderer.addClass(table, 'fade-leave');
        setTimeout(() => {
          this.renderer.removeClass(table, 'fade-leave');
          this.renderer.addClass(table, 'fade-enter');
          setTimeout(() => {
            this.renderer.removeClass(table, 'fade-enter');
            resolve();
          }, 500); // Duración del efecto fade-in
        }, 500); // Duración del efecto fade-out
      } else {
        resolve();
      }
    });
  }


  borrarProducto(producto: Producto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { descripcion: producto.descripcion }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.borrarProducto(producto).then(() => {
          this.productos = this.productos.filter(p => p.id !== producto.id);
          this.filteredProductos = this.filteredProductos.filter(p => p.id !== producto.id);
          this.snackBar.open(`Producto: ${producto.descripcion} borrado con éxito!`, 'Cerrar', {
            duration: 4000,
          });
        }).catch(error => {
          this.snackBar.open(`Error al borrar el producto: ${error.message}`, 'Cerrar', {
            duration: 4000,
          });
        });
      }
    });
  }
  
}

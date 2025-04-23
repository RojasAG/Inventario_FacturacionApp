import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Producto } from '../interfaces/producto.interface';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-borrar-producto',
  templateUrl: './borrar-producto.component.html',
  styleUrls: ['./borrar-producto.component.scss']
})
export class BorrarProductoComponent implements OnInit {
  @Input() productos: Producto[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() productoBorrado = new EventEmitter<Producto>();

  filteredProductos: Producto[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;

  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(
    private productoService: FirestoreserviceService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredProductos = this.productos;
  }

  buscarProducto() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProductos = this.productos.filter(producto =>
      producto.codigo.toLowerCase().includes(term) ||
      producto.descripcion.toLowerCase().includes(term)
    );
    this.currentPage = 1;  // Reset page to 1 after search
  }

  get paginatedProductos(): Producto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProductos.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProductos.length / this.itemsPerPage);
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
          this.showAlertMessage(`Producto con descripción: ${producto.descripcion} borrado con éxito!`);
         // this.productoBorrado.emit(producto);
        }).catch(error => {
          this.showAlertMessage('Error al borrar el producto: ' + error.message);
        });
      }
    });
  }

  cerrar() {
    this.close.emit();
  }

  private showAlertMessage(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 4000); // Ocultar el mensaje después de 4 segundos
  }
}

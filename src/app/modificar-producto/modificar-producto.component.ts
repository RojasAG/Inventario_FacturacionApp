import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Producto } from '../interfaces/producto.interface';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.scss']
})
export class ModificarProductoComponent implements OnInit {
  @Input() producto: Producto = { codigo: '', descripcion: '', precio: 0, cantidad: 0 };
  @Output() close = new EventEmitter<void>();

  private codigoOriginal: string = '';  // Almacenar el código original
  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(private productoService: FirestoreserviceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.codigoOriginal = this.producto.codigo;  // Guardar el código original cuando el componente se inicializa
  }

  actualizarProducto() {
    // Si el código ha cambiado, actualizarlo usando el código original
    this.productoService.actualizarProducto(this.producto, this.codigoOriginal).then(() => {
      this.codigoOriginal = this.producto.codigo;  // Actualizar el código original después de la actualización
      this.showAlertMessage('Producto actualizado con éxito');
      // this.close.emit();  // Cierra el modal después de actualizar si lo deseas
    }).catch(error => {
      this.showAlertMessage('Error al actualizar el producto: ' + error.message);
    });
  }
  
  

  cerrar() {
    this.close.emit();
  }

  private showAlertMessage(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.cdr.detectChanges();  // Forzar la detección de cambios
    setTimeout(() => {
      this.showAlert = false;
      this.cdr.detectChanges();  // Forzar la detección de cambios nuevamente
    }, 3000); // Ocultar el mensaje después de 3 segundos
  }
}

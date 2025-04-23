import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Producto } from '../interfaces/producto.interface';

@Component({
  selector: 'app-agregar-producto-modal',
  templateUrl: './agregar-producto-modal.component.html',
  styleUrls: ['./agregar-producto-modal.component.scss']
})
export class AgregarProductoModalComponent {
  producto: Producto = {
    codigo: '',
    descripcion: '',
    cantidad: null,
    precio: null
  };

  mensaje: string = '';
  exito: boolean = false;

  @Output() close = new EventEmitter<void>();

  constructor(private productoService: FirestoreserviceService) {}

  agregarProducto() {
    if (this.validarProducto()) {
      this.productoService.verificarProductoExistente(this.producto.codigo).then(existe => {
        if (existe) {
          this.mostrarMensaje(`El artículo con el código ${this.producto.codigo} ya existe. Por favor, cambie el código.`, false);
        } else {
          this.productoService.agregarProducto(this.producto).then(() => {
            this.mostrarMensaje('Artículo agregado exitosamente!', true);
            this.limpiarFormulario();
          }).catch(error => {
            console.error('Error al agregar producto: ', error);
            this.mostrarMensaje('Ocurrió un error al agregar el producto. Por favor, inténtelo de nuevo.', false);
          });
        }
      });
    } else {
      this.mostrarMensaje('Por favor, complete todos los campos.', false);
    }
  }

  validarProducto(): boolean {
    return this.producto.codigo.trim() !== '' &&
           this.producto.descripcion.trim() !== '' &&
           this.producto.cantidad !== null &&
           this.producto.cantidad > 0 &&
           this.producto.precio !== null &&
           this.producto.precio > 0;
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.exito = exito;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000); // Ocultar el mensaje después de 3 segundos
  }

  cerrar() {
    this.close.emit();
  }

  limpiarFormulario() {
    this.producto = {
      codigo: '',
      descripcion: '',
      cantidad: null,
      precio: null
    };
  }
}

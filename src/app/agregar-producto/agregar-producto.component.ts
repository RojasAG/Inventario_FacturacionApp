import { Component } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Producto } from '../interfaces/producto.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent {

  producto: Producto = {
    codigo: '',
    descripcion: '',
    cantidad: null,
    precio: null
  };

  mensajeAlerta: string = '';

  constructor(private productoService: FirestoreserviceService, private router: Router) {}

/* Esta funcion en caso de que exista solo actualizaba
  agregarProducto() {
    if (this.validarProducto()) {
      this.productoService.agregarOActualizarProducto(this.producto).then((resultado) => {
        if (resultado === 'actualizado') {
          this.mensajeAlerta = 'Artículo actualizado exitosamente!';
        } else {
          this.mensajeAlerta = 'Artículo agregado exitosamente!';
        }
        this.producto = { codigo: '', descripcion: '', cantidad: null, precio: null };
        this.ocultarMensaje();
      }).catch(error => {
        console.error('Error al agregar o actualizar producto: ', error);
      });
    } else {
      this.mensajeAlerta = 'Por favor, complete todos los campos.';
      this.ocultarMensaje();
    }
  }
        */

      agregarProducto() {
    if (this.validarProducto()) {
      this.productoService.verificarProductoExistente(this.producto.codigo).then(existe => {
        if (existe) {
          this.mensajeAlerta = `El artículo con el código ${this.producto.codigo} ya existe. Por favor, cambie el código.`;
          this.ocultarMensaje();
        } else {
          this.productoService.agregarProducto(this.producto).then(() => {
            this.mensajeAlerta = 'Artículo agregado exitosamente!';
            this.producto = { codigo: '', descripcion: '', cantidad: null, precio: null };
            this.ocultarMensaje();
          }).catch(error => {
            console.error('Error al agregar producto: ', error);
          });
        }
      });
    } else {
      this.mensajeAlerta = 'Por favor, complete todos los campos.';
      this.ocultarMensaje();
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

  ocultarMensaje() {
    setTimeout(() => {
      this.mensajeAlerta = '';
    }, 3000); // Ocultar el mensaje después de 3 segundos
  }

  regresarAlMenu() {
    this.router.navigate(['/menu-principal']);
  }

  verProductos() {
    this.router.navigate(['menu-principal/ver-productos']);
  }
}

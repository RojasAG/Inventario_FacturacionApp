import { Component, OnInit, HostListener } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';

import { Producto } from '../interfaces/producto.interface';
import { AuthfirebaseService } from '../services/authfirebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { PrinterServiceService } from '../services/printer-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion, doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app'; // Importa firebase

@Component({
    selector: 'app-menu-cajero',
    templateUrl: './menu-cajero.component.html',
    styleUrls: ['./menu-cajero.component.scss']
})
export class MenuCajeroComponent implements OnInit {
    searchTerm: string = '';
    productos: Producto[] = [];
    filteredProductos: Producto[] = [];
    factura: { producto: Producto, cantidad: number }[] = [];
    total: number = 0;
    dropdownOpen: boolean = false;
    clienteNombre: string = '';  // Campo para el nombre del cliente
    usuario: any;  // Campo para almacenar los datos del usuario logueado

    constructor(private firestoreService: FirestoreserviceService, 
      private authService: AuthfirebaseService, 
      private afAuth: AngularFireAuth, 
      private router:Router,
      private snackBar: MatSnackBar,
    private facturaService: PrinterServiceService,
    private firestore: AngularFirestore) {} 

    ngOnInit() {
        this.authService.getUser().subscribe(user => {
            this.usuario = user;
        });

        this.firestoreService.obtenerProductos().subscribe((data: Producto[]) => {
            this.productos = data.map(producto => ({
                ...producto,
                cantidadDeseada: 1 // Inicializar cantidadDeseada en 1
            }));
        });
    }

    buscarProducto() {
        const term = this.searchTerm.toLowerCase();
        if (term) {
            this.filteredProductos = this.productos.filter(producto =>
                producto.codigo.toLowerCase().includes(term) ||
                producto.descripcion.toLowerCase().includes(term)
            );
            this.dropdownOpen = true;
        } else {
            this.filteredProductos = [];
            this.dropdownOpen = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.busqueda-producto')) {
            this.dropdownOpen = false;
        }
    }

    agregarAFactura(producto: Producto, cantidad: number) {
        if (producto.cantidad != null && producto.precio != null && cantidad > 0) {
            const itemEnFactura = this.factura.find(item => item.producto.codigo === producto.codigo);
            const cantidadEnFactura = itemEnFactura ? itemEnFactura.cantidad : 0;
            const cantidadDisponible = producto.cantidad - cantidadEnFactura;
    
            if (cantidad > cantidadDisponible || cantidadDisponible <= 0) {
                this.snackBar.open(`Cantidad no disponible en existencias. La cantidad máxima es ${cantidadDisponible}`, 'Cerrar', {
                    duration: 3000
                });
                return; // Salir de la función para evitar que se agregue el producto
            }
    
            if (itemEnFactura) {
                itemEnFactura.cantidad += cantidad;
            } else {
                this.factura.push({ producto, cantidad });
            }
            this.total += producto.precio * cantidad;
    
            // Limpiar el input de búsqueda y cerrar el dropdown
            this.searchTerm = '';
            this.filteredProductos = [];
            this.dropdownOpen = false;
        } else {
            this.snackBar.open('Cantidad no disponible en existencias', 'Cerrar', {
                duration: 3000
            });
        }
    }
    
    eliminarProducto(item: { producto: Producto, cantidad: number }) {
        this.factura = this.factura.filter(f => f !== item);
        this.total -= item.producto.precio! * item.cantidad;
    }

    getAvailableQuantity(producto: Producto): number {
        const itemEnFactura = this.factura.find(item => item.producto.codigo === producto.codigo);
        const cantidadEnFactura = itemEnFactura ? itemEnFactura.cantidad : 0;
        return producto.cantidad! - cantidadEnFactura;
    }

    actualizarCantidad(item: { producto: Producto, cantidad: number }, nuevaCantidad: number) {
        console.log('Método actualizarCantidad llamado');
        const cantidadDisponible = this.getAvailableQuantity(item.producto) + item.cantidad;
        if (nuevaCantidad > cantidadDisponible) {
            console.log('Mostrando MatSnackBar para cantidad no disponible');
            this.snackBar.open(`Cantidad no disponible en existencias. La cantidad máxima es ${cantidadDisponible}`, 'Cerrar', {
                duration: 3000
            });
            nuevaCantidad = cantidadDisponible;
        }
        if (nuevaCantidad > 0) {
            const diferencia = nuevaCantidad - item.cantidad;
            item.cantidad = nuevaCantidad;
            this.total += item.producto.precio! * diferencia;
        } else {
            console.log('Mostrando MatSnackBar para cantidad mínima');
            this.snackBar.open(`Cantidad no disponible en existencias. La cantidad mínima es 1`, 'Cerrar', {
                duration: 3000
            });
        }
    }

/*
    async generarFactura() {
        const facturaData = {
            productos: this.factura.map(item => ({
                codigo: item.producto.codigo,
                descripcion: item.producto.descripcion,
                precio: item.producto.precio,
                cantidad: item.cantidad,
                total: item.producto.precio! * item.cantidad
            })),
            total: this.total,
            fecha: new Date(),
            clienteNombre: this.clienteNombre,
            usuario: {
                nombre: this.usuario?.displayName || this.usuario?.email,
                correo: this.usuario?.email
            }
        };
    
        // Guardar la factura en la colección 'facturas'
        this.firestoreService.guardarFactura(facturaData).then(() => {
            this.snackBar.open('Factura generada exitosamente', 'Cerrar', {
                duration: 3000
            });
        }).catch(error => {
            this.snackBar.open('Error al guardar la factura: ' + error.message, 'Cerrar', {
                duration: 3000
            });
        });
    
        // Actualizar la cantidad de los productos en la base de datos
        this.factura.forEach(item => {
            if (item.producto.cantidad! >= item.cantidad) {
                item.producto.cantidad! -= item.cantidad;
                this.firestoreService.actualizarProducto2(item.producto).catch(error => {
                    this.snackBar.open('Error al actualizar la cantidad del producto: ' + error.message, 'Cerrar', {
                        duration: 3000
                    });
                });
            }
        });
    
        // Limpiar los datos locales de la factura
        this.factura = [];
        this.total = 0;
        this.clienteNombre = '';
    
        // Almacenar la factura en el array dentro del documento del día en la colección 'cierre_dia'
        const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato 'YYYY-MM-DD'
        const cierreDiaDocRef = this.firestore.collection('cierre_dia').doc(today);
    
        const docSnapshot = await cierreDiaDocRef.get().toPromise();
        if (docSnapshot!.exists) {
            await cierreDiaDocRef.update({
                facturas: firebase.firestore.FieldValue.arrayUnion(facturaData)
            });
        } else {
            await cierreDiaDocRef.set({
                facturas: [facturaData],
                fecha: today
            });
        }
    
        // Almacenar la factura en el array dentro del documento del mes en la colección 'cierre_mes'
        const currentDate = new Date();
        const month = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`; // Formato 'YYYY-MM'
        const cierreMesDocRef = this.firestore.collection('cierre_mes').doc(month);
    
        const docSnapshotMes = await cierreMesDocRef.get().toPromise();
        if (docSnapshotMes!.exists) {
            await cierreMesDocRef.update({
                facturas: firebase.firestore.FieldValue.arrayUnion(facturaData)
            });
        } else {
            await cierreMesDocRef.set({
                facturas: [facturaData],
                mes: month
            });
        }
    }
*/

async generarFactura() {
    // Verificar si no hay productos en la factura
    if (this.factura.length === 0) {
        this.snackBar.open('No hay productos en la factura. Agregue al menos un producto.', 'Cerrar', {
            duration: 3000
        });
        return; // Salir de la función si no hay productos
    }

    const facturaData = {
        productos: this.factura.map(item => ({
            codigo: item.producto.codigo,
            descripcion: item.producto.descripcion,
            precio: item.producto.precio,
            cantidad: item.cantidad,
            total: item.producto.precio! * item.cantidad
        })),
        total: this.total,
        fecha: new Date(),
        clienteNombre: this.clienteNombre,
        usuario: {
            nombre: this.usuario?.displayName || this.usuario?.email,
            correo: this.usuario?.email
        }
    };

    // Guardar la factura en la colección 'facturas'
    this.firestoreService.guardarFactura(facturaData).then(() => {
        this.snackBar.open('Factura generada exitosamente', 'Cerrar', {
            duration: 3000
        });
    }).catch(error => {
        this.snackBar.open('Error al guardar la factura: ' + error.message, 'Cerrar', {
            duration: 3000
        });
    });

    // Actualizar la cantidad de los productos en la base de datos
    this.factura.forEach(item => {
        if (item.producto.cantidad! >= item.cantidad) {
            item.producto.cantidad! -= item.cantidad;
            this.firestoreService.actualizarProducto2(item.producto).catch(error => {
                this.snackBar.open('Error al actualizar la cantidad del producto: ' + error.message, 'Cerrar', {
                    duration: 3000
                });
            });
        }
    });

    // Limpiar los datos locales de la factura
    this.factura = [];
    this.total = 0;
    this.clienteNombre = '';

    // Almacenar la factura en el array dentro del documento del día en la colección 'cierre_dia'
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato 'YYYY-MM-DD'
    const cierreDiaDocRef = this.firestore.collection('cierre_dia').doc(today);

    const docSnapshot = await cierreDiaDocRef.get().toPromise();
    if (docSnapshot!.exists) {
        await cierreDiaDocRef.update({
            facturas: firebase.firestore.FieldValue.arrayUnion(facturaData)
        });
    } else {
        await cierreDiaDocRef.set({
            facturas: [facturaData],
            fecha: today
        });
    }

    // Almacenar la factura en el array dentro del documento del mes en la colección 'cierre_mes'
    const currentDate = new Date();
    const month = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`; // Formato 'YYYY-MM'
    const cierreMesDocRef = this.firestore.collection('cierre_mes').doc(month);

    const docSnapshotMes = await cierreMesDocRef.get().toPromise();
    if (docSnapshotMes!.exists) {
        await cierreMesDocRef.update({
            facturas: firebase.firestore.FieldValue.arrayUnion(facturaData)
        });
    } else {
        await cierreMesDocRef.set({
            facturas: [facturaData],
            mes: month
        });
    }
}


    onCantidadChange(event: any, item: { producto: Producto, cantidad: number }) {
        const nuevaCantidad = parseInt(event.target.value, 10);
        if (!isNaN(nuevaCantidad)) {
            this.actualizarCantidad(item, nuevaCantidad);
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

    imprimir() {
        this.facturaService.generarPDF();
      }
}

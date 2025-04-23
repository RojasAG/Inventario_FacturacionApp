import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Timestamp } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { VerFacturaModalComponent } from '../ver-factura-modal/ver-factura-modal.component';
import { MatDialog } from '@angular/material/dialog';

interface Producto {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  total: number;
}

interface Factura {
  clienteNombre: string,
  fecha: Timestamp;
  productos: Producto[];
  total: number;
}

interface InformacionFactura {
  detalle_cambio: string;
  email: string;
  nombre: string;
  telefono_local: string;
  ubicacion: string;
}

@Component({
  selector: 'app-ver-facturas-cajero',
  templateUrl: './ver-facturas-cajero.component.html',
  styleUrl: './ver-facturas-cajero.component.scss'
})
export class VerFacturasCajeroComponent {
  facturas: any[] = [];
  facturasPaginadas: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;
  searchTerm: string = '';
  searchDate: string = '';

  constructor(private firestoreService: FirestoreserviceService, 
    private router: Router, private firestore: AngularFirestore,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.firestoreService.obtenerFacturas().subscribe((data: any[]) => {
      this.facturas = data.map(factura => {
        if (!factura.total) {
          factura.total = factura.productos.reduce((sum: number, producto: any) => sum + (producto.total || 0), 0);
        }
        factura.usuario = factura.usuario || { nombre: 'Desconocido' };
        factura.usuario.nombre = factura.usuario.nombre || 'Desconocido';
        return factura;
      });
      this.totalPages = Math.ceil(this.facturas.length / this.itemsPerPage);
      this.updatePaginatedFacturas();
    });
  }

  updatePaginatedFacturas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.facturasPaginadas = this.facturas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedFacturas();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedFacturas();
    }
  }

  buscarFactura(): void {
    const term = this.searchTerm.toLowerCase();
    const selectedDate = this.searchDate ? new Date(this.searchDate).toISOString().split('T')[0] : '';
  
    this.firestoreService.obtenerFacturas().subscribe((data: any[]) => {
      this.facturas = data.filter(factura => {
        const matchesTerm = (factura.clienteNombre && factura.clienteNombre.toLowerCase().includes(term)) ||
          (factura.usuario && factura.usuario.nombre && factura.usuario.nombre.toLowerCase().includes(term)) ||
          (factura.id && factura.id.toString().toLowerCase().includes(term));
  
        // Verifica si 'factura.fecha' es un objeto Date o un Timestamp y conviértelo a una cadena en formato ISO.
        const facturaFechaISO = factura.fecha instanceof Date 
          ? factura.fecha.toISOString().split('T')[0]
          : factura.fecha.toDate().toISOString().split('T')[0];
        
        const matchesDate = selectedDate ? facturaFechaISO === selectedDate : true;
  
        return matchesTerm && matchesDate;
      });
  
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.facturas.length / this.itemsPerPage);
      this.updatePaginatedFacturas();
    });
  }
  

  regresar(): void {
    this.router.navigate(['/menu-cajero']);
  }

  formatPrice(price: number | null): string {
    if (price === null) {
      return 'N/A'; // O cualquier otro valor que desees mostrar en lugar de null
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'decimal',
      minimumFractionDigits: 2,  // Ahora se muestra con dos decimales
      maximumFractionDigits: 2,  // Siempre muestra dos decimales
      useGrouping: true
    }).format(price);
  }


  async generarPDF(facturaData: any) {
    try {
        const infoFacturaSnapshot = await this.firestore.collection('informacion_factura').get().toPromise();
        if (!infoFacturaSnapshot!.empty) {
            const infoFacturaDoc = infoFacturaSnapshot!.docs[0];
            const infoFacturaData = infoFacturaDoc.data() as InformacionFactura;

            if (facturaData && infoFacturaData) {
                const alturaBase = 80;
                const alturaProducto = 6;
                const alturaTotal = alturaBase + (alturaProducto * facturaData.productos.length) + 20;

                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [72, alturaTotal]
                });

                doc.setFont("arial");

                // Añade encabezado con nombre más grande
                doc.setFontSize(8);
                doc.text(infoFacturaData.nombre, 10, 10);

                doc.setFontSize(5);
                doc.text(`Teléfono: ${infoFacturaData.telefono_local}`, 10, 15);
                doc.text(`Correo electrónico: ${infoFacturaData.email}`, 10, 20);
                doc.text(`Ubicación: ${infoFacturaData.ubicacion}`, 10, 25);
                doc.text(`Fecha: ${new Date(facturaData.fecha.seconds * 1000).toLocaleDateString('es-ES')}`, 10, 30);

                // Posiciona correctamente "Moneda: CRC"
                doc.text(`Moneda: CRC`, 10, 35);
                doc.text(`Cliente: ${facturaData.clienteNombre}`, 10, 40);

                const startY = 50;

                // Añadir líneas discontinuas más largas para el encabezado de la tabla
                doc.setLineDashPattern([1, 1], 0);
                doc.line(3, startY - 4, 69, startY - 4); // Línea discontinua arriba del encabezado

                // Alinea el encabezado de la tabla con las columnas de productos
                const colX = [6, 32, 46, 59]; // Ajusta estas posiciones X para cada columna  21, 13, 12

                doc.text('Descripción', colX[0], startY);
                doc.text('Cantidad', colX[1], startY);
                doc.text('Unitario', colX[2], startY);
                doc.text('Total', colX[3], startY);

                doc.line(3, startY + 2, 69, startY + 2); // Línea discontinua abajo del encabezado

                // Añade tabla con los productos sin líneas entre ellos
                const productos = facturaData.productos.map((producto: any) => [
                    producto.descripcion,
                    producto.cantidad,
                    this.formatPrice(producto.precio),
                    this.formatPrice(producto.total)
                ]);

                autoTable(doc, {
                    body: productos,
                    startY: startY + 6,
                    margin: { left: 5, right: 5 },
                    styles: { fontSize: 4, textColor: [0, 0, 0], lineWidth: 0 },
                    tableWidth: 'wrap',
                    theme: 'plain',
                    columnStyles: {
                        0: { cellWidth: 28 },
                        1: { cellWidth: 11 },
                        2: { cellWidth: 13 },
                        3: { cellWidth: 13 },
                    },
                });

                const finalY = (doc as any).lastAutoTable.finalY || startY + 6;

                // Añadir línea discontinua final con texto "Última línea"
                doc.setLineDashPattern([1, 1], 0);
                doc.text('Última línea', 31, finalY + 3); // Centrar texto
                doc.line(3, finalY + 6, 69, finalY + 6); // Línea discontinua final

                // Añade el total y el detalle del cambio
                doc.setFontSize(6);
                doc.setFont("helvetica", "bold"); // Cambia a negrita
                doc.text(`Total: CRC ${this.formatPrice(facturaData.total)}`, 10, finalY + 12);
                doc.setFont("helvetica", "normal"); 
                doc.text(infoFacturaData.detalle_cambio, 10, finalY + 18);

                window.open(doc.output('bloburl'));
            }
        } else {
            console.error('No se encontró el documento de información de la factura.');
        }
    } catch (error) {
        console.error('Error generando el PDF:', error);
    }
}

verFactura(facturaId: string): void {
  const facturaSeleccionada = this.facturas.find(factura => factura.id === facturaId);
  if (facturaSeleccionada) {
    this.dialog.open(VerFacturaModalComponent, {
      width: '600px',
      data: facturaSeleccionada
    });
  }
}

}

import { Injectable } from '@angular/core';
import ConectorPluginV3 from '../ConectorPlugin';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';


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

interface ProductoResumen {
  descripcion: string;
  cantidad: number;
  codigo: string;
  precio: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrinterServiceService {

  private conectorPlugin = new ConectorPluginV3();

  constructor(private firestore: AngularFirestore) {}

  async obtenerImpresoras() {
    return await ConectorPluginV3.obtenerImpresoras();
  }

  async imprimirFactura(facturaData: any) {
    this.conectorPlugin.Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto('Factura\n')
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA);

    facturaData.productos.forEach((producto: any) => {
      this.conectorPlugin.EscribirTexto(`${producto.cantidad} x ${producto.descripcion} @ ${producto.precio} = ${producto.total}\n`);
    });

    this.conectorPlugin.EscribirTexto(`\nTotal: ${facturaData.total}\n`)
      .Corte(1);

    return await this.conectorPlugin.imprimirEn('Nombre de tu impresora');
  }


  async generarPDF() {
    try {
        const facturasSnapshot = await this.firestore.collection('facturas', ref => ref.orderBy('fecha', 'desc').limit(1)).get().toPromise();
        if (facturasSnapshot && !facturasSnapshot.empty) {
            const facturaData = facturasSnapshot.docs[0]?.data() as Factura;

            const infoFacturaSnapshot = await this.firestore.collection('informacion_factura').get().toPromise();
            if (!infoFacturaSnapshot!.empty) {
                const infoFacturaData = infoFacturaSnapshot!.docs[0].data() as InformacionFactura;

                if (facturaData && infoFacturaData) {
                    // Asumiendo un tamaño estándar de 80mm de ancho por 297mm de alto para el papel térmico
                    const alturaMaxima = 297;

                    const doc = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: [80, alturaMaxima]
                    });

                    doc.setFont("helvetica");
                    doc.setFontSize(11); // Tamaño para el encabezado
                    let currentY = 10;
                    doc.text(infoFacturaData.nombre, 6, currentY);

                    doc.setFontSize(9);
                    currentY += 6;
                    doc.text(`Teléfono: ${infoFacturaData.telefono_local}`, 6, currentY);
                    currentY += 4;
                    doc.text(`Correo electrónico: ${infoFacturaData.email}`, 6, currentY);
                    currentY += 4;
                    doc.text(`Ubicación: ${infoFacturaData.ubicacion}`, 6, currentY);
                    currentY += 4;
                    doc.text(`Fecha: ${new Date(facturaData.fecha.seconds * 1000).toLocaleDateString('es-ES')}`, 6, currentY);
                    currentY += 4;
                    doc.text(`Moneda: CRC`, 6, currentY);
                    currentY += 4;
                    doc.text(`Cliente: ${facturaData.clienteNombre}`, 6, currentY);

                    currentY += 10; // Espacio antes de la tabla

                    doc.setLineDashPattern([1, 1], 0);
                    doc.line(3, currentY - 2, 77, currentY - 2); // Línea decorativa
                    currentY += 2;

                    autoTable(doc, {
                        body: facturaData.productos.map(producto => [
                            producto.descripcion,
                            producto.cantidad.toString(),
                            this.formatPrice(producto.precio),
                            this.formatPrice(producto.total)
                        ]),
                        startY: currentY,
                        margin: { left: 3, right: 3 },
                        styles: { fontSize: 7, textColor: [0, 0, 0], lineWidth: 0 },
                        tableWidth: 'wrap',
                        theme: 'plain',
                        columnStyles: {
                            0: { cellWidth: 30 },
                            1: { cellWidth: 10 },
                            2: { cellWidth: 15 },
                            3: { cellWidth: 15 },
                        },
                    });

                    currentY = (doc as any).lastAutoTable.finalY + 4;
                    doc.line(3, currentY, 77, currentY); // Línea decorativa debajo de la tabla

                    currentY += 6;
                    doc.setFontSize(8);
                    doc.setFont("helvetica", "bold");
                    doc.text(`Total: CRC ${this.formatPrice(facturaData.total)}`, 6, currentY);

                    currentY += 18; // Ajusta según necesites para el detalle del cambio
                    doc.setFontSize(7); // Ajusta tamaño de fuente si es necesario
                    doc.text(infoFacturaData.detalle_cambio, 6, currentY); // Usamos '6' para alinear con el resto

                    window.open(doc.output('bloburl'));
                }
            } else {
                console.error('No se encontró el documento de información de la factura.');
            }
        } else {
            console.error('No se encontró la última factura.');
        }
    } catch (error) {
        console.error('Error generando el PDF:', error);
    }
}


async generarPDFCierreDia(fecha: string): Promise<void> {
  console.log("Fecha buscada:", fecha);
  try {
    const documentoRef = this.firestore.collection('cierre_dia').doc(fecha);
    const documentoSnapshot = await documentoRef.get().toPromise();

    if (!documentoSnapshot?.exists) {
      console.error('No se encontró el documento para el día especificado.');
      return;
    }

    const data = documentoSnapshot.data() as { facturas: Factura[] };
    const facturas = data.facturas;
    console.log("Facturas encontradas:", facturas.length);

    let totalDelDia = 0;
    let cantidadFacturas = facturas.length;
    let productosResumen: Producto[] = [];

    facturas.forEach(factura => {
      totalDelDia += factura.total;
      factura.productos.forEach(producto => {
        productosResumen.push({
          descripcion: producto.descripcion,
          cantidad: producto.cantidad,
          codigo: producto.codigo,
          precio: producto.precio,
          total: producto.total
        });
      });
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297]  // Ancho de 80mm para impresoras térmicas
    });
    
    let currentY = 10;
    doc.setFont("helvetica");
    doc.setFontSize(11);  // Reducir el tamaño de fuente para que todo quepa mejor
    
    // Convertir la fecha a formato español
    const fechaFormatoLocal = new Date(fecha + "T12:00:00").toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    
    doc.text(`Resumen del día: ${fechaFormatoLocal}`, 6, currentY);
    currentY += 6;
    
    doc.setFontSize(10);  // Tamaño más pequeño para el texto secundario
    doc.text(`Cantidad de facturas: ${cantidadFacturas}`, 6, currentY);
    currentY += 4;
    doc.text(`Total del día: CRC ${this.formatPrice(totalDelDia)}`, 6, currentY);
    currentY += 4;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Descripción', 'Código', 'Cant', 'Precio', 'Total']],
      body: productosResumen.map(producto => [
        producto.descripcion,
        producto.codigo,
        producto.cantidad.toString(),
        this.formatPrice(producto.precio),
        this.formatPrice(producto.total)
      ]),
      margin: { top: 10, right: 2, left: 2 },  // Ajustar márgenes para maximizar espacio
      theme: 'plain',
      styles: {
        fontSize: 8,  // Reducción de la fuente para contenido de tabla
        cellPadding: 1,
        overflow: 'linebreak',
        lineColor: 200,
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [255, 255, 255],  // Blanco para eliminar colores
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 12 },
        2: { cellWidth: 10 },
        3: { cellWidth: 16 },
        4: { cellWidth: 16 }
      }
    });
    
    window.open(doc.output('bloburl'));
    

  } catch (error) {
    console.error('Error generando el PDF:', error);
  }
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

}

import { Component} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MostrarFacturasCierreModalComponent } from '../mostrar-facturas-cierre-modal/mostrar-facturas-cierre-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PrinterServiceService } from '../services/printer-service.service';


@Component({
  selector: 'app-ver-cierres-cajero',
  templateUrl: './ver-cierres-cajero.component.html',
  styleUrl: './ver-cierres-cajero.component.scss'
})
export class VerCierresCajeroComponent {
  cierres: any[] = []; // Todos los documentos de la colección 'cierre_dia'
  cierresPaginados: any[] = []; // Documentos mostrados en la página actual
  paginaActual: number = 0;
  cierresPorPagina: number = 7;
  fechaBusqueda: string = '';
  constructor(private firestore: AngularFirestore, private dialog: MatDialog, private router: Router,private printerService: PrinterServiceService) {}

  ngOnInit(): void {
    this.obtenerCierres();
  }

  obtenerCierres(): void {
    this.firestore.collection('cierre_dia', ref => ref.orderBy('fecha', 'desc')).snapshotChanges().subscribe(snapshot => {
      this.cierres = snapshot.map(doc => {
        const data = doc.payload.doc.data() as any;
        const id = doc.payload.doc.id;

        // Extraer la fecha del nombre del documento (ID)
        const fechaDocumentId = id;
        const fechaFormateada = this.formatearFecha(fechaDocumentId);

        const totalDelDocumento = data.facturas.reduce((acc: number, factura: any) => acc + factura.total, 0);

        return {
          id,
          fecha: fechaFormateada, // Usamos la fecha formateada desde el ID del documento
          cantidadFacturas: data.facturas.length,
          totalDelDia: totalDelDocumento,
          facturas: data.facturas // Aquí incluimos todas las facturas del día
        };
      });
      this.actualizarCierresPaginados();
    });
  }

  formatearFecha(fecha: string): string {
    const partesFecha = fecha.split('-');
    const anio = partesFecha[0];
    const mes = partesFecha[1];
    const dia = partesFecha[2];
    return `${dia}/${mes}/${anio}`;
  }

  actualizarCierresPaginados(): void {
    const inicio = this.paginaActual * this.cierresPorPagina;
    const fin = inicio + this.cierresPorPagina;
    this.cierresPaginados = this.cierres.slice(inicio, fin);
  }

  paginaSiguiente(): void {
    if ((this.paginaActual + 1) * this.cierresPorPagina < this.cierres.length) {
      this.paginaActual++;
      this.actualizarCierresPaginados();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarCierresPaginados();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.cierres.length / this.cierresPorPagina);
  }

  abrirModalFacturas(cierre: any): void {
    this.dialog.open(MostrarFacturasCierreModalComponent, {
      width: '800px',
      data: { facturas: cierre.facturas }
    });
  }

  imprimirCierre(fechaSeleccionada: string): void {
    // Convertir la fecha de DD/MM/YYYY a YYYY-MM-DD
    const fechaFormatoCorrecto = this.convertirFormatoFecha(fechaSeleccionada);
    if (fechaFormatoCorrecto) {  // Asegura que la fecha no esté vacía antes de proceder
      this.printerService.generarPDFCierreDia(fechaFormatoCorrecto)
        .then(() => {
          console.log('Cierre impreso con éxito.');
        }).catch(error => {
          console.error('Error al imprimir el cierre:', error);
        });
    }
  }
  
  convertirFormatoFecha(fecha: string): string {
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const [dia, mes, año] = partes;
      return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`; // Asegura que el formato sea siempre YYYY-MM-DD
    } else {
      console.error("Formato de fecha no válido:", fecha);
      return '';  // Devuelve una cadena vacía o maneja el error como consideres necesario
    }
  }
  

  volver(): void {
    this.router.navigate(['/menu-cajero']);
  }
  buscarPorFecha(): void {
    if (this.fechaBusqueda) {
      this.firestore.collection('cierre_dia', ref =>
        ref.where('fecha', '==', this.fechaBusqueda)
      ).snapshotChanges().subscribe(snapshot => {
        this.cierres = snapshot.map(doc => {
          const data = doc.payload.doc.data() as any;
          const id = doc.payload.doc.id;
          const fechaFormateada = this.formatearFecha(id);
          const totalDelDocumento = data.facturas.reduce((acc: number, factura: any) => acc + factura.total, 0);

          return {
            id,
            fecha: fechaFormateada,
            cantidadFacturas: data.facturas.length,
            totalDelDia: totalDelDocumento,
            facturas: data.facturas
          };
        });

        this.actualizarCierresPaginados();
      });
    } else {
      // Si no se selecciona ninguna fecha, cargar todos los cierres
      this.obtenerCierres();
    }
  }
}


  
/*
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MostrarFacturasCierreModalComponent } from '../mostrar-facturas-cierre-modal/mostrar-facturas-cierre-modal.component';

@Component({
  selector: 'app-ver-cierres-mes',
  templateUrl: './ver-cierres-mes.component.html',
  styleUrl: './ver-cierres-mes.component.scss'
})
export class VerCierresMesComponent {
  cierresMensuales: any[] = []; // Todos los documentos de la colección 'cierre_mes'
  cierresMensualesPaginados: any[] = []; // Documentos mostrados en la página actual
  paginaActual: number = 0;
  cierresPorPagina: number = 7;
  fechaBusqueda: string = '';
  constructor(private firestore: AngularFirestore, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerCierresMensuales();
  }

  obtenerCierresMensuales(): void {
    this.firestore.collection('cierre_mes').snapshotChanges().subscribe(snapshot => {
      console.log("Datos recibidos: ", snapshot);
      this.cierresMensuales = snapshot.map(doc => {
        const data = doc.payload.doc.data() as any;
        const id = doc.payload.doc.id;
  
        // Extraer el mes y año del ID del documento (por ejemplo, '2024-08')
        const fechaDocumentId = id;
        const fechaFormateada = this.formatearFecha(fechaDocumentId);
  
        // Calcular el total del mes sumando los totales de todas las facturas en el array 'facturas'
        const totalDelMes = data.facturas.reduce((acc: number, factura: any) => acc + factura.total, 0);
  
        return {
          id,
          mes: fechaFormateada, // Usamos la fecha formateada desde el ID del documento
          cantidadFacturas: data.facturas.length,
          totalDelMes: totalDelMes,
          facturas: data.facturas // Incluimos todas las facturas del mes
        };
      });
  
      // Ordenar los documentos por fecha (del más nuevo al más viejo)
      this.cierresMensuales.sort((a, b) => {
        const [mesA, anioA] = a.id.split('-').map(Number); // Separar año y mes de los IDs
        const [mesB, anioB] = b.id.split('-').map(Number);
  
        // Comparar primero por año, y luego por mes
        if (anioA !== anioB) {
          return anioB - anioA; // Ordenar de más nuevo a más viejo
        }
        return mesB - mesA;
      });
  
      this.actualizarCierresMensualesPaginados();
      console.log("Este es el dato paginado y correcto: ", this.cierresMensualesPaginados)
    });
  }
  
  buscarPorFecha(): void {
    if (this.fechaBusqueda) {
      const [anio, mes] = this.fechaBusqueda.split('-'); // Extraer año y mes del input
      const mesBusqueda = `${anio}-${mes.padStart(2, '0')}`; // Formatear la búsqueda como 'YYYY-MM'
  
      console.log('Buscando por:', mesBusqueda);
  
      // Filtrar cierresMensuales que coincidan con el mes y año de búsqueda
      const resultadosFiltrados = this.cierresMensualesPaginados.filter(cierre => {
        console.log("Comparando:", cierre.id, "con", mesBusqueda); // Debug de los valores
        return cierre.id === mesBusqueda;
      });
  
      console.log("Resultados Filtrados:", resultadosFiltrados);
      console.log("Cierres Mensuales Paginados Originales:", this.cierresMensualesPaginados);
  
      this.cierresMensualesPaginados = resultadosFiltrados;
      this.actualizarCierresMensualesPaginados();
    } else {
      // Si no hay búsqueda, mostrar todos los cierres mensuales
      this.obtenerCierresMensuales();
    }
  }

  formatearFecha(fecha: string): string {
    const partesFecha = fecha.split('-');
    const anio = partesFecha[0];
    const mes = partesFecha[1];
    return `${mes}/${anio}`; // Formatear como 'MM/YYYY'
  }

  actualizarCierresMensualesPaginados(): void {
    const inicio = this.paginaActual * this.cierresPorPagina;
    const fin = inicio + this.cierresPorPagina;
    this.cierresMensualesPaginados = this.cierresMensuales.slice(inicio, fin);
  }

  paginaSiguiente(): void {
    if ((this.paginaActual + 1) * this.cierresPorPagina < this.cierresMensuales.length) {
      this.paginaActual++;
      this.actualizarCierresMensualesPaginados();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarCierresMensualesPaginados();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.cierresMensuales.length / this.cierresPorPagina);
  }

  abrirModalFacturas(cierre: any): void {
    this.dialog.open(MostrarFacturasCierreModalComponent, {
      width: '800px',
      data: { facturas: cierre.facturas }
    });
  }
}
  */

import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MostrarFacturasCierreModalComponent } from '../mostrar-facturas-cierre-modal/mostrar-facturas-cierre-modal.component';

@Component({
  selector: 'app-ver-cierres-mes',
  templateUrl: './ver-cierres-mes.component.html',
  styleUrls: ['./ver-cierres-mes.component.scss']
})
export class VerCierresMesComponent {
  cierresMensuales: any[] = []; // Todos los documentos de la colección 'cierre_mes'
  cierresMensualesPaginados: any[] = []; // Documentos mostrados en la página actual
  cierresFiltrados: any[] = []; // Documentos filtrados por búsqueda
  paginaActual: number = 0;
  cierresPorPagina: number = 7;
  fechaBusqueda: string = '';

  constructor(private firestore: AngularFirestore, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerCierresMensuales();
  }

  obtenerCierresMensuales(): void {
    this.firestore.collection('cierre_mes').snapshotChanges().subscribe(snapshot => {
      this.cierresMensuales = snapshot.map(doc => {
        const data = doc.payload.doc.data() as any;
        const id = doc.payload.doc.id;
        const fechaFormateada = this.formatearFecha(id);
        const totalDelMes = data.facturas.reduce((acc: number, factura: any) => acc + factura.total, 0);

        return {
          id,
          mes: fechaFormateada,
          cantidadFacturas: data.facturas.length,
          totalDelMes: totalDelMes,
          facturas: data.facturas
        };
      });

      this.cierresMensuales.sort((a, b) => b.id.localeCompare(a.id)); // Ordenar por fecha descendente
      this.cierresFiltrados = [...this.cierresMensuales]; // Inicializar con todos los datos
      this.actualizarCierresMensualesPaginados();
    });
  }

  buscarPorFecha(): void {
    if (this.fechaBusqueda) {
      const [anio, mes] = this.fechaBusqueda.split('-');
      const mesBusqueda = `${anio}-${mes.padStart(2, '0')}`;

      console.log('Buscando por:', mesBusqueda);

      // Filtrar cierresMensuales que coincidan con el mes y año de búsqueda
      this.cierresFiltrados = this.cierresMensuales.filter(cierre => cierre.id === mesBusqueda);

      console.log("Resultados Filtrados:", this.cierresFiltrados);
    } else {
      this.cierresFiltrados = [...this.cierresMensuales]; // Mostrar todos los cierres si no hay búsqueda
    }

    this.paginaActual = 0; // Resetear la página a la primera al buscar
    this.actualizarCierresMensualesPaginados();
  }

  formatearFecha(fecha: string): string {
    const partesFecha = fecha.split('-');
    const anio = partesFecha[0];
    const mes = partesFecha[1];
    return `${mes}/${anio}`; // Formatear como 'MM/YYYY'
  }

  actualizarCierresMensualesPaginados(): void {
    const inicio = this.paginaActual * this.cierresPorPagina;
    const fin = inicio + this.cierresPorPagina;
    this.cierresMensualesPaginados = this.cierresFiltrados.slice(inicio, fin);
  }

  paginaSiguiente(): void {
    if ((this.paginaActual + 1) * this.cierresPorPagina < this.cierresFiltrados.length) {
      this.paginaActual++;
      this.actualizarCierresMensualesPaginados();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarCierresMensualesPaginados();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.cierresFiltrados.length / this.cierresPorPagina);
  }

  abrirModalFacturas(cierre: any): void {
    this.dialog.open(MostrarFacturasCierreModalComponent, {
      width: '800px',
      data: { facturas: cierre.facturas }
    });
  }
}


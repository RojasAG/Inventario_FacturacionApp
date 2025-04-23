import { Component, OnInit, Renderer2 } from '@angular/core';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogBorrarFacturaComponent } from '../confirm-dialog-borrar-factura/confirm-dialog-borrar-factura.component';
import { filter, from, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-ver-facturas',
  templateUrl: './ver-facturas.component.html',
  styleUrls: ['./ver-facturas.component.scss']
})
export class VerFacturasComponent implements OnInit {
  facturas: any[] = [];
  facturasPaginadas: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(private firestoreService: FirestoreserviceService, private router: Router, private renderer: Renderer2,
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

// Función que realiza la paginación de siguiente
nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePaginatedFacturas();
  }
}

// Función que realiza la paginación de anterior
previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedFacturas();
  }
}


  //FUncion que permite realizar la busqueda de una factura por medio del nombre de usuario y el codigo de la factura
  buscarFactura(): void {
    const term = this.searchTerm.toLowerCase();
    this.firestoreService.obtenerFacturas().subscribe((data: any[]) => {
      this.facturas = data.filter(factura =>
        (factura.clienteNombre && factura.clienteNombre.toLowerCase().includes(term)) ||
        (factura.usuario && factura.usuario.nombre && factura.usuario.nombre.toLowerCase().includes(term)) ||
        (factura.id && factura.id.toString().toLowerCase().includes(term))
      );
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.facturas.length / this.itemsPerPage);
      this.updatePaginatedFacturas();
    });
  }

  /*
  //Funcion que realiza la eliminacion o anulacion de una factura, permite agregar motivo y ademas regresa los productos al inventario.
  eliminarFactura(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogBorrarFacturaComponent, {
      width: '300px',
      data: { id }
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.firestoreService.obtenerFacturaPorId(id).pipe(
          take(1),
          switchMap(factura => {
            if (factura) {
              console.log("Aquí estoy entrando a guardar: ", factura);
              return from(this.firestoreService.guardarFacturaBorrada({ ...factura, razon: reason })).pipe(
                switchMap(() => {
                  console.log("Guardando factura borrada: ", factura);
                  return from(this.firestoreService.borrarFactura(id)).pipe(
                    switchMap(() => this.firestoreService.devolverProductosAlInventario(factura.productos))
                  );
                })
              );
            } else {
              throw new Error('Factura no encontrada');
            }
          }),
          take(1)
        ).subscribe({
          next: () => {
            console.log('Factura eliminada y registrada en facturasborradas');
            this.facturas = this.facturas.filter(f => f.id !== id);
            this.updatePaginatedFacturas();
          },
          error: (err) => {
            console.error('Error al eliminar la factura: ', err);
          }
        });
      }
    });
  }
  */

   //Funcion que realiza la eliminacion o anulacion de una factura, permite agregar motivo y ademas regresa los productos al inventario.
eliminarFactura(id: string): void {
  const dialogRef = this.dialog.open(ConfirmDialogBorrarFacturaComponent, {
    width: '300px',
    data: { id }
  });

  dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
    if (result && result.confirmed) {
      const reintegrar = result.reintegrar;
      this.firestoreService.obtenerFacturaPorId(id).pipe(
        take(1),
        switchMap(factura => {
          if (factura) {
            return from(this.firestoreService.guardarFacturaBorrada({ ...factura, razon: result.reason })).pipe(
              switchMap(() => {
                return from(this.firestoreService.borrarFactura(id)).pipe(
                  switchMap(() => {
                    if (reintegrar) {
                      return this.firestoreService.devolverProductosAlInventario(factura.productos);
                    } else {
                      return from([]); // No hacer nada si no se reintegra
                    }
                  })
                );
              })
            );
          } else {
            throw new Error('Factura no encontrada');
          }
        }),
        take(1)
      ).subscribe({
        next: () => {
          console.log('Factura eliminada y registrada en facturasborradas');
          this.facturas = this.facturas.filter(f => f.id !== id);
          this.updatePaginatedFacturas();
        },
        error: (err) => {
          console.error('Error al eliminar la factura: ', err);
        }
      });
    }
  });
}


//Funcion que realiza un ruteo a menu principal
  regresar(): void {
    this.router.navigate(['/menu-principal/ver-productos']);
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

  verFactura(id: string){

  }

  
  }
  

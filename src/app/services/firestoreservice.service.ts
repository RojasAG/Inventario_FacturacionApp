import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Producto } from '../interfaces/producto.interface';
import { Observable, combineLatest, from, map, of, switchMap } from 'rxjs';
import { Productos } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreserviceService {

  private productosCollection = this.firestore.collection<Producto>('productos');

  constructor(private firestore: AngularFirestore) {}

  //Funcion que permite agregar productos
  agregarOActualizarProducto(producto: Producto): Promise<'actualizado' | 'agregado'> {
    return this.productosCollection.ref.where('codigo', '==', producto.codigo).get().then(querySnapshot => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const existingProduct = doc.data() as Producto;
        const updatedProduct: Producto = {
          ...existingProduct,
          cantidad: (existingProduct.cantidad ?? 0) + (producto.cantidad ?? 0),
          precio: producto.precio // Puedes decidir si actualizar el precio o no
        };
        return this.productosCollection.doc(doc.id).update(updatedProduct).then(() => 'actualizado');
      } else {
        const id = this.firestore.createId();
        return this.productosCollection.doc(id).set(producto).then(() => 'agregado');
      }
    });
  }


// Función que verifica si un producto con el mismo código ya existe
verificarProductoExistente(codigo: string): Promise<boolean> {
  return this.productosCollection.ref.where('codigo', '==', codigo).get().then(querySnapshot => {
    return !querySnapshot.empty;
  });
}

// Función que permite agregar productos solo si no existen
agregarProducto(producto: Producto): Promise<'agregado'> {
  const id = this.firestore.createId();
  return this.productosCollection.doc(id).set(producto).then(() => 'agregado');
}


  //Funcion que permite modificar completamente los datos de un producto en especifico
  actualizarProducto2(producto: Producto): Promise<void> {
    return this.productosCollection.ref.where('codigo', '==', producto.codigo).get().then(querySnapshot => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.productosCollection.doc(doc.id).update(producto);
      } else {
        throw new Error('Producto no encontrado');
      }
    });
  }

  //Funcion que permite modificar completamente los datos de un producto en especifico
actualizarProducto(producto: Producto, codigoOriginal: string): Promise<void> {
  return this.productosCollection.ref.where('codigo', '==', codigoOriginal).get().then(querySnapshot => {
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return this.productosCollection.doc(doc.id).update(producto);
    } else {
      throw new Error('Producto no encontrado');
    }
  });
}

  //Funcion que permite obtener todos los productos existentes
  obtenerProductos(): Observable<Producto[]> {
    return this.productosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Producto;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

//Funcion que borra un producto por id
  borrarProducto(producto: Producto) {
    return this.productosCollection.doc(producto.id).delete();
  }
  
    // Función para buscar productos por código o nombre
    buscarProducto(termino: string): Observable<Producto[]> {
      const byCodigo$ = this.firestore.collection<Producto>('productos', ref => 
        ref.where('codigo', '==', termino)
      ).valueChanges();
  
      const byDescripcion$ = this.firestore.collection<Producto>('productos', ref => 
        ref.where('descripcion', '==', termino)
      ).valueChanges();
  
      return combineLatest([byCodigo$, byDescripcion$]).pipe(
        map(([byCodigo, byDescripcion]) => [...byCodigo, ...byDescripcion])
      );
    }

    //FUncion que permite almacenar facturas
    guardarFactura(factura: any) {
      return this.firestore.collection('facturas').add(factura).then(() => {
        // Actualizar el cierre de caja después de guardar la factura
        //return this.actualizarCierreDeCaja(factura);
      });
    }

  // Método para obtener todas las facturas
  obtenerFacturas(): Observable<any[]> {
    return this.firestore.collection('facturas').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }),
      map(facturas => facturas.sort((a, b) => b.fecha.toDate().getTime() - a.fecha.toDate().getTime()))
    );
  }

  // Método para guardar cierres de caja
  guardarCierreDeCaja(cierre: any) {
    return this.firestore.collection('cierres_de_caja').add(cierre);
  }

//funcion que ibtiene los cierres de caja por fecha
obtenerCierreDeCajaPorFecha(fecha: string): Observable<any[]> {
  return this.firestore.collection('cierres_de_caja', ref => ref.where('fechaFactura', '==', fecha)).snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
}


realizarCierreDeCaja(): Observable<void> {
  return this.obtenerFacturas().pipe(
    switchMap(facturas => {
      const cierresMap: { [key: string]: any } = {};

      facturas.forEach(factura => {
        if (factura.fecha && factura.fecha.toDate) {
          const fechaUTC = factura.fecha.toDate();
          const fechaLocal = new Date(fechaUTC.getTime() - (6 * 60 * 60 * 1000));
          const fecha = fechaLocal.toISOString().split('T')[0];

          if (!cierresMap[fecha]) {
            cierresMap[fecha] = {
              fechaFactura: fecha,
              montosTotales: 0,
              facturaIds: []
            };
          }
          cierresMap[fecha].montosTotales += factura.total;
          cierresMap[fecha].facturaIds.push(factura.id);
        } else {
          console.warn(`La factura con ID ${factura.id} no tiene una fecha válida.`);
        }
      });

      const cierres = Object.values(cierresMap);
      const guardarObservables = cierres.map((cierre: any) => {
        return this.obtenerCierreDeCajaPorFecha(cierre.fechaFactura).pipe(
          switchMap((existente: any[]) => {
            if (existente.length === 0) {
              return from(this.guardarCierreDeCaja(cierre));
            } else {
              const docId = existente[0].id;
              const cierreExistente = existente[0];

              const nuevasFacturas = cierre.facturaIds.filter((id: string) => !cierreExistente.facturaIds.includes(id));

              if (nuevasFacturas.length > 0) {
                const cierreActualizado = {
                  ...cierreExistente,
                  montosTotales: cierreExistente.montosTotales + cierre.montosTotales,
                  facturaIds: [...cierreExistente.facturaIds, ...nuevasFacturas]
                };
                return from(this.firestore.collection('cierres_de_caja').doc(docId).update(cierreActualizado));
              } else {
                return from(Promise.resolve());
              }
            }
          })
        );
      });

      return combineLatest(guardarObservables).pipe(map(() => {}));
    })
  );
}

//Funcion que obtiene los cierres de cajas existentes por dia
obtenerCierresDeCaja(): Observable<any[]> {
  return this.firestore.collection('cierres_de_caja').snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }),
    map(cierres => cierres.sort((a, b) => new Date(b.fechaFactura).getTime() - new Date(a.fechaFactura).getTime())) // Ordenar por fecha
  );
}

//Funcion que borra todos los cierres de caja, con el fin de que estos se actualicen
  borrarTodosLosCierresDeCaja(): Promise<void> {
    return this.firestore.collection('cierres_de_caja').get().toPromise().then(querySnapshot => {
      const batch = this.firestore.firestore.batch();
      querySnapshot!.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
  }

  // Funcion que obtiene las facturas deseadas por medio del uid indicado
  obtenerFacturasPorIds(ids: string[]): Observable<any[]> {
    if (ids.length === 0) {
      return of([]);
    }
  
    const facturas$ = ids.map(id => 
      this.firestore.collection('facturas').doc(id).snapshotChanges().pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          if (data && typeof data === 'object') {
            return { id, ...data };
          } else {
            return { id }; // Manejo de casos en los que data no es un objeto
          }
        })
      )
    );
  
    return combineLatest(facturas$);
  }


  obtenerFacturas2(): Observable<any[]> {
    return this.firestore.collection('facturas').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  obtenerFacturaPorId(id: string): Observable<any> {
    return this.firestore.collection('facturas').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as any;
        const docId = action.payload.id;
        return { id: docId, ...data };
      })
    );
  }

  guardarFacturaBorrada(factura: any): Promise<DocumentReference<unknown>> {
    console.log("Este es el service de FACTURA: ",factura);
    return this.firestore.collection('facturasborradas').add(factura);
  }
  

  borrarFactura(id: string): Promise<void> {
    return this.firestore.collection('facturas').doc(id).delete();
  }

  obtenerFacturasBorradas(): Observable<any[]> {
    return this.firestore.collection('facturasborradas').valueChanges();
  }

  devolverProductosAlInventario(productos: Producto[]): Promise<void> {
    const batch = this.firestore.firestore.batch();
  
    const promises = productos.map(producto => {
      const productoQuery = this.productosCollection.ref.where('codigo', '==', producto.codigo);
      return productoQuery.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const existingProduct = doc.data() as Producto;
          const updatedProduct: Producto = {
            ...existingProduct,
            cantidad: (existingProduct.cantidad ?? 0) + (producto.cantidad ?? 0)
          };
          batch.update(doc.ref, updatedProduct);
        } else {
          // Si el producto no existe, lo agregamos con la información proporcionada
          const newProduct: Productos = {
            codigo: producto.codigo,
            cantidad: producto.cantidad,
            descripcion: producto.descripcion,
            precio: producto.precio,
            // otros campos necesarios...
          };
          const newDocRef = this.productosCollection.doc().ref; // Genera un nuevo ID para el documento
          batch.set(newDocRef, newProduct);
        }
      }).catch(error => {
        console.error('Error al procesar el producto:', error);
      });
    });
  
    return Promise.all(promises).then(() => batch.commit()).catch(error => {
      console.error('Error al devolver productos al inventario:', error);
    });
  }

  //Funcion que realiza la actualizacion de la info de facturas extra
  actualizarInfoFact(id: string, info: any): Promise<void> {
    return this.firestore.collection('informacion_factura').doc(id).update(info);
  }

  //Funcion que obtiene la informacion de las facturas extra
  obtenerInfoFact(): Observable<any[]> {
    return this.firestore.collection('informacion_factura').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

}

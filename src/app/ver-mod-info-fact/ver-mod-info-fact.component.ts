import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirestoreserviceService } from '../services/firestoreservice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar

@Component({
  selector: 'app-ver-mod-info-fact',
  templateUrl: './ver-mod-info-fact.component.html',
  styleUrls: ['./ver-mod-info-fact.component.scss']
})
export class VerModInfoFactComponent implements OnInit {
  informacionFactura: any[] = [];
  facturaForm: FormGroup;

  constructor(
    private facturaService: FirestoreserviceService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar // Inyectamos MatSnackBar
  ) { 
    this.facturaForm = this.fb.group({
      detalle_cambio: [''],
      email: [''],
      nombre: [''],
      telefono_local: [''],
      ubicacion: ['']
    });
  }

  ngOnInit(): void {
    this.facturaService.obtenerInfoFact().subscribe(data => {
      this.informacionFactura = data;
      if (data.length > 0) {
        this.facturaForm.patchValue(data[0]); // Asumiendo que sólo hay un documento
      }
    });
  }

  onSubmit(): void {
    if (this.facturaForm.valid) {
      const updatedInfo = this.facturaForm.value;
      const docId = this.informacionFactura[0].id;

      this.facturaService.actualizarInfoFact(docId, updatedInfo).then(() => {
        this.snackBar.open('Información actualizada', 'Cerrar', { // Mostrar mensaje de confirmación
          duration: 3000, // Duración del mensaje en milisegundos
        });
      }).catch(error => {
        console.error('Error al actualizar la información:', error);
      });
    }
  }

}

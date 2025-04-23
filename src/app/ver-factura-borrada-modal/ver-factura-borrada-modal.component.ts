import { Component, Inject } from '@angular/core';
import { VerFacturaModalComponent } from '../ver-factura-modal/ver-factura-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-factura-borrada-modal',
  templateUrl: './ver-factura-borrada-modal.component.html',
  styleUrl: './ver-factura-borrada-modal.component.scss'
})
export class VerFacturaBorradaModalComponent {
  constructor(
    public dialogRef: MatDialogRef<VerFacturaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public factura: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

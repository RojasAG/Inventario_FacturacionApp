// confirm-dialog-borrar-factura.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-borrar-factura',
  templateUrl: './confirm-dialog-borrar-factura.component.html',
  styleUrls: ['./confirm-dialog-borrar-factura.component.scss']
})
export class ConfirmDialogBorrarFacturaComponent {
  reason: string = '';
  reintegrarProductos: boolean = true; // Por defecto está activado

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogBorrarFacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close({ confirmed: true, reason: this.reason, reintegrar: this.reintegrarProductos });
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false });
  }
}

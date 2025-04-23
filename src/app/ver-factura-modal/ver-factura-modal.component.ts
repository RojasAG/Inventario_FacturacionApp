import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-factura-modal',
  templateUrl: './ver-factura-modal.component.html',
  styleUrls: ['./ver-factura-modal.component.scss']
})
export class VerFacturaModalComponent {
  constructor(
    public dialogRef: MatDialogRef<VerFacturaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public factura: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mostrar-facturas-cierre-modal',
  templateUrl: './mostrar-facturas-cierre-modal.component.html',
  styleUrls: ['./mostrar-facturas-cierre-modal.component.scss']
})
export class MostrarFacturasCierreModalComponent {
  displayedColumns: string[] = ['clienteNombre', 'fecha', 'total', 'usuario'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { facturas: any[] },
    public dialogRef: MatDialogRef<MostrarFacturasCierreModalComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  
}

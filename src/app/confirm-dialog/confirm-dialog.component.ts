import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { descripcion: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Close and return true on confirm
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close and return false on cancel
  }
}

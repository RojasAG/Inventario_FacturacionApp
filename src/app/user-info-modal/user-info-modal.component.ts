// src/app/user-info-modal/user-info-modal.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent {
  @Input() user: any;

  closeModal() {
    document.getElementById('user-info-modal')!.style.display = 'none';
  }
}

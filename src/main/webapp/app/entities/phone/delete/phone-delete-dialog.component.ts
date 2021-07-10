import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhone } from '../phone.model';
import { PhoneService } from '../service/phone.service';

@Component({
  templateUrl: './phone-delete-dialog.component.html',
})
export class PhoneDeleteDialogComponent {
  phone?: IPhone;

  constructor(protected phoneService: PhoneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.phoneService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhone } from '../phone.model';
import { PhoneService } from '../service/phone.service';
import { PhoneDeleteDialogComponent } from '../delete/phone-delete-dialog.component';

@Component({
  selector: 'jhi-phone',
  templateUrl: './phone.component.html',
})
export class PhoneComponent implements OnInit {
  phones?: IPhone[];
  isLoading = false;

  constructor(protected phoneService: PhoneService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.phoneService.query().subscribe(
      (res: HttpResponse<IPhone[]>) => {
        this.isLoading = false;
        this.phones = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPhone): number {
    return item.id!;
  }

  delete(phone: IPhone): void {
    const modalRef = this.modalService.open(PhoneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.phone = phone;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPhone, Phone } from '../phone.model';
import { PhoneService } from '../service/phone.service';

@Component({
  selector: 'jhi-phone-update',
  templateUrl: './phone-update.component.html',
})
export class PhoneUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    number: [null, [Validators.required]],
    phoneType: [null, [Validators.required]],
  });

  constructor(protected phoneService: PhoneService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phone }) => {
      this.updateForm(phone);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const phone = this.createFromForm();
    if (phone.id !== undefined) {
      this.subscribeToSaveResponse(this.phoneService.update(phone));
    } else {
      this.subscribeToSaveResponse(this.phoneService.create(phone));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhone>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(phone: IPhone): void {
    this.editForm.patchValue({
      id: phone.id,
      number: phone.number,
      phoneType: phone.phoneType,
    });
  }

  protected createFromForm(): IPhone {
    return {
      ...new Phone(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      phoneType: this.editForm.get(['phoneType'])!.value,
    };
  }
}

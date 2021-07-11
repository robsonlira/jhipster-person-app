import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPerson, Person } from '../person.model';
import { PersonService } from '../service/person.service';
import { IPhone } from 'app/entities/phone/phone.model';
import { PhoneService } from 'app/entities/phone/service/phone.service';

@Component({
  selector: 'jhi-person-update',
  templateUrl: './person-update.component.html',
})
export class PersonUpdateComponent implements OnInit {
  isSaving = false;

  phonesSharedCollection: IPhone[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    birthDate: [null, [Validators.required]],
    phone: [],
  });

  constructor(
    protected personService: PersonService,
    protected phoneService: PhoneService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ person }) => {
      if (person.id === undefined) {
        const today = dayjs().startOf('day');
        person.birthDate = today;
      }

      this.updateForm(person);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const person = this.createFromForm();
    if (person.id !== undefined) {
      this.subscribeToSaveResponse(this.personService.update(person));
    } else {
      this.subscribeToSaveResponse(this.personService.create(person));
    }
  }

  trackPhoneById(index: number, item: IPhone): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerson>>): void {
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

  protected updateForm(person: IPerson): void {
    this.editForm.patchValue({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      cpf: person.cpf,
      birthDate: person.birthDate ? person.birthDate.format(DATE_TIME_FORMAT) : null,
      phone: person.phone,
    });

    this.phonesSharedCollection = this.phoneService.addPhoneToCollectionIfMissing(this.phonesSharedCollection, person.phone);
  }

  protected loadRelationshipsOptions(): void {
    this.phoneService
      .query()
      .pipe(map((res: HttpResponse<IPhone[]>) => res.body ?? []))
      .pipe(map((phones: IPhone[]) => this.phoneService.addPhoneToCollectionIfMissing(phones, this.editForm.get('phone')!.value)))
      .subscribe((phones: IPhone[]) => (this.phonesSharedCollection = phones));
  }

  protected createFromForm(): IPerson {
    return {
      ...new Person(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      cpf: this.editForm.get(['cpf'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value ? dayjs(this.editForm.get(['birthDate'])!.value, DATE_TIME_FORMAT) : undefined,
      phone: this.editForm.get(['phone'])!.value,
    };
  }
}

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PhoneService } from '../service/phone.service';
import { IPhone, Phone } from '../phone.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';

import { PhoneUpdateComponent } from './phone-update.component';

describe('Component Tests', () => {
  describe('Phone Management Update Component', () => {
    let comp: PhoneUpdateComponent;
    let fixture: ComponentFixture<PhoneUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let phoneService: PhoneService;
    let personService: PersonService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PhoneUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PhoneUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PhoneUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      phoneService = TestBed.inject(PhoneService);
      personService = TestBed.inject(PersonService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Person query and add missing value', () => {
        const phone: IPhone = { id: 456 };
        const person: IPerson = { id: 31069 };
        phone.person = person;

        const personCollection: IPerson[] = [{ id: 44679 }];
        jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
        const additionalPeople = [person];
        const expectedCollection: IPerson[] = [...additionalPeople, ...personCollection];
        jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ phone });
        comp.ngOnInit();

        expect(personService.query).toHaveBeenCalled();
        expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, ...additionalPeople);
        expect(comp.peopleSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const phone: IPhone = { id: 456 };
        const person: IPerson = { id: 22542 };
        phone.person = person;

        activatedRoute.data = of({ phone });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(phone));
        expect(comp.peopleSharedCollection).toContain(person);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Phone>>();
        const phone = { id: 123 };
        jest.spyOn(phoneService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ phone });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: phone }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(phoneService.update).toHaveBeenCalledWith(phone);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Phone>>();
        const phone = new Phone();
        jest.spyOn(phoneService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ phone });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: phone }));
        saveSubject.complete();

        // THEN
        expect(phoneService.create).toHaveBeenCalledWith(phone);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Phone>>();
        const phone = { id: 123 };
        jest.spyOn(phoneService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ phone });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(phoneService.update).toHaveBeenCalledWith(phone);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPersonById', () => {
        it('Should return tracked Person primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPersonById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

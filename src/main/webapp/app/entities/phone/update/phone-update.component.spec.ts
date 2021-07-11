jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PhoneService } from '../service/phone.service';
import { IPhone, Phone } from '../phone.model';

import { PhoneUpdateComponent } from './phone-update.component';

describe('Component Tests', () => {
  describe('Phone Management Update Component', () => {
    let comp: PhoneUpdateComponent;
    let fixture: ComponentFixture<PhoneUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let phoneService: PhoneService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const phone: IPhone = { id: 456 };

        activatedRoute.data = of({ phone });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(phone));
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
  });
});

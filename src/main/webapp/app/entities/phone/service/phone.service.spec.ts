import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PhoneType } from 'app/entities/enumerations/phone-type.model';
import { IPhone, Phone } from '../phone.model';

import { PhoneService } from './phone.service';

describe('Service Tests', () => {
  describe('Phone Service', () => {
    let service: PhoneService;
    let httpMock: HttpTestingController;
    let elemDefault: IPhone;
    let expectedResult: IPhone | IPhone[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PhoneService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        number: 'AAAAAAA',
        phoneType: PhoneType.HOME,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Phone', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Phone()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Phone', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            number: 'BBBBBB',
            phoneType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Phone', () => {
        const patchObject = Object.assign(
          {
            number: 'BBBBBB',
          },
          new Phone()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Phone', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            number: 'BBBBBB',
            phoneType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Phone', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPhoneToCollectionIfMissing', () => {
        it('should add a Phone to an empty array', () => {
          const phone: IPhone = { id: 123 };
          expectedResult = service.addPhoneToCollectionIfMissing([], phone);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(phone);
        });

        it('should not add a Phone to an array that contains it', () => {
          const phone: IPhone = { id: 123 };
          const phoneCollection: IPhone[] = [
            {
              ...phone,
            },
            { id: 456 },
          ];
          expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, phone);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Phone to an array that doesn't contain it", () => {
          const phone: IPhone = { id: 123 };
          const phoneCollection: IPhone[] = [{ id: 456 }];
          expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, phone);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(phone);
        });

        it('should add only unique Phone to an array', () => {
          const phoneArray: IPhone[] = [{ id: 123 }, { id: 456 }, { id: 24861 }];
          const phoneCollection: IPhone[] = [{ id: 123 }];
          expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, ...phoneArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const phone: IPhone = { id: 123 };
          const phone2: IPhone = { id: 456 };
          expectedResult = service.addPhoneToCollectionIfMissing([], phone, phone2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(phone);
          expect(expectedResult).toContain(phone2);
        });

        it('should accept null and undefined values', () => {
          const phone: IPhone = { id: 123 };
          expectedResult = service.addPhoneToCollectionIfMissing([], null, phone, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(phone);
        });

        it('should return initial array if no Phone is added', () => {
          const phoneCollection: IPhone[] = [{ id: 123 }];
          expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, undefined, null);
          expect(expectedResult).toEqual(phoneCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

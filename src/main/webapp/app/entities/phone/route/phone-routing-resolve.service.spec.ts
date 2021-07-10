jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPhone, Phone } from '../phone.model';
import { PhoneService } from '../service/phone.service';

import { PhoneRoutingResolveService } from './phone-routing-resolve.service';

describe('Service Tests', () => {
  describe('Phone routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PhoneRoutingResolveService;
    let service: PhoneService;
    let resultPhone: IPhone | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PhoneRoutingResolveService);
      service = TestBed.inject(PhoneService);
      resultPhone = undefined;
    });

    describe('resolve', () => {
      it('should return IPhone returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPhone = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPhone).toEqual({ id: 123 });
      });

      it('should return new IPhone if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPhone = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPhone).toEqual(new Phone());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Phone })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPhone = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPhone).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

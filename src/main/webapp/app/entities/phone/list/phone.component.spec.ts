import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PhoneService } from '../service/phone.service';

import { PhoneComponent } from './phone.component';

describe('Component Tests', () => {
  describe('Phone Management Component', () => {
    let comp: PhoneComponent;
    let fixture: ComponentFixture<PhoneComponent>;
    let service: PhoneService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PhoneComponent],
      })
        .overrideTemplate(PhoneComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PhoneComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PhoneService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.phones?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

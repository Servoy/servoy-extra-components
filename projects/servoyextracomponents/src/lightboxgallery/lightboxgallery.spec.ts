import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServoyExtraLightboxGallery } from './lightboxgallery';

describe('FileUploadComponent', () => {
  let component: ServoyExtraLightboxGallery;
  let fixture: ComponentFixture<ServoyExtraLightboxGallery>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraLightboxGallery ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraLightboxGallery);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

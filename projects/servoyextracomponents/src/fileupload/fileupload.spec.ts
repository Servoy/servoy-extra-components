import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServoyExtraFileUpload } from './fileupload';

describe('FileUploadComponent', () => {
  let component: ServoyExtraFileUpload;
  let fixture: ComponentFixture<ServoyExtraFileUpload>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraFileUpload ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraFileUpload);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

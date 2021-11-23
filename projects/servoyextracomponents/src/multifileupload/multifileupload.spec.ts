import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServoyPublicModule } from '@servoy/public';
import { ServoyExtraMultiFileUpload } from './multifileupload';


describe('ServoyExtraMultiFileUpload', () => {
  let component: ServoyExtraMultiFileUpload;
  let fixture: ComponentFixture<ServoyExtraMultiFileUpload>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraMultiFileUpload ],
      imports: [ServoyPublicModule],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraMultiFileUpload);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent', 'getFormName']);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

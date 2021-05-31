import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabloModule } from '../../sablo/sablo.module';
import { ServoyPublicModule } from '@servoy/public';
import { ServoyExtraMultiFileUpload } from './multifileupload';
import { FormService } from '../../ngclient/form.service';
import { ServoyService } from '../../ngclient/servoy.service';
import { ViewportService } from '../../ngclient/services/viewport.service';
import { LocaleService } from '../../ngclient/locale.service';

describe('ServoyExtraMultiFileUpload', () => {
  let component: ServoyExtraMultiFileUpload;
  let fixture: ComponentFixture<ServoyExtraMultiFileUpload>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraMultiFileUpload ],
      imports: [SabloModule, ServoyPublicModule],
      providers: [ViewportService, FormService, ServoyService, { provide: LocaleService, useValue: {getLocale: () => 'en' }}]
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

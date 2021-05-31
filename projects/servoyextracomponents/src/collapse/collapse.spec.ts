import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServoyExtraCollapse } from './collapse';
import { FormService } from './../../ngclient/form.service';
import { ServoyService } from '../../ngclient/servoy.service';
import { LocaleService } from '../../ngclient/locale.service';
import { I18NProvider } from '../../ngclient/services/i18n_provider.service';
import { ClientFunctionService } from '../../ngclient/services/clientfunction.service';
import { ViewportService } from '../../ngclient/services/viewport.service';
import { ServoyTestingModule } from '../../testing/servoytesting.module';
import { ServoyPublicModule } from '@servoy/public';

describe('ServoyExtraCollapse', () => {
  let component: ServoyExtraCollapse;
  let fixture: ComponentFixture<ServoyExtraCollapse>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraCollapse ],
       imports: [ServoyTestingModule, ServoyPublicModule],
      providers: [FormService, ServoyService, LocaleService, I18NProvider, ClientFunctionService, ViewportService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraCollapse);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
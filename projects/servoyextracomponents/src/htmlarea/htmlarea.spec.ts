import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServoyExtraHtmlarea  } from './htmlarea';
import { FormattingService, ServoyApi, TooltipService } from '@servoy/public';
import { ServoyTestingModule } from '../../testing/servoytesting.module';
import { LocaleService } from '../../ngclient/locale.service';
import { I18NProvider } from '../../ngclient/services/i18n_provider.service';
import { FormsModule } from '@angular/forms';
import { ServoyPublicModule } from '@servoy/public';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationService } from '../../ngclient/services/application.service';
import { ServoyService } from '../../ngclient/servoy.service';
import { ClientFunctionService } from '../../ngclient/services/clientfunction.service';
import { ViewportService } from '../../ngclient/services/viewport.service';
import { ServerDataService } from '../../ngclient//services/serverdata.service';
import { FormService } from '../../ngclient/form.service';
import { EditorModule } from '@tinymce/tinymce-angular';

describe('HtmlareaComponent', () => {
  let component: ServoyExtraHtmlarea;
  let fixture: ComponentFixture<ServoyExtraHtmlarea>;

  const servoyApi: jasmine.SpyObj<ServoyApi> = jasmine.createSpyObj<ServoyApi>('ServoyApi', ['getMarkupId', 'isInDesigner','registerComponent','unRegisterComponent', 'getClientProperty']);

    beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
    declarations: [ServoyExtraHtmlarea],
    imports: [EditorModule, ServoyTestingModule, FormsModule, ServoyPublicModule],
    providers: [{ provide: LocaleService, useValue: { getLocale: () => 'en' } }, ServoyService, ClientFunctionService,
        ViewportService, I18NProvider, FormService, { provide: ServerDataService, useValue: { init: () => { } } }, ApplicationService, provideHttpClient(withInterceptorsFromDi())]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraHtmlarea);

    fixture.componentInstance.servoyApi = servoyApi;
    component = fixture.componentInstance;
    component.dataProviderID = 'WhatArea';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

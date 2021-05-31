import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServoyExtraSplitpane } from './splitpane';
import { ServoyPublicModule } from '@servoy/public';
import { BGSplitter } from './bg_splitter/bg_splitter.component';
import { BGPane } from './bg_splitter/bg_pane.component';
import { SabloModule } from '../../sablo/sablo.module';
import { FormattingService,  TooltipService } from '@servoy/public';
import { LocaleService } from '../../ngclient/locale.service';
import { I18NProvider } from '../../ngclient/services/i18n_provider.service';


describe('ServoyExtraSplitpane', () => {
  let component: ServoyExtraSplitpane;
  let fixture: ComponentFixture<ServoyExtraSplitpane>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraSplitpane, BGPane, BGSplitter ],
      imports: [SabloModule, ServoyPublicModule],
      providers: [I18NProvider, FormattingService, TooltipService, LocaleService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraSplitpane);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

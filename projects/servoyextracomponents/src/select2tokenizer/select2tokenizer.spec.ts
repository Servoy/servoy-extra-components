import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Select2Module } from 'ng-select2-component';
import { ServoyExtraSelect2Tokenizer } from './select2tokenizer';
import { ServoyPublicModule } from '@servoy/public';

describe('ServoyExtraSelect2Tokenizer', () => {
  let component: ServoyExtraSelect2Tokenizer;
  let fixture: ComponentFixture<ServoyExtraSelect2Tokenizer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraSelect2Tokenizer ],
	  imports: [ServoyPublicModule, Select2Module]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraSelect2Tokenizer);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

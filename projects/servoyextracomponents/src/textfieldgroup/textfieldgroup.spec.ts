import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServoyExtraTextfieldGroup  } from './textfieldgroup';
import { FormattingService, ServoyApi, TooltipService } from '@servoy/public';
import { FormsModule } from '@angular/forms';
import { ServoyPublicTestingModule } from '@servoy/public';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TextfieldgroupComponent', () => {
  let component: ServoyExtraTextfieldGroup;
  let fixture: ComponentFixture<ServoyExtraTextfieldGroup>;

  const servoyApi: jasmine.SpyObj<ServoyApi> = jasmine.createSpyObj<ServoyApi>('ServoyApi', ['getMarkupId', 'isInDesigner','registerComponent','unRegisterComponent']);

    beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
    declarations: [ServoyExtraTextfieldGroup],
    imports: [FormsModule, ServoyPublicTestingModule],
    providers: [FormattingService, TooltipService, provideHttpClient(withInterceptorsFromDi())]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraTextfieldGroup);

    fixture.componentInstance.servoyApi = servoyApi;
    component = fixture.componentInstance;
    component.dataProviderID = 'WhatArea';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

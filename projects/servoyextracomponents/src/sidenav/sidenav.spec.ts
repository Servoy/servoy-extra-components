import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServoyExtraSidenav } from './sidenav';

describe('ServoyExtraSidenav', () => {
  let component: ServoyExtraSidenav;
  let fixture: ComponentFixture<ServoyExtraSidenav>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraSidenav ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraSidenav);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

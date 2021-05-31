import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ServoyExtraSpinner } from './spinner';
import { SabloModule } from '../../sablo/sablo.module';
import { ServoyPublicTestingModule, IValuelist } from '@servoy/public';
import { FormattingService, ServoyApi, TooltipService } from '@servoy/public';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';


const mockData = [
  {
    realValue: 3,
    displayValue: 'Bucharest'
  },
  {
    realValue: 1,
    displayValue: 'Timisoara'
  },
  {
    realValue: 2,
    displayValue: 'Amsterdam'
  },
] as IValuelist;

describe('ServoyExtraCheckGroup', () => {
  let component: ServoyExtraSpinner;
  let fixture: ComponentFixture<ServoyExtraSpinner>;
  let buttonUp: any; let buttonDown: any;
  let servoyApi;

  beforeEach(waitForAsync(() => {
    servoyApi = jasmine.createSpyObj('ServoyApi', ['getMarkupId','registerComponent','unRegisterComponent']);

    TestBed.configureTestingModule({
      declarations: [ServoyExtraSpinner],
      imports: [SabloModule, FormsModule, ServoyPublicTestingModule],
      providers: [FormattingService, TooltipService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraSpinner);
    fixture.componentInstance.servoyApi = servoyApi as ServoyApi;

    buttonUp = fixture.debugElement.queryAll(By.css('button'))[0];
    buttonDown = fixture.debugElement.queryAll(By.css('button'))[1];

    component = fixture.componentInstance;
    component.valuelistID = mockData;
    component.enabled = true;
    component.editable = true;
    component.dataProviderID = 1;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  xit('should click change value', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
  });



  it('should got undefined dp if dp is not present in valuelist', () => {
    component.dataProviderID = 'Salut';
    const selection = component.getSelectionFromDataprovider();
    fixture.detectChanges();
    expect(selection).toBeFalsy();
  });

  it('should selection to match displayValue of dp 1', () => {
    const selection = component.getSelectionFromDataprovider();
    expect(selection).toBe('Timisoara');
  });

  it('should change dp when click the up button', fakeAsync( () => {
    buttonDown.nativeElement.click();
    fixture.detectChanges();
    tick();
    const selection = component.getSelectionFromDataprovider();
    expect(selection).toBe('Bucharest');
  }));

  it('should getSelectionFromDP', fakeAsync(() => {
    buttonUp.nativeElement.click();
    fixture.detectChanges();
    tick();
    const selection = component.getSelectionFromDataprovider();
    expect(selection).toBe('Amsterdam');
  }));

  xit('should change dp when press the down button', fakeAsync( () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.focus();
    input.triggerEventHandler('keyup', { key: 'ArrowDown' });
    fixture.detectChanges();
    tick();
    const selection = component.getSelectionFromDataprovider();
    expect(selection).toBe('Bucharest');
  }));

  xit('should change dp when press the up button', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.focus();
    input.triggerEventHandler('keyup', { key: 'ArrowUp' });
    fixture.detectChanges();
    tick();
    const selection = component.getSelectionFromDataprovider();
    expect(selection).toBe('Amsterdam');
  }));

  xit('should change dp when scroll  ', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.scroll();
    fixture.detectChanges();
    tick();
    const selection = component.getSelectionFromDataprovider();
    expect(selection).toBe('Amsterdam');
  }));


});

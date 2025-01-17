import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, Input, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Format, FormattingService, IFoundset, LoggerFactory, ServoyApi, ServoyPublicModule } from '@servoy/public';
import { SpecTypesService, ViewPortRow, WindowRefService } from '@servoy/public';
import { ServoyExtraTable, TableRow } from './table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule } from 'angular-resizable-element';


@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'test-wrapper',
    template: '<div style="position: absolute; left: 29px; top: 139px; width: 571px; height: 300px;">\
                    <servoyextra-table #table [servoyApi]="servoyApi" [foundset]="foundset" [columns]="columns" [minRowHeight]="minRowHeight"\
                         [enableColumnResize]="enableColumnResize" [pageSize]="pageSize" [responsiveHeight]="responsiveHeight"\
                         [onCellClick]="cellClick" [onCellRightClick]="cellRightClick" [onCellDoubleClick]="cellDoubleClick"\
                         [onHeaderClick]="headerClick" [onHeaderRightClick]="headerRightClick" [onFocusGainedMethodID]="focusGained" [onFocusLostMethodID]="focusLost" >\
                    </servoyextra-table > </div>',
    standalone: false
})
class TestWrapperComponent {
    @ViewChild('table', { static: false }) table: ServoyExtraTable;
    @Input() servoyApi: ServoyApi;
    @Input() columns;
    @Input() foundset: Foundset;
    @Input() minRowHeight: string;
    @Input() enableColumnResize: boolean;
    @Input() pageSize: number;
    @Input() responsiveHeight;
    @Input() cellClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() cellRightClick;
    @Input() cellDoubleClick;
    @Input() headerClick;
    @Input() headerRightClick;
    @Input() focusGained;
    @Input() focusLost;
}

describe('ServoyExtraTable', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  let converterService: ConverterService;
  let loggerFactory: LoggerFactory;
  let sabloService: SabloService;
  let sabloDeferHelper: SabloDeferHelper;
  let formattingService: FormattingService;
  let componentModelGetter: PropertyContext;

  const servoyApi: jasmine.SpyObj<ServoyApi> = jasmine.createSpyObj<ServoyApi>('ServoyApi', ['getMarkupId', 'isInDesigner', 'registerComponent', 'unRegisterComponent', 'isInAbsoluteLayout', 'trustAsHtml']);
  const onCellClick = jasmine.createSpy('onCellClick');
  const onCellRightClick = jasmine.createSpy('onCellRightClick');
  const onCellDoubleClick = jasmine.createSpy('onCellDoubleClick');
  const onHeaderClick = jasmine.createSpy('onHeaderClick').and.returnValue(Promise.resolve('asc'));
  const onHeaderRightClick = jasmine.createSpy('onHeaderRightClick').and.returnValue(Promise.resolve(''));
  const onFocusGained = jasmine.createSpy('onFocusGained');
  const onFocusLost = jasmine.createSpy('onFocusLost');
  const sort = jasmine.createSpy('sort').and.returnValue(Promise.resolve(true));
  const loadExtraRecordsAsync = jasmine.createSpy('loadExtraRecordsAsync').and.returnValue(Promise.resolve(true));

 const getFoundset  = (): IFoundset => {
    const fs_json = {
      serverSize: 200,
      foundsetId: 1,
      sortColumns: 'ID_columnID asc',
      selectedRowIndexes: [
        1
      ],
      multiSelect: false,
      hasMoreRows: true,
      viewPort: {
        startIndex: 0,
        size: 20,
        rows: [
          { _svyRowId: '5.10248;_0' },
          { _svyRowId: '5.10249;_1' },
          { _svyRowId: '5.10250;_2' },
          { _svyRowId: '5.10251;_3' },
          { _svyRowId: '5.10252;_4' },
          { _svyRowId: '5.10253;_5' },
          { _svyRowId: '5.10254;_6' },
          { _svyRowId: '5.10255;_7' },
          { _svyRowId: '5.10256;_8' },
          { _svyRowId: '5.10257;_9' },
          { _svyRowId: '5.10258;_10' },
          { _svyRowId: '5.10259;_11' },
          { _svyRowId: '5.10260;_12' },
          { _svyRowId: '5.10261;_13' },
          { _svyRowId: '5.10262;_14' },
          { _svyRowId: '5.10263;_15' },
          { _svyRowId: '5.10264;_16' },
          { _svyRowId: '5.10265;_17' },
          { _svyRowId: '5.10266;_18' },
          { _svyRowId: '5.10267;_19' },
          { _svyRowId: '5.10268;_20' }
        ]
      }
    };

    const fs = converterService.convertFromServerToClient(fs_json, 'foundset');
    componentModelGetter = (prop) => ({
      myfoundset: fs
    }[prop]);

    const fsl_json = {
      forFoundset: '08d25c66d8b38adb872a5ffec31ca906', vp: [10248, 10249, 10250, 10251, 10252, 10253, 10254, 10255, 10256, 10257, 10258, 10259,
        10260, 10261, 10262, 10263, 10264, 10265, 10266, 10267, 10268]
    };
    converterService.convertFromServerToClient(fsl_json, 'fsLinked', undefined, componentModelGetter);
    return fs;
  };

/** Finish initializing the virtual scroll component at the beginning of a test. */
const finishInit = () => {
  // On the first cycle we render and measure the viewport.
  fixture.detectChanges();
  flush();

  // On the second cycle we render the items.
  fixture.detectChanges();
  flush();

  // Flush the initial fake scroll event.
//  animationFrameScheduler.flush();
//  flush();
//  fixture.detectChanges();
};

  beforeEach(  () =>  {
    TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, ServoyExtraTable, TableRow],
      imports: [ServoyTestingModule, ScrollingModule, NgbModule, ResizableModule, ServoyPublicModule],
      providers: [FoundsetLinkedConverter, FoundsetConverter, ConverterService, SpecTypesService, LoggerFactory,
        WindowRefService, ServicesService, SessionStorageService, ViewportService, LoadingIndicatorService]
    });

    sabloService = TestBed.inject(SabloService);
    sabloService.connect({}, {}, '');
    sabloDeferHelper = TestBed.inject(SabloDeferHelper);
    const viewportService = TestBed.inject(ViewportService);
    loggerFactory = TestBed.inject(LoggerFactory);
    converterService = TestBed.inject(ConverterService);
    converterService.registerCustomPropertyHandler('foundset', new FoundsetConverter(converterService, sabloService, sabloDeferHelper, viewportService, loggerFactory));
    converterService.registerCustomPropertyHandler('fsLinked', new FoundsetLinkedConverter(converterService, sabloService, viewportService, loggerFactory));
    formattingService = TestBed.inject(FormattingService);
    servoyApi.isInAbsoluteLayout.and.callFake(() => false);

    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.componentInstance.servoyApi = servoyApi;
    component = fixture.componentInstance;
    component.foundset = getFoundset();
    component.foundset.requestSelectionUpdate = jasmine.createSpy('requestSelectionUpdate');
    component.foundset.sort = sort;
    component.foundset.loadExtraRecordsAsync = loadExtraRecordsAsync;
    component.columns = [
      {
        state: {
          allChanged: false, inNotify: false,
          conversionInfo: { dataprovider: 'fsLinked' },
          ignoreChanges: false, change: 0, hash: 2, changedKeys: {}, w: false, vEr: 5
        },
        format: { allowedCharacters: null, isMask: false, isRaw: false, edit: null, display: '#,##0.###', type: 'INTEGER', percent: '%', placeHolder: null, isNumberValidator: false },
        width: 'auto',
        autoResize: false,
        headerText: 'ID',
        showAs: 'text',
        dataprovider: [
          10248, 10249, 10250, 10251, 10252, 10253, 10254, 10255, 10256, 10257, 10258, 10259, 10260, 10261, 10262, 10263, 10264, 10265, 10266, 10267, 10268
        ],
        initialWidth: 'auto'
      },
      {
        state: {
          allChanged: false,
          inNotify: false,
          conversionInfo: {
            dataprovider: 'fsLinked'
          },
          ignoreChanges: false,
          change: 0,
          hash: 3,
          changedKeys: {},
          w: false,
          vEr: 5
        },
        format: { allowedCharacters: null, isMask: false, isRaw: false, edit: null, display: null, type: 'TEXT', placeHolder: null, isNumberValidator: false, uppercase: true },
        width: 'auto',
        autoResize: false,
        headerText: 'Country',
        showAs: 'text',
        dataprovider: [
          'France', 'Germany', 'Brazil', 'France', 'Belgium', 'Brazil', 'Switzerland', 'Switzerland', 'Brazil', 'Venezuela', 'Austria',
          'Mexico', 'Germany', 'Brazil', 'USA', 'Austria', 'Sweden', 'France', 'Finland', 'Germany', 'test'],
        initialWidth: 'auto'
      },
      {
        state: {
          allChanged: false,
          inNotify: false,
          conversionInfo: { dataprovider: 'fsLinked' },
          ignoreChanges: false,
          change: 0,
          hash: 4,
          changedKeys: {},
          w: false,
          vEr: 5
        },
        format: { allowedCharacters: null, isMask: false, isRaw: false, edit: null, display: null, type: 'TEXT', placeHolder: null, maxLength: 15, isNumberValidator: false },
        width: 'auto',
        autoResize: false,
        headerText: 'City',
        showAs: 'text',
        dataprovider: [
          'Reims', 'Münster', 'Rio de Janeiro', 'Lyon', 'Charleroi', 'Rio de Janeiro', 'Bern', 'Genève', 'Resende', 'San Cristóbal', 'Graz',
          'México D.F.', 'Köln', 'Rio de Janeiro', 'Albuquerque', 'Graz', 'Bräcke', 'Strasbourg', 'Oulu', 'München', 'test'],
        initialWidth: 'auto'
      }
    ];
    component.columns[0].dataprovider.idForFoundset= 'ID_columnID'; //have some readable id for fs
    component.columns[1].dataprovider.idForFoundset= 'Country_columnID';
    component.columns[2].dataprovider.idForFoundset= 'City_columnID';
    component.minRowHeight = '25px';
    component.enableColumnResize = false;
    component.pageSize = 10;
    component.responsiveHeight = 300;
    component.cellClick = onCellClick;
    component.cellRightClick = onCellRightClick;
    component.cellDoubleClick = onCellDoubleClick;
    component.headerClick = onHeaderClick;
    component.headerRightClick = onHeaderRightClick;
    component.focusGained = onFocusGained;
    component.focusLost = onFocusLost;
  });


  it('should create table with 3 columns', fakeAsync(() => {
    finishInit();
    expect(component).toBeTruthy('table wrapper component should be created');
    expect(component.table).toBeTruthy('table component should be created');

    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('tr').length).toBeGreaterThan(1);

    const headers = component.table.getNativeElement().getElementsByTagName('th');
    expect(headers).toBeDefined();
    expect(headers.length).toEqual(3, 'should have 3 column headers');
    expect(headers[0].innerText.trim()).toEqual('ID', 'first header text should be ID');
    expect(headers[1].innerText.trim()).toEqual('Country', 'second header text should be Country');
    expect(headers[2].innerText.trim()).toEqual('City', 'third header text should be City');
    expect(component.table.getNativeElement().clientHeight).toBe(300);
    const rows = component.table.getNativeElement().getElementsByTagName('tr');
    expect(rows).toBeDefined();
    expect(rows.length).toBeGreaterThan(0, 'should have rows');
    const firstRow = rows[1].getElementsByTagName('td');
    expect(firstRow.length).toEqual(3, 'should have 3 columns');
    const formattedNumber = formattingService.format(10248, {type: 'INTEGER', display:'#,###'} as Format, false);
    expect(firstRow[0].innerText).toEqual(formattedNumber);
    expect(firstRow[1].innerText).toEqual('FRANCE');
    expect(firstRow[2].innerText).toEqual('Reims');
  }));

  it('should call cell handlers and select row', fakeAsync(() => {
    finishInit();

    const rows = component.table.getNativeElement().getElementsByTagName('tr');
    const firstRow = rows[1].getElementsByTagName('td');

    expect(component.table.foundset.selectedRowIndexes).toHaveSize(1);
    expect(component.table.foundset.selectedRowIndexes[0]).toEqual(1, 'second row should be selected');
    expect(rows[2]).toHaveClass('table-servoyextra-selected', 'second row should have class "table-servoyextra-selected"');

    firstRow[1].click();
    fixture.detectChanges();
    flush();
    expect(onCellClick).toHaveBeenCalled();
    expect(onCellClick).toHaveBeenCalledWith(1, 1, { _svyRowId: '5.10248;_0' }, jasmine.anything(), undefined);
    expect(component.table.foundset.selectedRowIndexes).toHaveSize(1);
    expect(component.table.foundset.selectedRowIndexes[0]).toEqual(0, 'first row should be selected');
    expect(component.table.foundset.requestSelectionUpdate).toHaveBeenCalledWith([0]);
    expect(rows[1]).toHaveClass('table-servoyextra-selected', 'second row should have class "table-servoyextra-selected"');
    expect(rows[2]).not.toHaveClass('table-servoyextra-selected', 'second row should NOT have class "table-servoyextra-selected" anymore');

    firstRow[2].dispatchEvent(new MouseEvent('contextmenu'));
    fixture.detectChanges();
    flush();
    expect(onCellRightClick).toHaveBeenCalledWith(1, 2, { _svyRowId: '5.10248;_0' }, jasmine.anything(), undefined);

    firstRow[0].click();
    firstRow[0].click();
    fixture.detectChanges();
    flush();
    expect(onCellDoubleClick).toHaveBeenCalledWith(1, 0, { _svyRowId: '5.10248;_0' }, jasmine.anything(), undefined);
    expect(onCellClick).not.toHaveBeenCalledWith(1, 0, { _svyRowId: '5.10248;_0' }, jasmine.anything(), undefined);
  }));

  it('should call header handlers and sort', fakeAsync(() => {
    finishInit();
    fixture.detectChanges();
    flush();

    const headers = component.table.getNativeElement().getElementsByTagName('th');
    expect(headers).toBeDefined();

    headers[2].click();
    fixture.detectChanges();
    flush();
    expect(onHeaderClick).toHaveBeenCalledWith(2, undefined, jasmine.anything(), undefined);
    expect(component.table.foundset.sort).toHaveBeenCalledWith([{ name: 'City_columnID', direction: 'asc' }]);

    headers[1].dispatchEvent(new MouseEvent('contextmenu'));
    fixture.detectChanges();
    flush();
    expect(onHeaderRightClick).toHaveBeenCalledWith(1, undefined, jasmine.anything(), undefined);
  }));

  it('should call focus and blur handlers', fakeAsync(() => {
    finishInit();
    fixture.detectChanges();
    flush();

    expect(component.table.getNativeElement().getElementsByTagName('table')[0]).toBeDefined();
    component.table.getNativeElement().getElementsByTagName('table')[0].dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    flush();
    expect(onFocusGained).toHaveBeenCalled();
    
    component.table.getNativeElement().getElementsByTagName('table')[0].dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    flush();
    expect(onFocusLost).toHaveBeenCalled();
  }));

  it('should scroll to index', fakeAsync(() => {
    finishInit();

    expect(component.table.renderedRows.length).toEqual(21, 'should have rendered 21 rows');
    expect(component.table.getFirstVisibleIndex()).toEqual(0, 'first visible index should be 0');

    component.table.viewPort.scrollToIndex(3);
    fixture.detectChanges();
    flush();
    tick(5000);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    flush();
    expect(loadExtraRecordsAsync).not.toHaveBeenCalled();
    expect(component.table.getFirstVisibleIndex()).toEqual(3);

    //scroll to the end to force it load more records
    component.table.viewPort.scrollToIndex(22);
    fixture.detectChanges();
    flush();
    tick(9000);
    fixture.detectChanges();
    flush();
    tick(9000);
    fixture.detectChanges();
    flush();

    expect(component.table.getFirstVisibleIndex()).toEqual(12, 'the first visible index should be 12 (21 is the last visible)');
    expect(loadExtraRecordsAsync).toHaveBeenCalled();
  }));

  it('should navigate pages', fakeAsync(() => {
    finishInit();

    expect(component.table.showPagination()).toBeTrue();

    const pagination = component.table.getNativeElement().getElementsByTagName('ngb-pagination');
    expect(pagination[0]).toBeDefined();
    //const paginationLinks = pagination[0].getElementsByClassName('page-link');
    //expect(paginationLinks.length).toEqual(3);
    //const prevPage = paginationLinks[0] as HTMLElement;
    //const nextPage = paginationLinks[2] as HTMLElement;

    expect(component.table.getFirstVisibleIndex()).toEqual(0, 'first visible index should be 0');
    expect(component.table.pageSize).toEqual(10);

    //nextPage.click();
    component.table.modifyPage(2);
    fixture.detectChanges();
    flush();
    tick(9000);
    expect(component.table.currentPage).toEqual(2, 'current page should be 2');
    expect(component.table.getFirstVisibleIndex()).toEqual(10, 'first visible index should be 10');

    component.table.modifyPage(1);
    fixture.detectChanges();
    flush();
    tick(9000);
    expect(component.table.currentPage).toEqual(1, 'current page should be 1');
    expect(component.table.getFirstVisibleIndex()).toEqual(0, 'first visible index should be 0');
  }));
});

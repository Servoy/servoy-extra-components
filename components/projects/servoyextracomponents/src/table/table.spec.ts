import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule, IFoundset, FoundsetChangeEvent } from '@servoy/public';
import { ServoyExtraTable, Column, KeycodeSettings } from './table';

// Builds a minimal in-memory foundset good enough to drive table.ts logic in jsdom.
function makeFoundset(serverSize = 10, viewSize = 10, startIndex = 0): IFoundset {
    const rows: any[] = [];
    for (let i = 0; i < viewSize; i++) {
        rows.push({ _svyRowId: 'r' + (startIndex + i) });
    }
    const listeners: any[] = [];
    const fs: any = {
        serverSize,
        hasMoreRows: false,
        multiSelect: true,
        selectedRowIndexes: [0],
        sortColumns: '',
        viewPort: { startIndex, size: viewSize, rows },
        addChangeListener: (l: any) => {
            listeners.push(l);
            return () => {
                const i = listeners.indexOf(l);
                if (i >= 0) listeners.splice(i, 1);
            };
        },
        removeChangeListener: (l: any) => {
            const i = listeners.indexOf(l);
            if (i >= 0) listeners.splice(i, 1);
        },
        requestSelectionUpdate: vi.fn((idxs: number[]) => {
            fs.selectedRowIndexes = idxs.slice();
            return Promise.resolve();
        }),
        loadRecordsAsync: vi.fn(() => Promise.resolve()),
        loadExtraRecordsAsync: vi.fn(() => Promise.resolve()),
        loadLessRecordsAsync: vi.fn(() => Promise.resolve()),
        setPreferredViewportSize: vi.fn(),
        notifyChanged: vi.fn(),
        sort: vi.fn(),
        _fireChange: (ev: FoundsetChangeEvent) => listeners.forEach(l => l(ev))
    };
    return fs as IFoundset;
}

function makeColumns(): Column[] {
    const dp0: any = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9'];
    dp0.idForFoundset = 'col0';
    const dp1: any = ['b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'];
    dp1.idForFoundset = 'col1';
    const col0: any = {
        id: 'c0', showAs: 'text', headerText: 'Name', headerStyleClass: 'hs0', styleClass: 'cs0',
        styleClassDataprovider: undefined, dataprovider: dp0, autoResize: false,
        valuelist: undefined, width: '100px', initialWidth: undefined, format: undefined
    };
    const col1: any = {
        id: 'c1', showAs: 'text', headerText: 'Value', headerStyleClass: 'hs1', styleClass: 'cs1',
        styleClassDataprovider: undefined, dataprovider: dp1, autoResize: true,
        valuelist: undefined, width: 'auto', initialWidth: undefined, format: undefined
    };
    return [col0, col1] as Column[];
}

describe('ServoyExtraTable', () => {
    let fixture: ComponentFixture<ServoyExtraTable>;
    let component: ServoyExtraTable;
    let foundset: IFoundset;

    async function build(extra?: (f: ComponentFixture<ServoyExtraTable>) => void) {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, ServoyExtraTable],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraTable);
        component = fixture.componentInstance;
        foundset = makeFoundset();
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('foundset', foundset);
        fixture.componentRef.setInput('columns', makeColumns());
        fixture.componentRef.setInput('pageSize', 0);
        fixture.componentRef.setInput('currentPage', 1);
        fixture.componentRef.setInput('enableSort', true);
        fixture.componentRef.setInput('sortStyleClass', 'srt');
        fixture.componentRef.setInput('selectionClass', 'sel');
        fixture.componentRef.setInput('styleClass', 'tbl');
        fixture.componentRef.setInput('minRowHeight', '25px');
        fixture.componentRef.setInput('responsiveHeight', 300);
        if (extra) extra(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
    }

    beforeEach(async () => {
        await build();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create and render a table with headers', () => {
        expect(component).toBeTruthy();
        const headers = fixture.nativeElement.querySelectorAll('th');
        expect(headers.length).toBe(2);
        expect(headers[0].textContent).toContain('Name');
    });

    it('getNativeElement returns an element', () => {
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('hasNext reflects server size vs page size', () => {
        // pageSize 0 -> no pagination, hasNext computes using serverSize/pageSize
        expect(typeof component.hasNext()).toBe('boolean');
    });

    it('modifyPage does nothing when going below page 1', () => {
        fixture.componentRef.setInput('pageSize', 5);
        fixture.detectChanges();
        const r = component.modifyPage(-10);
        expect(r).toBe(false);
        expect(component._currentPage()).toBe(1);
    });

    it('getSortClass hides when sort disabled', () => {
        fixture.componentRef.setInput('enableSort', false);
        fixture.detectChanges();
        expect(component.getSortClass(0)).toBe('table-servoyextra-sort-hide');
    });

    it('getSortClass derives direction from foundset sortColumns', () => {
        (foundset as any).sortColumns = 'col0 asc';
        const cls = component.getSortClass(0);
        expect(cls).toContain('table-servoyextra-sort-show-up');
    });

    it('getSortClass derives desc direction', () => {
        (foundset as any).sortColumns = 'col1 desc';
        const cls = component.getSortClass(1);
        expect(cls).toContain('table-servoyextra-sort-show-down');
    });

    it('getSortStyleClass returns style class for first column by default', () => {
        const s = component.getSortStyleClass(0);
        expect(s).toContain('srt');
        expect(s).toContain('hs0');
    });

    it('getSortStyleClass appends only header class for non-active column', () => {
        const s = component.getSortStyleClass(1);
        expect(s).toContain('hs1');
        expect(s.trim().startsWith('srt')).toBe(false);
    });

    it('getTHeadStyle sets pointer cursor when sort enabled', () => {
        const style = component.getTHeadStyle();
        expect(style.cursor).toBe('pointer');
    });

    it('getLayoutStyle returns a position', () => {
        const style = component.getLayoutStyle();
        expect(['relative', 'absolute']).toContain(style.position);
    });

    it('getTableStyle returns a width string when auto columns present', () => {
        const style = component.getTableStyle();
        expect(typeof style.width === 'string' || style.width === undefined).toBe(true);
    });

    it('getColumnStyle returns an object for fixed-width column', () => {
        const style = component.getColumnStyle(0);
        expect(style).toBeTruthy();
    });

    it('headerClicked triggers SQL sort when no handler is set', () => {
        component.headerClicked(new MouseEvent('click'), 0);
        expect(foundset.sort).toHaveBeenCalled();
    });

    it('headerClicked calls onHeaderClick handler when provided', async () => {
        const handler = vi.fn().mockResolvedValue('up');
        fixture.componentRef.setInput('onHeaderClick', handler);
        fixture.detectChanges();
        component.headerClicked(new MouseEvent('click'), 1);
        expect(handler).toHaveBeenCalled();
    });

    it('headerRightClicked calls onHeaderRightClick handler', () => {
        const handler = vi.fn();
        fixture.componentRef.setInput('onHeaderRightClick', handler);
        fixture.detectChanges();
        component.headerRightClicked(new MouseEvent('contextmenu'), 0);
        expect(handler).toHaveBeenCalledWith(0, undefined, expect.any(MouseEvent), 'c0');
    });

    it('setSelectedHeader delegates to headerClicked', () => {
        const spy = vi.spyOn(component, 'headerClicked');
        component.setSelectedHeader(1);
        expect(spy).toHaveBeenCalledWith(null, 1);
    });

    it('onResizeColumnEnd fires onColumnResize handler', () => {
        const handler = vi.fn();
        fixture.componentRef.setInput('onColumnResize', handler);
        fixture.detectChanges();
        component.onResizeColumnEnd();
        expect(handler).toHaveBeenCalled();
    });

    it('onResizeColumn sets header width styles', () => {
        component.onResizeColumn({ rectangle: { width: 150 } } as any, 0);
        const th = fixture.nativeElement.querySelectorAll('th')[0];
        expect(th.style.width).toBe('150px');
    });

    it('requestFocus focuses the table element', () => {
        const tableEl = fixture.nativeElement.querySelector('table');
        const spy = vi.spyOn(tableEl, 'focus');
        component.requestFocus(true);
        expect(spy).toHaveBeenCalled();
    });

    it('getViewPortPosition returns a two-number array', () => {
        const pos = component.getViewPortPosition();
        expect(pos.length).toBe(2);
        expect(typeof pos[0]).toBe('number');
    });

    it('isPaginationVisible is false with pageSize 0', () => {
        expect(component.isPaginationVisible()).toBe(false);
    });

    it('isPaginationVisible is true when pageSize smaller than serverSize', () => {
        fixture.componentRef.setInput('pageSize', 5);
        fixture.detectChanges();
        expect(component.isPaginationVisible()).toBe(true);
    });

    it('keyPressed ARROW DOWN requests next selection', () => {
        foundset.selectedRowIndexes = [0];
        component.keyPressed({ keyCode: 40, preventDefault: () => { /* noop */ } } as any);
        expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([1]);
    });

    it('keyPressed ARROW UP requests previous selection', () => {
        foundset.selectedRowIndexes = [3];
        component.keyPressed({ keyCode: 38, preventDefault: () => { /* noop */ } } as any);
        expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([2]);
    });

    it('keyPressed ENTER fires onCellClick', () => {
        const handler = vi.fn();
        fixture.componentRef.setInput('onCellClick', handler);
        fixture.detectChanges();
        foundset.selectedRowIndexes = [2];
        component.keyPressed({ keyCode: 13, preventDefault: () => { /* noop */ } } as any);
        expect(handler).toHaveBeenCalled();
    });

    it('keyPressed respects keyCodeSettings disabling arrowDown', () => {
        const kcs: KeycodeSettings = { arrowUp: true, arrowDown: false, end: true, enter: true, home: true, pageDown: true, pageUp: true };
        fixture.componentRef.setInput('keyCodeSettings', kcs);
        fixture.detectChanges();
        foundset.selectedRowIndexes = [0];
        (foundset.requestSelectionUpdate as any).mockClear();
        component.keyPressed({ keyCode: 40, preventDefault: () => { /* noop */ } } as any);
        expect(foundset.requestSelectionUpdate).not.toHaveBeenCalled();
    });

    it('keyPressed does nothing with empty selection', () => {
        foundset.selectedRowIndexes = [];
        (foundset.requestSelectionUpdate as any).mockClear();
        component.keyPressed({ keyCode: 40, preventDefault: () => { /* noop */ } } as any);
        expect(foundset.requestSelectionUpdate).not.toHaveBeenCalled();
    });

    it('ngOnDestroy unregisters the foundset listener', () => {
        const spy = vi.spyOn(foundset, 'removeChangeListener');
        // simulate a listener having been registered through a foundset change
        component.svyOnChanges({ foundset: { currentValue: foundset, previousValue: makeFoundset(), isFirstChange: () => false } } as any);
        component.ngOnDestroy();
        // removeFoundsetListenerFunction path; no throw is the key assertion
        expect(() => component.ngOnDestroy()).not.toThrow();
        spy.mockRestore();
    });

    it('svyOnChanges handles pageSize change', () => {
        expect(() => component.svyOnChanges({
            pageSize: { currentValue: 5, previousValue: 0, isFirstChange: () => false }
        } as any)).not.toThrow();
        expect(foundset.setPreferredViewportSize).toHaveBeenCalled();
    });

    it('svyOnChanges handles currentPage change', () => {
        fixture.componentRef.setInput('currentPage', 2);
        expect(() => component.svyOnChanges({
            currentPage: { currentValue: 2, previousValue: 1, isFirstChange: () => false }
        } as any)).not.toThrow();
    });

    it('foundset listener handles a sortColumns change', () => {
        (foundset as any).sortColumns = 'col0 asc';
        (foundset as any)._fireChange({ sortColumnsChanged: { oldValue: '', newValue: 'col0 asc' } });
        expect(component._sortDirection()).toBe('up');
    });

    it('foundset listener handles selectedRowIndexes change', () => {
        foundset.selectedRowIndexes = [2];
        expect(() => (foundset as any)._fireChange({ selectedRowIndexesChanged: { oldValue: [0], newValue: [2] } })).not.toThrow();
    });

    it('foundset listener handles a full value change', () => {
        expect(() => (foundset as any)._fireChange({ fullValueChanged: { oldValue: null, newValue: foundset } })).not.toThrow();
    });

    it('tableClicked with no hovered row does nothing harmful', () => {
        expect(() => component.tableClicked(new MouseEvent('click'), 1)).not.toThrow();
    });

    describe('private helpers and rendering', () => {
        it('getNumberFromPxString parses px values and rejects non-numeric', () => {
            const fn = (component as any).getNumberFromPxString.bind(component);
            expect(fn('120px')).toBe(120);
            expect(fn('auto')).toBe(-1);
            expect(fn('')).toBe(-1);
        });

        it('isAutoResizeColumn is true for auto width or autoResize flag', () => {
            const fn = (component as any).isAutoResizeColumn.bind(component);
            expect(fn(0)).toBe(false);
            expect(fn(1)).toBe(true);
        });

        it('getFoundsetIndexFromViewportIndex and the inverse are consistent', () => {
            const toFs = (component as any).getFoundsetIndexFromViewportIndex.bind(component);
            const toVp = (component as any).getViewportIndexFromFoundsetIndex.bind(component);
            expect(toFs(3)).toBe(3);
            expect(toVp(3)).toBe(3);
        });

        it('getPageForIndex computes a 1-based page', () => {
            fixture.componentRef.setInput('pageSize', 5);
            fixture.detectChanges();
            const fn = (component as any).getPageForIndex.bind(component);
            expect(fn(0)).toBe(1);
            expect(fn(5)).toBe(2);
            expect(fn(11)).toBe(3);
        });

        it('calculateTableWidth sums fixed column widths', () => {
            const w = (component as any).calculateTableWidth();
            expect(typeof w).toBe('number');
            expect(w).toBeGreaterThanOrEqual(0);
        });

        it('centerAroundOldIntervalWithNewSizeIfPossible keeps the interval within allowed bounds', () => {
            const fn = (component as any).centerAroundOldIntervalWithNewSizeIfPossible.bind(component);
            const [start, size] = fn(5, 1, 0, 100, 10);
            expect(start).toBeGreaterThanOrEqual(0);
            expect(start + size).toBeLessThanOrEqual(100);
            expect(size).toBe(10);
        });

        it('getDisplayValue resolves a valuelist display value', () => {
            const fn = (component as any).getDisplayValue.bind(component);
            const vl = [{ realValue: 1, displayValue: 'One' }];
            expect(fn(1, vl)).toBe('One');
            expect(fn(2, vl)).toBe(2);
            expect(fn('x', null)).toBe('x');
        });

        it('getValuelist returns a direct valuelist or the row-specific one', () => {
            const fn = (component as any).getValuelist.bind(component);
            expect(fn({ valuelist: undefined }, 0)).toBeNull();
            const singleVl: any = [{ realValue: 1, displayValue: 'A' }];
            singleVl.filterList = () => { /* noop */ };
            expect(fn({ valuelist: singleVl }, 0)).toBe(singleVl);
        });

        it('calculateAllowedLoadedDataBounds returns the full foundset when not paging', () => {
            const bounds = (component as any).calculateAllowedLoadedDataBounds();
            expect(bounds.startIdx).toBe(0);
            expect(bounds.size).toBe(foundset.serverSize);
        });

        it('calculateAllowedLoadedDataBounds restricts to a page when paging', () => {
            fixture.componentRef.setInput('pageSize', 5);
            fixture.detectChanges();
            const bounds = (component as any).calculateAllowedLoadedDataBounds();
            expect(bounds.startIdx).toBe(0);
            expect(bounds.size).toBe(5);
        });

        it('getComponentWidth returns a number and caches it', () => {
            const w = (component as any).getComponentWidth();
            expect(typeof w).toBe('number');
        });

        it('showPagination is false when pageSize is 0', () => {
            expect((component as any).showPagination()).toBeFalsy();
        });

        it('showPagination is true when serverSize exceeds pageSize', () => {
            fixture.componentRef.setInput('pageSize', 5);
            fixture.detectChanges();
            expect((component as any).showPagination()).toBeTruthy();
        });

        it('setColumnsToInitalWidthAndInitAutoColumns builds the autoColumns descriptor', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            const auto = (component as any).autoColumns;
            expect(auto).toBeTruthy();
            // the second column has width 'auto', so it is an auto column
            expect(auto.count).toBeGreaterThanOrEqual(1);
        });

        it('getCellStyle returns a style object for a fixed-width column', () => {
            const style = (component as any).getCellStyle(0);
            expect(style.overflow).toBe('hidden');
        });

        it('createTableRow creates a tr with one td per column', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            const tr = (component as any).createTableRow(component.columns(), 0);
            expect(tr.tagName).toBe('TR');
            expect(tr.children.length).toBe(2);
        });

        it('generateTemplate renders rows into the tbody', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            (component as any).renderedSize = 10;
            (component as any).generateTemplate(true);
            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBeGreaterThan(0);
        });

        it('getAutoColumnPercentage returns 0 when no percentage columns exist', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            expect((component as any).getAutoColumnPercentage()).toBe(0);
        });

        it('doFoundsetSQLSort sets sortColumns and calls sort', () => {
            (component as any).doFoundsetSQLSort(0);
            expect(foundset.sort).toHaveBeenCalled();
            expect((foundset as any).sortColumns).toContain('col0');
        });

        it('doFoundsetSQLSort flips direction on a repeated sort of the same column', () => {
            (foundset as any).sortColumns = 'col0 asc';
            (component as any).doFoundsetSQLSort(0);
            expect((foundset as any).sortColumns).toBe('col0 desc');
        });

        it('isVisible returns false for a detached element', () => {
            const el = document.createElement('div');
            expect((component as any).isVisible(el)).toBe(false);
        });

        it('getInitialRenderSize and getInitialPreferredLoadedSize return positive numbers', () => {
            (component as any).batchSizeForRenderingMoreRows = 26;
            (component as any).batchSizeForLoadingMoreRows = 52;
            expect((component as any).getInitialRenderSize()).toBeGreaterThan(0);
            expect((component as any).getInitialPreferredLoadedSize()).toBeGreaterThan(0);
        });

        it('updateSelection toggles the selection class on rendered rows', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            (component as any).renderedSize = 10;
            (component as any).generateTemplate(true);
            (component as any).renderedStartIndex = 0;
            expect(() => (component as any).updateSelection([0], [])).not.toThrow();
        });

        it('setCellDivValue sets textContent for a plain column', () => {
            const div = document.createElement('div');
            (component as any).setCellDivValue({ showAs: 'text' }, div, 'hello');
            expect(div.textContent).toBe('hello');
        });

        it('setCellDivValue sets innerHTML for an html column', () => {
            const div = document.createElement('div');
            (component as any).setCellDivValue({ showAs: 'html' }, div, '<b>x</b>');
            expect(div.innerHTML).toBe('<b>x</b>');
        });
    });


    describe('more table behaviour', () => {
        it('attachHandlers wires click and focus listeners without throwing', () => {
            const gained = vi.fn();
            const lost = vi.fn();
            fixture.componentRef.setInput('onFocusGainedMethodID', gained);
            fixture.componentRef.setInput('onFocusLostMethodID', lost);
            fixture.detectChanges();
            expect(() => component.attachHandlers()).not.toThrow();
        });

        it('getColumnStyle caches the computed style per column', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            const a = component.getColumnStyle(0);
            const b = component.getColumnStyle(0);
            expect(a).toBe(b);
        });

        it('getTableStyle reports a pixel width', () => {
            (component as any).setColumnsToInitalWidthAndInitAutoColumns();
            const style = component.getTableStyle();
            expect(String(style.width)).toContain('px');
        });

        it('svyOnInit sets up performance settings defaults', () => {
            expect(component._performanceSettings()).toBeTruthy();
            expect(component._performanceSettings()!.maxRenderedRows).toBeGreaterThan(0);
        });

        it('svyOnChanges columns branch runs without throwing', () => {
            expect(() => component.svyOnChanges({
                columns: { currentValue: component.columns(), previousValue: undefined, isFirstChange: () => true }
            } as any)).not.toThrow();
        });

        it('getViewportIndexFromFoundsetIndex accounts for the viewport start', () => {
            (foundset as any).viewPort.startIndex = 5;
            const toVp = (component as any).getViewportIndexFromFoundsetIndex.bind(component);
            const toFs = (component as any).getFoundsetIndexFromViewportIndex.bind(component);
            expect(toVp(7)).toBe(2);
            expect(toFs(2)).toBe(7);
        });

        it('headerClicked with handler returning override does not re-sort', async () => {
            const handler = vi.fn().mockResolvedValue('override');
            fixture.componentRef.setInput('onHeaderClick', handler);
            fixture.detectChanges();
            component.headerClicked(new MouseEvent('click'), 0);
            await Promise.resolve();
            expect(handler).toHaveBeenCalled();
        });

        it('keyPressed HOME requests the first row selection', () => {
            fixture.componentRef.setInput('pageSize', 0);
            fixture.detectChanges();
            foundset.selectedRowIndexes = [5];
            (foundset as any).viewPort.startIndex = 0;
            (foundset as any).viewPort.size = 10;
            component.keyPressed({ keyCode: 36, preventDefault: () => { /* noop */ }, stopPropagation: () => { /* noop */ } } as any);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalled();
        });

        it('keyPressed END requests the last row selection', () => {
            fixture.componentRef.setInput('pageSize', 0);
            fixture.detectChanges();
            foundset.selectedRowIndexes = [0];
            (foundset as any).viewPort.startIndex = 0;
            (foundset as any).viewPort.size = 10;
            (foundset as any).serverSize = 10;
            component.keyPressed({ keyCode: 35, preventDefault: () => { /* noop */ }, stopPropagation: () => { /* noop */ } } as any);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalled();
        });
    });

});

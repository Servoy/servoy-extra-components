import { Component, ViewChild, Input, Renderer2, ElementRef, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, QueryList, ViewChildren, Directive, Inject, HostListener } from '@angular/core';
import { BaseCustomObject, Format, IFoundset, IValuelist, ServoyBaseComponent, ViewPortRow, FoundsetChangeEvent } from '@servoy/public';
import { LoggerFactory, LoggerService } from '@servoy/public';
import { ResizeEvent } from 'angular-resizable-element';
import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';
import { auditTime, tap, first } from 'rxjs/operators';
import { CustomVirtualScrollStrategy } from './scroll-strategy';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[svyTableRow]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class TableRow {

    @Input() svyTableRow: number;

    constructor(public elRef: ElementRef) {
    }
}
const instanceOfValuelist = (obj: any): obj is IValuelist=>
    obj != null && (obj).filterList instanceof Function;


@Component({
    selector: 'servoyextra-table',
    templateUrl: './table.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: VIRTUAL_SCROLL_STRATEGY,
        useClass: CustomVirtualScrollStrategy,
    }]
})
export class ServoyExtraTable extends ServoyBaseComponent<HTMLDivElement> implements OnDestroy {

    // this is a hack for test, so that this has a none static child ref because the child is in a nested template
    @ViewChild('child', { static: false }) child: ElementRef;
    @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
    @ViewChildren(TableRow) renderedRows: QueryList<TableRow>;

    @Input() foundset: IFoundset;
    @Input() columns: Array<Column>;
    @Input() sortDirection: string;
    @Input() enableSort = true;
    @Input() sortStyleClass: string;
    @Input() sortdownClass = 'table-servoyextra-sort-down';
    @Input() sortupClass = 'table-servoyextra-sort-up';
    @Input() styleClass: string;
    @Input() minRowHeight: any;
    @Input() enableColumnResize: boolean;
    @Input() pageSize: number;
    @Input() rowStyleClassDataprovider: IFoundset;
    @Input() tabSeq: number;
    @Input() responsiveHeight: number;
    @Input() responsiveDynamicHeight: boolean;
    @Input() lastSelectionFirstElement: number;
	@Input() keyCodeSettings: KeycodeSettings;
    @Input() performanceSettings: { minBatchSizeForRenderingMoreRows: number; minBatchSizeForLoadingMoreRows: number; maxLoadedRows: number };

    @Input() onViewPortChanged: (start: number, end: number) => void;
    @Input() onCellClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() onCellDoubleClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() onCellRightClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() onHeaderClick: (colIdx: number, sortDirection: string, e?: MouseEvent, columnId?: string) => Promise<string>;
    @Input() onHeaderRightClick: (colIdx: number, sortDirection: string, e?: MouseEvent, columnId?: string) => void;
    @Input() onColumnResize: (event?: ResizeEvent) => void;
    @Input() onFocusGainedMethodID: (event: Event) => void;
    @Input() onFocusLostMethodID: (event?: Event) => void;

    timeoutID: number;
    lastClicked: number;
    sortColumnIndex: number;
    columnStyleCache: Array<any> = [];
    autoColumnPercentage: any;
    tableWidth = 0;
    scrollWidth = 0;
    autoColumns: { [x: string]: any; count: any; length?: any; columns?: any; minWidth?: any; autoResize?: any };
    componentWidth: any;
    needToUpdateAutoColumnsWidth = false;
    extraWidth: any;
    extraWidthColumnIdx: any;
    columnCSSRules: any[] = [];
    targetStyleSheet: CSSStyleSheet;
    timeoutid: number;
    skipOnce = false;
    currentSortClass: any[] = [];
    sortClassUpdateTimer: any;
    currentPage = 1;
    rendered: boolean;
    scrollToSelectionNeeded = true;
    dataStream = new BehaviorSubject<any[]>([]);
    idx: number;
    changedPage = false;
    prevPage: number;

    averageRowHeight = 25;
    averagePageSize = 20;
    renderedRowsLength: number;
    paginationDisabled = false;

    private log: LoggerService;
    private removeListenerFunction: () => void;
    loading: Promise<void>;
    batchSizeForLoadingMoreRows: number;
    isScrollingDown: boolean;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, logFactory: LoggerFactory,
                    @Inject(VIRTUAL_SCROLL_STRATEGY) private scrollStrategy: CustomVirtualScrollStrategy,
                    @Inject(DOCUMENT) private doc: Document) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('Table');
    }

    svyOnInit() {
        super.svyOnInit();
        if (!this.performanceSettings) {
            this.performanceSettings = {
                minBatchSizeForRenderingMoreRows: 10,
                minBatchSizeForLoadingMoreRows: 20,
                maxLoadedRows: 1000
            };
        }
        this.rendered = true;
        let minBuff = this.performanceSettings.minBatchSizeForRenderingMoreRows * this.averageRowHeight;
        let maxBuff = minBuff * 2;
        this.scrollStrategy.updateItemAndBufferSize(this.averageRowHeight,minBuff, maxBuff );
        this.computeTableWidth();
        this.computeTableHeight();
        this.setColumnsToInitalWidthAndInitAutoColumns();
        for (let i = 0; i < this.columns.length; i++) {
            this.updateTableColumnStyleClass(i, { width: this.columns[i].width, minWidth: this.columns[i].width, maxWidth: this.columns[i].width });
        }
        this.attachHandlers();

        this.removeListenerFunction = this.foundset.addChangeListener((event: FoundsetChangeEvent) => {
            this.foundsetChanged(event);
        });

        this.idx = 0;
        this.viewPort.scrolledIndexChange.pipe(
            auditTime(300),
            tap(() => {
                const first = this.getFirstVisibleIndex();
                this.isScrollingDown = this.idx < first;
                this.log.spam(this.log.buildMessage(() => 'svy extra table * SCROLLING '+(this.isScrollingDown ? 'down ':'up ')+'to index '+this.idx));
                this.idx = this.getFirstVisibleIndex();
                this.loadMoreRecords(this.idx);
                //TODO this.unloadRecordsIfNecessary();
                this.setCurrentPageIfNeeded();
            })
        ).subscribe();
        this.renderedRows.changes.subscribe(() => {
           if (this.renderedRows.first && this.renderedRows.last) {
                this.log.spam(this.log.buildMessage(() => 'svy extra table * RENDERED RANGE ('+this.renderedRows.first.svyTableRow+', '+this.renderedRows.last.svyTableRow+')'));
           }
           else {
            this.log.spam('svy extra table * RENDERED RANGE is invalid');
           }
           const newAvg = this.renderedRows.length > 0 ? this.renderedRows.reduce((a, b) => a + b.elRef.nativeElement.getBoundingClientRect().height, 0) / this.renderedRows.length : 0;
           if (newAvg !== this.averageRowHeight || this.renderedRowsLength !== this.renderedRows.length) {
                this.averageRowHeight = newAvg;
                this.averagePageSize = this.averageRowHeight > 0 ? this.getNativeElement().getElementsByTagName('tbody')[0].clientHeight / this.averageRowHeight : this.pageSize;
                if (this.responsiveDynamicHeight) this.computeTableHeight();
           }
            this.renderedRowsLength = this.renderedRows.length;
            minBuff = this.performanceSettings.minBatchSizeForRenderingMoreRows * this.averageRowHeight;
            maxBuff = minBuff * 2;
            this.scrollStrategy.updateItemAndBufferSize(this.averageRowHeight,minBuff, maxBuff );
        });

        setTimeout(() => {
            this.dataStream.next(this.foundset.viewPort.rows);
            this.scrollToSelection();
        }, 50);
    
	    // the number of extra rows to be loaded (before/after) if the rendered rows get too close to the loaded rows bounds when scrolling
		// when you change this initial value please update the .spec as well - config option "initialPreferredViewPortSize" on the foundset property should match getInitialPreferredLoadedSize
		// this should be higher then batchSizeForRenderingMoreRows because when we load more rows we should load enough to at least be able to render one more batch of rendered rows; so when that one (batchSizeForRenderingMoreRows) is calculated adjust this one as well
        this.batchSizeForLoadingMoreRows = Math.max(this.performanceSettings.minBatchSizeForRenderingMoreRows, this.performanceSettings.minBatchSizeForLoadingMoreRows);
    }

    loadMoreRecords(currIndex: number, scroll?: boolean) {
        if ((this.foundset.viewPort.startIndex !== 0 && currIndex < this.averagePageSize) ||
            currIndex + this.averagePageSize >= this.foundset.viewPort.rows.length) {
                const load = currIndex + this.batchSizeForLoadingMoreRows >= this.foundset.viewPort.rows.length ? this.batchSizeForLoadingMoreRows : (-1) * this.batchSizeForLoadingMoreRows;
                this.log.spam(this.log.buildMessage(() => 'svy extra table * LOADING FS RECORDS '+load));
                this.loading = this.foundset.loadExtraRecordsAsync(load, false).then(() => {
                    this.foundsetRecordsChanged();
                    if (scroll) this.scrollToSelection();
                }).finally(() => {
                    this.loading = null;
                });
        }
    }

    getFirstVisibleIndex(): number {
        const offset = this.getNativeElement().getElementsByTagName('th')[0].getBoundingClientRect().bottom;
        const firstRow = this.renderedRows.find((element) => element.elRef.nativeElement.getBoundingClientRect().top >= offset);
        if (firstRow) return firstRow.svyTableRow;
        return -1;
    }

    ngOnDestroy(): void {
        if (this.removeListenerFunction != null) {
            this.removeListenerFunction();
            this.removeListenerFunction = null;
        }
    }

    attachHandlers() {
        if (this.onHeaderClick || this.onHeaderRightClick) {
            const headers = this.getNativeElement().getElementsByTagName('th');
            for (let i = 0; i < headers.length; i++) {
                if (this.onHeaderClick) {
                    this.renderer.listen(headers[i], 'click', e => this.headerClicked(i, e));
                }
                if (this.onHeaderRightClick) {
                    this.renderer.listen(headers[i], 'contextmenu', e => this.onHeaderRightClick(i, this.sortDirection, e, this.columns[i].id));
                }
            }
        }

        if (this.onFocusGainedMethodID) {
            this.renderer.listen(this.getNativeElement().getElementsByTagName('table')[0], 'focus', e => {
                this.callFocusGained(e);
            });
        }

        if (this.onFocusLostMethodID) {
            this.renderer.listen(this.getNativeElement().getElementsByTagName('table')[0], 'blur', e => {
                this.callFocusLost(e);
            });
        }
    }


    doFoundsetSQLSort(sortColumnIndex: number) {
        if (!this.enableSort) return;
        this.sortColumnIndex = sortColumnIndex;
        if (this.columns[sortColumnIndex].dataprovider) {
            const sortCol = this.columns[sortColumnIndex].dataprovider.idForFoundset;
            let sqlSortDirection: 'asc' | 'desc' = 'asc';
            if (this.foundset.sortColumns) {
                const sortColumnsA = this.foundset.sortColumns.split(' ');
                if (sortCol === sortColumnsA[0]) {
                    sqlSortDirection = sortColumnsA[1].toLowerCase() === 'asc' ? 'desc' : 'asc';
                }
            }
            this.foundset.sortColumns = sortCol + ' ' + sqlSortDirection;
            this.foundset.sort([{ name: sortCol, direction: sqlSortDirection }]).then(() => {
                this.dataStream.next(this.foundset.viewPort.rows);
            });
        }
    }

    cellClick(rowIdx: number, colIdx: number, record: any, e: MouseEvent, columnId: string) {
        if (this.onCellDoubleClick && this.onCellClick) {
            const innerThis: ServoyExtraTable = this;
            if (innerThis.lastClicked === rowIdx * colIdx) {
                window.clearTimeout(this.timeoutID);
                innerThis.lastClicked = -1;
                innerThis.timeoutID = null;
                innerThis.onCellDoubleClick(rowIdx + 1, colIdx, record, e, columnId);
            } else {
                innerThis.lastClicked = rowIdx * colIdx;
                innerThis.timeoutID = window.setTimeout(() => {
                    innerThis.timeoutID = null;
                    innerThis.lastClicked = -1;
                    innerThis.onCellClick(rowIdx + 1, colIdx, record, e, columnId);
                }, 250);
            }
        } else if (this.onCellClick) {
            this.onCellClick(rowIdx + 1, colIdx, this.foundset.viewPort.rows[rowIdx], e, columnId);
        }
    }

    getColumnStyle(column: number) {
        let columnStyle = this.columnStyleCache[column];
        if (columnStyle) return columnStyle;

        columnStyle = { overflow: 'hidden' };
        this.columnStyleCache[column] = columnStyle;
        const w = this.getNumberFromPxString(this.columns[column].width);
        if (w > -1) {
            columnStyle['min-width'] = columnStyle['max-width'] = columnStyle['width'] = w + 'px';
        } else if (this.columns[column].width && (this.columns[column].width) !== 'auto') {
            columnStyle['width'] = this.columns[column].width;
        } else {
            const autoColumnPercentage = this.getAutoColumnPercentage();
            if (this.autoColumnPercentage) {
                columnStyle['width'] = autoColumnPercentage + '%';
            } else {
                if (!this.autoColumns) this.setColumnsToInitalWidthAndInitAutoColumns();
                columnStyle['min-width'] = columnStyle['max-width'] = columnStyle['width'] =
                    Math.floor((this.getComponentWidth() - this.tableWidth - this.scrollWidth) / this.autoColumns.count) + 'px';
            }
        }
        this.updateTableColumnStyleClass(column, columnStyle);
        return columnStyle;
    }
    getComponentWidth() {
        if (!this.rendered) return 0;
        if (this.componentWidth === undefined && this.getNativeElement().parentElement.parentElement.clientWidth !== 0) {
            this.componentWidth = Math.floor(this.getNativeElement().parentElement.parentElement.clientWidth);
            const computedStyle = window.getComputedStyle(this.getNativeElement().parentElement.parentElement);
            //clientWidth of the parent container also contains the padding, we need to remove it
            this.componentWidth -= this.getNumberFromPxString(computedStyle.paddingLeft);
            this.componentWidth -= this.getNumberFromPxString(computedStyle.paddingRight);
        }
        return this.componentWidth;
    }
    getAutoColumnPercentage() {
        let nrColumnsWithPercentage = 0;
        let sumColumnsWithPercentage = 0;
        if (!this.autoColumns) return null;

        for (const autoColumnIdx of Object.keys(this.autoColumns['columns'])) {
            let w = this.columns[autoColumnIdx].width;
            if (w) {
                w = w.trim();
                if (w.indexOf('%') === w.length - 1) {
                    w = w.substring(0, w.length - 1);
                    if (!isNaN(Number(w))) {
                        nrColumnsWithPercentage++;
                        sumColumnsWithPercentage += Number(w);
                    }
                }
            }
        }

        return nrColumnsWithPercentage ? (100 - sumColumnsWithPercentage) / (this.autoColumns.length - nrColumnsWithPercentage) : 0;
    }

    getNumberFromPxString(s: string) {
        let numberFromPxString = -1;
        if (s) {
            s = s.trim().toLowerCase();
            if (s.indexOf('px') === s.length - 2) {
                s = s.substring(0, s.length - 2);
            }
            if (!isNaN(Number(s))) {
                numberFromPxString = Number(s);
            }
        }
        return numberFromPxString;
    }

    computeTableWidth() {
        this.tableWidth = 0;
        if (this.columns) {
            for (let i = 0; i < this.columns.length; i++) {
                if (!this.isAutoResizeColumn(i) && this.getNumberFromPxString(this.columns[i].initialWidth) > 0) {
                    const w = this.getNumberFromPxString(this.columns[i].width);
                    if (w > -1) {
                        this.tableWidth += w;
                    }
                }
            }
        }
        return this.tableWidth;
    }
    isAutoResizeColumn(idx: number) {
        return this.columns[idx].autoResize || (this.columns[idx].width === 'auto');
    }

    setColumnsToInitalWidthAndInitAutoColumns() {
        const newAutoColumns = { columns: {}, minWidth: {}, autoResize: {}, count: 0 };
        if (this.columns) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].initialWidth === undefined) {
                    this.columns[i].initialWidth = this.columns[i].width === undefined ? '' : this.columns[i].width;
                } else {
                    this.columns[i].width = this.columns[i].initialWidth;
                }

                const minWidth = this.getNumberFromPxString(this.columns[i].width);
                if (this.isAutoResizeColumn(i) || minWidth < 0) {
                    newAutoColumns.columns[i] = true;
                    newAutoColumns.minWidth[i] = minWidth;
                    newAutoColumns.autoResize[i] = this.isAutoResizeColumn(i);
                    newAutoColumns.count += 1;
                }
            }
        }

        this.autoColumns = newAutoColumns;
        this.needToUpdateAutoColumnsWidth = true;
        this.columnStyleCache = [];
    }

    updateAutoColumnsWidth(delta: number) {
        let fixedDelta = delta;

        // if extraWidth was appended to last auto-resize column then remove it, and append it to delta
        if (this.extraWidth) {
            fixedDelta += this.extraWidth;
            let w = this.getNumberFromPxString(this.columns[this.extraWidthColumnIdx].width);
            w += (0 - this.extraWidth);
            this.columns[this.extraWidthColumnIdx].width = w + 'px';
        }

        this.columnStyleCache = [];
        const oldWidth = this.getAutoResizeColumnsWidth();
        const newWidth = oldWidth + fixedDelta;

        let usedDelta = 0;
        let lastAutoColumnIdx = -1;
        for (let i = 0; i < this.columns.length; i++) {
            if (this.autoColumns.autoResize[i]) {
                if (this.autoColumns.minWidth[i] > 0) {
                    const oldW = this.getNumberFromPxString(this.columns[i].width);
                    let w = Math.floor(oldW * newWidth / oldWidth);

                    if (w < this.autoColumns.minWidth[i]) {
                        w = this.autoColumns.minWidth[i];
                    }
                    this.columns[i].width = w + 'px';
                    usedDelta += (w - oldW);
                    lastAutoColumnIdx = i;
                } else {
                    this.columns[i].width = this.columns[i].initialWidth;
                }
            }
        }

        if (lastAutoColumnIdx > -1) {
            this.extraWidth = Math.round(Math.abs(fixedDelta) - Math.abs(usedDelta));
            this.extraWidthColumnIdx = lastAutoColumnIdx;
            if (this.extraWidth) {
                if (fixedDelta < 0) this.extraWidth = 0 - this.extraWidth;
                let w = this.getNumberFromPxString(this.columns[lastAutoColumnIdx].width);
                w += this.extraWidth;
                this.columns[lastAutoColumnIdx].width = w + 'px';
            }
        }
    }


    getAutoResizeColumnsWidth() {
        let autoColumnsWidth = 0;
        for (let i = 0; i < this.columns.length; i++) {
            if (this.autoColumns.autoResize[i] && this.autoColumns.minWidth[i] > 0) {
                autoColumnsWidth += this.getNumberFromPxString(this.columns[i].width);
            }
        }
        return autoColumnsWidth;
    }

    getSortStyleClass(column: number) {
        let lv_styles = '';
        if (this.enableSort) {
            if ((this.sortColumnIndex === -1 && column === 0) || this.sortColumnIndex === column) {
                lv_styles = this.sortStyleClass;
            }
        }
        return this.columns[column].headerStyleClass === undefined ? lv_styles : lv_styles + ' ' + this.columns[column].headerStyleClass;
    }

    public getSortClass(column: number) {
        let sortClass = 'table-servoyextra-sort-hide';
        if (this.enableSort) {
            let direction: string;
            let isGetSortFromSQL = this.sortColumnIndex < 0;
            if (column === this.sortColumnIndex) {
                direction = this.sortDirection;
                if (!direction) {
                    isGetSortFromSQL = true;
                }
            }
            if (isGetSortFromSQL) {
                if (this.foundset && this.foundset.sortColumns && this.columns[column].dataprovider) {
                    const sortCol = this.columns[column].dataprovider.idForFoundset;
                    const sortColumnsA = this.foundset.sortColumns.split(' ');

                    if (sortCol === sortColumnsA[0]) {
                        direction = sortColumnsA[1].toLowerCase() === 'asc' ? 'up' : 'down';
                    }
                }
            }

            if (direction) {
                sortClass = 'table-servoyextra-sort-show-' + direction + ' ' + this['sort' + direction + 'Class'];
            }
        }
        if (this.currentSortClass.length <= column || this.currentSortClass[column] !== sortClass) {
            if (this.sortClassUpdateTimer) window.clearTimeout(this.sortClassUpdateTimer);

            this.sortClassUpdateTimer = window.setTimeout(() => {
                const tbody = this.elementRef !== undefined ? this.getNativeElement().getElementsByTagName('tbody') : undefined;
                if (tbody) {
                    if (tbody[0].clientHeight > 0) {
                        this.updateTBodyStyle(tbody[0]);
                    } else {
                        this.sortClassUpdateTimer = window.setTimeout(() => {
                            this.updateTBodyStyle(tbody[0]);
                        }, 200);
                    }
                }
            }, 100);
            this.currentSortClass[column] = sortClass;
        }
        return sortClass;
    }
    updateTBodyStyle(tBodyEl: HTMLElement) {
        const tBodyStyle = {};
        const componentWidth = this.getComponentWidth();
        tBodyStyle['width'] = componentWidth + 'px';
        const tblHead = this.getNativeElement().getElementsByTagName('thead')[0];
        if (tblHead.style.display !== 'none') {
            tBodyStyle['top'] = tblHead.offsetHeight + 'px';
        }
        if (this.showPagination()) {
            const pagination = this.getNativeElement().getElementsByTagName('ngb-pagination');
            if (pagination[0] && pagination[0].children[0]) {
                tBodyStyle['bottom'] = (pagination[0].children[0].clientHeight + 2) + 'px';
                this.renderer.setStyle(pagination[0].children[0], 'margin-bottom', '0');
                this.renderer.setStyle(pagination[0].children[0], 'position', 'absolute');
                this.renderer.setStyle(pagination[0].children[0], 'bottom', '0');
                this.computeTableHeight();
            }
        }

        for (const p in tBodyStyle) {
            if (tBodyStyle.hasOwnProperty(p)) {
                this.renderer.setStyle(tBodyEl, p, tBodyStyle[p]);
            }
        }
        this.renderer.setStyle(this.viewPort.elementRef.nativeElement, 'height', tBodyEl['clientHeight'] + 'px');
        this.viewPort.checkViewportSize();
    }


    getTHeadStyle() {
        const tHeadStyle = {};
        if (this.enableSort || this.onHeaderClick) {
            tHeadStyle['cursor'] = 'pointer';
        }
        tHeadStyle['left'] = -this.getNativeElement().getElementsByTagName('table')[0].scrollLeft + 'px';
        return tHeadStyle;
    }

    updateTableColumnStyleClass(columnIndex: number, style: any) {
        if (!this.columnCSSRules[columnIndex]) {
            const clsName = '#table_' + this.servoyApi.getMarkupId() + ' .c' + columnIndex;
            if (!this.columnCSSRules[columnIndex]) {
                if (!this.targetStyleSheet) {
                    const elem = this.doc.createElement('style');
                    elem.type = 'text/css';
                    this.doc.getElementsByTagName('head')[0].appendChild(elem);
                    this.targetStyleSheet = this.doc.styleSheets[this.doc.styleSheets.length - 1] as CSSStyleSheet;
                }
                const rules = this.targetStyleSheet.cssRules || this.targetStyleSheet.rules;
                this.targetStyleSheet.insertRule(clsName + '{}', rules.length);
                this.columnCSSRules[columnIndex] = rules[rules.length - 1];
                this.columnCSSRules[columnIndex].style['height'] = this.minRowHeight;
            }
        }

        for (const p in style) {
            if (style.hasOwnProperty(p)) {
                this.columnCSSRules[columnIndex].style[p] = style[p];
            }
        }
    }

    onResizeEnd(event: ResizeEvent, columnIndex: number): void {
        window.clearTimeout(this.timeoutID);
        const headers = this.getNativeElement().getElementsByTagName('th');
        const newWidth = Math.floor(event.rectangle.width) + 'px';
        this.renderer.setStyle(headers[columnIndex], 'width', newWidth);
        this.renderer.setStyle(headers[columnIndex], 'min-width', newWidth);
        this.renderer.setStyle(headers[columnIndex], 'max-width', newWidth);
        this.updateTableColumnStyleClass(columnIndex, { width: newWidth, minWidth: newWidth, maxWidth: newWidth });
        const innerThis: ServoyExtraTable = this;
        this.timeoutID = window.setTimeout(() => {
            innerThis.onColumnResize(event);
            this.timeoutID = null;
        });
    }

    selectRow(idxInFs: number, event: MouseEvent) {
        let newSelection = [idxInFs];
        if (event.ctrlKey) {
            newSelection = this.foundset.selectedRowIndexes ? this.foundset.selectedRowIndexes.slice() : [];
            const idxInSelected = newSelection.indexOf(idxInFs);
            if (idxInSelected === -1) {
                newSelection.push(idxInFs);
            } else if (newSelection.length > 1) {
                newSelection.splice(idxInSelected, 1);
            }
        } else if (event.shiftKey) {
            let start = -1;
            if (this.foundset.selectedRowIndexes) {
                for (const j of Object.keys(this.foundset.selectedRowIndexes)) {
                    if (start === -1 || start > this.foundset.selectedRowIndexes[j]) {
                        start = this.foundset.selectedRowIndexes[j];
                    }
                }
            }
            let stop = idxInFs;
            if (start > idxInFs) {
                stop = start;
                start = idxInFs;
            }
            newSelection = [];
            for (let n = start; n <= stop; n++) {
                newSelection.push(n);
            }
        }
        this.scrollToSelectionNeeded = false; // we don't need to scroll to selection when we select a record by clicking on it
        this.foundset.selectedRowIndexes = newSelection;
        this.foundset.requestSelectionUpdate(newSelection);
    }

    onScroll() {
        if (!this.viewPort) return;
        if (this.onViewPortChanged) {
            this.onViewPortChanged(this.viewPort.getRenderedRange().start, this.viewPort.getRenderedRange().end);
        }
    }

    public setSelectedHeader(columnIndex: number) {
        if (this.onHeaderClick) {
            if (this.enableSort && (this.sortColumnIndex !== columnIndex)) {
                this.sortDirection = null;
            }
            this.headerClicked(columnIndex);
        } else {
            this.sortColumnIndex = columnIndex;
            this.doFoundsetSQLSort(this.sortColumnIndex);
        }
    }

    public getViewPortPosition(): number[] {
        if (!this.viewPort) return null;
        return [this.viewPort.getRenderedRange().start, this.viewPort.getRenderedRange().end];
    }

    public requestFocus(mustExecuteOnFocusGainedMethod: boolean) {
        const tbl = this.getNativeElement().getElementsByTagName('table')[0];
        this.skipOnce = mustExecuteOnFocusGainedMethod === false;
        tbl.focus();
    }

    showPagination() {
        return this.pageSize && this.foundset && (this.foundset.serverSize > this.pageSize || this.foundset.hasMoreRows);
    }

    modifyPage(page: number) {
        	this.paginationDisabled = true;
    	const innerThis: ServoyExtraTable = this;
    	const timeout = setTimeout( () => { 
    	    window.clearTimeout(timeout);
    		innerThis.paginationDisabled = false;
    		innerThis.cdRef.detectChanges();
    	}, 300);
        this.currentPage = page;
        this.changedPage = true;
        const startIndex = this.pageSize * (this.currentPage - 1);
        if (!this.goToPage(startIndex)) {
            if (this.prevPage < this.currentPage) {
                this.renderedRows.last.elRef.nativeElement.scrollIntoView();
            } else {
                this.renderedRows.first.elRef.nativeElement.scrollIntoView();
            }
            this.renderedRows.changes.pipe(first())
                .subscribe(() => {
                    this.goToPage(startIndex);
                });
        }
    }

    goToPage(startIndex: number) {
        this.viewPort.scrollToIndex(startIndex);
        return true;
    }

    getRowClass(idx: number) {
        let rowClass = '';
        if (this.foundset.selectedRowIndexes.indexOf(idx) > -1) {
            rowClass += 'table-servoyextra-selected ';
        }
        if (this.rowStyleClassDataprovider) {
            rowClass += this.rowStyleClassDataprovider[idx % this.pageSize];
        }
        return rowClass;
    }

    getColumnClass(column : Column, idx: number) {
        let columnClass = '';
        if (column.styleClass) {
            columnClass += column.styleClass + ' ';
        }
        if (column.styleClassDataprovider) {
            let columnDP = column.styleClassDataprovider[idx];
            if (columnDP)
            {
                 columnClass += columnDP;
            }
           
        }
        return columnClass;
    }
    
    keypressed(event: KeyboardEvent) {
        const fs = this.foundset;
        if (fs.selectedRowIndexes && fs.selectedRowIndexes.length > 0) {
            let selectionChanged = false;
            const oldSelectedIdxs = fs.selectedRowIndexes.slice();
            const selection = fs.selectedRowIndexes[0];
            if (event.key === 'PageUp') { // PAGE UP KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.pageUp) return;

                const firstVisibleIndex = this.showPagination() ? this.pageSize * Math.trunc(selection / this.pageSize) : 1;
                fs.selectedRowIndexes = [firstVisibleIndex];
                selectionChanged = (selection !== firstVisibleIndex);
                this.log.spam('svy extra table * keyPressed; scroll on PG UP');
                this.viewPort.scrollToIndex(firstVisibleIndex);
            } else if (event.key === 'PageDown') { // PAGE DOWN KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.pageDown) return;

                let lastVisibleIndex = this.showPagination() ? this.pageSize * (Math.trunc(selection / this.pageSize) + 1) - 1 : (this.foundset.viewPort.rows.length - 1);
                if (lastVisibleIndex > fs.serverSize - 1) lastVisibleIndex = fs.serverSize - 1;
                fs.selectedRowIndexes = [lastVisibleIndex];
                selectionChanged = (selection !== lastVisibleIndex);
                this.log.spam('svy extra table * keyPressed; scroll on PG DOWN');
                this.viewPort.scrollToIndex(lastVisibleIndex);
            } else if (event.key === 'ArrowUp') { // ARROW UP KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.arrowUp) return;

                if (selection > 0) {
                    fs.selectedRowIndexes = [selection - 1];
                    this.viewPort.scrollToIndex(selection - 1);
                    this.scrollToSelectionNeeded = false;
                    selectionChanged = true;
                }
                event.preventDefault();
            } else if (event.key === 'ArrowDown') { // ARROW DOWN KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.arrowDown) return;

                if (selection + 1 < (fs.viewPort.startIndex + fs.viewPort.size)) {
                    fs.selectedRowIndexes = [selection + 1];
                    this.viewPort.scrollToIndex(selection + 1);
                    this.scrollToSelectionNeeded = false;
                    selectionChanged = true;
                }
                event.preventDefault();
            } else if (event.key === 'Enter') { // ENTER KEY
                if (!this.keyCodeSettings.enter) return;
                if (this.onCellClick) {
                    this.onCellClick(selection + 1, null, fs.viewPort.rows[selection]);
                }
            } else if (event.key === 'Home') { // HOME
                if (this.keyCodeSettings && !this.keyCodeSettings.home) return;
                if (fs.selectedRowIndexes[0] !== 0) {
                    fs.selectedRowIndexes = [0];
                    this.viewPort.scrollToIndex(0);
                    selectionChanged = true;
                }
                event.preventDefault();
                event.stopPropagation();

            } else if (event.key === 'End') { // END
                if (this.keyCodeSettings && !this.keyCodeSettings.end) return;

                const endIndex = fs.viewPort.size - 1 + fs.viewPort.startIndex;
                if (fs.selectedRowIndexes[0] !== endIndex) {
                    fs.selectedRowIndexes = [endIndex];
                    selectionChanged = true;
                    this.scrollToSelectionNeeded = false;
                    this.viewPort.scrollToOffset(this.getNumberFromPxString(this.viewPort._totalContentHeight));
                    setTimeout(() => {
                        const last = this.viewPort._contentWrapper.nativeElement.lastElementChild;
                        last.scrollIntoView(false);
                    }, 100);
                }
                event.preventDefault();
                event.stopPropagation();
            }

            if (selectionChanged) {
                this.selectedRowIndexesChanged(oldSelectedIdxs);
            }
        }
    }
    
    isTrustedHTML(column: Column): boolean {
        if (this.servoyApi.trustAsHtml() || column.showAs === 'trusted_html') {
            return true;
        }
        return false;
    }

    getDisplayValue(column: Column, row: number) {
        const val = column.dataprovider ? column.dataprovider[row] : null;
        if (column.valuelist === undefined) return val;
        const valuelist: IValuelist = instanceOfValuelist(column.valuelist) ? column.valuelist : column.valuelist[row] as IValuelist;
        if (valuelist) {
            for (let i = 0; i < valuelist.length; i++) {
                if (val === valuelist[i].realValue) {
                    return valuelist[i].displayValue;
                }
            }
        }
        return val;
    }

    @HostListener('window:resize') onResize() {
        const tbody = this.elementRef !== undefined ? this.getNativeElement().getElementsByTagName('tbody') : undefined;
        if(tbody && tbody[0]) {
            const oldWidth = this.componentWidth;
            this.componentWidth = undefined;
            const deltaWidth = this.getComponentWidth() - oldWidth;
            this.updateTBodyStyle(tbody[0]);
            if (this.columns && deltaWidth !== 0) {
                if (this.columns && this.columns.length > 0) {
                    this.updateAutoColumnsWidth(deltaWidth);
                    for (let i = 0; i < this.columns.length; i++) {
                        this.columnStyleCache[i] = undefined;
                        this.updateTableColumnStyleClass(i, this.getColumnStyle(i));
                    }
                }
            }
        }
     }

    private foundsetChanged(event: FoundsetChangeEvent) {
        if (event.sortColumnsChanged) {
            this.sortColumnsChanged(event);
        }

        if (event.selectedRowIndexesChanged) {
            this.selectedRowIndexesChanged(event.selectedRowIndexesChanged.oldValue);
        }

        if (event.fullValueChanged || event.viewportRowsCompletelyChanged || event.viewportRowsUpdated) {
            let newVal: ViewPortRow[];
            if (event.fullValueChanged) newVal = event.fullValueChanged.newValue.viewPort.rows;
            if (event.viewportRowsCompletelyChanged) newVal = event.viewportRowsCompletelyChanged.newValue as ViewPortRow[];
            if (event.viewportRowsUpdated) newVal = this.foundset.viewPort.rows;
            this.dataStream.next([...newVal]);
        }
    }

    private setCurrentPageIfNeeded() {
        if (this.changedPage) {
            this.changedPage = false;
            return;
        }
        if (this.showPagination()) {
            if (this.pageSize > 0) {
                this.currentPage = Math.floor(this.idx / this.pageSize) + 1;
                this.cdRef.detectChanges();
            } else {
                window.setTimeout(() => {
                    this.setCurrentPageIfNeeded();
                }, 100);
            }
        }
    }

    private selectedRowIndexesChanged(oldValue: number[]) {
        if (this.foundset.selectedRowIndexes.length > 0) {
            if (this.foundset.selectedRowIndexes !== oldValue || this.lastSelectionFirstElement !== this.foundset.selectedRowIndexes[0]) {
                if (this.lastSelectionFirstElement !== this.foundset.selectedRowIndexes[0]) {
                    this.log.spam('svy extra table * selectedRowIndexes changed; scrollToSelectionNeeded = true');
                    if ((this.lastSelectionFirstElement - this.foundset.viewPort.startIndex) < this.viewPort.getRenderedRange().start ||
                        (this.lastSelectionFirstElement - this.foundset.viewPort.startIndex) > this.viewPort.getRenderedRange().end) {
                        this.loadMoreRecords(this.lastSelectionFirstElement, true);
                    } else {
                        this.lastSelectionFirstElement = this.foundset.selectedRowIndexes[0] + this.foundset.viewPort.startIndex;
                        if (this.scrollToSelectionNeeded) {
                            this.scrollToSelection();
                        } else {
                            this.scrollToSelectionNeeded = true;
                        }
                    }
                }
            }
        } else {
            this.lastSelectionFirstElement = -1;
        }
    }

    private sortColumnsChanged(event: FoundsetChangeEvent) {
        let sortSet = false;
        const sortColumnsA = event.sortColumnsChanged.newValue.split(/[\s,]+/);
        if (sortColumnsA.length >= 2) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].dataprovider && sortColumnsA[0] === this.columns[i].dataprovider.idForFoundset) {
                    this.sortColumnIndex = i;
                    this.sortDirection = sortColumnsA[1].toLowerCase() === 'asc' ? 'up' : 'down';
                    sortSet = true;
                    break;
                }
            }
        }
        if (!sortSet) {
            this.sortColumnIndex = -1;
            this.sortDirection = null;
        }
    }

    private scrollToSelection() {
        if (this.lastSelectionFirstElement !== -1) {
            if (this.viewPort.getDataLength() > 0) {
                if ((this.lastSelectionFirstElement - this.foundset.viewPort.startIndex) < this.viewPort.getRenderedRange().start ||
                    (this.lastSelectionFirstElement - this.foundset.viewPort.startIndex) > this.viewPort.getRenderedRange().end) {
                    this.loadMoreRecords(this.lastSelectionFirstElement, true);
                } else {
                    this.viewPort.scrollToOffset((this.lastSelectionFirstElement - this.foundset.viewPort.startIndex) * this.averageRowHeight);
                    this.currentPage = Math.floor(this.lastSelectionFirstElement / this.pageSize) + 1;
                    this.cdRef.detectChanges();
                }
            } else {
                window.setTimeout(() => {
                    // first time we need to wait a bit before we scroll
                    this.scrollToSelection();
                }, 400);
            }
        }
    }

    private computeTableHeight() {
        const tbody = this.getNativeElement().getElementsByTagName('tbody');
        if ( tbody && (tbody[0].scrollHeight > tbody[0].clientHeight && (this.scrollWidth === 0))) {
            this.scrollWidth = tbody[0].offsetWidth - tbody[0].clientWidth + 17;
        } else if (tbody && (tbody[0].scrollHeight <= tbody[0].clientHeight) && (this.scrollWidth > 0)) {
            this.scrollWidth = 0;
        }

        if (!this.servoyApi.isInAbsoluteLayout()) {
            this.renderer.setStyle(this.getNativeElement(), 'position', 'relative');

            const pagination = this.getNativeElement().getElementsByTagName('ngb-pagination');
            let paginationHeight = 0;
            if (pagination[0] && pagination[0].children[0]) {
                paginationHeight = pagination[0].children[0].clientHeight;
            }
            if (this.columns) {
                if (this.responsiveDynamicHeight) {
                if (this.responsiveHeight === 0) {
                         this.renderer.setStyle(this.getNativeElement(), 'height', '100%');
                         this.renderer.setStyle(this.viewPort._contentWrapper.nativeElement.parentElement, 'height', '100%');
                    } else {
                        const headerHeight = this.getNativeElement().getElementsByTagName('th')[0].getBoundingClientRect().height;
                        const h = this.renderedRows.reduce((a, b) => a + b.elRef.nativeElement.getBoundingClientRect().height, 0);
                        // the total height of the component including the header and the pagination
                        this.renderer.setStyle(this.getNativeElement(), 'height', h + headerHeight + paginationHeight + 'px');
                        this.renderer.setStyle(this.getNativeElement(), 'max-height', this.responsiveHeight + 'px');
                        // the height of the table body
                        this.renderer.setStyle(this.viewPort._contentWrapper.nativeElement.parentElement, 'height', Math.min(h, this.responsiveHeight - headerHeight - paginationHeight)  + 'px');
                        this.renderer.setStyle(this.viewPort._contentWrapper.nativeElement.parentElement, 'margin-bottom', paginationHeight + 'px');
                    }
                } else if (this.responsiveHeight === 0) {
                    this.renderer.setStyle(this.getNativeElement(), 'height', '100%');
                    this.renderer.setStyle(this.viewPort._contentWrapper.nativeElement.parentElement, 'height', (this.getNativeElement().clientHeight - paginationHeight) + 'px');
                } else {
                    this.renderer.setStyle(this.getNativeElement(), 'height', this.responsiveHeight + 'px');
                    this.renderer.setStyle(this.viewPort._contentWrapper.nativeElement.parentElement, 'height', (this.responsiveHeight - paginationHeight) + 'px');
                }
            }
        }
    }

    private foundsetRecordsChanged(unloaded?: boolean) {
        this.log.spam(this.log.buildMessage(() => 'svy extra table * RECORDS '+(unloaded? 'UNLOADED' : 'LOADED')+', start index '+this.foundset.viewPort.startIndex+', end index '+(this.foundset.viewPort.startIndex+this.foundset.viewPort.size)));
        let arr = [...this.foundset.viewPort.rows];
        if (this.foundset.viewPort.startIndex !== 0 || this.foundset.serverSize !== this.foundset.viewPort.rows.length) {
        	arr = new Array(this.foundset.serverSize).fill('');
        	for (let i = 0; i < this.foundset.viewPort.rows.length; i++) {
        		arr[i+this.foundset.viewPort.startIndex] = this.foundset.viewPort.rows[i];
        	}
        }
        this.dataStream.next(arr); //was [...this.foundset.viewPort.rows]);
    }
    private callFocusLost(e: any) {
        if (!this.skipOnce) {
            this.onFocusLostMethodID(e);
        }
        this.skipOnce = false;
    }

    private callFocusGained(e: any) {
        if (!this.skipOnce) {
            this.onFocusGainedMethodID(e);
        }
        this.skipOnce = false;
    }

    private headerClicked(i: number, event?: MouseEvent): void {
        this.onHeaderClick(i, this.sortDirection, event, this.columns[i].id)
            .then((ret: string) => {
                if (ret === 'override')
                    return;
                if (this.enableSort) {
                    this.doFoundsetSQLSort(i);
                }
            }, (reason: any) => {
                this.log.error(reason);
            });
    }
    private unloadRecordsIfNecessary() {
       if (this.foundset.viewPort.size <= this.performanceSettings.maxLoadedRows) return;
        const rec = this.foundset.viewPort.size - this.performanceSettings.maxLoadedRows - 1;
        if (rec <= 0) return;
        this.log.spam(this.log.buildMessage(() => 'svy extra table * UNLOADING '+ rec +' RECORDS '+(this.isScrollingDown ? 'from the beginning ':'at the end ')));
        // if scrolling down, load less records in the beginning; otherwise load less records at the end
        const promise = this.foundset.loadLessRecordsAsync(this.isScrollingDown ? rec : -rec, false);
        if (this.loading) {
            this.loading.then(()=>{
                promise.then(() => {
                    this.foundsetRecordsChanged(true);
                });
            })
        }
        else {
            promise.then(() => {
                this.foundsetRecordsChanged(true);
            });
        }
    }
}

export class Column extends BaseCustomObject {
    id: string;
    showAs: string;
    headerText: string;
    headerStyleClass: string;
    styleClass : string;
    styleClassDataprovider: LinkedDataproviders;
    dataprovider: LinkedDataproviders;
    autoResize: boolean;
    valuelist: IValuelist| Array<IValuelist>;
    width: string; 
    initialWidth: string; 
    format: Format; 
}

export class KeycodeSettings extends BaseCustomObject {
    arrowUp: boolean;
    arrowDown: boolean;
    end: boolean;
    enter: boolean;
    home: boolean;
    pageDown: boolean;
    pageUp: boolean;
}

class LinkedDataproviders extends Array<any>{
    idForFoundset : string;
}

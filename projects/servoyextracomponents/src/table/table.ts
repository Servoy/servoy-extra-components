import {
    Component, ViewChild, Input, Renderer2, ElementRef, OnDestroy, ChangeDetectorRef,
    ChangeDetectionStrategy, Directive, Inject, HostListener, SecurityContext, SimpleChanges
} from '@angular/core';
import { BaseCustomObject, Format, IFoundset, IValuelist, ServoyBaseComponent, ViewPortRow, FoundsetChangeEvent, ChangeType, FormattingService, ViewportRowUpdates, LogLevel } from '@servoy/public';
import { LoggerFactory, LoggerService } from '@servoy/public';
import { ResizeEvent } from 'angular-resizable-element';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[svyTableRow]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class TableRow {

    @Input() svyTableRow: number;

    constructor(public elRef: ElementRef) {
    }
}
const instanceOfValuelist = (obj: any): obj is IValuelist =>
    obj != null && (obj).filterList instanceof Function;


@Component({
    selector: 'servoyextra-table',
    templateUrl: './table.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraTable extends ServoyBaseComponent<HTMLDivElement> implements OnDestroy {

    @ViewChild('tbody', { static: false }) tbody: ElementRef<HTMLTableSectionElement>;
    @ViewChild('pager', { static: false }) pager: ElementRef<HTMLUListElement>;
    @ViewChild('table', { static: false}) tableRef: ElementRef<HTMLTableElement>;

    @Input() foundset: IFoundset;
    @Input() columns: Array<Column>;
    @Input() currentPage = 1;
    @Input() sortDirection: string;
    @Input() enableSort = true;
    @Input() sortStyleClass: string;
    @Input() sortdownClass = 'table-servoyextra-sort-down';
    @Input() sortupClass = 'table-servoyextra-sort-up';
    @Input() styleClass: string;
    @Input() selectionClass: string;
    @Input() horizontalScrollbar: string;
    @Input() minRowHeight: any;
    @Input() enableColumnResize: boolean;
    @Input() pageSize: number;
    @Input() rowStyleClassDataprovider: IFoundset;
    @Input() tabSeq: number;
    @Input() responsiveHeight: number;
    @Input() responsiveDynamicHeight: boolean;
    @Input() lastSelectionFirstElement: number;
    @Input() keyCodeSettings: KeycodeSettings;
    @Input() enableMobileView: boolean;
    @Input() performanceSettings: {
        minBatchSizeForRenderingMoreRows: number; minBatchSizeForLoadingMoreRows: number; maxLoadedRows: number;
        maxRenderedRows: number; fastScrollRenderThresholdFactor: number; fastScrollLoadThresholdFactor: number;
    };

    @Input() onViewPortChanged: (start: number, end: number) => void;
    @Input() onCellClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() onCellDoubleClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() onCellRightClick: (rowIdx: number, colIdx: number, record?: ViewPortRow, e?: MouseEvent, columnId?: string) => void;
    @Input() onHeaderClick: (colIdx: number, sortDirection: string, e?: MouseEvent, columnId?: string) => Promise<string>;
    @Input() onHeaderRightClick: (colIdx: number, sortDirection: string, e?: MouseEvent, columnId?: string) => void;
    @Input() onColumnResize: (event: Event) => void;
    @Input() onFocusGainedMethodID: (event: Event) => void;
    @Input() onFocusLostMethodID: (event?: Event) => void;

    private skipOnce = false;
    private log: LoggerService;
    private sortColumnIndex = -1;
    // RENDERED bounds (relative to foundset start (so not to any viewport)): the rendered rows are actually present in DOM with all data in them;
    // rendered rows can be only a part of the LOADED viewport (so what model.foundset.viewport has);
    private renderedStartIndex = 0;
    // the number rendered rows
    private renderedSize = -1;
    private componentWidth = -1;
    private autoColumns: { columns: Array<boolean>; minWidth: Array<number>; autoResize: Array<boolean>; count: number };
    private tableWidth: number;
    private scrollWidth = 0;
    private tableLeftOffset = 0;
    private timerID: any;
    private _isPaginationVisible = false;
    private currentSortClass = [];
    private sortClassUpdateTimer: any;
    private columnStyleCache = [];
    private topSpaceDiv: HTMLDivElement;
    private bottomSpaceDiv: HTMLDivElement;
    private oldAverageRowHeight: number;
    private toBottom = false;
    private scrollToSelectionNeeded = false;
    private loadingRecordsPromise: Promise<any>;
    // the number of rows to render in a batch (it renders one batch then when needed renders one more batch on top or bottom and so on)
    // this should be set to at least the UI viewPort when we start calculating that
    private batchSizeForRenderingMoreRows: number;
    // the number of extra rows to be loaded (before/after) if the rendered rows get too close to the loaded rows bounds when scrolling
    // when you change this initial value please update the .spec as well - config option "initialPreferredViewPortSize" on the foundset property should match getInitialPreferredLoadedSize
    private batchSizeForLoadingMoreRows: number;
    // some coefficients that decide the batch sizes for rendering and loading based on visible area row count; we can play with these to see if we can have a smoother scroll feeling
    private magicRenderBatchQ = 1.5;
    private magicLoadBatchQ = 3;
    private needToUpdateAutoColumnsWidth = false;
    private columnStyleClasses: Array<string> = [];
    private columnCSSRules: Array<CSSStyleRule> = [];
    private onTBodyScrollListener: () => void;
    private extraWidth: number;
    private extraWidthColumnIdx: number;
    private currentIdForFoundset: Array<string> = [];
    private currentColumnLength: number;
    private resizeTimeout: any;
    private templateTimeout: any;

    private layoutStyle: { height?: string; maxHeight?: string; position?: string } = {};
    private tableStyle: { width?: string } = {};
    private tHeadStyle: { cursor?: string; left?: string } = {};

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, logFactory: LoggerFactory, private sanitizer: DomSanitizer,
        @Inject(DOCUMENT) private doc: Document, private formatter: FormattingService) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('Table');
//        this.log.logLevel = this.log.logLevel = LogLevel.DEBUG;
    }

    @HostListener('window:resize', ['$event'])
    windowResizeHandler() {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.tbody) {
                if (this.columns) {
                    const newComponentWidth = Math.floor(this.getNativeElement().clientWidth);
                    const deltaWidth = newComponentWidth - this.getComponentWidth();
                    if (deltaWidth !== 0) {
                        this.componentWidth = newComponentWidth;
                        this.updateTBodyStyle();
                        if (this.columns && this.columns.length > 0) {
                            this.updateAutoColumnsWidth(deltaWidth);
                            setTimeout(() => {
                                if (this.enableColumnResize) {
                                    this.addColResizable(true);
                                }
                                for (let i = 0; i < this.columns.length; i++) {
                                    this.updateTableColumnStyleClass(i, this.getCellStyle(i));
                                }
                                this.cdRef.detectChanges();
                            }, 0);
                        }
                    }

                    // see if more rows need to be rendered due to resize
                    if (this.updateBatchSizesIfNeeded(this.getAverageRowHeight())) {
                        this.adjustLoadedRowsIfNeeded();
                        this.updateRenderedRows(null);
                    }
                    this.cdRef.detectChanges();
                }
            }
        }, 50);
    }

    svyOnInit() {
        super.svyOnInit();
        this.performanceSettings = this.performanceSettings ? this.performanceSettings : {
            minBatchSizeForRenderingMoreRows: 10,
            // by default don't allow too small caches even if the height of the table is very small; also limit the rendered rows and loaded rows to a big amount, but still limited
            minBatchSizeForLoadingMoreRows: 20,
            maxRenderedRows: 450,
            maxLoadedRows: 1000,
            fastScrollRenderThresholdFactor: 3.0,
            fastScrollLoadThresholdFactor: 2.3
        };

        if ('IntersectionObserver' in window) {
            const options = {
                root: this.getNativeElement() as Node,
            } as IntersectionObserver;
            new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (this.componentWidth === undefined) {
                            // first time show, call generateTemplate so the columns width are calculated
                            this.scheduelGenerateTemplate();
                        }
                        //                    else {
                        //                        // just force the element's :visible watch
                        //                        $scope.$digest();
                        //                    }
                    }
                });
            }, options).observe(this.tableRef.nativeElement);
        }

        this.setColumnsToInitalWidthAndInitAutoColumns();
        this.tableWidth = this.calculateTableWidth();
        // the number of rows to render in a batch (it renders one batch then when needed renders one more batch on top or bottom and so on)
        // this should be set to at least the UI viewPort when we start calculating that
        // this should be calculated for now this value is nicer for bigger list (that show already 20+ rows by default)
        this.batchSizeForRenderingMoreRows = Math.max(26, this.performanceSettings.minBatchSizeForRenderingMoreRows);
        // the number of extra rows to be loaded (before/after) if the rendered rows get too close to the loaded rows bounds when scrolling
        // when you change this initial value please update the .spec as well - config option "initialPreferredViewPortSize" on the foundset property should match getInitialPreferredLoadedSize
        // this should be higher then batchSizeForRenderingMoreRows because when we load more rows we should load enough to at least be able to render one more batch of rendered rows;
        // so when that one (batchSizeForRenderingMoreRows) is calculated adjust this one as well
        this.batchSizeForLoadingMoreRows = Math.max(52, this.performanceSettings.minBatchSizeForLoadingMoreRows);
        this.attachHandlers();
        if (this.foundset.viewPort.startIndex > 0) {
			this.setCurrentPage(this.getPageForIndex(this.foundset.viewPort.startIndex));
		}
    }

    svyOnChanges(changes: SimpleChanges) {
        super.svyOnChanges(changes);
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'columns': {
                        const newLength = this.columns ? this.columns.length : 0;
                        const differentColumns = this.currentColumnLength !== newLength;
                        let valueChanged = differentColumns;
                        let dataproviderChanged = false;
                        this.currentColumnLength = newLength;
                        if (!valueChanged) {
                            for (let i = 0; i < this.columns.length; i++) {
                                if (this.columns[i].dataprovider !== undefined &&
                                    ((this.columns[i].dataprovider.idForFoundset === undefined) || (this.currentIdForFoundset[i] !== this.columns[i].dataprovider.idForFoundset))) {
                                    dataproviderChanged = true;
                                }
                                this.currentIdForFoundset[i] = this.columns[i].dataprovider ? this.columns[i].dataprovider.idForFoundset : undefined;
                                const iw = this.getNumberFromPxString(this.columns[i].initialWidth);
                                if (iw > -1 && (this.columns[i].width !== this.columns[i].initialWidth)) {
                                    this.columns[i].initialWidth = this.columns[i].width;
                                    if (!valueChanged) valueChanged = true;
                                }
                            }
                        }

                        if (valueChanged || dataproviderChanged) {
                            this.setColumnsToInitalWidthAndInitAutoColumns();
                            this.tableWidth = this.calculateTableWidth();
                            if (this.columns && this.columns.length > 0) {
                                this.updateAutoColumnsWidth(0);
                                setTimeout(() => {
                                    if (this.enableColumnResize) {
                                        this.addColResizable(true);
                                    } else {
                                        for (let i = 0; i < this.columns.length; i++) {
                                            this.updateTableColumnStyleClass(i, this.getCellStyle(i));
                                        }
                                    }
                                    if (differentColumns) this.scheduelGenerateTemplate();
                                    if (dataproviderChanged) this.updateRenderedRows(null);

                                }, 0);
                            } else if (differentColumns && this.tbody) {
                                while (this.tbody.nativeElement.lastElementChild) {
                                    this.tbody.nativeElement.removeChild(this.tbody.nativeElement.lastElementChild);
                                }
                            }
                        }
                        // if the columns didn't change completely then test for the style class
                        if (!differentColumns) this.updateColumnStyleClass();
                        break;
                    }
                    case 'foundset': {
                        if (!this.servoyApi || this.servoyApi.isInDesigner()) return;
                        const oldValue = change.previousValue as IFoundset;
                        const newValue = change.currentValue as IFoundset;
                        if (oldValue !== newValue) {
                            // so not initial value && old value did have listener; unregister it
                            if (oldValue) oldValue.removeChangeListener(this.foundsetListener);
                            if (newValue) {
                                newValue.addChangeListener(this.foundsetListener); // either a value changed happened or it is the initial value of the watch; do register the listener
                                if (!oldValue) {
                                    // either old value was nothing (so it didn't have listeners that would already have been triggered (due to a full value change); just simulate a full value change)
                                    // or it is an initial value, which we do handle as a full change
                                    setTimeout(() => {
                                        const ch = {} as FoundsetChangeEvent;
                                        ch.fullValueChanged = { oldValue, newValue };
                                        this.foundsetListener(ch);
                                    });
                                }
                            }
                        }

                        break;
                    }
                    case 'currentPage': {
                        if (change.currentValue && change.currentValue !== change.previousValue) {
                            this.adjustLoadedRowsIfNeeded(); // load needed records from new page if needed
                        }
                        break;
                    }
                    case 'pageSize': {
                        if (!this.servoyApi || this.servoyApi.isInDesigner()) return;
                        if (change.previousValue !== change.currentValue) {
                            // start over with renderedSize
                            this.renderedSize = -1;
                            if (change.previousValue && change.currentValue && this.showPagination()) {
                                // page size has changed; try to show the page for which we have loaded records
                                this.setCurrentPage(this.getPageForIndex(this.foundset.viewPort.startIndex));
                                this.adjustLoadedRowsIfNeeded(); // load more rows if needed according to new page bounds
                            }
                        }
                        if (this.foundset) this.foundset.setPreferredViewportSize(this.getInitialPreferredLoadedSize());
                        break;
                    }
                }
            }
        }
    }

    attachHandlers() {
        if (this.onFocusGainedMethodID) {
            this.renderer.listen(this.tableRef.nativeElement, 'focus', e => {
                this.callFocusGained(e);
            });
        }

        if (this.onFocusLostMethodID) {
            this.renderer.listen(this.tableRef.nativeElement, 'blur', e => {
                this.callFocusLost(e);
            });
        }
        this.renderer.listen(this.tableRef.nativeElement, 'click', e => {
            this.tableClicked(e, 1);
        });
        if (this.onCellRightClick) {
            this.renderer.listen(this.tableRef.nativeElement, 'contextmenu', e => {
                this.tableClicked(e, 2);
            });
        }

        if (this.onCellDoubleClick) {
            this.renderer.listen(this.tableRef.nativeElement, 'dblclick', e => {
                this.tableClicked(e, 3);
            });
        }
    }

    onResizeColumnEnd(): void {
        if (this.onColumnResize) {
                this.onColumnResize(new CustomEvent('onColumnResize'));
        }
    }

    onResizeColumn(event: ResizeEvent, columnIndex: number): void {
        const headers = this.tableRef.nativeElement.getElementsByTagName('th');
        const newWidth = Math.floor(event.rectangle.width) + 'px';
        this.renderer.setStyle(headers[columnIndex], 'width', newWidth);
        this.renderer.setStyle(headers[columnIndex], 'min-width', newWidth);
        this.renderer.setStyle(headers[columnIndex], 'max-width', newWidth);
        this.updateTableColumnStyleClass(columnIndex, { width: newWidth, minWidth: newWidth, maxWidth: newWidth });
    }

    public keyPressed(event: KeyboardEvent) {
        const fs = this.foundset;
        if (fs.selectedRowIndexes && fs.selectedRowIndexes.length > 0) {
            let selectionChanged = false;
            const oldSelectedIdxs = fs.selectedRowIndexes.slice();
            const selection = fs.selectedRowIndexes[0];
            if (event.keyCode === 33) { // PAGE UP KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.pageUp) return;
                let child = this.getFirstVisibleChild();
                if (child) {
                    if (child.previousElementSibling) child = child.previousElementSibling;
                    const row_column = child.children.item(0)['row_column'];
                    if (row_column) {
                        this.foundset.requestSelectionUpdate([row_column.idxInFs]);
                        selectionChanged = (selection !== row_column.idxInFs);
                    }
                    this.log.debug('svy extra table * keyPressed; scroll on PG UP');
                    child.scrollIntoView(false);
                }
            } else if (event.keyCode === 34) { // PAGE DOWN KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.pageDown) return;
                let child = this.getLastVisibleChild();
                if (child) {
                    // if this is the last visible child we should get the child after that to make visible.
                    if (child.nextElementSibling) child = child.nextElementSibling;
                    const row_column = child.children.item(0)['row_column'];
                    if (row_column) {
                        this.foundset.requestSelectionUpdate([row_column.idxInFs]);
                        selectionChanged = (selection !== row_column.idxInFs);
                    }
                    this.log.debug('svy extra table * keyPressed; scroll on PG DOWN');
                    child.scrollIntoView(true);
                }
            } else if (event.keyCode === 38) { // ARROW UP KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.arrowUp) return;
                if (selection > 0) {
                    this.foundset.requestSelectionUpdate([selection - 1]);
                    if ((fs.viewPort.startIndex) <= selection - 1) {
                        this.toBottom = false;
                    } else this.modifyPage(-1);
                    selectionChanged = true;
                }
                event.preventDefault();
            } else if (event.keyCode === 40) { // ARROW DOWN KEY
                if (this.keyCodeSettings && !this.keyCodeSettings.arrowDown) return;
                if (selection < fs.serverSize - 1) {
                    this.foundset.requestSelectionUpdate([selection + 1]);
                    if ((fs.viewPort.startIndex + fs.viewPort.size) > selection + 1) {
                        this.toBottom = true;
                    } else this.modifyPage(1);
                    selectionChanged = true;
                }
                event.preventDefault();
            } else if (event.keyCode === 13) { // ENTER KEY
                if (!this.keyCodeSettings.enter) return;
                if (this.onCellClick) {
                    this.onCellClick(selection + 1, null, fs.viewPort.rows[selection]);
                }
            } else if (event.keyCode === 36) { // HOME
                if (this.keyCodeSettings && !this.keyCodeSettings.home) return;
                const allowedBounds = this.calculateAllowedLoadedDataBounds();
                if (fs.viewPort.startIndex > allowedBounds.startIdx) { // see if we have the first record loaded
                    function loadFirstRecordsIfNeeded() {
                        // this can be executed delayed, after pending loads finish, so do check again if we still need to load bottom of foundset
                        if (fs.viewPort.startIndex > allowedBounds.startIdx) {
                            const newLoadPromise = this.foundset.loadRecordsAsync(allowedBounds.startIdx, Math.min(allowedBounds.size, this.getInitialPreferredLoadedSize()));
                            newLoadPromise.then(() => {
                                this.runWhenThereIsNoPendingLoadRequest(loadFirstRecordsIfNeeded);
                            });
                            return newLoadPromise;
                        } else if (allowedBounds.size > 0) fs.requestSelectionUpdate([allowedBounds.startIdx]).then(() => {
                            this.scrollToSelectionNeeded = true; /* just in case selection was already on first */
                        });
                    }
                    this.runWhenThereIsNoPendingLoadRequest(loadFirstRecordsIfNeeded);
                } else if (allowedBounds.size > 0) {
                    if (selection !== allowedBounds.startIdx) fs.requestSelectionUpdate([allowedBounds.startIdx]);
                    else {
                        // selection did not change but we still need to scroll to it
                        this.scrollToSelectionNeeded = true;
                        this.scrollToSelectionIfNeeded();
                    }
                }

                event.preventDefault();
                event.stopPropagation();
            } else if (event.keyCode === 35) { // END
                if (this.keyCodeSettings && !this.keyCodeSettings.end) return;
                const allowedBounds = this.calculateAllowedLoadedDataBounds();
                if (fs.viewPort.startIndex + fs.viewPort.size < allowedBounds.startIdx + allowedBounds.size) { // see if we already have the last record loaded or not
                    const loadLastRecordsIfNeeded = () => {
                        // this can be executed delayed, after pending loads finish, so do check again if we still need to load bottom of foundset
                        if (fs.viewPort.startIndex + fs.viewPort.size < allowedBounds.startIdx + allowedBounds.size) {
                            const firstIndexToLoad = Math.max(allowedBounds.startIdx, allowedBounds.startIdx + allowedBounds.size - this.getInitialPreferredLoadedSize());
                            const newLoadPromise = this.foundset.loadRecordsAsync(firstIndexToLoad, allowedBounds.startIdx + allowedBounds.size - firstIndexToLoad);
                            newLoadPromise.then(() => {
                                // just in case server side foundset was not fully loaded and now that we accessed last part of it it already loaded more records
                                this.runWhenThereIsNoPendingLoadRequest(loadLastRecordsIfNeeded);
                            });
                            return newLoadPromise;
                        } else fs.requestSelectionUpdate([allowedBounds.startIdx + allowedBounds.size - 1]).then(() => {
                            this.scrollToSelectionNeeded = true; /* just in case selection was already on first */
                        });
                        return null;
                    };
                    this.runWhenThereIsNoPendingLoadRequest(loadLastRecordsIfNeeded);
                } else if (allowedBounds.size > 0) {
                    if (selection !== allowedBounds.startIdx + allowedBounds.size - 1) fs.requestSelectionUpdate([allowedBounds.startIdx + allowedBounds.size - 1]);
                    else {
                        // selection did not change but we still need to scroll to it
                        this.scrollToSelectionNeeded = true;
                        this.scrollToSelectionIfNeeded();
                    }
                }

                event.preventDefault();
                event.stopPropagation();
            }

            if (selectionChanged) {
                this.selectedIndexesChanged(fs.selectedRowIndexes, oldSelectedIdxs);
            }
        }
    }

    public hasNext() {
        return this.foundset && (this.currentPage < Math.ceil(this.foundset.serverSize / this.pageSize) || this.foundset.hasMoreRows);
    }

    public isPaginationVisible() {
        const isPaginationVisibleNew = this.showPagination();
        if (this._isPaginationVisible !== isPaginationVisibleNew) {
            this._isPaginationVisible = isPaginationVisibleNew;
            setTimeout(() => {
                if (this.tbody) {
                    if (this.showPagination()) {
                        if (this.pager) {
                            this.tbody.nativeElement.style['marginBottom'] = (this.pager.nativeElement.clientHeight + 2) + 'px';
                        }
                    } else {
                        this.tbody.nativeElement.style['marginBottom'] = '';
                    }
                }
            }, 0);
        }
        return this._isPaginationVisible;
    }

    public modifyPage(count: number) {
        const pages = Math.ceil(this.foundset.serverSize / this.pageSize);
        const newPage = this.currentPage + count;
        if (newPage >= 1 && (newPage <= pages || this.foundset.hasMoreRows)) {
            this.setCurrentPage(newPage);
        }
        return false;
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
            if (this.sortClassUpdateTimer) clearTimeout(this.sortClassUpdateTimer);
            this.sortClassUpdateTimer = setTimeout(() => {
                if (this.tbody) this.updateTBodyStyle();
            }, 50);
            this.currentSortClass[column] = sortClass;
        }
        return sortClass;
    }

    public getSortStyleClass(column: number) {
        let lv_styles = '';
        if (this.enableSort) {
            if ((this.sortColumnIndex === -1 &&
                column === 0) ||
                this.sortColumnIndex === column) {
                lv_styles = this.sortStyleClass;
            }
        }
        return lv_styles + ' ' + this.columns[column].headerStyleClass;
    }

    public getColumnStyle(column: number) {
        let columnStyle = this.columnStyleCache[column];
        if (!this.autoColumns) return columnStyle;
        if (columnStyle) return columnStyle;
        columnStyle = { overflow: 'hidden' };
        this.columnStyleCache[column] = columnStyle;
        const w = this.getNumberFromPxString(this.columns[column].width);
        if (w > -1) {
            columnStyle.minWidth = columnStyle.maxWidth = columnStyle.width = w + 'px';
        } else if (this.columns[column].width && (this.columns[column].width) !== 'auto') {
            columnStyle.width = this.columns[column].width;
        } else {
            const autoColumnPercentage = this.getAutoColumnPercentage();
            if (autoColumnPercentage) {
                columnStyle.width = autoColumnPercentage + '%';
            } else {
                columnStyle.minWidth = columnStyle.maxWidth = columnStyle.width = Math.floor((this.getComponentWidth() - this.tableWidth - this.scrollWidth) / this.autoColumns.count) + 'px';
            }
        }
        return columnStyle;
    }
    public getLayoutStyle() {
        if (this.servoyApi.isInAbsoluteLayout()) { // TODO can we always rely on the fact that $parent is the one to look at?
            this.layoutStyle.position = 'absolute';
            this.layoutStyle.height = '100%';
        } else {
            this.layoutStyle.position = 'relative';
            if (this.columns) {
                if (this.responsiveDynamicHeight) {
                    let h = 0;
                    const p = this.pager ? this.pager.nativeElement : null;
                    if (p) {
                        h += p.clientHeight;
                    }
                    const rows = this.getNativeElement() ? this.getNativeElement().querySelectorAll('tr') : null;
                    for (let i = 0; rows && i < rows.length; i++) {
                        h += rows.item(i).clientHeight;
                        if (h > this.responsiveHeight) {
                            break;
                        }
                    }
                    if (this.responsiveHeight === 0) {
                        //                            $element.css("height", "100%");
                        this.layoutStyle.height = 100 + '%';
                    } else {
                        this.layoutStyle.height = h + 'px';
                        this.layoutStyle.maxHeight = this.responsiveHeight + 'px';
                    }
                } else {
                    if (this.responsiveHeight === 0) {
                        //                            $element.css("height", "100%");
                        this.layoutStyle.height = 100 + '%';
                    } else {
                        this.layoutStyle.height = this.responsiveHeight + 'px';
                    }
                }

            }
        }
        return this.layoutStyle;
    }

    public getTableStyle() {
        if (!this.autoColumns) return this.tableStyle;
        this.tableStyle.width = this.autoColumns.count > 0 ? this.getComponentWidth() + 'px' : this.tableWidth + 'px';
        return this.tableStyle;
    }

    public getTHeadStyle() {
        if (this.enableSort || this.onHeaderClick) {
            this.tHeadStyle.cursor = 'pointer';
        }
        this.tHeadStyle.left = this.tableLeftOffset + 'px';
        return this.tHeadStyle;
    }

    public tableClicked(event: MouseEvent, type: number) {
        const elements = this.doc.querySelectorAll(':hover');
        for (let i = elements.length; --i > 0;) {
            const row_column = elements[i]['row_column'];
            if (row_column) {
                const columnIndex = row_column.column;
                const columnId = row_column.id;
                const idxInFs = row_column.idxInFs;
                const idxInViewport = this.getViewportIndexFromFoundsetIndex(idxInFs);
                let newSelection = [idxInFs];
                //                   if($scope.model.foundset.multiSelect) {
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
                        for (const index of this.foundset.selectedRowIndexes) {
                            if (start === -1 || start > index) {
                                start = index;
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
                //                   }
                if (!newSelection.every(value => this.foundset.selectedRowIndexes.includes(value)))
                    this.foundset.requestSelectionUpdate(newSelection);
                if (type === 1 && this.onCellClick) {
                    if (this.onCellDoubleClick) {
                        if (this.timerID) {
                            clearTimeout(this.timerID);
                            this.timerID = null;
                            //double click, do nothing
                        } else {
                            this.timerID = setTimeout(() => {
                                this.timerID = null;
                                this.onCellClick(idxInFs + 1, columnIndex, this.foundset.viewPort.rows[idxInViewport], event, columnId);
                            }, 250);
                        }
                    } else {
                        this.onCellClick(idxInFs + 1, columnIndex, this.foundset.viewPort.rows[idxInViewport], event, columnId);
                    }
                }

                if (type === 2 && this.onCellRightClick) {
                    this.onCellRightClick(idxInFs + 1, columnIndex, this.foundset.viewPort.rows[idxInViewport], event, columnId);
                }

                if (type === 3 && this.onCellDoubleClick) {
                    this.onCellDoubleClick(idxInFs + 1, columnIndex, this.foundset.viewPort.rows[idxInViewport], event, columnId);
                }
            }
        }
    }

    public headerRightClicked = function(event: Event, columnIndex: number) {
        if (this.onHeaderRightClick) {
            this.onHeaderRightClick(columnIndex, this.sortDirection, event, this.columns[columnIndex]['id']);
        }
    };

    public headerClicked(event: MouseEvent, columnIndex: number) {
        if (this.onHeaderClick) {
            if (this.enableSort && (this.sortColumnIndex !== columnIndex)) {
                this.sortDirection = null;
            }
            this.onHeaderClick(columnIndex, this.sortDirection, event, this.columns[columnIndex]['id']).then((ret) => {
                if (ret === 'override')
                    return;
                if (this.enableSort) {
                    this.sortColumnIndex = columnIndex;
                    this.sortDirection = ret;
                    if (!this.sortDirection) {
                        this.doFoundsetSQLSort(this.sortColumnIndex);
                    }
                }
            }, function(reason) {
                this.log.error(reason);
            });
        } else if (this.enableSort) {
            this.sortColumnIndex = columnIndex;
            this.doFoundsetSQLSort(this.sortColumnIndex);
        }

    }

    // api
    public requestFocus(mustExecuteOnFocusGainedMethod: boolean) {
        const tbl = this.tableRef.nativeElement;
        this.skipOnce = mustExecuteOnFocusGainedMethod === false;
        tbl.focus();
    }

    public getViewPortPosition(): number[] {
        const visibleArea = this.getVisibleArea();
        const vpStart = visibleArea[0];
        const vpEnd = visibleArea[0] + visibleArea[1];
        return [vpStart, vpEnd];
    }

    public setSelectedHeader(columnIndex: number) {
        this.headerClicked(null, columnIndex);
    }

    private setColumnsToInitalWidthAndInitAutoColumns() {
        const newAutoColumns: { columns: Array<boolean>; minWidth: Array<number>; autoResize: Array<boolean>; count: number } =
            { columns: [], minWidth: [], autoResize: [], count: 0 };
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
    }

    private foundsetListener = (foundsetChanges: FoundsetChangeEvent) => {
        // really update the UI after all incoming changes from server have been applied;
        // so that we give a change to foundSet-linked column properties (DPs, ...) to get updated as well;
        // if this was called by the 'model.foundset' watch below, then we aren't in an incoming message handling cycle so
        // addIncomingMessageHandlingDoneTask will execute the task right away
        //            $webSocket.addIncomingMessageHandlingDoneTask(function() {
        if (!this.foundset) return; // should never happen
        // this probably means that the foundset listener was called but the same message from server also has hidden the form
        //                if (!$.contains(document, $element[0]) || $scope.$$destroyed) return;
        // => so now that this IncomingMessageHandlingDoneTask is called we can just ignore it as it's no longer relevant (directive/scope destroyed)

        let shouldCheckSelection = false;
        let oldSelectedIdxs: Array<number>;
        let shouldGenerateWholeTemplate = false;
        if (foundsetChanges.fullValueChanged) {
            // full foundSet update (changed by reference); start over, see if we need to scroll to selection
            shouldCheckSelection = true;
            shouldGenerateWholeTemplate = true;
        } else {
            // more granular changes; see exactly what changed
            if (foundsetChanges.selectedRowIndexesChanged) {
                // full foundSet or viewport update (one or the other changed by reference); start over with renderedSize
                shouldCheckSelection = true;
                oldSelectedIdxs = foundsetChanges.selectedRowIndexesChanged.oldValue;
            }
            if (foundsetChanges.viewportRowsCompletelyChanged) {
                // full foundSet or viewport update (one or the other changed by reference); start over with renderedSize
                shouldGenerateWholeTemplate = true;
            }
        }

        // check selection first, before doing anything else that calls adjustLoadedRowsIfNeeded (like code executed when 'model.foundset.serverSize' changes for example)
        // because it needs to adjust current page first in order to avoid adjustLoadedRowsIfNeeded loading rows for an outdated page
        if (shouldCheckSelection) {
            // ignore value change triggered by the watch initially with the same value except for when it was a form re-show and the selected index changed meanwhile
            const selectedIdxs = this.foundset.selectedRowIndexes;
            if (!oldSelectedIdxs) oldSelectedIdxs = selectedIdxs; // initial value of the foundset then, not a change, so old = new
            this.selectedIndexesChanged(selectedIdxs, oldSelectedIdxs, !foundsetChanges.userSetSelection);
        }

        if (shouldGenerateWholeTemplate) this.scheduelGenerateTemplate();
        else {
            if (foundsetChanges.viewportRowsUpdated) {
                this.adjustLoadedRowsIfNeeded();
                const oldStartIndex = (foundsetChanges.viewPortStartIndexChanged ? foundsetChanges.viewPortStartIndexChanged.oldValue : undefined);
                const oldSize = (foundsetChanges.viewPortSizeChanged ? foundsetChanges.viewPortSizeChanged.oldValue : undefined);
                this.updateRenderedRows({ rowUpdates: foundsetChanges.viewportRowsUpdated, oldStartIndex, oldSize });
            } else {
                if (foundsetChanges.serverFoundsetSizeChanged) {
                    this.adjustLoadedRowsIfNeeded(); // load more if available and needed, or decrease page in case current page no longer exists
                    this.updateTopAndBottomEmptySpace();
                }

                if (foundsetChanges.viewPortStartIndexChanged) {
                    // handle a situation where only startIndex and server size got updated due to a delete of rows before the currently loaded viewport,
                    // when the viewport is at the end of the foundset; we check if the foundset index stored in rows matches the new indexes
                    // to avoid calling update if it was only a normal viewport change
                    const vp = this.foundset.viewPort;
                    if (this.renderedStartIndex < vp.startIndex || this.renderedStartIndex + this.renderedSize > vp.startIndex + vp.size) {
                        this.updateRenderedRows(null);
                    }
                }
            }
        }

        if (foundsetChanges.sortColumnsChanged) {
            let sortSet = false;
            if (foundsetChanges.sortColumnsChanged.newValue) {
                const sortColumnsA = this.foundset.sortColumns.split(/[\s,]+/);
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
            }
            if (!sortSet) {
                this.sortColumnIndex = -1;
                this.sortDirection = null;
            }
        }
        return;
        //            });
    };

    // func gets called if there is no pending load in progress, otherwise delayedFunc will get called after load-in-progress is done;
    // delayedFunc is optional; if not specified, func will be used even if it has to wait for a pending promise to complete;
    // func/delayedFunc can return another new pending load promise, if it requested another load while executing; this load will delay further any other pending executions
    private runWhenThereIsNoPendingLoadRequest(func: () => Promise<any>, delayedFunc?: () => void) {
        // if we are already in the process of loading records from server, wait for it to be done/resolved
        // before making more load requests; see comment on loadingRecordsPromise declaration
        let fToExec: () => Promise<any> = func;

        const checkLoadingAndRun = () => {
            //if ($log.debugEnabled && $log.debugLevel === $log.SPAM) $log.debug("svy extra table * runWhenThereIsNoPendingLoadRequest checkLoadingAndRun()");
            if (!this.loadingRecordsPromise) {
                const newLoadingRecordsPromise = fToExec(); // the function can return another promise if it did a new loadXYZ request on foundset property
                // but fToExec might also call inside it another runWhenThereIsNoPendingLoadRequest that will execute right away
                // and might have set the loadingRecordsPromise already; we don't want that one to get lost
                if (!this.loadingRecordsPromise) this.loadingRecordsPromise = newLoadingRecordsPromise;
                else if (this.loadingRecordsPromise !== newLoadingRecordsPromise && newLoadingRecordsPromise)
                    // eslint-disable-next-line max-len
                    this.log.warn('svy extra table * runWhenThereIsNoPendingLoadRequest - it seems that one of the functions both executed call(s) to runWhenThereIsNoPendingLoadRequest that sets a new promise as well as returned a different promise - the returned promise will be ignored...'); // this else should never happen in how it is used here in table.js
                if (this.loadingRecordsPromise) return this.loadingRecordsPromise.finally(() => {
                    // when we are done loading stuff, clear the promise so we know we aren't waiting for a load;
                    // (hmm here we rely on finally blocks that are registered on the same promise being called in the order they in which they were registered
                    //  (so undefined is set before any new fToExec that was waiting can set it to the new value))
                    this.loadingRecordsPromise = undefined;
                });
            } else {
                // probably more functions were waiting to exec after previous load and one of the others already executed and requested another load... so wait for the new load
                return this.loadingRecordsPromise.finally(checkLoadingAndRun);
            }
            return null;
        };

        if (this.loadingRecordsPromise && delayedFunc) fToExec = delayedFunc as () => Promise<any>;
        return checkLoadingAndRun();
    }

    private scrollToSelectionIfNeeded() {
        if (!this.tbody || !this.scrollToSelectionNeeded) return;

        // we do not scroll to selection if there is no selected record (serverSize is probably 0) or we have multi-select with more then one or 0 selected records
        const firstSelected = this.foundset.selectedRowIndexes.length === 1 ? this.foundset.selectedRowIndexes[0] : -1;

        if (firstSelected >= 0) {
            // we must scroll to selection; see if we need to load/render other records in order to do this
            if (this.showPagination() && this.getPageForIndex(firstSelected) !== this.currentPage) {
                // we need to switch page in order to show selected row
                this.setCurrentPage(this.getPageForIndex(firstSelected));
            }

            // check if the selected row is in the current ui viewport.
            if (this.tbody.nativeElement.children.length - (this.topSpaceDiv ? 1 : 0) - (this.bottomSpaceDiv ? 1 : 0) > 0 &&
                (firstSelected < this.renderedStartIndex || firstSelected >= (this.renderedStartIndex + this.renderedSize))) {
                // it's not in the current rendered viewport, check if it is in the current data viewport
                const vp = this.foundset.viewPort;
                if (firstSelected < vp.startIndex || firstSelected >= (vp.startIndex + vp.size)) {
                    this.runWhenThereIsNoPendingLoadRequest(() => {
                        // selection is not inside the viewport, request another viewport around the selection.
                        const allowedBounds = this.calculateAllowedLoadedDataBounds(); // { startIdx, size }
                        const allowedStart = allowedBounds.startIdx;
                        const allowedSize = allowedBounds.size;

                        // center on the selection if possible, if not try to load 'getInitialPreferredLoadedSize()' anyway in total
                        const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(firstSelected, 0, allowedStart, allowedSize, this.getInitialPreferredLoadedSize());
                        const neededVpStart = computedInterval[0];
                        const neededVpSize = computedInterval[1];

                        this.log.debug(this.log.buildMessage(() => 'svy extra table * scrollToSelectionIfNeeded will do what is needed to have new loaded viewport of ('
                            + neededVpStart + ', ' + neededVpSize + ')'));
                        const newLoadPromise = this.smartLoadNeededViewport(neededVpStart, neededVpSize);
                        newLoadPromise.then(() => {
                            this.updateRenderedRows(null);
                        });

                        return newLoadPromise;
                    }, this.scrollToSelectionIfNeeded);
                } else {
                    this.updateRenderedRows(null); // this will center rendered rows and scroll position change might load more needed records around the already-present selected row
                }
            } else {
                // really scroll to selection; it should be already there
                const firstSelectedRelativeToRendered = firstSelected - this.renderedStartIndex;

                // eq negative idx is interpreted as n'th from the end of children list
                const child = (firstSelectedRelativeToRendered >= 0 ? this.tbody.nativeElement.children.item(firstSelectedRelativeToRendered +
                    (this.topSpaceDiv ? 1 : 0)) : undefined) as HTMLElement;
                if (child) {
                    const wrapperRect = this.tbody.nativeElement.getBoundingClientRect();
                    const childRect = child.getBoundingClientRect();
                    if (Math.floor(childRect.top) < Math.floor(wrapperRect.top) || Math.floor(childRect.bottom) > Math.floor(wrapperRect.bottom)) {
                        this.scrollIntoView(child, this.tbody.nativeElement, !this.toBottom);
                    }
                    this.scrollToSelectionNeeded = false; // now reset the flag so that it is only set back to true on purpose
                    this.log.debug('svy extra table * scrollToSelectionIfNeeded; scroll done, scrollToSelectionNeeded = false');
                }
            }
        }

    }

    // changes is something like { rowUpdates: rowUpdates, oldStartIndex: oldStartIndex, oldSize : oldSize }
    private updateRenderedRows(changes: { rowUpdates: ViewportRowUpdates; oldStartIndex: number; oldSize: number }, offset?: number) {
        this.log.debug(this.log.buildMessage(() => 'svy extra table * updateRenderedRows called with: ' + JSON.stringify(changes) + ', ' + JSON.stringify(offset)));
        if (!this.tbody) return;

        let children = this.tbody.nativeElement.children; // contains rendered rows + optionally the top empty space and bottom empty space rows
        let childrenListChanged = false;
        let startIndex = 100000000; // starting point where rows need to be updated relative to new rendered/UI viewport
        let endIndex = 0; // end index of rows to be updated relative to new rendered/UI viewport
        let newRowsToBeRenderedBefore = 0; // number of rows to be added/rendered before previously rendered ones
        let rowOffSet = offset ? offset : 0; // offset of renderedStartIndex in/relative to model.foundset.viewport

        let childIdxToScrollTo = -1; // relative to rendered rows
        let scrollTopToKeep = -1;
        let alignToTopWhenScrolling = false;
        let forceScroll = false;

        const vp = this.foundset.viewPort;
        let correctRenderedBoundsAtEnd = false; // if rendered rows needed correction update them all again
        // (we don't call this at the beginning of the method if we have arguments because that might affect what changes
        // and offset were supposed to do based on current renderStartIndex and renderedSize; so I don't want to correct
        // those here but rather at the end); full render does call adjustRenderedViewportIfNeeded() anyway first so it shouldn't do it at end again

        // if there are changes but the renderedStartIndex of the last time doesn't fit at all in this index anymore
        // then the viewport is completely changed and we do need a full render
        if (changes && (this.renderedStartIndex >= vp.startIndex && this.renderedStartIndex < (vp.startIndex + vp.size))) {
            // this is hit when row/column viewport updates are happening. we just need to re-render/add/remove the affected TDs in rendered viewport
            // note that TDs are always relative to renderedStartIndex of foundset (so the rendered viewport))

            // avoid unneeded re-rendering when user is scrolling up and we load extra records from server - which arrive as an insert that just prepends rows to the viewport;
            // that insert can be ignored completely as it is outside of the renderedViewport (it's not a real insert in the foundset, just insert in the viewport array with size growing)
            // the scrollHandler code will call updateRenderedRows(null, newOffset) to render loaded new rows if needed
            const rowUpdates = changes.rowUpdates; // this should never be undefined/null
            if (rowUpdates.length === 1 && rowUpdates[0].type === ChangeType.ROWS_INSERTED
                && rowUpdates[0].startIndex === 0
                && changes.oldStartIndex !== undefined && changes.oldSize !== undefined
                && changes.oldStartIndex === vp.startIndex + (rowUpdates[0].endIndex - rowUpdates[0].startIndex + 1)
                && changes.oldSize === vp.size - (rowUpdates[0].endIndex - rowUpdates[0].startIndex + 1)) {
                // we check above changes.oldStartIndex != undefined && changes.oldSize != undefined because those are provided only starting with Servoy 8.1.2 - and
                // I don't want to create a separate branch on servoy-extra just for this scenario
                // eslint-disable-next-line max-len
                this.log.debug('svy extra table * updateRenderedRows ignored because it is just an extra-load on top; rendered viewport is not affected although it might be corrected by scrollhandler later');
                return; // rendered rows are not affected; do nothing
            }

            // first make sure render/UI viewport bounds do not exceed model.foundset.viewport bounds;
            // any further corrections in NEEDED row bounds for display are done afterwards - if needed - in the scroll listener
            this.renderedStartIndex = Math.max(this.renderedStartIndex, vp.startIndex);
            this.renderedSize = Math.min(this.renderedSize, vp.startIndex + vp.size - this.renderedStartIndex);
            rowOffSet = this.renderedStartIndex - vp.startIndex;

            for (const rowUpdate of rowUpdates) {
                if (rowUpdate.startIndex < rowOffSet + startIndex) startIndex = rowUpdate.startIndex - rowOffSet;
                let updateEndIndex: number;

                if (rowUpdate.type === ChangeType.ROWS_INSERTED || rowUpdate.type === ChangeType.ROWS_DELETED) {
                    // delete or insert
                    updateEndIndex = vp.size - 1 - rowOffSet; // update all after startIndex
                } else { // else $foundsetTypeConstants.ROWS_CHANGED, nothing more to calculate
                    updateEndIndex = rowUpdate.endIndex - rowOffSet;
                }

                if (updateEndIndex > endIndex) endIndex = updateEndIndex;
            }
            endIndex = Math.min(this.renderedSize - 1, endIndex); // we don't need to re-render more rows after rendered viewport
            startIndex = Math.max(0, startIndex); // we don't need to re-render more rows before rendered viewport

            correctRenderedBoundsAtEnd = true;
        } else if (offset >= 0) {
            // offset is given when scrolling up, so new rows will be prepended; see how many (old offset - newOffset)
            newRowsToBeRenderedBefore = (this.renderedStartIndex - vp.startIndex) - offset; // this should always be > 0

            this.renderedStartIndex = vp.startIndex + offset; // update renderedStartIndex; renderedSize was already updated by scroll handler code...

            correctRenderedBoundsAtEnd = true;
        } else {
            // called when a "full" render needs to be done
            this.adjustRenderedViewportIfNeeded();
            const firstSelected = this.foundset.selectedRowIndexes ? this.foundset.selectedRowIndexes[0] : 0;

            if (this.scrollToSelectionNeeded && vp.startIndex <= firstSelected && (vp.startIndex + vp.size) > firstSelected) {
                const formStartToSelection = firstSelected - vp.startIndex;

                // restrict rendered rows to loaded rows that are within allowed bounds (for example first show of a foundset will get from server
                // an interval around selection that might span multiple pages and we only want to render rows from current page)
                const allowedBounds = this.calculateAllowedLoadedDataBounds(); // { startIdx, size }
                const allowedRowOffset = Math.max(0, allowedBounds.startIdx - vp.startIndex); // so relative to loaded viewport
                const allowedRenderSize = Math.min(vp.startIndex + vp.size, allowedBounds.startIdx + allowedBounds.size) - allowedRowOffset - vp.startIndex;

                // selection is in the viewport, try to make sure that is visible and centered in rendered viewport
                const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(formStartToSelection, 0, allowedRowOffset, allowedRenderSize, this.renderedSize);
                rowOffSet = computedInterval[0];
                this.renderedSize = computedInterval[1];

                childIdxToScrollTo = formStartToSelection - rowOffSet; // new selected row rendered index
                alignToTopWhenScrolling = !this.toBottom;
                this.scrollToSelectionNeeded = false; // now reset the flag so that it is only set back to true on purpose
                this.log.debug('svy extra table * updateRenderedRows; scroll will be done, scrollToSelectionNeeded = false');
            } else {
                // re-render all
                rowOffSet = this.renderedStartIndex - vp.startIndex;

                if (this.renderedSize > 0) {
                    const firstVisibleChild = this.getFirstVisibleChild(); // get first visible DOM node
                    // take the index in loaded viewport from dom element (to make sure we really target the same row
                    // no matter what renderedSize and renderedStartIndex are (they might have been altered before calling this method))
                    // so we can't rely on the fact that the Nth DOM child is the Nth relative to renderedStartIndex
                    const indexInFoundset = this.getRowIndexInFoundset(firstVisibleChild);
                    if (indexInFoundset >= 0) {
                        const indexInViewport = this.getViewportIndexFromFoundsetIndex(indexInFoundset);
                        if (indexInViewport >= 0) {
                            const idxOfRowInRendered = indexInViewport - rowOffSet; // child will be relative to rendered obviously
                            // if previously first visible child is no longer part of the rendered rows after full re-render, scroll to top rendered row
                            // (changing page relies of this to show first row in new page)
                            if (idxOfRowInRendered < 0 || idxOfRowInRendered >= this.renderedSize) childIdxToScrollTo = 0;
                        } else childIdxToScrollTo = 0; // should this ever happen?
                    } else {
                        // we can't find a 'first' row to scroll to... keep scroll top position (we just want to rerender all rows, we don't want browser to autoscroll because
                        // for example top space div is removed and some row element from the bottom is now reused as the first row which is on top)
                        childIdxToScrollTo = -1;
                        scrollTopToKeep = this.tbody.nativeElement.scrollTop;
                    }

                    if (childIdxToScrollTo === 0) {
                        alignToTopWhenScrolling = true;
                        forceScroll = true;
                    }
                }
            }

            startIndex = 0;
            endIndex = this.renderedSize - 1;

            this.renderedStartIndex = vp.startIndex + rowOffSet;
            //fix issue with resizing within a dialog.
            setTimeout(() => {
                let event: Event;
                if (typeof (Event) === 'function') {
                    event = new Event('resize');
                } else {
                    event = document.createEvent('Event');
                    event.initEvent('resize', true, true);
                }
                window.dispatchEvent(event);
            }, 0);
        }

        //            const formatFilter = $filter('formatFilter');
        const columns = this.columns;

        this.log.debug(this.log.buildMessage(() => 'svy extra table * updateRenderedRows; renderedStartIndex = ' + this.renderedStartIndex + ' & renderedSize = ' + this.renderedSize));
        if (startIndex <= endIndex)
            this.log.debug(this.log.buildMessage(() => 'svy extra table * updateRenderedRows will rerender from (relative to viewport) '
                + (rowOffSet + startIndex) + ' up to ' + (rowOffSet + endIndex)));

        let topEmptySpaceRowCount = (this.topSpaceDiv ? 1 : 0); // access the correct index for rows if we have the empty space row present
        let bottomEmptySpaceRowCount = (this.bottomSpaceDiv ? 1 : 0);

        const setupRowClassNames = (trEl: Element, idxInFoundset: number, rowIdxInFoundsetViewport: number) => {
            let rowClassNames = '';
            if (this.rowStyleClassDataprovider && this.rowStyleClassDataprovider[rowIdxInFoundsetViewport]) {
                rowClassNames = this.rowStyleClassDataprovider[rowIdxInFoundsetViewport];
            }
            if (this.foundset.selectedRowIndexes.indexOf(idxInFoundset) !== -1) {
                if (rowClassNames) {
                    rowClassNames += ' ';
                }
                rowClassNames += this.selectionClass;
            }
            trEl.className = rowClassNames;
        };

        let j: number;
        if (newRowsToBeRenderedBefore > 0) {
            // dom element before which the new rows should be appended (first row rendered previously if any is available, otherwise bottom space div or null)
            let beforeEl = children.item(topEmptySpaceRowCount);
            if (!beforeEl) beforeEl = null; // append last (before == null) as there is nothing after it

            // rows will be prepended to current ones on top
            for (j = 0; j < newRowsToBeRenderedBefore; j++) {
                // as trChildren is relative to rendered viewport, it can only grow (have missing rows) or shrink at the end; if changes
                // happen before it, the data is updated in those cells, no real dom Node inserts have to happen in specific indexes in
                // the rendered viewpot
                const insertedEl = this.createTableRow(columns, j + rowOffSet);
                this.tbody.nativeElement.insertBefore(insertedEl, beforeEl);
                setupRowClassNames(insertedEl, this.renderedStartIndex + j, j + rowOffSet);
            }

            children = this.tbody.nativeElement.children;
            childrenListChanged = false;
        }

        for (j = startIndex; j <= endIndex; j++) {
            const rowIdxInFoundsetViewport = j + rowOffSet;
            let trElement = children.item(j + topEmptySpaceRowCount);

            const bottomSpaceRowReached = (this.bottomSpaceDiv && (!trElement || trElement === this.bottomSpaceDiv.parentElement.parentElement));
            if (bottomSpaceRowReached || !trElement) {
                // if we reached the end (bottomSpaceDiv if available or really there are no more <tr>s
                // then create the newly rendered row(s) as needed and append or insert them before bottom space div row)
                trElement = this.createTableRow(columns, rowIdxInFoundsetViewport);

                if (bottomSpaceRowReached) this.tbody.nativeElement.insertBefore(trElement, this.bottomSpaceDiv.parentElement.parentElement);
                else this.tbody.nativeElement.appendChild(trElement);

                childrenListChanged = true;
            } else {
                const trChildren = trElement.children;
                for (let c = columns.length; --c >= 0;) {
                    const column = columns[c];
                    const td = trChildren.item(c);
                    td['row_column'] = { idxInFs: this.getFoundsetIndexFromViewportIndex(rowIdxInFoundsetViewport), column: c, id: column.id };
                    let tdClass = 'c' + c;
                    if (column.styleClass) {
                        tdClass += ' ' + column.styleClass;
                    }
                    if (column.styleClassDataprovider && column.styleClassDataprovider[rowIdxInFoundsetViewport]) {
                        tdClass += ' ' + column.styleClassDataprovider[rowIdxInFoundsetViewport];
                    }
                    td.className = tdClass;
                    let value = column.dataprovider ? column.dataprovider[rowIdxInFoundsetViewport] : null;
                    const imageMode = value ? value.url : false;
                    let divChild = td.querySelector('div');
                    if (imageMode && divChild) {
                        divChild.remove();
                        const img = document.createElement('IMG');
                        img.setAttribute('alt', column.headerText);
                        td.appendChild(img);
                        divChild = td.querySelector('div');
                    }
                    if (divChild) {
                        // its text node
                        value = this.getDisplayValue(value, this.getValuelist(column, rowIdxInFoundsetViewport));
                        if (column.format) {
                            value = this.formatter.format(value, column.format, false);
                        }
                        this.setCellDivValue(column, divChild, value);
                    } else {
                        const imgChild = td.querySelector('img');
                        if (imgChild) {
                            if (!value) {
                                imgChild.setAttribute('src', '');
                            } else imgChild.setAttribute('src', column.dataprovider[rowIdxInFoundsetViewport].url);
                        } else {
                            this.log.warn('illegal state should be div or img');
                        }
                    }
                }
            }

            if (trElement) setupRowClassNames(trElement, this.renderedStartIndex + j, rowIdxInFoundsetViewport);
        }

        if (childrenListChanged) {
            childrenListChanged = false;
            children = this.tbody.nativeElement.children;
        }
        if (children.length > 0 && children.length - topEmptySpaceRowCount - bottomEmptySpaceRowCount > this.renderedSize) {
            // START HACK (this is currently only useful for dodging an unwanted jump in Chrome)
            // before really removing rows from the DOM, if there are spacing divs (so not all rows in the list were rendered) increase one of the spacing
            // divs in order to not shrink the scrollbar (this produces annoying scroll experience - if this update happens during a user drag of the scroll
            // knob); for example if maxRenderedRows was reached during a scrolldown this loop below will probably remove hundreds of DOM rows => in chrome
            // the result is that even if we do adjust top and bottom spacing div afterwards, the scroll jumps to last items although you were maybe at 50%;
            // in Edge, browser simply discontinues the scroll in this situation (like you are no longer holding the mouse button pressed on the knob - you
            // have to grab it again to be able to scroll)
            const firstRemovedChildIndex = this.renderedSize + topEmptySpaceRowCount;
            const lastRemovedChildIndex = children.length - bottomEmptySpaceRowCount - 1;
            if (firstRemovedChildIndex >= 0 && firstRemovedChildIndex <= lastRemovedChildIndex) {
                const heightThatWillBeRemoved = children.item(lastRemovedChildIndex).clientTop + children.item(lastRemovedChildIndex).clientHeight
                    - children.item(firstRemovedChildIndex).clientTop;

                this.addBottomSpacingDivIfNotPresent();
                bottomEmptySpaceRowCount = 1;
                // eslint-disable-next-line max-len
                this.log.debug(this.log.buildMessage(() => 'svy extra table * updateRenderedRows will temporarily expand bottom spacing div with removed height so that scroll height doesn\'t shrink to produce unwanted UX... +'
                    + heightThatWillBeRemoved));
                this.bottomSpaceDiv.style.height = (this.bottomSpaceDiv.clientHeight + heightThatWillBeRemoved) + 'px';
            }
            // END HACK
            this.log.debug('svy extra table * updateRenderedRows will delete rendered rows from ' + (rowOffSet + this.renderedSize) + ' up to ' + (rowOffSet + children.length - 1));
            for (let i = children.length - bottomEmptySpaceRowCount; --i >= this.renderedSize + topEmptySpaceRowCount;) {
                children.item(i).remove();
                childrenListChanged = true;
            }
        }

        childrenListChanged = this.updateTopAndBottomEmptySpace() || childrenListChanged;
        topEmptySpaceRowCount = (this.topSpaceDiv ? 1 : 0);
        bottomEmptySpaceRowCount = (this.bottomSpaceDiv ? 1 : 0);

        if (childrenListChanged) {
            childrenListChanged = false;
            children = this.tbody.nativeElement.children;
        }

        if (childIdxToScrollTo >= 0) {
            const scrollToChild = children.item(childIdxToScrollTo + topEmptySpaceRowCount) as HTMLElement;
            if (scrollToChild) {
                const tbodyBounds = this.tbody.nativeElement.getBoundingClientRect();
                const childBounds = scrollToChild.getBoundingClientRect();
                if (forceScroll || childBounds.top < tbodyBounds.top || childBounds.bottom > tbodyBounds.bottom) {
                    this.log.debug('svy extra table * updateRenderedRows; scrolling into view');
                    this.scrollIntoView(scrollToChild, this.tbody.nativeElement, alignToTopWhenScrolling);
                }
            }
        } else if (scrollTopToKeep >= 0) {
            this.tbody.nativeElement.scrollTop = scrollTopToKeep;
        }

        if (correctRenderedBoundsAtEnd) {
            if (this.adjustRenderedViewportIfNeeded()) this.updateRenderedRows(null);
        }

        this.shrinkRenderedViewport(true);
        this.shrinkLoadedViewportIfNeeded();

        this.log.debug('svy extra table * updateRenderedRows DONE.');
    }

    private getCellStyle(column: number) {
        const cellStyle: { overflow: string; minWidth?: string; width?: string; maxWidth?: string } = { overflow: 'hidden' };
        if (column < this.columns.length) {
            let w = this.getNumberFromPxString(this.columns[column].width);
            if (this.isAutoResizeColumn(column) || w < 0) {
                const headers = this.getNativeElement().querySelectorAll('th');
                w = Math.floor(headers.item(column).offsetWidth);
            }
            if (w > -1) {
                cellStyle.minWidth = w + 'px';
                cellStyle.width = w + 'px';
                cellStyle.maxWidth = w + 'px';
            } else if (this.columns[column].width) {
                cellStyle.width = this.columns[column].width;
            }
        }
        return cellStyle;
    }

    private updateTableColumnStyleClass(columnIndex: number, style: { overflow?: string; minWidth?: string; width?: string; maxWidth?: string }) {
        if (!this.columnCSSRules[columnIndex]) {
            const ss = this.doc.styleSheets;
            const clsName = '#table_' + this.servoyApi.getMarkupId() + ' .c' + columnIndex;
            let targetStyleSheet: CSSStyleSheet;

            for (const styleSheet of ss) {
                if (styleSheet.href != null) continue;
                if (!targetStyleSheet) targetStyleSheet = styleSheet;
                const rules = styleSheet.cssRules || styleSheet.rules;

                for (const r of rules) {
                    const rule = r as CSSStyleRule;
                    if (rule.selectorText === clsName) {
                        this.columnCSSRules[columnIndex] = rule;
                        break;
                    }
                }
            }
            if (!this.columnCSSRules[columnIndex]) {
                if (!targetStyleSheet) {
                    const styleElement = this.doc.createElement('style');
                    styleElement.type = 'text/css';
                    this.doc.getElementsByTagName('head')[0].appendChild(styleElement);
                    targetStyleSheet = styleElement.sheet;
                }
                const rules = targetStyleSheet.cssRules || targetStyleSheet.rules;
                targetStyleSheet.insertRule(clsName + '{}', rules.length);
                this.columnCSSRules[columnIndex] = rules[rules.length - 1] as CSSStyleRule;
                this.columnCSSRules[columnIndex].style['height'] = this.minRowHeight;
            }
        }

        for (const p of Object.keys(style)) {
            this.columnCSSRules[columnIndex].style[p] = style[p];
        }

    }

    private updateColumnStyleClass() {
        const columns = this.columns;
        for (let c = 0; c < columns.length; c++) {
            if (c < this.columnStyleClasses.length && columns[c].styleClass !== this.columnStyleClasses[c]) {
                this.generateTemplate();
                break;
            }
        }
    }

    private scheduelGenerateTemplate() {
        if (this.templateTimeout) clearTimeout(this.templateTimeout);
        this.templateTimeout = setTimeout(() => this.generateTemplate(true), 10);
    }

    private generateTemplate(full?: boolean) {
        this.log.debug('svy extra table * generateTemplate called');
        this.adjustRenderedViewportIfNeeded();

        const columns = this.columns;
        if (!this.tbody || !columns || columns.length === 0) return;
        //            const tblHead = this.getNativeElement().querySelector('thead');
        //            if (tbodyJQ.length == 0) {
        //                if ($element.closest("body").length > 0) $timeout(generateTemplate);
        //                return;
        //            }


        if (full)
            this.tableLeftOffset = 0;

        const rows = this.foundset.viewPort.rows;

        for (let c = 0; c < columns.length; c++) {
            this.updateTableColumnStyleClass(c, this.getCellStyle(c));
            this.columnStyleClasses[c] = columns[c].styleClass;
        }
        let isNewTBody = false;
        if (this.tbody.nativeElement.children.length === (this.topSpaceDiv ? 1 : 0) + (this.bottomSpaceDiv ? 1 : 0) || full) {
            //                var formatFilter = $filter("formatFilter");
            isNewTBody = true;
            while (this.tbody.nativeElement.lastElementChild) {
                this.tbody.nativeElement.removeChild(this.tbody.nativeElement.lastElementChild);
            }
            // if new body, hide overflow-x until it is rendered, to avoid flickering because of show/hide of it
            this.tbody.nativeElement.style.overflowX = 'hidden';
            this.topSpaceDiv = null;
            this.bottomSpaceDiv = null;
            this.tbody.nativeElement.removeEventListener('scroll', this.onTBodyScrollListener);
            this.onTBodyScrollListener = null;

            this.updateTBodyStyle();
            this.renderedSize = Math.min(this.renderedSize, rows.length);
            const firstSelected = this.foundset.selectedRowIndexes ? this.foundset.selectedRowIndexes[0] : 0;
            let startRow = 0;
            const formStartToSelection = firstSelected - this.foundset.viewPort.startIndex;
            if (formStartToSelection < this.foundset.viewPort.size && formStartToSelection > this.renderedSize) {
                // if the selection is in the viewport and it will not be rendered because it falls out of the max rows
                // adjust the startRow to render
                startRow = Math.floor(formStartToSelection - this.renderedSize / 2) + 1;
                if (startRow + this.renderedSize > this.foundset.viewPort.size) {
                    startRow = this.foundset.viewPort.size - this.renderedSize;
                }
            }
            this.renderedStartIndex = this.foundset.viewPort.startIndex + startRow;
            const rowEnding = startRow + this.renderedSize;
            for (let r = startRow; r < rowEnding; r++) {
                this.tbody.nativeElement.appendChild(this.createTableRow(columns, r));
            }
            this.updateTopAndBottomEmptySpace();

            // this is called from a scroll listener to see if more records need to be rendered or loaded
            // but also afterwards when rows are loaded due to scroll to update rendered viewport
            const scrollHandler = () => {
                const vp = this.foundset.viewPort;
                const renderedStartIndexInLoaded = this.renderedStartIndex - vp.startIndex; // so relative to loaded viewport, not to start of foundset
                const renderedSizeBefore = this.renderedSize;
                let visibleViewport: Array<number>;

                //on viewport changed
                const vpStart = this.getVisibleArea()[0];
                const vpEnd = this.getVisibleArea()[0] + this.getVisibleArea()[1];
                if (this.onViewPortChanged) {
                    this.onViewPortChanged(vpStart, vpEnd);
                }

                // see if more rows are needed on top
                if (this.tbody.nativeElement.scrollTop - (this.topSpaceDiv ?
                    this.topSpaceDiv.clientHeight : 0) < this.tbody.nativeElement.clientHeight) {
                    // the following code should mirror the scroll down behavior

                    // scroll up behavior
                    // for none paging the minimal row index is 0; for paging it is the first index on current page
                    let firstIndexAllowedOnScrollUp = 0;
                    if (this.showPagination()) {
                        // paging mode calculate max size of the current viewPort
                        firstIndexAllowedOnScrollUp = this.pageSize * (this.currentPage - 1);
                    }

                    // check if the current first rendered row index is bigger then what the minimal would be
                    if (this.renderedStartIndex > firstIndexAllowedOnScrollUp) {
                        this.log.debug('svy extra table * scrollHandler more records need to be rendered on top');

                        // grow rendered rows on top as much as possible with current loaded rows (if rows are already loaded on top but not yet rendered)
                        // so we render as much as we can right away
                        this.renderedSize = Math.min(this.renderedSize + this.batchSizeForRenderingMoreRows, this.renderedSize + renderedStartIndexInLoaded);
                        const addedRows = this.renderedSize - renderedSizeBefore;
                        // calculate the offset of the rendered rows inside the loaded ones
                        const offset = Math.max(0, renderedStartIndexInLoaded - addedRows);

                        // now see what the visible area is - in case the user is scrolling fast (so rendered/loaded are left way behind
                        // with hundreds of records for example) we might need to ditch what we have and start fresh with rows around visible area
                        visibleViewport = this.getVisibleArea(); // [startIndex, size]
                        if (this.renderedStartIndex - addedRows > visibleViewport[0] + this.getInitialRenderSize() * this.performanceSettings.fastScrollRenderThresholdFactor) {
                            // so the wanted visible start index (we are scrolling up) is way outside of what we can currently render...
                            // jump to what is needed directly, discarding old content as needed
                            // instead of prepending small batches of rendered rows until we can show what is needed
                            this.log.debug('svy extra table * scrollHandler (fast scroll up) will discard rendered rows and start fresh in desired area');

                            // we don't change anything until we are ready to jump to the visible area (have loaded rows to be able to render the visible area)
                            this.renderedSize = renderedSizeBefore;

                            if (vp.startIndex > visibleViewport[0] + this.getInitialPreferredLoadedSize() * + this.performanceSettings.fastScrollLoadThresholdFactor) {
                                // too many extra rows to load... just reset loaded viewport as well; start fresh
                                this.log.debug('svy extra table * scrollHandler (fast scroll up) needs to discard loaded rows and start fresh in desired area');
                                this.runWhenThereIsNoPendingLoadRequest(() => {
                                    const newLoadingPromise = this.shrinkLoadedViewportNow(false);
                                    if (newLoadingPromise) newLoadingPromise.then(scrollHandler); // call scroll handler again to update the rendered viewport
                                    return newLoadingPromise;
                                }, scrollHandler);
                            } else if (vp.startIndex > firstIndexAllowedOnScrollUp && (this.renderedStartIndex - vp.startIndex) < this.batchSizeForRenderingMoreRows) {
                                // just load more rows on top if needed
                                this.log.debug('svy extra table * scrollHandler (fast scroll up) more records need to be loaded on top');
                                this.runWhenThereIsNoPendingLoadRequest(() => {
                                    const newLoadingPromise = this.foundset.loadExtraRecordsAsync(
                                        -Math.min(vp.startIndex - firstIndexAllowedOnScrollUp, vp.startIndex - visibleViewport[0] + this.batchSizeForRenderingMoreRows));
                                    newLoadingPromise.then(scrollHandler); // call scroll handler again to update the rendered viewport
                                    return newLoadingPromise;
                                }, scrollHandler);
                            } else {
                                // we have the needed rows loaded; just render around the visible area
                                this.shrinkRenderedViewport(false);
                            }
                        } else {
                            if (vp.startIndex > firstIndexAllowedOnScrollUp && (this.renderedStartIndex - vp.startIndex) < this.batchSizeForRenderingMoreRows) {
                                // seems like more rows need to be loaded from server (there is less then one page of rendered rows available but there are more rows to be loaded on top)
                                // but desired visible area is close enough to rendered/loaded rows to continue loading small batches one by one until we get there
                                // (we don't need to discard all we've got)
                                this.log.debug('svy extra table * scrollHandler more records need to be loaded on top');
                                // if a previous scroll down already requested extra records, wait for that to happen
                                // and then recompute everything based on the new viewport - to see if loading more is still needed (so scrollHandler() will be called)
                                // else if there is no pending load, ask for the extra records
                                this.runWhenThereIsNoPendingLoadRequest(() => {
                                    const newLoadingPromise = this.foundset.loadExtraRecordsAsync(-Math.min(this.batchSizeForLoadingMoreRows, vp.startIndex - firstIndexAllowedOnScrollUp));
                                    newLoadingPromise.then(scrollHandler); // check if rendered viewport needs to be updated again after more rows get loaded
                                    return newLoadingPromise;
                                }, scrollHandler);
                            }
                            if (addedRows !== 0) {
                                this.runAndKeepScrollTopPosition(() => {
                                    this.updateRenderedRows(null, offset); // this can/will update renderedStartIndex to match the given offset
                                });
                                // check again just in case the render resulted in the need for more rows according to current scroll position;
                                // but do it in a timeout so that we don't block the UI completely if many renders need to be done one after the
                                // other due to a very fast scroll (drag of scroll knob)
                                setTimeout(scrollHandler, 0);
                            }
                        }
                    }
                } // no else here because we don't even check if it was a scroll up or scroll down; we then just check if we need more rows either top or bottom

                // see if more rows are needed at bottom
                if ((this.tbody.nativeElement.scrollTop + 2 * this.tbody.nativeElement.clientHeight) >
                    (this.tbody.nativeElement.scrollHeight - (this.bottomSpaceDiv ? this.bottomSpaceDiv.clientHeight : 0))) {
                    // the following code should mirror the scroll up behavior
                    // scroll down behavior; it seems that less then one more visible page is rendered; render more records below it (if available; also load  from server more records if needed)
                    let lastIndexAllowedOnScrollDown: number; // absolute index in foundset

                    // calculate max row index (relative to foundset) that can be requested, for paging it is the last index in the current page, for non-paging it is serverSize - 1
                    if (this.showPagination()) {
                        lastIndexAllowedOnScrollDown = Math.min(this.pageSize * this.currentPage, this.foundset.serverSize) - 1;
                    } else {
                        lastIndexAllowedOnScrollDown = this.foundset.serverSize - 1;
                    }

                    // see if scroll should render more rows
                    if ((this.renderedStartIndex + this.renderedSize - 1) < lastIndexAllowedOnScrollDown) {
                        this.log.debug('svy extra table * scrollHandler more records need to be rendered below');

                        // render one more batch of rows or as many as currently available in loaded viewport - if there are not enough loaded or available
                        this.renderedSize = Math.min(this.renderedSize + this.batchSizeForRenderingMoreRows, vp.size - renderedStartIndexInLoaded);

                        // see if we also need to request one more batch of records from server due to scrolling down
                        const currentLastLoadedIndex = vp.startIndex + vp.size - 1;
                        // now see what the visible area is - in case the user is scrolling fast (so rendered/loaded are left way behind
                        // with hundreds of records for example) we might need to ditch what we have and start fresh with rows around visible area
                        visibleViewport = this.getVisibleArea(); // [startIndex, size]
                        if (this.renderedStartIndex + this.renderedSize + this.getInitialRenderSize() * this.performanceSettings.fastScrollRenderThresholdFactor <
                            visibleViewport[0] + visibleViewport[1]) {
                            // so the wanted visible end index (we are scrolling down) is way outside of what we can currently render...
                            // jump to what is needed directly, discarding old content as needed
                            // instead of appending small batches of rendered rows until we can show what is needed
                            this.log.debug('svy extra table * scrollHandler (fast scroll down) will discard rendered rows and start fresh in desired area');

                            // we don't change anything until we are ready to jump to the visible area (have loaded rows to be able to render the visible area)
                            this.renderedSize = renderedSizeBefore;

                            if (vp.startIndex > visibleViewport[0] + this.getInitialPreferredLoadedSize() * this.performanceSettings.fastScrollLoadThresholdFactor) {
                                // too many extra rows to load... just reset loaded viewport as well; start fresh
                                this.log.debug('svy extra table * scrollHandler (fast scroll down) needs to discard loaded rows and start fresh in desired area');
                                this.runWhenThereIsNoPendingLoadRequest(() => {
                                    const newLoadingPromise = this.shrinkLoadedViewportNow(false);
                                    if (newLoadingPromise) newLoadingPromise.then(scrollHandler); // call scroll handler again to update the rendered viewport
                                    return newLoadingPromise;
                                }, scrollHandler);
                            } else if (currentLastLoadedIndex < lastIndexAllowedOnScrollDown &&
                                (currentLastLoadedIndex - (this.renderedStartIndex + this.renderedSize)) < this.batchSizeForRenderingMoreRows) {
                                // just load more rows on top if needed
                                this.log.debug('svy extra table * scrollHandler (fast scroll down) more records need to be loaded on top');
                                this.runWhenThereIsNoPendingLoadRequest(() => {
                                    const newLoadingPromise = this.foundset.loadExtraRecordsAsync(Math.min(lastIndexAllowedOnScrollDown - currentLastLoadedIndex,
                                        visibleViewport[0] + visibleViewport[1] - vp.startIndex - vp.size + this.batchSizeForRenderingMoreRows));
                                    newLoadingPromise.then(scrollHandler); // call scroll handler again to update the rendered viewport
                                    return newLoadingPromise;
                                }, scrollHandler);
                            } else {
                                // we have the needed rows loaded; just render around the visible area
                                this.shrinkRenderedViewport(false);
                            }
                        } else {
                            if (currentLastLoadedIndex < lastIndexAllowedOnScrollDown && (currentLastLoadedIndex - (this.renderedStartIndex + this.renderedSize)) <
                                this.batchSizeForRenderingMoreRows) {
                                this.log.debug('svy extra table * scrollHandler more records need to be loaded below');

                                // if a previous scroll down already requested extra records, wait for that to happen
                                // and then recompute everything based on the new viewport - to see if loading more is still needed (so scrollHandler() will be called)
                                // else if there is no pending load, ask for the extra records
                                this.runWhenThereIsNoPendingLoadRequest(() => {
                                    const newLoadingPromise = this.foundset.loadExtraRecordsAsync(
                                        Math.min(this.batchSizeForLoadingMoreRows, lastIndexAllowedOnScrollDown - currentLastLoadedIndex));
                                    newLoadingPromise.then(scrollHandler); // check if rendered viewport needs to be updated again after more rows get loaded
                                    return newLoadingPromise;
                                }, scrollHandler);
                            }

                            if (this.renderedSize !== renderedSizeBefore) {
                                this.runAndKeepScrollTopPosition(() => {
                                    // call update table so that any new rows that need to be rendered are rendered (if viewport already had some more rows loaded but they were not yet rendered)
                                    this.updateRenderedRows({
                                        rowUpdates: [{
                                            startIndex: renderedStartIndexInLoaded + renderedSizeBefore,
                                            endIndex: renderedStartIndexInLoaded + this.renderedSize - 1, type: 0
                                        }], oldStartIndex: vp.startIndex, oldSize: vp.size
                                    }); // endIndex is inclusive
                                });
                                // check again just in case the render resulted in the need for more rows according to current scroll position;
                                // but do it in a timeout so that we don't block the UI completely if many renders need to be done one after the other
                                // due to a very fast scroll (drag of scroll knob)
                                setTimeout(scrollHandler, 0);
                            }
                        }
                    }
                }
            };

            this.tbody.nativeElement.addEventListener('scroll', scrollHandler); // register as scroll listener
            this.scrollToRenderedIfNeeded();
        } else {
            this.updateTBodyStyle();
            this.updateRenderedRows(null);
        }

        this.onTableRendered(isNewTBody);
    }

    private createTableRow(columns: Array<Column>, idxInLoaded: number) {
        const tr = document.createElement('TR');
        if (this.rowStyleClassDataprovider && this.rowStyleClassDataprovider[idxInLoaded]) {
            tr.className = this.rowStyleClassDataprovider[idxInLoaded];
        }
        for (let c = 0; c < columns.length; c++) {
            const column = columns[c];
            const td = document.createElement('TD');
            if (this.enableMobileView) {
                td.dataset.title = column.headerText;
            }
            td['row_column'] = { idxInFs: this.getFoundsetIndexFromViewportIndex(idxInLoaded), column: c, id: column.id };
            let tdClass = 'c' + c;
            if (column.styleClass) {
                tdClass += ' ' + column.styleClass;
            }
            if (column.styleClassDataprovider && column.styleClassDataprovider[idxInLoaded]) {
                tdClass += ' ' + column.styleClassDataprovider[idxInLoaded];
            }
            td.className = tdClass;
            tr.appendChild(td);
            if (column.dataprovider && column.dataprovider[idxInLoaded] && column.dataprovider[idxInLoaded].url) {
                const img = document.createElement('IMG');
                img.setAttribute('src', column.dataprovider[idxInLoaded].url);
                img.setAttribute('alt', column.headerText);
                td.appendChild(img);
            } else {
                const div = document.createElement('DIV') as HTMLDivElement;
                let value = column.dataprovider ? column.dataprovider[idxInLoaded] : null;
                value = this.getDisplayValue(value, this.getValuelist(column, idxInLoaded));
                if (column.format) {
                    value = this.formatter.format(value, column.format, false);
                }
                this.setCellDivValue(column, div, value);
                td.appendChild(div);
            }
        }
        return tr;
    }

    private onTableRendered(isNewTBody: boolean) {
        var tbl = document.getElementById('table_'+this.servoyApi.getMarkupId());
        if(this.enableMobileView)
        tbl.classList.add("mobileview");
        this.updateSelection(this.foundset.selectedRowIndexes, null);
        this.scrollToSelectionIfNeeded();
        //this.adjustLoadedRowsIfNeeded();

        if (!this.onTBodyScrollListener) {
            this.onTBodyScrollListener = () => {
                setTimeout(() => {
                    if (this.tbody) {
                        this.tableLeftOffset = -this.tbody.nativeElement.scrollLeft;
                        const resizer = this.getNativeElement().querySelector('.JCLRgrips') as HTMLElement;
                        if (resizer) {
                            resizer.style.left = this.tableLeftOffset + 'px';
                        }
                    }
                });
            };
            this.tbody.nativeElement.addEventListener('scroll', this.onTBodyScrollListener);
        }


        setTimeout(() => {
            let isScrollWidthChange = false;
            if (this.tbody && (this.tbody.nativeElement.scrollHeight > this.tbody.nativeElement.clientHeight && (this.scrollWidth === 0))) {
                this.scrollWidth = this.tbody.nativeElement.offsetWidth - this.tbody.nativeElement.clientWidth + 2;
                isScrollWidthChange = true;
            } else if (this.tbody.nativeElement && (this.tbody.nativeElement.scrollHeight <= this.tbody.nativeElement.clientHeight) && (this.scrollWidth > 0)) {
                this.scrollWidth = 0;
                isScrollWidthChange = true;
            }

            if (isScrollWidthChange) {
                this.setColumnsToInitalWidthAndInitAutoColumns();    // reset column model width to inital value
                this.columnStyleCache = []; // clear style cache so header style (width) is re-calculated
            }

            if (this.needToUpdateAutoColumnsWidth) {
                this.needToUpdateAutoColumnsWidth = false;
                this.tableWidth = this.calculateTableWidth();

                let sumColumnsWidth = 0;
                let ignoreScrollWidth = false;
                const headers = this.getNativeElement().querySelectorAll('th');
                if (headers.length && this.isVisible(headers.item(0))) {
                    for (let i = 0; i < this.columns.length; i++) {
                        sumColumnsWidth += Math.floor(headers.item(i).scrollWidth);
                        if (!ignoreScrollWidth && (this.columns[i].width === '' || this.columns[i].width === 'auto')) {
                            ignoreScrollWidth = true;
                        }
                    }
                }
                this.updateAutoColumnsWidth(this.getComponentWidth() - (ignoreScrollWidth ? 0 : this.scrollWidth) - sumColumnsWidth);
            }

            if (this.enableColumnResize) {
                this.addColResizable(true);
            }
            this.cdRef.detectChanges();
        }, 0);

        // do it in the next digest cycle, so the headers already have the style with the width applied (by the apply above)
        setTimeout(() => {
            // update the autoColumns with the right px values
            const headers = this.getNativeElement().querySelectorAll('th');
            if (headers.length && this.isVisible(headers.item(0))) {
                for (let i = 0; i < this.columns.length; i++) {
                    if (this.autoColumns.columns[i]) {
                        if (this.autoColumns.minWidth[i] < 0) {
                            this.autoColumns.minWidth[i] = 1;
                            this.columns[i].width = Math.floor(headers.item(i).scrollWidth) + 'px';
                        }
                        this.updateTableColumnStyleClass(i, { width: this.columns[i].width, minWidth: this.columns[i].width, maxWidth: this.columns[i].width });
                    }
                }
                this.updateTBodyStyle();
            }
            if (this.tbody && isNewTBody && (this.horizontalScrollbar !== 'NEVER')) {
                this.tbody.nativeElement.style.removeProperty('overflow-x');
            }
        }, 0);
    }

    private addColResizable(cleanPrevious: boolean) {
        // TODO
        //            const tbl = this.getNativeElement().querySelector(":first");
        //            if (cleanPrevious) {
        //                tbl.colResizable({
        //                    disable: true,
        //                    removePadding: false
        //                });
        //            }
        //            tbl.colResizable({
        //                liveDrag: false,
        //                resizeMode: "fit",
        //                onResize: function(e) {
        //                    $scope.$apply(function() {
        //                        onColumnResize(e);
        //                    })
        //                },
        //                removePadding: false
        //            });
        //            // don't want JColResize to change the column width on window resize
        //            $(window).unbind('resize.JColResizer');
    }

    private scrollToRenderedIfNeeded() {
        // this should NOT be called when waiting for more rows to render/load due to a scroll up/scroll down!

        // if rendered rows are not visible due to scroll, do scroll to the rendered rows to not show blank content;
        // this can happen for example if you show a table in a tab-panel, scroll down, switch to another tab and then back
        // in which case table renders, but loaded and rendered will be somewhere to the bottom while scrollbar for the table
        // (which has just been re-created as a DOM element) is at top showing the empty space dir - so blank

        // when this method is called tbody should always be scrolled to top (as this method should be called after a refresh or show/hide only)
        if (this.tbody.nativeElement && this.tbody.nativeElement.scrollTop === 0 && this.tbody.nativeElement.children.length - (this.topSpaceDiv ? 1 : 0) - (this.bottomSpaceDiv ? 1 : 0) > 0) {
            // center visible area on rendered if possible; if selection is part of rendered center on selection
            // TODO should we try to keep scroll exactly where it was before instead of centering on the rendered rows? so somehow store last scrollTop in the component's model (server side)
            let targetIntervalPosition = this.renderedStartIndex;
            let targetIntervalSize = this.renderedSize;
            // we do not scroll to selection if there is no selected record (serverSize is probably 0) or we have multi-select with more then one or 0 selected records
            const firstSelected = this.foundset.selectedRowIndexes.length === 1 ? this.foundset.selectedRowIndexes[0] : -1;

            let shouldScroll = false;
            if (firstSelected >= this.renderedStartIndex && firstSelected < this.renderedStartIndex + this.renderedSize) {
                targetIntervalPosition = firstSelected;
                targetIntervalSize = 1;
                shouldScroll = true; // scroll to selection (which is in rendered rows) as this was most likely what user was looking at before
            }

            if ((this.tbody.nativeElement.children[this.topSpaceDiv ? 1 : 0] as HTMLElement).offsetTop > 0) {
                shouldScroll = true; // scroll to some rendered row, be it selection above or not; because we are currently showing white space
            }
            if (shouldScroll) {
                const targetIntervalStartOffsetTop = (this.tbody.nativeElement.children[(this.topSpaceDiv ? 1 : 0) + targetIntervalPosition - this.renderedStartIndex] as HTMLElement).offsetTop;
                const targetIntervalEndElement = this.tbody.nativeElement.children[(this.topSpaceDiv ? 1 : 0)
                    + targetIntervalPosition - this.renderedStartIndex + targetIntervalSize - 1] as HTMLElement;
                const targetIntervalEndOffsetBottom = targetIntervalEndElement.offsetTop + targetIntervalEndElement.offsetHeight - 1;

                const allowedStartOffsetTop = (this.tbody.nativeElement.children[(this.topSpaceDiv ? 1 : 0)] as HTMLElement).offsetTop;
                const allowedEndElement = this.tbody.nativeElement.children[(this.topSpaceDiv ? 1 : 0) + this.renderedSize - 1] as HTMLElement;
                const allowedEndOffsetBottom = allowedEndElement.offsetTop + allowedEndElement.offsetHeight - 1;

                // attempt to center on targeted row-index-interval but based on actual DOM locations/sizes, as rows might have different visual heights (from styling / data);
                const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(targetIntervalStartOffsetTop,
                    targetIntervalEndOffsetBottom - targetIntervalStartOffsetTop,
                    allowedStartOffsetTop,
                    allowedEndOffsetBottom - allowedStartOffsetTop,
                    this.tbody.nativeElement.clientHeight);

                this.log.debug(this.log.buildMessage(() => 'svy extra table * scrollToRenderedIfNeeded will scroll to rendered viewport on initial load/refresh (scrollPos: '
                    + computedInterval[0] + ', tryingToCenterOnIndexInterval: ['
                    + targetIntervalPosition + ', ' + (targetIntervalPosition + targetIntervalSize - 1) + '], rendered: ['
                    + this.renderedStartIndex + ', ' + (this.renderedStartIndex + this.renderedSize - 1) + '])'));

                this.tbody.nativeElement.scrollTop = computedInterval[0];
            }
        }
    }

    private updateTopAndBottomEmptySpace() {
        if (!this.tbody) return false;
        let spacingRowsAddedOrRemoved = false;
        const allowedBounds = this.calculateAllowedLoadedDataBounds();

        // calculate average rendered row height
        const averageRowHeight = this.getAverageRowHeight();

        this.updateBatchSizesIfNeeded(averageRowHeight);

        if (this.renderedStartIndex > allowedBounds.startIdx) {
            // there are records on top that are not yet rendered; add an empty div as the first row to simulate the height
            // that the non-rendered rows should use - for more natural scrolling; if we already have that div just recalculate it's height
            if (!this.topSpaceDiv) {
                const topTR = this.doc.createElement('tr');
                const topTD = this.doc.createElement('td');
                topTD.colSpan = this.columns && this.columns.length ? this.columns.length : 1;
                this.topSpaceDiv = this.doc.createElement('div');
                topTD.appendChild(this.topSpaceDiv);
                topTR.appendChild(topTD);
                this.tbody.nativeElement.prepend(topTR);

                spacingRowsAddedOrRemoved = true;

                this.log.debug('svy extra table * updateTopAndBottomEmptySpace added top empty space row');
            }
            const previousHeight = this.topSpaceDiv.style.height;

            this.topSpaceDiv.style.height = (averageRowHeight * (this.renderedStartIndex - allowedBounds.startIdx)) + 'px';

            if (previousHeight !== this.topSpaceDiv.style.height)
                this.log.debug('svy extra table * updateTopAndBottomEmptySpace changed top empty space to: ' + this.topSpaceDiv.style.height);
        } else if (this.topSpaceDiv) {
            this.topSpaceDiv.parentElement.parentElement.remove();
            this.topSpaceDiv = null;
            spacingRowsAddedOrRemoved = true;

            this.log.debug('svy extra table * updateTopAndBottomEmptySpace removed top empty space row');
        }

        if (this.renderedStartIndex + this.renderedSize < allowedBounds.startIdx + allowedBounds.size) {
            // there are records on top that are not yet rendered; add an empty div as the first row to simulate the height
            spacingRowsAddedOrRemoved = this.addBottomSpacingDivIfNotPresent() || spacingRowsAddedOrRemoved;

            // that the non-rendered rows should use - for more natural scrolling; if we already have that div just recalculate it's height
            const previousBottomHeight = this.bottomSpaceDiv.style.height;

            this.bottomSpaceDiv.style.height = (averageRowHeight * (allowedBounds.startIdx + allowedBounds.size - this.renderedStartIndex - this.renderedSize)) + 'px';

            if (previousBottomHeight !== this.bottomSpaceDiv.style.height)
                this.log.debug(this.log.buildMessage(() => 'svy extra table * updateTopAndBottomEmptySpace changed bottom empty space to: ' + this.bottomSpaceDiv.style.height));
        } else if (this.bottomSpaceDiv) {
            this.bottomSpaceDiv.parentElement.parentElement.remove();
            this.bottomSpaceDiv = null;
            spacingRowsAddedOrRemoved = true;

            this.log.debug('svy extra table * updateTopAndBottomEmptySpace removed bottom empty space row');
        }

        return spacingRowsAddedOrRemoved;
    }

    private addBottomSpacingDivIfNotPresent() {
        let spacingRowsAddedOrRemoved = false;
        if (!this.bottomSpaceDiv) {
            const bottomTR = this.doc.createElement('tr');
            const bottomTD = this.doc.createElement('td');
            bottomTD.colSpan = this.columns && this.columns.length ? this.columns.length : 1;
            this.bottomSpaceDiv = this.doc.createElement('div');
            bottomTD.appendChild(this.bottomSpaceDiv);
            bottomTR.appendChild(bottomTD);
            this.tbody.nativeElement.appendChild(bottomTR);

            spacingRowsAddedOrRemoved = true;

            this.log.debug('svy extra table * updateTopAndBottomEmptySpace added bottom empty space row');
        }
        return spacingRowsAddedOrRemoved;
    }

    private updateBatchSizesIfNeeded(averageRowHeight: number) {
        const oldBatchSizeForRenderingMoreRows = this.batchSizeForRenderingMoreRows;
        const oldBatchSizeForLoadingMoreRows = this.batchSizeForLoadingMoreRows;
        if (this.renderedSize > 0 && averageRowHeight > 0) {
            const visibleAreaRows = Math.ceil(this.tbody.nativeElement.clientHeight / averageRowHeight);

            // initially render rows for 3 times the visible area - so 1 above and 1 below the visible area, but then when scrolling and
            // more rows are needed only render one more 'visible areas' of rows
            this.batchSizeForRenderingMoreRows = Math.max(Math.ceil(visibleAreaRows * this.magicRenderBatchQ), this.performanceSettings.minBatchSizeForRenderingMoreRows);
            // initially load rows for 5 times the visible area - so 2 above and 2 below initial visible area, but then when scrolling and
            // more rows are needed only load two more 'visible areas' of rows
            this.batchSizeForLoadingMoreRows = Math.max(Math.ceil(visibleAreaRows * this.magicLoadBatchQ), this.performanceSettings.minBatchSizeForLoadingMoreRows);
        } else {
            // just some defaults as we don't have enough info to calculate them
            this.batchSizeForRenderingMoreRows = Math.max(26, this.performanceSettings.minBatchSizeForRenderingMoreRows);
            this.batchSizeForLoadingMoreRows = Math.max(52, this.performanceSettings.minBatchSizeForLoadingMoreRows);
        }

        const batchSizesChanged = (oldBatchSizeForRenderingMoreRows !== this.batchSizeForRenderingMoreRows || oldBatchSizeForLoadingMoreRows !== this.batchSizeForLoadingMoreRows);
        if (batchSizesChanged) {
            this.log.debug(this.log.buildMessage(() => 'svy extra table * updateBatchSizesIfNeeded changed batch sizes for rendering and/or loading to ('
                + this.batchSizeForRenderingMoreRows + ',' + this.batchSizeForLoadingMoreRows + ')'));
        }
        return batchSizesChanged;
    }
    /**
     * IMPORTANT: Only call this once you are SURE that the top and bottom spacing divs and the scroll position is correct!
     * This method relies on scroll position to do it's job properly.
     *
     * It will shrink the rendered viewport to initial preferred rendered size around the current visible area. (depending also on what rows are loaded)
     *
     * @param onlyIfMaxLimitReached if true, it will only shrink the rendered viewport it it passed max rendered size; if false it will force-shrink it anyway.
     * @return true if it shrinked the rendered viewport or false otherwise.
     */
    private shrinkRenderedViewport(onlyIfMaxLimitReached: boolean): boolean {
        // don't allow rendered rows to grow more then maxRenderedSize to avoid sluggish browser UI due to a too large DOM
        let changed = false;

        const vp = this.foundset.viewPort;
        const allowedBounds = this.calculateAllowedLoadedDataBounds(); // { startIdx, size }
        const correctedLoadedStartIdx = Math.max(vp.startIndex, allowedBounds.startIdx);
        const correctedLoadedSize = Math.min(vp.startIndex + vp.size, allowedBounds.startIdx + allowedBounds.size) - correctedLoadedStartIdx;
        const minRenderSize = Math.min(this.getInitialRenderSize(), correctedLoadedSize);

        if (!onlyIfMaxLimitReached || this.renderedSize > this.performanceSettings.maxRenderedRows) {
            // remove some rendered rows as we have too many; keep rendered the ones that are really visible

            this.log.debug(this.log.buildMessage(() => 'svy extra table * shrinkRenderedViewport will reset rendered rows viewport as '
                + (onlyIfMaxLimitReached ? 'maxRenderedRows limit was passed (' + this.renderedSize + ')' : 'user jumped fast to a non-rendered section of the list')));

            // currently as this correction will do full re-render we will just revert to minRenderSize instead of lowering the current renderedSize;
            // this could I guess be enhanced in the future by just lowering the renderedSize - but then we also need to do granular remove of some rendered rows,
            // not full rerender
            this.renderedSize = minRenderSize;
            const visibleViewport = this.getVisibleArea(); // [startIndex, size]

            const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(visibleViewport[0], visibleViewport[1], correctedLoadedStartIdx, correctedLoadedSize, this.renderedSize);
            if (this.renderedStartIndex !== computedInterval[0]) {
                this.renderedStartIndex = computedInterval[0];
                changed = true;
            }
            if (this.renderedSize !== computedInterval[1]) {
                this.renderedSize = computedInterval[1];
                changed = true;
            }
        }


        if (changed) {
            this.log.debug(this.log.buildMessage(() => 'svy extra table * shrinkRenderedViewport did correct the rendered interval to ' + this.renderedStartIndex + ', ' + this.renderedSize));

            // full update; but keep scroll position to avoid weird UI jump effects or loss of scroll knob grab (differs from browser to browser)
            this.runAndKeepScrollTopPosition(() => {
                this.updateRenderedRows(null);
            });

        }

        return changed;
    }

    private runAndKeepScrollTopPosition(func: () => void) {
        const prevScrollTop = this.tbody.nativeElement.scrollTop;

        func();

        if (this.tbody.nativeElement.scrollTop !== prevScrollTop) {
            this.log.debug(this.log.buildMessage(() => 'svy extra table * runAndKeepScrollTopPosition scrollTop has changed after execution; restoring... ('
                + prevScrollTop + ', ' + this.tbody.nativeElement.scrollTop + ')'));
            this.tbody.nativeElement.scrollTop = prevScrollTop;
        }
    }
    /**
     * Calls shrinkLoadedViewportNow(true), only if there are no pending load records operations on the foundset.
     * If we are still waiting for server to apply a loaded records operation, this call will do nothing.
     *
     * @see shrinkLoadedViewportNow(keepMaxLoadedRows)
     */
    private shrinkLoadedViewportIfNeeded() {
        this.runWhenThereIsNoPendingLoadRequest(() => this.shrinkLoadedViewportNow(true), () => {
            this.log.debug('svy extra table * shrinkLoadedViewportIfNeeded will be ignored as there was a pending load operation on the foundset (this message is delayed)');
        });
    }

    /**
     * IMPORTANT: Only call this once you are SURE that the top and bottom spacing divs and the scroll position is correct!
     * This method relies on scroll position to do it's job properly.
     *
     * This method might call fs.loadXYZ(...) directly so be sure to always call it from inside a "runWhenThereIsNoPendingLoadRequest".
     *
     * @param keepMaxLoadedRows if true, it will shrink loaded viewport only if it passes max loaded rows, and it will
     *                                    shrink it to max loaded rows; if false it will force-shrink the loaded viewport to initial size
     *                                    around the visible area
     * @return null if no foundSet load operation was triggered, or the promise returned by the foundSet load operation otherwise.
     */
    private shrinkLoadedViewportNow(keepMaxLoadedRows: boolean) {
        // don't allow loaded rows to grow more then maxRenderedSize to avoid sluggish browser UI due to a too large DOM
        let promise: Promise<any>;

        const vp = this.foundset.viewPort;
        const allowedBounds = this.calculateAllowedLoadedDataBounds(); // { startIdx, size }

        if (!keepMaxLoadedRows || vp.size > this.performanceSettings.maxLoadedRows) {
            // we need to shrink loaded rows
            this.log.debug(this.log.buildMessage(() => 'svy extra table * shrinkLoadedViewportNow will shrink loaded rows; '
                + (keepMaxLoadedRows ? 'maxLoadedRows limit was passed (' + vp.size + ')' : 'user jumped fast to a non-loaded section of the list')));

            const visibleViewport = this.getVisibleArea(); // [startIndex, size]

            if (keepMaxLoadedRows) {
                // so a fs.loadLess... will happen, not a full reload;
                if (visibleViewport[0] - vp.startIndex > vp.startIndex + vp.size - visibleViewport[0] - visibleViewport[1]) {
                    // load less records in the beginning (at least to match maxLoadedRows but even more if possible to avoid frequent load calls to server
                    // just for discarding loaded rows (limit it though to 200 to still keep data))
                    promise = this.foundset.loadLessRecordsAsync(
                        Math.max(vp.size - this.performanceSettings.maxLoadedRows, Math.min(200, Math.floor((this.renderedStartIndex - vp.startIndex) / 2)))); // positive int
                } else {
                    // load less records at the end (at least to match maxLoadedRows but even more if possible to avoid
                    // frequent load calls to server just for discarding loaded rows (limit it though to 200 to still keep data))
                    promise = this.foundset.loadLessRecordsAsync(
                        -Math.max(vp.size - this.performanceSettings.maxLoadedRows,
                            Math.min(200, Math.floor((vp.startIndex + vp.size - this.renderedStartIndex - this.renderedSize) / 2)))); // negative int
                }
            } else {
                const newLoadedSize = Math.min(this.getInitialPreferredLoadedSize(), allowedBounds.size);
                const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(visibleViewport[0], visibleViewport[1], allowedBounds.startIdx, allowedBounds.size, newLoadedSize);
                promise = this.smartLoadNeededViewport(computedInterval[0], computedInterval[1]);
            }
        }
        return promise;
    }

    // tries to center new interval of desired size around old interval without going past allowed bounds
    private centerAroundOldIntervalWithNewSizeIfPossible(oldStartIdx: number, oldSize: number, allowedStartIdx: number, allowedSize: number, newDesiredSize: number) {
        // try to compute center start index and compute size (if it doesn't fit in the beginning slide towards end of allowed as much as possible)
        let computedStart = Math.max(Math.min(oldStartIdx - Math.floor((newDesiredSize - oldSize) / 2), allowedStartIdx + allowedSize - 1), allowedStartIdx);
        let computedSize = Math.min(newDesiredSize, allowedStartIdx + allowedSize - computedStart);

        // if newDesiredSize is still not reached, see if we can slide the interval towards the beginning of allowed
        if (computedSize < newDesiredSize && computedStart > allowedStartIdx) {
            computedStart = Math.max(allowedStartIdx + allowedSize - newDesiredSize, allowedStartIdx);
            computedSize = Math.min(newDesiredSize, allowedStartIdx + allowedSize - computedStart);
        }

        return [computedStart, computedSize];
    }

    private adjustLoadedRowsIfNeeded() {
        this.runWhenThereIsNoPendingLoadRequest(() => {
            let newLoadingPromise: Promise<any>; // return value if this function calls any loadXYZ methods on the foundset property

            let neededVpStart: number;
            let neededVpSize: number;

            const fs = this.foundset;
            const vpStart = fs.viewPort.startIndex;
            const vpSize = fs.viewPort.size;

            // the purpose of this method is to request more rows from the server if needed;
            // the idea is to only load extra or less records instead of fully loading a new viewport - if possible

            // first calculate the maximum bounds in which we can load records (depending on whether it is paging or not)
            const allowedBounds = this.calculateAllowedLoadedDataBounds(); // { startIdx, size }
            const allowedStart = allowedBounds.startIdx;
            const allowedSize = allowedBounds.size;

            if (this.showPagination() && ((vpStart < allowedStart && vpStart + vpSize <= allowedStart) ||
                (vpStart >= allowedStart + allowedSize && vpStart + vpSize > allowedStart + allowedSize))) {
                // if the viewport is completely outside of the current page - load first batch of the page, don't try to make best guess closest to current viewport
                neededVpStart = allowedStart;
                neededVpSize = Math.min(this.getInitialPreferredLoadedSize(), allowedSize); // initial load loads more then scroll load batch size
            } else {
                // if loaded viewport bounds are not inside allowed bounds, or if too few rows are loaded, calculate the correct neededVpStart and neededVpSize
                // first shrink loaded to allowed bounds if needed
                neededVpStart = Math.min(allowedStart + allowedSize - 1, Math.max(vpStart, allowedStart));
                neededVpSize = Math.max(0, Math.min(allowedSize - (neededVpStart - allowedStart), vpSize - (neededVpStart - vpStart)));

                // now the 'shrinked to allowed bounds' loaded rows could be 0 in which case we need to load first rows of the allowed interval
                // or they could be only a few in which case we just need to check if it's enough of them or not (compared to getInitialPreferredLoadedSize())
                if (neededVpSize > 0) {
                    // all is ok, just make sure that minimum getInitialPreferredLoadedSize() are already loaded; if not, then load some more
                    if (neededVpSize < this.getInitialPreferredLoadedSize()) {
                        // center on currently loaded viewport and load more rows so that getInitialPreferredLoadedSize() is reached

                        const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(vpStart, vpSize, allowedStart, allowedSize, this.getInitialPreferredLoadedSize());
                        neededVpStart = computedInterval[0];
                        neededVpSize = computedInterval[1];
                    } // else needed bounds are already ok, we have at least the loaded batch size records already loaded
                } else {
                    // loaded bounds are completely outside of current allowed interval (page in this case); request default new one at start of page
                    neededVpStart = allowedStart;
                    neededVpSize = Math.min(this.getInitialPreferredLoadedSize(), allowedSize); // initial load loads more then scroll load batch size
                }
            }

            if (vpStart !== neededVpStart || vpSize !== neededVpSize) {
                this.log.debug(this.log.buildMessage(() => 'svy extra table * adjustLoadedRowsIfNeeded will do what is needed to have new loaded viewport of ('
                    + neededVpStart + ', ' + neededVpSize + ')'));
                newLoadingPromise = this.smartLoadNeededViewport(neededVpStart, neededVpSize);
            }

            return newLoadingPromise;
        });
    }

    private adjustRenderedViewportIfNeeded() {
        let changed = false;
        // don't allow rendered rows to shrink to less then 1 batch size due to foundset updates - as we might end up showing only one row
        // from a page for example while the page should actually be full of rows
        // also don't allow rendered to be outside of loaded viewport bounds or outside of allowed loaded bounds (calculating allowed is needed as
        // well because for example when the foundset is first shown server sends a viewport around the selection - that might not adhere to the
        // bounds of the page of selection - and we don't want to render records that are not in that page; the loaded bounds will be corrected
        // by adjustLoadedRowsIfNeeded() anyway but that will happen later/async)
        const vp = this.foundset.viewPort;
        const allowedBounds = this.calculateAllowedLoadedDataBounds(); // { startIdx, size }
        const correctedLoadedStartIdx = Math.max(vp.startIndex, allowedBounds.startIdx);
        const correctedLoadedSize = Math.min(vp.startIndex + vp.size, allowedBounds.startIdx + allowedBounds.size) - correctedLoadedStartIdx;
        const minRenderSize = Math.min(this.getInitialRenderSize(), correctedLoadedSize);

        if ((this.renderedStartIndex < correctedLoadedStartIdx && this.renderedStartIndex + this.renderedSize <= correctedLoadedStartIdx)
            || (this.renderedStartIndex >= correctedLoadedStartIdx + correctedLoadedSize && this.renderedStartIndex + this.renderedSize > correctedLoadedStartIdx + correctedLoadedSize)) {
            // rendered rows are completely outside the loaded rows; set size to -1 so we will correct them & start fresh with a maximum of minRenderSize rows rendered
            this.renderedStartIndex = 0;
            this.renderedSize = -1;
        }

        if (this.renderedSize < minRenderSize || this.renderedStartIndex < correctedLoadedStartIdx || this.renderedStartIndex + this.renderedSize > correctedLoadedStartIdx + correctedLoadedSize) {
            // 1. the rendered viewport has to be greater - we have more rows, use them
            // OR
            // 2. the rendered viewport is outside of the loaded rows; so put it inside the loaded rows
            // center new rendered viewport around current/old rendered viewport as much as possible
            const computedInterval = this.centerAroundOldIntervalWithNewSizeIfPossible(this.renderedStartIndex, this.renderedSize,
                correctedLoadedStartIdx, correctedLoadedSize, Math.max(minRenderSize, Math.min(this.renderedSize, correctedLoadedSize)));
            if (this.renderedStartIndex !== computedInterval[0]) {
                this.renderedStartIndex = computedInterval[0];
                changed = true;
            }
            if (this.renderedSize !== computedInterval[1]) {
                this.renderedSize = computedInterval[1];
                changed = true;
            }
        }

        this.log.debug(this.log.buildMessage(() => 'svy extra table * adjustRenderedViewportIfNeeded did correct the rendered interval to ' + this.renderedStartIndex + ', ' + this.renderedSize));

        return changed;
    }

    private smartLoadNeededViewport(neededVpStart: number, neededVpSize: number) {
        let newLoadingPromise: Promise<any>;

        const fs = this.foundset;
        const vpStart = fs.viewPort.startIndex;
        const vpSize = fs.viewPort.size;

        const neededVpEnd = neededVpStart + neededVpSize - 1;
        const vpEnd = vpStart + vpSize - 1;

        const intersectionStart = Math.max(neededVpStart, vpStart);
        const intersectionEnd = Math.min(neededVpEnd, vpEnd);

        if (intersectionStart <= intersectionEnd) {
            // we already have some or all records that we need; request or trim only the needed rows
            if (neededVpStart < vpStart) newLoadingPromise = fs.loadExtraRecordsAsync(neededVpStart - vpStart, true);
            else if (neededVpStart > vpStart) newLoadingPromise = fs.loadLessRecordsAsync(neededVpStart - vpStart, true);

            if (neededVpEnd < vpEnd) newLoadingPromise = fs.loadLessRecordsAsync(neededVpEnd - vpEnd, true);
            else if (neededVpEnd > vpEnd) newLoadingPromise = fs.loadExtraRecordsAsync(neededVpEnd - vpEnd, true);

            fs.notifyChanged();
        } else {
            // we have none of the needed records - just request the whole wanted viewport
            newLoadingPromise = fs.loadRecordsAsync(neededVpStart, neededVpSize);
        }

        return newLoadingPromise;
    }

    private selectedIndexesChanged(newSelectedIdxs: Array<number>, oldSelectedIdxs: Array<number>, noScrollToSelection?: boolean) {
        if (newSelectedIdxs.length > 0) {
            if (newSelectedIdxs !== oldSelectedIdxs || this.lastSelectionFirstElement !== newSelectedIdxs[0]) {
                this.updateSelection(newSelectedIdxs, oldSelectedIdxs);
                if (!noScrollToSelection && (this.lastSelectionFirstElement !== newSelectedIdxs[0])) {
                    this.scrollToSelectionNeeded = true;
                    this.log.debug('svy extra table * selectedRowIndexes changed; scrollToSelectionNeeded = true');
                    this.scrollToSelectionIfNeeded();
                }
            }
            this.lastSelectionFirstElement = newSelectedIdxs[0];
        } else this.lastSelectionFirstElement = -1;
    }

    private updateSelection(newValue: Array<number>, oldValue: Array<number>) {
        if (oldValue) {
            const toUnselect = oldValue.filter((i) => !newValue || newValue.indexOf(i) < 0);
            this.updateTableRowSelectionClass(toUnselect, '');
        }
        if (newValue) {
            const toSelect = newValue.filter((i) => !oldValue || oldValue.indexOf(i) < 0);
            this.updateTableRowSelectionClass(toSelect, this.selectionClass);
        }
    }

    private updateTableRowSelectionClass(rowsFoundsetIdxArray: Array<number>, rowSelectionClass: string) {
        if (!this.tbody) return;
        const trChildren = this.tbody.nativeElement.children;
        if (trChildren) {
            for (const value of rowsFoundsetIdxArray) {
                const trIndex = value - this.renderedStartIndex;
                if (trIndex >= (this.topSpaceDiv ? 1 : 0) && trIndex < trChildren.length - (this.bottomSpaceDiv ? 1 : 0)) {
                    const tr = trChildren.item(trIndex + (this.topSpaceDiv ? 1 : 0));
                    if (this.rowStyleClassDataprovider && this.rowStyleClassDataprovider[value % this.pageSize])
                        tr.className = this.rowStyleClassDataprovider[value % this.pageSize] + ' ' + rowSelectionClass;
                    else tr.className = rowSelectionClass;
                }
            }
        }
    }
    private getInitialRenderSize() {
        const potentialInitialRenderSize = Math.floor(this.batchSizeForRenderingMoreRows * 3);
        return this.pageSize > 0 ? Math.min(potentialInitialRenderSize, this.pageSize) : potentialInitialRenderSize;
    }

    // this is actually the preferred viewport size that the server will send automatically when foundset data completely changes
    // it should be maximum pageSize if that is > 0 or (when we implement it) -1 (so auto paging)
    private getInitialPreferredLoadedSize() {
        const potentialInitialViewportSize = Math.floor(this.batchSizeForLoadingMoreRows * 2.5);
        return (this.pageSize > 0 && this.pageSize < potentialInitialViewportSize) ? this.pageSize : potentialInitialViewportSize;
    }

    private setCellDivValue(column: Column, divElement: HTMLDivElement, value: any) {
        const fixedValue = value ? value : '';
        if (column.showAs === 'html') {
            divElement.innerHTML = fixedValue;
        } else if (column.showAs === 'sanitizedHtml') {
            divElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, fixedValue);
        } else {
            divElement.textContent = fixedValue;
        }
    }

    private getDisplayValue(input: any, valuelist: IValuelist) {
        if (valuelist) {
            for (const value of valuelist) {
                if (input === value.realValue) {
                    return value.displayValue;
                }
            }
        }
        return input;
    }

    private getValuelist(column: Column, rowIdxInFoundsetViewport: number): IValuelist {
        if (!column.valuelist) return null;
        if (instanceOfValuelist(column.valuelist)) return column.valuelist;
        else return column.valuelist[rowIdxInFoundsetViewport];
    }

    private getRowIndexInFoundset(rowElement: Element) {
        if (rowElement) {
            // take the index in loaded viewport from dom element (to make sure we really target the same row
            // no matter the values of renderedSize and renderedStartIndex (they might have been altered before for rendering))
            // something else alreaady and then they are out-of-sync with child elements already)
            // so we can't rely on the fact that the Nth DOM child is the Nth relative to renderedStartIndex in some cases
            const row_column = rowElement.children.item(0)['row_column'];
            if (row_column) {
                return row_column.idxInFs;
            }
        }
        return -1;
    }

    /**
     * Tries to find and return the first row element in the visible viewport.
     *
     * If due to a scroll operation there is some blank space (records that are being loaded to be rendered but not yet there)
     * on top, then it WILL NOT return that first visible row (that is somewhere in the middle of the visible area).
     */
    private getFirstVisibleChild() {
        const tbodyScrollTop = this.tbody.nativeElement.scrollTop;
        const children = this.tbody.nativeElement.children;
        for (let i = (this.topSpaceDiv ? 1 : 0); i < children.length - (this.bottomSpaceDiv ? 1 : 0); i++) {
            const child = children[i] as HTMLElement;
            if (child.offsetTop >= tbodyScrollTop) {
                if (child.offsetTop - tbodyScrollTop < this.getAverageRowHeight() * 1.1) {
                    this.log.debug('svy extra table * getFirstVisibleChild; found the first visible row...');
                    return children[i];
                } else {
                    // eslint-disable-next-line max-len
                    this.log.debug('svy extra table * getFirstVisibleChild; found first visible row - but it is LOWER then expected... blank space on top - probably waiting for rows to load or render there');
                    return null;
                }
            }
        }
        this.log.debug('svy extra table * getFirstVisibleChild; DID NOT find the first visible row...');
        return null;
    }

    private getLastVisibleChild() {
        const tbodyScrollBottom = this.tbody.nativeElement.scrollTop + this.tbody.nativeElement.clientHeight;
        const children = this.tbody.nativeElement.children;
        for (let i = (this.topSpaceDiv ? 1 : 0); i < children.length - (this.bottomSpaceDiv ? 1 : 0); i++) {
            const child = children[i] as HTMLElement;
            if (child.offsetTop + child.offsetHeight >= tbodyScrollBottom) {
                if (i > (this.topSpaceDiv ? 1 : 0)) return children[i - 1];
                return children[i];
            }
        }
        return children.length > (this.topSpaceDiv ? 1 : 0) + (this.bottomSpaceDiv ? 1 : 0) ? children[children.length - 1 - (this.bottomSpaceDiv ? 1 : 0)] : undefined;
    }

    private getAverageRowHeight() {
        let averageRowHeight: number;
        const children = this.tbody.nativeElement.children;
        const realRowCount = children.length - (this.topSpaceDiv ? 1 : 0) - (this.bottomSpaceDiv ? 1 : 0);
        if (realRowCount > 0) {
            const firstChild = children.item((this.topSpaceDiv ? 1 : 0)) as HTMLElement;
            const lastChild = children.item(children.length - 1 - (this.bottomSpaceDiv ? 1 : 0)) as HTMLElement;
            averageRowHeight = Math.round((lastChild.offsetTop + lastChild.offsetHeight - firstChild.offsetTop) / realRowCount);
        } else {
            averageRowHeight = 25; // it won't be relevant anyway; it is equal to the default minRowHeight from .spec
        }
        if (this.oldAverageRowHeight !== averageRowHeight) {
            this.oldAverageRowHeight = averageRowHeight;
            this.log.debug(this.log.buildMessage(() => 'svy extra table * getAverageRowHeight changed to ' + averageRowHeight));
        }
        return averageRowHeight;
    }

    private calculateTableWidth() {
        let tableWidth = 0;
        if (this.columns) {
            for (let i = 0; i < this.columns.length; i++) {
                if (!this.isAutoResizeColumn(i) && this.getNumberFromPxString(this.columns[i].initialWidth) > 0) {
                    const w = this.getNumberFromPxString(this.columns[i].width);
                    if (w > -1) {
                        tableWidth += w;
                    }
                }
            }
        }
        return tableWidth;
    }

    private scrollIntoView(child: HTMLElement, parent: Element, alignTo: boolean) {
        let scrollFromTop: number;
        if (alignTo) {
            scrollFromTop = child.offsetTop;
        } else {
            scrollFromTop = child.offsetTop - parent.clientHeight + child.offsetHeight;
        }
        if (scrollFromTop < 0) {
            scrollFromTop = 0;
        }
        parent.scrollTop = scrollFromTop;
    }

    private getNumberFromPxString(s: string) {
        let numberFromPxString = -1;
        if (s) {
            let x: any = s.trim().toLowerCase();
            if (x.indexOf('px') === s.length - 2) {
                x = s.substring(0, s.length - 2);
            }
            if ((x - parseFloat(s) + 1) >= 0) {
                numberFromPxString = parseInt(s, 10);

            }
        }
        return numberFromPxString;
    }

    private isAutoResizeColumn(columnIdx: number): boolean {
        return this.columns[columnIdx].autoResize || (this.columns[columnIdx].width === 'auto');
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

    private getAutoColumnPercentage() {
        let nrColumnsWithPercentage = 0;
        let sumColumnsWithPercentage = 0;

        for (const autoColumnIdx of Object.keys(this.autoColumns.columns)) {
            let w = this.columns[autoColumnIdx].width;
            if (w) {
                w = w.trim();
                if (w.indexOf('%') === w.length - 1) {
                    w = w.substring(0, w.length - 1);
                    if ((w - parseFloat(w) + 1) >= 0) {
                        nrColumnsWithPercentage++;
                        sumColumnsWithPercentage += parseInt(w, 10);
                    }
                }
            }
        }

        return nrColumnsWithPercentage ? (100 - sumColumnsWithPercentage) / (this.autoColumns.count - nrColumnsWithPercentage) : 0;
    }

    private getAutoResizeColumnsWidth() {
        let autoColumnsWidth = 0;
        for (let i = 0; i < this.columns.length; i++) {
            if (this.autoColumns.autoResize[i] && this.autoColumns.minWidth[i] > 0) {
                autoColumnsWidth += this.getNumberFromPxString(this.columns[i].width);
            }
        }
        return autoColumnsWidth;
    }

    private updateAutoColumnsWidth(delta: number) {
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

    private getFoundsetIndexFromViewportIndex(idx: number) {
        return this.foundset.viewPort.startIndex + idx;
    }

    private getViewportIndexFromFoundsetIndex(idx: number) {
        return idx - this.foundset.viewPort.startIndex;
    }

    // this function also adjusts current page if needed (if it's after the foundset size for example)
    private calculateAllowedLoadedDataBounds() {
        let allowedStart: number;
        let allowedSize: number;

        const fs = this.foundset;
        const serverSize = fs.serverSize;
        if (this.showPagination()) {
            // paging mode only keeps data for the showing page - at maximum
            allowedStart = this.pageSize * (this.currentPage - 1);
            if (!this.foundset.hasMoreRows && allowedStart >= serverSize) {
                // this page no longer exists; it is after serverSize; adjust current page and that watch on that will request the correct viewport
                this.setCurrentPage(this.getPageForIndex(serverSize - 1));
                allowedStart = this.pageSize * (this.currentPage - 1);
            }

            let newAllowedSize: number;
            if (allowedStart >= serverSize && this.foundset.hasMoreRows) {
                newAllowedSize = this.pageSize;
            } else {
                newAllowedSize = serverSize - allowedStart;
            }

            allowedSize = Math.min(this.pageSize, newAllowedSize);
        } else {
            // table is not going to show/use pages; so we can think of it as one big page
            this.setCurrentPage(1); // just to be sure - we are not paging so we are on first "page"

            allowedStart = 0;
            allowedSize = serverSize;
        }
        return { startIdx: allowedStart, size: allowedSize };
    }

    private getPageForIndex(idx: number) {
        return Math.floor(Math.max(idx, 0) / this.pageSize) + 1;
    }

    private getComponentWidth() {
        if (this.componentWidth === -1) {
            this.componentWidth = Math.floor(this.getNativeElement().clientWidth);
            this.updateTBodyStyle();
        }
        return this.componentWidth;
    }

    private updateTBodyStyle() {
        const tBodyStyle: { width?: string; top?: string; marginBottom?: string } = {};
        const componentWidth = this.getComponentWidth();
        tBodyStyle.width = componentWidth + 'px';
        const tblHead = this.getNativeElement().querySelector('thead');
        if (this.isVisible(tblHead)) {
            tBodyStyle.top = tblHead.clientHeight + 'px';
        }
        if (this.showPagination()) {
            if (this.pager) {
                tBodyStyle.marginBottom = (this.pager.nativeElement.clientHeight + 2) + 'px';
            }
        }
        if (this.responsiveDynamicHeight && this.responsiveHeight > 0) {
            let h = 0;
            if (this.pager) {
                h += this.pager.nativeElement.clientHeight;
            }
            const rows = this.getNativeElement().querySelectorAll('tr');
            for (let i = 0; i < rows.length; i++) {
                h += rows.item(i).clientHeight;
                if (h > this.responsiveHeight) {
                    break;
                }
            }

            // make sure no scrollbar is shown in this scenario
            if (h < this.responsiveHeight) {
                tBodyStyle['overflow-y'] = 'hidden';
            } else  {
				tBodyStyle['overflow-y'] = 'auto';
			}
        }

        for (const key of Object.keys(tBodyStyle)) {
            this.tbody.nativeElement.style[key] = tBodyStyle[key];
        }
    }


    private setCurrentPage(newCurrentPage: number) {
        if (this.currentPage !== newCurrentPage) {
            this.currentPage = newCurrentPage;
            this.renderedStartIndex = 0;
            this.renderedSize = -1; // when we change page make sure rendered rows will be as many as needed again (just in case for example previously rendered rows were just a few of last page)
            this.adjustLoadedRowsIfNeeded();
        }
    }
    private showPagination() {
        return this.pageSize && this.foundset && (this.foundset.serverSize > this.pageSize || this.foundset.hasMoreRows);
    }

    private doFoundsetSQLSort(column: number) {
        if (this.columns[column].dataprovider) {
            const sortCol = this.columns[column].dataprovider.idForFoundset;
            let sqlSortDirection: ('asc' | 'desc') = 'asc';
            if (this.foundset.sortColumns) {
                const sortColumnsA = this.foundset.sortColumns.split(' ');
                if (sortCol === sortColumnsA[0]) {
                    sqlSortDirection = sortColumnsA[1].toLowerCase() === 'asc' ? 'desc' : 'asc';
                }
            }
            this.foundset.sortColumns = sortCol + ' ' + sqlSortDirection;
            this.foundset.sort([{ name: sortCol, direction: sqlSortDirection }]);
        }
    }

    private getVisibleArea() {
        // foundsetSize or pageSize     -> scrollHeightPX
        // visibleSize                  -> visibleAreaHeightPX
        // visibleStartIndex            -> visibleAreaScrollStartPX + previousPages
        const scrollHeightPX = this.tbody.nativeElement.scrollHeight;
        const visibleAreaHeightPX = this.tbody.nativeElement.clientHeight;
        const visibleAreaScrollStartPX = this.tbody.nativeElement.scrollTop;

        let visibleViewportStart: number;
        let visibleViewportSize: number;
        const fs = this.foundset;

        // calculate values as if scrollbar was not there for now
        if (this.showPagination()) {
            // table is using pages; so visible index is previous pages, what we add now + offset in current page (which we add later if scrollbar is present)
            visibleViewportStart = this.pageSize * (this.currentPage - 1);
            visibleViewportSize = Math.min(this.pageSize, fs.serverSize - visibleViewportStart);
        } else {
            visibleViewportStart = 0;
            visibleViewportSize = fs.serverSize;
        }

        // if scrollbar is there, adjust values
        // so we have a scrollbar and content is scrolled; add that scroll offset into visibleViewportStart and compute visibleAreaSize based on scroll height

        // visibleAreaScrollStartPX ... visibleViewportStart(?)
        // scrollHeightPX           ... visibleViewportSize (current which means all rows that would be in the scrollable area)
        visibleViewportStart += Math.floor(visibleAreaScrollStartPX * (visibleViewportSize / scrollHeightPX));

        // visibleAreaHeightPX ... visibleViewportSize(?)
        // scrollHeightPX      ... visibleViewportSize (current which means all rows that would be in the scrollable area)
        visibleViewportSize = Math.ceil(visibleAreaHeightPX * (visibleViewportSize / scrollHeightPX));

        this.log.spam(this.log.buildMessage(() => 'svy extra table * getVisibleArea: ' + visibleViewportStart + ', ' + visibleViewportSize));
        this.log.spam(this.log.buildMessage(() => 'svy extra table * getVisibleArea scrollTop: ' + this.tbody.nativeElement.scrollTop));

        return [visibleViewportStart, visibleViewportSize];
    }

    private isVisible(elem: HTMLElement) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }
}

export class Column extends BaseCustomObject {
    id: string;
    showAs: string;
    headerText: string;
    headerStyleClass: string;
    styleClass: string;
    styleClassDataprovider: LinkedDataproviders;
    dataprovider: LinkedDataproviders;
    autoResize: boolean;
    valuelist: IValuelist | Array<IValuelist>;
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
    idForFoundset: string;
}

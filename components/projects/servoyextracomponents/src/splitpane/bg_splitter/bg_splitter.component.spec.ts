import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, viewChild, ElementRef } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BGSplitter } from './bg_splitter.component';
import { BGPane } from './bg_pane.component';

const HOST_CONSTRAINED_WIDTH = 1290;
const HOST_FULL_CONTAINER_WIDTH = 1720;
const DIV_LOCATION = 0.65;
// In jsdom the handler div has no rendered layout, so offsetWidth is 0; pane2.left === pos.
const HANDLER_OFFSET_WIDTH = 0;

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'bg-splitter-test-host',
    template: `
        <bg-splitter [orientation]="orientation" [divLocation]="divLocation" (onDividerChange)="onDividerChange($event)">
            <bg-pane [minSize]="pane1MinSize"><div class="pane1-content"></div></bg-pane>
            <bg-pane [minSize]="pane2MinSize"><div class="pane2-content"></div></bg-pane>
        </bg-splitter>
    `,
    standalone: true,
    imports: [BGSplitter, BGPane]
})
class TestHost {
    orientation = 'horizontal';
    divLocation: number = DIV_LOCATION;
    pane1MinSize = 0;
    pane2MinSize = 0;
    readonly splitter = viewChild(BGSplitter);
    readonly splitterRef = viewChild(BGSplitter, { read: ElementRef });
    dividerChanges: number[] = [];
    onDividerChange(value: number) {
        this.dividerChanges.push(value);
    }
}

const getInnerHost = (fixture: ComponentFixture<TestHost>): HTMLElement =>
    (fixture.componentInstance.splitterRef()!.nativeElement as HTMLElement).querySelector('.split-panes') as HTMLElement;

const getPaneElements = (fixture: ComponentFixture<TestHost>) => {
    const host = getInnerHost(fixture);
    return Array.from(host.children).filter((c) => c.className.indexOf('split-pane') === 0) as HTMLElement[];
};

const rect = (width: number): DOMRect => ({
    left: 0, right: width, top: 0, bottom: 300, width, height: 300, x: 0, y: 0, toJSON: () => ({})
} as DOMRect);

describe('BGSplitter (SVY-21650 nested init width)', () => {
    let fixture: ComponentFixture<TestHost>;
    let originalGetBoundingClientRect: typeof HTMLDivElement.prototype.getBoundingClientRect;

    /**
     * The measured host (BGSplitter's `#element` .split-panes div) only exists after the first
     * render, and the deferred `afterNextRender` initial measurement reads its width during that
     * same stabilization. To control the measured width deterministically and before any read,
     * we intercept `getBoundingClientRect` on the HTMLDivElement prototype but ONLY answer for the
     * `.split-panes` host — every other element falls through to the real implementation. Per
     * AGENTS.md we save the original and restore it in afterEach (never vi.stubGlobal). `currentHostWidth`
     * can be changed on the fly to simulate a layout reflow.
     */
    let currentHostWidth = HOST_CONSTRAINED_WIDTH;
    const installHostWidthStub = () => {
        vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
            if (this.classList && this.classList.contains('split-panes')) {
                return rect(currentHostWidth);
            }
            return originalGetBoundingClientRect.call(this);
        });
    };

    /**
     * Model the real race: the constraining `.split-paneN` classes land only during the first render,
     * so the host measures the FULL container width until a `.split-pane1` child is actually present
     * and the CONSTRAINED pane width once it is. A pre-fix synchronous read (inside ngAfterContentInit,
     * before that render) sees the full width and mis-sizes the panes; the deferred afterNextRender
     * read (after that render) sees the constrained width.
     */
    const installRaceHostWidthStub = () => {
        vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
            if (this.classList && this.classList.contains('split-panes')) {
                const paneClassLanded = Array.from(this.children).some((c) => (c as HTMLElement).classList.contains('split-pane1'));
                return rect(paneClassLanded ? HOST_CONSTRAINED_WIDTH : HOST_FULL_CONTAINER_WIDTH);
            }
            return originalGetBoundingClientRect.call(this);
        });
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHost],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(TestHost);
        originalGetBoundingClientRect = HTMLDivElement.prototype.getBoundingClientRect;
        currentHostWidth = HOST_CONSTRAINED_WIDTH;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    const mountAndSettle = async () => {
        installHostWidthStub();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
    };

    describe('constrained init width', () => {
        it('sizes both panes from the constrained host width, not the full container width (the core regression)', async () => {
            // Model the real race: the constraining .split-paneN classes (and the resulting constrained
            // host box) are only present AFTER the first render flush. So any synchronous read during the
            // ngAfterContentInit pass (pre-fix timing) sees the full container width; only a deferred read
            // (the afterNextRender fix) sees the constrained width. We flip the reported width to the
            // constrained value only after the first detectChanges/stabilize.
            installRaceHostWidthStub();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            await fixture.whenStable();

            const panes = getPaneElements(fixture);
            const expectedPane1 = Math.round(HOST_CONSTRAINED_WIDTH * DIV_LOCATION);
            const expectedPane2Left = expectedPane1 + HANDLER_OFFSET_WIDTH;

            expect(parseInt(panes[0].style.width, 10)).toBe(expectedPane1);
            expect(parseInt(panes[1].style.left, 10)).toBe(expectedPane2Left);

            // The regression: a synchronous (first-read) measurement would have produced this wider pane.
            const wrongPane1 = Math.round(HOST_FULL_CONTAINER_WIDTH * DIV_LOCATION);
            expect(parseInt(panes[0].style.width, 10)).not.toBe(wrongPane1);
        });

        it('does not measure synchronously inside ngAfterContentInit (the pre-fix regression point)', async () => {
            // The fix moves the initial adjustLocation OUT of ngAfterContentInit's synchronous body
            // into a deferred afterNextRender callback. The pre-fix code measured synchronously at the
            // end of ngAfterContentInit — before the render that writes the .split-paneN classes and
            // lays out the constrained host — which is exactly why it read the wrong (full container)
            // width. Mount cleanly first so indices and the handler are in place, then dirty the pane
            // width and invoke ngAfterContentInit again in isolation (no render flush afterwards). The
            // run-once guard means it schedules nothing, but the point is: ngAfterContentInit's own body
            // must not size the pane. If a synchronous adjustLocation were (re)introduced there, the
            // width would be rewritten to 839 immediately. It must stay the dirtied value.
            await mountAndSettle();
            const splitter = fixture.componentInstance.splitter()!;
            const panes = getPaneElements(fixture);
            expect(parseInt(panes[0].style.width, 10)).toBe(Math.round(HOST_CONSTRAINED_WIDTH * DIV_LOCATION));

            panes[0].style.width = '7px';
            splitter.ngAfterContentInit();

            expect(parseInt(panes[0].style.width, 10)).toBe(7);
        });
    });

    describe('initial adjust deferred and run-once', () => {
        it('defers the initial measurement through afterNextRender and schedules it only once', async () => {
            await mountAndSettle();

            const splitter = fixture.componentInstance.splitter()!;
            const panes = getPaneElements(fixture);
            const expectedPane1 = Math.round(HOST_CONSTRAINED_WIDTH * DIV_LOCATION);
            expect(parseInt(panes[0].style.width, 10)).toBe(expectedPane1);

            // Dirty the pane width and re-run ngAfterContentInit: the run-once guard must prevent a
            // second deferred measurement from re-applying the width.
            panes[0].style.width = '1px';
            splitter.ngAfterContentInit();
            await fixture.whenStable();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(parseInt(panes[0].style.width, 10)).toBe(1);
        });
    });

    describe('window:resize corrective recalc (debounced 50ms)', () => {
        it('recalculates against the current host width only after the 50ms debounce elapses', async () => {
            await mountAndSettle();

            const splitter = fixture.componentInstance.splitter()!;

            vi.useFakeTimers();
            const recalcSpy = vi.spyOn(splitter, 'recalculate');

            // the host now reports a new (narrower) reference width after a reflow.
            currentHostWidth = 1000;

            splitter.onResize();
            vi.advanceTimersByTime(49);
            expect(recalcSpy).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);
            expect(recalcSpy).toHaveBeenCalledTimes(1);

            const panes = getPaneElements(fixture);
            expect(parseInt(panes[0].style.width, 10)).toBe(Math.round(1000 * DIV_LOCATION));
        });

        it('coalesces a burst of resize events into a single recalc', async () => {
            await mountAndSettle();

            const splitter = fixture.componentInstance.splitter()!;

            vi.useFakeTimers();
            const recalcSpy = vi.spyOn(splitter, 'recalculate');

            splitter.onResize();
            vi.advanceTimersByTime(20);
            splitter.onResize();
            vi.advanceTimersByTime(20);
            splitter.onResize();
            vi.advanceTimersByTime(50);

            expect(recalcSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('recalculate does not emit onDividerChange', () => {
        it('does not push a new divider location when only the reference box changed', async () => {
            await mountAndSettle();

            const splitter = fixture.componentInstance.splitter()!;
            fixture.componentInstance.dividerChanges = [];
            splitter.recalculate();

            expect(fixture.componentInstance.dividerChanges).toHaveLength(0);
        });
    });

    describe('resize timeout cleared on destroy', () => {
        it('does not run a pending recalc after the component is destroyed', async () => {
            await mountAndSettle();

            const splitter = fixture.componentInstance.splitter()!;

            vi.useFakeTimers();
            const recalcSpy = vi.spyOn(splitter, 'recalculate');

            splitter.onResize();
            splitter.ngOnDestroy();
            vi.advanceTimersByTime(100);

            expect(recalcSpy).not.toHaveBeenCalled();
        });
    });
});

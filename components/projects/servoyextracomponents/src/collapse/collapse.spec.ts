import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraCollapse, Collapsible } from './collapse';

function createDefaultCollapsibles(): Collapsible[] {
    const mockStateHolder = {
        getChangedKeys: () => new Set(),
        notifyChangeListener: () => {}
    };
    const collapsibles = [
        { getStateHolder: () => mockStateHolder } as any as Collapsible,
        { getStateHolder: () => mockStateHolder } as any as Collapsible
    ];

    collapsibles[0].collapsibleId = '1';
    collapsibles[0].isCollapsed = false;
    collapsibles[0].headerHtml = 'Header 1';
    collapsibles[0].headerStyleClass = 'header-class';
    collapsibles[0].bodyStyleClass = 'body-class';
    collapsibles[0].collapsibleHtml = 'Content 1';
    collapsibles[0].form = '';
    collapsibles[0].relationName = '';
    collapsibles[0].cards = [];
    collapsibles[0].styleClass = 'card-class';
    collapsibles[0].collapsedIconName = 'collapsed-icon';
    collapsibles[0].expandedIconName = 'expanded-icon';
    collapsibles[0].iconLocation = 'RIGHT';
    collapsibles[0].minResponsiveHeight = 100;
    collapsibles[0].maxResponsiveHeight = 200;

    collapsibles[1].collapsibleId = '2';
    collapsibles[1].isCollapsed = true;
    collapsibles[1].headerHtml = 'Header 2';
    collapsibles[1].headerStyleClass = 'header-class';
    collapsibles[1].bodyStyleClass = 'body-class';
    collapsibles[1].collapsibleHtml = 'Content 2';
    collapsibles[1].form = '';
    collapsibles[1].relationName = '';
    collapsibles[1].cards = [];
    collapsibles[1].styleClass = 'card-class';
    collapsibles[1].collapsedIconName = 'collapsed-icon';
    collapsibles[1].expandedIconName = 'expanded-icon';
    collapsibles[1].iconLocation = 'RIGHT';
    collapsibles[1].minResponsiveHeight = 100;
    collapsibles[1].maxResponsiveHeight = 200;

    return collapsibles;
}

describe('ServoyExtraCollapse', () => {
    let fixture: ComponentFixture<ServoyExtraCollapse>;
    let component: ServoyExtraCollapse;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraCollapse],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraCollapse);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('accordionMode', true);
        fixture.componentRef.setInput('collapsibles', createDefaultCollapsibles());
        fixture.componentRef.setInput('expandedIndices', undefined);
        fixture.componentRef.setInput('styleClass', undefined);
        fixture.componentRef.setInput('tabSeq', undefined);
        fixture.componentRef.setInput('onCardClicked', undefined);
        fixture.componentRef.setInput('onCollapsibleHidden', undefined);
        fixture.componentRef.setInput('onCollapsibleShown', undefined);
        fixture.componentRef.setInput('onHeaderClicked', undefined);
        fixture.componentRef.setInput('onHeaderDoubleClicked', undefined);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should mount and render the component', async () => {
        const el = fixture.nativeElement.querySelector('.svy-collapse');
        expect(el).not.toBeNull();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should show a style class', async () => {
        const el = fixture.nativeElement.querySelector('.svy-collapse');
        expect(el.classList.contains('mystyleclass')).toBe(false);
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('mystyleclass')).toBe(true);
    });

    it('should show more than 1 style class', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.svy-collapse');
        expect(el.classList.contains('mystyleclass')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('classA')).toBe(true);
        expect(el.classList.contains('classB')).toBe(true);
    });

    it('should render expanded collapsible content and hide collapsed content', async () => {
        const content1 = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(content1).toContain('Content 1');
        expect(content1).not.toContain('Content 2');
    });

    it('accordion mode enabled - clicking collapsed header collapses the open one', async () => {
        component.toggle(1);
        fixture.detectChanges();
        await fixture.whenStable();
        const text = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(text).toContain('Content 2');
        expect(text).not.toContain('Content 1');
    });

    it('accordion mode disabled - both can be open', async () => {
        fixture.componentRef.setInput('accordionMode', false);
        fixture.detectChanges();
        await fixture.whenStable();
        component.toggle(1);
        fixture.detectChanges();
        await fixture.whenStable();
        const text = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(text).toContain('Content 1');
        expect(text).toContain('Content 2');
    });

    it('should handle card click event', async () => {
        const onCardClicked = vi.fn();
        fixture.componentRef.setInput('onCardClicked', onCardClicked);
        fixture.detectChanges();
        await fixture.whenStable();
        const body = fixture.nativeElement.querySelector('.svy-collapse-card-body');
        if (body) {
            body.click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(onCardClicked).toHaveBeenCalled();
        }
    });

    it('should handle collapse hidden event', async () => {
        const onCollapsibleHidden = vi.fn();
        fixture.componentRef.setInput('onCollapsibleHidden', onCollapsibleHidden);
        fixture.detectChanges();
        await fixture.whenStable();
        component.toggle(0);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(onCollapsibleHidden).toHaveBeenCalled();
    });

    it('should handle collapse shown event', async () => {
        const onCollapsibleShown = vi.fn();
        fixture.componentRef.setInput('onCollapsibleShown', onCollapsibleShown);
        fixture.detectChanges();
        await fixture.whenStable();
        component.toggle(1);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(onCollapsibleShown).toHaveBeenCalled();
    });

    it('should handle header click event', async () => {
        vi.useFakeTimers();
        const onHeaderClicked = vi.fn().mockResolvedValue(true);
        fixture.componentRef.setInput('onHeaderClicked', onHeaderClicked);
        fixture.detectChanges();

        const header = fixture.nativeElement.querySelector('.svy-collapse-header');
        expect(header).not.toBeNull();
        header.click();
        vi.advanceTimersByTime(350);
        fixture.detectChanges();
        expect(onHeaderClicked).toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('should handle header dblclick event', async () => {
        const onHeaderDoubleClicked = vi.fn().mockResolvedValue(true);
        fixture.componentRef.setInput('onHeaderDoubleClicked', onHeaderDoubleClicked);
        fixture.detectChanges();
        await fixture.whenStable();

        const header = fixture.nativeElement.querySelector('.svy-collapse-header');
        expect(header).not.toBeNull();
        header.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(onHeaderDoubleClicked).toHaveBeenCalled();
    });

    it('should open a collapsible via expandedIndices input', async () => {
        const updated = createDefaultCollapsibles();
        updated[0].isCollapsed = true;
        updated[1].isCollapsed = false;
        fixture.componentRef.setInput('expandedIndices', [1]);
        fixture.componentRef.setInput('collapsibles', updated);
        fixture.detectChanges();
        await fixture.whenStable();
        const text = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(text).toContain('Content 2');
    });

    it('should show and hide a collapsible via toggle() API', async () => {
        const text1 = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(text1).toContain('Content 1');
        component.toggle(0);
        fixture.detectChanges();
        await fixture.whenStable();
        const text2 = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(text2).not.toContain('Content 1');
        component.toggle(0);
        fixture.detectChanges();
        await fixture.whenStable();
        const text3 = fixture.nativeElement.querySelector('.svy-collapse')?.textContent;
        expect(text3).toContain('Content 1');
    });
});

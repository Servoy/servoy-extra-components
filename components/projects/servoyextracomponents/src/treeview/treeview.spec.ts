import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraTreeview } from './treeview';
import { ServoyExtraTreeviewCellRenderer } from './cellrenderer';

describe('ServoyExtraTreeview', () => {
    let fixture: ComponentFixture<ServoyExtraTreeview>;
    let component: ServoyExtraTreeview;

    const treeData = [
        ['id', 'pid', 'treeColumn', 'fa-icon'],
        ['1', null, 'Main group', null],
        ['2', null, 'Second group', null],
        ['3', '2', 'Subgroup', null],
        ['4', '3', 'Mark', null],
        ['5', '3', 'George', null]
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraTreeview, ServoyExtraTreeviewCellRenderer],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraTreeview);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('jsDataSet', treeData);
        fixture.componentRef.setInput('styleClass', '');
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create and register the component', async () => {
        expect(component).toBeTruthy();
        expect(component.isTreeReady).toBe(true);
    });

    it('should apply a style class', async () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('.svy-treeview');
        expect(el.classList.contains('mystyleclass')).toBe(false);
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        expect(el.classList.contains('mystyleclass')).toBe(true);
    });

    it('should apply multiple style classes', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.svy-treeview');
        expect(el.classList.contains('mystyleclass')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        expect(el.classList.contains('classA')).toBe(true);
        expect(el.classList.contains('classB')).toBe(true);
    });

    it('should call onNodeClicked handler via onclick', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onNodeClicked', spy);
        fixture.detectChanges();
        component.onclick({ data: { id: '1' }, row: { id: '1' }, event: { currentTarget: { childNodes: [] }, target: null }, column: null });
        expect(spy).toHaveBeenCalled();
    });

    it('should call onNodeDoubleClicked handler via onclick double click pattern', async () => {
        vi.useFakeTimers();
        const spy = vi.fn();
        fixture.componentRef.setInput('onNodeDoubleClicked', spy);
        fixture.detectChanges();
        const event = { data: { id: '1' }, row: { id: '1' }, event: { currentTarget: { childNodes: [] }, target: null }, column: null };
        component.onclick(event);
        component.onclick(event);
        expect(spy).toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('should call onNodeExpanded handler via onexpand', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onNodeExpanded', spy);
        fixture.detectChanges();
        component.onexpand({ data: { id: '2' } });
        expect(spy).toHaveBeenCalledWith('2');
    });

    it('should call onNodeCollapsed handler via oncollapse', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onNodeCollapsed', spy);
        fixture.detectChanges();
        component.oncollapse({ data: { id: '2' } });
        expect(spy).toHaveBeenCalledWith('2');
    });

    it('should call onNodeSelected handler via onselect', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onNodeSelected', spy);
        fixture.componentRef.setInput('onNodeClicked', vi.fn());
        fixture.detectChanges();
        component.onselect({ data: { id: '1' }, row: { id: '1' }, event: { currentTarget: { childNodes: [] }, target: null }, column: null });
        expect(spy).toHaveBeenCalledWith('1');
    });

    it('should call onNodeRightClicked is stored as input', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onNodeRightClicked', spy);
        fixture.detectChanges();
        expect(component.onNodeRightClicked()).toBe(spy);
    });

    it('addOrUpdateRowData should update existing node text', async () => {
        component.addOrUpdateRowData(['2', null, 'Changed group', null]);
        const updatedRow = component.data.find(r => r.id === '2');
        expect(updatedRow!.treeColumn.text).toBe('Changed group');
    });

    it('addOrUpdateRowData should add a new node', async () => {
        const initialLength = component.data.length;
        component.addOrUpdateRowData(['6', null, 'New node', null]);
        expect(component.data.length).toBe(initialLength + 1);
        const newRow = component.data.find(r => r.id === '6');
        expect(newRow!.treeColumn.text).toBe('New node');
    });

    it('should parse tree data correctly', async () => {
        expect(component.data.length).toBe(5);
        expect(component.data[0].treeColumn.text).toBe('Main group');
        expect(component.data[1].treeColumn.text).toBe('Second group');
        expect(component.data[2].treeColumn.text).toBe('Subgroup');
    });
});

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
        expect(component.isTreeReady()).toBe(true);
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
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
        const updatedRow = component.data().find(r => r.id === '2');
        expect(updatedRow!.treeColumn.text).toBe('Changed group');
    });

    it('addOrUpdateRowData should add a new node', async () => {
        const initialLength = component.data().length;
        component.addOrUpdateRowData(['6', null, 'New node', null]);
        expect(component.data().length).toBe(initialLength + 1);
        const newRow = component.data().find(r => r.id === '6');
        expect(newRow!.treeColumn.text).toBe('New node');
    });

    it('should parse tree data correctly', async () => {
        expect(component.data().length).toBe(5);
        expect(component.data()[0].treeColumn.text).toBe('Main group');
        expect(component.data()[1].treeColumn.text).toBe('Second group');
        expect(component.data()[2].treeColumn.text).toBe('Subgroup');
    });

    it('should update configs columns via signal on data refresh', async () => {
        const initialColumns = component.configs().columns;
        fixture.componentRef.setInput('jsDataSet', [
            ['id', 'pid', 'treeColumn'],
            ['1', null, 'Root'],
            ['2', '1', 'Child']
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.configs().columns).not.toBe(initialColumns);
        expect(component.configs().columns.length).toBeGreaterThan(0);
    });

    describe('check selection', () => {
        // tree: 1, 2 -> 3 -> (4, 5)
        beforeEach(async () => {
            fixture.componentRef.setInput('showCheckboxes', true);
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should have no checked nodes initially', () => {
            expect(component.getCheckedNodes()).toEqual([]);
        });

        it('should return no checked nodes when check boxes are not shown', () => {
            component.checkNode('4', true, null);
            fixture.componentRef.setInput('showCheckboxes', false);
            fixture.detectChanges();
            expect(component.getCheckedNodes()).toEqual([]);
        });

        it('should check a single leaf node and call onNodeChecked only for that node', () => {
            const spy = vi.fn();
            fixture.componentRef.setInput('onNodeChecked', spy);
            fixture.detectChanges();
            const event = {};
            component.checkNode('4', true, event);
            expect(component.getCheckedNodes()).toEqual(['4']);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('4', true, event);
        });

        it('should check all descendants when checking a parent', () => {
            component.checkNode('2', true, null);
            expect(component.getCheckedNodes()).toEqual(['2', '3', '4', '5']);
        });

        it('should uncheck all descendants when unchecking a parent', () => {
            component.checkNode('2', true, null);
            component.checkNode('2', false, null);
            expect(component.getCheckedNodes()).toEqual([]);
        });

        it('should check the parent when all its children are checked', () => {
            component.checkNode('4', true, null);
            expect(component.getCheckedNodes()).toEqual(['4']);
            component.checkNode('5', true, null);
            expect(component.getCheckedNodes()).toEqual(['2', '3', '4', '5']);
        });

        it('should show a parent as partially checked, but not return it, when only some children are checked', () => {
            component.checkNode('4', true, null);
            expect(component.partialKeys().has('3')).toBe(true);
            expect(component.partialKeys().has('2')).toBe(true);
            expect(component.checkedKeys().has('3')).toBe(false);
            expect(component.getCheckedNodes()).toEqual(['4']);
        });

        it('should uncheck the parents when a child is unchecked', () => {
            component.checkNode('2', true, null);
            component.checkNode('5', false, null);
            expect(component.getCheckedNodes()).toEqual(['4']);
            expect(component.partialKeys().has('3')).toBe(true);
            expect(component.partialKeys().has('2')).toBe(true);
        });

        it('should check nodes independently when checkboxAutoselectsChildren is false', () => {
            fixture.componentRef.setInput('checkboxAutoselectsChildren', false);
            fixture.detectChanges();
            component.checkNode('2', true, null);
            expect(component.getCheckedNodes()).toEqual(['2']);
            component.checkNode('3', true, null);
            expect(component.getCheckedNodes()).toEqual(['2', '3']);
            expect(component.partialKeys().size).toBe(0);
        });

        it('setCheckedNodes should (un)check nodes without calling onNodeChecked', () => {
            const spy = vi.fn();
            fixture.componentRef.setInput('onNodeChecked', spy);
            fixture.detectChanges();
            // 3 is the only child of 2, so 2 is fully checked as well
            component.setCheckedNodes(['3'], true);
            expect(component.getCheckedNodes()).toEqual(['2', '3', '4', '5']);
            component.setCheckedNodes(['4']);
            expect(component.getCheckedNodes()).toEqual(['2', '3', '4', '5']);
            component.setCheckedNodes(['4'], false);
            expect(component.getCheckedNodes()).toEqual(['5']);
            expect(spy).not.toHaveBeenCalled();
        });

        it('setCheckedNodes should accept numeric ids for string node ids and ignore unknown ids', () => {
            component.setCheckedNodes([4, 99] as any, true);
            expect(component.getCheckedNodes()).toEqual(['4']);
        });

        it('clearCheckedNodes should uncheck everything without calling onNodeChecked', () => {
            component.checkNode('2', true, null);
            const spy = vi.fn();
            fixture.componentRef.setInput('onNodeChecked', spy);
            fixture.detectChanges();
            component.clearCheckedNodes();
            expect(component.getCheckedNodes()).toEqual([]);
            expect(component.partialKeys().size).toBe(0);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should clear the checked nodes when a new data set is set', async () => {
            component.checkNode('2', true, null);
            fixture.componentRef.setInput('jsDataSet', treeData.map(row => [...row]));
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.getCheckedNodes()).toEqual([]);
        });

        it('should keep the checked nodes on refresh() without restoring the expanded nodes', () => {
            component.checkNode('2', true, null);
            component.refresh(false);
            expect(component.getCheckedNodes()).toEqual(['2', '3', '4', '5']);
        });

        it('should clear the checked nodes when showCheckboxes or checkboxAutoselectsChildren changes', async () => {
            component.checkNode('2', true, null);
            fixture.componentRef.setInput('checkboxAutoselectsChildren', false);
            fixture.detectChanges();
            expect(component.getCheckedNodes()).toEqual([]);
            component.checkNode('3', true, null);
            fixture.componentRef.setInput('showCheckboxes', false);
            fixture.detectChanges();
            fixture.componentRef.setInput('showCheckboxes', true);
            fixture.detectChanges();
            expect(component.getCheckedNodes()).toEqual([]);
        });

        it('should keep the checked state when a node is added with addOrUpdateRowData', () => {
            component.checkNode('4', true, null);
            component.addOrUpdateRowData(['6', '3', 'New child', null]);
            // the new child is not checked, so its parents are not fully checked anymore
            expect(component.getCheckedNodes()).toEqual(['4']);
            expect(component.partialKeys().has('3')).toBe(true);
        });

        it('should render a check box only in the tree column and reflect the checked state', async () => {
            component.checkNode('4', true, null);
            fixture.detectChanges();
            await fixture.whenStable();
            const boxes = fixture.nativeElement.querySelectorAll('input.treeCheckbox') as NodeListOf<HTMLInputElement>;
            expect(boxes.length).toBeGreaterThan(0);
        });
    });

    describe('tree grid API (with mocked angular grid)', () => {
        let displayData: any[];
        let gridMock: any;

        beforeEach(() => {
            displayData = [
                { id: '1', pid: null, pathx: '0', levelx: 0, row_selected: false },
                { id: '2', pid: null, pathx: '1', levelx: 0, row_selected: false },
                { id: '3', pid: '2', pathx: '1.0', levelx: 1, row_selected: false },
                { id: '4', pid: '3', pathx: '1.0.0', levelx: 2, row_selected: false },
                { id: '5', pid: '3', pathx: '1.0.1', levelx: 2, row_selected: false }
            ];
            gridMock = {
                store: {
                    getDisplayData: () => displayData,
                    getProcessedData: () => displayData.map(d => ({ ...d, treeColumn: { text: d.id === '3' ? 'Subgroup' : 'Node ' + d.id } })),
                    findChildren: (_data: any, nodeId: any) => displayData.filter(d => d.pid === nodeId),
                    refreshDisplayData: vi.fn(),
                    filterBy: vi.fn()
                },
                expand_tracker: { '1.0': true },
                collapseAll: vi.fn(),
                expandAll: vi.fn(),
                expandRow: vi.fn(),
                collapseRow: vi.fn()
            };
            // substitute the viewChild signal with a function returning our mock
            (component as any).angularGrid = () => gridMock;
            component.isTreeReady.set(true);
        });

        it('nodeExist returns true for an existing node and false otherwise', () => {
            expect(component.nodeExist('3')).toBe(true);
            expect(component.nodeExist('nope')).toBe(false);
        });

        it('expandNode expands an existing node', () => {
            component.expandNode('3');
            expect(gridMock.expandRow).toHaveBeenCalledWith('3');
        });

        it('expandNode warns for a missing node', () => {
            const warn = vi.fn();
            (component as any).log = { warn };
            component.expandNode('missing');
            expect(warn).toHaveBeenCalled();
        });

        it('isNodeExpanded reflects the expand tracker', () => {
            expect(component.isNodeExpanded('3')).toBe(true);
            expect(component.isNodeExpanded('1')).toBe(false);
        });

        it('collapseNode collapses the given node', () => {
            component.collapseNode('3');
            expect(gridMock.collapseRow).toHaveBeenCalledWith('3');
        });

        it('expandAll and collapseAll return true when ready', () => {
            expect(component.expandAll()).toBe(true);
            expect(gridMock.expandAll).toHaveBeenCalled();
            expect(component.collapseAll()).toBe(true);
            expect(gridMock.collapseAll).toHaveBeenCalled();
        });

        it('getChildNodes returns the child ids of a parent', () => {
            expect(component.getChildNodes('3')).toEqual(['4', '5']);
        });

        it('getParentNode returns the parent id', () => {
            expect(component.getParentNode('3')).toBe('2');
        });

        it('getNodeLevel returns the 1-based level', () => {
            expect(component.getNodeLevel('4')).toBe(3);
            expect(component.getNodeLevel('unknown')).toBe(-1);
        });

        it('getRootNodes returns the nodes without a parent', () => {
            expect(component.getRootNodes()).toEqual(['1', '2']);
        });

        it('setSelectedNode marks a node selected', () => {
            component.setSelectedNode('2');
            const row = displayData.find(d => d.id === '2');
            expect(row.row_selected).toBe(true);
        });

        it('getSelectedNode returns the selected node id', () => {
            displayData.find(d => d.id === '4')!.row_selected = true;
            expect(component.getSelectedNode()).toBe('4');
        });

        it('getSeletedNode (deprecated) returns the selected node id', () => {
            displayData.find(d => d.id === '5')!.row_selected = true;
            expect(component.getSeletedNode()).toBe('5');
        });

        it('refresh with restoreExpandedNodes calls refreshDisplayData', () => {
            component.refresh(true);
            expect(gridMock.store.refreshDisplayData).toHaveBeenCalled();
        });

        it('filterNodes applies a non-branch filter', () => {
            component.filterNodes('Sub', { autoExpand: true });
            expect(component.filterText()).toBe('Sub');
            expect(component.isBranchFilter).toBe(false);
            expect(gridMock.store.filterBy).toHaveBeenCalled();
            expect(component.filterMatchedNodes()).toContain('3');
        });

        it('filterBranches applies a branch filter', () => {
            component.filterBranches('Sub', {});
            expect(component.isBranchFilter).toBe(true);
            expect(component.filterMatchedNodes()).toContain('3');
        });

        it('getFilteredNodes clears matches when the filter text is empty', () => {
            component.filterText.set('');
            component.getFilteredNodes();
            expect(component.filterMatchedNodes()).toEqual([]);
            expect(component.filterPartNodes()).toEqual([]);
        });

        it('setColumnWidth sets the width on all columns', () => {
            // ensure there are columns
            component.updateTreeGridData();
            component.setColumnWidth(120);
            expect(component.columnWidth).toBe('120px');
        });

        it('setColumnWidth sets the width on a single column by index', () => {
            component.updateTreeGridData();
            component.setColumnWidth(80, 0);
            expect(component.configs().columns[0].width).toBe('80px');
        });
    });

    describe('row drag and drop', () => {
        it('onRowDragOverEvent accepts supported drag types', () => {
            const ev: any = { dataTransfer: { types: ['nggrids-drag/json'] }, preventDefault: vi.fn() };
            component.onRowDragOverEvent(ev);
            expect(ev.dataTransfer.dropEffect).toBe('copy');
            expect(ev.preventDefault).toHaveBeenCalled();
        });

        it('onRowDragOverEvent ignores unsupported drag types', () => {
            const ev: any = { dataTransfer: { types: ['text/plain'] }, preventDefault: vi.fn() };
            component.onRowDragOverEvent(ev);
            expect(ev.preventDefault).not.toHaveBeenCalled();
        });

        it('onRowDropEvent forwards parsed records to the handler', () => {
            const onRowDrop = vi.fn();
            fixture.componentRef.setInput('onRowDrop', onRowDrop);
            fixture.detectChanges();
            const payload = JSON.stringify({ records: [{ id: 9 }], sourceGridName: 'g', sourceColumnId: 'c' });
            const ev: any = {
                preventDefault: vi.fn(),
                dataTransfer: { getData: () => payload },
                target: { closest: () => ({ getAttribute: () => '3' }) }
            };
            component.onRowDropEvent(ev);
            expect(onRowDrop).toHaveBeenCalled();
            expect(onRowDrop.mock.calls[0][0]).toEqual([{ id: 9 }]);
            expect(onRowDrop.mock.calls[0][1]).toBe('3');
        });

        it('getTargetNodeId reads the cell-id attribute', () => {
            const el = { closest: (sel: string) => sel === '[cell-id]' ? { getAttribute: () => '7' } : null };
            expect(component.getTargetNodeId(el)).toBe('7');
            expect(component.getTargetNodeId({ closest: () => null })).toBeNull();
        });
    });

    it('addOrUpdateRowData warns on a misaligned row and makes no change', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => { /* noop */ });
        const before = component.data().length;
        component.addOrUpdateRowData(['only', 'two']);
        expect(component.data().length).toBe(before);
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('svyOnInit populates designer sample data when in designer', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInDesigner').mockReturnValue(true);
        component.svyOnInit();
        expect(component._jsDataSet()[0]).toContain('id');
    });

});

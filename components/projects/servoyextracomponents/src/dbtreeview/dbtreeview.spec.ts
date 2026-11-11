import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraDbtreeview } from './dbtreeview';

describe('ServoyExtraDbtreeview', () => {
    let fixture: ComponentFixture<ServoyExtraDbtreeview>;
    let component: ServoyExtraDbtreeview;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
        servoyApi = new ServoyApiTesting();

        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraDbtreeview],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraDbtreeview);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', servoyApi);
        fixture.componentRef.setInput('autoRefresh', true);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('showLoadingIndicator', true);
        fixture.componentRef.setInput('responsiveHeight', 0);
        fixture.componentRef.setInput('styleClass', 'dbtreeview-test');
        fixture.componentRef.setInput('onDrop', vi.fn());
        fixture.componentRef.setInput('onReady', vi.fn());
        fixture.componentRef.setInput('onRowDrop', vi.fn());
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create the component and register it', async () => {
        expect(component).toBeTruthy();
        expect(servoyApi.registerComponent).toBeTruthy();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should apply a style class', async () => {
        const nativeEl = fixture.nativeElement as HTMLElement;
        const treeDiv = nativeEl.querySelector('.dbtreeview');
        expect(treeDiv).toBeTruthy();
        expect(treeDiv!.classList.contains('mystyleclass')).toBe(false);

        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(treeDiv!.classList.contains('mystyleclass')).toBe(true);
    });

    it('should apply multiple style classes', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();

        const nativeEl = fixture.nativeElement as HTMLElement;
        const treeDiv = nativeEl.querySelector('.dbtreeview');
        expect(treeDiv!.classList.contains('mystyleclass')).toBe(true);

        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(treeDiv!.classList.contains('classA')).toBe(true);
        expect(treeDiv!.classList.contains('classB')).toBe(true);
    });

    it('should add dbtreeview-disabled class when enabled is false', async () => {
        const nativeEl = fixture.nativeElement as HTMLElement;
        const treeDiv = nativeEl.querySelector('.dbtreeview');
        expect(treeDiv!.classList.contains('dbtreeview-disabled')).toBe(false);

        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(treeDiv!.classList.contains('dbtreeview-disabled')).toBe(true);
    });

    it('getIconURL returns a media download url for media:// paths', () => {
        const api: any = (component as any).servoyPublicService;
        const spy = vi.spyOn(api, 'generateMediaDownloadUrl').mockReturnValue('download/url');
        const url = component.getIconURL('media:///servoy/img.png');
        expect(spy).toHaveBeenCalled();
        expect(url).toBe('download/url');
        spy.mockRestore();
    });

    it('getIconURL returns the path unchanged for non-media paths', () => {
        expect(component.getIconURL('./assets/x.png')).toBe('./assets/x.png');
        expect(component.getIconURL('')).toBe('');
    });

    it('buildChild maps a leaf node and assigns the file image', () => {
        const node: any = { id: 'n1', hasChildren: false, name: 'Leaf', level: 1, tooltip: 'tip' };
        const child = (component as any).buildChild(node);
        expect(child.id).toBe('n1');
        expect(child.name).toBe('Leaf');
        expect(child.tooltip).toBe('tip');
        expect(child.image).toBe((component as any).fileImgPath);
    });

    it('buildChild assigns the folder image for parent nodes', () => {
        const node: any = { id: 'p1', hasChildren: true, name: 'Folder', level: 1 };
        const child = (component as any).buildChild(node);
        expect(child.image).toBe((component as any).folderImgPath);
    });

    it('buildChild recurses into children and links parentItem', () => {
        const node: any = {
            id: 'root', hasChildren: true, name: 'Root', level: 1,
            children: [{ id: 'c1', hasChildren: false, name: 'C1', level: 2 }]
        };
        const child = (component as any).buildChild(node);
        expect(child.children.length).toBe(1);
        expect(child.children[0].id).toBe('c1');
        expect(child.children[0].parentItem).toBe(child);
    });

    it('buildChild keeps a node expanded when it is in expandedNodes', () => {
        component.expandedNodes = ['e1'];
        const node: any = { id: 'e1', hasChildren: true, name: 'E', level: 1 };
        const child = (component as any).buildChild(node);
        expect(child.expanded).toBe(true);
    });

    it('buildChild maps custom actions', () => {
        const node: any = { id: 'a1', hasChildren: false, name: 'A', level: 1, 'customAction-#-doThing': 'val' };
        const child = (component as any).buildChild(node);
        expect(child.customActions).toEqual({ doThing: 'val' });
    });

    it('getBinding returns the matching binding by datasource', () => {
        const bindings = [
            { datasource: 'ds1', callbackinfo: null, methodToCallOnCheckBoxChange: null, methodToCallOnDoubleClick: null, methodToCallOnRightClick: null },
            { datasource: 'ds2', callbackinfo: null, methodToCallOnCheckBoxChange: null, methodToCallOnDoubleClick: null, methodToCallOnRightClick: null }
        ];
        fixture.componentRef.setInput('bindings', bindings as any);
        fixture.detectChanges();
        expect((component as any).getBinding('ds2')).toBe(bindings[1]);
        expect((component as any).getBinding('nope')).toBeNull();
    });

    it('buildChild wires callbackinfo from the binding', () => {
        const cb = vi.fn();
        const bindings = [{ datasource: 'ds', callbackinfo: { f: cb, param: 'p' }, methodToCallOnCheckBoxChange: null, methodToCallOnDoubleClick: null, methodToCallOnRightClick: null }];
        fixture.componentRef.setInput('bindings', bindings as any);
        fixture.detectChanges();
        const node: any = { id: 'n', hasChildren: false, name: 'N', level: 1, datasource: 'ds', callbackinfoParamValue: 'q' };
        const child = (component as any).buildChild(node);
        expect(child.callbackinfo).toBe(cb);
        expect(child.callbackinfoParamValue).toBe('q');
    });

    it('findDataNode locates a node at depth', () => {
        const nodes: any[] = [
            { id: 'a', children: [{ id: 'b', children: [{ id: 'c' }] }] }
        ];
        expect((component as any).findDataNode('c', nodes).id).toBe('c');
        expect((component as any).findDataNode('missing', nodes)).toBeNull();
    });

    it('getNodePKPath builds the path from node ids', () => {
        const node: any = { id: 'tbl.100;x', parent: null };
        const path = (component as any).getNodePKPath(node);
        expect(path).toEqual(['100']);
    });

    it('hasActiveNode finds a deeply nested active node', () => {
        const nodes: any[] = [{ active: false, children: [{ active: true }] }];
        expect((component as any).hasActiveNode(nodes)).toBe(true);
        expect((component as any).hasActiveNode([{ active: false }])).toBe(false);
    });

    it('buildNodeKeyPath concatenates ancestor ids', () => {
        const node: any = { data: { id: 'leaf' }, parent: { data: { id: 'root' }, parent: null } };
        expect((component as any).buildNodeKeyPath(node)).toBe('/root/leaf');
    });

    it('getTargetNodeId reads the node-id attribute from the closest element', () => {
        const el = { closest: (sel: string) => sel === '[node-id]' ? { getAttribute: () => '42' } : null };
        expect(component.getTargetNodeId(el)).toBe('42');
        const el2 = { closest: () => null };
        expect(component.getTargetNodeId(el2)).toBeNull();
    });

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

    it('updateChildNodeCheckbox cascades checked state to descendants', () => {
        const child = { data: { checked: false }, children: undefined };
        const node: any = { data: { checked: false }, children: [child] };
        (component as any).updateChildNodeCheckbox(node, true);
        expect(node.data.checked).toBe(true);
        expect(child.data.checked).toBe(true);
    });

    it('updateParentNodeCheckbox marks a parent checked when all children checked', () => {
        const node: any = { data: { checked: false }, children: [{ data: { checked: true } }, { data: { checked: true } }], parent: null };
        (component as any).updateParentNodeCheckbox(node);
        expect(node.data.checked).toBe(true);
        expect(node.data.indeterminate).toBe(false);
    });

    it('updateParentNodeCheckbox sets indeterminate for mixed children', () => {
        const node: any = { data: { checked: false }, children: [{ data: { checked: true } }, { data: { checked: false } }], parent: null };
        (component as any).updateParentNodeCheckbox(node);
        expect(node.data.checked).toBe(true);
        expect(node.data.indeterminate).toBe(true);
    });

    it('updateParentNodeCheckbox clears checked when no children checked', () => {
        const node: any = { data: { checked: true }, children: [{ data: { checked: false } }], parent: null };
        (component as any).updateParentNodeCheckbox(node);
        expect(node.data.checked).toBe(false);
        expect(node.data.indeterminate).toBe(false);
    });

    it('initTree renders placeholder nodes when in designer', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInDesigner').mockReturnValue(true);
        (component as any).initTree();
        expect(component.displayNodes().length).toBe(3);
        expect(component.displayNodes()[0].name).toBe('node1');
    });

    it('initTree builds display nodes from the foundsettree', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInDesigner').mockReturnValue(false);
        const ftree: any = [
            { id: 'f1', hasChildren: false, name: 'First', level: 1 },
            { id: 'f2', hasChildren: false, name: 'Second', level: 1 }
        ];
        ftree.getChildren = vi.fn();
        ftree.updateSelection = vi.fn();
        ftree.getAndResetUpdatedCheckboxValues = vi.fn().mockReturnValue(null);
        ftree.getAndResetNewChildren = vi.fn().mockReturnValue(null);
        ftree.updateExpandedNodes = vi.fn();
        fixture.componentRef.setInput('foundsettree', ftree);
        fixture.componentRef.setInput('isInitialized', null);
        fixture.detectChanges();
        (component as any).initTree();
        expect(component.displayNodes().length).toBe(2);
        expect(component.displayNodes()[0].name).toBe('First');
    });

    it('refresh re-initializes the tree', () => {
        const spy = vi.spyOn(component as any, 'initTree');
        component.refresh();
        expect(spy).toHaveBeenCalled();
    });

    it('onRowDropEvent invokes the onRowDrop handler with parsed records', () => {
        const onRowDrop = vi.fn();
        fixture.componentRef.setInput('onRowDrop', onRowDrop);
        fixture.detectChanges();
        const payload = JSON.stringify({ records: [{ id: 1 }], sourceGridName: 'g', sourceColumnId: 'c' });
        const ev: any = {
            preventDefault: vi.fn(),
            dataTransfer: { getData: () => payload },
            target: { closest: () => null }
        };
        component.onRowDropEvent(ev);
        expect(ev.preventDefault).toHaveBeenCalled();
        expect(onRowDrop).toHaveBeenCalled();
        const args = onRowDrop.mock.calls[0];
        expect(args[0]).toEqual([{ id: 1 }]);
    });

    it('getChildren maps foundsettree children through buildChild', async () => {
        const ftree: any = [];
        ftree.getChildren = vi.fn().mockResolvedValue([{ id: 'ch', hasChildren: false, name: 'Child', level: 2 }]);
        ftree.getAndResetUpdatedCheckboxValues = vi.fn().mockReturnValue(null);
        ftree.getAndResetNewChildren = vi.fn().mockReturnValue(null);
        ftree.updateSelection = vi.fn();
        ftree.updateExpandedNodes = vi.fn();
        fixture.componentRef.setInput('foundsettree', ftree);
        fixture.detectChanges();
        const result = await component.getChildren({ data: { id: 'p', level: 1 } } as any);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('Child');
        expect((component as any).gettingChildren).toBe(false);
    });

});

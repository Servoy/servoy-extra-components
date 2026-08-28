import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ServoyExtraTreeview } from './treeview';
@Component({
    selector: 'servoyextra-treeview-cell-renderer',
    template: `
    <div [style]="display()" (contextmenu)="oncontextmenu($event)" [attr.cell-id]="cellId()">
      @if (!faIcon() && icon()) {
        <img [src]="icon()">
      }
      @if (faIcon() && icon()) {
        <span [class]="icon()"></span>
      }
      <span class="treeLabel" [style]="labelStyle()" [class]="filterClass()" [innerHtml]="label()"></span>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ServoyExtraTreeviewCellRenderer {
  readonly column = input<any>(undefined);
  readonly cell_value = input<any>(undefined);
  readonly row_data = input<any>(undefined);

  readonly label = computed(() => {
    const cell_value = this.cell_value();
    return (cell_value && cell_value.text !== undefined) ? cell_value.text : cell_value;
  });

  readonly icon = computed(() => {
    const cell_value = this.cell_value();
    return (cell_value && cell_value.icon !== undefined) ? cell_value.icon : null;
  });

  readonly faIcon = computed(() => {
    const cell_value = this.cell_value();
    return (cell_value && cell_value.isFAIcon !== undefined) ? cell_value.isFAIcon : false;
  });

  readonly cellId = computed(() => {
    return this.row_data()?.id;
  });

  readonly filterClass = computed(() => {
    const col = this.column();
    const rowData = this.row_data();
    if (!col || !rowData) return '';
    const treeview: ServoyExtraTreeview = col.treeview;
    if (col.name === 'treeColumn') {
      let clazz = 'treeLabel';
      if (treeview.filterText().length > 0) {
        if (treeview.filterMatchedNodes().indexOf(rowData.id) !== -1) {
          clazz += ' filteredNode';
        } else if (treeview.filterPartNodes().indexOf(rowData.id) !== -1) {
          clazz += ' filterPartNode';
        }
      }
      return clazz;
    }
    return '';
  });

  readonly labelStyle = computed(() => {
    const width = this.columnWidth();
    if (width !== 'auto') {
      return { width, whiteSpace: 'nowrap' };
    }
    return {};
  });

  readonly display = computed(() => {
    if (this.columnWidth() === 'auto') {
      return { display: 'inline' };
    }
    return {};
  });

  private readonly columnWidth = computed(() => {
    const col = this.column();
    if (!col) return 'auto';
    const treeview: ServoyExtraTreeview = col.treeview;
    return treeview.columnWidth;
  });

  oncontextmenu(event: any) {
    const col = this.column();
    if (!col) return;
    const treeview: ServoyExtraTreeview = col.treeview;
    const onNodeRightClicked = treeview.onNodeRightClicked();
    if (onNodeRightClicked) {
      event.preventDefault();
      onNodeRightClicked(this.row_data().id, event);
    }
  }
}

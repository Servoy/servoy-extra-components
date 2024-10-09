import { Component, Input } from '@angular/core';
import { ServoyExtraTreeview } from './treeview';
@Component({
  selector: 'servoyextra-treeview-cell-renderer',
  template: `
    <div style="display: inline;" (contextmenu)="oncontextmenu($event)">
      <img *ngIf="!isFAIcon() && getIcon()" [src]="getIcon()">
      <span *ngIf="isFAIcon() && getIcon()" [class]="getIcon()"></span>
      <span class="treeLabel" [class]="getFilterClass()" [innerHtml]="getLabel()"></span>
    </div>
  `
})
export class ServoyExtraTreeviewCellRenderer {
  @Input()
  column: any;

  @Input()
  cell_value: any;

  @Input()
  row_data: any;

  getLabel() {
    return this.cell_value.text !== undefined ? this.cell_value.text : this.cell_value;
  }

  getIcon() {
    return this.cell_value.icon !== undefined ? this.cell_value.icon : null;
  }

  isFAIcon() {
    return this.cell_value.isFAIcon !== undefined ? this.cell_value.isFAIcon : false;
  }

  oncontextmenu(event) {
    const treeview: ServoyExtraTreeview  = this.column.treeview;
    if (treeview.onNodeRightClicked) {
      event.preventDefault();
      treeview.onNodeRightClicked(this.row_data.id, event);
    }
  }

  getFilterClass() {
    const treeview: ServoyExtraTreeview  = this.column.treeview;
    if(this.column.name === 'treeColumn') {
      let clazz = 'treeLabel';
      if(treeview.filterText.length > 0) {
        if(treeview.filterMatchedNodes.indexOf(this.row_data.id) !== -1) {
          clazz += ' filteredNode';
        } else if(treeview.filterPartNodes.indexOf(this.row_data.id) !== -1) {
          clazz += ' filterPartNode';
        }
      }
      return clazz;
    }
    return '';
  }
}

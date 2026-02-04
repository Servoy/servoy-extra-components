import { Component, input } from '@angular/core';
import { ServoyExtraTreeview } from './treeview';
@Component({
    selector: 'servoyextra-treeview-cell-renderer',
    template: `
    <div [ngStyle]="setDisplay()" (contextmenu)="oncontextmenu($event)" [attr.cell-id]="getCellId()">
      @if (!isFAIcon() && getIcon()) {
        <img [src]="getIcon()">
      }
      @if (isFAIcon() && getIcon()) {
        <span [class]="getIcon()"></span>
      }
      <span class="treeLabel" [ngStyle]="setStyle()" [class]="getFilterClass()" [innerHtml]="getLabel()"></span>
    </div>
    `,
    standalone: false
})
export class ServoyExtraTreeviewCellRenderer {
  column: any;
  cell_value: any;
  row_data: any;

  getLabel() {
    const cell_value = this.cell_value;
    return (cell_value && cell_value.text !== undefined) ? cell_value.text : cell_value;
  }

  getIcon() {
    const cell_value = this.cell_value;
    return (cell_value && cell_value.icon !== undefined) ? cell_value.icon : null;
  }

  isFAIcon() {
    const cell_value = this.cell_value;
    return (cell_value && cell_value.isFAIcon !== undefined) ? cell_value.isFAIcon : false;
  }
  
  getWidth() {
	const treeview: ServoyExtraTreeview = this.column.treeview;
	return treeview.columnWidth;
  }
  
  setStyle() {
	if (this.getWidth() !== 'auto' /*&& this.cell_value.text === undefined*/) {
		return {width: this.getWidth(), whiteSpace: 'nowrap'}
	}
	return {};
  }
  
  setDisplay() {
	if (this.getWidth() === 'auto') {
		return {display: 'inline'};
	}
	return {};
  }

  oncontextmenu(event) {
    const treeview: ServoyExtraTreeview = this.column.treeview;
    const onNodeRightClicked = treeview.onNodeRightClicked();
    if (onNodeRightClicked) {
      event.preventDefault();
      onNodeRightClicked(this.row_data.id, event);
    }
  }

  getFilterClass() {
    const treeview: ServoyExtraTreeview = this.column.treeview;
    if(this.column.name === 'treeColumn') {
      let clazz = 'treeLabel';
      if(treeview.filterText.length > 0) {
        if(treeview.filterMatchedNodes.indexOf(this.row_data().id) !== -1) {
          clazz += ' filteredNode';
        } else if(treeview.filterPartNodes.indexOf(this.row_data().id) !== -1) {
          clazz += ' filterPartNode';
        }
      }
      return clazz;
    }
    return '';
  }

  getCellId() {
    return this.row_data.id;    
  }
}

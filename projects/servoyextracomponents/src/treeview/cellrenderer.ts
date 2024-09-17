import { Component, Input, OnInit } from '@angular/core';
import { ServoyExtraTreeview } from './treeview';
@Component({
  selector: 'servoyextra-treeview-cell-renderer',
  template: `
     <div [ngStyle]="setDisplay()" (contextmenu)="oncontextmenu($event)">
      <!-- Render node content for treeColumn (folder/user icon and label) -->
      <ng-container *ngIf="column.name === 'treeColumn'">
        <img *ngIf="!isFAIcon(getIcon()) && getIcon()" [src]="getIcon()">
        <span *ngIf="isFAIcon(getIcon()) && getIcon()" [class]="getIcon()"></span>
        <span class="treeLabel" [innerHtml]="getLabel()"></span>
      </ng-container>

      <!-- Render actions for actions column -->
      <ng-container *ngIf="column.name === 'actions'">
        <span *ngFor="let action of actions" (click)="onActionClick(action.id, row_data.id)" style="display: inline-block; margin-left: 5px;">
          <span [ngClass]="action.icon"></span>
        </span>
      </ng-container>
    </div>
  `
})

export class ServoyExtraTreeviewCellRenderer {
  actions: any[] = []; 

  @Input()
  column: any;

  @Input()
  cell_value: any;

  @Input()
  row_data: any;

 
ngOnInit() {
  this.actions = this.getActions();
}

  getLabel() {
    return this.cell_value.text !== undefined ? this.cell_value.text : this.cell_value;
  }

  getIcon() {
    return this.cell_value.icon !== undefined ? this.cell_value.icon : null;
  }

  isFAIcon(icon: string): boolean {
    return icon && (icon.startsWith('fa ') || icon.startsWith('fa-'));
  }
  
  getWidth() {
	const treeview: ServoyExtraTreeview  = this.column.treeview;
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
    if (this.row_data && treeview.onNodeRightClicked) {
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

  getActions() {
    if (!this.row_data?.actions || this.row_data.actions === '{}') {
      return [];
    }
  
    try {
      const actionsString = this.row_data.actions.toString().replace(/'/g, '"'); 
      const parsedActions = JSON.parse(actionsString); 
      return Object.keys(parsedActions).map(key => ({ id: key, icon: parsedActions[key] }));
    } catch (error) {
      console.error("Failed to parse actions JSON: ", this.row_data.actions, error);
      return [];
    }
  }

  onActionClick(actionId, nodeId) {
    event.stopPropagation();
    console.log(actionId);
    const treeview: ServoyExtraTreeview = this.column.treeview;
    if (treeview.onNodeAction) {
      treeview.onNodeAction(actionId, nodeId, { originalEvent: event });
    }
  }
}

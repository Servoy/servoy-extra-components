import { Directive, ViewChild, ElementRef, input } from '@angular/core';

import { BGSplitter } from './bg_splitter.component';

@Directive({
    selector: 'bg-pane',
    host: {
        '[class]': '"split-pane"+index',
        style: 'overflow:auto'
    },
    standalone: false
})
export class BGPane{

    readonly minSize = input(0);

    index;

    constructor(public element: ElementRef) {

    }
}

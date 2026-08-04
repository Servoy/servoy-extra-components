import { Directive, ElementRef, input } from '@angular/core';

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

    index!: number;

    constructor(public element: ElementRef) {

    }
}

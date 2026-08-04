import { Directive, ElementRef, inject, input } from '@angular/core';

/* eslint-disable @angular-eslint/directive-selector */
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

    element = inject(ElementRef);
}

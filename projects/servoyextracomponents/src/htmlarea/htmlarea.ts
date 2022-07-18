import { Component, SimpleChanges, Input, Renderer2, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ServoyBaseComponent, PropertyUtils, ServoyPublicService } from '@servoy/public';
import tinymce, { RawEditorOptions, Editor } from 'tinymce';

@Component({
    selector: 'servoyextra-htmlarea',
    templateUrl: './htmlarea.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraHtmlarea extends ServoyBaseComponent<HTMLDivElement> {


    @Input() onActionMethodID: (e: Event) => void;
    @Input() onRightClickMethodID: (e: Event) => void;
    @Input() onDataChangeMethodID: (e: Event) => void;
    @Input() onFocusGainedMethodID: (e: Event) => void;
    @Input() onFocusLostMethodID: (e: Event) => void;

    @Output() dataProviderIDChange = new EventEmitter();
    @Input() dataProviderID: any;
    @Input() enabled: boolean;
    @Input() editable: boolean;
    @Input() placeholderText: string;
    @Input() readOnly: boolean;
    @Input() responsiveHeight: any;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() text: string;
    @Input() toolTipText: string;
    @Input() scrollbars: any;

    mustExecuteOnFocus = true;

    tinyValue: any;
    tinyConfig: RawEditorOptions = {
        base_url: '/tinymce',
        suffix: '.min',
        height: '100%',
        menubar: false,
        statusbar: false,
        readonly: false,
        plugins: 'tabfocus',
        tabfocus_elements: ':prev,:next',
        toolbar: 'fontselect fontsizeselect | bold italic underline | superscript subscript | undo redo |alignleft aligncenter alignright alignjustify | styleselect | outdent indent bullist numlist'
    };
    editor: Editor;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, protected servoyPublicService: ServoyPublicService) {
        super(renderer, cdRef);
    }

    focus() {
        if (this.onFocusGainedMethodID) {
            if (this.mustExecuteOnFocus !== false) {
                this.onFocusGainedMethodID(new CustomEvent('focus'));
            }
            this.mustExecuteOnFocus = true;
        }
    }

    blur() {
        this.dataProviderID = '<html><body>' + this.tinyValue + '</body></html>';
        this.pushUpdate();
        if (this.onFocusLostMethodID) this.onFocusLostMethodID(new CustomEvent('blur'));
    }

    click() {
        if (this.onActionMethodID) this.onActionMethodID(new CustomEvent('click'));
    }

    keyUp(event) {
        this.getNativeElement().dispatchEvent(new KeyboardEvent('keyup', event.event));
    }

    ngOnInit() {
        super.ngOnInit();

        this.tinyConfig['language'] = this.servoyPublicService.getLocale();

        // app level configuration
        let defaultConfiguration = this.servoyPublicService.getUIProperty('config');
        if (defaultConfiguration) {
            if (typeof defaultConfiguration === 'string') {
                try {
                    defaultConfiguration = JSON.parse(defaultConfiguration);
                } catch (e) {
                    console.error(e);
                }
            }
            for (const key in defaultConfiguration) {
                if (defaultConfiguration.hasOwnProperty(key)) {
                    this.tinyConfig[key] = defaultConfiguration[key];
                }
            }
        }

        // element level configuration
        let configuration = this.servoyApi.getClientProperty('config');
        if (configuration) {
            if (typeof configuration === 'string') {
                try {
                    configuration = JSON.parse(configuration);
                } catch (e) {
                    console.error(e);
                }
            }
            for (const key in configuration) {
                if (configuration.hasOwnProperty(key)) {
                    this.tinyConfig[key] = configuration[key];
                }
            }
        }
    }

    svyOnInit() {
        super.svyOnInit();
        this.tinyValue = this.dataProviderID;
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'styleClass':
                        if (change.previousValue)
                            this.renderer.removeClass(this.getNativeElement(), change.previousValue);
                        if (change.currentValue)
                            this.renderer.addClass(this.getNativeElement(), change.currentValue);
                        break;
                    case 'scrollbars':
                        if (change.currentValue) {
                            const element = this.getNativeChild().textArea;
                            PropertyUtils.setScrollbars(element, this.renderer, change.currentValue);
                        }
                        break;
                    case 'editable':
                    case 'readOnly':
                    case 'enabled':
                        const editable = this.editable && !this.readOnly && this.enabled;
                        if (this.getEditor()) {
                            if (editable) {
                                if (!change.firstChange) {
                                    this.getEditor().mode.set('design');
                                }
                            } else {
                                this.getEditor().mode.set('readonly');
                            }

                        }
                        break;
                    case 'dataProviderID':
                        this.tinyValue = this.dataProviderID;
                        break;
                    case 'responsiveHeight':
                        if (!this.servoyApi.isInAbsoluteLayout()) {
                            this.getNativeElement().style.minHeight = this.responsiveHeight + 'px';
                        }
                        break;
                }
            }
        }
        super.svyOnChanges(changes);
    }

    getEditor() {
        return this.editor;
    }

    public onInit({ event, editor }: any) {
       this.editor = editor;
    }

    requestFocus(mustExecuteOnFocusGainedMethod: boolean) {
        this.mustExecuteOnFocus = mustExecuteOnFocusGainedMethod;
        this.getEditor().focus();
    }

    public selectAll() {
        const ed = this.getEditor();
        ed.selection.select(ed.getBody(), true);
    }

    public getSelectedText(): string {
        return this.getEditor().selection.getContent();
    }

    public getAsPlainText() {
        return this.getEditor().getContent().replace(/<[^>]*>/g, '');
    }

    public getScrollX(): number {
        return this.getEditor().getWin().scrollX;
    }

    public getScrollY(): number {
        return this.getEditor().getWin().scrollY;
    }

    public replaceSelectedText(text: string) {
        this.getEditor().selection.setContent(text);
        const edContent = this.getEditor().getContent();
        this.dataProviderID = '<html><body>' + edContent + '</body></html>';
        this.pushUpdate();
    }

    public setScroll(x: number, y: number) {
        this.getEditor().getWin().scrollTo(x, y);
    }

    pushUpdate() {
        this.dataProviderIDChange.emit(this.dataProviderID);
    }
}

import { Component, SimpleChanges, Input, Renderer2, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy, Inject, DOCUMENT } from '@angular/core';
import { ServoyBaseComponent, PropertyUtils, ServoyPublicService } from '@servoy/public';
import tinymce, { RawEditorOptions, Editor } from 'tinymce';


@Component({
    selector: 'servoyextra-htmlarea',
    templateUrl: './htmlarea.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
    @Input() readOnly: boolean;
    @Input() responsiveHeight: any;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() text: string;
    @Input() toolTipText: string;
    @Input() scrollbars: any;

    mustExecuteOnFocus = true;
    lastServerValueAsSeenByTinyMCEContent: string;
    tinyValue: any;
    tinyConfig: RawEditorOptions = {
        suffix: '.min',
        height: '100%',
        menubar: false,
        statusbar: false,
        readonly: false,
        promotion: false,
        toolbar: 'fontselect fontsizeselect | bold italic underline | superscript subscript | undo redo |alignleft aligncenter alignright alignjustify | styleselect | outdent indent bullist numlist'
    };
    editor: Editor;
    
    private tabIndex = -2;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, protected servoyPublicService: ServoyPublicService, @Inject(DOCUMENT) private document: Document) {
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
        if (this.lastServerValueAsSeenByTinyMCEContent != this.tinyValue) {
            this.dataProviderID = '<html><body>' + this.tinyValue ? this.tinyValue : '' + '</body></html>';
            this.pushUpdate();
        }
        if (this.onFocusLostMethodID) this.onFocusLostMethodID(new CustomEvent('blur'));
    }

    click({ event }: { event: MouseEvent }) {
        if (this.onActionMethodID) this.onActionMethodID(new MouseEvent(event.type, event));
    }

    contextMenu(event) {
        if (this.onRightClickMethodID) {
            this.onRightClickMethodID(new CustomEvent('contextmenu'));
            event.event.preventDefault();
        }
    }

    keyUp(event) {
        this.getNativeElement().dispatchEvent(new KeyboardEvent('keyup', event.event));
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.servoyPublicService.getLocaleObject()) {
            this.tinyConfig['language'] = this.servoyPublicService.getLocaleObject().language;
        }

        this.tinyConfig['base_url'] = this.document.head.getElementsByTagName('base')[0].href + 'tinymce';

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
                    if (configuration === 'config') {// cy test
                        configuration = {};
                    } else {
                        configuration = JSON.parse(configuration);
                    }
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
                        if (change.previousValue) {
                            const array = change.previousValue.trim().split(' ');
                            array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.removeClass(this.getNativeElement(), element));
                        }
                        if (change.currentValue) {
                            const array = change.currentValue.trim().split(' ');
                            array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.addClass(this.getNativeElement(), element));
                        }
                        break;
                    case 'scrollbars':
                        if (change.currentValue) {
                            const element = this.getNativeChild();
                            PropertyUtils.setScrollbars(element, this.renderer, change.currentValue);
                        }
                        break;
                    case 'editable':
                    case 'readOnly':
                    case 'enabled':
                        const editable = this.editable && !this.readOnly && this.enabled;
                        if (this.getEditor() && !change.firstChange) {
                            if (editable) {
                                this.getEditor().mode.set('design');
                            } else {
                                this.getEditor().mode.set('readonly');
                            }
                        }
                        break;
                    case 'dataProviderID':
                        this.tinyValue = this.dataProviderID;
                        this.lastServerValueAsSeenByTinyMCEContent = this.tinyValue;
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
    
    addShortCut(shortCut: string, callback: () => void) {
        if (this.getEditor()) {
            this.getEditor().addShortcut(shortCut, null, callback);
        } else {
            setTimeout(() => this.addShortCut(shortCut, callback), 10);
        }
    }
    
    public setTabIndex(index: number) {
        this.tabIndex = index;
        this.setTabIndexOnIFrame();
    }
    
    private setTabIndexOnIFrame() {
        if (this.editor && this.tabIndex != -2) {
            const iframe = this.editor.getContainer().getElementsByTagName('iframe');
            if (iframe.item(0))
                iframe.item(0).tabIndex = this.tabIndex;
        }
    }

    getEditor() {
        return this.editor;
    }

    public onInit({ event, editor }: any) {
        this.editor = editor;
        this.lastServerValueAsSeenByTinyMCEContent = editor.getContent();
        const editable = this.editable && !this.readOnly && this.enabled;
        if (!editable) editor.mode.set('readonly')
        this.setTabIndexOnIFrame();
    }

    requestFocus(mustExecuteOnFocusGainedMethod: boolean) {
        this.mustExecuteOnFocus = mustExecuteOnFocusGainedMethod;
        if (this.getEditor()) {
			this.getEditor().focus();
		} else {
			setTimeout(() => this.requestFocus(this.mustExecuteOnFocus), 10);
		}
    }

    public selectAll() {
        const ed = this.getEditor();
        ed.selection.select(ed.getBody(), true);
    }

    public getSelectedText(): string {
        return this.getEditor().selection.getContent();
    }

    public getAsPlainText() {
        return this.getEditor().getContent({ format: 'text' });
    }

    public getScrollX(): number {
        return this.getEditor().getWin().scrollX;
    }

    public getScrollY(): number {
        return this.getEditor().getWin().scrollY;
    }

    public replaceSelectedText(text: string) : string{
        this.getEditor().selection.setContent(text);
        const edContent = this.getEditor().getContent();
        if (this.lastServerValueAsSeenByTinyMCEContent != edContent) {
            this.dataProviderID = '<html><body>' + edContent + '</body></html>';
            this.pushUpdate();
        }
        return this.dataProviderID;
    }

    public setScroll(x: number, y: number) {
        this.getEditor().getWin().scrollTo(x, y);
    }

    pushUpdate() {
        this.dataProviderIDChange.emit(this.dataProviderID);
    }
}

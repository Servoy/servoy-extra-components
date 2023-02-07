import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Column, ServoyExtraTable, TableRow, KeycodeSettings } from './table/table';
import { ServoyExtraHtmlarea } from './htmlarea/htmlarea';
import { ServoyExtraImageLabel } from './imagelabel/imagelabel';
import { ServoyExtraFileUpload } from './fileupload/fileupload';
import { ServoyExtraTextfieldGroup } from './textfieldgroup/textfieldgroup';
import { ServoyExtraLightboxGallery } from './lightboxgallery/lightboxgallery';
import { ServoyExtraSlider } from './slider/slider';
import { ServoyExtraSpinner } from './spinner/spinner';
import { ServoyExtraSplitpane } from './splitpane/splitpane';
import { ServoyExtraMultiFileUpload } from './multifileupload/multifileupload';
import { ServoyExtraSelect2Tokenizer } from './select2tokenizer/select2tokenizer';
import { ServoyExtraYoutubeVideoEmbedder } from './youtubevideoembedder/youtubevideoembedder';
import { ServoyExtraSidenav } from './sidenav/sidenav';
import { ServoyPublicModule, SpecTypesService } from '@servoy/public';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ResizableModule } from 'angular-resizable-element';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BGPane } from './splitpane/bg_splitter/bg_pane.component';
import { BGSplitter } from './splitpane/bg_splitter/bg_splitter.component';
import { Select2Module } from 'ng-select2-component';
import { LightboxModule } from 'ngx-lightbox';
import { ServoyExtraCollapse } from './collapse/collapse';
import { Binding, Callback, LevelVisibilityType, RelationInfo, ServoyExtraDbtreeview } from './dbtreeview/dbtreeview';
import { TreeModule } from '@circlon/angular-tree-component';
import { EditorModule , TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import { ServoyExtraTreeview } from './treeview/treeview';
import { AngularTreeGridModule } from 'angular-tree-grid';
import { ServoyExtraTreeviewCellRenderer } from './treeview/cellrenderer';
import { ServoyExtraGauge } from './gauge/gauge';
import { LinearGauge } from './gauge/lib/linear-gauge';
import { RadialGauge } from './gauge/lib/radial-gauge';
import { UppyAngularDashboardModule } from '@uppy/angular';
import {FileTypesUtilsService} from './fileupload/lib/filetypes';

@NgModule({
    declarations: [
        ServoyExtraTable,
        TableRow,
        ServoyExtraHtmlarea,
        ServoyExtraImageLabel,
        ServoyExtraFileUpload,
        ServoyExtraTextfieldGroup,
        ServoyExtraLightboxGallery,
        ServoyExtraSlider,
        ServoyExtraSpinner,
		ServoyExtraSplitpane,
        ServoyExtraMultiFileUpload,
		ServoyExtraSelect2Tokenizer,
        ServoyExtraYoutubeVideoEmbedder,
        ServoyExtraSidenav,
        ServoyExtraCollapse,
        ServoyExtraDbtreeview,
        ServoyExtraTreeview,
        ServoyExtraTreeviewCellRenderer,
        ServoyExtraGauge,
		BGSplitter,
    	BGPane,
        LinearGauge,
        RadialGauge
    ],
    imports: [
        ServoyPublicModule,
        CommonModule,
        FormsModule,
        ResizableModule,
        ScrollingModule,
        NgbModule,
        FileUploadModule,
        NgxSliderModule,
		Select2Module,
        LightboxModule,
        TreeModule,
        EditorModule,
        AngularTreeGridModule,
        UppyAngularDashboardModule
    ],
    providers: [AsyncPipe,
            { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
            FileTypesUtilsService
    ],
    exports: [ServoyExtraTable,
              TableRow,
              ServoyExtraHtmlarea,
              ServoyExtraImageLabel,
              ServoyExtraFileUpload,
              ServoyExtraTextfieldGroup,
              ServoyExtraLightboxGallery,
              ServoyExtraSlider,
              ServoyExtraSpinner,
			  ServoyExtraSplitpane,
			  ServoyExtraSelect2Tokenizer,
              ServoyExtraMultiFileUpload,
              ServoyExtraYoutubeVideoEmbedder,
              ServoyExtraSidenav,
              ServoyExtraCollapse,
              ServoyExtraDbtreeview,
              ServoyExtraTreeview,
              ServoyExtraGauge
    ],
    schemas: [
             CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ServoyExtraComponentsModule {
    constructor( specTypesService: SpecTypesService ) {
        specTypesService.registerType('servoyextra-table.column', Column);
        specTypesService.registerType('servoyextra-table.settings', KeycodeSettings);
        specTypesService.registerType('servoyextra-dbtreeview.binding', Binding);
        specTypesService.registerType('servoyextra-dbtreeview.callback', Callback);
        specTypesService.registerType('servoyextra-dbtreeview.relationInfo', RelationInfo);
        specTypesService.registerType('servoyextra-dbtreeview.levelVisibilityType', LevelVisibilityType);
   }
}

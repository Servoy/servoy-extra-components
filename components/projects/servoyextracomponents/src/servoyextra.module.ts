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
import { SpecTypesService } from '@servoy/public';
import { BGPane } from './splitpane/bg_splitter/bg_pane.component';
import { BGSplitter } from './splitpane/bg_splitter/bg_splitter.component';
import { ServoyExtraCollapse } from './collapse/collapse';
import { Binding, Callback, LevelVisibilityType, RelationInfo, ServoyExtraDbtreeview } from './dbtreeview/dbtreeview';
import { ServoyExtraTreeview } from './treeview/treeview';
import { ServoyExtraTreeviewCellRenderer } from './treeview/cellrenderer';
import { ServoyExtraGauge } from './gauge/gauge';
import { LinearGauge } from './gauge/lib/linear-gauge';
import { RadialGauge } from './gauge/lib/radial-gauge';
import {FileTypesUtilsService} from './fileupload/lib/filetypes';

@NgModule({
    imports: [
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
    providers: [
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

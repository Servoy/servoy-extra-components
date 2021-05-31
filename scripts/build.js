var AdmZip = require('adm-zip');

// creating archives
var zip = new AdmZip();

zip.addLocalFolder("./META-INF/", "/META-INF/");
zip.addLocalFolder("./dist/servoy/servoyextracomponents/", "/dist/servoy/servoyextracomponents/");
zip.addLocalFolder("./collapse/", "/collapse/");
zip.addLocalFolder("./dbtreeview/", "/dbtreeview/");
zip.addLocalFolder("./fileupload/", "/fileupload/");
zip.addLocalFolder("./fontawesome/", "/fontawesome/");
zip.addLocalFolder("./gauge/", "/gauge/");
zip.addLocalFolder("./htmlarea/", "/htmlarea/");
zip.addLocalFolder("./imagelabel/", "/imagelabel/");
zip.addLocalFolder("./lightboxgallery/", "/lightboxgallery/");
zip.addLocalFolder("./listformcomponent/", "/listformcomponent/");
zip.addLocalFolder("./multifileupload/", "/multifileupload/");
zip.addLocalFolder("./onrenderlabel/", "/onrenderlabel/");
zip.addLocalFolder("./select2tokenizer/", "/select2tokenizer/");
zip.addLocalFolder("./sidenav/", "/sidenav/");
zip.addLocalFolder("./slider/", "/slider/");
zip.addLocalFolder("./spinner/", "/spinner/");
zip.addLocalFolder("./splitpane/", "/splitpane/");
zip.addLocalFolder("./table/", "/table/");
zip.addLocalFolder("./textfieldgroup/", "/textfieldgroup/");
zip.addLocalFolder("./treeview/", "/treeview/");
zip.addLocalFolder("./youtubevideoembedder/", "/youtubevideoembedder/");
zip.addLocalFolder("./lib/", "/lib/");

zip.writeZip("servoyextracomponents.zip");
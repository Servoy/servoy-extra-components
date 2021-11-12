angular.module('servoyextraMultifileupload', ['servoy', 'sabloApp'])
	.directive('servoyextraMultifileupload', ['$sabloApplication', '$timeout', '$sabloConstants', function($sabloApplication, $timeout, $sabloConstants) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				svyServoyapi: "=",
				handlers: "=svyHandlers"
			},
			controller: function($scope, $element, $attrs) { },
			link: function($scope, $element, $attrs) {
				
				var uploadURL = getUploadUrl();
				
				var uppy;
				var uppyProperties;
				var dashboardProperties;
				var tusProperties;
				
				var elementName = $attrs.name;
				var usesCssPosition = $scope.$parent.formProperties.useCssPosition && $scope.$parent.formProperties.useCssPosition[elementName] ? true : false;
				
				var uppyWidth = usesCssPosition ? parseInt($scope.model.cssPosition.width) : $scope.model.size.width;
				var uppyHeight = usesCssPosition ? parseInt($scope.model.cssPosition.height) : $scope.model.size.height;
				
				if (isNaN(uppyWidth)) {
					console.warn('MultiFile upload width only works with integer values (pixels); using default value instead of "' + $scope.model.cssPosition.width + '"');
				}
				if (isNaN(uppyHeight)) {
					console.warn('MultiFile upload height only works with integer values (pixels); using default value instead of "' + $scope.model.cssPosition.height + '"');
				}
				
				/**
				 * Stop all uploads in progress and clear file selection, set progress to 0. 
				 * Basically, return things to the way they were before any user input.
				 */
				$scope.api.reset = function() {
					uppy.reset();
				}
				
				/**
				 * Open the modal window
				 */
				$scope.api.openModal = function() {
					uppy.getPlugin('Dashboard').openModal();
				}
				
				/**
				 * Close the modal window
				 */
				$scope.api.closeModal = function() {
					uppy.getPlugin('Dashboard').closeModal();
				}
				
				/**
				 * Start uploading selected files.
				 */
				$scope.api.upload = function() {
					uppy.upload();
				}
				
				/**
				 * Cancel all uploads, reset progress and remove all files.
				 */
				$scope.api.cancelAll = function() {
					uppy.cancelAll();
				}				
				
				/**
				 * Retry all uploads (after an error, for example)
				 */
				$scope.api.retryAll = function() {
					uppy.retryAll();
				}	
				
				/**
				 * Retry an upload (after an error, for example).
				 * @param {String} fileID
				 */
				$scope.api.retryUpload = function(fileID) {
					uppy.retryUpload(fileID);
				}				
				
				/**
				 * Get an array of all file objects in the component
				 * @return {Array<CustomType<servoyextra-multifileupload.uploadFile>>}
				 */
				$scope.api.getFiles = function() {
					var files = uppy.getFiles();
					var result = [];
					if (files) {
						for (var f = 0; f < files.length; f++) {
							result.push(createUppyFile(files[f]));
						}
					}
					return result;
				}
				
				/**
				 * Remove a file from the component
				 * @param {String} fileID
				 */
				$scope.api.removeFile = function(fileID) {
					uppy.removeFile(fileID);
				}
				
				/**
				 * Get a specific file object by its ID
				 * @param {String} fileID
				 * @return {CustomType<servoyextra-multifileupload.uploadFile>}
				 */
				$scope.api.getFile = function(fileID) {
					var uppyFile = uppy.getFile(fileID);
					if (uppyFile) {
						return createUppyFile(uppyFile);
					} else {
						return null;
					}
				}				
				
				/**
				 * Sets a message in state, with optional details
				 * 
				 * @param {String|{message: String, details: String}} message
				 * @param {String} [type] info, warning, success or error (defaults to info)
				 * @param {Number} [duration] the duration in milliseconds (defaults to 3000)
				 */
				$scope.api.info = function(message, type, duration) {
					uppy.info(message, type ? type : 'info', duration ? duration : 3000);
				}
				
				/**
				 * (Re-)initializes the component
				 */
				$scope.api.initialize = function() {
					uppy.close();
					initUppy();
				}

				function initUppy() {
					setUppyOptions();
					
					uppy = new Uppy.Core(uppyProperties);
					uppy.use(Uppy.Dashboard, dashboardProperties);
					uppy.use(Uppy.Tus, tusProperties);
						
					if ($scope.model.sources) {
						for (var s = 0; s < $scope.model.sources.length; s++) {
							var sourceId = $scope.model.sources[s];
							uppy.use(Uppy[sourceId], { target: Uppy.Dashboard });
						}
					}
					
					if ($scope.handlers.onModalOpened) {
						uppy.on('dashboard:modal-open', function() {
							$scope.handlers.onModalOpened();
						})
					}
					
					if ($scope.handlers.onModalClosed) {
						uppy.on('dashboard:modal-closed', function() {
							$scope.handlers.onModalClosed();
						})
					}
					
					if ($scope.handlers.onUploadComplete) {
						uppy.on('complete', function(result) {
							var filesSuccess = [];
							if (result.successful) {
								for (var o = 0; o < result.successful.length; o++) {
									filesSuccess.push(createUppyFile(result.successful[o]));
								}
							}
							var filesFailed = [];
							if (result.failed) {
								for (var f = 0; f < result.failed.length; f++) {
									filesFailed.push(createUppyFile(result.failed[f]));
								}
							}
							
							$scope.handlers.onUploadComplete(filesSuccess, filesFailed);
						});
					}

					if ($scope.handlers.onRestrictionFailed) {
						uppy.on('restriction-failed', function(file, error) {
							if (error.message === 'Cannot add the file because onBeforeFileAdded returned false.') {
								//onBeforeFileAdded is now synchronous and we need to swallow this in case that returned false
								return;
							}
							$scope.handlers.onRestrictionFailed(createUppyFile(file), error.message);
						});
					}

					if ($scope.handlers.onFileAdded) {
						uppy.on('file-added', function(file) {
							$scope.handlers.onFileAdded(createUppyFile(file));
						});
					}

					if ($scope.handlers.onFileRemoved) {
						uppy.on('file-removed', function(file) {
							$scope.handlers.onFileRemoved(createUppyFile(file));
						});
					}
				}
				
				var filesToBeAdded = [];
				
				function onBeforeFileAdded(currentFile, files) {
					if (!$scope.handlers.onBeforeFileAdded) {
						return true;
					}
					var currentFiles = $scope.api.getFiles();
					
					if (filesToBeAdded.indexOf(currentFile.name) !== -1) {
						return true;
					}
					
					filesToBeAdded.push(currentFile.name);
					
					$scope.handlers.onBeforeFileAdded(createUppyFile(currentFile), currentFiles).then(function(result) {
						if (result === true) {
							uppy.addFile(currentFile);
						}
						filesToBeAdded.splice(filesToBeAdded.indexOf(currentFile.name), 1);
					});
					return false;
				}
				
				function getUploadUrl() {
					var parent = $scope.$parent;

					var beanname = $element.attr("name");
					if (!beanname) {
						var nameParentEl = $element.parents("[name]").first();
						if (nameParentEl) beanname = nameParentEl.attr("name");
					}

					var formname = parent['formname'];
					while (!formname) {
						if (parent.$parent) {
							parent = parent.$parent;
							formname = parent['formname'];
						} else {
							break;
						}
					}
					
					return "tus/upload/" + $sabloApplication.getClientnr() + "/" + formname + "/" + beanname + "/onFileUploaded/";
				}
				
				/**
				 * Creates a servoyextra-uppy.uppyFile from an Uppy file object
				 * @return {CustomType<servoyextra-multifileupload.uploadFile>}
				 */
				function createUppyFile(file) {
					var result = {
						id: file.id,
						name: file.name,
						extension: file.extension,
						type: file.type,
						size: file.size,
						metaFields: {},
						error: null
					};
					
					if ($scope.model.metaFields && file.meta) {
						for (var m = 0; m < $scope.model.metaFields.length; m++) {
							var fieldName = $scope.model.metaFields[m].id
							result.metaFields[fieldName] = file.meta[fieldName] || null;
						}
					}
					
				   result.progress = {
                        bytesTotal: file.size,
                        bytesUploaded: 0,
                        percentage: 0,
                        uploadComplete: false,
                        uploadStarted: null
                    };
                    if (file.progress) {
                        result.progress.bytesTotal = file.progress.bytesTotal;
                        result.progress.bytesUploaded = file.progress.bytesUploaded;
                        result.progress.percentage = file.progress.percentage;
                        result.progress.uploadComplete = file.progress.uploadComplete;
                        result.progress.uploadStarted = file.progress.uploadStarted;
                    }
					
					if (file.error) {
						result.error = file.error;
					}
					
					return result;
				}
				
				function setUppyOptions() {
					var uppyLanguage = $scope.model.language;
					var locale = $sabloApplication.getLocale();
					
					var browserLanguage = locale.language;
					if (browserLanguage && !locale.country) {
						var language = browserLanguage.split('-').join('_');
						if (language === 'en') {
							browserLanguage = 'en_US'
						} else if (language === 'de') {
							browserLanguage = 'de_DE'							
						} else if (language === 'nl') {
							browserLanguage = 'nl_NL'							
						} else if (language === 'fr') {
							browserLanguage = 'fr_FR'							
						} else if (language === 'it') {
							browserLanguage = 'it_IT'							
						} else if (language === 'es') {
							browserLanguage = 'es_ES'							
						} else if (language === 'zh') {
							browserLanguage = 'zh_CN'							
						} else if (language === 'cs') {
							browserLanguage = 'cs_CZ'							
						} else if (language === 'da') {
							browserLanguage = 'da_DK'							
						} else if (language === 'fi') {
							browserLanguage = 'fi_FI'							
						} else if (language === 'el') {
							browserLanguage = 'el_GR'							
						} else if (language === 'hu') {
							browserLanguage = 'hu_HU'							
						} else if (language === 'ja') {
							browserLanguage = 'ja_JP'							
						} else if (language === 'fa') {
							browserLanguage = 'fa_IR'							
						} else if (language === 'ru') {
							browserLanguage = 'ru_RU'							
						} else if (language === 'sv') {
							browserLanguage = 'sv_SE'							
						} else if (language === 'tr') {
							browserLanguage = 'tr_TR'							
						}
					} else if (browserLanguage) {
						browserLanguage += '_' + locale.country
					}
					
					if (uppyLanguage === 'English' || !uppyLanguage) {
						uppyLanguage = null;
					} else if (uppyLanguage === 'German') {
						uppyLanguage = Uppy.locales.de_DE;
					} else if (uppyLanguage === 'Dutch') {
						uppyLanguage = Uppy.locales.nl_NL;
					} else if (uppyLanguage === 'French') {
						uppyLanguage = Uppy.locales.fr_FR;
					} else if (uppyLanguage === 'Italian') {
						uppyLanguage = Uppy.locales.it_IT;
					} else if (uppyLanguage === 'Spanish') {
						uppyLanguage = Uppy.locales.es_ES;
					} else if (uppyLanguage === 'Chinese') {
						uppyLanguage = Uppy.locales.zh_CN;
					} else if (uppyLanguage === 'Czech') {
						uppyLanguage = Uppy.locales.cs_CZ;
					} else if (uppyLanguage === 'Danish') {
						uppyLanguage = Uppy.locales.da_DK;
					} else if (uppyLanguage === 'Finnish') {
						uppyLanguage = Uppy.locales.fi_FI;
					} else if (uppyLanguage === 'Greek') {
						uppyLanguage = Uppy.locales.el_GR;
					} else if (uppyLanguage === 'Hungarian') {
						uppyLanguage = Uppy.locales.hu_HU;
					} else if (uppyLanguage === 'Japanese') {
						uppyLanguage = Uppy.locales.ja_JP;
					} else if (uppyLanguage === 'Persian') {
						uppyLanguage = Uppy.locales.fa_IR;
					} else if (uppyLanguage === 'Russian') {
						uppyLanguage = Uppy.locales.ru_RU;
					} else if (uppyLanguage === 'Swedish') {
						uppyLanguage = Uppy.locales.sv_SE;
					} else if (uppyLanguage === 'Turkish') {
						uppyLanguage = Uppy.locales.tr_TR;
					}
					
					if (!uppyLanguage && browserLanguage && Uppy.locales[browserLanguage]) {
						uppyLanguage = Uppy.locales[browserLanguage];
					}
					
					if ($scope.model.localeStrings) {
						var locale = { strings: {} };
						for ( var key in $scope.model.localeStrings ) {
							var localeString = $scope.model.localeStrings[key];
							if (key.indexOf('.') !== -1) {
								var keyParts = key.split('.');
								if (!locale.strings.hasOwnProperty(keyParts[0])) {
									locale.strings[keyParts[0]] = {};
								} 
								locale.strings[keyParts[0]][keyParts[1]] = localeString;
							} else {
								locale.strings[key] = localeString;
							}
						}
					}
					
					dashboardProperties = {
						target: $scope.model.inline ? '#svy-extra-uppy-' + $scope.model.svyMarkupId : 'body',
						inline: $scope.model.inline,
						trigger: $scope.model.trigger || '.svy-extra-multifileupload-trigger', 
						width: uppyWidth,
						height: uppyHeight,
						showLinkToFileUploadResult: false,
						showProgressDetails: $scope.model.showProgressDetails || false,
						hideUploadButton: $scope.model.hideUploadButton,
						hideRetryButton: $scope.model.hideRetryButton || false,
						hidePauseResumeButton: false,
						hideCancelButton: $scope.model.hideCancelButton || false,
						hideProgressAfterFinish: $scope.model.hideProgressAfterFinish || false,
						note: $scope.model.note,
						closeAfterFinish: $scope.model.inline == false ? $scope.model.closeAfterFinish : null,
						disableStatusBar: $scope.model.disableStatusBar,
						disableInformer: $scope.model.disableInformer || false,
						disableThumbnailGenerator: $scope.model.disableThumbnailGenerator || false,
						animateOpenClose: $scope.model.animateOpenClose || true,
						proudlyDisplayPoweredByUppy: false,
						showSelectedFiles: $scope.model.showSelectedFiles || true,
						browserBackButtonClose: false,
						metaFields: $scope.model.metaFields || [],
						thumbnailWidth: 280,
						closeModalOnClickOutside: false,
						disablePageScrollWhenModalOpen: true,
						locale: locale || null
					}
					
					if ($scope.model.options) {
						for ( var x in $scope.model.options ) {
							dashboardProperties[x] = $scope.model.options[x];
						}
					}
					
					uppyProperties = {
						autoProceed: $scope.model.autoProceed,
						allowMultipleUploads: $scope.model.allowMultipleUploads, 
						restrictions: $scope.model.restrictions,
						locale: uppyLanguage,
						onBeforeFileAdded: onBeforeFileAdded
					}
					
					tusProperties = {
						endpoint: uploadURL,
					}
                    Object.assign(tusProperties, $scope.model.tusOptions)
					
					//meta fields
					var meta = [];
					if ($scope.model.metaFields) {
						for (var m = 0; m < $scope.model.metaFields.length; m++) {
							meta.push($scope.model.metaFields[m].id);
						}
					}
					tusProperties.metaFields = meta || [];
					
					if (uppy) {
						uppy.setOptions(uppyProperties);
						uppy.getPlugin('Dashboard').setOptions(dashboardProperties);
						uppy.getPlugin('Tus').setOptions(tusProperties);
					}					
				}

				//this would allow to provide a JSON file in the media library to provide translations
				//would require a property "translationFile": { "type": "media" }
//				if ($scope.model.translationFile) {
//					$http.get($scope.model.translationFile).then(
//						function(response) {						
//							uppyLocaleStrings = response.data;
//							$timeout(initUppy);
//						},
//						function(response) {	
//							$timeout(initUppy);
//						}
//					);
//				} else {
//					$timeout(initUppy);
//				}
				
				$timeout(initUppy);
				
				Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {configurable: true, value: function(property, value) {
					switch(property) {
						case "inline":
							setUppyOptions();
							break;
						case "localization":
							setUppyOptions();
	                        break;
	                    case "allowMultipleUploads":
							setUppyOptions();
	                        break;
	                    case "showProgressDetails":
							setUppyOptions();
	                        break;	                        
	                    case "hideUploadButton":
							setUppyOptions();
	                        break;	                        
	                    case "hideRetryButton":
							setUppyOptions();
	                        break;	                        
	                    case "hidePauseResumeButton":
							setUppyOptions();
	                        break;	                        
	                    case "hideCancelButton":
							setUppyOptions();
	                        break;	                        
	                    case "hideProgressAfterFinish":
							setUppyOptions();
	                        break;	                        
	                    case "disableStatusBar":
							setUppyOptions();
	                        break;	                        
	                    case "disableInformer":
							setUppyOptions();
	                        break;	                        
	                    case "disableThumbnailGenerator":
							setUppyOptions();
	                        break;	                        
	                    case "animateOpenClose":
							setUppyOptions();
	                        break;	                        
	                    case "proudlyDisplayPoweredByUppy":
							setUppyOptions();
	                        break;	                        
	                    case "showSelectedFiles":
							setUppyOptions();
	                        break;	                        
	                    case "restrictions":
							setUppyOptions();
	                        break;	                        
	                    case "note":
							setUppyOptions();
	                        break;	                        
	                    case "closeModalOnClickOutside":
							setUppyOptions();
	                        break;	                        
	                    case "closeAfterFinish":
							setUppyOptions();
	                        break;	                        
	                    case "disablePageScrollWhenModalOpen":
							setUppyOptions();
	                        break;	                        
	                    case "metaFields":
							setUppyOptions();
	                        break;	                        
	                    case "sources":
							setUppyOptions();
	                        break;	                        
	                    case "language":
							setUppyOptions();
	                        break;	                        
	                    case "localeStrings":
							setUppyOptions();
	                        break;	                        
					}
				}});
			},
			templateUrl: 'servoyextra/multifileupload/multifileupload.html'
		};
	}]
)
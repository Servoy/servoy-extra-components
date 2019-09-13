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
				var xhrProperties;
				var uppyLocaleStrings = null;
				
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
					
					uppy = Uppy.Core(uppyProperties);
					uppy.use(Uppy.Dashboard, dashboardProperties);
					uppy.use(Uppy.XHRUpload, xhrProperties);
						
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
								for (var s = 0; s < result.successful.length; s++) {
									filesSuccess.push(createUppyFile(result.successful[s]));
								}
							}
							var filesFailed = [];
							if (result.failed) {
								for (var s = 0; s < result.failed.length; s++) {
									filesFailed.push(createUppyFile(result.failed[s]));
								}
							}
							
							$scope.handlers.onUploadComplete(filesSuccess, filesFailed);
						});
					}

					if ($scope.handlers.onRestrictionFailed) {
						uppy.on('restriction-failed', function(file, error) {
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
					
					return "resources/upload/" + $sabloApplication.getClientnr() + "/" + formname + "/" + beanname + "/onFileUploaded";
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
					
					if (!file.progress) {
						result.progress = {
							bytesTotal: file.size,
							bytesUploaded: 0,
							percentage: 0,
							uploadComplete: false,
							uploadStarted: null
						}
					} else {
						result.progress = file.progress;
						if (result.progress.uploadStarted) {
							result.progress.uploadStarted = new Date(result.progress.uploadStarted);
						}
					}
					
					if (file.error) {
						result.error = file.error;
					}
					
					return result;
				}
				
				function setUppyOptions() {
					var uppyLanguage = $scope.model.language;
					
					if (uppyLanguage === 'English') {
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
						disablePageScrollWhenModalOpen: true
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
						locale: uppyLocaleStrings ? { strings: uppyLocaleStrings } : uppyLanguage,
						onBeforeFileAdded: onBeforeFileAdded
					}
					
					xhrProperties = {
						endpoint: uploadURL,
						formData: true,
						getResponseData: function(responseText, response) {
							return {
								url: response.responseURL
							}
						}
					}
					
					//meta fields
					var meta = [];
					if ($scope.model.metaFields) {
						for (var m = 0; m < $scope.model.metaFields.length; m++) {
							meta.push($scope.model.metaFields[m].id);
						}
					}
					xhrProperties.metaFields = meta || [];
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
							$scope.api.initialize();
							break;
						case "localization":
							$scope.api.initialize();
	                        break;
	                    case "allowMultipleUploads":
							$scope.api.initialize();
	                        break;
	                    case "showProgressDetails":
							$scope.api.initialize();
	                        break;	                        
	                    case "hideUploadButton":
							$scope.api.initialize();
	                        break;	                        
	                    case "hideRetryButton":
							$scope.api.initialize();
	                        break;	                        
	                    case "hidePauseResumeButton":
							$scope.api.initialize();
	                        break;	                        
	                    case "hideCancelButton":
							$scope.api.initialize();
	                        break;	                        
	                    case "hideProgressAfterFinish":
							$scope.api.initialize();
	                        break;	                        
	                    case "disableStatusBar":
							$scope.api.initialize();
	                        break;	                        
	                    case "disableInformer":
							$scope.api.initialize();
	                        break;	                        
	                    case "disableThumbnailGenerator":
							$scope.api.initialize();
	                        break;	                        
	                    case "animateOpenClose":
							$scope.api.initialize();
	                        break;	                        
	                    case "proudlyDisplayPoweredByUppy":
							$scope.api.initialize();
	                        break;	                        
	                    case "showSelectedFiles":
							$scope.api.initialize();
	                        break;	                        
	                    case "restrictions":
							$scope.api.initialize();
	                        break;	                        
	                    case "note":
							$scope.api.initialize();
	                        break;	                        
	                    case "closeModalOnClickOutside":
							$scope.api.initialize();
	                        break;	                        
	                    case "closeAfterFinish":
							$scope.api.initialize();
	                        break;	                        
	                    case "disablePageScrollWhenModalOpen":
							$scope.api.initialize();
	                        break;	                        
	                    case "metaFields":
							$scope.api.initialize();
	                        break;	                        
	                    case "sources":
							$scope.api.initialize();
	                        break;	                        
	                    case "language":
							$scope.api.initialize();
	                        break;	                        
					}
				}});
			},
			templateUrl: 'servoyextra/multifileupload/multifileupload.html'
		};
	}]
)
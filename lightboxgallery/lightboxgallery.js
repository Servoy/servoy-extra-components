angular.module('servoyextraLightboxgallery', ['servoy']).directive('servoyextraLightboxgallery', ['$timeout', '$window', '$foundsetTypeConstants', function($timeout, $window, $foundsetTypeConstants) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				handlers: "=svyHandlers",
				svyServoyapi: "="
			},
			link: function($scope, $element, $attrs) {
				$element.find('.svyextra-lightboxgallery-image-set').on('scroll', function(){
					var scrollTop = this.scrollTop;
					var pos = scrollTop + this.offsetHeight;
					var max = this.scrollHeight;
 					if (scrollTop > 0 && pos === max ) {
 						if ($scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
				 			$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.numberOfImages);
			 			}
 					}
				});
				
				$scope.clickImage = function() {
					if ($scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
						if ($('#lightbox')) {
							$('.lb-next').on('click', function() {
								var arr = $('.lb-number')[0].textContent.split(' ');
								if(parseInt(arr[1]) === parseInt(arr[3])-1){
									$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.numberOfImages).then(()=>{
										$('.lb-close').click();
										$timeout(function() {
											$window.lightbox.start(angular.element($('a')[arr[3]-1]));
										},50);
										
									});
								}
							});
						}
					}
				}		
				
				$scope.images = [];

				//create images on %scope.images
				function createImagesFromFs() {
					var images = [];
					if ($scope.model.imagesFoundset) {
						if ($scope.model.numberOfImages > 5 && $scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size && $scope.model.numberOfImages > $scope.model.imagesFoundset.viewPort.size){
							$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.numberOfImages - 5);
						}
    					for (var i = 0; i < $scope.model.imagesFoundset.viewPort.rows.length; i++) {
    						/** @type {{image: {url: String}, thumbnail: {url: String}, caption: String, imageId: String}} */
    						var row = $scope.model.imagesFoundset.viewPort.rows[i];
    						var image = {
    							url: row.image && row.image.url ? row.image.url : null,
    							thumbUrl: row.thumbnail && row.thumbnail.url ? row.thumbnail.url : null,
    							caption: row.caption ? row.caption : null,
    							imageId: row.imageId
    						}	
    						
    						//check if using url strings instead of media/blob
    						image.url = typeof row.image == 'string' ? row.image : image.url;
    						image.thumbUrl = typeof row.thumbnail == 'string' ? row.thumbnail : image.thumbUrl;
    						
    						if (!image.url) continue;
    						images.push(image);
    					}
					}
					$scope.images = images;
					$timeout(function() {
							$window.lightbox.option({
								'albumLabel': $scope.model.albumLabel,
								'fadeDuration': $scope.model.fadeDuration,
								'fitImagesInViewport': $scope.model.fitImagesInViewport,
								'imageFadeDuration': $scope.model.imageFadeDuration,
								'positionFromTop': $scope.model.positionFromTop,
								'resizeDuration': $scope.model.resizeDuration,
								'wrapAround': $scope.model.wrapAround,
								'showImageNumberLabel': $scope.model.showImageNumberLabel
							})
							$window.lightbox.init();
						}, 50);
				}
				
				$scope.$watch('model.imagesFoundset', function(newValue, oldValue) {
					if ($scope.svyServoyapi.isInDesigner()) return;

					if (oldValue) oldValue.removeChangeListener(foundsetListener);
					
					// load data
					createImagesFromFs();

					// addFoundsetListener
					if (newValue) newValue.addChangeListener(foundsetListener);
				});
				
				var foundsetListener = function(changes) {
					// check to see what actually changed and update what is needed in browser
					if (changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROWS_COMPLETELY_CHANGED]
					       || changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROW_UPDATES_RECEIVED]
					       || changes[$foundsetTypeConstants.NOTIFY_FULL_VALUE_CHANGED]) {
						createImagesFromFs();
					}					
				};
				
				var destroyListenerUnreg = $scope.$on("$destroy", function() {
					if ($scope.model.imagesFoundset) {
						$scope.model.imagesFoundset.removeChangeListener(foundsetListener);
					}
					destroyListenerUnreg();
				});

				$scope.getStyle = function() {
					var style = { };
					if ($scope.model.maxImageWidth) {
						if ($scope.model.maxImageWidth == -1) {
							style.maxWidth = 'none';
						} else {
							style.maxWidth = $scope.model.maxImageWidth + 'px';
						}
					}
					if ($scope.model.maxImageHeight) {
						if ($scope.model.maxImageHeight == -1) {
							style.height = 'auto';
						} else {
							style.maxHeight = $scope.model.maxImageHeight + 'px';
						}
					}
					return style;
				}

				$scope.getCaptionStyle = function() {
					var style = { };
					if ($scope.model.maxImageWidth) {
						if ($scope.model.maxImageWidth == -1) {
							style.maxWidth = 'none';
						} else {
							style.maxWidth = $scope.model.maxImageWidth + 'px';
						}
					}
					return style;
				}				

				$scope.api.showLightbox = function() {
					if ($scope.images && $scope.images.length > 0) {
						var firstImg = angular.element($element[0].querySelector('a'));
						if (firstImg) {
							$window.lightbox.start(firstImg);
						}
					}
				}
				
				$scope.api.refresh = function() {
					createImagesFromFs();
				}
			},
			controller: function($scope, $element, $attrs) { },
			templateUrl: 'servoyextra/lightboxgallery/lightboxgallery.html'
		};
	}])
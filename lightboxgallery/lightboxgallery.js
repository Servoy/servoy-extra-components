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
				var checkNumber;
				var nullImages;
				
				$timeout(function() {
					loadMoreData();
				}, 50);
				
				setHeight();
				
				$element.find('.svyextra-lightboxgallery-image-set').on('scroll', function(){
 					if (Math.abs(this.scrollHeight - this.clientHeight - this.scrollTop) < 1) {
 						if ($scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
				 			$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.imageBatchSize);
			 			}
 					}
				});
				
				$(document).on('keydown', function(event) {
					if (event.code === 'ArrowRight') {
						$('.lb-next').click();
					} else if (event.code === 'ArrowLeft') {
						$('.lb-prev').click();
					}
				});
				
				function updateTotalImages() {
					var totalImages = $scope.model.imagesFoundset.serverSize - nullImages;
					if ($scope.model.imagesFoundset.hasMoreRows) {
						totalImages += "+";
					}
					var arr = $('.lb-number')[0].textContent.split(' ');
					arr[arr.length-1] = totalImages; 
					$('.lb-number')[0].textContent = arr.join(' ');
				}
				
				$scope.clickImage = function(index) {
					if (($scope.images && $scope.images.length - 1 <= index) && $scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
						$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.imageBatchSize).then(() => {
							$timeout(function() {
								$scope.clickImage(index); 
							});
						});
					} else {
						if ($scope.images && $scope.images.length - 1 >= index) {
							$window.lightbox.start(angular.element($element[0].querySelectorAll('a')[index]));
							if ($scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
								if ($('#lightbox')) {
									$timeout(function() { updateTotalImages(); }, 50);
									$('.lb-next').on('click', function() {
										$timeout(function() { updateTotalImages(); }, 50);
										var currentImage = parseInt($('.lb-number')[0].textContent.split(' ')[1]);
										if ((currentImage + nullImages) === checkNumber && $scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
											var openAt = currentImage;
											$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.imageBatchSize).then(() => {
												$('.lb-close').click();
												$timeout(function() {
													$window.lightbox.start(angular.element($element[0].querySelectorAll('a')[openAt]));
													$timeout(function() { updateTotalImages(); }, 50);
												});
											});
										}
									});
									$('.lb-prev').on('click', function() {
										$timeout(function() { updateTotalImages(); }, 50);
									});
								}
							}
						} else {
							console.warn(`Cannot load the image with index ${index}`);
						}
					}
				}
				
				function loadMoreData() {
					if ($scope.model.maxImageHeight || $scope.model.maxImageWidth) {
						if ($scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size) {
							if (!($element.find('.svyextra-lightboxgallery-image-set')[0].clientHeight < $element.find('.svyextra-lightboxgallery-image-set')[0].scrollHeight)) {
								$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.imageBatchSize);
							}
						}	
					}
				}	
				
				$scope.images = [];

				//create images on %scope.images
				function createImagesFromFs() {
					var images = [];
					if ($scope.model.imagesFoundset) {
						if ($scope.model.imageBatchSize > 5 && $scope.model.imagesFoundset.serverSize > $scope.model.imagesFoundset.viewPort.size && $scope.model.imageBatchSize > $scope.model.imagesFoundset.viewPort.size){
							$scope.model.imagesFoundset.loadExtraRecordsAsync($scope.model.imageBatchSize - 5);
						}
						nullImages = 0;
    					for (var i = 0; i < $scope.model.imagesFoundset.viewPort.rows.length; i++) {
    						/** @type {{image: {url: String}, thumbnail: {url: String}, caption: String, imageId: String}} */
    						var row = $scope.model.imagesFoundset.viewPort.rows[i];
    						var image = {
    							url: row.image && row.image.url ? row.image.url : null,
    							thumbUrl: row.thumbnail && row.thumbnail.url ? row.thumbnail.url : null,
    							caption: row.caption ? row.caption : null,
    							imageId: row.imageId
    						}	
    						
    						if (!row.image) nullImages += 1;
    						
    						//check if using url strings instead of media/blob
    						image.url = typeof row.image == 'string' ? row.image : image.url;
    						image.thumbUrl = typeof row.thumbnail == 'string' ? row.thumbnail : image.thumbUrl;
    						
    						if (!image.url) continue;
    						images.push(image);
    					}
    					checkNumber = images.length + nullImages - 1;
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
							$window.lightbox.keyboardAction = null;
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
				
				$scope.$watch('model.responsiveHeight', function(newValue, oldValue) {
					setHeight();
				});
				
				var foundsetListener = function(changes) {
					// check to see what actually changed and update what is needed in browser
					if (changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROWS_COMPLETELY_CHANGED]
					       || changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROW_UPDATES_RECEIVED]
					       || changes[$foundsetTypeConstants.NOTIFY_FULL_VALUE_CHANGED]) {
						createImagesFromFs();
						loadMoreData();
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

				$scope.api.showLightbox = function(index) {
					$scope.clickImage(index >=0 ? index : 0);
				}
				
				$scope.api.refresh = function() {
					createImagesFromFs();
				}
				
				function setHeight() {
					if (!$scope.$parent.absoluteLayout) {
						if ($scope.model.responsiveHeight) {
							$element.find('.svyextra-lightboxgallery-image-set')[0].style.height = $scope.model.responsiveHeight + 'px';
						} else {
							$element.find('.svyextra-lightboxgallery-image-set')[0].style.height = '100%';
						}
					} 
				}
			},
			controller: function($scope, $element, $attrs) { },
			templateUrl: 'servoyextra/lightboxgallery/lightboxgallery.html'
		};
	}])
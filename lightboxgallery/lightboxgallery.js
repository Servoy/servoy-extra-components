angular.module('servoyextraLightboxgallery', ['servoy'])
	.directive('servoyextraLightboxgallery', ['$timeout', '$window', function($timeout, $window) {  
	    return {
	      restrict: 'E',
	      scope: {
	    	  model: '=svyModel',
			  api: "=svyApi"
	      },
	      link: function($scope, $element, $attrs) {
		    	$scope.images = [];
		    	  
				//create images on %scope.images
				function createImagesFromFs() {
					var images = [];
					for (var i = 0; i < $scope.model.imagesFoundset.viewPort.rows.length; i++) {
						/** @type {{image: {url: String}, thumbnail: {url: String}, caption: String}} */
						var row = $scope.model.imagesFoundset.viewPort.rows[i];
						var image = { 
							url: row.image ? row.image.url.split('?')[0] : null, 
							thumbUrl: row.thumbnail ? row.thumbnail.url.split('?')[0] : null, 
							caption: row.caption ? row.caption : null 
						}
						if (!image.url) continue;
						images.push(image);
					}
					$scope.images = images;
					$timeout(function() {
						$window.lightbox.option({
						      'albumLabel': $scope.model.albumLabel,
						      'fitImagesInViewpoer': $scope.model.fitImagesInViewpoer,
						      'fadeDuration': $scope.model.fadeDuration,
						      'fitImagesInViewport': $scope.model.fitImagesInViewport,
						      'imageFadeDuration': $scope.model.imageFadeDuration,
						      'positionFromTop': $scope.model.positionFromTop,
						      'resizeDuration': $scope.model.resizeDuration,
						      'wrapAround': $scope.model.wrapAround,
						      'showImageNumberLabel': $scope.model.showImageNumberLabel
					    })
						$window.lightbox.init();
					}, 0);
				}
				
				createImagesFromFs();
				
				//add a listener to get notified of changes of dataproviders or added and deleted records
				$scope.model.imagesFoundset.addChangeListener(function(changes) {
					if (!changes.viewportRowsUpdated && changes.viewPortSizeChanged) {
						createImagesFromFs();
					} else if (changes.viewportRowsUpdated && changes.viewportRowsUpdated.updates && changes.viewportRowsUpdated.updates.length > 0) {
						createImagesFromFs();
					}
				});
				
				$scope.getStyle = function() {
					var style = {};
					if ($scope.model.maxImageWidth) {
						style.maxWidth = $scope.model.maxImageWidth + 'px';
					}
					if ($scope.model.maxImageHeight) {
						style.maxHeight = $scope.model.maxImageHeight + 'px';
					}
					return style;
				}
				
				$scope.api.showLightbox = function() {
					var firstImg = angular.element($element[0].querySelector('a'));
					if (firstImg) {
						$window.lightbox.start(firstImg);
					}
				}
	      },
	      controller: function($scope, $element, $attrs) {
	    	 
	      },
	      templateUrl: 'servoyextra/lightboxgallery/lightboxgallery.html'
	    };
	  }])
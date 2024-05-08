angular.module('servoyextraSplitpane',['servoy']).directive('servoyextraSplitpane', function($sabloConstants, $window,$timeout) {  
	return {
		restrict: 'E',
		scope: {
			model: "=svyModel",
			svyServoyapi: "=",
			handlers: "=svyHandlers",
			api: "=svyApi"
		},
		controller: function($scope, $element, $attrs, $timeout) {

			if ($scope.model.resizeWeight == undefined) $scope.model.resizeWeight = 0;
			if ($scope.model.pane1MinSize == undefined) $scope.model.pane1MinSize = 30;
			if ($scope.model.pane2MinSize == undefined) $scope.model.pane2MinSize = 30;
			if ($scope.model.divSize == undefined) $scope.model.divSize = 5;
			
			var splitPane1;
			var splitPane2;
			$scope.registerSplitPane = function(splitPaneElement, which) {
				if (which == "split1") {
					splitPane1 = splitPaneElement;
				}
				else if (which == "split2") {
					splitPane2 = splitPaneElement;
				}
			} 

			function getHandlerElement()
			{
				var splitter = $element.children(0).children(0);
				if (splitter.children().length == 3)
				{
					return $(splitter.children()[1]);
				}
				return $();
			}
			
			function initDivLocation(newValue) {
				var multiplier;
				
				if ($scope.model.divLocation === -1) {
					// default value, half of design size
					newValue = ($scope.model.splitType == 0 ? getSize().width:getSize().height)
					multiplier = 1/2;
				}
				else if ($scope.model.divLocation > 0 && $scope.model.divLocation <= 1)
				{
					multiplier = $scope.model.divLocation;
				}	
				if (multiplier)
				{
					$scope.model.divLocation = Math.round(newValue * multiplier);
					$scope.processDivLocation();
				}	
			}
			
			function getWidth() {
				return $element.parent().innerWidth();
			}

			function getHeight() {
				return $element.parent().innerHeight();
			}

			function getSize() {
				return { width: getWidth(), height: getHeight() };
			}

			$scope.processDivLocation = function() {
				if(!splitPane1 || !splitPane2) return;
				var jqueryDivEl = getHandlerElement();
				if (jqueryDivEl.length == 0 || ($scope.model.splitType == 0 && getWidth() == 0) || ($scope.model.splitType == 1 && getHeight() == 0)) {
					$timeout($scope.processDivLocation,10);
					return;
				}
				initDivLocation($scope.model.splitType == 0 ? getWidth():getHeight());

				var pos = $scope.model.divLocation;
				var divSize = $scope.model.divSize;
				if ((!divSize && divSize !== 0) || divSize <0) divSize = 5;
				if($scope.model.splitType == 1) { 
					if(pos <= 1) {
						pos = getSize().height * pos;
					}
					jqueryDivEl.prop('style').removeProperty('left');
					jqueryDivEl.css('top', pos + 'px');
					splitPane1.prop('style').removeProperty('width');
					splitPane1.css('height', pos + 'px');
					splitPane2.prop('style').removeProperty('left');
					splitPane2.css('top', (pos+divSize) + 'px');
					splitPane2.prop('style').removeProperty('border-left-width');
					if (divSize === 0)
					{
						splitPane2.css('border-top-width','0px');
					}
					else
					{
						splitPane2.css('border-top-width','1px');
					}	
				}
				else {
					if(pos <= 1) {
						pos = getSize().width * pos;
					}
					jqueryDivEl.prop('style').removeProperty('top');
					jqueryDivEl.css('left', pos + 'px');
					splitPane1.prop('style').removeProperty('height');
					splitPane1.css('width', pos + 'px');
					splitPane2.prop('style').removeProperty('top');
					splitPane2.css('left', (pos+divSize) + 'px');
					splitPane2.prop('style').removeProperty('border-top-width');
					if (divSize === 0)
					{
						splitPane2.css('border-left-width','0px');
					}
					else
					{
						splitPane2.css('border-left-width','1px');
					}
				}
			}

			var previous = -1;
			function processResize() {
				var delta  = 0;
				if($scope.model.splitType == 1) {
					if (previous == -1) {
						previous = $element[0].firstChild.clientHeight;
					}
					delta = $element[0].firstChild.clientHeight - previous;
					previous = $element[0].firstChild.clientHeight;
				}
				else if($scope.model.splitType == 0) {
					if (previous == -1) {
						previous = $element[0].firstChild.clientWidth;
					}
					delta = $element[0].firstChild.clientWidth - previous;
					previous = $element[0].firstChild.clientWidth;
				}
				if (delta != 0)
					$scope.model.divLocation += Math.round(delta * $scope.model.resizeWeight); // the divLocation watch will do the rest
			}
			// initialize 'previous'
			processResize();

			var resizeTimeout;
			function onResize() {
				if(resizeTimeout) {
					$timeout.cancel(resizeTimeout);
				}
				resizeTimeout = $timeout(processResize, 50);
			}
			$window.addEventListener('resize',onResize);
			
			$scope.$watch('model.divSize', function(newValue, oldValue){
				var dividerEl = getHandlerElement();
				if($scope.model.splitType == 1) {
					dividerEl.css('height', $scope.model.divSize + 'px'); 
				} else {
					dividerEl.css('width',  $scope.model.divSize + 'px'); 
				}
				if(newValue != oldValue) {
					$scope.processDivLocation()
				}
			});

			//called when the divider location is changed from server side scripting
			$scope.$watch('model.divLocation', function(newValue, oldValue){
				if ((newValue || newValue === 0) && newValue  !== oldValue) {
					$scope.processDivLocation();
					if($scope.handlers.onChangeMethodID) {
						$scope.$evalAsync(function() {
							$scope.handlers.onChangeMethodID(-1,$.Event("change"));
						});
					}
					// let the containing forms re-calculate their size
					$timeout(function() {
						var event;
						if (typeof(Event) === 'function') {
							event = new Event('resize');
						} else {
							event = document.createEvent('Event');
							event.initEvent('resize', true, true);
						}
						$window.dispatchEvent(event);
					});
				}
			});

			if ($scope.model.pane1 && $scope.model.pane1.containsFormId) {
				$scope.svyServoyapi.formWillShow($scope.model.pane1.containsFormId, $scope.model.pane1.relationName,0);
			};
			if ($scope.model.pane2 && $scope.model.pane2.containsFormId) {
				$scope.svyServoyapi.formWillShow($scope.model.pane2.containsFormId, $scope.model.pane2.relationName,1);
			};
			//called by bg-splitter when the user changes the divider location with the mouse
			$scope.onChange = function() {
				$scope.model.divLocation = getBrowserDividerLocation();
				$scope.$apply(); // not in angular so we need a digest that will trigger the watch that will then trigger the handler
			}

			$scope.getForm = function(pane) {
				if (!pane) return null;
				return $scope.svyServoyapi.getFormUrl(pane.containsFormId);
			}

			$scope.getLayoutStyle = function() {
				var style = {
					width: "100%",
					height: "100%"
				};
				if(!$scope.svyServoyapi.isInAbsoluteLayout()) {
					style.minHeight = $scope.model.responsiveHeight + "px";
				}
				return style;
			}

			function getBrowserDividerLocation() {
				var dividerEl = getHandlerElement();
				var dividerLocation;
				if($scope.model.splitType == 1) {
					dividerLocation = dividerEl.css('top'); 
				}
				else {
					dividerLocation = dividerEl.css('left'); 
				}

				return dividerLocation ? parseInt(dividerLocation.substring(0, dividerLocation.length - 2)) : 0;
			}

			$scope.$watch("model.pane1.containsFormId", function(newValue, oldValue) {
                if (oldValue === newValue) return;
                if (oldValue){
                    $scope.svyServoyapi.hideForm(oldValue);
                }
				if (newValue) {
					$scope.svyServoyapi.formWillShow(newValue, $scope.model.pane1.relationName, 0);
				}
			});
			$scope.$watch("model.pane2.containsFormId", function(newValue, oldValue) {
                if (oldValue === newValue) return;
                if (oldValue){
                    $scope.svyServoyapi.hideForm(oldValue);
                }
				if (newValue) {
					$scope.svyServoyapi.formWillShow(newValue, $scope.model.pane2.relationName, 1);
				}
			});

			$scope.$watch("model.visible", function(newValue,oldValue) {
    	  		if (newValue !== oldValue)
    	  		{
    	  			if (newValue)
    	  			{
    	  				if ($scope.model.pane1 && $scope.model.pane1.containsFormId) {
    	  					$scope.svyServoyapi.formWillShow($scope.model.pane1.containsFormId, $scope.model.pane1.relationName,0);
    	  				}
    	  				if ($scope.model.pane2 && $scope.model.pane2.containsFormId) {
    	  					$scope.svyServoyapi.formWillShow($scope.model.pane2.containsFormId, $scope.model.pane2.relationName,1);
    	  				}
    	  			}
    	  			else
    	  			{
    	  				if ($scope.model.pane1 && $scope.model.pane1.containsFormId) {
    	  					$scope.svyServoyapi.hideForm($scope.model.pane1.containsFormId);
    	  				}
    	  				if ($scope.model.pane2 && $scope.model.pane2.containsFormId) {
    	  					$scope.svyServoyapi.hideForm($scope.model.pane2.containsFormId);
    	  				}
    	  			}	
  			}	
  		  });
			
			$scope.api.getInternalWidth = function() {
				return getWidth();
			}
			
			$scope.api.getInternalHeight = function() {
				return getHeight();
			}

			var className = null;
			var element = $element.children().first();
			
			Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
				configurable : true,
				value : function(property, value) {
					switch (property) {
						case "styleClass":
							if (className)
								element.removeClass(className);
							className = value;
							if (className)
								element.addClass(className);
							break;
						}
				}
			});
			var destroyListenerUnreg = $scope.$on("$destroy", function() {
				destroyListenerUnreg();
				delete $scope.model[$sabloConstants.modelChangeNotifier];
			});
			// data can already be here, if so call the modelChange function so that it is initialized correctly.
			var modelChangFunction = $scope.model[$sabloConstants.modelChangeNotifier];
			for (var key in $scope.model) {
				modelChangFunction(key, $scope.model[key]);
			}

			// Temporarily hide and then display the second pane to force Safari to correctly render it on initial load.
			$timeout(function() {
				var pane1 = angular.element(document.querySelector('.split-pane1'));
				var pane2 = angular.element(document.querySelector('.split-pane2'));
			
				// Force removal from the render tree
				if (pane1.length) pane1.css('display', 'none');
				if (pane2.length) pane2.css('display', 'none');
			
				$timeout(function() {
					// Trigger a reflow for each pane
					if (pane1.length) pane1.css('display', '');
					if (pane2.length) pane2.css('display', '');
				}, 0);
			}, 10);

			// Re-initialize the divider to ensure all elements are rendered correctly.
			$timeout(function() {
				$scope.processDivLocation();
			}, 0);
		},
		link: function($scope, $element, $attrs) {
			$scope.processDivLocation();
		},
		templateUrl: 'servoyextra/splitpane/splitpane.html'
	};
}).directive("paneloadchecker",function($parse) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			$scope.registerSplitPane($element, $attrs.paneloadchecker)
		}
	}
})
angular.module('servoyextraSelect2tokenizer',['servoy'])
.directive('servoyextraSelect2tokenizer', ['$log', '$sabloConstants', '$compile', function($log, $sabloConstants, $compile) {
	return {
		restrict: 'E',
		scope: {
			model: "=svyModel",
			handlers: "=svyHandlers",
			api: "=svyApi",
			svyServoyapi: '='
		},
		link: function($scope, $element, $attrs) {
			
			var MAX_LENGTH = 100;
			var SEPARATOR = {
				COMMA: "comma",
				NEW_LINE: "new_line"
			}
			
			var tags = [];			// the array of valuelistItems
			var hashMap = {}; 		// contains the realValue to be resolved in displayValue
			var searchText;			// the last search text

			var wrapper = $element.find('.svy-select2-autotokenizer');
			var tokenizer = $element.find('.svy-select2');
			
			initTokanizer();
			
			var className = null;
		
			Object.defineProperty($scope.model,$sabloConstants.modelChangeNotifier, {configurable:true,value:function(property,value) {
				switch(property) {
					case "enabled":
						tokenizer.prop("disabled", !isEnabled());
						break;
					case "readOnly":
						tokenizer.prop("disabled", !isEnabled());
						break;
					case "valuelistID":
						// TODO if valuelist changes relookup all selected values
						// updateTags();
						// initTokanizer();
						break;
					case "dataProviderID":
						// reset the hashMap
						hashMap = {};
						if ($log.debugEnabled) $log.debug("selec2-autoTokenizer: change dataprovideID to " + value + ' ID:  ' + $scope.model.datProviderID);
						if (tokenizer) {
							var values = getValues();
							if (values && values.length) {
								// remove all the options
								tokenizer.empty();
								
								// init the hash first
								var realValue;
								for (var  i = 0; values && i < values.length;  i++) {
									realValue = values[i];
									hashMap[realValue] = realValue;
								}
								
								// select each value
								for (realValue in hashMap) {
									selectRealValue(realValue, values);
								}
								
							} else {
								// remove all values
								tokenizer.empty();
								tokenizer.val(null);
								tokenizer.trigger("change");
							}
						}
						
						break;
					case "styleClass":
						if (className) wrapper.removeClass(className);
						className = value;
						if(className) wrapper.addClass(className);
						break;
				}
			}});
			var destroyListenerUnreg = $scope.$on("$destroy", function() {
				destroyListenerUnreg();
				delete $scope.model[$sabloConstants.modelChangeNotifier];
			});
			
			// data can already be here, if so call the modelChange function so that it is initialized correctly.
			var modelChangFunction = $scope.model[$sabloConstants.modelChangeNotifier];
			for (var key in $scope.model) {
				modelChangFunction(key,$scope.model[key]);
			}
							
			function initTokanizer() {
				
				var options = { };
				// placeholder
				options.multiple = true;
				options.selectOnClose = $scope.model.closeOnSelect;
				options.closeOnSelect = $scope.model.selectOnClose;
				if ($scope.model.placeholderText) options.placeholder = $scope.model.placeholderText;
				
				// options.tokenSeparators = [',', ' '];
//				$scope.model.allowNewEntries ? options.tags = tags : options.data = tags;

				// allow new entries
				if (!$scope.model.allowNewEntries) {
					options.language = {
			            noResults: function() {
			            	return $scope.model.noMatchesFoundText ? $scope.model.noMatchesFoundText : "No match";
			            }
			        }
				} else {
					options.tags = true;
				}
				
				// query the valuelist for unlimited valuelists
				options.ajax = { 
					transport : queryValuelist,
				    processResults: processResults,
					cache: true,
					delay: 250
				}

				if (tokenizer && tokenizer.length) {
					// remove old listeners
					tokenizer.off("change");
					
					// init the select 2
					tokenizer.select2(options);
					tokenizer.on("change", function(e) {
							onChange(e);
						});
					
					// called each time the dropdown is open
					tokenizer.on("select2:open", function(e) {
						if ($scope.handlers.onFocusGainedMethodID) {
							$scope.handlers.onFocusGainedMethodID(e)
						}
					});
					
					// called each time an element is unselected or the dropdown is closed
					tokenizer.on("select2:close", function(e) {
						
						// reset searchText
						searchText = null;
						
						if ($scope.handlers.onFocusLostMethodID) {
							$scope.handlers.onFocusLostMethodID(e)
						}
					});
					
					// TODO fix tabsequence
					$scope.$evalAsync( function () {
						// find input
						var input = $element.find('input');
						if (!input.length) {
							$log.warn('selec2-autoTokenizer: cannot find input !!');
						}
						
						// add tabSequence
						addTabSeq(input, $scope, $scope.model.tabSeq);
					});
											
				} else {
					$log.error('selec2-autoTokenizer: cannot find tokenizer in DOM');
				}

			}
			
			/**
			 * @deprecated use select2:open and select2:close instead
			 *  */
			function attachEventHandler(element, domEvent, handler) {
				// remove previous event
				$element.off(domEvent, 'input');
				
				function executeHandler(event) {
					handler(event);
				} 
				
				// attach new event
				if (handler) {
					// always use timeout or evalAsync because this event could be triggered by a angular call (requestFocus) thats already in a digest cycle.
					$element.on(domEvent, 'input', function(event) {
						// event.stopPropagation();
						$scope.$evalAsync(executeHandler(event));
					});
				}
			}
			
			function addTabSeq (input, scope, tabSeq) {
				// FIXME has to be done costantly
				if (input && input !== []) {
					if (!isNaN(tabSeq) && tabSeq > -1 ) {
						input.attr("sablo-tabseq", tabSeq); 
						$compile(input)(scope);
					}
				}
			}
			
			// filter valuelist with search term
			function queryValuelist(params, querySuccess, queryFailure) {
				  var searchTerm = params.data.term;
				  if (searchTerm === undefined) searchTerm = "";
				  
				  var $request;
				  // TODO avoid query request if i already have the results in list
				  // if there is only one result or contains searchterm AND subset already available client side
				  if ((tags.length === 1 && tags[0].text === searchText) || (searchTerm.indexOf(searchText, 0) > -1 && tags.length < MAX_LENGTH)) {
				  	// pointless to search for more values
				  	var promise = new Promise(function (resolve, vailure) {
				  		// filter on valuelist
				  		var results = [];
				  		var list = $scope.model.valuelistID;
				  		for (var i = 0; list && i < list.length; i++) {
				  			
				  			// TODO implement diatrics (see in select2.js diatrics module)
				  			// TODO strip comma dots and other symbols
				  			// TODO compare uppercase
				  			
				  			// if there is a match
				  			if (list[i].displayValue.indexOf(searchTerm) > -1) {
				  				results.push(list[i])
				  			}
				  		}
				  		
				  		resolve(results);
				  	});
				  	
				  	$request = promise.then(querySuccess, queryFailure);
					  
				  } else {
					  // reduce the valuelist
				      $request = $scope.model.valuelistID.filterList(searchTerm);
				      $request.then(querySuccess, queryFailure);
				  }

				  // update searchTerm
				  searchText = searchTerm;
			      return $request;
			}
			
			// provess the updated valuelist
			function processResults(data) {
		        return {
			          results: getValuelistTags(data)
			     };
			}
			
			/**
			 * If the dataProviderID is update the realValue may not be available in the cached list
			 * Get the displayValue of each selected item
			 * Update the select2 only once all displayValue have been collected
			 * 
			 * If a displayValue cannot be found shows the realValue
			 *  
			 *  */
			function selectRealValue(realValue, values) {
				var optionId = $scope.model.svyMarkupId + '__' + realValue

				$scope.model.valuelistID.getDisplayValue(realValue).then(getDisplayValueSuccess, getDisplayValueFailure);
				
				// success
				function getDisplayValueSuccess(data) {
					if ($log.debugEnabled) $log.debug('selec2-autoTokenizer: realValue: ' + realValue + ' displayValue: ' +  data);
					
					// show realValue if there is no displayValue
					if (data === null) {
						data = realValue
					}
					
					// add option into the select2
					delete hashMap[realValue];
					tokenizer.append('<option id=' + optionId +' value="' + realValue + '">' + data +'</option>');
					
					// trigger tokenizer change once all the displayValues have been retrieved
					if (getObjectLength(hashMap) === 0) {
						tokenizer.val(values);
						tokenizer.trigger('change');
					}
				}
				
				// fails retrieving displayValue
				function getDisplayValueFailure(e) {
					$log.error(e);
					getDisplayValueFailure("");
				}
			}
			
			function getObjectLength(o) {
				var count = 0;
				for (var k in o) count++;
				return count;
			}
			
			function getValues() {
				var values;
				if ($scope.model.dataProviderID) {
					// split values if is a String convert to string if is a number or Boolean
					if (isTypeString()) {
						values = $scope.model.dataProviderID.split("\n");
					} else if ( isTypeNan() || isTypeBoolean()) {
						values = [$scope.model.dataProviderID];
					} else {
						$log.warn("Warning dataProviderID typeof " + $scope.model.dataProviderID.constructor.name + " not allowed")
					}
				}
				return values;
			}
			
			function getValuelistTags(data) {
				if (!data) {
					data = $scope.model.valuelistID;
				}
				var valuelistTags = [];
				if (data) {
					for (var i = 0; i < data.length; i++) {
						valuelistTags.push({ id: data[i].realValue, text: data[i].displayValue });
					}
				}
				// update cached tags
				tags = valuelistTags;
				return valuelistTags;
			}

			function updateTags() {
				tags = [];
				if ($scope.model.valuelistID) {
					tags = getValuelistTags();
				}
			}
			
			function isEnabled () {
				return $scope.model.enabled === true && $scope.model.readOnly == false;
			}
			
			function isTypeString() {
				return  !$scope.model.dataProviderID || $scope.model.dataProviderID.constructor.name === "String"
			} 
			
			function isTypeNan() {
				return  $scope.model.dataProviderID.constructor.name === "Number"
			}
			
			function isTypeBoolean() {
				return  $scope.model.dataProviderID.constructor.name === "Boolean"
			}

			function onChange(e) {
				if ($log.debugEnabled) $log.debug('selec2-autoTokenizer: onChange called ' + ' ID: ' + $scope.model.svyMarkupId)
				
				if ($scope.model.dataproviderType != SEPARATOR.COMMA) {
					var data = tokenizer.select2("data");
					var dpValue;

					if (data && data.length > 0) {

						// split values if is a String convert to string if is a number or Boolean
						// When dataProviderID is empty i dont know the type of dataProviderID. In case is a String
						if (data.length > 1 && isTypeString()) {
							dpValue = [];
							for (var i = 0; i < data.length; i++) {
								dpValue.push(data[i].id);
							}
							dpValue = dpValue.join("\n");
						} else if ( data.length ==1 || isTypeNan() || isTypeBoolean() ) {
							dpValue = data[data.length - 1].id;
						} else {
							$log.warn("Warning dataProviderID typeof " + $scope.model.dataProviderID.constructor.name + " not allowed")
						}

					} else {
						dpValue = null;
					}

					// apply change to dataProviderID
					if ($scope.model.dataProviderID != dpValue) {
						$scope.model.dataProviderID = dpValue;
						// console.log(dpValue);
						$scope.svyServoyapi.apply('dataProviderID');
					}
				} else { // TODO
					$scope.svyServoyapi.apply('dataProviderID');
				}
			}

			$scope.api.onDataChangeCallback = function(event, returnval) {
			     console.log("onDataChangeCallback")
			     var stringValue = typeof returnval == 'string'
			     if (!returnval || stringValue) {
						wrapper.addClass('ng-invalid');
			            // TODO this will set ng-invalid on the tag, but "Select2" added many internal things to it that have
			            // there own background color and img, so the color of ng-invalid won't be shown here...
			            // even setting ng-invalid class on those doesn't have to work because the background settings that is in select2.css could still override it.
			           // ngModel.$setValidity("", false);
			    } else {
			       // ngModel.$setValidity("", true);
					wrapper.removeClass('ng-invalid');
			    }
			}
			
			
		$scope.api.onDataChangeCallbac2k = function(event, returnval) {
			var stringValue = typeof returnval == 'string'
				if(returnval === false || stringValue) {
					$element[0].focus();
					ngModel.$setValidity("", false);
					if (stringValue) {
						if ( storedTooltip == false)
							storedTooltip = $scope.model.toolTipText;
						$scope.model.toolTipText = returnval;
					}
				}
				else {
					ngModel.$setValidity("", true);
					if (storedTooltip !== false) $scope.model.toolTipText = storedTooltip;
					storedTooltip = false;
				}
		}				
			
		},
      templateUrl: 'servoyextra/select2tokenizer/select2tokenizer.html'
    };
}]);
angular.module('servoyextraSelect2tokenizer',['servoy', 'diacritics'])
.directive('servoyextraSelect2tokenizer', ['$diacritics', '$log', '$sabloConstants', '$compile', '$timeout', function($diacritics, $log, $sabloConstants, $compile, $timeout) {
	return {
		restrict: 'E',
		scope: {
			model: "=svyModel",
			handlers: "=svyHandlers",
			api: "=svyApi",
			svyServoyapi: '='
		},
		link: function($scope, $element, $attrs) {
			/* 
			| .select2-selection__choice      | select2 selector. style the tag |
			| .select2-results__option        | select2 selector. style the option in dropdown |
			| .select2-results__option--highlighted   | select2 selector. style the highlighted option in dropdown |
			| .select2-container--default .select2-results__option[aria-selected=true] | select2 selector. style the disabled option in dropdown | 
			 */
						
			var MAX_LENGTH = 100;
			var SEPARATOR = {
				COMMA: "comma",
				NEW_LINE: "new_line"
			}
			
			var tags = [];			// the array of valuelistItems
			var hashMap = {}; 		// contains the realValue to be resolved in displayValue
			var searchText = "";			// the last search text
			var tabIndex;
			var observer;
			var executeOnFocusGained = true;

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
						// TODO watch for changes in styleclass and edit dropdown styleclass
						if (className) wrapper.removeClass(className);
						className = value;
						if(className) wrapper.addClass(className);
						break;
				}
			}});
			var destroyListenerUnreg = $scope.$on("$destroy", function() {
				destroyListenerUnreg();
				delete $scope.model[$sabloConstants.modelChangeNotifier];
				if (observer) {
					observer.disconnect();
				}
			});
			
			// data can already be here, if so call the modelChange function so that it is initialized correctly.
			var modelChangFunction = $scope.model[$sabloConstants.modelChangeNotifier];
			for (var key in $scope.model) {
				modelChangFunction(key,$scope.model[key]);
			}
							
			function initTokanizer() {
				
				var options = { 
					containerCssClass: "svy-select2-autotokenizer-container",
					dropdownCssClass: "svy-select2-autotokenizer-dropdown"
				};
				
				// add styleclass to dropdown
				if ($scope.model.styleClass) {
					options.dropdownCssClass += " " + $scope.model.styleClass;
				}
				
				//options.containerCssClass = "custom-red"
				//options.dropdownCssClass = "custom-red"
				// placeholder
				options.multiple = true;
				options.selectOnClose = $scope.model.selectOnClose;
				options.closeOnSelect = $scope.model.closeOnSelect;
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
					
					// listen for focus to set tabIndex
					wrapper.unbind('focus')
					wrapper.bind('focus', setFocus)
					
					// remove old listeners
					tokenizer.off("change");
					tokenizer.off("select2:open");
					tokenizer.off("select2:close");
					tokenizer.off("select2:select");
					tokenizer.off("select2:opening");
					tokenizer.off("select2:unselecting");
					
					// init the select 2
					tokenizer.select2(options);
					tokenizer.on("change", function(e) {
							onChange(e);
					});
					
					// called each time the dropdown is open
					tokenizer.on("select2:open", function(e) {
						if (executeOnFocusGained && $scope.handlers.onFocusGainedMethodID) {
							$scope.handlers.onFocusGainedMethodID(e)
						}
						executeOnFocusGained = true;
					});
					
					// called each time an element is unselected or the dropdown is closed
					tokenizer.on("select2:close", function(e) {
						
						// reset searchText
						searchText = "";
						
						if ($scope.handlers.onFocusLostMethodID) {
							$scope.handlers.onFocusLostMethodID(e)
						}
					});
					
					// reset the searchText when an option is selected. has effect only when closeOnSelect is false
					if ($scope.model.closeOnSelect == false && $scope.model.clearSearchTextOnSelect == true) {
						tokenizer.on("select2:select", function(e) {
							var searchField = $element.find('input');
							var text = searchField.val();
							if (text) {		// only if there is searchText;
								// clear searchBox
								searchField.val("");

								// reset searchText
								searchText = "";

								// update filtered list
								// instance.dropdown.$search.val("");
								var instance = tokenizer.data('select2');
								instance.trigger('query', { term: "" });
							}
						});
					}
					
					// prevent dropdown open when unselecting a tag
					var unselecting;
					if ($scope.model.openOnUnselect != true) {
						tokenizer.on('select2:opening', function (e) {
						    if (unselecting) {    
						    	unselecting = false;
						        e.preventDefault();
						    }
						});
						tokenizer.on('select2:unselecting', function (e) {
							unselecting = true;
							
							// use timeout to reset unselection to false.
					    	$timeout(function () {
						    	unselecting = false;
					    	});
						});
					}
											
				} else {
					$log.error('selec2-autoTokenizer: cannot find tokenizer in DOM');
				}
				initTabSequence();

			}
			
			function setFocus(e) {
				if (tabIndex === null || tabIndex === undefined) {
					tabIndex = wrapper.attr("tabindex");
					
					// use the reserved gap
					if (tabIndex > -1) {
						tabIndex = parseInt(tabIndex) + 1;
					}
				}
				var input = $element.find('input');
				if (input[0]) {
					resetInputTabIndex(input);
					input[0].focus();
				} else {
					$log.warn("select-2autoTokenizer: cannot set focus on field")
				}
			}
			
			function resetInputTabIndex(input) {
				if (!input) input = $element.find('input');
				if (input[0]) {
					input.attr("tabindex", tabIndex);
				} else {
					$log.warn("select-2autoTokenizer: cannot set focus on field")
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
			
			function initTabSequence() {
			    addTabSeq($scope, $scope.model.tabSeq);
				
			    // start an observer to get mutation on the selected element
				observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
				    if (mutation.addedNodes.length && mutation.addedNodes[0].classList.contains('select2-search')) {
					    $timeout(setTabSeq);
				    }
				  });    
				});
					
				var obsConfig = { attributes: false, childList: true, characterData: false };						
				var target = $element.find("ul.select2-selection__rendered");
				observer.observe(target[0], obsConfig);
			}
			
			function addTabSeq (scope, tabSeq) {
				
				// add and evaluate sablo-tabseq on the input field
				var input = $element.find('input');
				if (input && input !== []) {
					if (!isNaN(tabSeq) && tabSeq > -1 ) {
						// set the tabSeq on the input field
						input.attr("sablo-tabseq", tabSeq); 
						$compile(input)(scope);
						
						// persist the tabSeq in an internal var
						$scope.$evalAsync(function () {
							tabIndex = input.attr("tabindex");
							$log.debug("store tabIndex value " + tabIndex);
							setTabSeq();
						});
					} else {
						tabIndex = -1;
						setTabSeq();
					}
				} else {
					$log.warn('selec2-autoTokenizer: addTabSeq cannot find input !');
				}
			}
			
			function setTabSeq () {
			
				// update the tabSequence value of the input field.
				var input = $element.find('input');				
				$log.debug('set tab index to: ' +tabIndex);
				
				if (input && input !== []) {
					if (!isNaN(tabIndex) && tabIndex > -1 ) {
						input.attr('tabindex', tabIndex);
					} else {
						input.attr('tabindex', -1);
					}
				} else {
					$log.warn('selec2-autoTokenizer: setTabSeq cannot find input !');
				}
			}
			
			// filter valuelist with search term
			function queryValuelist(params, querySuccess, queryFailure) {
				  var searchTerm = params.data.term;
				  if (searchTerm === undefined) searchTerm = "";
				  
				  var $request;
				  // TODO avoid query request if i already have the results in list
				  // if searchText is contained in SearchTerm AND if there is only one result in list OR subset already available client side
				  if ((searchTerm.length > searchText.length && searchTerm.indexOf(searchText, 0) > -1) && ((tags.length === 1 && tags[0].text === searchText) || tags.length < MAX_LENGTH)) {
					$log.debug("subset already on clientside " + searchTerm);
				  	// pointless to search for more values
				  	var promise = new Promise(function (resolve, vailure) {
				  		// filter on valuelist
				  		var results = [];
				  		var list = $scope.model.valuelistID;
				  		for (var i = 0; list && i < list.length; i++) {
				  							  			
				  			// Check if the text contains the term
				  			if (isSearchTermMatching(list[i].displayValue, searchTerm)) {
				  				results.push(list[i])
				  			}
				  		}
				  		
				  		resolve(results);
				  	});
				  	
				  	$request = promise.then(querySuccess, queryFailure);
					  
				  } else {
					  
					  // use wildcard if setting allow
					  if ($scope.model.containSearchText) {
						  searchTerm = "%" + searchTerm;
					  }
					  
					  // reduce the valuelist
				      $request = $scope.model.valuelistID.filterList(searchTerm);
				      $request.then(querySuccess, queryFailure);
				  }

				  // update searchTerm
				  searchText = searchTerm;
			      return $request;
			}
			
			/** 
			 * @param {String} itemText
			 * @param {String} searchTerm
			 * returns true if searchTerm is matching itemText depending on 
			 * */
			function isSearchTermMatching(itemText, searchTerm) {
				
	  			// ignore comma and dots
	  			if (searchTerm.indexOf(',') === -1) {
					itemText = itemText.replace(/,/g, '');
	  			}
	  			if (searchTerm.indexOf('.') === -1) {
					itemText = itemText.replace(/\./g, '');
	  			}
				
	  			var strippedItemTextValue = $diacritics.stripDiacritics(itemText).toLowerCase();
	  			var stippedSearchTerm = $diacritics.stripDiacritics(searchTerm).toLowerCase();
				
				if ($scope.model.containSearchText) {	// is contained
					return strippedItemTextValue.indexOf(stippedSearchTerm) > -1
				} else {	// starts with
					return strippedItemTextValue.indexOf(stippedSearchTerm) === 0;
				}
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
				return  !$scope.model.dataProviderID || $scope.model.dataProviderID.constructor.name === "String" || typeof($scope.model.dataProviderID) === "string";
			} 
			
			function isTypeNan() {
				return  $scope.model.dataProviderID.constructor.name === "Number" || typeof($scope.model.dataProviderID) === "number";
			}
			
			function isTypeBoolean() {
				return  $scope.model.dataProviderID.constructor.name === "Boolean" || typeof($scope.model.dataProviderID) === "boolean";
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
						$scope.svyServoyapi.apply('dataProviderID');
					}
				} else { // TODO
					$scope.svyServoyapi.apply('dataProviderID');
				}
			}

			$scope.api.onDataChangeCallback = function(event, returnval) {
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
			
			$scope.api.requestFocus = function(mustExecuteOnFocusGainedMethod) {
				var input = $element.find('input');
					input[0].focus();
					executeOnFocusGained = mustExecuteOnFocusGainedMethod !== false;
					tokenizer.trigger("select2:opening");
					// TODO open the dropdown
			}
			
			
		/** 
		 * @deprecated
		 * This fuction is setting the validity using ngModel; ngModel can be used only on input field.
		 * */
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
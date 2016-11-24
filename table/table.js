angular.module('servoyextraTable', ['servoy']).directive('servoyextraTable', ["$log", "$timeout", "$sabloConstants", "$foundsetTypeConstants", "$filter", function($log, $timeout, $sabloConstants, $foundsetTypeConstants, $filter) {
		return {
			restrict: 'E',
			scope: {
				model: "=svyModel",
				svyServoyapi: "=",
				api: "=svyApi",
				handlers: "=svyHandlers"
			},
			link: function($scope, $element, $attrs) {

				var wrapper = $element.find(".tablewrapper")[0];
				var tbody = $element.find("tbody");
				// the initial maximum of the rows to render (this should grow to the max ui view port)
				var initialMaxRenderedRows = 80; // this should be calculated for now this value is nicer for bigger list (that show already 20+ rows by default)
				// the current full maxRenderedRows (grows when scrolling down)
				var maxRenderedRows = Math.min(initialMaxRenderedRows, $scope.model.pageSize);
				// the extra data to be loaded if the viewport is fully rendered.
				var nonPagingPageSize = 200;
				// a variable that hols the last request viewport size (so it won't start looping when scrolling down)
				var lastRequestedViewPortSize = 0;
				var lastRequestedViewPortStartIndex = 0;
				// the start row index of the first rendred row - relative to start of foundset (so not to any viewport)
				var firstRenderedRowIndex = 0;

				// used to avoid a situation where extra or less records are requested multiple times because previous load data requests have not yet arrived back from server to adjust viewport;
				// for example if we calculate that we need 3 less records we send loadLess..(3) but if meanwhile an event happens on client that makes us check that again before we get the new
				// viewport from server we don't want to end up requesting 3 less again (cause in the end our viewport will be 3 records shorter then we want it then)
				var loadingRecordsPromise;

				// this is true when next render of table contents / next scroll selection into view is also allowed to change page (if paging is
				// used); false if it shouldn't change page, for example if the user has just changed to another page manually and table got rerendered
				var scrollNeeded = ($scope.model.lastSelectionFirstElement == -1); // when this is called due to a browser refresh don't necessarily go to selection; only force the scroll on initial show or if the selection changed (see selected indexes watch)

				function getNumberFromPxString(s) {
					var numberFromPxString = -1;
					if (s) {
						s = s.trim().toLowerCase();
						if (s.indexOf("px") == s.length - 2) {
							s = s.substring(0, s.length - 2);
						}
						if ($.isNumeric(s)) {
							numberFromPxString = parseInt(s);

						}
					}
					return numberFromPxString;
				}

				function calculateTableWidth() {
					var tableWidth = 0;
					if ($scope.model.columns) {
						for (var i = 0; i < $scope.model.columns.length; i++) {
							if (!$scope.model.columns[i].autoResize && getNumberFromPxString($scope.model.columns[i].initialWidth) > 0) {
								var w = getNumberFromPxString($scope.model.columns[i].width);
								if (w > -1) {
									tableWidth += w;
								}
							}
						}
					}
					return tableWidth;
				}

				function getAutoColumns() {
					var autoColumns = { columns: { }, minWidth: { }, count: 0 };
					if ($scope.model.columns) {
						for (var i = 0; i < $scope.model.columns.length; i++) {
							if ($scope.model.columns[i].initialWidth == undefined) {
								$scope.model.columns[i].initialWidth = $scope.model.columns[i].width == undefined ? "" : $scope.model.columns[i].width;
							} else {
								$scope.model.columns[i].width = $scope.model.columns[i].initialWidth;
							}
							var minWidth = getNumberFromPxString($scope.model.columns[i].width);
							if ($scope.model.columns[i].autoResize || minWidth < 0) {
								autoColumns.columns[i] = true;
								autoColumns.minWidth[i] = minWidth;
								autoColumns.count += 1;
							}
						}
					}

					return autoColumns;
				}

				function updateAutoColumnsWidth(delta) {
					columnStyleCache = [];
					var componentWidth = getComponentWidth();
					var oldWidth = componentWidth - delta;
					for (var i = 0; i < $scope.model.columns.length; i++) {
						if (autoColumns.columns[i]) {
							if (autoColumns.minWidth[i] > 0) {
								var w = Math.floor(getNumberFromPxString($scope.model.columns[i].width) * componentWidth / oldWidth);
								if (w < autoColumns.minWidth[i]) {
									w = autoColumns.minWidth[i];
								}
								$scope.model.columns[i].width = w + "px";
							} else {
								$scope.model.columns[i].width = $scope.model.columns[i].initialWidth;
							}
						}
					}
				}

				$scope.componentWidth = 0;
				function getComponentWidth() {
					if (!$scope.componentWidth) {
						$scope.componentWidth = $element.parent().outerWidth(false);
					}
					return $scope.componentWidth;
				}

				var autoColumns = getAutoColumns();
				var tableWidth = calculateTableWidth();

				var tableLeftOffset = 0;
				var onTBodyScrollListener = null;
				var resizeTimeout = null;

				function onColumnResize() {
					var table = $element.find("table:first");
					var headers = table.find("th");

					for (var i = 0; i < headers.length; i++) {
						var header = $(headers.get(i));
						if ( (autoColumns.minWidth[i] > 0) && (getNumberFromPxString(header[0].style.width) < autoColumns.minWidth[i])) {
							$scope.model.columns[i].width = autoColumns.minWidth[i] + "px";
							updateAutoColumnsWidth(0);
							$timeout(function() {
									addColResizable(true);
								}, 0);
							return;
						}
						$scope.model.columns[i].width = header[0].style.maxWidth = header[0].style.minWidth = header[0].style.width;
						updateTableColumnStyleClass(i, { width: $scope.model.columns[i].width, minWidth: $scope.model.columns[i].width, maxWidth: $scope.model.columns[i].width });
					}
					var resizer = $element.find(".JCLRgrips");
					var resizerLeft = getNumberFromPxString($(resizer).css("left"));

					var colGrips = $element.find(".JCLRgrip");
					var leftOffset = 1;
					for (var i = 0; i < colGrips.length; i++) {
						leftOffset += getNumberFromPxString($scope.model.columns[i].width);
						$(colGrips.get(i)).css("left", leftOffset - resizerLeft + "px");
					}
					updateTBodyStyle($element.find('tbody')[0]);
				}

				var windowResizeHandler = function() {
					if (resizeTimeout) $timeout.cancel(resizeTimeout);
					if ($scope.model.columns) {
						resizeTimeout = $timeout(function() {
								$scope.$apply(function() {
									var newComponentWidth = $element.parent().outerWidth(false);
									var deltaWidth = newComponentWidth - getComponentWidth();
									if (deltaWidth != 0) {
										$scope.componentWidth = newComponentWidth;
										updateTBodyStyle(tbody[0]);
										if ($scope.model.columns && $scope.model.columns.length > 0) {
											updateAutoColumnsWidth(deltaWidth);
											$timeout(function() {
													if ($scope.model.enableColumnResize) {
														addColResizable(true);
													} else {
														for (var i = 0; i < $scope.model.columns.length; i++) {
															updateTableColumnStyleClass(i, getCellStyle(i));
														}
													}
												}, 0);
										}
									}
								})
							}, 50);
					}
				}
				$(window).on('resize', windowResizeHandler);

				function addColResizable(cleanPrevious) {
					var tbl = $element.find("table:first");
					if (cleanPrevious) {
						tbl.colResizable({
							disable: true,
							removePadding: false
						});
					}
					tbl.colResizable({
						liveDrag: false,
						resizeMode: "fit",
						onResize: function(e) {
							$scope.$apply(function() {
								onColumnResize();
							})
						},
						removePadding: false
					});
					// don't want JColResize to change the column width on window resize
					$(window).unbind('resize.JColResizer');
					// update the model with the right px values
					var tbl = $element.find("table:first");
					var headers = tbl.find("th");
					if ($(headers).is(":visible")) {
						for (var i = 0; i < $scope.model.columns.length; i++) {
							if (autoColumns.columns[i] && autoColumns.minWidth[i] < 0) {
								$scope.model.columns[i].width = $(headers.get(i)).outerWidth(false) + "px";
								updateTableColumnStyleClass(i, { width: $scope.model.columns[i].width, minWidth: $scope.model.columns[i].width, maxWidth: $scope.model.columns[i].width });
							}
						}
					}
				}

				function onTableRendered() {
					adjustFoundsetViewportIfNeeded();
					scrollIntoView();

					if (!onTBodyScrollListener) {
						onTBodyScrollListener = function() {
							$timeout(function() {
								tableLeftOffset = -tbody.scrollLeft();
								var resizer = $element.find(".JCLRgrips");
								if (resizer.get().length > 0) {
									$(resizer).css("left", tableLeftOffset + "px");
								}
							});
						}
						tbody.bind("scroll", onTBodyScrollListener);
					}
					if ($scope.model.enableColumnResize) {
						autoColumns = getAutoColumns();
						tableWidth = calculateTableWidth();
						updateAutoColumnsWidth(0);
						addColResizable(true);
					}
				}

				function getPageForIndex(idx) {
					return Math.floor(idx / $scope.model.pageSize) + 1;
				}

				function adjustFoundsetViewportIfNeeded() {
					var adjustFoundsetViewportImpl = function() {
						var serverSize = $scope.model.foundset.serverSize;
						if ($scope.showPagination()) {
							// paging mode only keeps data for the showing page
							var neededVpStart = $scope.model.pageSize * ($scope.model.currentPage - 1);
							if (neededVpStart > serverSize) {
								// this page no longer exists; it is after serverSize; adjust current page and that watch on that will request the correct viewport
								$scope.model.currentPage = getPageForIndex(serverSize - 1);
							} else {
								// see if bounds are slightly off target or completely off target - correct them if needed
								var neededVpSize = Math.min($scope.model.pageSize, serverSize - neededVpStart);

								var vpStart = $scope.model.foundset.viewPort.startIndex;
								var vpSize = $scope.model.foundset.viewPort.size;

								if (! (vpStart >= neededVpStart && (vpStart + vpSize) <= (neededVpStart + neededVpSize))) {
									var neededVpEnd = neededVpStart + neededVpSize - 1;
									var vpEnd = vpStart + vpSize - 1;

									var intersectionStart = Math.max(neededVpStart, vpStart);
									var intersectionEnd = Math.min(neededVpEnd, vpEnd);

									if (intersectionStart <= intersectionEnd) {
										// we already have some or all records that we need; request or trim only the needed rows
										if (neededVpStart < vpStart) loadingRecordsPromise = $scope.model.foundset.loadExtraRecordsAsync(neededVpStart - vpStart, true);
										else if (neededVpStart > vpStart) loadingRecordsPromise = $scope.model.foundset.loadLessRecordsAsync(neededVpStart - vpStart, true);

										if (neededVpEnd < vpEnd) loadingRecordsPromise = $scope.model.foundset.loadLessRecordsAsync(neededVpEnd - vpEnd, true);
										else if (neededVpEnd > vpEnd) loadingRecordsPromise = $scope.model.foundset.loadExtraRecordsAsync(neededVpEnd - vpEnd, true);

										$scope.model.foundset.notifyChanged();
									} else {
										// we have none of the needed records - just request the whole wanted viewport
										loadingRecordsPromise = $scope.model.foundset.loadRecordsAsync(neededVpStart, neededVpSize);
									}
								}
							}
						} else {
							$scope.model.currentPage = 1; // just to be sure - we are not paging so we are on fist "page"
							var rowsToLoad = Math.min(serverSize, $scope.model.pageSize ? $scope.model.pageSize : nonPagingPageSize)
							if ($scope.model.foundset.viewPort.size < rowsToLoad)
								loadingRecordsPromise = $scope.model.foundset.loadExtraRecordsAsync(rowsToLoad - $scope.model.foundset.viewPort.size);
						}
						if (loadingRecordsPromise) {
							loadingRecordsPromise.finally(function() {
								loadingRecordsPromise = undefined;
							});
						}
					}

					// if we are already in the process of loading stuff, wait for it; see comment on loadingRecordsPromise declaration
					if (loadingRecordsPromise) loadingRecordsPromise.finally(adjustFoundsetViewportImpl);
					else adjustFoundsetViewportImpl();
				}

				$scope.$watch('model.foundset.serverSize', function(newValue, oldValue) {
						if (newValue && newValue != oldValue) {
							adjustFoundsetViewportIfNeeded();
						}
					});
				// watch the columns so that we can relay out the columns when width or size stuff are changed.
				var currentColumnLength = $scope.model.columns ? $scope.model.columns.length : 0;
				Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
						configurable: true,
						value: function(property, value) {
							switch (property) {
							case "columns":
								var differentColumns = currentColumnLength != $scope.model.columns.length;
								var valueChanged = differentColumns;
								currentColumnLength = $scope.model.columns.length
								if (!valueChanged) {
									for (var i = 0; i < $scope.model.columns.length; i++) {
										var iw = getNumberFromPxString($scope.model.columns[i].initialWidth);
										if (iw > -1 && ($scope.model.columns[i].width != $scope.model.columns[i].initialWidth)) {
											$scope.model.columns[i].initialWidth = $scope.model.columns[i].width;
											if (!valueChanged) valueChanged = true;
										}
									}
								}

								if (valueChanged) {
									autoColumns = getAutoColumns();
									tableWidth = calculateTableWidth();
									if ($scope.model.columns && $scope.model.columns.length > 0) {
										updateAutoColumnsWidth(0);
										$timeout(function() {
												if ($scope.model.enableColumnResize) {
													addColResizable(true);
												} else {
													for (var i = 0; i < $scope.model.columns.length; i++) {
														updateTableColumnStyleClass(i, getCellStyle(i));
													}
												}
												if (differentColumns) generateTemplate(true);
											}, 0);
									}
								}
								// if the columns didn't change completely then test for the style class
								if (!differentColumns) updateColumnStyleClass();
								break;
							}
						}
					});

				$scope.$watch('model.foundset.viewPort.rows', function(newValue, oldValue) {
						maxRenderedRows = $scope.model.pageSize > 0 ? Math.min(initialMaxRenderedRows, $scope.model.pageSize) : initialMaxRenderedRows;
						lastRequestedViewPortSize = 0;
						lastRequestedViewPortStartIndex = 0;
						generateTemplate();
					})

				$scope.$watch('model.currentPage', function(newValue, oldValue) {
						if (newValue && newValue != oldValue && $scope.showPagination()) {
							adjustFoundsetViewportIfNeeded();
						}
					});

				$scope.$watch('model.pageSize', function(newValue, oldValue) {
						if (oldValue != newValue) {
							if (oldValue && newValue && $scope.showPagination()) {
								adjustFoundsetViewportIfNeeded();
							}
							maxRenderedRows = $scope.model.pageSize > 0 ? Math.min(initialMaxRenderedRows, $scope.model.pageSize) : initialMaxRenderedRows;
						}
						$scope.model.foundset.setPreferredViewportSize( (newValue < 50 && newValue != 0) ? newValue : nonPagingPageSize)
					});

				$scope.$watch('model.foundset.viewPort', function(newValue, oldValue) {
						// the following code is only for when user changes page in browser I think
						// so we really did request the correct startIndex already
						if ($scope.showPagination()) {
							if ($scope.model.pageSize * ($scope.model.currentPage - 1) != newValue.startIndex) {
								$scope.model.currentPage = getPageForIndex(newValue.startIndex);
							} else /* if (newValue.size < $scope.model.pageSize && $scope.model.foundset.serverSize > (newValue.startIndex + newValue.size)) */ {
								adjustFoundsetViewportIfNeeded();
							}
						}
					});

				$scope.$watch('model.foundset.sortColumns', function(newValue, oldValue) {
						if (newValue) {
							var sortColumnsA = $scope.model.foundset.sortColumns.split(" ");
							if (sortColumnsA.length == 2) {
								for (var i = 0; i < $scope.model.columns.length; i++) {
									if (sortColumnsA[0] == $scope.model.columns[i].dataprovider.idForFoundset) {
										$scope.model.sortColumnIndex = i;
										$scope.model.sortDirection = sortColumnsA[1].toLowerCase() == 'asc' ? 'up' : 'down';
										break;
									}
								}
							}
						}
					});

				var toBottom = false;
				$scope.$watch('model.visible', function(newValue) {
						if (newValue) {
							wrapper = $element.find(".tablewrapper")[0];
							tbody = $element.find("tbody");

							// as model.visible is used in an ng-if around both these elements and that didn't execute yet, give it a chance to do so
							if (! (wrapper && tbody)) $scope.$evalAsync(function() {
									wrapper = $element.find(".tablewrapper")[0];
									tbody = $element.find("tbody");
								});

							// TODO do we need to reinitialize anything else here as the elements were recreated
						} else {
							toBottom = false;
							tbody = null;
							wrapper = null;
						}
					});

				function scrollIntoView(onlySetSelection) {
					var firstSelected = $scope.model.foundset.selectedRowIndexes[0];

					if ($scope.showPagination()) {
						if (scrollNeeded && getPageForIndex(firstSelected) != $scope.model.currentPage) {
							// we need to switch page in order to show selected row
							$scope.model.currentPage = getPageForIndex(firstSelected);
							return;
						}
					}
					firstSelected = firstSelected - firstRenderedRowIndex;

					var child = (firstSelected >= 0 ? tbody.children().eq(firstSelected) : undefined); // eq negative idx is interpreted as n'th from the end of children list
					if (child && child.length > 0) {
						var wrapperRect = wrapper.getBoundingClientRect();
						var childRect = child[0].getBoundingClientRect();
						if (!onlySetSelection && (childRect.top < (wrapperRect.top + 10) || childRect.bottom > wrapperRect.bottom)) {
							child[0].scrollIntoView(!toBottom);
						}
					}

					scrollNeeded = false; // we did change page if it was needed, now reset the flag so that it is only set back to true on purpose
				}
				$scope.$watch('model.foundset.selectedRowIndexes', function(newValue, oldValue) {
						// ignore value change triggered by the watch initially with the same value except for when it was a form re-show and the selected index changed meanwhile
						if (newValue.length > 0) {
							if ( (newValue != oldValue || $scope.model.lastSelectionFirstElement != newValue[0]) && $scope.model.foundset) {
								updateSelection(newValue, oldValue);
								if($scope.model.lastSelectionFirstElement != newValue[0]) {
									scrollNeeded = true;
									var newFirstSelectedValue = newValue[0];
									// first check if the selected row is in the current ui viewport.
									if (tbody && tbody.children().length > 0 && (newFirstSelectedValue < firstRenderedRowIndex || newFirstSelectedValue > (firstRenderedRowIndex + maxRenderedRows))) {
										// its not in the current ui viewport, check if it is in the current data viewport
										var vp = $scope.model.foundset.viewPort;
										if (newFirstSelectedValue < vp.startIndex || newFirstSelectedValue > (vp.startIndex + vp.size)) {
											// selection is not inside the viewport, request another viewport around the selection.
											var newStart = newFirstSelectedValue - 25;
											if (newStart + 50 > $scope.model.foundset.serverSize) {
												newStart = $scope.model.foundset.serverSize - 50;
											}
											if (newStart < 0) newStart = 0;
											$scope.model.foundset.loadRecordsAsync(newStart, 50).then(function() {
												updateTable(null);
											})
										} else {
											updateTable(null);
										}

									} else scrollIntoView();
								}
							}
							$scope.model.lastSelectionFirstElement = newValue[0];
						}
					}, true);

				$scope.hasNext = function() {
					return $scope.model.foundset && $scope.model.currentPage < Math.ceil($scope.model.foundset.serverSize / $scope.model.pageSize);
				}

				$scope.showPagination = function() {
					return $scope.model.pageSize && $scope.model.foundset && $scope.model.foundset.serverSize > $scope.model.pageSize;
				}

				$scope.modifyPage = function(count) {
					var pages = Math.ceil($scope.model.foundset.serverSize / $scope.model.pageSize)
					var newPage = $scope.model.currentPage + count;
					if (newPage >= 1 && newPage <= pages) {
						$scope.model.currentPage = newPage;
					}
				}

				$scope.getRealRow = function(row) {
					return $scope.model.foundset.viewPort.startIndex + row;
				}

				$scope.tableClicked = function(event, type) {
					var elements = document.querySelectorAll(':hover');
					for (var i = elements.length; --i > 0;) {
						var row_column = $(elements[i]).data("row_column");
						if (row_column) {
							var rowIndex = row_column.row;
							var columnIndex = row_column.column;
							var realRow = $scope.getRealRow(rowIndex);
							var newSelection = [realRow];
							//    				 if($scope.model.foundset.multiSelect) {
							if (event.ctrlKey) {
								newSelection = $scope.model.foundset.selectedRowIndexes ? $scope.model.foundset.selectedRowIndexes.slice() : [];
								var realRowIdx = newSelection.indexOf(realRow);
								if (realRowIdx == -1) {
									newSelection.push(realRow);
								} else if (newSelection.length > 1) {
									newSelection.splice(realRowIdx, 1);
								}
							} else if (event.shiftKey) {
								var start = -1;
								if ($scope.model.foundset.selectedRowIndexes) {
									for (var j = 0; j < $scope.model.foundset.selectedRowIndexes.length; j++) {
										if (start == -1 || start > $scope.model.foundset.selectedRowIndexes[j]) {
											start = $scope.model.foundset.selectedRowIndexes[j];
										}
									}
								}
								var stop = realRow;
								if (start > realRow) {
									stop = start;
									start = realRow;
								}
								newSelection = []
								for (var n = start; n <= stop; n++) {
									newSelection.push(n);
								}
							}
							//    				 }

							$scope.model.foundset.requestSelectionUpdate(newSelection);
							if (type == 1 && $scope.handlers.onCellClick) {
								$scope.handlers.onCellClick(realRow + 1, columnIndex, $scope.model.foundset.viewPort.rows[rowIndex], event);
							}

							if (type == 2 && $scope.handlers.onCellRightClick) {
								$scope.handlers.onCellRightClick(realRow + 1, columnIndex, $scope.model.foundset.viewPort.rows[rowIndex], event);
							}
						}
					}
				}
				if ($scope.handlers.onCellRightClick) {
					$scope.tableRightClick = function(event) {
						$scope.tableClicked(event, 2);
					}
				}

				function doFoundsetSQLSort(column) {
					if ($scope.model.columns[column].dataprovider) {
						var sortCol = $scope.model.columns[column].dataprovider.idForFoundset;
						var sqlSortDirection = "asc";
						if ($scope.model.foundset.sortColumns) {
							var sortColumnsA = $scope.model.foundset.sortColumns.split(" ");
							if (sortCol == sortColumnsA[0]) {
								sqlSortDirection = sortColumnsA[1].toLowerCase() == "asc" ? "desc" : "asc";
							}
						}
						$scope.model.foundset.sortColumns = sortCol + " " + sqlSortDirection;
						$scope.model.foundset.sort([{ name: sortCol, direction: sqlSortDirection }]);
					}
				}

				if ($scope.model.enableSort || $scope.handlers.onHeaderClick) {
					$scope.headerClicked = function(event, column) {
						if ($scope.handlers.onHeaderClick) {
							if ($scope.model.enableSort && ($scope.model.sortColumnIndex != column)) {
								$scope.model.sortDirection = null;
							}
							$scope.handlers.onHeaderClick(column, $scope.model.sortDirection, event).then(function(ret) {
									if ($scope.model.enableSort) {
										$scope.model.sortColumnIndex = column;
										$scope.model.sortDirection = ret;
										if (!$scope.model.sortDirection) {
											doFoundsetSQLSort($scope.model.sortColumnIndex);
										}
									}
								}, function(reason) {
									$log.error(reason);
								});
						} else if ($scope.model.enableSort) {
							$scope.model.sortColumnIndex = column;
							doFoundsetSQLSort($scope.model.sortColumnIndex);
						}

					}
				}

				function getFirstVisibleChild() {
					var tbodyBounds = tbody[0].getBoundingClientRect();
					var children = tbody.children()
					for (var i = 0; i < children.length; i++) {
						var childBounds = children[i].getBoundingClientRect();
						if (childBounds.top >= tbodyBounds.top) {
							return children[i];
						}
					}
				}
				function getLastVisibleChild() {
					var tbodyBounds = tbody[0].getBoundingClientRect();
					var children = tbody.children()
					for (var i = 0; i < children.length; i++) {
						var childBounds = children[i].getBoundingClientRect();
						if (childBounds.bottom >= tbodyBounds.bottom) {
							if (i > 0) return children[i - 1]
							return children[i];
						}
					}
					return children[children.length - 1]
				}

				$scope.keyPressed = function(event) {
					var fs = $scope.model.foundset;
					if (fs.selectedRowIndexes && fs.selectedRowIndexes.length > 0) {
						var selection = fs.selectedRowIndexes[0];
						if (event.keyCode == 33) { // PAGE UP KEY
							var child = getFirstVisibleChild();
							if (child) {
								var row_column = $(child).children().eq(0).data("row_column");
								if (row_column) {
									fs.selectedRowIndexes = [fs.viewPort.startIndex + row_column.row];
								}
								child.scrollIntoView(false);
							}
						} else if (event.keyCode == 34) { // PAGE DOWN KEY
							var child = getLastVisibleChild();
							if (child) {
								var row_column = $(child).children().eq(0).data("row_column");
								if (row_column) {
									fs.selectedRowIndexes = [fs.viewPort.startIndex + row_column.row];
								}
								child.scrollIntoView(true);
							}
						} else if (event.keyCode == 38) { // ARROW UP KEY
							if (selection > 0) {
								fs.selectedRowIndexes = [selection - 1];
								if ( (fs.viewPort.startIndex) <= selection - 1) {
									toBottom = false;
								} else $scope.modifyPage(-1);
							}
							event.preventDefault();
						} else if (event.keyCode == 40) { // ARROW DOWN KEY
							if (selection < fs.serverSize - 1) {
								fs.selectedRowIndexes = [selection + 1];
								if ( (fs.viewPort.startIndex + fs.viewPort.size) > selection + 1) {
									toBottom = true;
								} else $scope.modifyPage(1);
							}
							event.preventDefault();
						} else if (event.keyCode == 13) { // ENTER KEY
							if ($scope.handlers.onCellClick) {
								$scope.handlers.onCellClick(selection + 1, null, fs.viewPort.rows[selection])
							}
						} else if (event.keyCode == 36) { // HOME
							fs.requestSelectionUpdate([0]);
							event.preventDefault()
							event.stopPropagation();
						} else if (event.keyCode == 35) { // END
							if (fs.viewPort.startIndex + fs.viewPort.size < fs.serverSize) {
								function loadMore() {
									var currentServerSize = fs.serverSize;
									$scope.model.foundset.loadRecordsAsync(fs.serverSize - 50, 50).then(function() {
										if (currentServerSize == fs.serverSize)
											fs.requestSelectionUpdate([fs.serverSize - 1]);
										else loadMore();
									})
								}
								loadMore();
							} else fs.requestSelectionUpdate([fs.serverSize - 1]);
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}

				function getDisplayValue(input, valuelist) {
					if (valuelist) {
						for (i = 0; i < valuelist.length; i++) {
							if (input === valuelist[i].realValue) {
								return valuelist[i].displayValue;
							}
						}
					}
					return input;
				}

				function updateTableRowSelectionClass(rowsFoundsetIdxArray, rowSelectionClass) {
					var trChildren = tbody.children();
					if(trChildren) {
						for(var i = 0; i < rowsFoundsetIdxArray.length; i++) {
							var trIndex = rowsFoundsetIdxArray[i] - firstRenderedRowIndex;
							if(trIndex < trChildren.length) {
								trChildren.eq(trIndex).get(0).className = rowSelectionClass;
							}
						}
					}
				}

				function updateSelection(newValue, oldValue) {
					if(oldValue) {
						var toUnselect = oldValue.filter(function (i) {
							return !newValue || newValue.indexOf(i) < 0;
						})
						updateTableRowSelectionClass(toUnselect, "");
					}					
					if(newValue) {
						var toSelect = newValue.filter(function (i) {
							return !oldValue || oldValue.indexOf(i) < 0;
						})
						updateTableRowSelectionClass(toSelect, $scope.model.selectionClass);
					}
				}

				function updateTable(changes, offset) {
					var children = tbody.children();
					var childrenListChanged = false;
					var startIndex = 100000000; // relative to rendered/UI viewport
					var endIndex = 0; // relative to rendered/UI viewport
					var rowOffSet = offset ? offset : 0; // offset of firstRenderedRowIndex in/relative to model.foundset.viewport
					var childIdxToScrollTo = -1;
					var alignToTopWhenScrolling = false;
					var vp = $scope.model.foundset.viewPort;

					// if there are changes but the firstRenderedRowIndex of hte last time doesn't fit at all in this index anymore
					// then the viewport is completely changed and we do need a full render
					if (changes && (vp.startIndex >= firstRenderedRowIndex && firstRenderedRowIndex <= (vp.startIndex + vp.size))) {
						// this is hit when row/column viewport updates are happening. we just need to re-render/add/remove the affected TDs in rendered viewport
						// note that TDs are always relative to firstRenderedRowIndex of foundset (so the rendered viewport))

						// first make sure render/UI viewport bounds do not exceed model.foundset.viewport bounds;
						// any further corrections in NEEDED row bounds for display are done afterwards - if needed - in the scroll listener
						firstRenderedRowIndex = Math.max(firstRenderedRowIndex, vp.startIndex);
						maxRenderedRows = Math.min(maxRenderedRows, vp.startIndex + vp.size - firstRenderedRowIndex);
						rowOffSet = firstRenderedRowIndex - vp.startIndex;

						for (var i = 0; i < changes.length; i++) {
							var rowUpdate = changes[i]; // rowUpdate indexes are obviously relative to model.foundset.viewport
							if (rowUpdate.startIndex < rowOffSet + startIndex) startIndex = rowUpdate.startIndex - rowOffSet;
							var updateEndIndex = rowUpdate.endIndex - rowOffSet;

							if (rowUpdate.type == 1) {
								// insert
								// if it's an insert then insert position end by convention really means "new viewport size" not the endIndex; endIndex == viewPort.size (that is what the server sends for insert operations)
								updateEndIndex--;
							} else if (rowUpdate.type == 2) {
								// delete
								updateEndIndex = vp.size - 1 - rowOffSet; // update all after startIndex
							}
							if (updateEndIndex > endIndex) endIndex = updateEndIndex;
						}
						endIndex = Math.min(maxRenderedRows - 1, endIndex); // we don't need to re-render more rows after rendered viewport
						startIndex = Math.max(0, startIndex); // we don't need to re-render more rows before rendered viewport
					} else if (offset >= 0) {
						// offset is given when scrolling up, so new rows will be appended (prepended visually)
						startIndex = 0;
						endIndex = maxRenderedRows - 1;

						// keep scroll at first element of currently first rendered element
						childIdxToScrollTo = firstRenderedRowIndex - vp.startIndex - rowOffSet; // so oldRowOffset - newRowOffset basically as firstRenderedRowIndex will be updated a few lines below
						alignToTopWhenScrolling = true;

						firstRenderedRowIndex = vp.startIndex + rowOffSet; // update firstRenderedRowIndex to render newly fetched records on top
					} else {
						// called when a "full" render needs to be done
						maxRenderedRows = Math.min(maxRenderedRows, vp.size);
						var firstSelected = $scope.model.foundset.selectedRowIndexes ? $scope.model.foundset.selectedRowIndexes[0] : 0;
						if (vp.startIndex < firstSelected && (vp.startIndex + vp.size) > firstSelected) {
							var formStartToSelection = firstSelected - vp.startIndex;
							// selection is in the viewport, try to make sure that is visible.
							rowOffSet = formStartToSelection - (maxRenderedRows / 2); // try to center selection in rendered/UI viewport

							// correct bounds if selection it too close to top or bottom of viewport to be really centered
							if (rowOffSet < 0) rowOffSet = 0;
							else if (rowOffSet + maxRenderedRows > vp.size) rowOffSet = vp.size - maxRenderedRows;

							childIdxToScrollTo = formStartToSelection - rowOffSet; // new selected row rendered index
							alignToTopWhenScrolling = !toBottom;
						} else if (vp.startIndex > 0) {
							// if the vp.startIndex bigger then null and not the minimal page start index:
							var minimalRowIndex = 0;
							if ($scope.showPagination()) {
								// paging mode calculate max size of the current viewPort
								minimalRowIndex = $scope.model.pageSize * ($scope.model.currentPage - 1);
							}
							if (vp.startIndex == minimalRowIndex) {
								// this start index of the viewport is the start of a new page, just start to render there
								childIdxToScrollTo = 0;
								alignToTopWhenScrolling = !toBottom;
							} else {
								// selection is not in the view, vp.startIndex is not the start of a page the just show the middle of the current page
								// so that it does not scroll.
								rowOffSet = vp.size / 2 - maxRenderedRows / 2; // this can't be < 0 or rowOffSet + maxRenderedRows can't be > vp.size because maxRenderedRows <= vp.size (see above where maxRenderedRows is assigned)
								childIdxToScrollTo = maxRenderedRows / 2; // scroll to middle of rendered rows to avoid re-rendering as much as possible
								alignToTopWhenScrolling = !toBottom;
							}
						} else {
							childIdxToScrollTo = 0;
							alignToTopWhenScrolling = !toBottom;
						}
						startIndex = 0;
						endIndex = maxRenderedRows - 1;

						firstRenderedRowIndex = vp.startIndex + rowOffSet;
					}

					var formatFilter = $filter("formatFilter");
					var columns = $scope.model.columns;
					for (var j = startIndex; j <= endIndex; j++) {
						var rowIdxInFoundsetViewport = j + rowOffSet; // index relative to foundset prop.'s viewport array?! but why rowOffset
						var trChildren = children.eq(j).children(); // we should get child relative to really rendered rows viewport
						if (trChildren.length == 0) {
							// as trChildren is relative to rendered viewport, it can only grow (have missing rows) or shrink at the end; if changes
							// happen before it, the data is updated in those cells, no real dom Node inserts have to happen in specific indexes in
							// the rendered viewpot
							tbody[0].appendChild(createTableRow(columns, rowIdxInFoundsetViewport, formatFilter));
							childrenListChanged = true;
						} else for (var c = columns.length; --c >= 0;) {
								var column = columns[c];
								var td = trChildren.eq(c);
								td.data('row_column', { row: rowIdxInFoundsetViewport, column: c });
								var tdClass = 'c' + c;
								if (column.styleClass) {
									tdClass += ' ' + column.styleClass;
								}
								if (column.styleClassDataprovider && column.styleClassDataprovider[rowIdxInFoundsetViewport]) {
									tdClass += ' ' + column.styleClassDataprovider[rowIdxInFoundsetViewport];
								}
								td[0].className = tdClass;
								var value = column.dataprovider ? column.dataprovider[rowIdxInFoundsetViewport] : null;
								var imageMode = value ? value.url : false;
								var divChild = td.children("div");
								if (imageMode && divChild.length == 1) {
									divChild.remove();
									var img = document.createElement("IMG");
									td[0].appendChild(img);
									divChild = td.children("div");
								}
								if (divChild.length == 1) {
									// its text node
									value = getDisplayValue(value, column.valuelist);
									value = formatFilter(value, column.format.display, column.format.type);
									divChild.text(value)
								} else {
									var imgChild = td.children("img");
									if (imgChild.length == 1) {
										if (!value) {
											imgChild[0].setAttribute("src", "");
										} else imgChild[0].setAttribute("src", column.dataprovider[rowIdxInFoundsetViewport].url);
									} else {
										console.log("illegal state should be div or img")
									}
								}
							}
					}

					if (childrenListChanged) {
						childrenListChanged = false;
						children = tbody.children();
					}
					if (children.length > maxRenderedRows) {
						for (var i = children.length; --i >= maxRenderedRows;) {
							children.eq(i).remove();
							childrenListChanged = true;
						}
					}

					if (childrenListChanged) {
						childrenListChanged = false;
						children = tbody.children();
					}
					scrollIntoView(changes != null || offset >= 0);
					if (childIdxToScrollTo >= 0) {
						var scrollToChild = children.eq(childIdxToScrollTo)[0];
						if (scrollToChild) {
							var tbodyBounds = tbody[0].getBoundingClientRect();
							var childBounds = scrollToChild.getBoundingClientRect();
							if (childBounds.top < tbodyBounds.top || childBounds.bottom > tbodyBounds.bottom) {
								scrollToChild.scrollIntoView(alignToTopWhenScrolling);
							}
						}
					}
				}

				var columnCSSRules = [];
				function updateTableColumnStyleClass(columnIndex, style) {
					if (!columnCSSRules[columnIndex]) {
						var ss = document.styleSheets;
						var clsName = "#table_" + $scope.model.svyMarkupId + " .c" + columnIndex;
						var targetStyleSheet;

						for (var i = 0; i < ss.length; i++) {
							if (ss[i].href != null) continue;
							if (!targetStyleSheet) targetStyleSheet = ss[i];
							var rules = ss[i].cssRules || ss[i].rules;

							for (var j = 0; j < rules.length; j++) {
								if (rules[j].selectorText == clsName) {
									columnCSSRules[columnIndex] = rules[j];
									break;
								}
							}
						}
						if (!columnCSSRules[columnIndex]) {
							if (!targetStyleSheet) {
								targetStyleSheet = document.createElement('style');
								targetStyleSheet.type = 'text/css';
								document.getElementsByTagName('head')[0].appendChild(targetStyleSheet);
							}
							var rules = targetStyleSheet.cssRules || targetStyleSheet.rules;
							targetStyleSheet.insertRule(clsName + '{}', rules.length);
							columnCSSRules[columnIndex] = rules[rules.length - 1];
							columnCSSRules[columnIndex].style["height"] = $scope.model.minRowHeight
						}
					}

					for (var p in style) {
						columnCSSRules[columnIndex].style[p] = style[p];
					}

				}
				// cache for the current set style class names, used in the columns property watcher.
				var columnStyleClasses = [];
				function updateColumnStyleClass() {
					var columns = $scope.model.columns;
					for (var c = 0; c < columns.length; c++) {
						if (columns[c].styleClass != columnStyleClasses[c]) {
							generateTemplate();
							break;
						}
					}
				}
				var columnListener = null;
				function generateTemplate(full) {
					var columns = $scope.model.columns;
					if (!columns || columns.length == 0) return;
					var tbodyJQ = tbody;
					var tblHead = $element.find("thead");
					if (tbodyJQ.length == 0 || $(tblHead).height() <= 0) {
						if ($element.closest("body").length > 0) $timeout(generateTemplate);
						return;
					}
					var rows = $scope.model.foundset.viewPort.rows;

					if (columnListener == null) {

						columnListener = function(changes) {
							$scope.$evalAsync(function() {
								updateTable(changes)
							})
						}
						$scope.model.foundset.addChangeListener(columnListener)
					}
					for (var c = 0; c < columns.length; c++) {
						updateTableColumnStyleClass(c, getCellStyle(c));
						columnStyleClasses[c] = columns[c].styleClass;
					}
					if (tbodyJQ.children().length == 0 || full) {
						var formatFilter = $filter("formatFilter");
						var tbodyOld = tbodyJQ[0];
						var tbodyNew = document.createElement("TBODY");
						updateTBodyStyle(tbodyNew);
						maxRenderedRows = Math.min(maxRenderedRows, rows.length)
						var firstSelected = $scope.model.foundset.selectedRowIndexes ? $scope.model.foundset.selectedRowIndexes[0] : 0;
						var startRow = 0;
						var formStartToSelection = firstSelected - $scope.model.foundset.viewPort.startIndex
						if (formStartToSelection < $scope.model.foundset.viewPort.size && formStartToSelection > maxRenderedRows) {
							// if the selection is in the viewport and the will not be rendered because it fall out of the max rows
							// adjust the startRow to render
							startRow = formStartToSelection - maxRenderedRows / 2 + 1;
							if (startRow + maxRenderedRows > $scope.model.foundset.viewPort.size) {
								startRow = $scope.model.foundset.viewPort.size - maxRenderedRows;
							}

						}
						firstRenderedRowIndex = $scope.model.foundset.viewPort.startIndex + startRow
						var rowEnding = startRow + maxRenderedRows
						for (var r = startRow; r < rowEnding; r++) {
							tbodyNew.appendChild(createTableRow(columns, r, formatFilter));
						}
						tbodyOld.parentNode.replaceChild(tbodyNew, tbodyOld)
						tbody = $(tbodyNew);
						tbody.scroll(function(e) {
							var vp = $scope.model.foundset.viewPort;
							if (tbody.scrollTop() < 10) {
								// scroll up behavior
								// for none paging the minimal row index is 0
								var minimalRowIndex = 0;
								if ($scope.showPagination()) {
									// paging mode calculate max size of the current viewPort
									minimalRowIndex = $scope.model.pageSize * ($scope.model.currentPage - 1);
								}
								// check if the current first rendered row index is bigger then what the minimal would be
								if (firstRenderedRowIndex > minimalRowIndex) {
									var startIndex = vp.startIndex;
									var maxRenderedRowsBefore = maxRenderedRows;
									maxRenderedRows = Math.min(maxRenderedRows + initialMaxRenderedRows, vp.size);
									var addedRows = maxRenderedRows - maxRenderedRowsBefore;
									var offset = Math.max(0, firstRenderedRowIndex - addedRows - startIndex);
									if (lastRequestedViewPortStartIndex != startIndex && startIndex > minimalRowIndex && (firstRenderedRowIndex - startIndex) < 20) {
										lastRequestedViewPortStartIndex = startIndex;
										var extraPage = Math.min(50, vp.startIndex);
										loadingRecordsPromise = $scope.model.foundset.loadExtraRecordsAsync(-extraPage);
										loadingRecordsPromise.then(function() {
											maxRenderedRowsBefore = maxRenderedRows;
											maxRenderedRows = Math.min(maxRenderedRows + initialMaxRenderedRows, vp.size); // adjust again just in case server made corrections to the viewport that we requested
											addedRows = maxRenderedRows - maxRenderedRowsBefore;
											offset = Math.max(0, firstRenderedRowIndex - addedRows - vp.startIndex);
											updateTable(null, offset); // this can/will update firstRenderedRowIndex to match the given offset
										}).finally(function() {
											loadingRecordsPromise = undefined;
										});
									}
									updateTable(null, offset);
								}

							} else if ( (tbody.scrollTop() + tbody.height()) > (tbody[0].scrollHeight - tbody.height())) {
								// scroll down behavior
								// calculate max size that can be get, default none paging is that serverSize.
								var maxSize = $scope.model.foundset.serverSize;
								if ($scope.model.pageSize > 0) {
									// paging mode calculate max size of the current viewPort
									var neededVpStart = $scope.model.pageSize * ($scope.model.currentPage - 1);
									// see if bounds are slightly off target or completely off target - correct them if needed
									var neededVpSize = Math.min($scope.model.pageSize, maxSize - neededVpStart);
									maxSize = neededVpStart + neededVpSize;
								}
								if ( (firstRenderedRowIndex + maxRenderedRows) < maxSize) {
									var currentStartIndex = firstRenderedRowIndex - vp.startIndex;
									var viewportSize = vp.size;
									var maxUISize = maxRenderedRows;
									maxRenderedRows = Math.min(maxRenderedRows + initialMaxRenderedRows, viewportSize - currentStartIndex);
									var currentLoaded = vp.startIndex + viewportSize;
									if (lastRequestedViewPortSize != viewportSize && currentLoaded < maxSize && (currentLoaded - (firstRenderedRowIndex + maxRenderedRows)) < 20) {
										lastRequestedViewPortSize = viewportSize;
										loadingRecordsPromise = $scope.model.foundset.loadExtraRecordsAsync(nonPagingPageSize);
										loadingRecordsPromise.finally(function() {
											loadingRecordsPromise = undefined;
										});
									}
									// call update table with the previous start index (of the ui childen) and then new one, and give the current firstRenderedRowIndex as the offset to start from
									updateTable([{ startIndex: currentStartIndex + maxUISize, endIndex: currentStartIndex + maxRenderedRows - 1, type: 0 }], currentStartIndex) // endIndex is inclusive
								}
							}
						})
					} else {
						updateTBodyStyle(tbodyJQ[0]);
						updateTable(null)
					}

					onTableRendered();
				}

				function createTableRow(columns, row, formatFilter) {
					var tr = document.createElement("TR");
					if ($scope.model.foundset.selectedRowIndexes.indexOf(row) != -1) {
						tr.className = $scope.model.selectionClass;
					}
					for (var c = 0; c < columns.length; c++) {
						var column = columns[c];
						var td = document.createElement("TD");
						$(td).data('row_column', { row: row, column: c });
						var tdClass = 'c' + c;
						if (column.styleClass) {
							tdClass += ' ' + column.styleClass;
						}
						if (column.styleClassDataprovider && column.styleClassDataprovider[row]) {
							tdClass += ' ' + column.styleClassDataprovider[row];
						}
						td.className = tdClass;
						tr.appendChild(td);
						if (column.dataprovider && column.dataprovider[row] && column.dataprovider[row].url) {
							var img = document.createElement("IMG");
							img.setAttribute("src", column.dataprovider[row].url);
							td.appendChild(img);
						} else {
							var div = document.createElement("DIV");
							var value = column.dataprovider ? column.dataprovider[row] : null;
							value = getDisplayValue(value, column.valuelist);
							if (column.format) value = formatFilter(value, column.format.display, column.format.type);
							var txt = document.createTextNode(value ? value : "");
							div.appendChild(txt);
							td.appendChild(div);
						}
					}
					return tr;
				}

				var tableStyle = { };
				$scope.getTableStyle = function() {
					tableStyle.width = autoColumns.count > 0 ? getComponentWidth() + "px" : tableWidth + "px";
					return tableStyle;
				}

				var tHeadStyle = { }
				$scope.getTHeadStyle = function() {
					if ($scope.model.enableSort || $scope.handlers.onHeaderClick) {
						tHeadStyle.cursor = "pointer";
					}
					tHeadStyle.width = autoColumns.count > 0 ? getComponentWidth() + "px" : tableWidth + "px";
					tHeadStyle.left = tableLeftOffset + "px";
					return tHeadStyle;
				}

				function updateTBodyStyle(tBodyEl) {
					var tBodyStyle = { };
					var componentWidth = getComponentWidth();
					tBodyStyle.width = componentWidth + "px";
					if (tableWidth < componentWidth) {
						tBodyStyle.overflowX = "hidden";
					}
					var tbl = $element.find("table:first");
					var tblHead = tbl.find("thead");
					if ($(tblHead).is(":visible")) {
						tBodyStyle.top = $(tblHead).height() + "px";
					}
					if ($scope.showPagination()) {
						var pagination = $element.find("ul:first");
						if (pagination.get().length > 0) {
							tBodyStyle.marginBottom = ($(pagination).height() + 2) + "px";
						}
					}

					for (var p in tBodyStyle) {
						tBodyEl.style[p] = tBodyStyle[p];
					}
				}
				var columnStyleCache = []
				$scope.getColumnStyle = function(column) {
					var columnStyle = columnStyleCache[column];
					if (columnStyle) return columnStyle;
					columnStyle = { overflow: "hidden" };
					columnStyleCache[column] = columnStyle;
					var w = getNumberFromPxString($scope.model.columns[column].width);
					if (w > -1) {
						columnStyle.minWidth = columnStyle.maxWidth = columnStyle.width = w + "px";
					} else if ($scope.model.columns[column].width) {
						columnStyle.width = $scope.model.columns[column].width;
					} else {
						columnStyle.minWidth = columnStyle.maxWidth = columnStyle.width = Math.floor( (getComponentWidth() - tableWidth) / autoColumns.count) + "px";
					}
					return columnStyle;
				}

				function getCellStyle(column) {
					var cellStyle = { overflow: "hidden" };
					if (column < $scope.model.columns.length) {
						var w = getNumberFromPxString($scope.model.columns[column].width);
						if ($scope.model.columns[column].autoResize || w < 0) {
							var tbl = $element.find("table:first");
							var headers = tbl.find("th");
							w = $(headers.get(column)).outerWidth(false);
						}
						if (w > -1) {
							cellStyle.minWidth = w + "px";
							cellStyle.width = w + "px";
							cellStyle.maxWidth = w + "px";
						} else if ($scope.model.columns[column].width) {
							cellStyle.width = $scope.model.columns[column].width;
						}
					}
					return cellStyle;
				}
				// watch the table header if there are any column width changes/
				// if that happens flush the cellStyles cache
				$scope.$watch(function() {
						var array = "";
						var columns = $scope.model.columns;
						if (!columns || columns.length == 0) return array;
						var tbl = $element.find("table:first");
						var headers = tbl.find("th");
						for (var column = columns.length; --column >= 0;) {
							array += $(headers.get(column)).outerWidth(false);
						}
						return array;
					}, function(newValue, oldValue) {
						columnStyleCache = [];
					})

				$scope.getSortClass = function(column) {
					var sortClass = "table-servoyextra-sort-hide";
					if ($scope.model.enableSort) {
						var direction;
						var isGetSortFromSQL = $scope.model.sortColumnIndex < 0;
						if (column == $scope.model.sortColumnIndex) {
							direction = $scope.model.sortDirection;
							if (!direction) {
								isGetSortFromSQL = true;
							}
						}
						if (isGetSortFromSQL) {
							if ($scope.model.foundset && $scope.model.foundset.sortColumns && $scope.model.columns[column].dataprovider) {
								var sortCol = $scope.model.columns[column].dataprovider.idForFoundset;
								var sortColumnsA = $scope.model.foundset.sortColumns.split(" ");

								if (sortCol == sortColumnsA[0]) {
									direction = sortColumnsA[1].toLowerCase() == "asc" ? "up" : "down";
								}
							}
						}

						if (direction) {
							sortClass = "table-servoyextra-sort-show-" + direction + " " + $scope.model["sort" + direction + "Class"];
						}
					}
					return sortClass;
				}

				$scope.getLayoutStyle = function() {
					var layoutStyle = { };
					var isAbsolute = $scope.$parent.formProperties && $scope.$parent.formProperties.absoluteLayout;
					if (isAbsolute) {
						layoutStyle.position = "absolute";
						layoutStyle.height = "100%";
					} else {
						layoutStyle.position = "relative";
						if ($scope.model.columns) {
							layoutStyle.height = $scope.model.responsiveHeight + "px";
						}
					}
					return layoutStyle;
				}

				$scope.showEditorHint = function() {
					return (!$scope.model.columns || $scope.model.columns.length == 0) && $scope.svyServoyapi.isInDesigner();
				}

				var skipOnce = false;
				if ($scope.handlers.onFocusGainedMethodID) {
					$scope.onFocusGained = function(event) {
						if (!skipOnce) {
							$scope.handlers.onFocusGainedMethodID(event);
						}
						skipOnce = false;
					}
				}

				var destroyListenerUnreg = $scope.$on("$destroy", function() {
						$(window).off('resize', windowResizeHandler);
						$scope.model.foundset.removeChangeListener(columnListener)
						destroyListenerUnreg();
						delete $scope.model[$sabloConstants.modelChangeNotifier];
					});

				//implement api calls starts from here
				/**
				 * Request the focus to the table html element.
				 * @example %%prefix%%%%elementName%%.requestFocus();
				 * @param mustExecuteOnFocusGainedMethod (optional) if false will not execute the onFocusGained method; the default value is true
				 */
				$scope.api.requestFocus = function(mustExecuteOnFocusGainedMethod) {
					var tbl = $element.find("table:first");
					skipOnce = mustExecuteOnFocusGainedMethod === false;
					tbl.focus();
				}
			},
			templateUrl: 'servoyextra/table/table.html'
		};
	}]);


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

				var tableName = $element.attr('name');
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
				}

				$(window).on('resize', function() {
						if (resizeTimeout) $timeout.cancel(resizeTimeout);
						if ($scope.model.columns) {
							resizeTimeout = $timeout(function() {
									$scope.$apply(function() {
										var newComponentWidth = $element.parent().outerWidth(false);
										var deltaWidth = newComponentWidth - getComponentWidth();
										if (deltaWidth != 0) {
											$scope.componentWidth = newComponentWidth;
											updateTBodyStyle($element.find('tbody')[0]);
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
					});

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
					if (!onTBodyScrollListener) {
						var tbl = $element.find("table:first");
						var tblBody = tbl.find("tbody");
						onTBodyScrollListener = function() {
							$timeout(function() {
								tableLeftOffset = -$(tblBody).scrollLeft();
								var resizer = $element.find(".JCLRgrips");
								if (resizer.get().length > 0) {
									$(resizer).css("left", tableLeftOffset + "px");
								}
							});
						}
						$(tblBody).bind("scroll", onTBodyScrollListener);
					}
					if ($scope.model.enableColumnResize) {
						autoColumns = getAutoColumns();
						tableWidth = calculateTableWidth();
						updateAutoColumnsWidth(0);
						addColResizable(true);
					}
				}

				var unregTbody = $scope.$watch(function() {
						return $element.find("tbody").length;
					}, function(newValue) {
						if (newValue == 0) return;
						unregTbody();
						if ($scope.model.pageSize == 0) {
							// this is endless scrolling
							var tbody = $element.find("tbody");
							var lastRequestedViewPortSize = 0;
							tbody.scroll(function(e) {
								var viewportSize = $scope.model.foundset.viewPort.size;
								if (viewportSize != lastRequestedViewPortSize && $scope.model.foundset.serverSize > viewportSize && (tbody.scrollTop() + tbody.height()) > (tbody[0].scrollHeight - tbody.height())) {
									lastRequestedViewPortSize = viewportSize;
									$scope.model.foundset.loadExtraRecordsAsync(nonePagingPageSize);
								}
							})
						}
					})
				var nonePagingPageSize = 200;
				$scope.$watch('model.foundset.serverSize', function(newValue) {
						if (newValue) {
							if (!$scope.showPagination()) {
								var rowsToLoad = Math.min(newValue, $scope.model.pageSize ? $scope.model.pageSize : nonePagingPageSize)
								if ($scope.model.foundset.viewPort.size < rowsToLoad)
									$scope.model.foundset.loadExtraRecordsAsync(rowsToLoad - $scope.model.foundset.viewPort.size);
							} else {
								if ($scope.model.pageSize * ($scope.model.currentPage - 1) > newValue) {
									$scope.model.currentPage = Math.floor(newValue / $scope.model.pageSize) + 1;
								} else {
									$scope.model.foundset.loadRecordsAsync($scope.model.pageSize * ($scope.model.currentPage - 1), $scope.model.pageSize);
								}
							}
						}
					});
				// watch the columns so that we can relay out the columns when width or size stuff are changed.
				var currentColumnLength = $scope.model.columns ? $scope.model.columns.length : 0;
				Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
						configurable: true,
						value: function(property, value) {
							switch (property) {
								case "columns":
									var valueChanged = currentColumnLength != $scope.model.columns.length;
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
												}, 0);
										}
									}
									break;
							}
						}
					});

				$scope.$watch('model.foundset.viewPort.rows', function(newValue, oldValue) {
						generateTemplate();
					})

				$scope.$watch('model.currentPage', function(newValue) {
						if (newValue && $scope.showPagination()) {
							$scope.model.foundset.loadRecordsAsync($scope.model.pageSize * (newValue - 1), $scope.model.pageSize);
						}
					});

				$scope.$watch('model.pageSize', function(newValue, oldValue) {
						if (oldValue && newValue && $scope.showPagination()) {
							$scope.model.foundset.loadRecordsAsync($scope.model.pageSize * ($scope.model.currentPage - 1), $scope.model.pageSize);
						}
						$scope.model.foundset.setPreferredViewportSize(newValue)
					});

				$scope.$watch('model.foundset.viewPort', function(newValue, oldValue) {
						if ($scope.showPagination()) {
							if ($scope.model.pageSize * ($scope.model.currentPage - 1) != newValue.startIndex) {
								$scope.model.currentPage = Math.floor(newValue.startIndex / $scope.model.pageSize) + 1;
							} else if (newValue.size < $scope.model.pageSize && $scope.model.foundset.serverSize > (newValue.startIndex + newValue.size)) {
								$scope.model.foundset.loadRecordsAsync($scope.model.pageSize * ($scope.model.currentPage - 1), $scope.model.pageSize);
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
				var tbody = null;
				var wrapper = null;
				$scope.$watch('model.visible', function(newValue) {
						if (!newValue) {
							toBottom = false;
							tbody = null;
							wrapper = null;
						}
					})
				var previousSelectedChild = null; // this should be an array for multi select.
				function scrollIntoView() {
					var firstSelected = $scope.model.foundset.selectedRowIndexes[0];
					firstSelected = firstSelected - ($scope.model.pageSize * ($scope.model.currentPage - 1));
					var child = tbody.children().eq(firstSelected)
					if (previousSelectedChild) previousSelectedChild.className = "";
					if (child.length > 0) {
						var wrapperRect = wrapper.getBoundingClientRect();
						var childRect = child[0].getBoundingClientRect();
						child[0].className = $scope.model.selectionClass;
						previousSelectedChild = child[0];
						if (childRect.top < (wrapperRect.top + 10) || childRect.bottom > wrapperRect.bottom) {
							child[0].scrollIntoView(!toBottom);
						}
					}
				}
				$scope.$watch('model.foundset.selectedRowIndexes', function(newValue, oldValue) {
						if ($scope.model.foundset && $scope.model.foundset.selectedRowIndexes.length > 0) {
							if (tbody == null || tbody.length == 0) {
								wrapper = $element.find(".tablewrapper")[0];
								tbody = $element.find("tbody");
							}
							if (tbody.children().length > 1) {
								scrollIntoView();
							} else {
								$timeout(scrollIntoView, 200)
							}

						}
					}, true)

				$scope.getUrl = function(column, row) {
					if (column && row) {
						var index = $scope.model.foundset.viewPort.rows.indexOf(row)
						if (index >= 0 && column.dataprovider && column.dataprovider[index] && column.dataprovider[index].url) {
							return column.dataprovider[index].url;
						}
					}
					return null;
				}

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
					var realRow = row;
					if ($scope.showPagination()) {
						realRow = realRow + $scope.model.pageSize * ($scope.model.currentPage - 1);
					}
					return realRow;
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
									for (var i = 0; i < $scope.model.foundset.selectedRowIndexes.length; i++) {
										if (start == -1 || start > $scope.model.foundset.selectedRowIndexes[i]) {
											start = $scope.model.foundset.selectedRowIndexes[i];
										}
									}
								}
								var stop = realRow;
								if (start > realRow) {
									stop = start;
									start = realRow;
								}
								newSelection = []
								for (var i = start; i <= stop; i++) {
									newSelection.push(i);
								}
							}
							//    				 }

							$scope.model.foundset.requestSelectionUpdate(newSelection);
							if (type == 1 && $scope.handlers.onCellClick) {
								$scope.handlers.onCellClick(realRow + 1, columnIndex, $scope.model.foundset.viewPort.rows[rowIndex]);
							}

							if (type == 2 && $scope.handlers.onCellRightClick) {
								$scope.handlers.onCellRightClick(realRow + 1, columnIndex, $scope.model.foundset.viewPort.rows[rowIndex]);
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
					$scope.headerClicked = function(column) {
						if ($scope.handlers.onHeaderClick) {
							if ($scope.model.enableSort && ($scope.model.sortColumnIndex != column)) {
								$scope.model.sortDirection = null;
							}
							$scope.handlers.onHeaderClick(column, $scope.model.sortDirection).then(function(ret) {
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

				$scope.getRowStyle = function(row) {
					var isSelected = $scope.model.foundset.selectedRowIndexes && $scope.model.foundset.selectedRowIndexes.indexOf($scope.getRealRow(row)) != -1;
					return isSelected ? $scope.model.selectionClass : " ";
				}

				$scope.keyPressed = function(event) {
					var fs = $scope.model.foundset;
					if (fs.selectedRowIndexes && fs.selectedRowIndexes.length > 0) {
						var selection = fs.selectedRowIndexes[0];
						if (event.keyCode == 34 || event.keyCode == 33) {
							var firstSelected = $scope.model.foundset.selectedRowIndexes[0];
							firstSelected = firstSelected - ($scope.model.pageSize * ($scope.model.currentPage - 1));
							var child = tbody.children().eq(firstSelected)
							if (child.length > 0) {
								var childBounds = child[0].getBoundingClientRect();
								var tbodyBounds = tbody[0].getBoundingClientRect();
								if (event.keyCode == 34) {
									if (childBounds.top <= (tbodyBounds.top + childBounds.height - 5)) {
										var newTopChild = null;
										var totalHeight = childBounds.height / 2;
										var numberOfItems = 0;
										var children = tbody.children().slice(firstSelected);
										for (; numberOfItems < children.length; numberOfItems++) {
											var childHeight = children[numberOfItems].getBoundingClientRect().height;
											totalHeight += childHeight;
											if (totalHeight > tbodyBounds.height) {
												newTopChild = children[numberOfItems];
												break;
											}
										}
										if (newTopChild != null) {
											newTopChild.scrollIntoView(true);
											fs.selectedRowIndexes = [firstSelected + numberOfItems];
										}
									} else {
										child[0].scrollIntoView(true);
									}
								} else if (childBounds.bottom <= (tbodyBounds.bottom - childBounds.height + 5)) {
									child[0].scrollIntoView(false);
								} else {
									var newTopChild = null;
									var totalHeight = childBounds.height / 2;
									var numberOfItems = firstSelected;
									var children = tbody.children();
									for (; numberOfItems > 0; numberOfItems--) {
										var childHeight = children[numberOfItems].getBoundingClientRect().height;
										totalHeight += childHeight;
										if (totalHeight > tbodyBounds.height) {
											newTopChild = children[numberOfItems];
											break;
										}
									}
									if (newTopChild != null) {
										newTopChild.scrollIntoView(false);
										fs.selectedRowIndexes = [numberOfItems];
									}
								}
							}
						} else if (event.keyCode == 38) {
							if (selection > 0) {
								fs.selectedRowIndexes = [selection - 1];
								if ( (fs.viewPort.startIndex) <= selection - 1) {
									toBottom = false;
								} else $scope.modifyPage(-1);
							}
							event.preventDefault();
						} else if (event.keyCode == 40) {
							if (selection < fs.serverSize - 1) {
								fs.selectedRowIndexes = [selection + 1];
								if ( (fs.viewPort.startIndex + fs.viewPort.size) > selection + 1) {
									toBottom = true;
								} else $scope.modifyPage(1);
							}
							event.preventDefault();
						} else if (event.keyCode == 13) {
							if ($scope.handlers.onCellClick) {
								$scope.handlers.onCellClick(selection + 1, null, fs.viewPort.rows[selection])
							}
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

				function updateTable(changes) {
					var formatFilter = $filter("formatFilter");
					var columns = $scope.model.columns;
					for (i = 0; i < changes.length; i++) {
						var rowUpdate = changes[i];
						if (rowUpdate.type == 0) { // 0 == CHANGE
							var children = tbody.children();
							for (j = rowUpdate.startIndex; j <= rowUpdate.endIndex; j++) {
								var trChildren = children.eq(j).children()
								for (var c = columns.length; --c > 0;) {
									var column = columns[c];
									var td = trChildren.eq(c);
									var divChild = td.children("div");
									if (divChild.length == 1) {
										// its text node
										var value = column.dataprovider ? column.dataprovider[j] : null;
										value = getDisplayValue(value, column.valuelist);
										value = formatFilter(value, column.format.display, column.format.type);
										divChild.text(value)
									} else {
										var imgChild = td.children("img");
										if (imgChild.length == 1) {

										} else {
											console.log("illegal state should be div or img")
										}
									}
								}
							}
						}
					}
				}

				var columnCSSRules = [];
				function updateTableColumnStyleClass(columnIndex, style) {
					if (!columnCSSRules[columnIndex]) {
						var ss = document.styleSheets;
						var clsName = "data-servoyextra-table[name='" + tableName + "'] .c" + columnIndex;
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
						}
					}

					for (var p in style) {
						columnCSSRules[columnIndex].style[p] = style[p];
					}
				}

				var columnListener = null;
				function generateTemplate() {
					console.log("generate template")
					var tbodyJQ = $element.find("tbody");
					var tblHead = $element.find("thead");
					if (tbodyJQ.length == 0 || $(tblHead).height() <= 0) {
						console.log("generate template timeout")
						if ($element.closest("body").length > 0) $timeout(generateTemplate);
						return;
					}
					var rows = $scope.model.foundset.viewPort.rows;
					var columns = $scope.model.columns;

					if (columnListener == null) {
						for (var c = 0; c < columns.length; c++) {
							if (columns[c].dataprovider) {
								columnListener = function(changes) {
									$scope.$evalAsync(function() {
										updateTable(changes)
									})
								}
								columns[c].dataprovider.addChangeListener(columnListener);
								break;
							}
						}
						// todo check if the column listener is attached to 1 column? (if not then there are no columns wit dataproviders?)
					}
					var formatFilter = $filter("formatFilter");
					var tbodyOld = tbodyJQ[0];
					var tbodyNew = document.createElement("TBODY");
					updateTBodyStyle(tbodyNew);
					for (var r = 0; r < rows.length; r++) {
						var tr = document.createElement("TR");
						tbodyNew.appendChild(tr);
						for (var c = 0; c < columns.length; c++) {
							if (r == 0) {
								updateTableColumnStyleClass(c, getCellStyle(c));
							}
							var column = columns[c];
							var td = document.createElement("TD");
							//  var tdStyle = $scope.getCellStyle(c);
							//  for(var key in tdStyle){
							// 	 td.style[key] = tdStyle[key];
							//  }
							$(td).data('row_column', { row: r, column: c });
							var tdClass = 'c' + c;
							if (column.styleClass) {
								tdClass += ' ' + column.styleClass;
							}
							if (column.styleClassDataprovider && column.styleClassDataprovider[r]) {
								tdClass += ' ' + column.styleClassDataprovider[r];
							}
							if (tdClass) {
								td.className = tdClass;
							}
							tr.appendChild(td);
							if (column.dataprovider && column.dataprovider[r] && column.dataprovider[r].url) {
								var img = document.createElement("IMG");
								img.setAttribute("src", column.dataprovider[r].url);
								td.appendChild(img);
							} else {
								var div = document.createElement("DIV");
								var value = column.dataprovider ? column.dataprovider[r] : null;
								value = getDisplayValue(value, column.valuelist);
								value = formatFilter(value, column.format.display, column.format.type);
								var txt = document.createTextNode(value ? value : "");
								div.appendChild(txt);
								td.appendChild(div);
							}
						}
					}
					tbodyOld.parentNode.replaceChild(tbodyNew, tbodyOld)
					console.log("replaced")
					tbody = $(tbodyNew);
					if (wrapper == null) {
						wrapper = $element.find(".tablewrapper")[0];
					}
					scrollIntoView();
					onTableRendered();

					//    		  <tr ng-repeat="row in model.foundset.viewPort.rows" ng-class='getRowStyle(model.foundset.viewPort.rows.indexOf(row))' on-finish-render-rows="ngRowsRenderRepeatFinished">
					//    		    <td ng-style="getCellStyle(model.columns.indexOf(column))" model-in-data="{row:row,column:column}" ng-class="column.styleClass + ' ' + column.styleClassDataprovider[model.foundset.viewPort.rows.indexOf(row)]" ng-repeat="column in model.columns" >
					//    		    	<img ng-show="getUrl(column,row) != null" ng-src="{{getUrl(column,row)}}"></img>
					//    		    	<div ng-bind='column.dataprovider[model.foundset.viewPort.rows.indexOf(row)]| getDisplayValue:column.valuelist | formatFilter:column.format.display:column.format.type' ng-show="getUrl(column,row) === null"></div>
					//    	        </td>
					//    		  </tr>
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
						var tbl = $element.find("table:first");
						var headers = tbl.find("th");
						for (var column = $scope.model.columns.length; --column;) {
							array += $(headers.get(column)).outerWidth(false);
						}
						return array;
					}, function(newValue, oldValue) {
						cellStyles = [];
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
	}]).filter('getDisplayValue', function() { // filter that takes the realValue as an input and returns the displayValue
		return function(input, valuelist) {
			if (valuelist) {
				for (i = 0; i < valuelist.length; i++) {
					if (input === valuelist[i].realValue) {
						return valuelist[i].displayValue;
					}
				}
			}
			return input;
		};
	}).directive('modelInData', function($parse) {
		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				var model = $parse($attrs.modelInData)($scope);
				$element.data('row_column', model);
			}
		}
	}).directive('onFinishRenderRows', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if (scope.$last === true) {
					$timeout(function() {
						scope.$emit(attr.onFinishRenderRows);
					});
				}
			}
		}
	});


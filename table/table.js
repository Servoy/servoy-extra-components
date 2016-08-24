angular.module('servoyextraTable',['servoy']).directive('servoyextraTable', ["$timeout","$sabloConstants", function($timeout, $sabloConstants) {  
    return {
      restrict: 'E',
      scope: {
       	model: "=svyModel",
       	handlers: "=svyHandlers"
      },
      link: function($scope, $element, $attrs) {

    	  function getNumberFromPxString(s) {
    		  var numberFromPxString = -1;
			  if(s) {
				  s = s.trim().toLowerCase();
				  if(s.indexOf("px") == s.length - 2) {
					  var wNumber = parseInt(s.substring(0, s.length - 2));
					  if(!isNaN(wNumber)) {
						  numberFromPxString = wNumber;
					  }
				  }
			  }
			  return numberFromPxString;
    	  }    	  
    	  
    	  function calculateTableWidth() {
    		  var tableWidth = 0;
    		  for(var i = 0; i < $scope.model.columns.length; i++) {
    			  var w = getNumberFromPxString($scope.model.columns[i].width);
    			  if(w > -1) {
    				  tableWidth += w;
    			  }
    		  }
    		  return tableWidth;
    	  }    	  
    	  
    	  function getAutoColumns() {
    		  var autoColumns = {columns: {}, count : 0};
    		  for(var i = 0; i < $scope.model.columns.length; i++) {
    			  var w = getNumberFromPxString($scope.model.columns[i].width);
    			  if(w < 0) {
    				  autoColumns.columns[i] = true;
    				  autoColumns.count += 1;
    			  }
    		  }

    		  return autoColumns;    		  
    	  }
    	  
    	  var tableWidth = calculateTableWidth();
    	  var autoColumns = getAutoColumns();
    	  $scope.componentWidth = $element.parent().outerWidth(false);
    	  
    	  var tableLeftOffset = 0;
    	  var onTBodyScrollListener = null;
    	  var resizeTimeout = null;
    	  
    	  function onColumnResize() {

			  var table = $element.find("table:first");
			  var headers = table.find("th");
    	                	
			  for(var i = 0; i < headers.length; i++) {
				  var header = $(headers.get(i));
				  $scope.model.columns[i].width = header[0].style.maxWidth = header[0].style.minWidth = header[0].style.width;
			  }
			  
			  var resizer = $element.find(".JCLRgrips");
			  var resizerLeft = getNumberFromPxString($(resizer).css("left"));

			  var colGrips = $element.find(".JCLRgrip");
			  var leftOffset = 1;
			  for(var i = 0; i < colGrips.length; i++) {
				  leftOffset += getNumberFromPxString($scope.model.columns[i].width);
				  $(colGrips.get(i)).css("left", leftOffset - resizerLeft + "px");
			  }
    	  }
    	  

    	  $(window).on('resize', function() {
    		  if(resizeTimeout) $timeout.cancel(resizeTimeout);
    		  resizeTimeout = $timeout(function() {
				  $scope.$apply(function(){
					  var newComponentWidth = $element.parent().outerWidth(false);
					  var deltaWidth = newComponentWidth - $scope.componentWidth;
	        		  $scope.componentWidth = newComponentWidth;

	    			  for(var i = $scope.model.columns.length - 1; i > -1; i--) {
	    				  if(autoColumns.columns[i]) {
	    					  var cw = getNumberFromPxString($scope.model.columns[i].width);
	    					  if(cw > -1) {
		    					  if(cw + deltaWidth > 5) {
		    						  $scope.model.columns[i].width = (cw + deltaWidth) + "px";
		    						  break;
		    					  }
		    					  else {
		    						  $scope.model.columns[i].width = 5 + "px";
		    						  deltaWidth -= (cw - 5);
		    					  }
	    					  }
	    				  }
	    			  }
	        		  if($scope.model.enableColumnResize) {
//	        			tableWidth = calculateTableWidth();
    			  		$timeout(function() {
    			  			addColResizable(true);
    			  		}, 0);
	        		  }
				  })   
    		  }, 50);
    	  });

    	  function addColResizable(cleanPrevious) {
    		  var tbl = $element.find("table:first");
    		  if(cleanPrevious) {
        		  tbl.colResizable({
        			  disable:true
        		  });  
    		  }
    		  tbl.colResizable({
    			  liveDrag:false,
    			  resizeMode:"fit",
    			  onResize:function(e) {
    				  $scope.$apply(function(){    	                	
    					  onColumnResize();
    				  })
    			  }
    		  	});
    	  }

    	  
    	  $scope.$on('ngRowsRenderRepeatFinished', function(ngRepeatFinishedEvent) {
    		  if(!onTBodyScrollListener) {
    			  var tbl = $element.find("table:first");
    			  var tblBody = tbl.find("tbody");
    			  onTBodyScrollListener = function() {
    				  $timeout(function(){
    					  tableLeftOffset = -$(tblBody).scrollLeft();
        				  var resizer = $element.find(".JCLRgrips");
        				  if(resizer.get().length > 0) {
        					  $(resizer).css("left", tableLeftOffset + "px");
        				  }
    				  });
    			  }    			  
    			  $(tblBody).bind("scroll", onTBodyScrollListener);
    		  }
    		  if($scope.model.enableColumnResize) {
	    		  addColResizable(true);
	        	  Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
	        		  configurable : true,
	        		  value : function(property, value) {
	        			  switch (property) {
	        			  	case "columns":
	        			  		var cols = $scope.model.columns;
	        			  		tableWidth = calculateTableWidth();
	        			  		$timeout(function() {
	        			  			addColResizable(true);
	        			  		}, 0);
	        			  		break;
	        			  }
	        		  }
	        	  });
    		  }
    	  });

    	  $scope.$watch('model.foundset.serverSize', function (newValue) {
    		  if (newValue)
    		  {
    			  if (!$scope.showPagination())
    			  {
    				  $scope.model.foundset.loadRecordsAsync(0, newValue);
    			  }
    			  else
    			  {
    				  if ($scope.model.pageSize * ($scope.model.currentPage -1) > newValue)
    				  {
    					  $scope.model.currentPage =  Math.floor(newValue / $scope.model.pageSize) + 1;
    				  }
    				  else
    				  {
    					  $scope.model.foundset.loadRecordsAsync($scope.model.pageSize * ($scope.model.currentPage -1), $scope.model.pageSize);
    				  }
    			  }	  
    		  }	  
          });
    	  
    	  $scope.$watch('model.currentPage', function (newValue) {
    		  if (newValue &&  $scope.showPagination())
    		  {
    			  $scope.model.foundset.loadRecordsAsync($scope.model.pageSize * (newValue -1), $scope.model.pageSize);
    		  }	  
          });
    	  
    	  $scope.$watch('model.pageSize', function (newValue,oldValue) {
    		  if (oldValue && newValue &&  $scope.showPagination())
    		  {
    			  $scope.model.foundset.loadRecordsAsync($scope.model.pageSize * ($scope.model.currentPage -1), $scope.model.pageSize);
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
    	  function scrollIntoView() {
    		  var firstSelected = $scope.model.foundset.selectedRowIndexes[0];
    		  firstSelected = firstSelected - ($scope.model.pageSize * ($scope.model.currentPage -1));
    		  var child = null;
    		  if (firstSelected == 0) {
    			  child= $element.find("thead");
    		  } 
    		  else child = tbody.children().eq(firstSelected)
			  if (child.length > 0) {
				  var wrapperRect = wrapper.getBoundingClientRect();
				  var childRect =child[0].getBoundingClientRect();
				  if (childRect.top < wrapperRect.top || childRect.bottom > wrapperRect.bottom) {
					  child[0].scrollIntoView(!toBottom);
				  }
			  }
    	  }
    	  $scope.$watch('model.foundset.selectedRowIndexes', function (newValue,oldValue) {
    		  if ( $scope.model.foundset.selectedRowIndexes.length > 0) {
    			  if (tbody == null || tbody.length == 0) {
    				  wrapper = $element.find(".tablewrapper")[0];
    				  tbody= $element.find("tbody");
    			  }
    			  if(tbody.children().length > 1) {
    				  scrollIntoView();
    			  }
    			  else {
    				  $timeout(scrollIntoView, 200)
    			  }
    			 
    		  }
    	  },true)
    	  
    	  $scope.getUrl = function(column,row) {
    		 if (column && row)
    		 {
    			 var index = $scope.model.foundset.viewPort.rows.indexOf(row)
    			if (index >= 0 && column.dataprovider && column.dataprovider[index] && column.dataprovider[index].url)
    			{
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
    		if (newPage >= 1 && newPage <= pages)
    		{
    			$scope.model.currentPage = newPage;
    		}	
    	  }
    	  
    	  $scope.getRealRow = function(row) {
    		  var realRow = row;
    		  if ($scope.showPagination())
    		  {
    			  realRow = realRow + $scope.model.pageSize * ($scope.model.currentPage -1);
    		  }	
    		  return realRow;
    	  }
    	  
    	  $scope.tableClicked = function(event, type) {
    		 var elements = document.querySelectorAll(':hover');
    		 for(var i=elements.length;--i>0;) {
    			 var row_column = $(elements[i]).data("row_column");
    			 if (row_column) {
    				 var rowIndex = $scope.model.foundset.viewPort.rows.indexOf(row_column.row); 
    				 var columnIndex = $scope.model.columns.indexOf(row_column.column);
    				 var realRow = $scope.getRealRow(rowIndex);
    				 $scope.model.foundset.requestSelectionUpdate([realRow]);
    				 if (type == 1 && $scope.handlers.onCellClick) {
    					$scope.handlers.onCellClick(realRow + 1, columnIndex, $scope.model.foundset.viewPort.rows[rowIndex]);
    		    	 }
    		    	  
    		    	 if ( type == 2 && $scope.handlers.onCellRightClick) {
    					$scope.handlers.onCellRightClick(realRow + 1, columnIndex, $scope.model.foundset.viewPort.rows[rowIndex]);
    		    	 }
    			 }
    		 }
    	  }
    	  if ($scope.handlers.onCellRightClick) {
    		  $scope.tableRightClick = function(event) {
    			  $scope.tableClicked(event,2);
    		  }
    	  }
    	  
    	  if ($scope.handlers.onHeaderClick) {
    		  $scope.headerClicked = function(column) {
    			  $scope.handlers.onHeaderClick(column);
    		  }
    	  }
    	  

    	  $scope.getRowStyle = function(row) {
    		  var isSelected = $scope.model.foundset.selectedRowIndexes && $scope.model.foundset.selectedRowIndexes.indexOf($scope.getRealRow(row)) != -1; 
    		  return  isSelected ? $scope.model.selectionClass : " ";
    	  }
    	  
    	  $scope.keyPressed = function(event) {
    		  var fs = $scope.model.foundset;
    		  if (fs.selectedRowIndexes && fs.selectedRowIndexes.length > 0) {
    			  var selection = fs.selectedRowIndexes[0];
	    		  if (event.keyCode == 38) {
	    			  if (selection > 0) {
	    				  fs.selectedRowIndexes = [selection-1];
	    				  if ( (fs.viewPort.startIndex) <=  selection-1){
	    					  toBottom = false;
	    				  }
	    				  else $scope.modifyPage(-1);
	    			  }
	    			  event.preventDefault();
	    		  }
	    		  else if (event.keyCode == 40) {
	    			  if (selection < fs.serverSize-1) {
	    				  fs.selectedRowIndexes = [selection+1];
	    				  if ( (fs.viewPort.startIndex + fs.viewPort.size) >  selection+1){
	    					  toBottom = true;
	    				  }
	    				  else $scope.modifyPage(1);
	    			  }
	    			  event.preventDefault();
	    		  } 
	    		  else if (event.keyCode == 13) {
	    			 if ($scope.handlers.onCellClick) {
	    				 $scope.handlers.onCellClick(selection+1, null,fs.viewPort.rows[selection])
	    			 }
	    		  }
    		  }
    	  }
    	  
    	  $scope.getTableStyle = function () {
    		  var tableStyle = {};
    	      tableStyle.width = autoColumns.count > 0 ? $scope.componentWidth + "px" : tableWidth + "px";
    		  return tableStyle;
    	  }
  
    	  
    	  $scope.getTHeadStyle = function() {
    		  var tHeadStyle = {};
   			  tHeadStyle.width = autoColumns.count > 0 ? $scope.componentWidth + "px" : tableWidth + "px";
    		  tHeadStyle.left = tableLeftOffset + "px";
    		  return tHeadStyle;
    	  }
    	  
    	  $scope.getTBodyStyle = function() {
    		  var tBodyStyle = {};
    		  tBodyStyle.width = $scope.componentWidth + "px";
    		  var tbl = $element.find("table:first");
			  var tblHead = tbl.find("thead");
			  if($(tblHead).is(":visible")) {
				  tBodyStyle.top = $(tblHead).height() + "px";
			  }
    		  if($scope.showPagination()) {
    			  var pagination = $element.find("ul:first");
    			  if(pagination.get().length > 0) {
    				  tBodyStyle.marginBottom = ($(pagination).height() + 2) + "px";
    			  }
    		  }			  
			  return tBodyStyle;
    	  }
    	  
    	  $scope.getColumnStyle = function (column) {
        	  var columnStyle = {overflow: "hidden"};
			  var w = getNumberFromPxString($scope.model.columns[column].width);
			  if(w > -1) {
				  columnStyle.minWidth = columnStyle.maxWidth = columnStyle.width = $scope.model.columns[column].width;
			  }
			  else if($scope.model.columns[column].width) {
				  columnStyle.width = $scope.model.columns[column].width;
			  }
			  else {
				  columnStyle.minWidth = columnStyle.maxWidth = columnStyle.width = (($scope.componentWidth - tableWidth - 18) / autoColumns.count) + "px";
			  }
        	  return columnStyle;
    	  }

    	  $scope.getCellStyle = function (row, column) {
        	  var cellStyle = {overflow: "hidden"};
        	  if(row == 0 && column < $scope.model.columns.length) {
        		  var w = getNumberFromPxString($scope.model.columns[column].width);
        		  if (w < 0) {
            		  var tbl = $element.find("table:first");
    				  var headers = tbl.find("th");
    				  if($(headers).is(":visible")) {
    					  w = $(headers.get(column)).outerWidth(false);
    				  }
        		  }
        		  if(w > -1) {
        			  cellStyle.minWidth = w + "px";
        			  cellStyle.width = w + "px";
        			  cellStyle.maxWidth = w + "px";
        		  }
        		  else if ($scope.model.columns[column].width) {
        			  cellStyle.width = $scope.model.columns[column].width;
        		  }
        	  }
        	  return cellStyle;
    	  }
      },
      templateUrl: 'servoyextra/table/table.html'
    };
  }])
  .filter('getDisplayValue', function () { // filter that takes the realValue as an input and returns the displayValue
	return function (input, valuelist) {
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
}).directive('onFinishRenderRows', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRenderRows);
                });
            }
        }
    }
});

  
  

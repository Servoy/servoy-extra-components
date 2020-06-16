angular.module('servoyextraSplitpane').directive('bgSplitter', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        orientation: '@',
        onDividerChange: '&'
      },      
      template: '<div class="split-panes {{orientation}}" ng-transclude></div>',
      controller: function ($scope) {
        $scope.panes = [];
        
        this.addPane = function(pane){
          if ($scope.panes.length > 1) 
            throw 'splitters can only have two panes';
          $scope.panes.push(pane);
          return $scope.panes.length;
        };
      },
      link: function(scope, element, attrs) {
        var handler = angular.element('<div class="split-handler"></div>');
        var pane1 = scope.panes[0];
        var pane2 = scope.panes[1];
        var vertical = scope.orientation == 'vertical';
        if (pane1.minSize == undefined) pane1.minSize = 0;
        if (pane2.minSize == undefined) pane2.minSize = 0;
        var drag = false;
        
        pane1.elem.after(handler);
        
        element.bind('mousemove', function (ev) {
          if (!drag) return;
          
          var bounds = element[0].getBoundingClientRect();
          var pos = 0;
          
          if (vertical) {

            var height = bounds.bottom - bounds.top;
            pos = ev.clientY - bounds.top;

            if (pos < pane1.minSize) return;
            if (height - pos < pane2.minSize) return;

            handler.css('top', pos + 'px');
            pane1.elem.css('height', pos + 'px');
            pane2.elem.css('top', (pos+handler[0].clientHeight) + 'px');
      
          } else {

            var width = bounds.right - bounds.left;
            pos = ev.clientX - bounds.left;

            if (pos < pane1.minSize) return;
            if (width - pos < pane2.minSize) return;

            handler.css('left', pos + 'px');
            pane1.elem.css('width', pos + 'px');
            pane2.elem.css('left', (pos+handler[0].clientWidth) + 'px');
          }
        });
    
        handler.bind('mousedown', function (ev) { 
          ev.preventDefault();
          drag = true; 
        });

        angular.element(document).bind('mouseup', function (ev) {
          if(drag) {
        	  scope.onDividerChange();
          }
          drag = false;
        });
      }
    };
  })
  .directive('bgPane', function () {
    return {
      restrict: 'E',
      require: '^bgSplitter',
      replace: true,
      transclude: true,
      scope: {
        minSize: '='
      },
      template: '<div class="split-pane{{index}}" ng-transclude></div>',
      link: function(scope, element, attrs, bgSplitterCtrl) {
        scope.elem = element;
        scope.index = bgSplitterCtrl.addPane(scope);
      }
    };
  });

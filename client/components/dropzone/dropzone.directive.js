'use strict';

angular.module('pokertrainerwebApp')
.directive('dropzone', function($parse, $document) {
  return {
    templateUrl: 'components/dropzone/dropzone.html',
    restrict: 'E',
    //controller: 'DropzoneController',
    //controllerAs: 'vm',
    link: function ($scope, element, attrs) {
      var dropZone = element.children( ":first-child" );
      $document.bind('drop dragover', function (e) {
        e.preventDefault();
      });

      $document.bind('dragover', function (e) {
        var timeout = window.dropZoneTimeout;
        if (!timeout) {
          dropZone.addClass('in');
        } else {
          clearTimeout(timeout);
        }
        var found = false,
        node = e.target;
        do {
          if (node === dropZone[0]) {
            found = true;
            break;
          }
          node = node.parentNode;
        } while (node != null);
        if (found) {
          dropZone.addClass('hover');
        } else {
          dropZone.removeClass('hover');
        }
        window.dropZoneTimeout = setTimeout(function () {
          window.dropZoneTimeout = null;
          dropZone.removeClass('in hover');
        }, 100);
      });

      // Get the function provided in the file-change attribute.
      // Note the attribute has become an angular expression,
      // which is what we are parsing. The provided handler is
      // wrapped up in an outer function (attrHandler) - we'll
      // call the provided event handler inside the handler()
      // function below.
      var attrHandler = $parse(attrs['dropped']);

      // This is a wrapper handler which will be attached to the
      // HTML change event.
      var handler = function (e) {

        var file = e.dataTransfer.files[0];
        //console.log('File you dragged here is', file.path);

        $scope.$apply(function () {
          // Execute the provided handler in the directive's scope.
          // The files variable will be available for consumption
          // by the event handler.
          attrHandler($scope, { $event: e, files: file });
        });
      };

      dropZone.on('dragover dragleave dragend', function(){
        return false;
      });

      dropZone.on('drop', function(e){
        handler(e);
        return false;
      });

    }
  };
});

angular
.module('yourModule', [])
.directive('fileChange', function($parse, $document) {

  return {
    //require: 'ngModel',
    restrict: 'A',
    link: function ($scope, element, attrs) {

        $document.bind('drop dragover', function (e) {
            e.preventDefault();
        });

        $document.bind('dragover', function (e) {
            var dropZone = element,
                timeout = window.dropZoneTimeout;
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
        var attrHandler = $parse(attrs['fileChange']);

        // This is a wrapper handler which will be attached to the
        // HTML change event.
        var handler = function (e) {

          $scope.$apply(function () {

            // Execute the provided handler in the directive's scope.
            // The files variable will be available for consumption
            // by the event handler.
            attrHandler($scope, { $event: e, files: e.target.files });
          });
        };

        // Attach the handler to the HTML change event 
        //element[0].addEventListener('change', handler, false);



        element[0].ondragover = function () {
          return false;
        };
        element[0].ondragleave = element[0].ondragend = function () {
          return false;
        };
        element[0].ondrop = function (e) {
          e.preventDefault();
          var file = e.dataTransfer.files[0];
          //console.log('File you dragged here is', file.path);


          $scope.$apply(function () {

            // Execute the provided handler in the directive's scope.
            // The files variable will be available for consumption
            // by the event handler.
            attrHandler($scope, { $event: e, files: file });
          });



          return false;
        };


      }
    };
  });
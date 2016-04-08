angular.module('RemovableList', [])

.directive('svRemovableList', function() {
    return {
        restrict: 'E', 
        transclude: true, 
        scope: {
            series: '=',
            remove: '='
        },
        templateUrl: 'app/displays/removablelist'
    }
});
 
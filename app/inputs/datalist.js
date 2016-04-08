angular.module('DatalistInput', [])

.directive('svDatalistInput', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            name: '@', 
            model: '=',
            options: '='
        },
        templateUrl: 'app/inputs/datalist'
    }
}); 
 
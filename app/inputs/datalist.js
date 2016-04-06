angular.module('DatalistInput', [])

.directive('ghvDatalistInput', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            name: '@',
            model: '=',
            options: '='
        },
        templateUrl: 'directives/datalist'
    }
});
 
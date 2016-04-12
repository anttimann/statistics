const common = require('./common');

angular.module('app.removablelist', [])

.directive('svRemovableList', function() {
    return {
        restrict: 'E', 
        transclude: true, 
        scope: {
            series: '=',
            remove: '='
        },
        templateUrl: 'app/displays/removablelist',
        link: (scope) => {
            scope.colors = common.colors;
        }
    }
});
 
angular.module('SelectInput', [])

.directive('svSelectInput', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            name: '@', 
            model: '=',
            options: '=',
            change: '='
        },
        templateUrl: 'app/inputs/select',
        link: (scope) => {
            scope.id = scope.name.replace(' ', '');
        } 
    } 
});
 
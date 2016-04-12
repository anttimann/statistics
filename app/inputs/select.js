angular.module('app.selectinput', [])

.directive('svSelectInput', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            name: '@', 
            model: '=',
            options: '='
        },
        templateUrl: 'app/inputs/select',
        link: (scope) => {
            scope.id = scope.name.replace(' ', ''); 
        } 
    } 
});
 
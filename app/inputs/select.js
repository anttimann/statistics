angular.module('app.selectinput', [])

.directive('svSelectInput', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            name: '@', 
            model: '=',
            selects: '=',
            change: '=' 
        },   
        templateUrl: 'app/inputs/select',
        link: (scope) => {
            scope.id = scope.name.replace(' ', ''); 
        } 
    } 
});
 
angular.module('app.datatable', [])

.directive('ghvDatatable', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            data: '=',
            filter: '=',
            titles: '='
        },
        templateUrl: 'app/displays/datatable',
        link: function (scope) {
            scope.sort = {
                type: 'commits',
                reverse: true
            };
        }
    }
});
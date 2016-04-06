angular.module('Datatable', [])

.directive('ghvDatatable', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            data: '=',
            filter: '=',
            titles: '='
        },
        templateUrl: 'partials/datatable',
        link: function (scope) {
            scope.sort = {
                type: 'commits',
                reverse: true
            };
        }
    }
});
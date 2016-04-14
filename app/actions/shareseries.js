require('angular-ui-bootstrap');

angular.module('app.shareseries', ['ui.bootstrap'])

.factory('SeriesAPI', ['$resource', function($resource) {
    return $resource('/series');
}])

.directive('svShareSeries', ['$q', '$uibModal', 'SeriesAPI', ($q, $uibModal, SeriesAPI) => {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            text: '@',
            seriesQuery: '='
        },
        templateUrl: 'app/actions/shareseries', 
        link: (scope) => { 
            scope.open = () => {
                $uibModal.open({
                    templateUrl: 'app/actions/shareseriesmodal',
                    controller: 'ShareSeriesCtrl',
                    resolve: {
                        seriesId: function () {
                            let deferred = $q.defer();
                            SeriesAPI.save(
                                {data: scope.seriesQuery()},
                                (response, headerFunc) => {
                                    deferred.resolve(headerFunc().location); 
                                }); 
                            return deferred.promise;
                        }
                    }
                });  
            }
        } 
    }   
}])
    
.controller('ShareSeriesCtrl', ['$scope', '$uibModalInstance', '$location', 'seriesId',
    ($scope, $uibModalInstance, $location, seriesId) => {  
     $scope.url = $location.absUrl().replace(/\#.*/, '') + '#/kayrat/' + seriesId; 
    
    $scope.close = function () {
        $uibModalInstance.close();  
    };
}]);
 
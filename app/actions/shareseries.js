require('angular-ui-bootstrap');
require('../services/storeseries');

angular.module('app.shareseries', ['ui.bootstrap', 'app.storeseries'])
    
.directive('svShareSeries', ['$uibModal', 'storeSeries', ($uibModal, storeSeries) => {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            text: '@',
            seriesQuery: '='
        },
        templateUrl: 'app/actions/shareseries.html',
        link: (scope) => { 
            scope.open = () => {
                $uibModal.open({
                    templateUrl: 'app/actions/shareseriesmodal.html',
                    controller: 'ShareSeriesCtrl',
                    resolve: {
                        seriesId: function () {
                            return storeSeries.store(scope.seriesQuery());
                        }
                    }
                });  
            }
        } 
    }   
}])
    
.controller('ShareSeriesCtrl', ['$scope', '$uibModalInstance', '$location', 'seriesId',
    function($scope, $uibModalInstance, $location, seriesId) {  
     $scope.url = $location.absUrl().replace(/\#.*/, '') + '#/kayrat/' + seriesId; 
    
    $scope.close = function () {
        $uibModalInstance.close();  
    };
}]);
 
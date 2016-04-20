angular.module('app.storeseries', [])

.factory('SeriesAPI', ['$resource', function($resource) {
    return $resource('/series/:seriesId');
}])
    
.factory('storeSeries', ['$q', 'SeriesAPI', ($q, SeriesAPI) => {
    return {
        store: (data) => {
            let deferred = $q.defer();
            SeriesAPI.save(
                {data: data},
                (response, headerFunc) => {
                    deferred.resolve(headerFunc().location);
                });
            return deferred.promise;
        },  
        get: (seriesId) => {
            let deferred = $q.defer();
            SeriesAPI.get({seriesId: seriesId}).$promise.then((response) => {
                deferred.resolve(response.data);
            }); 
            return deferred.promise; 
        } 
    };
}]);

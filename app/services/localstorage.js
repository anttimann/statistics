'use strict';

require('angular-local-storage');

angular.module('app.localstorage', ['LocalStorageModule'])

.config(['localStorageServiceProvider', (localStorageServiceProvider) => {
    localStorageServiceProvider.setPrefix('sv');
}])
    
.factory('localStorage', ['localStorageService', (localStorageService) => {
    return {
        save: (data) => {
            localStorageService.set('seriesData', data);
        },
        add: (data) => {
            let storedData = getStoredData();
            localStorageService.set('seriesData', storedData.concat([data]));
        },
        get: () => {
            return getStoredData();
        }
    };

    function getStoredData() {
        let seriesData = localStorageService.get('seriesData');
        if (!seriesData || !Array.isArray(seriesData)) {
            return [];
        }
        return seriesData;
    }
}]);

require('./../services/localstorage');

const _ = require('lodash');

const helper = require('./stathelper');

angular.module('app.pxnet', ['ngResource', 'app.localstorage'])
 
.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight) 
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]) 
    
.factory('pxNetAPI', function($resource) { 
    return function(path) {
        return $resource('http://pxnet2.stat.fi/PXWeb/api/v1/fi/' + path);
    }; 
})

.factory('pxNetService', ['$q', 'pxNetAPI', 'localStorage', function($q, pxNetAPI, localStorage) {
    return {
        getData: getSources,
        getSeriesData: getSeriesDataWithQuery
    };

    function getSources() {
        let deferred = $q.defer();
        pxNetAPI('').query({}).$promise.then((values) => {
            let sources = _.map(values, (e) => {
                let value = {
                    path: e.dbid,
                    id: e.dbid,
                    text: e.text.replace(/_/g, ' ').replace('StatFin', 'Tilastokeskus'),
                    children: []
                };

                let cache = {};
                value.getChildren = () => {
                    return addSubjects(value, value.id, cache); 
                };
                return value;
            });
            deferred.resolve(sources);
        });
        return deferred.promise;
    }

    function addSubjects(parent, subjectPath, cache) {
        if (cache.children && cache.children.length) return $q.when(cache.children);
        let deferred = $q.defer();

        pxNetAPI(subjectPath).query({}).$promise.then((values) => {
            cache.children = _.map(values, (e) => {
                let value = {
                    path: subjectPath + '/' + e.id,
                    id: e.id,
                    text: e.text,
                    children: [],
                    leaf: e.id.endsWith('.px') ? true: false
                };

                let cache = {};
                value.getChildren = () => {
                    let adder = e.id.endsWith('.px') ? addTable: addSubjects;
                    return adder(value, value.path, cache);
                };

                return value; 
            });
            deferred.resolve(cache.children);
            });
        return deferred.promise;
    }
    
    function addTable(parent, subjectPath, cache) {        
        if (cache.path == subjectPath) return $q.when(cache);
        cache.path = subjectPath; 

        let deferred = $q.defer();
        
        pxNetAPI(subjectPath)
            .get({}, (values) => {
                cache.title = parent.text;
                cache.options = _.map(values.variables, (e) => {
                    let value = {
                        title: e.text,
                        code: e.code,
                        options: _.zipWith(e.values, e.valueTexts, (id, text) => {
                            return {
                                id: id,
                                text: text
                            };
                        }),
                        time: e.time || helper.isYearData(e)
                    };

                    value.chosen = value.options[0].id;
                    return value;
                });

                cache.getSeriesData = () => { 
                    return getSeriesData(cache.options, parent, subjectPath);
                };
                deferred.resolve(cache);
            });
        return deferred.promise;
    }

    function getSeriesData(tableValues, parentSubject, subjectPath) {
        let title = helper.createSeriesName([parentSubject].concat(tableValues));
        let query = helper.createDataQueryValues(tableValues);

        localStorage.add({source: 'pxnet', title: title, query: query, path: subjectPath});
        return getSeriesDataWithQuery(subjectPath, query, title);
    }
    
    function getSeriesDataWithQuery(path, query, title) {
        let deferred = $q.defer();
        pxNetAPI(path)
            .save({
                query: query,
                response: {format: 'json'}
            }, (values) => {
                let entry = helper.createSeries(values, title);
                entry.path = path;

                deferred.resolve(entry);
            });
        return deferred.promise;
    }
}]);
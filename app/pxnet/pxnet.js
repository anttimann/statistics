require('./../services/localstorage');

const _ = require('lodash');

const common = require('../common/common');

angular.module('app.pxnet', ['ngResource', 'app.localstorage'])
    
.factory('pxNetAPI', ['$resource', function($resource) { 
    return function(path) {
        return $resource('/data/pxnet/' + path);
    }; 
}])

.factory('pxNetService', ['$q', 'pxNetAPI', 'localStorage', function($q, pxNetAPI, localStorage) {
    return {
        getData: getSources,  
        getSeriesData: getSeriesDataWithQuery
    };

    function getSources() {
        let deferred = $q.defer();  
        pxNetAPI('sources').query({}).$promise.then((values) => {
            let sources = _.map(values, (e) => {
                let cache = {};
                 
                e.path = e.id; 
                e.getChildren = () => addSubjects(e, e.id, cache);
                return e;
            });  
            deferred.resolve(sources);
        });
        return deferred.promise;
    }

    function addSubjects(parent, subjectPath, cache) {
        if (cache.children && cache.children.length) return $q.when(cache.children);
        let deferred = $q.defer();

        pxNetAPI('subjects').query({id: subjectPath}).$promise.then((values) => {
            cache.children = _.map(values, (e) => {
                let cache = {};

                e.path = subjectPath + '/' + e.id;
                e.leaf = e.id.endsWith('.px') ? true: false;
                
                e.getChildren = () => {
                    let adder = e.leaf ? addTable: addSubjects;
                    return adder(e, e.path, cache);  
                };
                return e; 
            });
            deferred.resolve(cache.children);
            });
        return deferred.promise;
    }
    
    function addTable(parent, subjectPath, cache) {        
        if (cache.path == subjectPath) return $q.when(cache);
        cache.path = subjectPath; 

        let deferred = $q.defer();
        
        pxNetAPI('options')
            .query({id: subjectPath}, (values) => {
                cache.title = parent.text;
                cache.options = _.map(values, (e) => {
                    e.chosen = e.options[0].id;
                    return e; 
                });

                cache.getSeriesData = () => { 
                    return getSeriesData(cache.options, parent, subjectPath);
                };
                deferred.resolve(cache);
            });
        return deferred.promise; 
    }

    function getSeriesData(tableValues, parentSubject, subjectPath) {
        let title = common.createSeriesName([parentSubject].concat(tableValues));
        let query = createDataQueryValues(tableValues);

        localStorage.add({source: 'pxnet', title: title, query: query, path: subjectPath});
        return getSeriesDataWithQuery(subjectPath, query, title);
    }
    
    function createDataQueryValues(values) {
        return _.map(values, (v) => {
            if (v.time) {  
                return v.code + '=' + _.map(v.options, 'id').join(',');
            }
            return v.code + '=' + v.chosen;
        });
    }
    
    function getSeriesDataWithQuery(path, query, title) {
        let deferred = $q.defer(); 
        pxNetAPI('series')
            .get({ id: path, values: query }, (series) => {
                series.path = path; 
                series.title = title;
                deferred.resolve(series); 
            }, (err) => { 
                deferred.resolve(null);
            });
        return deferred.promise;
    }
}]);
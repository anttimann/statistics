'use strict';

const _ = require('lodash');

const common = require('../common/common');

function customsService($q, customsAPI, localStorage) {
    return {
        getData: getSources,
        getSeriesData: getSeriesDataWithQuery
    };

    function getSources() {  
        let value = {
            path: 'tulli',
            id: 'tulli',
            text: 'Tulli'
        }; 
    
        let cache = {};
        value.getChildren = () => {
            return addSubjects(value, value.id, cache);
        };
        return $q.when([value]);   
    }

    function addSubjects(parent, subjectPath, cache) {
        if (cache.children && cache.children.length) return $q.when(cache.children);
        let deferred = $q.defer();

        customsAPI('subjects').query({}).$promise.then(function (values) {
            cache.children = _.map(values, (e) => {
                let cache = {};
                
                e.path = e.id;
                e.leaf = true;
                e.getChildren = () => addTable(e, e.path, cache);
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

        customsAPI('options')
            .query({id: parent.id}, (values) => {
                cache.title = parent.text;  
                 
                cache.options = _.map(values, (e) => {
                    let entry = {
                        title: e.options.length > 1 ? 'Arvo' : e.options[e.options.length - 1][0].id.split('=')[0], 
                        code: e.code,
                        time: e.time,
                        selects: _.map(e.options, (o) => {
                            return {
                                options: o,
                                chosen: o[0].id
                            };
                        }) 
                    };  

                    entry.updateSelects = (index) => {
                        if (dataUpdateNeeded(entry, index)) {
                            getTableDataWithDims(parent.id, entry.selects[0].chosen)
                                .then((values) => {
                                    entry.selects[1] = {
                                        options: values[0].options[0],
                                        chosen: values[0].options[0][0].id 
                                    };  
                                });
                        } 
                    };

                    function dataUpdateNeeded(entry, index) {
                        return entry.selects.length > 1 && index < entry.selects.length - 1;
                    }
                    
                    return entry;
                });
                cache.getSeriesData = () => getSeriesData(cache.options, parent, subjectPath);
                deferred.resolve(cache);
            });
        return deferred.promise;  
    }
    
    function getTableDataWithDims(id, dims) { 
        return customsAPI('options') 
            .query({id: id, optionClass: dims}).$promise;
    }
    
    function getSeriesData(tableValues, parentSubject, subjectPath) {
        let title = common.createSeriesName([parentSubject].concat(tableValues));
        let query = {
            id: parentSubject.id,   
            values: _.map(tableValues, (e) => e.selects[e.selects.length - 1].chosen)
        };

        localStorage.add({source: 'customs', title: title, query: query, path: subjectPath});
        return getSeriesDataWithQuery(subjectPath, query, title);
    }
  
    function getSeriesDataWithQuery(path, query, title) {
        let deferred = $q.defer();
        query.latest = 300;
        customsAPI('series')     
            .get(query, (values) => {
                let entry = values;
                entry.path = path; 
                entry.title = title;
  
                deferred.resolve(entry);  
            }, (err) => {
                deferred.resolve(null);
            });
        return deferred.promise;
    }
}

module.exports = customsService;
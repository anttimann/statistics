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
                let value = {
                    path: e.ifile,
                    id: e.ifile,
                    text: _.capitalize(e.title),
                    leaf: true
                };

                let cache = {};
                value.getChildren = () => {
                    return addTable(value, value.path, cache);
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

        customsAPI('options')
            .query({id: parent.id}, (values) => {
                cache.title = parent.text;
                cache.options = values;
                cache.options.forEach((e) => {
                    e.chosen = e.options[0].id;
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
        let query = {
            id: parentSubject.id,   
            values: _.map(tableValues, 'chosen')
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
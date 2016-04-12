require('angular-local-storage');

require('./displays/linechart');
require('./displays/removablelist'); 
require('./displays/datatree');
require('./inputs/select');

const _ = require('lodash');

const helper = require('./stathelper');

angular.module('app.pxdata', ['ngResource', 'app.selectinput', 'app.linechart', 'app.removablelist', 'app.datatree', 'LocalStorageModule'])
 
.config(['$httpProvider', 'localStorageServiceProvider', function ($httpProvider, localStorageServiceProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight) 
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {}; 
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
 
    localStorageServiceProvider.setPrefix('sv');
}]) 

.factory('StatisticsAPI', function($resource) {
    return $resource('http://pxnet2.stat.fi/PXWeb/api/v1/fi/:source/:subject/:subrealm/:realm');
})

.factory('StatisticsAPIData', function($resource) {
    return function(path) {
        return $resource('http://pxnet2.stat.fi/PXWeb/api/v1/fi/' + path);
    };
})
    
.controller('StatisticsController', function($routeParams, $location, localStorageService, StatisticsAPI, StatisticsAPIData) {
    var ctrl = this;

    ctrl.dataTree = getSources();
    ctrl.tables = {};
    ctrl.series = getSeriesData();
    ctrl.show = {
        menuOpen: false,
        tables: false
    };

    let seriesData = getStoredData();
    if (seriesData.length && !ctrl.series.data.length) {
        seriesData.reverse().forEach((d) => {
            ctrl.series.getData(d.path, d.query, d.title);
        }); 
    }
    
    function getSources() {  
        return StatisticsAPI.query().$promise.then((values) => {
            ctrl.dataTree = _.map(values, (e) => {
                var value = {
                    path: e.dbid,
                    id: e.dbid,
                    text: e.text.replace(/_/g, ' ').replace('StatFin', 'Tilastokeskus'),
                    children: []  
                }; 
               
                value.getNext = () => {
                    ctrl.show.tables = false;
                    addSubjects(value, value.id);
                };  
                return value;
            });
        }); 
    }

    function addSubjects(parent, subjectPath) {
        if (parent.children.length) {
            return;
        }  
          
        return StatisticsAPIData(subjectPath)
            .query({}, (values) => {
                parent.children = _.map(values, (e) => {
                    let value = {
                        path: subjectPath + '/' + e.id,
                        id: e.id, 
                        text: e.text,
                        children: [],
                        leaf: e.id.endsWith('.px') ? true: false
                    };
   
                    value.getNext = () => {
                        ctrl.show.tables = false;
                        let adder = e.id.endsWith('.px') ? addTable: addSubjects;
                        adder(value, value.path); 
                    };
                    
                    return value;
                });
            });
    }
    
    
    function addTable(parent, subjectPath) {
        ctrl.show.tables = true;
        
        return StatisticsAPIData(subjectPath)
            .get({}, (values) => {
                ctrl.tables.title = parent.text;
                ctrl.tables.options = _.map(values.variables, (e) => {
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

                ctrl.tables.getSeriesData = () => {
                    ctrl.series.get(ctrl.tables.options, parent, subjectPath);
                }
            });
    }
 
    function getSeriesData() {
        let series = {
            data: [],
            get: function (tableValues, parentSubject, subjectPath) {
                let title = helper.createSeriesName([parentSubject].concat(tableValues));
                let query = helper.createDataQueryValues(tableValues);
                
                let seriesData = getStoredData(); 
                localStorageService.set('seriesData', seriesData.concat([{title: title, query: query, path: subjectPath}]));
                return series.getData(subjectPath, query, title);

            },
            getData: function(path, query, title) {
                return StatisticsAPIData(path)
                    .save({
                        query: query,
                        response: {format: 'json'}
                    }, (values) => {
                        let entry = helper.createSeries(values, title);

                        ctrl.series.data.push(entry);
                        ctrl.show.tables = false;
                        ctrl.show.menuOpen = false;
                    });
            },
            remove: function (title) {
                let seriesData = getStoredData();
                localStorageService.set('seriesData', _.filter(seriesData, (e) => {
                    return e.title !== title;
                }));
                
                ctrl.series.data = _.filter(ctrl.series.data, (e) => {
                    return e.title !== title;
                });
            }
        };

        return series;
    }
    
    function getStoredData() {
        let seriesData = localStorageService.get('seriesData');
        if (!seriesData || !Array.isArray(seriesData)) {
            return [];
        }
        return seriesData;
    }
});
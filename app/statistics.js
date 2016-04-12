require('./displays/linechart');
require('./displays/removablelist'); 
require('./displays/datatree');
require('./inputs/select');

const _ = require('lodash');
  
const helper = require('./stathelper');

angular.module('app.pxdata', ['ngResource', 'app.selectinput', 'app.linechart', 'app.removablelist', 'app.datatree'])
 
.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight) 
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {}; 
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {}; 
}]) 

.factory('StatisticsAPI', function($resource) {
    return $resource('http://pxnet2.stat.fi/PXWeb/api/v1/fi/:source/:subject/:subrealm/:realm');
})

.factory('StatisticsAPIData', function($resource) {
    return function(path) {
        return $resource('http://pxnet2.stat.fi/PXWeb/api/v1/fi/' + path);
    };
})
    
.controller('StatisticsController', function($routeParams, $location, StatisticsAPI, StatisticsAPIData) {
    var ctrl = this;

    ctrl.dataTree = getSources();
    ctrl.tables = {};
    ctrl.series = getSeriesData();
    ctrl.show = {
        menuOpen: false,
        tables: false
    };

    let locationValues = $location.search();
    console.log(locationValues);
    locationValues.split(',').forEach((e) => {
        let entry = _.find(dataTree, {id: e});
        entry.getNext().then(() => {
            
        });
    });
    
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
                let query = helper.createDataQueryValues(tableValues);
                return StatisticsAPIData(subjectPath)
                    .save({
                        query: query,
                        response: {format: 'json'}
                    }, (values) => {
                        let entry = helper.createSeries(values);
                        entry.title = helper.createSeriesName([parentSubject].concat(tableValues));

                        ctrl.series.data.push(entry);
                        ctrl.show.tables = false;
                        ctrl.show.menuOpen = false;
                    });
            },
            remove: function (title) {
                ctrl.series.data = _.filter(ctrl.series.data, (e) => {
                    return e.title !== title;
                });
            }
        };

        return series;
    }
});
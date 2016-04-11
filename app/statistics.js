require('./displays/linechart');
require('./displays/removablelist')
require('./inputs/datalist');
require('./inputs/select');

const _ = require('lodash');

angular.module('StatisticsVisualization', ['ngResource', 'DatalistInput', 'SelectInput', 'LineChart', 'RemovableList'])
 
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
    
.controller('StatisticsController', function($routeParams, StatisticsAPI, StatisticsAPIData) {
    var ctrl = this;

    ctrl.dataTree = getSources();
    ctrl.chosenPath = '';
    
    ctrl.tables = [];
    ctrl.series = createSeriesData();

    function getSources() {  
        return StatisticsAPI.query().$promise.then((values) => {
            ctrl.dataTree = _.map(values, (e) => {
                var value = {
                    path: e.dbid,
                    id: e.dbid,
                    text: e.text,
                    children: []
                }; 
               
                value.getNext = () => { 
                    ctrl.chosenPath = (value.path && (value.path === ctrl.chosenPath)) ? '' : value.path;
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
          
        StatisticsAPIData(subjectPath)
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
                        ctrl.chosenPath = value.path;
                        let adder = e.id.endsWith('.px') ? addTable: addSubjects;
                        adder(value, value.path); 
                    };
                    
                    return value;
                });
            });
    }
 
    function addTable(parent, subjectPath) {
        StatisticsAPIData(subjectPath)
            .get({}, (values) => {
                ctrl.tables = _.map(values.variables, (e) => {
                    let value = {
                        title: e.text,
                        options: _.zipWith(e.values, e.valueTexts, (id, text) => {
                            return {
                                id: id,
                                text: text 
                            };
                        }),
                        time: e.time || isYearData(e)  
                    };
 
                    value.chosen = value.options[0].id;
                    return value; 
                });

                ctrl.showValues = true;
            });
    }
 
    function createSeriesData() {
        let series = { 
            data: [],
            get: function() {
                let query = createDataQueryValues(ctrl.tables);
                StatisticsAPIData(ctrl.chosenPath)
                    .save({
                        query: query,
                        response: { format: 'json' } 
                    }, (values) => { 
                        let entry = {};
                        entry.title = createSeriesName([findLastData(ctrl.dataTree, ctrl.chosenPath.split('/'))].concat(ctrl.tables));
                        let years = createLabels(values);
                        let reverse = years.length > 1 && parseInt(years[0]) > parseInt(years[1]);
                        entry.labels = reverse ? years.reverse() : years;
                        let data = createData(values, reverse);
                        entry.data = reverse ? data.reverse() : data;
                        ctrl.series.data.push(entry);
   
                        ctrl.showValues = false;
                    });
            },  
            remove: function(title) {
                ctrl.series.data = _.filter(ctrl.series.data, (e) => {
                    return e.title !== title;
                });
            } 
        }; 
        
        return series;
 
        function findLastData(dataTree, relativePath) {
            let path = relativePath[0];
            let value = _.find(dataTree, {id: path});

            if (!value) return {};
             
            if (relativePath.length <= 1) {
                return value;
            } 
            
            return findLastData(value.children, relativePath.slice(1, relativePath.length + 1));  
        }
        
        function createSeriesName(types) {
            types = _.filter(types, (t) => {
                return !t.time;
            });
            return _.map(types, (type) => { 
                if (type.children) { 
                    return type.text; 
                }   
                return _.find(type.options, {id: type.chosen}).text;
            }).join(' : '); 
        }

        function createLabels(values) {
            let yearIndex = _.findIndex(values.columns, (e) => {
                return isYearData(e);
            });
            
            if (yearIndex === -1) {
                return [2002];
            }
            
            return _.map(values.data, (e) => {
                return e.key[yearIndex]
            });
        }
        
        function createData(values, reverse) {
            return _.map(values.data, (e) => {
                return e.values[0]
            });
        }

        function createDataQueryValues(variables) {
            let query = _.map(variables, (variable) => {
                if (variable.time) {
                    return {
                        code: variable.title,
                        selection: {
                            filter: 'item',
                            values: _.filter(_.map(variable.options, 'id'), (e) => {
                                return !isNaN(e) 
                            })
                        }
                    }
                }
                else {
                    return {
                        code: variable.title,
                        selection: {
                            filter: 'item',
                            values: [
                                variable.chosen
                            ]
                        }
                    }
                }
            });

            return query;
        }
    }

    function isYearData(entry) {
        return ['vuosi', 'tilastovuosi', 'time'].indexOf(entry.code.toLowerCase()) >= 0;
    }

});

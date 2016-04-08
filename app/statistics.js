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
        return $resource('http://pxnet2.stat.fi/PXWeb/api/v1/fi/' + path.join('/'));
    };
})
    
.controller('StatisticsController', function($routeParams, StatisticsAPI, StatisticsAPIData) {
    var ctrl = this;

    ctrl.sources = createSources();
    ctrl.inputs = [];
    ctrl.table = null;
    ctrl.series = createSeriesData();

    function createSources() {
        let sources = {
            title: "Lähde",
            options: [], 
            chosen: null,
            get: get,
            triggerNext: null
        };

        sources.get();
        
        function get() {
            StatisticsAPI.query({}, (values) => {
                sources.options = values;
                _.map(sources.options, (e) => {
                    e.id = e.dbid;
                });
                sources.chosen = sources.options[0].id;
                ctrl.inputs = [];
                let nextInput = createSubjectInput(0, sources.chosen);
                sources.triggerNext = nextInput.get;
            });
        }
         
        return sources;
    }
    
    function createSubjectInput(inputNumber, newValue) {
        let subjects = {
            title: 'Aihe' + (inputNumber + 1),
            inputNumber: inputNumber,
            options: [],
            chosen: null,
            get: get,
            triggerNext: null
        };

        subjects.get(newValue);
        return subjects;
       
        function get(newValue) {
            ctrl.inputs = ctrl.inputs.length ? ctrl.inputs.slice(0, inputNumber) : [];
            ctrl.table = null;
            let chosenValues = _.map(ctrl.inputs, 'chosen');
            let pathSoFar = [ctrl.sources.chosen].concat(chosenValues);
            pathSoFar = pathSoFar.slice(0, pathSoFar.length - 1).concat([newValue]);
            StatisticsAPIData(pathSoFar)
                .query({}, (values) => {
                    subjects.options = values;
                    subjects.chosen = subjects.options[0].id;
                    ctrl.inputs.push(subjects);
                       
                    if (subjects.options[0].id.endsWith('.px')) {
                        let nextInput = createTableInput(subjects.chosen);
                        subjects.triggerNext = nextInput.get;
                    }
                    else {
                        let nextInput = createSubjectInput(inputNumber + 1, subjects.chosen);
                        subjects.triggerNext = nextInput.get;
                    }
                });
        }
    } 
 
    function createTableInput(newValue) {
        let table = {
            variables: [],
            get: get
        };
          
        ctrl.table = table;
        table.get(newValue);
        return table; 
        
        function get(newValue) { 
            let previousInputs = ctrl.inputs.slice(0, ctrl.inputs.length - 1);
            let chosenValues = _.map(previousInputs, 'chosen');
            StatisticsAPIData([ctrl.sources.chosen].concat(chosenValues, newValue))
                .get({}, (values) => {
                    let inputs = _.map(values.variables, (entry) => {
                        let value = {
                            title: entry.text,
                            options: _.zipWith(entry.values, entry.valueTexts, (id, text) => {
                                return {
                                    id: id,
                                    text: text
                                };
                            }),
                            time: entry.time || isYearData(entry)
                        };

                        value.chosen = value.options[0].id;
                        return value;
                    });
                    table.variables = inputs;
                });
        }
    }
 
    function createSeriesData() {
        let series = { 
            data: [],
            get: function() {
                let chosenValues = _.map(ctrl.inputs, 'chosen');
                
                let query = createDataQueryValues(ctrl.table.variables);
                StatisticsAPIData([ctrl.sources.chosen].concat(chosenValues))
                    .save({
                        query: query,
                        response: { format: 'json' }
                    }, (values) => { 
                        let entry = {};
                        entry.title = createSeriesName([ctrl.inputs[ctrl.inputs.length - 1]].concat(ctrl.table.variables));
                        let years = createLabels(values);
                        let reverse = years.length > 1 && parseInt(years[0]) > parseInt(years[1]);
                        entry.labels = reverse ? years.reverse() : years;
                        let data = createData(values, reverse);
                        entry.data = reverse ? data.reverse() : data;
                        ctrl.series.data.push(entry);
                    });
            }, 
            remove: function(title) {
                ctrl.series.data = _.filter(ctrl.series.data, (e) => {
                    return e.title !== title;
                });
            } 
        }; 
        
        return series;
 
        function createSeriesName(types) {
            types = _.filter(types, (t) => {
                return !t.time;
            });
            return _.map(types, (type) => { 
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
                            values: _.map(variable.options, 'id')
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

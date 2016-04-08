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

    ctrl.inputs = [];
    generateInputs(0);
    ctrl.table = createTableInput();
    ctrl.series = createSeriesData();

    function generateInputs(inputNumber) {
        let sources = {
            title: "Lähde",
            inputNumber: inputNumber,
            options: [], 
            chosen: null,
            get: get,
            triggerNext: null
        };

        sources.get();
        
        function get(newValue) {
            StatisticsAPI.query({}, (values) => {
                sources.options = values;
                _.map(sources.options, (e) => {
                    e.id = e.dbid;
                });
                sources.chosen = sources.options[0].id;
                ctrl.inputs = [sources];
                let nextInput = createSubjectInput(inputNumber + 1, sources.chosen);
                sources.triggerNext = nextInput.get;
            });
        }
    }
    
    function createSubjectInput(inputNumber, newValue) {
        let subjects = {
            title: 'Aihe' + inputNumber,
            inputNumber: inputNumber,
            options: [],
            chosen: null,
            get: get,
            triggerNext: null
        };

        subjects.get(newValue);
        return subjects;
 
        function get(newValue) {
            let previousInputs = ctrl.inputs.slice(0, inputNumber - 1);
            StatisticsAPIData(_.map(previousInputs, 'chosen').concat(newValue))
                .query({}, (values) => {
                    subjects.options = values;
                    subjects.chosen = subjects.options[0].id;
                    ctrl.inputs = ctrl.inputs.slice(0, inputNumber).concat(subjects);
                    
                    if (subjects.options[0].id.endsWith('.px')) {
                        let nextInput = createTableInput(inputNumber + 1, subjects.chosen);
                        subjects.triggerNext = nextInput.change;
                    }
                    else {
                        let nextInput = createSubjectInput(inputNumber + 1, subjects.chosen);
                        subjects.triggerNext = nextInput.change;
                    }
                });
        }
    }

    function createTableInput(inputNumber, newValue) {
        let table = {
            inputNumber: inputNumber,
            variables: [],
            get: get
        };
          
        ctrl.table = table;
        table.get(newValue);
        return table; 
        
        function get(newValue) {
            let previousInputs = ctrl.inputs.slice(0, inputNumber - 1);
            StatisticsAPIData(_.map(previousInputs, 'chosen').concat(newValue))
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
                            time: entry.time || ["vuosi", "tilastovuosi"].indexOf(entry.code.toLowerCase()) >= 0
                        };

                        value.chosen = value.options[0].id;
                        return value;
                    });
                    table.variables = inputs;
                });
        }
        
        return table;
    }

    function createSeriesData() {
        let series = { 
            data: [],
            get: function() {
                let query = createDataQueryValues(ctrl.table.variables);
                StatisticsAPIData(_.map(previousInputs, 'chosen'))
                    .save({
                        query: query,
                        response: { format: 'json' }
                    }, (values) => { 
                        let entry = {};
                        entry.title = createSeriesName([ctrl.realms].concat(ctrl.table.variables));
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
                return ["vuosi", "tilastovuosi"].indexOf(e.code.toLowerCase()) >= 0;
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

});

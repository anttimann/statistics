require('./services/localstorage');
require('./displays/linechart');
require('./displays/removablelist');
require('./displays/datatree');
require('./inputs/select');
require('./actions/shareseries');

require('./pxnet/pxnet');

angular.module('app.stats', ['app.pxnet',  'app.selectinput', 'app.linechart', 'app.removablelist', 'app.datatree', 'app.localstorage', 'app.shareseries'])
    
.controller('StatsCtrl', ['$routeParams', 'pxNetService', 'localStorage',
    function($routeParams, pxNetService, localStorage) {
    var ctrl = this;

    ctrl.dataTree = [];
        
    pxNetService.getData().then((data) => {
        ctrl.dataTree = ctrl.dataTree.concat(data);
    });
        
    ctrl.show = {
        menuOpen: false,
        tables: false
    };
        
    ctrl.getTableData = (entry) => {
        ctrl.show.tables = true;
        ctrl.show.menuOpen = false;

        entry.getChildren().then((tables) => {
            ctrl.tables = tables;
        });
    };
 
    ctrl.series = [];    
    ctrl.addSeries = () => { 
        ctrl.show.tables = false;
        ctrl.tables.getSeriesData().then((seriesData) => {
            ctrl.series.push(seriesData);
        }); 
    };
        
    ctrl.removeSeries = (title) => {
        let seriesData = localStorage.get();
        localStorage.save(_.filter(seriesData, (e) => {
            return e.title !== title;
        }));
    
        ctrl.series = _.filter(ctrl.series, (e) => {
            return e.title !== title;
        });
    };
        
    ctrl.getSeriesQueries = localStorage.get; 
        
    let seriesData = localStorage.get();
    if (seriesData.length) {
        seriesData.forEach((d) => {
            pxNetService.getSeriesData(d.path, d.query, d.title).then((seriesData) => {
                ctrl.series.push(seriesData);
            });
        }); 
    }
}]);
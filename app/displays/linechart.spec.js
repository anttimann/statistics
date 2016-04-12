//var angular = require('angular');
require('./linechart');

describe('linechart test', function() { 
    beforeEach(angular.mock.module('app.linechart')); 
 
    beforeEach(angular.mock.module('app/displays/linechart.html'));
 
    beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));
    
    it('Test1', function() {
        $rootScope.series = [];
        var element = $compile('<sv-line-chart series="series"></sv-line-chart>')($rootScope);
        $rootScope.$digest();
 
        expect(element.html()).to.contain("canvas"); 
    });

});
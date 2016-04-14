require('./shareseries');
const sinon = require('sinon'); 
const helper = require('../test/helper');

describe('shareseries test', () => {
    beforeEach(angular.mock.module('app.shareseries')); 
    beforeEach(angular.mock.module('app/actions/shareseries.html'));

    describe('directive test', () => {
        beforeEach(() => {
            angular.mock.module(($provide) => {
                $provide.factory('storeSeries', () => {
                    this.store = sinon.stub().returns('123');
                    this.get = sinon.stub().returns('123');
                    return this;
                }); 
            });
        });

        let $compile, $rootScope, mockStoreSeries, mockUibModal;

        beforeEach(angular.mock.inject((_$compile_, _$rootScope_, _$uibModal_, storeSeries) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_.$new();
            mockStoreSeries = storeSeries;
            mockUibModal = _$uibModal_;
        }));

        it('Button is correctly created', () => {
            $rootScope.get = sinon.stub().returns(1);
            mockUibModal.open = sinon.stub().returns(true);

            var element = $compile('<sv-share-series text="test1" series-query="get"></sv-share-series>')($rootScope);
            $rootScope.$digest();

            helper.click(element.find('button')[0]);
            expect(element.html()).to.contain("button");
            expect(mockUibModal.open.calledOnce).to.equal(true);
        });
    });

    describe('controller test', () => {
        var controller;
        
        beforeEach(inject(($injector) => {
            controller = $injector.get('$controller');
        }));

        it('url is correctly created', () => {
            let scope = {};
            let mockLocation = {
                absUrl: sinon.stub().returns('base.url/#/extra_text')
            };

            controller('ShareSeriesCtrl', { $scope: scope, $uibModalInstance: null, $location: mockLocation, seriesId: 'series_id'});
            expect(scope.url).to.equal('base.url/#/kayrat/series_id');
        });
    });
});
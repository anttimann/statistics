require('./pxnet');
const sinon = require('sinon'); 
const helper = require('../test/helper');

describe('pxNet test', () => {
    beforeEach(angular.mock.module('app.pxnet'));
    
    let $q, $httpBackend, pxNetService, $rootScope, sourcesResult;

    beforeEach(angular.mock.inject((_$q_, $injector, _$rootScope_) => {
        $q = _$q_;
        $httpBackend = $injector.get('$httpBackend');
        pxNetService = $injector.get('pxNetService');
        $rootScope = _$rootScope_
    }));
    
    it('should call for sources data', (done) => {
        inject(function (pxNetService) {
            $httpBackend.expectGET('/data/pxnet/sources')
                .respond([{id: '123', text: 'abc'}]);

            pxNetService.getData().then((data) => {
                expect(data.length).to.equal(1);
                expect(data[0].path).to.equal('123');
                expect(data[0].text).to.equal('abc');
                sourcesResult = data;
                done();
            });
            $httpBackend.flush();
            $rootScope.$apply();
        })
    });

    it('should call for series data', (done) => {
        inject(function (pxNetService) {
            $httpBackend.expectGET('/data/pxnet/series?id=123%2Fabc&values=a%3D1')
                .respond({
                    labels: ['2002'],
                    data: ['123']
                });
        
            pxNetService.getSeriesData('123/abc', 'a=1', 'test').then((data) => {
                expect(data.path).to.equal('123/abc');
                expect(data.data).to.deep.equal(['123']);
                expect(data.labels).to.deep.equal(['2002']);
                done();
            });
            $httpBackend.flush();
            $rootScope.$digest();
        });
    });
});
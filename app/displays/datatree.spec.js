require('./datatree');
const sinon = require('sinon'); 
const helper = require('../test/helper');
const Promise = require('bluebird');

describe('datatree test', () => {
    beforeEach(angular.mock.module('app.datatree')); 
    beforeEach(angular.mock.module('app/displays/datatree.html'));

    let $compile, $rootScope, mockStoreSeries, mockUibModal;

    beforeEach(angular.mock.inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_.$new();
    }));

    it('Datatree is correctly created', (done) => {
        $rootScope.treeData = [{
            text: 'a1', path: 'a1', children: [], getChildren: sinon.stub().returns(Promise.resolve([{
                    text: 'b1', path: 'a1/b1', getChildren: sinon.stub().returns(Promise.resolve([])), leaf:true
                }, {
                    text: 'b2', path: 'a1/b2', getChildren: sinon.stub().returns(Promise.resolve([{
                        text: 'c1', path: 'a1/b2/c1', getChildren: sinon.stub().returns([]), leaf:true
                    }]))
                }
            ]))
        }
        ]; 
        $rootScope.leafClicked = sinon.stub().returns(true); 

        var element = $compile(angular.element('<sv-data-tree tree-data="treeData" leaf-clicked="leafClicked"></sv-data-tree>'))($rootScope);
        $rootScope.$digest();
        
        expect(angular.element(element[0].querySelector('.datatree')).html()).to.contain('a1');

        clickElement(element, '.entry')
            .then(() => {
                expect(angular.element(element[0].querySelector('.datatree')).html()).to.contain('b1');
                return clickElement(element, '.datatree li ul .entry')
            })
            .then(() => {
                expect($rootScope.leafClicked.calledOnce).to.equal(true);
                return clickElement(element, '.datatree>ul>li>ul>li:nth-child(2)>.entry')
            })
            .then(() => {
                expect(angular.element(element[0].querySelector('.datatree')).html()).to.contain('c1');
                done();
            });
    });

    function clickElement(element, elementPath) {
        return new Promise((resolve) => {
            helper.click(element[0].querySelector(elementPath));
            setTimeout(() => {
                $rootScope.$digest();
                resolve();
            }, 0);
        });
    }
    
});


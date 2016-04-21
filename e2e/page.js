'use strict';

const page = {
    menubar: {
        openMenuButton: () => element(by.css('.menu > .menu_open')),
        closeMenuButton: () => element(by.css('.menu > .menu_close')),
        
        menuArea: () => element(by.css('.bottom_area')),
        dataTreeEntry: (level, text) => element(by.cssContainingText(dataTreeLevelCss(level) + ' > div', text)),
        dataTreeLevelAll: (level) => element.all(by.css(dataTreeLevelCss(level))),
        
        inputArea: () => element(by.css('.bottom_area .tables')),
        inputsAll: () => element.all(by.css('.bottom_area .tables select')),
        addSeriesButton: () => element(by.css('.bottom_area > .tables .add_series'))
    },
    
    chartArea: {
        addedSeriesAll: () => element.all(by.css('.remove_series table tr')),
        removeSeriesButton: (index) => element(by.css('.remove_series table tr:nth-child(' + index + ') button')),
        shareSeriesButton: () => element(by.css('.share_series button'))
    },
    
    shareSeries: {
        shareLinkInput: () => element(by.css('.modal-open .modal-body .url_input')),
        closeButton: () => element(by.css('.modal-open .modal-footer button'))
    }
};

function dataTreeLevelCss(level) {
    return '.datatree' + '> ul > li'.repeat(level);
}

module.exports = page;
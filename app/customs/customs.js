require('./../services/localstorage');
  
const _ = require('lodash');
const service = require('./customs.service');

angular.module('app.customs', ['ngResource', 'app.localstorage'])


       
.factory('customsAPI', ['$resource', function($resource) { 
    return function(path) {
        return $resource('/data/customs/' + path);       
    };   
}])    

.factory('customsService', ['$q', 'customsAPI', 'localStorage', service]);

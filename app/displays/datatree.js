angular.module('app.datatree', [])

.directive('svDataTree', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            treeData: '='
        }, 
        templateUrl: 'app/displays/datatree',
        link: (scope) => {
            scope.chosenPath = [];
            
            scope.handleClick = (entry) => {  
                let entryIndex = entry.path.split('/').length - 1;
                if (scope.chosenPath[entryIndex] === entry && !entry.leaf) {
                    scope.chosenPath = scope.chosenPath.slice(0, entryIndex);
                }
                else {
                    scope.chosenPath[entryIndex] = entry;
                }
  
                entry.getNext();
            };
            
        }
    }
});

angular.module('hudsup.filters', [])
.filter('digit', function(){
    return function(input, position){
        var i = parseInt(input, 10);
        if (isNaN(i)) {
            return '';
        } else {
            return i.toString().split("").reverse().join("")[position]
        }
    };
})
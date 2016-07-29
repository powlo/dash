angular.module('hudsup.services', [])
    .service('settings', ['$localStorage', function ($localStorage) {
        var defaults = JSON.stringify({
            colour : 'assertive',
            units : 'kph',
            vertical : false,
            horizontal : false,
            insomnia : false
        });
        
        this.get = function (){
            return $localStorage.getObject('hudsup-settings', defaults);
        }
        
        this.set = function(obj){
            $localStorage.storeObject('hudsup-settings', obj);
        }
        
    }])

    .factory('$localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
}])
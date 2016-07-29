angular.module('hudsup.services', [])
    .service('settings', ['$localStorage', function ($localStorage) {
        return {
            colour: $localStorage.get('colour', 'assertive'),
            units: $localStorage.get('units', 'kph'),
            vertical: $localStorage.get('vertical', false),
            horizontal: $localStorage.get('horizontal', false),
            insomnia: $localStorage.get('insomnia', false)
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
angular.module('hudsup.controllers', ['ionic', 'ngCordova'])
    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal

        $scope.colours = [
            {
                name: 'Red',
                value: 'assertive'
        },
            {
                name: 'Green',
                value: 'balanced'
        },
            {
                name: 'Blue',
                value: 'positive'
        }
    ];

        $scope.units = ['Miles', 'Kilometres'];

        $rootScope.settings = {
            colour: $scope.colours[0],
            units: $scope.units[0],
            vertical: false,
            horizontal: false,
            stayon: false
        }
    })

.controller('SpeedCtrl', function ($scope, $ionicPopup, $cordovaGeolocation) {
    ionic.Platform.ready(function () {

        function onSuccess(position) {
            $scope.coords = position.coords;
            $scope.kph = position.coords.speed * 60 * 60 / 1000;
            $scope.mph = $scope.kph * 0.621371;
        }

        function onError(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Cordova Error: ' + err.code,
                template: err.message
            });
        }
        var watchOptions = {
            timeout: 6000,
            enableHighAccuracy: true // may cause errors if true
        };
        watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(null, onError, onSuccess);
    });
});
angular.module('hudsup.controllers', ['ionic', 'ngCordova', 'ngCordova.plugins.insomnia', 'hudsup.services'])
    .controller('AppCtrl', function ($scope, $rootScope, $ionicPlatform, $ionicModal, $cordovaInsomnia, $timeout, settings) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal

        $scope.colours = ['assertive', 'balanced', 'positive'];
        $scope.units = ['mph', 'kph'];

        $scope.settings = settings.get();

        $ionicPlatform.ready(function () {
            $scope.settingschange = function () {
                settings.set($scope.settings);
                if ($scope.settings.insomnia) {
                    $cordovaInsomnia.keepAwake();
                } else {
                    $cordovaInsomnia.allowSleepAgain();
                }
            }
        });
    })

.controller('SpeedCtrl', function ($scope, $rootScope, $ionicPopup, $cordovaGeolocation) {
    ionic.Platform.ready(function () {

        function onSuccess(position) {
            $scope.coords = position.coords;
            var kph = position.coords.speed * 60 * 60 / 1000;
            var mph = $scope.kph * 0.621371;
            if ($scope.settings.units == 'kph') {
                $scope.speed = kph;
            } else {
                $scope.speed = mph;
            }
        }

        function onError(err) {
            console.log('cordovaGeolocation Error: ' + err.code + ' : ' + err.message);
        }
        
        var watchOptions = {
            timeout: 6000,
            enableHighAccuracy: true // may cause errors if true
        };
        watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(null, onError, onSuccess);
    });
});
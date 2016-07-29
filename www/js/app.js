angular.module('hudsup', ['ionic', 'hudsup.controllers', 'hudsup.filters', 'ngCordova', 'ngCordova.plugins.insomnia'])

.run(function ($ionicPlatform, $cordovaInsomnia) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl'
    })

    .state('app.speed', {
        url: '/speed',
        views: {
            'menuContent': {
                templateUrl: 'templates/speed.html',
                controller: 'SpeedCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/speed');
});
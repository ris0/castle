'use strict';
window.app = angular
    .module('Castles', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'firebase',
        'snap'
    ])
    .config(function($urlRouterProvider, $locationProvider, $stateProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/login');

        $stateProvider

            .state('base', {
                abstract: true,
                url: '',
                templateUrl: 'views/base.html'
            })
            .state('login', {
                url: '/login',
                parent: 'base',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                parent: 'base',
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    syncObject: function($firebaseObject, gameFactory) {
                        return $firebaseObject(gameFactory.ref());
                    },
                    usersRef: function($firebaseObject, gameFactory) {
                        return gameFactory.ref().child("users");
                    },
                    userId: function($firebaseObject, gameFactory) {
                        return gameFactory.auth().$getAuth().uid;
                    }
                }
            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/overview.html'
            })
            .state('create', {
                url: '/create',
                parent: 'overview',
                templateUrl: 'views/dashboard/createLobby.html',
                controller: 'createLobbyCtrl'
            })
            .state('join', {
                url: '/join',
                parent: 'overview',
                templateUrl: 'views/dashboard/join.html'
            })
            .state('random', {
                url: '/random',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/random.html'
            })
            .state('gridtesting', {
                url: '/gridtesting',
                controller: 'GridTestingCtrl',
                templateUrl: 'views/gameboard/gridtesting.html'
            });
    })
    .run(function($rootScope) {

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error) console.log(error);
        })
    });


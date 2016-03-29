'use strict';
window.app = angular
    .module('Castles', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'firebase',
        'snap'
    ])
    .constant('_', window._)
  // use in views, ng-repeat="x in _.range(3)"
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
                    baseStateRef: function($firebaseObject, gameFactory) {
                        return gameFactory.ref().child("baseState");
                    },
                    gamesRef: function($firebaseObject, gameFactory) {
                        return gameFactory.ref().child("games");
                    },
                    playersRef: function($firebaseObject, gameFactory) {
                        return gameFactory.ref().child("playersQueue");
                    },
                    usersRef: function($firebaseObject, gameFactory) {
                        return gameFactory.ref().child("users");
                    },
                    userId: function($firebaseObject, gameFactory) {
                        return gameFactory.auth().$getAuth().uid;
                    },
                    userEmail: function($firebaseObject, gameFactory) {
                        return gameFactory.auth().$getAuth().password.email;
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
                parent: 'dashboard',
                templateUrl: 'views/dashboard/create.html'
            })
            .state('join', {
                url: '/join',
                parent: 'dashboard',
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
    .run(function($rootScope, _) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error) console.log(error);
        })
        $rootScope._ = window._;
    });
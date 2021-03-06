'use strict';
window.app = angular
    .module('Castles', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'firebase',
        'snap',
        'ngDragDrop',
        'luegg.directives'
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
                templateUrl: 'views/dashboard.html'
            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/overview.html',
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
            .state('lobby', {
                url: '/lobby/:lobbyId/:userUniqueID',
                parent: 'overview',
                templateUrl: 'views/dashboard/lobby.html',
                controller: 'lobbyCtrl',
                resolve: {
                    gamesRef: function(gameFactory){
                        return gameFactory.ref().child('games');
                    },
                    lobbyRef: function($firebaseObject, gameFactory, $stateParams){
                        return $firebaseObject(gameFactory.ref().child('lobbies').child($stateParams.lobbyId));
                    },
                    lobbyId: function($stateParams){
                        return $stateParams.lobbyId;
                    },
                    lobbyUserObj: function($firebaseObject, gameFactory, $stateParams){
                        var userObj = $firebaseObject(gameFactory.ref().child('lobbies').child($stateParams.lobbyId).child('players').child($stateParams.userUniqueID));
                        return userObj.$loaded().then(function(userObj){
                            return userObj;
                        });
                    }
                }
            })
            .state('gameBoard', {
                url: '/gameBoard',
                controller: 'GameBoardCtrl',
                templateUrl: 'views/gameBoard/gameBoard.html'
            });
    })
    .run(function($rootScope, _) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error) {
                console.log(error);
                //console.log(event);
                //console.log(toState);
                //console.log(toParams);
                //console.log(fromState);
                //console.log(fromParams);
            }
        });
        $rootScope._ = window._;
    });


app.factory('CreateModalFactory', function($uibModal) {
    var createModal = {};

    createModal.open = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/dashboard/createModal.html',
            controller: 'createModalCtrl',
            size: 'sm'
        });
    };

    return createModal;
});

app.controller('createModalCtrl', function($scope, $uibModalInstance) {
    $scope.lobby = {};
    $scope.ok = function() { $uibModalInstance.close() };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel') };
});

/*
 Creating a lobby: ! = test, + = complete, - = in progress
 ! ui-view in the dashboard/overview html page
 ! either a ui-sref attached to the link ok submit button or $state.go inside the function block
 ! must define the parent/child relationship between the overview and the create state
 - when we create this new lobby, we must all create a few game properties on the firebase object
 - it should have be exactly like the baseState with some new properties
 - the first property would be similar to playersQueue, the array of players that are participating in the game
 - second property be something like gameMessages... it should store all messages sent by all players
 - third property would be isReady, a boolean, initially set to false;
 - then create two div elements that will do the following
 - ng-repeat messages
 - ng-repeat players
 - next html element will be a "ready" button
 - if all players in the queue are ready, $state.go('game')
 - join a lobby would be built on top of the create lobby stuff
 - also have a modal that will allow users to input a shared link
 - think link could be a reference obj id
 - it could a URL with ref obj id appended to it and then we can route the user there? or redirect
 - all it would do is get that user to the same game lobby

 - do we have a playersQueue for a given gameID? if not, let's define one now
 - if so, let's push this author into the player queue

 - next part is rather tricky because we can approach ths in several different ways
 - when a player joins a game what happens
 - the game's state changes
 - which property of this state changes? the playersQueue
 - so if a player clicks, join lobby, enters the gameID, this will invoke a function that will
 - push this player's uid into the player's queue
 - we should have an event listener that will check to see if that GAME's corresponding player queue changes
 - if it does,

 */

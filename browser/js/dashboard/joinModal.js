app.factory('JoinModalFactory', function($uibModal) {
    var joinModal = {};

    joinModal.open = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/dashboard/joinModal.html',
            controller: 'joinModalCtrl',
            size: 'sm'
        });
    };

    return joinModal;
});

/*
Refactoring goals:
joinModal and createModal needs to be refactored as this code is getting repetitive. For starters, we could extract
the userId, lobbiesRef, playerRef, and anything else that is asynchronous. It might be ideal for us to resolve these
async events in our state. Anything that has $loaded, $firebaseArray, and $firebaseObject can be taken out.

Challenges: Correctly identify the current state's userId, lobbyId, etc. Revisit this after we finish our MVP

Error handling / 404 goals:
Unfortunately, I didn't spend enough time thinking about the authorization issues at hand.
We have several issues with our current application as users can create lobbies that have the same name.
In addition, if the user decides to hit refresh, they are forced to log back in as their credentials did not persist.
We need to either cache their login credentials, use cookies, or perhaps even use local storage.
We also don't have any error / event handling in situations where a user gets a 404 status code. We haven't set up
any redirects nor do we have a 404 HTML template.

Challenges:
I have not yet dealt with authentication/persistence with Firebase and it will take me some time to get a full grasp
on it. Again, this is not incredibly important for the MVP but it should get done in the near future.
 */

app.controller('joinModalCtrl', function($scope, $uibModalInstance, $state, LobbyFactory, gameFactory, $firebaseObject, $firebaseArray) {

    var gameRef = gameFactory.ref(),
        lobbiesRef = $firebaseObject(gameRef.child('lobbies')),
        userId = gameFactory.auth().$getAuth().uid,
        lobbyId;
        $scope.lobby = {};

    const playerRef = $firebaseObject(gameFactory.ref().child('users').child(userId));
    var playerName;

    playerRef.$loaded()
        .then(function (obj) {
            var indexSlice = obj.email.indexOf('@');
            playerName = obj.email.slice(0, indexSlice);
        })
        .then(function() {
            return lobbiesRef.$loaded()
        })
        .then(function(lobbies) {

        $scope.ok = function () {
            for (var key in lobbies) {
                if (lobbies[key] && lobbies[key].name === $scope.lobby.name) {
                if (lobbies[key] && lobbies[key].password === $scope.lobby.password) {
                    var fireArr = $firebaseArray(gameRef.child('lobbies').child(key).child('players'));
                    fireArr.$add({
                        userID: userId,
                        userName: playerName
                    });
                    lobbyId = gameRef.child('lobbies').child(key).key();
                    LobbyFactory.registerInfo(lobbyId);
                    $uibModalInstance.close();
                    $state.go('lobby',{lobbyId: lobbyId});
                    }
                }
            }
        };

    });

    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


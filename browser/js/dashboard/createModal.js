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

app.controller('createModalCtrl', function($scope, $uibModalInstance, $state, gameFactory, $firebaseObject) {

    var gameRef = gameFactory.ref(),
        lobbiesRef = gameRef.child('lobbies'),
        userId = gameFactory.auth().$getAuth().uid;
        $scope.lobby = {};

    const playerRef = $firebaseObject(gameRef.child('users').child(userId));

    $scope.ok = function() {

        var playerName;
        var userUniqueID;

        playerRef.$loaded()
            .then(function (obj) {
                var indexSlice = obj.email.indexOf('@');
                playerName = obj.email.slice(0, indexSlice);
            })
            .then(function () {
                return lobbiesRef.push({
                    name: $scope.lobby.name,
                    password: $scope.lobby.password,
                    messages: []
                });
            })
            .then(function (lobby) {
                var lobbyId = lobby.key();
                var lobbyPlayers = gameFactory.ref().child('lobbies').child(lobbyId).child('players');
                var newPlayer = lobbyPlayers.push({
                        userID: userId,
                        userName: playerName,
                        isHost: true
                    });
                userUniqueID = newPlayer.key();
                console.log(userUniqueID);
                $uibModalInstance.close();
                $state.go('lobby',{lobbyId: lobbyId, userUniqueID: userUniqueID});
            });
    };




    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


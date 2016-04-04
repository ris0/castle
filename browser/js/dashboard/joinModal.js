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


app.controller('joinModalCtrl', function($scope, $uibModalInstance, $state, gameFactory, $firebaseObject, $firebaseArray) {

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
                    $uibModalInstance.close();
                    $state.go('lobby',{lobbyId: lobbyId});
                    }
                }
            }
        };

    });

    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


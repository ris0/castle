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

app.controller('joinModalCtrl', function($scope, $uibModalInstance, $state, LobbyFactory, gameFactory, $firebaseObject, $firebaseArray) {

    var gameRef = gameFactory.ref(),
        lobbiesRef = $firebaseObject(gameRef.child('lobbies')),
        userId = gameFactory.auth().$getAuth().uid,
        lobbyId;
        $scope.lobby = {};

    lobbiesRef.$loaded().then(function(lobbies) {

        $scope.ok = function () {
            for (var key in lobbies) {
                if (lobbies[key] && lobbies[key].name === $scope.lobby.name) {
                if (lobbies[key] && lobbies[key].password === $scope.lobby.password) {
                    var fireArr = $firebaseArray(gameRef.child('lobbies').child(key).child('players'));
                    fireArr.$add(userId);
                    lobbyId = gameRef.child('lobbies').child(key).key();

                    LobbyFactory.registerInfo(lobbyId);
                    $uibModalInstance.close();
                    $state.go('lobby');
                    }
                }
            }
        };

    });

    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


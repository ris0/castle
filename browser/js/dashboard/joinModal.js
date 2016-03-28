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

app.controller('joinModalCtrl', function($scope, $uibModalInstance, $state, LobbyFactory, gameFactory, $q, $firebaseObject) {

    var gameRef = gameFactory.ref(),
        lobbiesRef = $firebaseObject(gameRef.child('lobbies')),
        userId = gameFactory.auth().$getAuth().uid,
        lobbyId, networkPassword;
        $scope.lobby = {};

    lobbiesRef.$loaded().then(function(lobbies) {
        $scope.ok = function () {
            for (var key in lobbies) {
                if (lobbies[key] && lobbies[key].name === $scope.lobby.name) {
                    if (lobbies[key] && lobbies[key].password === $scope.lobby.password) {
                        gameRef.child('lobbies').child(key).child('players').push().set(userId);
                        lobbyId = gameRef.child('lobbies').child(key).key();
                        console.log(lobbyId)
                        LobbyFactory.registerInfo(lobbyId);
                        $uibModalInstance.close();
                        $state.go('lobby');
                    }
                }
            }

        };
    });




    //$scope.ok = function() {
    //    $q.resolve(lobbiesRef.push({
    //        name: $scope.lobby.name,
    //        password: $scope.lobby.password,
    //        messages: [],
    //        players: [userId]
    //    })).then(function(lobby) {
    //        LobbyFactory.registerInfo(lobby.key());
    //        $uibModalInstance.close();
    //        $state.go('lobby');
    //    });

    //};


    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


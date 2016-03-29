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

app.controller('createModalCtrl', function($scope, $uibModalInstance, $state, LobbyFactory, gameFactory, $q, $firebaseObject) {

    var gameRef = gameFactory.ref(),
        lobbiesRef = gameRef.child('lobbies'),
        userId = gameFactory.auth().$getAuth().uid;
        $scope.lobby = {};

    const playerRef = $firebaseObject(new Firebase ('https://castle-fullstack.firebaseio.com/users/' + userId));

    $scope.ok = function() {

        var playerName;

        playerRef.$loaded()
            .then(function (obj) {
                var indexSlice = obj.email.indexOf('@');
                playerName = obj.email.slice(0, indexSlice);
            })
            .then(function () {
                return lobbiesRef.push({
                    name: $scope.lobby.name,
                    password: $scope.lobby.password,
                    messages: [],
                    players: [{
                        userID: userId,
                        userName: playerName
                    }]
                })
            })
            .then(function (lobby) {
                LobbyFactory.registerInfo(lobby.key());
                $uibModalInstance.close();
                $state.go('lobby');
            });
    }




    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


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

app.controller('createModalCtrl', function($scope, $uibModalInstance, $state, LobbyFactory, gameFactory, $q) {

    var gameRef = gameFactory.ref(),
        lobbiesRef = gameRef.child('lobbies'),
        userId = gameFactory.auth().$getAuth().uid;
        $scope.lobby = {};

    $scope.ok = function() {
        $q.resolve(lobbiesRef.push({
            name: $scope.lobby.name,
            password: $scope.lobby.password,
            messages: "",
            players: [userId]
        })).then(function(lobby) { LobbyFactory.registerInfo(lobby.key()) });
        $uibModalInstance.close();
        $state.go('lobby');
    };


    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});


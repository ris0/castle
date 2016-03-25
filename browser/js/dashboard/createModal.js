app.factory('CreateModalFactory', function($uibModal) {
    var createModal = {};


    createModal.open = function() {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'js/dashboard/createModal.html',
            controller: 'createModalCtrl',
            size: 'sm'
        });
    };

    createModal.info= function (lobby) {
        return lobby;
    };

    //createModal.lobby.name = $scope.lobby.name;
    //createModal.lobby.password = $scope.lobby.password;

    return createModal;
});

app.controller('createModalCtrl', function($scope, $uibModalInstance, CreateModalFactory) {
    $scope.lobby = {};


    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
});

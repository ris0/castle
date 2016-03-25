app.factory('CreateLobbyFactory', function($uibModal) {
    let createLobby= {};


    return createLobby;
});

app.controller('createLobbyCtrl', function($scope, $uibModalInstance) {
    $scope.lobby = {};
    $scope.ok = function() { $uibModalInstance.close() };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel') };
});
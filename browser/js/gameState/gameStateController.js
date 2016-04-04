app.controller('gameStats', function($stateParams, marketFactory, kingsFavorsFactory, syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory, BonusModalFactory, userId) {
    var numberPlayers;
    var currentPlayer;
    var masterBuilder;

    $scope.noWrapSlides = false;
    $scope.active = 0;
    $scope.userId = userId;
    $scope.gameId = $stateParams.gameId;

    syncObject.$bindTo($scope, "data")
        .then(function() {
            $scope.userIndex = gameStateFactory.getUserIndex($scope.data);
            $scope.userObj = gameStateFactory.getUserObj($scope.data);
            $scope.players = $scope.data.players;
            return $scope.userIndex;
        }).then(function(index) {                      
            if ($scope.data.turnCount === 0 && !$scope.data.players[index].bonusCards) {
                BonusModalFactory.open($scope.userObj.bonusCardsInitial, index, $scope.gameId);
            }
        });
});
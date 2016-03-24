app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      $scope.userIndex = gameStateFactory.getUserIndex($scope.data);
    });
});

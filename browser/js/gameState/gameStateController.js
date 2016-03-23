app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {

      $scope.buy = function(room, price) {
        gameStateFactory.buy($scope.data, room, price);
      };

      $scope.pass = function() {
        gameStateFactory.pass($scope.data);
      };

      $scope.done = function() {
        gameStateFactory.done($scope.data);
      };

      $scope.drawToMarket = function() {
        gameStateFactory.drawToMarket($scope.data);
      };

      $scope.userIndex = gameStateFactory.getUserIndex($scope.data);

      if ($scope.data.turnCount === 0 && $scope.data.market[1000].room === "empty") $scope.drawToMarket();
    });
});

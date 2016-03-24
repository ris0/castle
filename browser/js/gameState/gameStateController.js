app.controller('gameStats', function(kingsFavorsFactory, syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      $scope.buy = function(room, price){
      	gameStateFactory.buy($scope.data, room, price);
      };

      $scope.pass = function(){
      	gameStateFactory.pass($scope.data);
      };

      $scope.done = function(){
      	gameStateFactory.done($scope.data);
      };

      $scope.drawToMarket = function(){
      	gameStateFactory.drawToMarket($scope.data);
      };

      $scope.userIndex = gameStateFactory.getUserIndex($scope.data);

    });
});

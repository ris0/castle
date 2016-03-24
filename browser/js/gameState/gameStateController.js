app.controller('gameStats', function(kingsFavorsFactory, syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      console.log($scope.data);
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

      var firstChoice;

      function swapMarket(price1, price2){
      	var temp = price1.room;
      	price1.room = price2.room;
      	price2.room = temp;
      	return true;
      }

      $scope.swapTwo = function(price){
      	if(firstChoice){
      		swapMarket(firstChoice, price);
      		firstChoice = null;
      	}else{
      		firstChoice = price;
      	}
      };

      if ($scope.data.turnCount === 0 && $scope.data.market[1000].room === "empty") $scope.drawToMarket();
    });
});

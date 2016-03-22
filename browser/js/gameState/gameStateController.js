app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory) {

  syncObject.$bindTo($scope, "data")
    .then(function() {
      (function getMyIndex() {
        var id = gameFactory.auth().$getAuth().uid;
        return $scope.data.players.reduce(function(prev, curr, index) {
          if (id === curr.userID) {
            $scope.userIndex = index;
            return index;
          }
          return prev;
        }, "");
      })();

    });

  $scope.buy = function(room, price) {
    if ($scope.data.currentPlayer === $scope.userIndex) {
    	console.log("Buying", room, price);
    	// $scope.data.players[$scope.data.currentPlayer].castle.push(room);

    }
  };

  $scope.done = function() {
    $scope.data.turnCount++;
    $scope.data.currentPlayer = ($scope.data.turnCount) % 2;
    if ($scope.data.turnCount % 2 === 0) $scope.data.masterBuilder = ($scope.data.masterBuilder + 1) % 2;
  };

  $scope.drawToMarket = function() {
    for (var price in $scope.data.market) {
      var currentPrice = $scope.data.market[price];
      if (currentPrice.room !== 'empty') currentPrice.room.discount += 1000;
      while (currentPrice.room === 'empty') {
	    var nextCard = $scope.data.roomCards.pop();
        if (typeof nextCard === 'number') { //if the next card in the pile is a room card
          if ($scope.data.roomTiles[nextCard][0]) currentPrice.room = $scope.data.roomTiles[nextCard].pop();
          else nextCard = $scope.data.roomCards.pop();
        } else currentPrice.room = nextCard; //if the next card in the pile is a tile
      }
    }
  };
});

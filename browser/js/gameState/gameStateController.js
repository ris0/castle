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
      if ($scope.data.turnCount === 0) {
        $scope.data.roomCards = _.shuffle($scope.data.roomCards);
        $scope.data.bonusCards = _.shuffle($scope.data.bonusCards);
        for (var roomSize in $scope.data.roomTiles) {
          $scope.data.roomTiles[roomSize] = _.shuffle($scope.data.roomTiles[roomSize]);
        }
        $scope.drawToMarket();
      }

    });

  //transfer cash from currentplayer to masterbuilder or 'bank'
  function cashFlow(price, truePrice) {
    var masterBuilder = $scope.data.players[$scope.data.masterBuilder];
    $scope.data.players[$scope.data.currentPlayer].cashMoney -= truePrice;
    if ($scope.data.currentPlayer !== $scope.data.masterBuilder) masterBuilder.cashMoney += +price;
  }

  //send room from deck to player castle
  function roomToPlayer(room, price) {
    room.room = 0;
    $scope.data.players[$scope.data.currentPlayer].castle.push(room.room);
    $scope.data.market[price].room = "empty";
  }

  //transfer money and room to castle
  //add scoring
  $scope.buy = function(room, price) {
    //validate player === currentplayer
    if ($scope.data.players[$scope.data.currentPlayer].canBuy) {
      var truePrice = +price - (+room.room.discount);
      cashFlow(price, truePrice);
      roomToPlayer(room, price);
      //calculate score
      $scope.data.players[$scope.data.currentPlayer].canBuy = false;
      $scope.done();
    } else console.log("It's not your turn");
    //completions
  };

  $scope.pass = function() {
    if ($scope.userIndex === $scope.data.currentPlayer) {
      $scope.data.players[$scope.data.currentPlayer].canBuy = false;
      $scope.data.players[$scope.data.currentPlayer].cashMoney += 5000;
      $scope.done();
    } else console.log("It's not your turn");
  };

  $scope.done = function() {
    $scope.data.turnCount++;
    $scope.data.currentPlayer = ($scope.data.turnCount) % $scope.data.players.length; //players.length ** edit when there are null players
    $scope.data.players[$scope.data.currentPlayer].canBuy = true;
    if ($scope.data.turnCount % ($scope.data.players.length + 1) === 0) { // players.lenght + 1
      $scope.data.masterBuilder = ($scope.data.masterBuilder + 1) % $scope.data.players.length; //players.length
      $scope.drawToMarket();
    }
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

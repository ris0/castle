app.controller('gameStats', function(kingsFavorsFactory, syncObject, $scope, $firebaseObject, gameFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      $scope.userIndex = $scope.data.players.reduce(findMyIndex, "");

      if ($scope.data.turnCount === 0) {
        $scope.data.roomCards = _.shuffle($scope.data.roomCards);
        $scope.data.bonusCards = _.shuffle($scope.data.bonusCards);
        for (var roomSize in $scope.data.roomTiles) {
          $scope.data.roomTiles[roomSize] = _.shuffle($scope.data.roomTiles[roomSize]);
        }
        $scope.drawToMarket();
      }

      numberPlayers = $scope.data.players.length;
    });

  //add scoring
  $scope.buy = function(room, price) {
    //validate player === currentplayer
    if (getCurrentPlayer().canBuy) {
      var truePrice = +price - (+room.room.discount);
      cashFlow(price, truePrice);
      scoreRoom(room.room);
      roomToPlayer(room, price);
      //calculate score
      getCurrentPlayer().canBuy = false;
      $scope.done();
    } else console.log("It's not your turn");
    //completions
  };

  $scope.completionBonus = function() {
    if (getCurrentPlayer().completionQueue.length === 0) $scope.done();
  };

  $scope.pass = function() {
    if ($scope.userIndex === $scope.data.currentPlayer) {
      getCurrentPlayer().canBuy = false;
      getCurrentPlayer().cashMoney += 5000;
      $scope.done();
    } else console.log("It's not your turn");
  };

  $scope.done = function() {
    $scope.data.turnCount++;
    $scope.data.currentPlayer = ($scope.data.turnCount) % numberPlayers; //players.length ** edit when there are null players
    if ($scope.data.turnCount % (numberPlayers + 1) !== 0) getCurrentPlayer().canBuy = true;
    if ($scope.data.turnCount % (numberPlayers + 1) === 0) { // players.lenght + 1
      $scope.data.masterBuilder = ($scope.data.masterBuilder + 1) % numberPlayers; //players.length
      $scope.drawToMarket();
    }

    kingsFavorsFactory.rank(kingsFavorsFactory.mostTypeRooms($scope.data, 'Activity'));
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

  function getMasterBuilder(){
  	return $scope.data.players[$scope.data.masterBuilder];
  }


  function getCurrentPlayer(){
  	return $scope.data.players[$scope.data.currentPlayer];
  }

  //transfer cash from currentplayer to masterbuilder or 'bank'
  function cashFlow(price, truePrice) {
    getCurrentPlayer().cashMoney -= truePrice;
    console.log($scope.data.currentPlayer !== $scope.data.masterBuilder);
    if ($scope.data.currentPlayer !== $scope.data.masterBuilder) {
    	console.log("trying to pay");
    	getMasterBuilder().cashMoney += +price;
    }
  }

  //send room from deck to player castle
  function roomToPlayer(room, price) {
    room.room.discount = 0;
    getCurrentPlayer().castle.push(room.room);
    $scope.data.market[price].room = "empty";
  }

  function scoreRoom(room) {
    getCurrentPlayer().publicScore.roomPts += room.placementPts;
    if (room.roomType === "Downstairs") {
      if (!getCurrentPlayer().globalEffects) getCurrentPlayer().globalEffects = [];
      getCurrentPlayer().globalEffects.push({ roomType: room.affectedBy[0], effectPts: room.effectPts });
    }
  }

  function findMyIndex(prev, curr, index) {
    if (gameFactory.auth().$getAuth().uid === curr.userID) {
      return index;
    }
    return prev;
  }
});

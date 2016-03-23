app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      gameStateFactory.setGame($scope.data);
      angular.extend($scope, gameStateFactory);
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
    //rank kings favors
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

  // $scope.buy = function(room, price) {
  //   //validate player === currentplayer
  //   if (getCurrentPlayer().canBuy) {
  //     var truePrice = +price - (+room.discount);

  //     cashFlow(price, truePrice);
  //     scoreRoom(room);
  //     roomToPlayer(room, price);
  //     getCurrentPlayer().canBuy = false;
  //     //completion bonus instead of done
  //     $scope.done();
  //   } else console.log("It's not your turn");
  //   //completions
  // };

  // function completionBonus() {
  //   if (!getCurrentPlayer().completionQueue) $scope.done();
  //   //else do all the stuff
  // }

  // $scope.pass = function() {
  //   if ($scope.userIndex === $scope.data.currentPlayer) {
  //     getCurrentPlayer().canBuy = false;
  //     getCurrentPlayer().cashMoney += 5000;
  //     $scope.done();
  //   } else console.log("It's not your turn");
  // };

  // $scope.done = function() {
  //   //check if roomCards is empty
  //   $scope.data.turnCount++;
  //   $scope.data.currentPlayer = ($scope.data.turnCount) % numberPlayers; //players.length ** edit when there are null players
  //   if ($scope.data.turnCount % (numberPlayers + 1) !== 0) getCurrentPlayer().canBuy = true;
  //   if ($scope.data.turnCount % (numberPlayers + 1) === 0) { // players.lenght + 1
  //     $scope.data.masterBuilder = ($scope.data.masterBuilder + 1) % numberPlayers; //players.length
  //     $scope.drawToMarket();
  //   }
  // };

  // $scope.drawToMarket = function() {
  //   for (var price in $scope.data.market) {
  //     var currentPrice = $scope.data.market[price];
  //     if (currentPrice.room !== 'empty') currentPrice.room.discount += 1000;
  //     while (currentPrice.room === 'empty') {
  //       var nextCard;
  //       if ($scope.data.roomCards) nextCard = $scope.data.roomCards.pop();
  //       //********************draw from discard. how to verify?

  //       if (typeof nextCard === 'number') { //if the next card in the pile is a room card
  //         if ($scope.data.roomTiles[nextCard]) currentPrice.room = $scope.data.roomTiles[nextCard].pop();
  //       } else currentPrice.room = nextCard; //if the next card in the pile is a tile
  //       discardCard(nextCard);
  //     }
  //   }
  // };

  // function getMasterBuilder() {
  //   return $scope.data.players[$scope.data.masterBuilder];
  // }


  // function getCurrentPlayer() {
  //   return $scope.data.players[$scope.data.currentPlayer];
  // }

  // //transfer cash from currentplayer to masterbuilder or 'bank'
  // function cashFlow(price, truePrice) {
  //   getCurrentPlayer().cashMoney -= truePrice;
  //   if ($scope.data.currentPlayer !== $scope.data.masterBuilder) {
  //     getMasterBuilder().cashMoney += +price;
  //   }
  // }

  // //send room from deck to player castle
  // function roomToPlayer(room, price) {
  //   room.discount = 0;
  //   getCurrentPlayer().castle.push(room);
  //   $scope.data.market[price].room = "empty";
  // }

  // function scoreRoom(room) {
  //   getCurrentPlayer().publicScore.roomPts += room.placementPts;
  //   if (room.roomType === "Downstairs") {
  //     if (!getCurrentPlayer().globalEffects) getCurrentPlayer().globalEffects = [{ roomType: room.affectedBy[0], effectPts: room.effectPts }];
  //     else getCurrentPlayer().globalEffects.push({ roomType: room.affectedBy[0], effectPts: room.effectPts });
  //   }
  //   //scoring global effects
  //   if (getCurrentPlayer().globalEffects) {
  //     getCurrentPlayer().globalEffects.forEach(function() {
  //     	//iterate through castle and apply points;
  //     });
  //   }

  //   //keep track of room points on roomTile object
  // }

  // function findMyIndex(prev, curr, index) {
  //   if (gameFactory.auth().$getAuth().uid === curr.userID) {
  //     return index;
  //   }
  //   return prev;
  // }

  // function discardCard(nextCard) {
  //   if (!$scope.data.discardRooms) $scope.data.discardRooms = [nextCard];
  //   else $scope.data.discardRooms.push(nextCard);
  // }
});

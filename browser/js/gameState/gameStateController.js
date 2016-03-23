app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      gameStateFactory.setGame($scope.data);
      angular.extend($scope, gameStateFactory);
      // $scope.userIndex = $scope.data.players.reduce(findMyIndex, "");
      // numberPlayers = $scope.data.players.length;

      //shuffle decks on first turn
      // if ($scope.data.turnCount === 0) {
      //   var numRoomCards = numberPlayers * 11;
      //   var numFavors = Math.max(numberPlayers, 3);
      //   var numTileMult = (numberPlayers - 4);

      //   $scope.data.roomCards = _.shuffle($scope.data.roomCards).slice(0, numRoomCards);
      //   $scope.data.bonusCards = _.shuffle($scope.data.bonusCards);
      //   for (var roomSize in $scope.data.roomTiles) {
      //     var toRemove = $scope.data.roomTiles[roomSize].length;
      //     if (typeof roomSize === 'number' && numTileMult < 0) toRemove = (roomSize < 350) ? 1 * numTileMult : 2 * numTileMult;
      //     $scope.data.roomTiles[roomSize] = _.shuffle($scope.data.roomTiles[roomSize]).slice(0, toRemove);
      //   }
      //   $scope.data.kingsFavors = _.shuffle($scope.data.kingsFavors).slice(0, numFavors);
      //   $scope.drawToMarket();
      // }
    });

  //add scoring
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

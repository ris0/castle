app.factory('gameStateFactory', function(gameFactory, $rootScope){
	var gameState = {};
	var numberPlayers;
	var currentPlayer;
	var masterBuilder;
	var game;

	gameState.setGame = function(theGame){
	    game = theGame;
	    gameState.userIndex = game.players.reduce(findMyIndex, "");
	    numberPlayers = game.players.length;
	};

	gameState.buy = function(room, price) {
	  //validate player === currentplayer
	  console.log('player', getCurrentPlayer());
	  if (getCurrentPlayer().canBuy) {
	    var truePrice = +price - (+room.discount);

	    cashFlow(price, truePrice);
	    scoreRoom(room);
	    roomToPlayer(room, price);
	    getCurrentPlayer().canBuy = false;
	    //completion bonus instead of done
	    gameState.done();
	  } else console.log("It's not your turn");
	  //completions
	};

	function completionBonus() {
	  if (!getCurrentPlayer().completionQueue) gameState.done();
	  //else do all the stuff
	}

	gameState.pass = function() {
	  if (gameState.userIndex === game.currentPlayer) {
	    getCurrentPlayer().canBuy = false;
	    getCurrentPlayer().cashMoney += 5000;
	    gameState.done();
	  } else console.log("It's not your turn");
	};

	gameState.done = function() {
	  //check if roomCards is empty
	  game.turnCount++;
	  game.currentPlayer = (game.turnCount) % numberPlayers; //players.length ** edit when there are null players
	  if (game.turnCount % (numberPlayers + 1) !== 0) getCurrentPlayer().canBuy = true;
	  if (game.turnCount % (numberPlayers + 1) === 0) { // players.lenght + 1
	    game.masterBuilder = (game.masterBuilder + 1) % numberPlayers; //players.length
	    gameState.drawToMarket();
	  }

	};

	gameState.drawToMarket = function() {
	  for (var price in game.market) {
	    var currentPrice = game.market[price];
	    if (currentPrice.room !== 'empty') currentPrice.room.discount += 1000;
	    while (currentPrice.room === 'empty') {
	      var nextCard;
	      if (game.roomCards) nextCard = game.roomCards.pop();
	      //********************draw from discard. how to verify?

	      if (typeof nextCard === 'number') { //if the next card in the pile is a room card
	        if (game.roomTiles[nextCard]) currentPrice.room = game.roomTiles[nextCard].pop();
	      } else currentPrice.room = nextCard; //if the next card in the pile is a tile
	      discardCard(nextCard);
	    }
	  }
	};

	function getMasterBuilder() {
	  return game.players[game.masterBuilder];
	}


	function getCurrentPlayer() {
	  console.log(game.currentPlayer);
	  return game.players[game.currentPlayer];
	}

	//transfer cash from currentplayer to masterbuilder or 'bank'
	function cashFlow(price, truePrice) {
	  getCurrentPlayer().cashMoney -= truePrice;
	  if (game.currentPlayer !== game.masterBuilder) {
	    getMasterBuilder().cashMoney += +price;
	  }
	}

	//send room from deck to player castle
	function roomToPlayer(room, price) {
	  room.discount = 0;
	  getCurrentPlayer().castle.push(room);
	  game.market[price].room = "empty";
	}

	function scoreRoom(room) {
	  getCurrentPlayer().publicScore.roomPts += room.placementPts;
	  if (room.roomType === "Downstairs") {
	    if (!getCurrentPlayer().globalEffects) getCurrentPlayer().globalEffects = [{ roomType: room.affectedBy[0], effectPts: room.effectPts }];
	    else getCurrentPlayer().globalEffects.push({ roomType: room.affectedBy[0], effectPts: room.effectPts });
	  }
	  //scoring global effects
	  if (getCurrentPlayer().globalEffects) {
	    getCurrentPlayer().globalEffects.forEach(function() {
	        //iterate through castle and apply points;
	    });
	  }
	  //keep track of room points on roomTile object
	}

	function findMyIndex(prev, curr, index) {
	  if (gameFactory.auth().$getAuth().uid === curr.userID) {
	    return index;
	  }
	  return prev;
	}

	function discardCard(nextCard) {
	  if (!game.discardRooms) game.discardRooms = [nextCard];
	  else game.discardRooms.push(nextCard);
	}

	return gameState;
});
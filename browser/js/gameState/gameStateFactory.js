app.factory('gameStateFactory', function(gameFactory, $rootScope, kingsFavorsFactory) {
  var gameState = {};
  var currentPlayer;
  var masterBuilder;
  var user = gameFactory.auth().$getAuth().uid;

  gameState.getUserObj = function(game){
  	var userObj;
  	game.players.forEach(function(player){
  		if(user === player.userID) userObj = player;
  	});
  	return userObj;
  };

  gameState.getUserIndex = function(game) {
    console.log('players', game.players);
    return game.players.reduce(findMyIndex, "");
  };

  gameState.done = function(game) {
    var numberPlayers = game.players.length;
    game.turnCount++;

    if(numberPlayers > 1){
      game.currentPlayer = (game.turnCount) % numberPlayers;

      //master builder buying turn
      if (game.turnCount % (numberPlayers + 1) !== 0) {
        getCurrentPlayer(game).canBuy = true;
      }

      //master builder gameState turn
      if (game.turnCount % (numberPlayers + 1) === 0) {
        if (!game.roomCards) endGame(game);
        else {
          game.masterBuilder = (game.masterBuilder + 1) % numberPlayers;
          gameState.drawToMarket(game);
        }
      }
      kingsFavorsFactory.getRankings(game);
    } else if(numberPlayers === 1){
      if(!game.roomCards) endGame(game);
      gameState.drawToMarket(game);
      game.players[0].canBuy = true;
    }
  };

  gameState.drawToMarket = function(game) {
    for (var price in game.market) {
      var currentPrice = game.market[price];
      if(game.players.length === 1) currentPrice.room = 'empty';
      if (currentPrice.room !== 'empty') currentPrice.room.discount += 1000;
      while (currentPrice.room === 'empty') {
        var nextCard;
        if (game.roomCards) nextCard = game.roomCards.pop();
        else {
          game.discardRooms = _.shuffle(game.discardRooms);
          nextCard = game.discardRoom.pop();
        }
        //********************draw from discard. how to verify?

        if (typeof nextCard === 'number') { //if the next card in the pile is a room card
          if (game.roomTiles[nextCard]) currentPrice.room = game.roomTiles[nextCard].pop();
        } else currentPrice.room = nextCard; //if the next card in the pile is a tile
        discardCard(game, nextCard);
      }
    }
  };

  function findMyIndex(prev, curr, index) {
    if (user === curr.userID) {
      console.log(user);
      console.log(index);
      return index;
    }
    return prev;
  }

  function getCurrentPlayer(game){
    return  game.players[game.currentPlayer];
  }

  function endGame(game) {
    $.jGrowl('the game is over!');
  }

  function discardCard(game, nextCard) {
    if (!game.discardRooms) game.discardRooms = [nextCard];
    else game.discardRooms.push(nextCard);
  }

  return gameState;
});

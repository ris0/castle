app.factory('gameStateFactory', function(gameFactory, $rootScope, kingsFavorsFactory) {
  var gameState = {};
  var currentPlayer;
  var masterBuilder;

  gameState.getUserIndex = function(game) {
    return game.players.reduce(findMyIndex, "");
  };

  function findMyIndex(prev, curr, index) {
    if (gameFactory.auth().$getAuth().uid === curr.userID) {
      return index;
    }
    return prev;
  }

  function getCurrentPlayer(game){
    return  game.players[game.currentPlayer];
  }

  gameState.done = function(game) {
    var numberPlayers;
    numberPlayers = game.players.length;
    game.turnCount++;
    game.currentPlayer = (game.turnCount) % numberPlayers;

    //master builder buying turn
    if (game.turnCount % (numberPlayers + 1) !== 0) {
      getCurrentPlayer(game).canBuy = true;
      if (game.roomCards.length <= game.players.length) {
        game.lastTurn = true;
      }
    }

    //master builder gameState turn
    if (game.turnCount % (numberPlayers + 1) === 0) {
      if (game.lastTurn) endGame(game);
      else {
        game.masterBuilder = (game.masterBuilder + 1) % numberPlayers;
        gameState.drawToMarket(game);
      }
    }
    kingsFavorsFactory.getRankings(game);
  };

  gameState.drawToMarket = function(game) {
    for (var price in game.market) {
      var currentPrice = game.market[price];
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

  function endGame(game) {
    console.log("the game is over");
    //final scoring
    //determine winner
  }

  function discardCard(game, nextCard) {
    if (!game.discardRooms) game.discardRooms = [nextCard];
    else game.discardRooms.push(nextCard);
  }

  return gameState;
});

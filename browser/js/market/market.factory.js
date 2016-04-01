
//add scoring factory
app.factory('marketFactory', function(bonusCardsFactory, gameStateFactory, scoringFactory, completionFactory) {
  var market = {};

  market.swapMarket = function(price1, price2) {
    var temp = price1.room;
    price1.room = price2.room;
    price2.room = temp;
    return true;
  };

  market.try = function(game, room) {
    getCurrentPlayer(game).castle.push(room);
  };

  market.untry = function(game, room) {
    room.price = null;
    _.remove(getCurrentPlayer(game).castle, function(castleRoom) {
      return castleRoom.roomName === room.roomName;
    });
  };

  market.buy = function(game) {
    var res = {};
    if (getCurrentPlayer(game).canBuy) {
      var newRooms = getCurrentPlayer(game).castle.reduce(function(collection, castleRoom) {
        if (!castleRoom.final) collection.push(castleRoom);
        return collection;
      }, []);

      if (newRooms.length === 0) {
        market.pass(game);
        res.message = "Passing, +$5000";
      }
      else if (newRooms.length === 1) {
        var newRoom = newRooms[0];
        var truePrice = +newRoom.price - (+newRoom.discount);
        if(getCurrentPlayer(game).cashMoney < truePrice) res.message = "Not enough $$$";
        if(newRoom.roomName === "Stairs" || newRoom.roomName === "Hallway"){
          scoringFactory.scoreRoom(game, getCurrentPlayer(game), newRoom);

          cashFlow(game, newRoom.price, truePrice);

          newRoom.final = true;
          game.roomTiles[newRoom.roomName].shift();
          bonusCardsFactory.getBonusPoints(getCurrentPlayer(game));
          getCurrentPlayer(game).canBuy = false;
          completionFactory.assessCompletion(game);
          res.message = "Buying the " + newRoom.roomName;
          res.roomName = newRoom.roomName.slice(0,-1);
        } else{
          scoringFactory.scoreRoom(game, getCurrentPlayer(game), newRoom);

          cashFlow(game, newRoom.price, truePrice);
          roomToPlayer(game, newRoom, newRoom.price);
          bonusCardsFactory.getBonusPoints(getCurrentPlayer(game));
          getCurrentPlayer(game).canBuy = false;
          completionFactory.assessCompletion(game);
          res.message =  "Buying the " + newRoom.roomName;
        }
      } else {
        res.message = "You can't add more than one room!";
      }
    } else res.message = "It's not your turn";

    return res;
  };

  market.pass = function(game) {
    if (getCurrentPlayer(game).canBuy) {
      getCurrentPlayer(game).canBuy = false;
      getCurrentPlayer(game).cashMoney += 5000;
      gameStateFactory.done(game);
    }
  };

  function getMasterBuilder(game) {
    return game.players[game.masterBuilder];
  }


  function getCurrentPlayer(game) {
    return game.players[game.currentPlayer];
  }

  //transfer cash from currentplayer to masterbuilder or 'bank'
  function cashFlow(game, price, truePrice) {
    getCurrentPlayer(game).cashMoney -= truePrice;
    if(game.players.length === 1) return;
    else {
      if (game.currentPlayer !== game.masterBuilder) {
      getMasterBuilder(game).cashMoney += +price;
      }
    }
  }

  //send room from deck to player castle
  function roomToPlayer(game, room, price) {
    console.log("price", price);
    room.discount = 0;
    room.final = true;
    getCurrentPlayer(game).castle.push(room);
    game.market[price].room = "empty";
    game.market[price].trying = false;
  }

  return market;
});
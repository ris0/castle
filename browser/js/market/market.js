app.directive('market', function($rootScope, $firebaseObject, gameFactory, gameStateFactory, marketFactory) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/market/market.html',
    link: function(scope) {
      var userID = gameFactory.auth().$getAuth().uid;
      var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
      userGame.$loaded().then(function(data) {
        return data.$value;
      }).then(function(game) {
        return $firebaseObject(gameFactory.ref().child('games').child(game));
      }).then(function(syncObject) {
        return syncObject.$bindTo(scope, 'data');
      }).then(function(game) {
        scope.userIndex = gameStateFactory.getUserIndex(scope.data);

        scope.buy = function() {
          var buyError=marketFactory.buy(scope.data);
          if(buyError) $.jGrowl(buyError, {themeState: 'highlight'});
        };

        scope.tryCorridor = function(type){
          var corridor = scope.data.roomTiles[type][0];
          corridor.price = 3000;
          market.try(scope.data, corridor);
        };

        scope.untryCorridor = function(type){
          var corridor = scope.data.roomTiles[type][0];
          market.untry(scope.data, corridor);
        }

        scope.try = function(room, price) {
          room.trying = true;
          room.room.price = price;
          marketFactory.try(scope.data, room.room);
        };

        scope.untry = function(room) {
          room.trying = false;
          marketFactory.untry(scope.data, room.room);
        };

        scope.pass = function() {
          marketFactory.pass(scope.data);
        };

        scope.done = function() {
          gameStateFactory.done(scope.data);
        };

        scope.drawToMarket = function() {
          gameStateFactory.drawToMarket(scope.data);
        };

        if (scope.data.turnCount === 0 && scope.data.market[1000].room === "empty") scope.drawToMarket();

        var firstChoice = null;

        scope.swapTwo = function(price) {
          if(!scope.data.players[scope.userIndex].canBuy && scope.data.masterBuilder === scope.userIndex){
            if (firstChoice) {
              marketFactory.swapMarket(firstChoice, price);
              firstChoice = null;
            } else {
              firstChoice = price;
            }
          }
        };

      });
    }
  };
});


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

    if (getCurrentPlayer(game).canBuy) {

      var newRooms = getCurrentPlayer(game).castle.reduce(function(collection, castleRoom) {
        if (!castleRoom.final) collection.push(castleRoom);
        return collection;
      }, []);

      if (newRooms.length === 0) {
        console.log('passing');
        market.pass(game);
      }
      else if (newRooms.length === 1) {
        var newRoom = newRooms[0];
        var truePrice = +newRoom.price - (+newRoom.discount);
        if(getCurrentPlayer(game).cashMoney < truePrice) return "Not enough $$$";

        scoringFactory.scoreRoom(game, getCurrentPlayer(game), newRoom);
        cashFlow(game, newRoom.price, truePrice);
        roomToPlayer(game, newRoom, newRoom.price);
        bonusCardsFactory.getBonusPoints(getCurrentPlayer(game));
        getCurrentPlayer(game).canBuy = false;
        completionFactory.assessCompletion(game);
      } else {
        console.log('too many');
        return "You can't add more than one room!";
      }
    } else console.log("It's not your turn");
  };

  market.pass = function(game) {
    if (getCurrentPlayer(game).canBuy) {
      getCurrentPlayer(game).canBuy = false;
      getCurrentPlayer(game).cashMoney += 5000;
      gameStateFactory.done(game);
    } else console.log("It's not your turn");
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
    if (game.currentPlayer !== game.masterBuilder) {
      getMasterBuilder(game).cashMoney += +price;
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


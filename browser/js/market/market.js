app.directive('market', function($rootScope, $firebaseObject, gameFactory, gameStateFactory, marketFactory) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/market/market.html',
    link: function(scope) {
      var userID = gameFactory.auth().$getAuth().uid;
      var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
      return userGame.$loaded().then(function(data) {
        return data.$value;
      }).then(function(game) {
        return $firebaseObject(gameFactory.ref().child('games').child(game));
      }).then(function(syncObject) {
        return syncObject.$bindTo(scope, 'data');
      }).then(function(game) {
        scope.userIndex = gameStateFactory.getUserIndex(scope.data);

        scope.buy = function(room, price) {
          marketFactory.buy(scope.data, room, price);
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
app.factory('marketFactory', function(bonusCardsFactory, gameStateFactory, scoringFactory) {
  var market = {};

  market.swapMarket = function(price1, price2) {
    var temp = price1.room;
    price1.room = price2.room;
    price2.room = temp;
    return true;
  };

  market.buy = function(game, room, price) {
    if (getCurrentPlayer(game).canBuy) {
      var truePrice = +price - (+room.discount);

      cashFlow(game, price, truePrice);
      scoringFactory.scoreRoom(game, getCurrentPlayer(game), room);
      // scoreRoom(game, room);
      roomToPlayer(game, room, price);
      bonusCardsFactory.getBonusPoints(getCurrentPlayer(game));
      getCurrentPlayer(game).canBuy = false;
      //completion bonus instead of done
      gameStateFactory.done(game);
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
    room.discount = 0;
    getCurrentPlayer(game).castle.push(room);
    game.market[price].room = "empty";
  }

  return market;
});


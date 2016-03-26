// app.directive('market', function($rootScope, $firebaseObject, gameFactory, gameStateFactory, marketFactory) {

//   return {
//     restrict: 'E',
//     scope: {},
//     templateUrl: 'js/market/market.html',
//     link: function(scope) {
//       var userID = gameFactory.auth().$getAuth().uid;
//       var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
//       return userGame.$loaded().then(function(data) {
//         return data.$value;
//       }).then(function(game) {
//         return $firebaseObject(gameFactory.ref().child('games').child(game));
//       }).then(function(syncObject) {
//         return syncObject.$bindTo(scope, 'data');
//       }).then(function(game) {
//         console.log(scope.data);
//         scope.userIndex = gameStateFactory.getUserIndex(scope.data);

//         scope.buy = function(room, price) {
//           marketFactory.buy(scope.data, room, price);
//         };

//         scope.pass = function() {
//           marketFactory.pass(scope.data);
//         };

//         //availability on scope? only for masterbuilder market turn
//         scope.done = function() {
//           marketFactory.done(scope.data);
//         };

//         scope.drawToMarket = function() {
//           marketFactory.drawToMarket(scope.data);
//         };

//         if (scope.data.turnCount === 0 && scope.data.market[1000].room === "empty") scope.drawToMarket();

//         var firstChoice = null;

//         scope.swapTwo = function(price) {
//           if(!scope.data.players[scope.userIndex].canBuy && scope.data.masterBuilder === scope.userIndex){
//             if (firstChoice) {
//               marketFactory.swapMarket(firstChoice, price);
//               firstChoice = null;
//             } else {
//               firstChoice = price;
//             }
//           }
//         };

//       });
//     }
//   };
// });


// //add scoring factory
// app.factory('marketFactory', function(kingsFavorsFactory, bonusCardsFactory) {
//   var market = {};

//   market.swapMarket = function(price1, price2) {
//     var temp = price1.room;
//     price1.room = price2.room;
//     price2.room = temp;
//     return true;
//   };

//   market.buy = function(game, room, price) {
//     if (getCurrentPlayer(game).canBuy) {
//       var truePrice = +price - (+room.discount);

//       cashFlow(game, price, truePrice);
//       scoreRoom(game, room);
//       roomToPlayer(game, room, price);
//       bonusCardsFactory.getBonusPoints(getCurrentPlayer(game));
//       getCurrentPlayer(game).canBuy = false;
//       //completion bonus instead of done
//       market.done(game);
//     } else console.log("It's not your turn");
//   };

//   market.pass = function(game) {
//     if (getCurrentPlayer(game).canBuy) {
//       getCurrentPlayer(game).canBuy = false;
//       getCurrentPlayer(game).cashMoney += 5000;
//     } else console.log("It's not your turn");
//   };

//   market.done = function(game) {
//     var numberPlayers;
//     numberPlayers = game.players.length;
//     game.turnCount++;
//     getCurrentPlayer(game);
//     game.currentPlayer = (game.turnCount) % numberPlayers;

//     //master builder buying turn
//     if (game.turnCount % (numberPlayers + 1) !== 0) {
//       getCurrentPlayer(game).canBuy = true;
//       if (game.roomCards.length <= game.players.length) {
//         game.lastTurn = true;
//       }
//     }

//     //master builder market turn
//     if (game.turnCount % (numberPlayers + 1) === 0) {
//       if (game.lastTurn) endGame(game);
//       else {
//         game.masterBuilder = (game.masterBuilder + 1) % numberPlayers;
//         market.drawToMarket(game);
//       }
//     }
//     kingsFavorsFactory.getRankings(game);
//   };

//   market.drawToMarket = function(game) {
//     for (var price in game.market) {
//       var currentPrice = game.market[price];
//       if (currentPrice.room !== 'empty') currentPrice.room.discount += 1000;
//       while (currentPrice.room === 'empty') {
//         var nextCard;
//         if (game.roomCards) nextCard = game.roomCards.pop();
//         else {
//           game.discardRooms = _.shuffle(game.discardRooms);
//           nextCard = game.discardRoom.pop();
//         }
//         //********************draw from discard. how to verify?

//         if (typeof nextCard === 'number') { //if the next card in the pile is a room card
//           if (game.roomTiles[nextCard]) currentPrice.room = game.roomTiles[nextCard].pop();
//         } else currentPrice.room = nextCard; //if the next card in the pile is a tile
//         discardCard(game, nextCard);
//       }
//     }
//   };

//   function assessCompletions(game) {
//     if (!getCurrentPlayer(game).completionBonus) done();
//   }

//   function endGame(game) {
//     //final scoring
//     //determine winner
//   }

//   //add completion Bonus Factory
//   function completionBonus(game) {
//     if (!getCurrentPlayer(game).completionQueue) market.done(game);
//     //else do all the stuff
//   }

//   function getMasterBuilder(game) {
//     return game.players[game.masterBuilder];
//   }


//   function getCurrentPlayer(game) {
//     return game.players[game.currentPlayer];
//   }

//   //transfer cash from currentplayer to masterbuilder or 'bank'
//   function cashFlow(game, price, truePrice) {
//     getCurrentPlayer(game).cashMoney -= truePrice;
//     if (game.currentPlayer !== game.masterBuilder) {
//       getMasterBuilder(game).cashMoney += +price;
//     }
//   }

//   //send room from deck to player castle
//   function roomToPlayer(game, room, price) {
//     room.discount = 0;
//     getCurrentPlayer(game).castle.push(room);
//     game.market[price].room = "empty";
//   }

//   //scoring factory
//   function scoreRoom(game, room) { //adjacent rooms, connectedRooms
//     getCurrentPlayer(game).publicScore.roomPts += room.placementPts;

//     if (getCurrentPlayer(game).globalEffects) {
//       getCurrentPlayer(game).globalEffects.forEach(function(effect) {
//         if (room.roomType === effect.roomType) getCurrentPlayer(game).publicScore.roomPts += +effect.effectPts;
//       });
//     }

//     //adding global effects to player
//     if (room.roomType === "Downstairs") {
//       if (!getCurrentPlayer(game).globalEffects) getCurrentPlayer(game).globalEffects = [{ roomType: room.affectedBy[0], effectPts: room.effectPts }];
//       else getCurrentPlayer(game).globalEffects.push({ roomType: room.affectedBy[0], effectPts: room.effectPts });
//       getCurrentPlayer(game).castle.forEach(function(castleRoom) {
//         room.affectedBy.forEach(function(type) {
//           if (type === castleRoom.roomType) getCurrentPlayer(game).publicScore.roomPts += room.effectPts;
//         });
//       });
//     }

//     //keep track of room points on roomTile object
//   }

//   function discardCard(game, nextCard) {
//     if (!game.discardRooms) game.discardRooms = [nextCard];
//     else game.discardRooms.push(nextCard);
//   }
//   return market;
// });

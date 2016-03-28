app.factory('completionFactory', function(BonusModalFactory, gameStateFactory, CompletionModalFactory) {
  var completion = {};
  var savedGame;

  completion.assessCompletion = function(game) {
    if (!game.players[game.currentPlayer].completionBonus) gameStateFactory.done(game);
    else CompletionModalFactory.open(game.currentPlayer);
  };

  completion.Activity = function(player, game) {
    game.players[game.currentPlayer].publicScore.roomPts += 5;
  };

  completion.Outdoor = function(player, game) {
    game.players[game.currentPlayer].cashMoney += 10000;
  };

  completion.Food = function(player, game) {
    game.players[game.currentPlayer].canBuy = true;
  };

  completion.Utility = function(player, game) {
    var bonuses = [];
    for (var i = 0; i < 2; i++) {
      bonuses.push(game.bonusCards.pop());
    }
    BonusModalFactory.open(bonuses, player);
  };

  completion.Corridor = function(player, game) {
    game.players[game.currentPlayer].canBuyCorridors = true;
  };

  completion.Sleep = function(game, tile, num) {
    for (var i = 0; i < num; i++) {
      game.roomCards.push(game.roomTiles[tile].pop());
    }
  };

  completion.Living = function(player, game, room) {
    game.players[game.currentPlayer].publicScore.livingRoomBonusPts += room.scoredPoints;
  };

  completion.Downstairs = function(player, game, type) {
    //how to check for every two?
    game.players[game.currentPlayer].completionBonus.push(type);
  };

  return completion;
});

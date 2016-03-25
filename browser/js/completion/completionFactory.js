app.factory('completionFactory', function(BonusModalFactory, gameStateFactory, CompletionModalFactory) {
  var completion = {};

  completion.assessCompletion = function(player, currentPlayerIndex, game) {
    if (!player.completionBonus) gameStateFactory.done(game);
    else CompletionModalFactory.open(currentPlayerIndex);
  };

  completion.Activity = function(player) {
    player.publicScore.roomPts += 5;
  };

  completion.Outdoor = function(player) {
    player.cashMoney += 10000;
  };

  completion.Food = function(player) {
    player.canBuy = true;
  };

  completion.Utility = function(player, game) {
    //draw bonus cards;
    var bonuses = [];
    for (var i = 0; i < 2; i++) {
      bonuses.push(game.bonusCards.pop());
    }

    BonusModalFactory.open(bonuses, player);
  };

  completion.Corridor = function(player) {
    player.canBuyCorridors = true;
  };

  completion.Living = function(player, room) {
    player.publicScore.livingRoomBonusPts += room.scoredPoints;
  };

  completion.Sleep = function(game, tile, num) {
    //input type of tile and # to draw
    for (var i = 0; i < num; i++) {
      game.roomCards.push(game.roomTiles[tile].pop());
    }
  };

  completion.Downstairs = function(player, type) {
    //how to check for every two?
    player.completionBonus.push(type);
  };

  return completion;
});

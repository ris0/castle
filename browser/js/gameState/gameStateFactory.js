app.factory('gameStateFactory', function(gameFactory, $rootScope) {
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

  return gameState;
});

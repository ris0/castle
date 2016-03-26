app.factory('gameStateFactory', function(gameFactory, $rootScope) {
  var gameState = {};
  var currentPlayer;
  var masterBuilder;
  var user = gameFactory.auth().$getAuth().uid;

  gameState.getUserObj = function(game){
  	var userObj;
  	game.players.forEach(function(player){
  		if(user === player.userID) userObj = player;
  	})
  	return userObj;
  }

  gameState.getUserIndex = function(game) {
    return game.players.reduce(findMyIndex, "");
  };

  function findMyIndex(prev, curr, index) {
    if (user === curr.userID) {
      return index;
    }
    return prev;
  }

  return gameState;
});

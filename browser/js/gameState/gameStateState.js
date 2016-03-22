app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game-stats',
		templateUrl: 'js/gameState/gameStateState.html',
		controller: "gameStats",
		resolve: {
			syncObject: function(gameFactory,$firebaseObject){
				var userID = gameFactory.auth().$getAuth().uid;
				var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
				return userGame.$loaded().then(function(data){
	  				return data.$value;
	  			}).then(function(game){
	  				return $firebaseObject(gameFactory.ref().child('games').child(game));
	  			}).then(function(syncObject){
	  				return syncObject;
	  			});
			}
		}
	});
});
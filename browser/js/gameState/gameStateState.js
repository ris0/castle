app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game-stats',
		templateUrl: 'views/gameboard/gridtesting.html',
		controller: "gameStats",
		resolve: {
			userId: function(gameFactory){
				return gameFactory.auth().$getAuth().uid;
			},
			syncObject: function(gameFactory,$firebaseObject){
				var userID = gameFactory.auth().$getAuth().uid;
				var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
				return userGame.$loaded().then(function(data){
					console.log(data);
	  				return data.$value;
	  			}).then(function(game){
	  				console.log(game);
	  				return $firebaseObject(gameFactory.ref().child('games').child(game));
	  			}).then(function(syncObject){
	  				return syncObject;
	  			});
			}
		}
	});
});
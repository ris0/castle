app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game-stats/:gameId',
		templateUrl: 'views/gameboard/gridtesting.html',
		controller: "gameStats",
		resolve: {
			userId: function(gameFactory){
				return gameFactory.auth().$getAuth().uid;
			},
			syncObject: function(gameFactory,$firebaseArray,$firebaseObject,$stateParams){
				console.log($stateParams);
				var userID = gameFactory.auth().$getAuth().uid;
				var userGames = $firebaseObject(gameFactory.ref().child('users').child(userID).child('games'));
				return userGames.$loaded().then(function(games){
					console.log(games);
					for(var game in games){
						console.log(games[game]);
						if(games[game] === $stateParams.gameId){
							return games[game];
						}
					}
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
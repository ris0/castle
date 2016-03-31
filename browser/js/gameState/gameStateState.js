app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game-stats/:gameId',
		templateUrl: 'views/gameBoard/gameBoard.html',
		controller: "gameStats",
		resolve: {
			userId: function(gameFactory){
				return gameFactory.auth().$getAuth().uid;
			},
			syncObject: function(gameFactory,$firebaseArray,$firebaseObject, $stateParams){
					return $firebaseObject(gameFactory.ref().child('games').child($stateParams.gameId))
				}
			}
		});
});
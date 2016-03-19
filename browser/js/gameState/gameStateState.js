app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game-stats',
		templateUrl: 'js/gameState/gameStateState.html',
		controller: "gameStats"
	});
});
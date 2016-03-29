app.directive('playerTurn', function(_){
	return {
		restrict: 'E',
		scope: {
			players: "=",
			currentPlayer: "=",
			masterBuilder: "=",
			userIndex: "="
		},
		templateUrl: './js/playerTurn/playerTurn.html',
		link: function(scope){
			scope._ = _;
		}
	}
})
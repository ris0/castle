app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory, BonusModalFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      $scope.userIndex = gameStateFactory.getUserIndex($scope.data);
      return $scope.userIndex;
    }).then(function(index){
      if($scope.data.turnCount === 0 && !$scope.data.players[$scope.userIndex].bonusCards) {
      	var bonusCards = [];
      	for(var i = 0; i < 3; i++){
      		bonusCards.push($scope.data.bonusCards.pop());
      	}
      	BonusModalFactory.open(bonusCards, $scope.data.players[index]);
      }

    });
});
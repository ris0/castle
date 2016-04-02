app.factory('BonusModalFactory', function($uibModal) {
  var bonusModal = {};

  bonusModal.open = function(bonuses, player, gameId) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'js/bonusCards/bonusModal.html',
      controller: 'bonusModalCtrl',
      size: 'lg',
      resolve: {
        bonuses: function() {
          return bonuses;
        },
        playerIndex: function(){
          return player;
        },
        players: function(gameFactory, $firebaseObject) {
          var gamePlayers = $firebaseObject(gameFactory.ref().child('games').child(gameId).child('players'));
          return gamePlayers.$loaded().then(function(players){
            return players;
          });
        }
      }
    });
  };


  return bonusModal;
});

app.controller('bonusModalCtrl', function($scope, $uibModalInstance, bonuses, players, playerIndex) {

  players.$bindTo($scope, 'players');
  $scope.bonuses = bonuses;
  $scope.selected = {
    bonus: $scope.bonuses[0]
  };
  var counter = 0;
  $scope.ok = function() {
    $scope.bonuses.forEach(function(bonus){
      if(bonus !== $scope.selected.bonus){
        if(!$scope.players[playerIndex].bonusCards) $scope.players[playerIndex].bonusCards = [bonus];
        else $scope.players[playerIndex].bonusCards.push(bonus);
	  	}
	  });

    $uibModalInstance.close($scope.players[playerIndex]);
  };
});

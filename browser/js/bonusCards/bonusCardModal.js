app.factory('BonusModalFactory', function($uibModal) {
  var bonusModal = {};

  bonusModal.open = function(bonuses, player) {

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
          var userID = gameFactory.auth().$getAuth().uid;
          var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
          return userGame.$loaded().then(function(data){
            return data.$value;
          }).then(function(game){
            return $firebaseObject(gameFactory.ref().child('games').child(game).child('players'));
          }).then(function(syncObject){
            return syncObject;
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
        console.log($scope.players[playerIndex]);
	  	}
	  });

    $uibModalInstance.close($scope.players[playerIndex]);
  };
});

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
        player: function() {
        	return player;
        }
      }
    });
  };

  return bonusModal;
});

app.controller('bonusModalCtrl', function($scope, $uibModalInstance, bonuses, player) {

  $scope.bonuses = bonuses;
  $scope.selected = {
    bonus: $scope.bonuses[0]
  };
  var counter = 0;
  $scope.ok = function() {
    $scope.bonuses.forEach(function(bonus){
      if(bonus !== $scope.selected.bonus){
        if(!player.bonusCards) player.bonusCards = [bonus];
        else player.bonusCards.push(bonus);
        console.log(player);
	  	}
	  });

    $uibModalInstance.close();
  };
});

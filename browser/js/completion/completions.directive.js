app.factory('CompletionModalFactory', function($uibModal) {
  var completionModal = {};

  completionModal.open = function(completions, player) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'js/completion/competions.modal.html',
      controller: 'CompletionModalCtrl',
      size: 'lg',
      resolve: {
        completions:function(){
          return completions;
        },
        player: function() {
          return player;
        }
      }
    });
  };

  return completionModal;
});

app.controller('CompletionModalCtrl', function($scope, $uibModalInstance, completions, player, completionFactory) {

  $scope.completions = completions;

  $scope.getBonus = function(type){
    completionFactory[type]();
    var ind = player.completionBonus.indexOf(type);
    player.completionBonus.splice(ind, 1);
    completionFactory.assessCompletion(player);
  };

  var counter = 0;
  $scope.ok = function() {
    $uibModalInstance.close();
  };
});

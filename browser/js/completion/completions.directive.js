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

  return completionModal;
});

app.controller('CompletionModalCtrl', function($scope, $uibModalInstance, completions, playerIndex, players, completionFactory) {

  $scope.completions = completions;

  players.$bindTo($scope, "players");

  $scope.getBonus = function(type){
    completionFactory[type]();
    var ind = $scope.players[playerIndex].completionBonus.indexOf(type);
    $scope.players[playerIndex].completionBonus.splice(ind, 1);
    completionFactory.assessCompletion($scope.players[playerIndex]);
  };

  var counter = 0;
  $scope.ok = function() {
    $uibModalInstance.close();
  };
});

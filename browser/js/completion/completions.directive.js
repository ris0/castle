app.factory('CompletionModalFactory', function($uibModal) {
  var completionModal = {};

  completionModal.open = function(player) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'js/completion/completions.modal.html',
      controller: 'CompletionModalCtrl',
      size: 'lg',
      resolve: {
        playerIndex: function() {
          return player;
        },
        game: function(gameFactory, $firebaseObject) {
          var userID = gameFactory.auth().$getAuth().uid;
          var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));
          return userGame.$loaded().then(function(data) {
            return data.$value;
          }).then(function(game) {
            return $firebaseObject(gameFactory.ref().child('games').child(game));
          }).then(function(syncObject) {
            return syncObject;
          });
        }
      }
    });
  };

  return completionModal;
});

app.controller('CompletionModalCtrl', function($scope, $uibModalInstance, playerIndex, game, completionFactory, gameStateFactory) {

  game.$bindTo($scope, "game");

  $scope.types = ["Utility", "Activity", "Outdoor", "Food", "Sleep", "Living"];

  $scope.completions = game.players[game.currentPlayer].completionBonus;

  $scope.assessCompletion = function(room, game) {
    var type = room.roomType;
    if (type === "Sleep") $scope.showSleep = true;
    else if(type === "Downstairs") {
      $scope.showDownstairs = room;
    }
    else {
      completionFactory[type](game);
      var ind = $scope.game.players[playerIndex].completionBonus.indexOf(type);
      $scope.game.players[playerIndex].completionBonus.splice(ind, 1);
      completionFactory.assessCompletion($scope.game);
      $uibModalInstance.close();
    }
  };

  $scope.sleepBonus = function() {
    completionFactory.Sleep(game, $scope.sleepTile, $scope.sleepNumber);
    $scope.showSleep = false;
  };

  $scope.downstairsBonus = function(){
    $scope.showDownstairs.roomType = $scope.downstairsType;
    completionFactory.Downstairs($scope.showDownstairs);
    $scope.showDownstairs = null;
  };

  var counter = 0;
  $scope.done = function() {
    gameStateFactory.done($scope.game);
    $uibModalInstance.close();
  };
});

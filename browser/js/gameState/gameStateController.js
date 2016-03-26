app.controller('gameStats', function(kingsFavorsFactory, syncObject, $scope, $firebaseObject, gameFactory, gameStateFactory) {
  var numberPlayers;
  var currentPlayer;
  var masterBuilder;

  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [{
      image: '',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'],
      id: 0
    }];
  var currIndex = 0;

  syncObject.$bindTo($scope, "data")
    .then(function() {
      $scope.userIndex = gameStateFactory.getUserIndex($scope.data);
      $scope.userObj = gameStateFactory.getUserObj($scope.data);
      console.log($scope.data.kingsFavors);
    });
});

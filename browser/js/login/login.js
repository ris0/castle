app.controller('LoginCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();
  $scope.usersRef = gameFactory.ref().child("users");

  $scope.signup = function() {
    $scope.error = null;

    $scope.auth.$createUser({
      email: $scope.signup.email,
      password: $scope.signup.password
    }).then(function(userData) {

        return $scope.auth.$authWithPassword({
          email: $scope.signup.email,
          password: $scope.signup.password
        })

    }).then(function() {
        $state.go('dashboard');
    }).catch(function(error) {
      $scope.error = error;
    });
  };

});
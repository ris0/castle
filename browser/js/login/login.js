app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, gameFactory) {

  $scope.auth = gameFactory.auth();

  $scope.signup = function() {
    $scope.message = null;
    $scope.error = null;

    $scope.auth.$createUser({
      email: $scope.signup.email,
      password: $scope.signup.password
    }).then(function(userData) {
        $state.go('game');
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.login = function() {
    $scope.message = null;
    $scope.error = null;

    $scope.auth.$authWithPassword({
      email: $scope.login.email,
      password: $scope.login.password
    }).then(function(userData) {
        $state.go('game');
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.logout = function(){
    $scope.auth.$unauth();
  };
});
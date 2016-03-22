app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();
  $scope.usersRef = gameFactory.ref().child("users");
  $scope.ref.onAuth(function(authData){
      if (authData) {
        $scope.usersRef.once('value', function(users){
          console.log(users.val());
          if(users[authData.uid]) return;
        })
       $scope.ref.child("users").child(authData.uid).set({
        email: authData.password.email
        });
      }
      // save the user's profile into the database so we can list users,
      // use them in Security and Firebase Rules, and show profiles
  })

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
        $state.go('lobby');
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.logout = function(){
    $scope.auth.$unauth()
  };
});
app.controller('LoginCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();
  $scope.usersRef = gameFactory.ref().child("users");
  $scope.ref.onAuth(function(authData){
      if (authData) {
        $scope.usersRef.once('value', function(users){
          console.log(users.val());
          if(users[authData.uid]) return;
        });
       $scope.ref.child("users").child(authData.uid).set({
        email: authData.password.email
        });
      }

  });

  $scope.submit = function() {
    $state.go('dashboard');
    return false;
  };


  $scope.signup = function() {
    $scope.message = null;
    $scope.error = null;

    $scope.auth.$createUser({
      email: $scope.signup.email,
      password: $scope.signup.password
    }).then(function(userData) {
        $state.go('dashboard');
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
        $state.go('dashboard');
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.logout = function(){
    $scope.auth.$unauth()
  };
});
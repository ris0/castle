app.controller('LoginCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();
  $scope.usersRef = gameFactory.ref().child("users");

  $scope.ref.onAuth(function(authData){

    if (authData) {
      $scope.usersRef.once('value', function(users){
        //console.log(users.val());
        if(users[authData.uid]) return;
      });

      $scope.ref.child("users").child(authData.uid).set({
        email: authData.password.email
      });
    }
  });


  $scope.login = function() {
    $scope.message = null;
    $scope.error = null;

    $scope.auth.$authWithPassword({
        email: $scope.signup.email,
        password: $scope.signup.password
    })
    .then(function(user) {
        console.log('Logging in as, ', user);
        $state.go('dashboard');
    })
    .catch(function(error) {
        $scope.error = error;
    });
  };


  $scope.signup = function() {
    $scope.message = null;
    $scope.error = null;

    $scope.auth.$createUser({
        email: $scope.signup.email,
        password: $scope.signup.password
    })
    .then(function(user) {
        console.log('Signing up as, ', user);
        $state.go('dashboard');
    })
    .catch(function(error) {
        $scope.error = error;
    });
  };

});



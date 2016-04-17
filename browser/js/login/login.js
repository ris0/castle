app.controller('LoginCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();
  $scope.usersRef = gameFactory.ref().child("users");

  $scope.ref.onAuth(function(authData){

    if (authData) {
      $scope.usersRef.once('value', function(users){
        if(users.val()[authData.uid]) return;
        else {
          $scope.ref.child("users").child(authData.uid).set({
            email: authData.password.email
          });
        }
      });
    }
  });


  $scope.login = function() {
    console.log('login clicked');
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
          console.log("Checking to see if Ubuntu server is corr")
          console.log('user has been created', user);
          return $scope.auth.$authWithPassword({
              email: $scope.signup.email,
              password: $scope.signup.password
          })
      })
      .then(function(authData) {
          console.log('authentication successful', authData);
          $state.go('dashboard');
      })
      .catch(function(error) {
          $scope.error = error;
      });
  };
});



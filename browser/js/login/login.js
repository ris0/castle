app.controller('LoginCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();
  $scope.usersRef = gameFactory.ref().child("users");
  $scope.isLoading = null;
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
    $scope.message = null;
    $scope.error = null;
    $scope.isLoading = true;

    $scope.auth.$authWithPassword({
        email: $scope.signup.email,
        password: $scope.signup.password
    })
    .then(function(user) {
        $scope.isLoading = null;
        $state.go('dashboard');
    })
    .catch(function(error) {
        $scope.error = error;
    });
  };


  $scope.signup = function() {
      $scope.message = null;
      $scope.error = null;
      $scope.isLoading = true;

      $scope.auth.$createUser({
          email: $scope.signup.email,
          password: $scope.signup.password
      })
      .then(function(user) {
          return $scope.auth.$authWithPassword({
              email: $scope.signup.email,
              password: $scope.signup.password
          })
      })
      .then(function(authData) {
          $scope.isLoading = null;
          $state.go('dashboard');
      })
      .catch(function(error) {
          $scope.error = error;
      });
  };
});



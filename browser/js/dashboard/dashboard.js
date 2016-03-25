app.controller('DashboardCtrl', function(usersRef, userId, syncObject, $scope, $state, $firebaseObject, gameFactory, DashboardFactory, CreateModalFactory) {

    $scope.auth = gameFactory.auth();
    $scope.isLoading;
    $scope.open = CreateModalFactory.open;

    var userObj = $firebaseObject(usersRef.child(userId));
    userObj.$loaded().then(function(user) {
        $scope.user = user;
    });

    $scope.logout = function(){
        $scope.auth.$unauth();
        $state.go('login');
    };

    syncObject.$bindTo($scope, "data").then(function() {

        $scope.findRandomGame = function(game, user){
            $scope.isLoading = true;
            DashboardFactory.findRandomGame($scope.data,$scope.user)
                .then(function(resolve) {
                    $scope.isLoading = false;
                    return resolve;
                })
        }

    });
});


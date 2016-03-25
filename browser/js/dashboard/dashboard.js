app.controller('DashboardCtrl', function(usersRef, userId, syncObject, $scope, $state, $firebaseObject, gameFactory, DashboardFactory) {

    $scope.auth = gameFactory.auth();

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
            return DashboardFactory.findRandomGame($scope.data,$scope.user);
        }

    });
});


app.controller('DashboardCtrl', function(usersRef, userEmail, userId, gamesRef, playersRef, baseStateRef, syncObject, $scope, $state, $firebaseArray, $firebaseObject, gameFactory, DashboardFactory, $timeout, CreateModalFactory) {

    $scope.auth = gameFactory.auth();

    var players;

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


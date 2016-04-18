app.controller('DashboardCtrl', function(usersRef, userId, syncObject, $scope, $state, $firebaseObject, gameFactory, DashboardFactory, CreateModalFactory, JoinModalFactory, YourGamesModalFactory) {

    $scope.auth = gameFactory.auth();
    $scope.isLoading = null;
    $scope.open = CreateModalFactory.open;
    $scope.join = JoinModalFactory.open;
    $scope.yourGames = YourGamesModalFactory.open;

    var userObj = $firebaseObject(usersRef.child(userId));
    userObj.$loaded().then(function(user) { 
        $scope.user = user
    });

    $scope.logout = function(){
        $scope.auth.$unauth();
        $state.go('login');
    };

    syncObject.$bindTo($scope, "data").then(function() {

        $scope.singlePlayer = function(){
            $scope.isLoading = true;
            DashboardFactory.singlePlayerGame($scope.data, $scope.user);
        };

        $scope.findRandomGame = function(){
            $scope.isLoading = true;
            DashboardFactory.findRandomGame($scope.data, $scope.user);
        };

    });
});


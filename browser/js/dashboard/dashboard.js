app.controller('DashboardCtrl', function(usersRef, userId, syncObject, $scope, $state, $firebaseObject, gameFactory, DashboardFactory, CreateModalFactory, $timeout) {

    $scope.auth = gameFactory.auth();
    $scope.isLoading = null;
    $scope.open = CreateModalFactory.open;

    var userObj = $firebaseObject(usersRef.child(userId));
    userObj.$loaded().then(function(user) { $scope.user = user });

    $scope.logout = function(){
        $scope.auth.$unauth();
        $state.go('login');
    };

    syncObject.$bindTo($scope, "data").then(function() {

        $scope.findRandomGame = function(){
            $scope.isLoading = true;
            $timeout(function() {
                DashboardFactory.findRandomGame($scope.data, $scope.user);
            }, 1000)
        }
    });
});


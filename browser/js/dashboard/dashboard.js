app.controller('DashboardCtrl', function(usersRef, userId, syncObject, $scope, $state, $firebaseObject, gameFactory, DashboardFactory, CreateModalFactory, JoinModalFactory, $timeout) {

    $scope.auth = gameFactory.auth();
    $scope.isLoading = null;
    $scope.open = CreateModalFactory.open;
    $scope.join = JoinModalFactory.open;

    var userObj = $firebaseObject(usersRef.child(userId));
    userObj.$loaded().then(function(user) { $scope.user = user });

    $scope.logout = function(){
        $scope.auth.$unauth();
        $state.go('login');
    };

    syncObject.$bindTo($scope, "data").then(function() {

        $scope.findRandomGame = function(){
            $scope.isLoading = true;
            console.log('5 seconds');
            DashboardFactory.findRandomGame($scope.data, $scope.user);
        }

    });
});


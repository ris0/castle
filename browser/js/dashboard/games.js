app.factory('YourGamesModalFactory', function($uibModal) {
    var yourGamesModal = {};

    yourGamesModal.open = function(user) {
    	var playerId = user;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/dashboard/yourGames.html',
            controller: 'yourGamesCtrl',
            size: 'md',
            resolve: {
            	player: function(gameFactory, $firebaseObject){
            		console.log(playerId);
                        return $firebaseObject(gameFactory.ref().child('users').child(playerId.$id));
                    }
            }
        });
    };

    return yourGamesModal;
});

app.controller('yourGamesCtrl', function($scope, $state, player, $uibModalInstance, YourGamesModalFactory){
	$scope.user = player;
	$scope.go = function(gameId){
		$uibModalInstance.close();
		$state.go('game', {gameId: gameId});
	}
});
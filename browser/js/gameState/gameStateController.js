app.controller('gameStats', function(syncObject, $scope, $firebaseObject, gameFactory) {

	syncObject.$bindTo($scope, "data")
	.then(function(){
	  	console.log($scope.data);

		(function getMyIndex() {
		  var id = gameFactory.auth().$getAuth().uid;
		  return $scope.data.players.reduce(function(prev, curr, index) {
		    if (id === curr.userID) {
		    	$scope.userIndex = index;
		      return index;
		    }
		    return prev;
		  }, "");
		})();

		$scope.buy = function(){
			if($scope.data.currentPlayer === $scope.userIndex) console.log("Buying");
		};

		$scope.done = function(){
			$scope.data.turnCount++;
			$scope.data.currentPlayer = ($scope.data.turnCount)%2;
			if($scope.data.turnCount%2 === 0) $scope.data.masterBuilder = ($scope.data.masterBuilder+1)%2;
		};
	});
});

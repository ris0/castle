app.controller('gameStats', function($scope, $firebaseObject, gameFactory) {
  var syncObject = $firebaseObject(gameFactory.ref());
  syncObject.$bindTo($scope, "data");

	$scope.drawToMarket = function(){
		$scope.data.marketQ = [];

		var x = _.countBy($scope.data.market, function(el, key){
			return (el === 'empty') ? key: false;
		});

		var full = x.false || 0;
		console.log(full);

		for(var i = 0; $scope.data.marketQ.length < 7-full; i++){
			//remove from roomCards & roomTiles
			var nextTile = $scope.data.roomTiles[$scope.data.roomCards[i]][0];
			if(nextTile){
				$scope.data.marketQ.push(nextTile);
			}
		}
	};

	$scope.assignPrices = function(){
		//how to assign w/ dragging?
		var i = 0;
		for (var price in $scope.data.market){
			if($scope.data.market[price] === 'empty'){
				$scope.data.market[price] = $scope.data.marketQ[i];
				i++;
			}
		}

		$scope.data.marketQ = [];
	};

	$scope.buyRoom = function(room, price){
		//give money to master builder
		$scope.data.market[price] = "empty";
		// $scope.data.players[0].castle.push(room);
	};

	console.log(gameFactory.auth());
	

});

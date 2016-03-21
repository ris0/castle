//show login/register page

//if user is logged in show lobby

	//random match
		//create player queue => playerArr of four userID's
		//set timer (setTimout) of 4 minutes to find another player
		//playerArr must have a length of at LEAST 2 userID's to push game
			//if playerArr.length >= 2
				//create new firebase gameState object with only those players
				//$state.go

	//find a certain game by gameID
		//people can create games and send email invitations with gameID?
		//enter gameID to be added to playerArr
		//in view a button appears to $state.go to that game;

	//chat function?


//user authentication w/ firebase

app.config(function ($stateProvider) {

    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl'
    });

});

app.controller('LobbyCtrl', function ($scope, $state, $firebaseObject, $firebaseArray, gameFactory) {

  var syncObject = $firebaseObject(gameFactory.ref());
  syncObject.$bindTo($scope, "data");
  $scope.auth = gameFactory.auth();
  $scope.baseStateRef = gameFactory.ref().child("baseState");
  $scope.gamesRef = gameFactory.ref().child("games");
  $scope.playersRef = gameFactory.ref().child("playersQueue");
  $scope.usersRef = gameFactory.ref().child("users");
  $scope.userId = $scope.auth.$getAuth().uid;
  $scope.userEmail = $scope.auth.$getAuth().password.email;
	

  $scope.baseStateRef.once('value', function(baseState){
  	console.log(baseState.val())
  	$scope.baseState = _.clone(baseState.val());
  });	

  $scope.goToGame = function(){
  	$state.go('game');
  };

  $scope.createGame = function(players){
  	$scope.playersRef.once('value', function(playersObj){
  		var players = _.clone(playersObj.val());
  		console.log(players);
  		$scope.counter = 0;
  		for(var key in players){
  			console.log(players[key]);
  			$scope.baseState.players[$scope.counter].userID = players[key].userId;
  			$scope.baseState.players[$scope.counter].userName = players[key].email;
  			$scope.counter ++;
  		}
  		$scope.playersRef.remove();
  		var newGameRef = $scope.gamesRef.push($scope.baseState);
  		var gameID = newGameRef.key();
  		console.log(gameID);

  		$scope.gamesRef.child(gameID).once('value', function(game){
  			game.val().players.forEach(function(player){
  				$scope.addGameToUsers(player.userID, gameID);
  			});
  		});
  	});
  	console.log('removed');
  }

  	console.log($scope.usersRef);

  $scope.addGameToUsers = function(uid, gameID){
  	$scope.usersRef.child(uid).child('game').set(gameID);
  };

  $scope.findRandomGame = function(){

  	if($scope.data.playersQueue){
  		for(var key in $scope.data.playersQueue){
  			console.log($scope.userId);
  			if($scope.data.playersQueue[key] === $scope.userId) {
  				console.log('User is already in this game!');
  				console.log($scope.data.playersQueue)
  				return;
  			}
  		}
  		$scope.playersRef.push({userId : $scope.userId, email : $scope.userEmail})
  	}else{
  		$scope.playersRef.push({userId : $scope.userId, email : $scope.userEmail})
	  	setTimeout($scope.createGame, 10000);
	  	console.log('10 seconds');
	 }
  }
});





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

app.controller('LobbyCtrl', function ($scope, $state, gameFactory) {

  $scope.auth = gameFactory.auth();
  $scope.ref = gameFactory.ref();

  console.log($scope.auth.$getAuth());

});
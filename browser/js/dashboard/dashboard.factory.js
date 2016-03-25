app.factory('DashboardFactory', function(usersRef, userEmail, userId, gamesRef, playersRef, baseStateRef, syncObject, $scope, $state, $firebaseArray, $firebaseObject, gameFactory, $timeout, CreateModalFactory) {

    var dashboard = {};

    var auth = gameFactory.auth();
    var players;


    //put this in its own factory
    dashboard.createGame = function(game) {
        playersRef.once('value', function(playersObj) {
            players = _.clone(playersObj.val());
            $scope.counter = 0;

            shuffleDecks();

            for (var key in players) {
                $scope.baseState.players[$scope.counter].userID = players[key].userId;
                $scope.baseState.players[$scope.counter].userName = players[key].email;
                $scope.baseState.players[$scope.counter].bonusCards = $scope.baseState.bonusCards.splice(0,2);
                $scope.counter++;
            }
            playersRef.remove();


            var newGameRef = gamesRef.push($scope.baseState);
            var gameID = newGameRef.key();


            var gamePlayersArr = $firebaseArray(gamesRef.child(gameID).child("players"));

            gamePlayersArr.$loaded().then(function(gamePlayers) {
                for (var j = 0; j < $scope.counter; j++) {
                    $scope.addGameToUsers(gamePlayers[j].userID, gameID);
                }
                for (var i = $scope.counter; i < gamePlayers.length; i++) {
                    gamePlayers.$remove(i);
                }
            }).then(function(){
                $scope.isLoading = false;
                $state.go('game');
            })


        })

    };

    dashboard.addGameToUsers = function(uid, gameID) {
        usersRef.child(uid).child('game').set(gameID);
    };

    dashboard.findRandomGame = function() {
        console.log($scope.test);
        if ($scope.data.playersQueue) {

            for (var key in $scope.data.playersQueue) {
                if ($scope.data.playersQueue[key] === userId) return;
            }

            playersRef.push({ userId: userId, email: userEmail })

        } else {
            playersRef.push({ userId: userId, email: userEmail });
            $scope.isLoading = true;
            console.log($scope.isLoading);
            $timeout($scope.createGame, 5000);
            console.log('Game will be ready in 5 seconds');
        }

    };

    //shuffles decks and removes card based on # players
    function shuffleDecks(){
        var numberPlayers = Object.keys(players).length;
        var numRoomCards = numberPlayers * 11;
        var numFavors = Math.max(numberPlayers, 3);
        var numTileMult = (numberPlayers - 4);

        $scope.baseState.roomCards = _.shuffle($scope.baseState.roomCards).slice(0, numRoomCards);
        $scope.baseState.bonusCards = _.shuffle($scope.baseState.bonusCards);
        $scope.baseState.kingsFavors = _.shuffle($scope.baseState.kingsFavors).slice(0, numFavors);

        //removing from piles depending on #players
        for (var roomSize in $scope.baseState.roomTiles) {
            var toRemove = $scope.baseState.roomTiles[roomSize].length;
            //removing 0, 1, or 2 from large rooms piles, 0, 2, or 4 from small room piles
            if (roomSize.length < 4 && numTileMult < 0) toRemove = (+roomSize > 350) ? 1 * numTileMult : 2 * numTileMult;
            $scope.baseState.roomTiles[roomSize] = _.shuffle($scope.baseState.roomTiles[roomSize]).slice(0, toRemove);
        }
    }

    return dashboard;
});


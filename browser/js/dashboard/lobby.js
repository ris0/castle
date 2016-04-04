
app.controller('lobbyCtrl', function(lobbyUserObj, DashboardFactory,$stateParams, $scope, gameFactory, $firebaseObject, userId, syncObject, $firebaseArray,gamesRef, lobbyRef, $state, lobbyId) {

    const game = syncObject;
    const playerRef = $firebaseObject(gameFactory.ref().child('users').child(userId));
    const baseState = gameFactory.ref().child('baseState');
    const thisLobbyRef = gameFactory.ref().child('lobbies').child(lobbyId);
    const usersRef = gameFactory.ref().child('users');



    $scope.obj = {};

    lobbyRef.$bindTo($scope, "data").then(function() {
        var playerName;

        playerRef.$loaded().then(function(obj) {
            var indexSlice = obj.email.indexOf('@');
            playerName = obj.email.slice(0,indexSlice);
        });

        //Checks if game is new, then sends player to game
        var newItems = false;
        var userGamesRef = usersRef.child(userId).child('games');
        userGamesRef.on('child_added', function(games){
            var games = games.val();
            if(!newItems) return;
            $state.go('game', {gameId:games.gameID});
        });
        userGamesRef.once('value', function(message){
                newItems = true;
        });

        $scope.isHost = function () {
            return lobbyUserObj.isHost;
        };

        $scope.sendMessage = function () {
            if (!$scope.data.messages) { $scope.data.messages = [] }
            $scope.data.messages.push({
                from: playerName,
                sent: Date.now(),
                content: $scope.obj.msg
            });
            $scope.obj.msg = "";
        };

        $scope.startGame = function () {
            var baseState = _.clone(game.baseState),
                newGame, fireNewGame, lobbyLength;

            thisLobbyRef.once('value', function(lobby){
                var lobby = lobby.val();
                lobbyLength = Object.keys(lobby.players).length;

                if(lobby.messages) baseState.messages = lobby.messages;

                var counter = 0;
                for(var player in lobby.players){
                    console.log(baseState.players);
                    baseState.players[counter].userID = lobby.players[player].userID;
                    baseState.players[counter].userName = lobby.players[player].userName;
                    counter ++;
                }
                console.log(baseState);

                //prepare new game state object
                DashboardFactory.shuffleDecks(baseState, lobby.players);
                baseState.players.splice(lobbyLength);
                newGame = gamesRef.push(baseState);
                fireNewGame = $firebaseObject(gameFactory.ref().child('games').child(newGame.key()));

                fireNewGame.$loaded()
                .then(function(fireNewGame){
                    fireNewGame.players.forEach(function(player){
                        DashboardFactory.addGameToUsers(player.userID, fireNewGame.$id);
                    })
                    return thisLobbyRef.remove();
<<<<<<< HEAD
                })
                .then(function() {
                    $state.go('game',{ gameId: fireNewGame.$id })
=======
>>>>>>> 6860285aaaa2c6c461317c1b67bb2f38decbdac8
                });
            });
        }

    });

});




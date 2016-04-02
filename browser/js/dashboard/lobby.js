
app.controller('lobbyCtrl', function(DashboardFactory,$stateParams, $scope, gameFactory, $firebaseObject, usersRef, userId, syncObject, $firebaseArray,gamesRef, lobbyRef, $state, lobbyId) {

    const game = syncObject;
    const playerRef = $firebaseObject(gameFactory.ref().child('users').child(userId));
    const baseState = gameFactory.ref().child('baseState');
    const thisLobbyRef = gameFactory.ref().child('lobbies').child(lobbyId);

    $scope.obj = {};

    lobbyRef.$bindTo($scope, "data").then(function() {
        var playerName;

        playerRef.$loaded().then(function(obj) {
            var indexSlice = obj.email.indexOf('@');
            playerName = obj.email.slice(0,indexSlice);
        });

        $scope.isHost = function () {
            return $scope.data.players[0].userID === playerRef.$id;
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

                var counter = 0;
                for(var player in lobby.players){
                    console.log(lobby.players[player]);
                    baseState.players[counter].userID = lobby.players[player].userID;
                    baseState.players[counter].userName = lobby.players[player].userName;
                    counter ++;
                }
                if(lobby.messages) baseState.messages = lobby.messages;
                DashboardFactory.shuffleDecks(baseState, lobby.players);
                newGame = gamesRef.push(baseState);

                fireNewGame = $firebaseObject(gameFactory.ref().child('games').child(newGame.key()));
                fireNewGame.$loaded()
                .then(function() {
                    fireNewGame.players.splice(lobbyLength);
                    return fireNewGame.$save()
                })
                .then(function(){
                    var thePlayer = gameFactory.ref().child('users').child(userId).child('games');
                    thePlayer.push({
                        gameID: fireNewGame.$id,
                        timestamp: Firebase.ServerValue.TIMESTAMP
                    });
                    return thisLobbyRef.remove();
                })
                .then(function() {
                    $state.go('game',{ gameId: fireNewGame.$id })
                });
            });
        }

    });

});




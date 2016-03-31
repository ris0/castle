app.factory('LobbyFactory', function() {

    var lobby = {};
    lobby.ref = [];

    lobby.registerInfo = function (data) { lobby.ref = data };

    return lobby;

});

app.controller('lobbyCtrl', function($stateParams, $scope, LobbyFactory, gameFactory, $firebaseObject, usersRef, userId, syncObject, $firebaseArray,gamesRef, lobbyRef) {

    var lobbyId = LobbyFactory.ref,
        playerId = userId;

    const game = syncObject;
    const playerRef = $firebaseObject(gameFactory.ref().child('users').child(playerId));

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
                sent: Firebase.ServerValue.TIMESTAMP,
                content: $scope.obj.msg
            });
            $scope.obj.msg = "";
        };

        $scope.startGame = function () {

            var baseState = _.clone(game.baseState),
                newGame, gameId, fireNewGame, lobbyLength, fireUsers;

            lobbyRef.$loaded()
                .then(function(lobbyData){
                    lobbyLength = lobbyData.players.length;

                })
                .then(function() {
                    for (var i = 0; i < lobbyLength; i++) {
                        baseState.players[i].userID = lobbyRef.players[i].userID;
                        baseState.players[i].userName = lobbyRef.players[i].userName;
                        baseState.messages = lobbyRef.messages;
                    }
                    gamesRef.push(baseState);
                    newGame = gamesRef.push(baseState);
                    gameId = newGame.key();
                    fireNewGame = $firebaseObject(newGame);
                    lobbyRef.$remove();
                    return fireNewGame.$loaded()
                })
                .then(function(){

                    for (var j = 0; j < lobbyLength; j++) {
                        console.log(fireNewGame.players[j]);
                        //if (!fireNewGame.players[j].userID) {
                        //    console.log('The following player has been removed',fireNewGame.players[j]);
                        //    fireNewGame.players[j].$remove()
                        //}
                    }


                    fireUsers = $firebaseObject(usersRef);
                    return fireUsers.$loaded()
                })
                .then(function(users) {
                    // can I do a query search and look for a particular key?
                    console.log('resolved users', users);
                    console.log('gameId exists', gameId);
                    // if not let's iterate through these object keys and assign the gameID to it
                    // how does this object look again? array like object?
                    //for (var j = 0; j < users.length; j++) {
                    //    console.log('reaching the end of the barrel');
                    //    users[j].gameID = gameId
                    //}
                });

        }

    });

});




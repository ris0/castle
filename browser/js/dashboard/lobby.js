app.factory('LobbyFactory', function() {

    var lobby = {};
    lobby.ref = [];

    lobby.registerInfo = function (data) { lobby.ref = data };

    return lobby;

});



app.controller('lobbyCtrl', function($scope, LobbyFactory, gameFactory, $firebaseObject, usersRef, userId, syncObject, $firebaseArray) {

    var lobbyId = LobbyFactory.ref, playerId = userId;

    const playerRef = $firebaseObject(new Firebase ('https://castle-fullstack.firebaseio.com/users/' + playerId));
    const lobbyRef = $firebaseObject(new Firebase ('https://castle-fullstack.firebaseio.com/lobbies/' + lobbyId));

    const gamesRef = gameFactory.ref().child('games');
    const game = syncObject;

    $scope.obj = {};

    lobbyRef.$bindTo($scope, "data").then(function() {
        var playerName;

        playerRef.$loaded().then(function(obj) {
            var indexSlice = obj.email.indexOf('@');
            playerName = obj.email.slice(0,indexSlice);
        });

        $scope.isHost = function () { return $scope.data.players[0] === playerRef.$id };

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

            var baseState = _.clone(game.baseState);
            var newGame = gamesRef.push(baseState);
            var gameId = newGame.key();
            var fireNewGame = $firebaseObject(newGame);
            var lobbyLength;

            lobbyRef.$loaded()
                .then(function(lobbyData){
                    lobbyLength = lobbyData.players.length;
                });

            fireNewGame.$loaded()
                .then(function(){
                   for (var i = 0; i < lobbyLength; i++) {
                       fireNewGame.players[i].userID = lobbyRef.players[i];
                       fireNewGame.players[i].userName = lobbyRef.players[i];
                   }
                    console.log(fireNewGame);
                });

            // move this object into the games object, delete the lobby

            // associate this new game object ID to each player

            // go to the game state
        }

    });

});




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

            var baseState = _.clone(game.baseState),
                newGame = gamesRef.push(baseState),
                gameId = newGame.key(),
                fireNewGame = $firebaseObject(newGame),
                lobbyLength, fireUsers;

            // find the amount of players in lobby, then load up the newGame object
            // then reassign the userID and userName to the correct information as found in the lobby
            lobbyRef.$loaded()
                .then(function(lobbyData){
                    return lobbyLength = lobbyData.players.length;
                })
                .then(function() {
                    return fireNewGame.$loaded()
                })
                .then(function(){
                   for (var i = 0; i < lobbyLength; i++) {
                       fireNewGame.players[i].userID = lobbyRef.players[i].userID;
                       fireNewGame.players[i].userName = lobbyRef.players[i].userName;
                   }
                })
                .then(function(){
                    fireUsers = $firebaseObject(usersRef);
                    return fireUsers.$loaded()
                })
                .then(function(users) {
                    // can I do a query search and look for a particular key?
                    // if not let's iterate through these object keys and assign the gameID to it
                });

        }

    });

});




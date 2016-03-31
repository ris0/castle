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

        $scope.isHost = function () {
            console.log('scope.data loaded', $scope.data.players[0]);
            console.log('firebaseObject loaded',playerRef.$id);
            return $scope.data.players[0] === playerRef.$id;
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
                newGame = gamesRef.push(baseState),
                gameId = newGame.key(),
                fireNewGame = $firebaseObject(newGame),
                lobbyLength, fireUsers;

            // find the amount of players in lobby, then load up the newGame object
            // then reassign the userID and userName to the correct information as found in the lobby
            // Can I refactor this to resolve the async nature of loading the $firebaseObject?
            lobbyRef.$loaded()
                .then(function(lobbyData){ // determine the length
                    return lobbyLength = lobbyData.players.length;
                })
                .then(function() { // avoid async issues
                    console.log('fireNewGameloaded', fireNewGame);
                    return fireNewGame.$loaded()
                })
                .then(function(){ // assign firenewgame properties
                    console.log('firenewgame.players', fireNewGame.players[0]);
                   for (var i = 0; i < lobbyLength; i++) {
                       fireNewGame.players[i].userID = lobbyRef.players[i].userID;
                       fireNewGame.players[i].userName = lobbyRef.players[i].userName;
                   }
                })
                .then(function(){ // load users ref
                    fireUsers = $firebaseObject(usersRef);
                    console.log('fireUsers exists', fireUsers);
                    return fireUsers.$loaded()
                })
                .then(function(users) {
                    // can I do a query search and look for a particular key?
                    console.log('resolved users', users);
                    console.log('gameId exists', gameId);
                    // if not let's iterate through these object keys and assign the gameID to it
                    // how does this object look again? array like object?
                    for (var j = 0; j < users.length; j++) {
                        console.log('reaching the end of the barrel');
                        users[j].gameID = gameId
                    }
                });

        }

    });

});




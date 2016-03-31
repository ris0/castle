app.factory('LobbyFactory', function() {

    var lobby = {};
    lobby.ref = [];

    lobby.registerInfo = function (data) { lobby.ref = data };

    return lobby;

});

app.controller('lobbyCtrl', function($stateParams, $scope, LobbyFactory, gameFactory, $firebaseObject, usersRef, userId, syncObject, $firebaseArray,gamesRef, lobbyRef, $state) {

    const game = syncObject;
    const playerRef = $firebaseObject(gameFactory.ref().child('users').child(userId));

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
            console.log($scope.data.messages[0].sent);
            //console.log($scope.data.messages.$watch())
            $scope.obj.msg = "";
        };

        $scope.startGame = function () {

            var baseState = _.clone(game.baseState),
                newGame, fireNewGame, lobbyLength;

            lobbyRef.$loaded()
                .then(function(lobbyData){
                    lobbyLength = lobbyData.players.length;
                    newGame = gamesRef.push(baseState);
                    fireNewGame = $firebaseObject(newGame);
                    return fireNewGame.$loaded()
                })
                .then(function() {
                    for (var i = 0; i < lobbyLength; i++) {
                        fireNewGame.players[i].userID = lobbyRef.players[i].userID;
                        fireNewGame.players[i].userName = lobbyRef.players[i].userName;
                        fireNewGame.messages = lobbyRef.messages
                    }
                    fireNewGame.players.splice(lobbyLength);
                    return fireNewGame.$save()
                })
                .then(function(){
                    var thePlayer = gameFactory.ref().child('users').child(userId).child('games');
                    thePlayer.push({
                        gameID: [fireNewGame.$id],
                        timestamp: Firebase.ServerValue.TIMESTAMP
                    });
                    return lobbyRef.$remove()
                })
                .then(function() {
                    $state.go('game',{ gameID: fireNewGame.$id })
                });

        }

    });

});




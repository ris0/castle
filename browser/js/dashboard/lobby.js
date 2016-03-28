app.factory('LobbyFactory', function() {

    var lobby = {};
    lobby.ref = [];

    lobby.registerInfo = function (data) { lobby.ref = data };

    return lobby;

});



app.controller('lobbyCtrl', function($scope, LobbyFactory, gameFactory, $firebaseObject, usersRef, userId, DashboardFactory) {

    var lobbyId = LobbyFactory.ref, playerId = userId;
    const playerRef = $firebaseObject(new Firebase ('https://castle-fullstack.firebaseio.com/users/' + playerId));
    const lobbyRef = $firebaseObject(new Firebase ('https://castle-fullstack.firebaseio.com/lobbies/' + lobbyId));

    $scope.obj = {};

    lobbyRef.$bindTo($scope, "data").then(function() {
        var playerName;

        playerRef.$loaded().then(function(obj) {
            var indexSlice = obj.email.indexOf('@');
            playerName = obj.email.slice(0,indexSlice);
        });

        $scope.isHost = function () {
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
            // copy the base state and attach it to the current lobby

            // shuffle the deck



            // add game uid to the specific player

            // go to the game state
        }

    });

});




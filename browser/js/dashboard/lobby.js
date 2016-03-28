app.factory('LobbyFactory', function() {

    var lobby = {};
    lobby.ref = [];

    lobby.registerInfo = function (data) { lobby.ref = data };

    return lobby;

});



app.controller('lobbyCtrl', function($scope, LobbyFactory, gameFactory, $firebaseArray, usersRef) {

    var lobbyId = LobbyFactory.ref,
        playerId = gameFactory.auth().$getAuth().uid,
        users = $firebaseArray(usersRef),
        record = users.$indexFor(playerId);

    $scope.lobbyRef = $firebaseArray(new Firebase ('https://castle-fullstack.firebaseio.com/lobbies/' + lobbyId));
    $scope.messages = $firebaseArray(new Firebase ('https://castle-fullstack.firebaseio.com/lobbies/' + lobbyId + '/messages'));
    $scope.players = $firebaseArray(new Firebase ('https://castle-fullstack.firebaseio.com/lobbies/' + lobbyId + '/players'));

    // find the reference uid for the given player

    // look up their e-mail...
    $scope.usersTest = function () {
        for (var key in users) {
            console.log(users);
            console.log(key);
        }
    };

    console.log('the users ref', users);
    //console.log('get record of', record);

    $scope.messages.$add({
        from: playerId,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        content: "I like to code and play video games"
    })

});




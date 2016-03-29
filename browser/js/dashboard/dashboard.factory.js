app.factory('DashboardFactory', function($state, gameFactory, $firebaseArray, $q, $rootScope) {

    var dashboard = {}, players;
    var playersRef = gameFactory.ref().child("playersQueue");
    var UsersRef = gameFactory.ref().child("users");
    var ref = gameFactory.ref().child("games");


    dashboard.createRandomGame = function(game) {

            var playersObj = game.playersQueue;
            players = _.clone(playersObj);

            var baseState = _.clone(game.baseState);
            var counter = 0;

            shuffleDecks(baseState,playersObj);

            for (var key in players) {
                baseState.players[counter].userID = players[key].userId;
                baseState.players[counter].userName = players[key].email;
                counter++;
            }
            playersRef.remove();

            // create game
            var newGameRef = ref.push(baseState);
            var gameID = newGameRef.key();

            var gamePlayersArr = $firebaseArray(ref.child(gameID).child("players"));

            return gamePlayersArr.$loaded()
                .then(function(gamePlayers) {
                for (var j = 0; j < counter; j++) {
                    dashboard.addGameToUsers(gamePlayersArr[j].userID, gameID);
                }
                for (var i = counter; i < gamePlayersArr.length; i++) {
                    gamePlayersArr.$remove(i);
                }
                return gamePlayersArr;
            }).then(function(){
                $rootScope.$broadcast('gameCreated');
                $state.go('game');
            });
    };

    dashboard.addGameToUsers = function(uid, gameID) {
        UsersRef.child(uid).child('game').set(gameID);
    };


    dashboard.findRandomGame = function(game, user) {
        console.log(user);
        if (game.playersQueue) {
            for (var key in game.playersQueue) {
                if (game.playersQueue[key] === user.$id) return;
            }
            game.playersQueue.push({ userId: user.$id, email: user.email });
            $rootScope.$on('gameCreated', function(){
                $state.go('game');
            });
            return $q.when({});
        } else {
            game.playersQueue = [{userId: user.$id, email: user.email}];
            setTimeout(function(){
                dashboard.createRandomGame(game);
            }, 5000);
        }

    };

    //shuffles decks and removes card based on # players
    function shuffleDecks (game, playersQueue){
        var numberPlayers = Object.keys(playersQueue).length;
        var numRoomCards = numberPlayers * 11;
        var numFavors = Math.max(numberPlayers, 3);
        var numTileMult = (numberPlayers - 4);

        game.roomCards = _.shuffle(game.roomCards).slice(0, numRoomCards);
        game.bonusCards = _.shuffle(game.bonusCards);
        game.kingsFavors = _.shuffle(game.kingsFavors).slice(0, numFavors);

        //removing from piles depending on #players
        for (var roomSize in game.roomTiles) {
            var toRemove = game.roomTiles[roomSize].length;
            //removing 0, 1, or 2 from large rooms piles, 0, 2, or 4 from small room piles
            if (roomSize.length < 4 && numTileMult < 0) toRemove = (+roomSize > 350) ? 1 * numTileMult : 2 * numTileMult;
            game.roomTiles[roomSize] = _.shuffle(game.roomTiles[roomSize]).slice(0, toRemove);
        }
    }
    return dashboard;
});


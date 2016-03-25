app.factory('DashboardFactory', function($state, gameFactory, $firebaseObject) {

    var dashboard = {};
    var isLoading = false;
    var players;
    var ref = $firebaseObject(gameFactory.ref());

    ref.$loaded().then(function(){

    dashboard.createGame = function(game) {

            var playersObj = game.playersQueue;

            players = _.clone(playersObj);
            var counter = 0;

            shuffleDecks(game);

            for (var key in players) {
                game.baseState.players[counter].userID = players[key].userId;
                game.baseState.players[counter].userName = players[key].email;
                game.baseState.players[counter].bonusCards = game.baseState.bonusCards.splice(0, 2);
                counter++;
            }
            game.playersQueue = null;

            game.games = game.baseState;

            var gameID;
            ref.games = [game.baseState];

            ref.$save().then(function(resolve){
                gameID = resolve.key();
                console.log(resolve.key());
            });



            var gamePlayersArr = game.games[gameID].players;
            console.log(gamePlayersArr);
            //$firebaseArray(gamesRef.child(gameID).child("players"));

            for (var j = 0; j < counter; j++) {
                dashboard.addGameToUsers(gamePlayersArr[j].userID, gameID);
            }
            for (var i = counter; i < gamePlayersArr.length; i++) {
                gamePlayersArr.$remove(i);
            }

            isLoading = false;
            $state.go('game');
    };

    dashboard.addGameToUsers = function(uid, gameID) {
        game.users[uid].game = gameID;
    };

    dashboard.findRandomGame = function(game, user) {
        if (game.playersQueue) {

            for (var key in game.playersQueue) {
                if (game.playersQueue[key] === user.uid) return;
            }

            game.playersQueue.push({ userId: user.uid, email: user.email })

        } else {
            game.playersQueue = [{ userId: user.uid, email: user.email }];
            isLoading = true;
            console.log(isLoading);
            setTimeout(dashboard.createGame(game), 5000);
            console.log('Game will be ready in 5 seconds');
        }

    };

    //shuffles decks and removes card based on # players
    function shuffleDecks(game){
        var numberPlayers = Object.keys(players).length;
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
    });
    return dashboard;
});


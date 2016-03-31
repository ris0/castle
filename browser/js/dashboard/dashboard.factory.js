app.factory('DashboardFactory', function($state, gameFactory, $firebaseArray, $q, $rootScope, $timeout) {

    var dashboard = {}, players;
    var playersRef = gameFactory.ref().child("playersQueue");
    var UsersRef = gameFactory.ref().child("users");
    var ref = gameFactory.ref().child("games");
    var baseState = gameFactory.ref().child('baseState');

    dashboard.createRandomGame = function(game) {

        baseState.on('value', function(baseState){
            var playersObj = game.playersQueue;
            players = _.clone(playersObj);

            var baseState = baseState.val();
            var counter = 0;

            shuffleDecks(baseState, playersObj);
            console.log(baseState);
            for (var key in players) {
                console.log('how many players?', players);
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
                    console.log(gamePlayers);
                for (var j = 0; j < counter; j++) {
                    dashboard.addGameToUsers(gamePlayersArr[j].userID, gameID);
                }
                for (var i = counter; i < gamePlayersArr.length; i++) {
                    gamePlayersArr.$remove(i);
                }
                return gamePlayersArr;
            }).then(function(){
                $rootScope.$broadcast('createdGame');
                $state.go('game');
            });
        })
    };

    dashboard.addGameToUsers = function(uid, gameID) {
        UsersRef.child(uid).child('game').set(gameID);
    };


    dashboard.findRandomGame = function(game, user) {
        if (game.playersQueue) {
            for (var key in game.playersQueue) {
                if (game.playersQueue[key] === user.$id) return;
            }
            game.playersQueue.push({ userId: user.$id, email: user.email });
            $timeout(function(){
                dashboard.createRandomGame(game);
            }, 1000);
        } else {
            game.playersQueue = [{userId: user.$id, email: user.email}];
            $timeout(function(){
                $state.go('game');
            }, 5000);
        }

    };

    dashboard.singlePlayerGame = function(game, user){
        game.playersQueue = [{userId: user.$id, email: user.email}];
        dashboard.createRandomGame(game);
    };

    //shuffles decks and removes card based on # players
    function shuffleDecks (game, playersQueue){
        var numberPlayers = Object.keys(playersQueue).length;
        var numRoomCards, numFavors, numTileMult;

        if(numberPlayers > 1){
            numRoomCards = numberPlayers * 11;
            numFavors = Math.max(numberPlayers, 3);
            numTileMult = (numberPlayers - 4);
            game.kingsFavors = _.shuffle(game.kingsFavors).slice(0, numFavors);
        } else {
            numRoomCards = 33;
            numTileMult = -1;
            game.kingsFavors = null;
            game.masterBuilder = null;
            game.players[0].canBuy = true;
            game.market = {
                2000: {room:'empty'},
                4000: {room:'empty'},
                6000: {room:'empty'}
            };
        }

            game.roomCards = _.shuffle(game.roomCards).slice(0, numRoomCards);
            game.bonusCards = _.shuffle(game.bonusCards);

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


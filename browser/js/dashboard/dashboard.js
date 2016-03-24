app.controller('DashboardCtrl', function($scope, $state, gameFactory, usersRef, gamesRef, playersRef, baseStateRef, userId, userEmail, syncObject, $firebaseArray, $firebaseObject) {
    // logout

    $scope.auth = gameFactory.auth();
    $scope.ref = gameFactory.ref();
    $scope.usersRef = gameFactory.ref().child("users");
    $scope.gamesRef = gamesRef;
    $scope.playersRef = playersRef;
    $scope.baseStateRef = baseStateRef;
    $scope.syncObject = syncObject;

    $scope.logout = function(){
        $scope.auth.$unauth();
        console.log("Signing out");
        $state.go('login');
    };

    // create / join / random game

    var userObj = $firebaseObject(usersRef.child(userId));

    userObj.$loaded().then(function(user){
        $scope.user = user;
    });

    syncObject.$bindTo($scope, "data").then(function(){

        baseStateRef.once('value', function(baseState){
            $scope.baseState = _.clone(baseState.val());
        });

        $scope.goToGame = function(){
            $state.go('game');
        };

        $scope.createGame = function(){
            playersRef.once('value', function(playersObj){
                var players = _.clone(playersObj.val());
                $scope.counter = 0;
                for(var key in players){
                    $scope.baseState.players[$scope.counter].userID = players[key].userId;
                    $scope.baseState.players[$scope.counter].userName = players[key].email;
                    $scope.counter ++;
                }
                playersRef.remove();

                var newGameRef = gamesRef.push($scope.baseState);
                var gameID = newGameRef.key();

                var gamePlayersArr = $firebaseArray(gamesRef.child(gameID).child("players"));

                gamePlayersArr.$loaded().then(function(gamePlayers){
                    for(var j = 0; j < $scope.counter; j++){
                        $scope.addGameToUsers(gamePlayers[j].userID, gameID);
                    }
                    for(var i = $scope.counter; i < gamePlayers.length; i++){
                        gamePlayers.$remove(i);
                    }
                });
                console.log('Game has been created');
            });

        };

        $scope.addGameToUsers = function(uid, gameID){
            usersRef.child(uid).child('game').set(gameID);
        };

        $scope.findRandomGame = function(){

            if($scope.data.playersQueue) {

                for(var key in $scope.data.playersQueue){
                    if($scope.data.playersQueue[key] === userId) return;
                }

                playersRef.push({userId : userId, email : userEmail})

            } else {
                playersRef.push({userId : userId, email : userEmail})
                setTimeout($scope.createGame, 5000);
                console.log('Game will be ready in 5 seconds');
            }

        }

    });




});

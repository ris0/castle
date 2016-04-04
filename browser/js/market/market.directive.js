app.directive('market', function($rootScope, $firebaseObject, gameFactory, gameStateFactory, marketFactory, $firebaseArray) {

    return {
        restrict: 'E',
        scope: {
            gameId: "="
        },
        templateUrl: 'js/market/market.html',
        link: function(scope) {
            var userID = gameFactory.auth().$getAuth().uid;
            var userGame = $firebaseObject(gameFactory.ref().child('games').child(scope.gameId));
            userGame.$loaded()
                .then(function(syncObject) {
                    return syncObject.$bindTo(scope, 'data');
                }).then(function(game) {
                    scope.userIndex = gameStateFactory.getUserIndex(scope.data);

                    scope.buy = function() {
                        var buyStatus = marketFactory.buy(scope.data);
                        if (buyStatus) $.jGrowl(buyStatus.message, { themeState: 'highlight' });
                        scope.data[buyStatus.roomName] = false;
                        scope.data.players[scope.userIndex].trying = false;
                    };

                    scope.tryCorridor = function(type) {
                        if (!scope.data.players[scope.userIndex].trying) {
                            scope.data.players[scope.userIndex].trying = true;
                            scope.data[type] = true;
                            var corridor = scope.data.roomTiles[type][0];
                            corridor.price = 3000;
                            marketFactory.try(scope.data, corridor);
                        }
                    };

                    scope.untryCorridor = function(type) {
                        if (scope.data.players[scope.userIndex].trying && scope.data[type]) {
                            scope.data.players[scope.userIndex].trying = false;
                            scope.data[type] = null;
                            var corridor = scope.data.roomTiles[type][0];
                            marketFactory.untry(scope.data, corridor);
                        }
                    };

                    scope.try = function(room, price) {
                        scope.data.players[scope.userIndex].trying = true;
                        room.trying = true;
                        room.room.price = price;
                        marketFactory.try(scope.data, room.room);
                    };

                    scope.untry = function(room) {
                        scope.data.players[scope.userIndex].trying = false;
                        room.trying = false;
                        marketFactory.untry(scope.data, room.room);
                    };

                    scope.evalTry = function(room, price) {
                        if (scope.data.currentPlayer === scope.userIndex && scope.data.players[scope.data.currentPlayer].canBuy) {
                            if (!scope.data.players[scope.userIndex].trying) scope.try(room, price);
                            else if (scope.data.players[scope.userIndex].trying && room.trying) scope.untry(room);
                        }
                    };

                    scope.evalCorridorTry = function(type) {
                        if (scope.data.currentPlayer === scope.userIndex && scope.data.players[scope.data.currentPlayer].canBuy) {
                            if (!scope.data.players[scope.userIndex].trying) scope.tryCorridor(type);
                            else if (scope.data.players[scope.userIndex].trying && scope.data[type]) scope.untryCorridor(type);
                        }
                    };

                    scope.pass = function() {
                        marketFactory.pass(scope.data);
                    };

                    scope.done = function() {
                        gameStateFactory.done(scope.data);
                    };

                    scope.drawToMarket = function() {
                        gameStateFactory.drawToMarket(scope.data);
                    };

                    if (scope.data.turnCount === 0 && scope.data.market[2000].room === "empty") scope.drawToMarket();
                });
        }
    };
});

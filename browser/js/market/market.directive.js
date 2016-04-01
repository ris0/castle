app.directive('market', function($rootScope, $firebaseObject, gameFactory, gameStateFactory, marketFactory) {

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
                        console.log(buyStatus.roomName);
                        scope[buyStatus.roomName]=false;
                    };

                    scope.tryCorridor = function(type) {
                        scope[type] = true;
                        var corridor = scope.data.roomTiles[type][0];
                        corridor.price = 3000;
                        marketFactory.try(scope.data, corridor);
                    };

                    scope.untryCorridor = function(type) {
                        scope[type] = null;
                        var corridor = scope.data.roomTiles[type][0];
                        marketFactory.untry(scope.data, corridor);
                    };

                    scope.try = function(room, price) {
                        room.trying = true;
                        room.room.price = price;
                        marketFactory.try(scope.data, room.room);
                    };

                    scope.untry = function(room) {
                        room.trying = false;
                        marketFactory.untry(scope.data, room.room);
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

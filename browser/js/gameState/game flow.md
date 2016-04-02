market(room, price) -> try, untry, buy, pass, stairs?
game(game, trigger, currentUser) -> draw to market, get user obj, get game obj, next turn
scoring(room, castle, bonus cards, kings) -> private points, placement points, kings favor points

var game = {};

game.drawToMarket = function(){
	var gameCardRefArray;
	var marketRef;
	var gameTileRef;

	var x = gameCardRefArray.$remove(0);
	if(gameTileRef[x]) {/*put next gameTileRef into market*/}
	else(draw another card);
};

game.getUserObj = function(){};

game.getGameObj = function(){};

game.nextTurn = function(){};

var market = {};

market.try = function(){};

market.untry = function(){};

market.buy = function(){};

market.pass = function(){};


var scoring = {};

scoring.scoreRoom = function(){};
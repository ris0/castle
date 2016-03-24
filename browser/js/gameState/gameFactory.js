app.factory('gameFactory', function($firebaseAuth){
	var gameState = {};
	var ref = new Firebase("https://cindy-castle.firebaseio.com/");
    gameState.ref = ()=>{
    	return ref;
    };

    gameState.auth = function(){
    	return $firebaseAuth(ref);
    };
	
    //currentplayer = turn%players.length
    //masterplayer = turn%players.length^2

	return gameState;
    
});
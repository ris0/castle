app.factory('gameFactory', function($firebaseAuth){
	var gameState = {};
	var ref = new Firebase("https://castle-fullstack.firebaseio.com/");
    gameState.ref = ()=>{
    	return ref;
    };

    gameState.setup = function(){
    	//get base state from firebase and then setup?
    	//firebase sets up?
    };

    gameState.auth = function(){
    	return $firebaseAuth(ref);
    };
	
    //currentplayer = turn%players.length
    //masterplayer = turn%players.length^2

	return gameState;
    
});
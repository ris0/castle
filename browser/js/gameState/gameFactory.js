app.factory('gameFactory', function($firebaseAuth){
	var gameState = {};
	var ref = new Firebase("https://castle-fullstack.firebaseio.com/");

    gameState.ref = ()=>{
    	return ref;
    };

    gameState.auth = function(){
    	return $firebaseAuth(ref);
    };

	return gameState;
    
});
app.factory('gameFactory', function($firebaseAuth){
	var gameState = {};
<<<<<<< HEAD

=======
>>>>>>> master
	var ref = new Firebase("https://cindy-castle.firebaseio.com/");

    gameState.ref = ()=>{
    	return ref;
    };

    gameState.auth = function(){
    	return $firebaseAuth(ref);
    };

	return gameState;
    
});
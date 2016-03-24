app.factory('completionFactory', function(){
	var completion = {};

	completion.Activity = function(player){
		player.publicScore.roomPts += 5;
	};

	completion.Outdoor = function(player){
		player.cashMoney += 10000;
	};

	completion.Food = function(player){
		player.canBuy = true;
	};

	completion.Utility = function(player){
		//draw bonus cards;
	};

	completion.Corridor = function(player){
		player.canBuyCorridors = true;
		//can buy hallways or stairs;
	};

	completion.Living = function(player, room){
		player.publicScore.livingRoomBonusPts += room.points;
	};

	completion.Sleep = function(player){
		//input type of tile and # to draw
	};

	completion.Downstairs = function(player){
		var numDownCompleted;
		if(numDownCompleted%2 === 0){
			//choose one of the other seven rewards.
		}
	};

	return completion;
});
app.factory('bonusCardsFactory', function(gameFactory){
var bonusCards = {};
var largeRooms;
var smallRooms;
//shape by sqf
var squareRooms = [100,400];
var roundRooms = [150,500];

bonusCards.getRankings = function(game){
	var bonusCardsArr = game.bonusCards
	console.log(bonusCardsArr);
	var bonusesToReward = [];
	bonusCardsArr.forEach(function(bonus){
		if(favor.sqf) bonusesToReward.push(mostRoomTypeBySqFt(game, favor.type));
		if(favor.type && !favor.sqf) bonusesToReward.push(mostTypeRooms(game, favor.type));
		if(favor.shape) bonusesToReward.push(mostShapeRooms(game, favor.shape));
		if(favor.size === 'large') bonusesToReward.push(mostLargeRooms(game));
		if(favor.size === 'small') bonusesToReward.push(mostLargeRooms(game));
		if(favor.cashMoney) bonusesToReward.push(mostMoney(game));
	});
	resetbonusCardsPoints(game);
	rewardBonuses.apply(null, bonusesToReward);
}

	function resetbonusCardsPoints (game){
		return game.players.forEach(function(player){
			return player.publicScore['kingsFavorPts'] = 0;
		});
	}

	function rewardBonuses (){
		var res = [].slice.call(arguments);
		res = res.map(function(bonus){ //favorPoints === {player, pts}
				
		});
		console.log(res);
		return res;
	}

	// bonus cards
		// sevenPointsForAllTypes
	function sevenForAllTypes (player){
		var res = {};
		player.castle.forEach(function(room){
			res[room.roomType] = true;
		});

		return (Object.keys(res).length === 8) ? 7 : 0;
	}
	// eightPointsForAllSizes
	function eightForAllSizes (player){
		var res = {};
		player.castle.forEach(function(room){
			if(room.roomName!=='Hallway' && room.roomName!=='Stairs') res[room.sqf] = true;
		});

		return (Object.keys(res).length === 10) ? 8 : 0;
	}
	// onePointForEveryTwoCompletedRooms
	function pointForTwoCompletedRooms (player){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.externalDoors === 0) res += 0.5;
		});
		return Math.floor(res);
	}
	// onePointForEachExternalEntrance // excluding corridors
	function pointForTwoExternalEntrances (player){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.roomType != "Corridor") res += room.externalDoors/2;
		});
		return Math.floor(res);
	}

	// onePointForEachSquareRoom
	function pointForEachSquareRoom (player){
		var res = 0;
		player.castle.forEach(function(room){
			squareRooms.forEach(function(size){
				if(room.sqf === size) res += 1;
			})
		});
		return res;
	}
	// onePointForEachRoundRoom
	function pointForEachRoundRoom (player){
		var res = 0;
		player.castle.forEach(function(room){
			roundRooms.forEach(function(size){
				if(room.sqf === size) res += 1;
			})
		});
		return res;
	}

	// onePointForEachHallway
	// onePointForEachCorridor
	// twoPointsPerUtility
	// twoPointsPerStairs
	// twoPointsPerOutdoor
	// twoPointsPerActivity
	// twoPointsForEachDownstairsRoom
	// twoPointsForEachLivingRoom
	// threePointsForEachFoodRoom
	// threePointsForEachSleepRoom

	function pointsForRoomType(player, type, points){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.roomType === type) res += points;
		});
		return res;
	}
	// twoPointsForEach100Room
	// twoPointsForEach150Room
	// twoPointsForEach200Room
	// twoPointsForEach250Room
	// twoPointsForEach300Room
	// threePointsForEach350Room
	// threePointsForEach400Room
	// threePointsForEach450Room
	// threePointsForEach500Room
	// threePointsForEach600Room
	function pointsForRoomSize(player, size, points){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.sqf === size) res += points;
		});
		return res;
	}
	// onePointForEach5000Marks
	function onePointForMarks(player){
		return Math.floor(player.cashmoney/5000);
	}

	return bonusCards;

});
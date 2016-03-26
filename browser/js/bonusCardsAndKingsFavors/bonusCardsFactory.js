app.factory('bonusCardsFactory', function(gameFactory){
var bonusCards = {};
//shape by sqf
var squareRooms = [100,400];
var roundRooms = [150,500];

bonusCards.getBonusPoints = function(player){
	var bonusCardsArr = player.bonusCards
	var bonusesToReward = [];
	var bonusPoints = 0;
	bonusCardsArr.forEach(function(bonus){
		if(bonus.shape) bonusPoints += pointForEachShapeRoom(player, bonus.shape);
		if(bonus.twoCompletedRooms) bonusPoints += pointForTwoCompletedRooms(player);
		if(bonus.twoExternalEntrances) bonusPoints += pointForTwoExternalEntrances(player);
		if(bonus.size) bonusPoints += pointsForRoomSize(player, bonus.sqf, bonus.ptsPerThreshold);
		if(bonus.type) bonusPoints += pointsForRoomType(player, bonus.type, bonus.ptsPerThreshold);
		if(bonus.allRoomTypes) bonusPoints += sevenForAllTypes(player);
		if(bonus.allRoomSizes) bonusPoints += eightForAllSizes(player);
		if(bonus.fiveThousandMarks) bonusPoints += onePointForMarks(player);
	});
	console.log(bonusCardsArr);
	console.log('BonusPoints:', bonusPoints);
	console.log(player);
	player.privateBonusCardPts = bonusPoints;
}

	function sevenForAllTypes (player){
		var res = {};
		player.castle.forEach(function(room){
			res[room.roomType] = true;
		});

		return (Object.keys(res).length === 8) ? 7 : 0;
	}

	function eightForAllSizes (player){
		var res = {};
		player.castle.forEach(function(room){
			if(room.roomName!=='Hallway' && room.roomName!=='Stairs') res[room.sqf] = true;
		});

		return (Object.keys(res).length === 10) ? 8 : 0;
	}

	function pointForTwoCompletedRooms (player){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.externalDoors === 0) res += 0.5;
		});
		return Math.floor(res);
	}

	function pointForTwoExternalEntrances (player){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.roomType != "Corridor") res += room.externalDoors/2;
			else res += 0;
		});
		return Math.floor(res);
	}


	function pointForEachShapeRoom (player, shape){
		var res = 0;
		var shapeRoom;
		if(shape === "round") shapeRoom = roundRooms;
		else shapeRoom = squareRooms;
		player.castle.forEach(function(room){
			shapeRoom.forEach(function(size){
				if(room.sqf === size) res += 1;
			})
		});
		return res;
	}

	function pointForEachRoundRoom (player){
		var res = 0;
		player.castle.forEach(function(room){
			roundRooms.forEach(function(size){
				if(room.sqf === size) res += 1;
			})
		});
		return res;
	}

	//also used for Stairs/Hallways bonus cards
	function pointsForRoomType(player, type, points){
		var roomTypeOrName; 
		if(type === 'Hallway' || type === 'Stairs'){
			roomTypeOrName = "roomName";
		}
		else roomTypeOrName = "roomType";
		var res = 0;
		player.castle.forEach(function(room){
			if(room[roomTypeOrName] == type) res += points;
		});
		return res;
	}

	function pointsForRoomSize(player, size, points){
		var res = 0;
		player.castle.forEach(function(room){
			if(room.sqf == size) res += points;
		});
		return res;
	}
	// onePointForEach5000Marks
	function onePointForMarks(player){
		return Math.floor(player.cashMoney/5000);
	}

	return bonusCards;

});
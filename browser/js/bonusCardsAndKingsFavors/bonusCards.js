//number of certain type of room
	// 1pt - per hallway
	// 1pt - per square room
	// 1pt - per round room
	// 2pts - per stairs

//room types
	//2pts - per outdoor room
	//2pts - per downstairs room
	//2pts - per activity room
	//2pts - per living room
	//2pts - per utility room

	//1pt - per corridor room

	//3pts - per sleep room
	//3pts - per food room

	//7pts - have all 8 room types

//room size/sqf
	//3pts - per large rooms (350, 400, 450, 500, 600)
	//2pts - per small rooms (100, 150, 200, 250, 300)
	//8pts - have all 10 room sizes

//room completion
	//1pt - for every 2 completed rooms
	//1pt - for every 2 external entraces

//coins
	//1pt - for every 5000 coin

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
// onePointForEachRoundRoom
/*********how to define shape?*********/
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
		if(room.roomType != type) res += points;
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
		if(room.sqf != size) res += points;
	});
	return res;
}
// onePointForEach5000Marks
function onePointForMarks(player){
	return Math.floor(player.cashmoney/5000);
}
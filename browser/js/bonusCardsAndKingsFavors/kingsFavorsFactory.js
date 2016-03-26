//need end of game kingsFavor rank score calculation

app.factory('kingsFavorsFactory', function(gameFactory){
	var kingsFavors = {};
	var ref = gameFactory.ref();
	var rankings;

	kingsFavors.getRankings = function(game){
		var kingsFavorsArr = game.kingsFavors
		var favorsToRank = [];
		kingsFavorsArr.forEach(function(favor){
			if(favor.sqf) favorsToRank.push(mostRoomTypeBySqFt(game, favor.type));
			if(favor.type && !favor.sqf) favorsToRank.push(mostTypeRooms(game, favor.type));
			if(favor.shape) favorsToRank.push(mostShapeRooms(game, favor.shape))
			if(favor.size === 'large') favorsToRank.push(mostLargeRooms(game))
			if(favor.size === 'small') favorsToRank.push(mostLargeRooms(game))
			if(favor.cashMoney) favorsToRank.push(mostMoney(game))
		});
		resetKingsFavorsPoints(game);
		rankings = rank.apply(null, favorsToRank);
		for(var i = 0; i < kingsFavorsArr.length; i++){
			kingsFavorsArr[i].rankings = rankings[i];
		}
		console.log('game-kings', game.kingsFavors);
		game.kingsFavors = kingsFavorsArr;
	}

		function resetKingsFavorsPoints (game){
			return game.players.forEach(function(player){
				return player.publicScore['kingsFavorPts'] = 0;
			});
		}

	//takes as many favors
		//game would be $scope.data in gameStateController
		function rank (){
			var scoring = [8,4,2,1];
			var res = [].slice.call(arguments);
			var ptsOrSqf;
			res = res.map(function(favorPoints){ //favorPoints === {player, pts}
					favorPoints = _.orderBy(favorPoints, 'pts','desc');
					ptsOrSqf = 'pts';
				for(var i = 0; i < favorPoints.length; i++){
					if(i < favorPoints.length - 1 && favorPoints[i][ptsOrSqf] === favorPoints[i+1][ptsOrSqf]){
						favorPoints[i].pts = scoring[i];
						favorPoints[i].player.publicScore.kingsFavorPts += scoring[i];
						favorPoints[i+1].pts = scoring[i];
						favorPoints[i+1].player.publicScore.kingsFavorPts += scoring[i];
						i++;
					} else {
						favorPoints[i].pts = scoring[i];
						favorPoints[i].player.publicScore.kingsFavorPts += scoring[i];
					}
				}
				console.log('favors', favorPoints)
				return favorPoints;
			});
			console.log('KingsFavors Rankings', res);
			return res;
		}
	// # of circle OR # of square rooms

		function mostShapeRooms (game, shape){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(shape === 'circle' && room.sqf === 100 || room.sqf === 400 ) rooms++;
					else if(shape === 'square' && room.sqf === 150 || room.sqf === 500 ) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// # of rooms of a certain type

		function mostTypeRooms (game, roomType){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.roomType === roomType) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// total sqf of rooms of a certain type
		//check type === favorType
		//
		function mostRoomTypeBySqFt (game, roomType){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.roomType === roomType) rooms += room.sqf;
				});
				return({player: player, pts: rooms});
			});
		}

	// # of large rooms (350, 400, 450, 500, 600)
		//count large rooms in "players/castle"
		function mostLargeRooms (game){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.sqf >= 350) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// # of small rooms (100, 150, 200, 250, 300)
		//count small rooms in "players/castle"
		function mostSmallRooms (game){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.sqf < 350 && room.roomType !== "Corridor") rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// # external entrances
		//check "roomTiles" for "completed" property === false
		//check if coordinates are connected elsewhere in player castle

		function mostExternalDoors (game){
			//keep track of doors?
			//ignores corridors
			return game.players.map(function(player){
				var doors = [];
				var rooms = 0;
				player.castle.forEach(function(room){
					room.doors.forEach(function(door){
						
					});
				});
				return({player: player, pts: rooms});
			});
		}

	// # of completed rooms
		//check "roomTiles" for "completed" property === true

		function mostCompletedRooms (game){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.completed) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// number of uncompleted rooms
		//check "roomTiles" for "completed" property === false

		function mostIncompleteRooms (game){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(!room.completed) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// amount of money at the end of the game

		function mostMoney (game){
			return game.players.map(function(player){
				return({player: player, pts: player.cashMoney});
			});
		}

		return kingsFavors;
});
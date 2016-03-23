app.factory('kingsFavorsFactory', function(gameFactory){
	var kingsFavors = {};
	var ref = gameFactory.ref();

	//takes as many favors
		//game would be $scope.data in gameStateController
		kingsFavors.rank = function(){
			var scoring = [8,4,2,1];
			var res = [].slice.call(arguments);
			res = res.map(function(favorPoints){
				favorPoints = _.sortBy(favorPoints, 'pts');
				for(var i = 0; i < favorPoints.length-1; i++){
					if(favorPoints[i].pts === favorPoints[i+1].pts){
						favorPoints[i] = scoring[i];
						favorPoints[i+1] = scoring[i];
						i++;
					} else favorPoints[i].pts = scoring[i];
				}
			});
			return res;
		}
	// # of circle OR # of square rooms

		kingsFavors.mostShapeRooms = function (game, shape){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.shape === "circle") rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// # of rooms of a certain type

		kingsFavors.mostTypeRooms = function (game, roomType){
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
		kingsFavors.mostRoomTypeBySqFt = function (game, roomType){
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
		kingsFavors.mostLargeRooms = function (game){
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
		kingsFavors.mostSmallRooms = function (game){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(room.sqf < 350) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// # external entrances
		//check "roomTiles" for "completed" property === false
		//check if coordinates are connected elsewhere in player castle

		kingsFavors.mostExternalDoors = function (game){
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

		kingsFavors.mostCompletedRooms = function (game){
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

		kingsFavors.mostIncompleteRooms = function (game){
			return game.players.map(function(player){
				var rooms = 0;
				player.castle.forEach(function(room){
					if(!room.completed) rooms++;
				});
				return({player: player, pts: rooms});
			});
		}

	// amount of money at the end of the game

		kingsFavors.mostMoney = function (game){
			return game.players.map(function(player){
				return({player: player, pts: player.cashMoney});
			});
		}

		return kingsFavors;
});
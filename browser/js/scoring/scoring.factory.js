app.factory('scoringFactory', function() {
  var scoring = {};

  scoring.finalScoring = function(game){
    var playerPoints = [];

    game.players.forEach(function(player){
      var score = 0;
      //depleted rooms
      for(var key in player.publicScore){
        score += +player.publicScore[key];
      }
      score += +player.privateBonusCardPts;
      score += +Math.floor(player.cashMoney/10000);
      playerPoints.push({player: player, score: score});
    });

    return playerPoints;
  };

  scoring.scoreRoom = function(game, player, room, adjArray) { //adjacent rooms, connectedRooms
    var conArray = findConnectedRooms(player, room);
    player.publicScore.roomPts += room.placementPts || 0;
    room.scoredPoints = room.placementPts || 0;

    //checking synergy points of current room to connected rooms and vice versa
    conArray.forEach(function(conRoom) {
      if(room.affectedBy){
        room.affectedBy.forEach(function(type) {
          //add score to room?
          if (type === conRoom.roomType) {
            player.publicScore.roomPts += +room.effectPts;
            conRoom.scoredPoints  += +room.effectPts;
          }
        });
      }
      if(conRoom.affectedBy){
        conRoom.affectedBy.forEach(function(type) {
          //add score to room?
          if (type === room.roomType) {
            player.publicScore.roomPts += +conRoom.effectPts;
            room.scoredPoints += +conRoom.effectPts;
          }
        });
      }
    });

    //scoring global effects
    if (player.globalEffects) {
      player.globalEffects.forEach(function(effect) {
        if (room.roomType === effect.roomType) {
          player.publicScore.roomPts += +effect.effectPts;
          room.scoredPoints += +effect.effectPts;
        }
      });
    }

    //adding global effects to player
    if (room.roomType === "Downstairs") {
      if (!player.globalEffects) player.globalEffects = [{ roomType: room.affectedBy[0], effectPts: room.effectPts }];
      else player.globalEffects.push({ roomType: room.affectedBy[0], effectPts: room.effectPts });
      player.castle.forEach(function(castleRoom) {
        room.affectedBy.forEach(function(type) {
          if (castleRoom.final && type === castleRoom.roomType) {
            player.publicScore.roomPts += +room.effectPts;
            castleRoom.scoredPoints += +room.effectPts;
          }
        });
      });
    }
  };

  function findConnectedRooms(player, room) {
    var conRooms = [];
    //for each room in the castle
    player.castle.forEach(function(castleRoom) {
    	//for each door in each room
      castleRoom.doors.forEach(function(castleDoor) {
      	//for each door on the room
        room.doors.forEach(function(roomDoor) {
        	//see if castle door and room door is a match
          if (castleRoom.final && Math.floor(castleDoor[0]) === Math.floor(roomDoor[0]) && Math.floor(castleDoor[1]) === Math.floor(roomDoor[1])) {
          	//decrements open doors in castleroom and placed room
          	connectDoorAndCheckCompletion(player, castleDoor);
          	connectDoorAndCheckCompletion(player, roomDoor);
          	conRooms.push(castleRoom);
          }
        });
      });
    });
    return _.uniq(conRooms);
  }

  function connectDoorAndCheckCompletion(player, room) {
  	//if room has open doors, minus one
    if (room.externalDoors > 1) room.externalDoors--;
    //if it's the last room, this connections completes it and its type gets pushed to completion array
    else if(room.externalDoors === 1) {
    	room.externalDoors--;
        room.completed = true;
        if (!player.completionBonus) player.completionBonus = [room];
        else player.completionBonus.push(room);
    }
  }

  return scoring;
});

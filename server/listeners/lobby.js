const Socket = require("./../socket.js");
const Player = require("./../modules/player.js");

const listener = (clients, sessionInfo, index, data) => {
	let curClient = clients[index];
	let session = sessionInfo[index];
	let rooms = Socket.rooms;

	switch (data.type) {
		case "joinRoom": 
			if (!Socket.validateProperties(data, ["room"])) {
				return;
			}

			if (data.room in rooms) {
				let roomNumber = data.room;
				let room = rooms[roomNumber];
				// Cannot join if there are more than 4 players in room
				if (rooms[roomNumber].clientIndices.length >= 4) {
					return;
				}
				// Cannot join if player is already in room
				if (index in rooms[roomNumber].clientIndices) {
					return;
				}
				// Add player instance to player object
				room.players[index] = new Player.player(session.name);
				// Add index to indices array
				room.clientIndices.push(index);

				curClient.send(JSON.stringify({
					type: "join",
					success: true
				}))
			}
			console.log(rooms);
			break;

		case "leaveRoom":
			if (!Socket.validateProperties(data, ["room"])) {
				return;
			}
			if (data.room in rooms) {
				let roomNumber = data.room;
				let room = rooms[roomNumber];

				// Remove Player instance from players
				delete room.players[index];

				// Remove client index from indices
				let indexInIndicesArray = room.clientIndices.indexOf(index);
				if (index > -1) {
					room.clientIndices.splice(indexInIndicesArray, 1);
				}
			}
			console.log(rooms);
			break;

		case "updateName":
			if (!Socket.validateProperties(data, ["name"])) {
				return;
			}
			
			// Only updates name for the first time
			if (!session.name) {
				session.name = data.name;
			}
			
			break;
	}
}

module.exports = {
	listener: listener
}
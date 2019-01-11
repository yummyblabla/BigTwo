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

			// If player is already in a room, don't add player
			for (let eachRoom in rooms) {
				if (index in rooms[eachRoom].players) {
					return;
				}
			}

			// If the room number is in rooms
			if (data.room in rooms) {
				let roomNumber = data.room;
				let room = rooms[roomNumber];

				// Cannot join if there are more than 4 players in room
				if (room.clientIndices.length >= 4) {
					return;
				}

				// Cannot join if player is already in room
				if (index in room.clientIndices) {
					return;
				}

				// Host boolean to see if player is the first to join
				// Host can start the game
				let host;
				if (room.clientIndices.length == 0 && room.players.length == 0) {
					host = true;
				} else {
					host = false;
				}

				// Add player instance to player object
				room.players[index] = new Player.player(session.name, host);
				// Add index to indices array
				room.clientIndices.push(index);

				// Add room number to session
				session.roomNumber = roomNumber;

				curClient.send(JSON.stringify({
					type: "joinGame",
					success: true,
					host: host
				}))
			}
			console.log(rooms);
			break;

		case "leaveRoom":
			if (!Socket.validateProperties(data, [])) {
				return;
			}
			console.log(session.room);
			if (session.roomNumber in rooms) {
				let roomNumber = session.roomNumber;
				let room = rooms[roomNumber];

				// Remove Player instance from players
				delete room.players[index];

				// Remove client index from indices
				let indexInIndicesArray = room.clientIndices.indexOf(index);
				if (index > -1) {
					room.clientIndices.splice(indexInIndicesArray, 1);
				}
			}

			// Remove roomNumber from session
			delete session.roomNumber;

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

			// Also sends client the room list
			curClient.send(JSON.stringify({
				type: "roomList",
				rooms: filterRooms(rooms)
			}));
			
			break;
		case "startGame":
			if (!Socket.validateProperties(data, [])) {
				return;
			}
			let roomNumber = session.roomNumber;

			rooms[roomNumber].started = true;

			console.log(rooms);
			break;
	}
}

const filterRooms = (rooms) => {
	let filtered = {};

	for (let room in rooms) {
		filtered[room] = {
			players: rooms[room].players,
			started: rooms[room].started,
			index: room
		}
		console.log(room);
	}
	return filtered;
}

module.exports = {
	listener: listener
}
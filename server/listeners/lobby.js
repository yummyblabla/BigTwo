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

				// Cannot join if game has started
				if (room.started) {
					return;
				}

				// Host boolean to see if player is the first to join
				// Host can start the game
				let host;

				if (room.clientIndices.length == 0 && Object.keys(room.players).length == 0) {
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

				// Send client message that they joined game
				curClient.send(JSON.stringify({
					type: "joinGame",
					success: true,
					host: host,
					roomNumber: roomNumber
				}));

				updateClientsWithRoomList(clients, rooms);
			}
			console.log(rooms);
			break;

		case "leaveRoom":
			if (!Socket.validateProperties(data, [])) {
				return;
			}
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
				updateClientsWithRoomList(clients, rooms);
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
			if (!Socket.validateProperties(data, ["roomNumber"])) {
				return;
			}
			let roomNumber = data.roomNumber;

			let currentRoom = rooms[roomNumber];

			// Change state of room
			currentRoom.started = true;

			// Send clients in the room to start the game
			for (let i = 0; i < currentRoom.clientIndices.length; i++) {
				clients[currentRoom.clientIndices[i]].send(JSON.stringify({
					type: "startGame",
					placeholder: "something"
				}));
			}

			console.log(rooms);
			break;
	}
}

const updateClientsWithRoomList = (clients, rooms) => {
	for (let index in clients) {
		clients[index].send(JSON.stringify({
			type: "roomList",
			rooms: filterRooms(rooms)
		}))
	}
}

const filterRooms = (rooms) => {
	let filtered = {};

	for (let room in rooms) {
		let currentRoom = rooms[room];

		filtered[room] = {
			index: room,
			started: currentRoom.started,
			players: {}
		}
		for (let player in currentRoom.players) {
			filtered[room].players[player] = currentRoom.players[player].getPlayer();
		}
	}
	console.log(filtered);
	return filtered;
}

module.exports = {
	listener: listener
}
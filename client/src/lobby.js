import * as Socket from "./socket.js";

export default {
	requestJoin(room) {
		console.log(`Requesting to join ${room}`);
		let roomNumber = parseInt(room.substr(room.length - 1));
		Socket.send({
			type: "joinRoom",
			room: roomNumber
		})
	},

	updateName(name) {
		Socket.send({
			type: "updateName",
			name: name
		})
	},

	leaveRoom(room) {
		console.log(`Requesting to leave ${room}`);
		let roomNumber = parseInt(room.substr(room.length - 1));
		Socket.send({
			type: "leaveRoom",
			room: roomNumber
		})
	}
}
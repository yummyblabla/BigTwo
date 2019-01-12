import * as Socket from "./../socket/socket.js";

export default {
	requestJoin(roomIndex) {
		Socket.send({
			type: "joinRoom",
			room: roomIndex
		})
	},

	// Update name in server, and also ask to retrieve room list data
	updateName(name) {
		Socket.send({
			type: "updateName",
			name: name
		});
	},

	leaveRoom() {
		Socket.send({
			type: "leaveRoom"
		})
	},

	startGame(roomNumber) {
		Socket.send({
			type: "startGame",
			roomNumber: roomNumber
		})
	}
}
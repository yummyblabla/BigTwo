const Socket = require("./../socket.js");
const Player = require("./../modules/player.js");

const listener = (clients, sessionInfo, index, data) => {
	let curClient = clients[index];
	let session = sessionInfo[index];
	let rooms = Socket.rooms;

	switch (data.type) {
		case "readyUp": 
			if (!Socket.validateProperties(data, ["room"])) {
				return;
			}

			
			break;
	}
}

module.exports = {
	listener: listener
}
const Socket = require("./../socket.js");

const listener = (clients, sessionInfo, index, data) => {
	let curClient = clients[index];
	let session = sessionInfo[index];

	switch (data.type) {
		case "cards":
			if (!Socket.validateProperties(data, ["something"])) {
				return;
			}
			curClient.send(JSON.stringify({type: "test", msg: "hey"}));
			break;

		case "somethingelse":
			break;
	}
}

module.exports = {
	listener: listener
}
const Socket = require("./../socket.js");
const Player = require("./../modules/player.js");

const listener = (clients, sessionInfo, index, data) => {
	let curClient = clients[index];
	let session = sessionInfo[index];
	let rooms = Socket.rooms;
	let startedGames = Socket.startedGames;

	switch (data.type) {
		case "readyUp": 
			if (!Socket.validateProperties(data, ["gameNumber"])) {
				return;
			}
			let gameNumber = data.gameNumber;

			let game = startedGames[gameNumber];

			let players = game.getPlayers();

			players[index].setReady();
			
			let allReady = true;
			for (let playerIndex in players) {
				if (!players[playerIndex].getReady()) {
					allReady = false;
					break;
				}
			}

			if (allReady) {
				for (let i = 0; i < game.clientIndices.length; i++) {
					clients[game.clientIndices[i]].send(JSON.stringify({
						type: "allReady"
					}))
				}
				console.log("start game");
				game.startGame();
			}

			
			break;
	}
}

module.exports = {
	listener: listener
}
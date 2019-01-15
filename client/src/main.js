import * as Socket from "./socket/socket.js";
import * as pixiApp from "./app.js";
import Interactions from "./functions/interaction.js";
import Lobby from "./functions/lobby.js";

export const app = new Vue({
	el: "#app",
	data: {
		username: "",
		rooms: [],
		submittedName: true,
		inGameLobby: false,
		gameStarted: false,
		isHost: false,
		currentRoomNumber: null
	},
	computed: {
		getPlayerNames() {
			let currentRoom = this.rooms[this.currentRoomNumber];
			let playerNames = [];
			for (let player in currentRoom.players) {
				playerNames.push(currentRoom.players[player]);
			}
			return playerNames;
		}
	},
	methods: {
		requestJoin(roomIndex) {
			Lobby.requestJoin(roomIndex);
		},
		updateName() {
			if (this.username) {
				Lobby.updateName(this.username);
				this.submittedName = false;
			}
		},
		leaveRoom() {
			Lobby.leaveRoom();
			this.inGameLobby = false;
			this.currentRoomNumber = null;
		},
		startGame() {
			if (this.isHost) {
				Lobby.startGame(this.currentRoomNumber);
			}
		}
	},
	created() {
		// Start socket connection
		Socket.initialize();

		Socket.addListener("roomListUpdate", (data) => {
			if (data.type == "roomList") {
				this.rooms = data.rooms;
			}

		});

		Socket.addListener("joinGame", (data) => {
			if (data.type == "joinGame" && data.success) {
				if (data.host) {
					this.isHost = true;
				}
				this.currentRoomNumber = data.roomNumber;
				this.inGameLobby = true;
			}
		});

		Socket.addListener("startGame", (data) => {
			if (data.type == "startGame") {
				console.log("startgame");
				this.gameStarted = true;
				// Socket.removeListener("roomListUpdate");
				// Socket.removeListener("joinGame");
				pixiApp.initializePixi();
			}
		})
	}
});

// pixiApp.initializePixi();
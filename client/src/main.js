import * as Socket from "./socket/socket.js";
import Interactions from "./interaction.js";
import Lobby from "./functions/lobby.js";

let app = new Vue({
	el: "#app",
	data: {
		message: "Hello",
		username: "",
		rooms: [],
		submittedName: true,
		inGameLobby: false
	},
	computed: {

	},
	methods: {
		requestJoin(roomIndex) {
			Lobby.requestJoin(roomIndex);
		},
		updateName() {
			if (this.username !== "") {
				Lobby.updateName(this.username);
				this.submittedName = false;
			}
		},
		leaveRoom() {
			Lobby.leaveRoom();
			this.inGameLobby = false;
		},
		startGame() {
			Lobby.startGame();
		}

	},
	created() {
		Socket.addListener("roomListUpdate", (data) => {
			if (data.type == "roomList") {
				this.rooms = data.rooms;
			}

		});
		Socket.addListener("joinGame", (data) => {
			if (data.type == "joinGame" && data.success) {
				if (data.host) {

				}
				this.inGameLobby = true;
			}
		})
	}
})

Socket.initialize();
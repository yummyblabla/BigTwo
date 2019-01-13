import * as Socket from "./../socket/socket.js";

export default {
	playCards() {
		let selection = Interactions.selectedCards;
		if (selection.length > 0) {
			for (let i = 0; i < selection.length; i++) {
				console.log(selection[i]);
			}
		}
	},
	getCards() {
		console.log("hey")
		Socket.send({type: "cards", something: "now"})
	}
}
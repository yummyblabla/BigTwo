const Hand = require("./hand.js");

class Player {
	constructor(name, host) {
		// name: string, host: boolean
		this.username = name;
		this.host = host;
		this.score = 0;
		this.hand = new Hand.hand([]);
	}
}

Player.prototype.getUsername = function() {
	return this.username;
}

Player.prototype.getHand = function() {
	return this.hand;
}

Player.prototype.setHand = function(hand) {
	this.hand = hand;
}

module.exports = {
	player: Player
}
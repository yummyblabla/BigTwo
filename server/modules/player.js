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

Player.prototype.getPlayer = function() {
	let player = {
		name: this.username,
		host: this.host
	}
	return player;
}

module.exports = {
	player: Player
}
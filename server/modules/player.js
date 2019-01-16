const Hand = require("./hand.js");

class Player {
	constructor(name, index, host) {
		// name: string, index: int (client index),host: boolean
		this.username = name;
		this.index = index;
		this.host = host;
		this.score = 0;
		this.ready = false;
		this.hand = new Hand.hand([]);
	}
}

Player.prototype.getUsername = function() {
	return this.username;
}

Player.prototype.getIndex = function() {
	return this.index;
}

Player.prototype.getReady = function() {
	return this.ready;
}

Player.prototype.setReady = function() {
	this.ready = true;
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

Player.prototype.getCardsFromHand = function() {
	return this.hand.getCards();
}

module.exports = {
	player: Player
}
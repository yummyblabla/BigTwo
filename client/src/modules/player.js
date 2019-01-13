import Hand from "./hand.js";

export default class Player {
	constructor(name) {
		this.username = name;
		this.score = 0;
		this.hand = new Hand([]);
	}
}

Player.prototype.getUsername = function() {
	return this.username;
}

Player.prototype.getHand = function() {
	return this.hand;
}

Player.prototype.getCardsFromHand = function() {
	return this.hand.getCards();
}

Player.prototype.setHand = function(hand) {
	this.hand = hand;
}
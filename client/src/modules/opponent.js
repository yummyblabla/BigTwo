export default class Opponent {
	constructor(name, numberOfCards, sideView) {
		this.name = name;
		this.numberOfCards = numberOfCards;
		this.sideView = sideView;
	}
}

Opponent.prototype.getSideView = function() {
	return this.sideView;
}

Opponent.prototype.getUsername = function() {
	return this.name;
}

Opponent.prototype.getNumberOfCards = function() {
	return this.numberOfCards;
}

Opponent.prototype.setNumberOfCards = function(numberOfCards) {
	this.numberOfCards = numberOfCards;
}

Opponent.prototype.resetNumberOfCards = function() {
	this.numberOfCards = 13;
}
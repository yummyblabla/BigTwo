const Helpers = require("./helpers.js");

class Hand {
	constructor(cards) {
		this.cards = cards;
	}
}

Hand.prototype.getCards = function() {
	return this.cards;
}

Hand.prototype.getNumberOfCards = function() {
	return this.cards.length;
}

Hand.prototype.setCards = function(cards) {
	this.cards = cards;
}

Hand.prototype.discard = function(index) {
	if (index > -1) {
		this.cards.splice(index, 1);
		return true;
	} else {
		return false;
	}
}

Hand.prototype.findDiamondThree = function() {
	for (let i = 0; i < this.cards.length; i++) {
		let cardProperties = this.cards[i].getProperties();
		if (cardProperties.rank == "3" && cardProperties.suit == "D") {
			return true;
		}
	}
	return false;
}

Hand.prototype.findClubThree = function() {
	for (let i = 0; i < this.cards.length; i++) {
		let cardProperties = this.cards[i].getProperties();
		if (cardProperties.rank == "3" && cardProperties.suit == "C") {
			return true;
		}
	}
	return false;
}

Hand.prototype.findHeartThree = function() {
	for (let i = 0; i < this.cards.length; i++) {
		let cardProperties = this.cards[i].getProperties();
		if (cardProperties.rank == "3" && cardProperties.suit == "H") {
			return true;
		}
	}
	return false;
}

Hand.prototype.findSpadeThree = function() {
	for (let i = 0; i < this.cards.length; i++) {
		let cardProperties = this.cards[i].getProperties();
		if (cardProperties.rank == "3" && cardProperties.suit == "S") {
			return true;
		}
	}
	return false;
}

Hand.prototype.getIndex = function(rank, suit) {
	for (let i = 0; i < this.cards.length; i++) {
		let cardProperties = this.cards[i].getProperties();

		if (cardProperties.rank == rank && cardProperties.suit == suit) {
			return i;
		}
	}
	return -1;
}

Hand.prototype.sortCards = function() {
	this.setCards(Helpers.mergeSort(this.cards));
}

module.exports = {
	hand: Hand
}


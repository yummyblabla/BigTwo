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

Hand.prototype.discard = function(card) {
	let index = this.cards.indexOf(card);

	if (index > -1) {
		this.cards.splice(index, 1);
		return true;
	} else {
		return false;
	}
}

Hand.prototype.iterateCards = function(callback) {
	for (let i = 0; i < this.cards.length; i++) {
		callback(this.cards[i]);
	}
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

module.exports = {
	hand: Hand
}


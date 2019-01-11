class Card {
	constructor(rank, suit) {
		this.rank = rank;
		this.suit = suit;
	}
}

Card.prototype.getRank = function() {
	return this.rank;
}

Card.prototype.getSuit = function() {
	return this.suit;
}

Card.prototype.getProperties = function() {
	return {
		rank: this.getRank(), 
		suit: this.getSuit()
	};
}

module.exports = {
	card: Card
}
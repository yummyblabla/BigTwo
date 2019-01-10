export default class Opponent {
	constructor(name, numberOfCards, score) {
		this.name = name;
		this.numberOfCards = numberOfCards;
		this.score = score;
	}
}

Opponent.prototype.getNumberOfCards = function() {
	return this.numberOfCards;
}
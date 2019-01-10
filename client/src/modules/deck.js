import Card from "./card.js";
import Hand from "./hand.js";

export default class Deck {
	constructor() {
		this.deck = generateDeck();
	}
}

Deck.prototype.getDeck = function() {
	return this.deck;
}

Deck.prototype.shuffle = function() {
	for (let i = 0; i < this.deck.length; i++) {
		let rnd = Math.random() * i | 0;
		const temp = this.deck[i];
		this.deck[i] = this.deck[rnd];
		this.deck[rnd] = temp;
	}
	return this.deck;
}

Deck.prototype.distribute = function() {
	let shuffled = this.shuffle();
	let pile1 = shuffled.slice(0, 13);
	let pile2 = shuffled.slice(13, 26);
	let pile3 = shuffled.slice(26, 39);
	let pile4 = shuffled.slice(39, 52);
	return [new Hand(pile1), new Hand(pile2), new Hand(pile3), new Hand(pile4)];
}


const generateDeck = () => {
	let ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
	let suits = 'S H C D'.split(' ');

	let deck = [];

	for (let i = 0; i < ranks.length; i++) {
		for (let j = 0; j < suits.length; j++) {
			deck.push(new Card(ranks[i], suits[j]));
		}
	}

	return deck;
}
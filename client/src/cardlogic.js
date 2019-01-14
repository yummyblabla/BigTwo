import Deck from "./modules/deck.js";
import Player from "./modules/player.js";

export default {
	rankOrder: "3 4 5 6 7 8 9 10 J Q K A 2".split(' '),
	suitOrder: "D C H S".split(' '),
	suitOrderViet: "D C H S".split(' '),
	binarySearch(arrayOfCards, card) {
		// arrayOfCards = array of card instances
		// card = string with designated rank and suit
		let start = 0;
		let end = arrayOfCards.length - 1;
		let middle = Math.floor((start + end) / 2);

		while (arrayOfCards[middle].convertToString() !== card && start <= end) {
			// Compare ranks
			let cardFromArrayRank = this.rankOrder.indexOf(arrayOfCards[middle].getRank());
			let cardToFindRank = this.rankOrder.indexOf(card.substr(0, card.length - 1));

			if (cardToFindRank < cardFromArrayRank) {
				end = middle - 1;
			} else if (cardToFindRank > cardFromArrayRank) {
				start = middle + 1;
			} else {
				let cardFromArraySuit = this.suitOrder.indexOf(arrayOfCards[middle].getSuit());
				let cardToFindSuit = this.suitOrder.indexOf(card.substr(card.length - 1));

				if (cardToFindSuit < cardFromArraySuit) {
					end = middle - 1;
				} else if (cardToFindSuit > cardFromArraySuit) {
					start = middle + 1;
				}
			}
			middle = Math.floor((start + end) / 2);
		}
		if (arrayOfCards[middle].convertToString() === card) {
			return middle;
		}
		return -1;
	},
	mergeSort(cards) {
		// Cards = array of card instances
		if (cards.length <= 1) {
			return cards;
		}
		let middle = Math.floor(cards.length / 2);
		let left = this.mergeSort(cards.slice(0, middle));
		let right = this.mergeSort(cards.slice(middle));
		return this.merge(left, right);
	},
	merge(arr1, arr2) {
		let results = [];
		let i = 0;
		let j = 0;
		while (i < arr1.length && j < arr2.length) {
			let card1 = arr1[i].getProperties();
			let card2 = arr2[j].getProperties();

			let card1Rank = this.rankOrder.indexOf(card1.rank);
			let card2Rank = this.rankOrder.indexOf(card2.rank);
			if (card1Rank < card2Rank) {
				results.push(arr1[i]);
				i++;
			} else if (card2Rank < card1Rank) {
				results.push(arr2[j]);
				j++;
			} else {
				let card1Suit = this.suitOrder.indexOf(card1.suit);
				let card2Suit = this.suitOrder.indexOf(card2.suit);
				if (card1Suit < card2Suit) {
					results.push(arr1[i]);
					i++;
				} else {
					results.push(arr2[j]);
					j++;
				}
			}
		}
		while (i < arr1.length) {
			results.push(arr1[i]);
			i++;
		}
		while (j < arr2.length) {
			results.push(arr2[j]);
			j++;
		}
		return results;
	}
}

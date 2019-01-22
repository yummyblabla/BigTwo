const rankOrder = "3 4 5 6 7 8 9 10 J Q K A 2".split(' ');
const suitOrder = "D C H S".split(' ');
const suitOrderViet = "D C H S".split(' ');

const evaluateCards = (cards, currentPlay) => {
	if (currentPlay == null) {
		if (cards.length == 1) {
			return true;
		} else if (cards.length == 2) {
			return cards[0].getRank() == cards[1].getRank();
		} else if (cards.length == 3) {
			return cards[0].getRank() == cards[1].getRank() && cards[0].getRank() == cards[2].getRank();
		} else if (cards.length == 4) {
			return false;
		} else if (cards.length == 5) {
			return determineLegalFiveHand(cards);
		} else {
			return false;
		}
	} else if (currentPlay.length == 1) {
		if (cards.length != 1) {
			return false;
		} else {
			return evaluateSingle(cards[0], currentPlay[0]);
		}
	} else if (currentPlay.length == 2) {
		if (cards.length != 2) {
			return false;
		} else {
			return evaluateDouble(cards, currentPlay);
		}
	} else if (currentPlay.length == 3) {
		if (cards.length != 3) {
			return false;
		} else {
			return evaluateTriple(cards, currentPlay);
		}
	} else if (currentPlay.length == 5) {
		let valueCards = evaluateStrengthOfFiveCardHand(cards);
		let valueCurrentPlay = evaluateStrengthOfFiveCardHand(currentPlay);
		if (valueCurrentPlay[0] > valueCards[0]) {
			return false;
		} else if (valueCards[0] > valueCurrentPlay[0]) {
			return true;
		} else {
			let cardCardRank = valueCards[1].getRank();
			let cardCurrentPlayRank = valueCards[1].getRank();

			if (cardCardRank > cardCurrentPlayRank) {
				return true;
			} else if (cardCurrentPlayRank > cardCardRank) {
				return false;
			} else {
				return suitOrder.indexOf(valueCards[1].getSuit()) > suitOrder.indexOf(valueCurrentPlay[1].getSuit());
			}
		}
	}
}

const evaluateStrengthOfFiveCardHand = (cards) => {
	// cards is an array of card instances
	let flush = isFlush(cards);
	let straight = isStraight(cards);
	let fourofakind = isFourOfAKind(cards);
	let fullhouse = isFullHouse(cards);

	if (flush[0] && straight[0]) {
		return [5, flush[1]];
	} else if (fourofakind[0]) {
		return [4, fourofakind[1]];
	} else if (fullhouse[0]) {
		return [3, fullhouse[1]];
	} else if (flush[0]) {
		return [2, flush[1]];
	} else if (straight[0]) {
		return [1, straight[1]];
	} else {
		return [0];
	}
}

const determineLegalFiveHand = (cards) => {
	// cards is an array of card instances
	return isFlush(cards)[0] || isStraight(cards)[0] || isFullHouse(cards)[0] || isFourOfAKind(cards)[0];
}

const isFourOfAKind = (cards) => {
	let counter = {};
	for (let i = 0; i < cards.length; i++) {
		counter[cards[i].getRank()] = (counter[cards[i].getRank()] || 0) + 1;
	}
	for (let rank in counter) {
		if (counter[rank] == 4) {
			return [true, cards[2]];
		}
	}
	return [false];
}

const isFullHouse = (cards) => {
	let counter = {};
	for (let i = 0; i < cards.length; i++) {
		counter[cards[i].getRank()] = (counter[cards[i].getRank()] || 0) + 1;
	}
	let double = false;
	let triple = false;
	for (let rank in counter) {
		if (counter[rank] == 2) {
			double = true;
		} else if (counter[rank] == 3) {
			triple = true;
		}
	}
	return [double && triple, cards[2]];
}

const isFlush = (cards) => {
	let currentSuit = cards[0].getSuit();

	for (let i = 1; i < cards.length; i++) {
		if (cards[i].getSuit() != currentSuit) {
			return [false];
		}
	}
	return [true, cards[4]];
}

const isStraight = (cards) => {
	// need to incorporate A 2 3 4 5 and 2 3 4 5 straight
	// need to block out J Q K A 2 straight
	let currentRank = rankOrder.indexOf(cards[0].getRank());

	for (let i = 1; i < cards.length; i++) {
		let nextRank = rankOrder.indexOf(cards[i].getRank());

		if (nextRank != currentRank + 1) {
			return false;
		}
		currentRank = nextRank;
	}
	return [true, cards[4]];
}

const evaluateTriple = (cards, currentPlay) => {
	// Both currentPlay and cards are arrays of card instances
	// For triples, no need to worry about suit or which card to compare with

	if (cards[0].getRank() == cards[1].getRank() && cards[0].getRank() == cards[2].getRank()) {
		let cardRank = rankOrder.indexOf(cards[0].getRank());
		let currentPlayRank = rankOrder.indexOf(currentPlay[0].getRank());

		return cardRank > currentPlayRank;
	} else {
		return false;
	}
}

const evaluateDouble = (cards, currentPlay) => {
	// Both currentPlay and cards are arrays of card instances

	// Only evaluate if cards are the same rank
	if (cards[0].getRank() == cards[1].getRank()) {
		let cardRank = rankOrder.indexOf(cards[1].getRank());
		let currentPlayRank = rankOrder.indexOf(currentPlay[1].getRank());

		if (cardRank > currentPlayRank) {
			return true;
		} else if (currentPlayRank > cardRank) {
			return false;
		} else {
			let cardSuit = suitOrder.indexOf(cards[1].getSuit());
			let currentPlaySuit = suitOrder.indexOf(currentPlay[1].getSuit());

			return cardSuit > currentPlaySuit;
		}
	} else {
		return false;
	}
}

const evaluateSingle = (card, currentPlay) => {
	// Both currentPlay and card are card instances

	let currentPlayRank = rankOrder.indexOf(currentPlay.getRank());
	let cardRank = rankOrder.indexOf(card.getRank());

	if (cardRank > currentPlayRank) {
		return true;
	} else if (currentPlayRank > cardRank) {
		return false;
	} else {
		let currentPlaySuit = suitOrder.indexOf(currentPlay.getSuit());
		let cardSuit = suitOrder.indexOf(card.getSuit());

		return cardSuit > currentPlaySuit;
	}
}

const binarySearch = (arrayOfCards, card) => {
	// arrayOfCards = array of card instances
	// card = string with designated rank and suit
	let start = 0;
	let end = arrayOfCards.length - 1;
	let middle = Math.floor((start + end) / 2);

	while (arrayOfCards[middle].convertToString() !== card && start <= end) {
		// Compare ranks
		let cardFromArrayRank = rankOrder.indexOf(arrayOfCards[middle].getRank());
		let cardToFindRank = rankOrder.indexOf(card.substr(0, card.length - 1));

		if (cardToFindRank < cardFromArrayRank) {
			end = middle - 1;
		} else if (cardToFindRank > cardFromArrayRank) {
			start = middle + 1;
		} else {
			let cardFromArraySuit = suitOrder.indexOf(arrayOfCards[middle].getSuit());
			let cardToFindSuit = suitOrder.indexOf(card.substr(card.length - 1));

			if (cardToFindSuit < cardFromArraySuit) {
				end = middle - 1;
			} else {
				start = middle + 1;
			}
		}
		middle = Math.floor((start + end) / 2);
	}
	if (arrayOfCards[middle].convertToString() === card) {
		return middle;
	}
	return -1;
}

const mergeSort = (cards) => {
	if (cards.length <= 1) {
		return cards;
	}
	let middle = Math.floor(cards.length / 2);
	let left = mergeSort(cards.slice(0, middle));
	let right = mergeSort(cards.slice(middle));
	return merge(left, right);
}

const merge = (arr1, arr2) => {
	let results = [];
	let i = 0;
	let j = 0;
	while (i < arr1.length && j < arr2.length) {
		let card1 = arr1[i].getProperties();
		let card2 = arr2[j].getProperties();

		let card1Rank = rankOrder.indexOf(card1.rank);
		let card2Rank = rankOrder.indexOf(card2.rank);
		if (card1Rank < card2Rank) {
			results.push(arr1[i]);
			i++;
		} else if (card2Rank < card1Rank) {
			results.push(arr2[j]);
			j++;
		} else {
			let card1Suit = suitOrder.indexOf(card1.suit);
			let card2Suit = suitOrder.indexOf(card2.suit);
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

module.exports = {
	mergeSort: mergeSort,
	binarySearch: binarySearch,
	evaluateCards: evaluateCards
}
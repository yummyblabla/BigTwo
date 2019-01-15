const Socket = require("./../socket.js");
const Card = require("./../modules/card.js");

const listener = (clients, sessionInfo, index, data) => {
	let curClient = clients[index];
	let session = sessionInfo[index];

	switch (data.type) {
		case "playCards":
			if (!Socket.validateProperties(data, ["gameNumber", "cards"])) {
				return;
			}

			// Check if gameNumber is in startedGames
			if (data.gameNumber in Socket.startedGames) {
				let currentGame = Socket.startedGames[data.gameNumber];

				// Check if it's actually the player's turn
				if (currentGame.playerIndexTurn !== index) {
					return;
				}

				let currentPlay = currentGame.currentPlay;

				// sort data.cards before passing

				if (evaluateCards(data.cards, currentPlay)) {
					console.log("accepted");
					acceptedPlay(curClient);
				}

				
				// send clients of card that is played
				// send clients that update opponent's hand count
				// update currentPlay
				currentGame.changePlayerTurn();
				currentGame.sendTurnStatus();


			}
			console.log(data.cards);
			break;

		case "somethingelse":
			break;
	}
}

const acceptedPlay = (curClient) => {
	curClient.send(JSON.stringify({
		type: "playAccepted"
	}))
}

const evaluateCards = (cards, cardsInPlay) => {
	if (cardsInPlay == null) {
		if (cards.length == 1) {
			return true;
		} else if (cards.length == 2) {
			let card1 = new Card.card(cards[0].substr(0, cards[0].length - 1), cards[0].substr(cards[0].length - 1));
			let card2 = new Card.card(cards[1].substr(0, cards[1].length - 1), cards[1].substr(cards[1].length - 1));
			return card1.getRank() == card2.getRank();
		} else if (cards.length == 3) {
			let card1 = new Card.card(cards[0].substr(0, cards[0].length - 1), cards[0].substr(cards[0].length - 1));
			let card2 = new Card.card(cards[1].substr(0, cards[1].length - 1), cards[1].substr(cards[1].length - 1));
			let card3 = new Card.card(cards[2].substr(0, cards[2].length - 1), cards[2].substr(cards[2].length - 1));
			return card1.getRank() == card2.getRank() && card1.getRank() == card3.getRank();
		} else if (cards.length == 4) {
			return false;
		} else if (cards.length == 5) {
			return true;
		}
	}
}

module.exports = {
	listener: listener
}
const Socket = require("./../socket.js");
const Card = require("./../modules/card.js");
const Helpers = require("./../modules/helpers.js");

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

				// Card array to hold card instances
				let cardClasses = [];

				// Convert card strings into card classes
				for (let i = 0; i < data.cards.length; i++) {
					let cardRank = data.cards[i].substr(0, data.cards[i].length - 1);
					let cardSuit = data.cards[i].substr(data.cards[i].length - 1);
					cardClasses.push(new Card.card(cardRank, cardSuit));
				}

				// Sort the cards for easier processing
				cardClasses = Helpers.mergeSort(cardClasses);

				// Current cards in play
				let currentPlay = currentGame.currentPlay;

				// Evaluate the played cards with cards in play
				if (evaluateCards(cardClasses, currentPlay)) {
					console.log("accepted");
					acceptedPlay(curClient);

					// Send clients of the card(s) that was played
					sendClientsCardsPlayed(currentGame, session.name, data.cards);

					// Update player hand
					for (let i = 0; i < data.cards.length; i++) {
						let playerCards = currentGame.players[index].getCardsFromHand();

						// Find index of selected card with binary search
						let indexOfSelectedCard = Helpers.binarySearch(playerCards, data.cards[i]);

						currentGame.players[index].getHand().discard(indexOfSelectedCard);
					}
					
					
					// Send clients that update opponent's hand count
					console.log(currentGame.players[index]);
					sendClientsOpponentUpdate(currentGame.players[index]);

					// update currentPlay

					// Change Player Turn
					currentGame.changePlayerTurn();

					// Send clients of new turn
					currentGame.sendTurnStatus();
				}
			}
			break;

		case "playerPass":
			if (!Socket.validateProperties(data, ["gameNumber"])) {
				return;
			}

			if (data.gameNumber in Socket.startedGames) {
				let currentGame = Socket.startedGames[data.gameNumber];

				// Check if it's actually the player's turn
				if (currentGame.playerIndexTurn !== index) {
					return;
				}

				console.log("player pass");

				// Change Player Turn
				currentGame.changePlayerTurn();

				// Send clients of new turn
				currentGame.sendTurnStatus();
			}
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
			return cards[0].getRank() == cards[1].getRank();
		} else if (cards.length == 3) {
			return cards[0].getRank() == cards[1].getRank() && cards[0].getRank() == cards[2].getRank();
		} else if (cards.length == 4) {
			return false;
		} else if (cards.length == 5) {
			return true;
		}
	}
}

const sendClientsCardsPlayed = (currentGame, playerName, cardsPlayed) => {
	let clients = Socket.clients;
	let indices = currentGame.clientIndices;
	for (let i = 0; i < indices.length; i++) {
		clients[indices[i]].send(JSON.stringify({
			type: "cardPlayed",
			player: playerName,
			cards: cardsPlayed
		}))
	}
}

const sendClientsOpponentUpdate = (data) => {
	
}

module.exports = {
	listener: listener
}
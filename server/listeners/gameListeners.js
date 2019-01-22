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
				if (currentGame.playerIndexTurn != index) {
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
				if (Helpers.evaluateCards(cardClasses, currentPlay)) {
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

					if (currentGame.players[index].getHand().getNumberOfCards() == 0) {
						// If number of cards is 0, then round is over
						console.log("round over");
					} else {
						// update currentPlay
						currentGame.currentPlay = cardClasses;
						console.log(currentGame.currentPlay)

						// Change Player Turn
						currentGame.changePlayerTurn();

						// Send clients of new turn
						currentGame.sendTurnStatus();
					}
					
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
				// Player cannot pass if they have control
				if (currentGame.currentPlay == null) {
					return;
				}

				// Change Player Turn
				currentGame.changePlayerTurn();

				// Send clients of new turn
				currentGame.sendTurnStatus();

				// Increase pass counter
				currentGame.increasePassCounter();
			}
			break;
	}
}

const acceptedPlay = (curClient) => {
	curClient.send(JSON.stringify({
		type: "playAccepted"
	}))
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

module.exports = {
	listener: listener
}
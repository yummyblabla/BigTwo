import * as Socket from "./../socket/socket.js";
import Interactions from "./interaction.js";
import CardLogic from "./../cardlogic.js";
import Render from "./../render.js";
import * as pixi from "./../app.js";

export default {
	addAcceptedPlayListener() {
		Socket.addListener("playCardAccepted", (data) => {
			if (data.type == "playAccepted") {
				let selectedCards = Interactions.selectedCards;
				let currentPlayer = pixi.currentPlayer;
				for (let i = 0; i < selectedCards.length; i++) {

					let playerCards = currentPlayer.getCardsFromHand();

					// Find index of selected card with binary search
					let indexOfSelectedCard = CardLogic.binarySearch(playerCards, selectedCards[i]);

					// Discard the card
					currentPlayer.getHand().discard(indexOfSelectedCard);
				}
				Render.rerenderCards(currentPlayer);
				console.log("your play was accepted");
				Interactions.selectedCards = [];
			}
		})
	},
	addTurnListener() {
		Socket.addListener("determineTurn", (data) => {
			if (data.type == "playerTurn") {
				pixi.changeToPlayerTurn();
				pixi.setPlayerNameTurn(pixi.currentPlayer.getUsername());
				console.log("your turn");
			} else if (data.type == "opponentTurn"){
				pixi.setPlayerNameTurn(data.name);

				console.log(`${data.name}'s turn`)
			}
		})
	},
	addCardsPlayedListener() {
		Socket.addListener("playedCards", (data) => {
			if (data.type == "cardPlayed") {
				for (let i = 0; i < pixi.opponentArray.length; i++) {
					if (pixi.opponentArray[i].getUsername() == data.player) {
						pixi.opponentArray[i].setNumberOfCards(pixi.opponentArray[i].getNumberOfCards() - data.cards.length);
						
						let cardBackSprites;
						// Check if the opponent is on the side (need to generate rotated cards)

						if (pixi.opponentArray[i].getSideView()) {
							cardBackSprites = Render.generateOpponentCardsSide(pixi.opponentArray[i]);
						} else {
							cardBackSprites = Render.generateOpponentCardsNotSide(pixi.opponentArray[i]);
						}

						let handContainers = pixi.getOpponentHandContainers();

						for (let i = 0; i < handContainers.length; i++) {
							if (handContainers[i].name == pixi.opponentArray[i].getUsername()) {
								// Remove all sprites from handcontainer associated with opponent
								while (handContainers[i].children[0]) {
									handContainers[i].removeChild(handContainers[i].children[0]);
								}
								// Add card back sprites to handcontainer
								for (let j = 0; j < cardBackSprites.length; j++) {
									handContainers[i].addChild(cardBackSprites[j]);
								}
							}
						}

						return;
					}
				}
				console.log(`${data.player} played ${data.cards}`);
			}
			
		})
	}
}
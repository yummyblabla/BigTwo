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
				console.log("your turn");
			} else if (data.type == "opponentTurn"){
				console.log(`${data.name}'s turn`)
			}
		})
	}
}
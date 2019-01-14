import * as Socket from "./../socket/socket.js";
import * as vueApp from "./../main.js";
import * as pixi from "./../app.js";
import Render from "./../render.js";
import CardLogic from "./../cardlogic.js";

let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;



export default {
	selectedCards: [],

	addCardInteraction (cardSprite) {
		cardSprite.interactive = true;

		cardSprite.on("mousedown", (data) => {
			let cardID = data.target.name;
			let selection = this.selectedCards;

			if (selection.includes(cardID)) {
				removeSelection(cardID, selection);
				unselectCard(cardSprite);
			} else {
				addSelection(cardID, selection);
				selectCard(cardSprite);
			}
			
		})
	},

	addPlayButtonInteraction(buttonSprite) {
		buttonSprite.interactive = true;
		buttonSprite.on("mousedown", (data) => {
			let currentPlayer = pixi.player1;
			if (this.selectedCards.length > 0) {
				console.log(pixi.player1);
				console.log(this.selectedCards);
				for (let i = 0; i < this.selectedCards.length; i++) {
					let cardLength = this.selectedCards[i].length;
					// Create card object from card string
					let selectedCard = {
						rank: this.selectedCards[i].substr(0, cardLength - 1),
						suit: this.selectedCards[i].substr(cardLength - 1)
					}
					let playerCards = currentPlayer.getCardsFromHand();

					// Find index of selected card with binary search
					let indexOfSelectedCard = CardLogic.binarySearch(playerCards, this.selectedCards[i]);

					// Discard the card
					currentPlayer.getHand().discard(indexOfSelectedCard);

				}
				Render.rerenderCards(currentPlayer);
			}
			
		});
	}
}

const removeSelection = (cardID, array) => {
	let index = array.indexOf(cardID);
	if (index > -1) {
		array.splice(index, 1);
	}
}

const addSelection = (cardID, array) => {
	array.push(cardID);
}

const selectCard = (cardSprite) => {
	cardSprite.y -= 10;
}

const unselectCard = (cardSprite) => {
	cardSprite.y += 10;
}
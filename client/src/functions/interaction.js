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
			let currentPlayer = pixi.currentPlayer;


			if (pixi.yourTurn && this.selectedCards.length > 0) {
				Socket.send({
					type: "playCards",
					gameNumber: vueApp.app.$data.currentRoomNumber,
					cards: this.selectedCards
				})
			}
		});
	},

	addPassButtonInteraction(buttonSprite) {
		buttonSprite.interactive = true;
		buttonSprite.on("mousedown", (data) => {
			if (pixi.yourTurn) {
				Socket.send({
					type: "playerPass",
					gameNumber: vueApp.app.$data.currentRoomNumber
				})
				console.log("I pass");
			}
		})
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
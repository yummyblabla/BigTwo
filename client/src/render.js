import * as pixi from "./app.js";
import Interactions from "./functions/interaction.js";

let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

const CARD_SCALE = 0.5;
const CARD_SEPARATION_LENGTH = 30;

export default {
	renderPlayerName(player) {
		let playerText = new PIXI.Text(player.getUsername(), pixi.fontStyle);
		playerText.x = 300;
		playerText.y = 200;
		pixi.playerContainer.addChild(playerText);
	},
	generateCards(player) {
		let hand = player.getHand().getCards();

		let sprites = [];

		for (let i = 0; i < hand.length; i++) {
			let cardProperty = hand[i].getProperties();
			let card = `${ cardProperty.rank }${ cardProperty.suit }`;

			let sprite = new Sprite(resources[card].texture);
			sprite.x = 0 + i * CARD_SEPARATION_LENGTH;
			sprite.y = 0;
			sprite.scale.x = CARD_SCALE;
			sprite.scale.y = CARD_SCALE;
			sprite.name = card;
			
			sprites.push(sprite);
		}
		return sprites;
	},
	generateOpponentCardsNotSide(opponent) {
		let numberOfCards = opponent.getNumberOfCards();

		let sprites = [];

		for (let i = 0; i < numberOfCards; i++) {
			let sprite = new Sprite(resources["redBack"].texture);
			sprite.scale.x = CARD_SCALE;
			sprite.scale.y = CARD_SCALE;
			sprite.x = i * CARD_SEPARATION_LENGTH;

			sprites.push(sprite);
		}

		return sprites;
	},
	generateOpponentCardsSide(opponent) {
		let numberOfCards = opponent.getNumberOfCards();

		let sprites = [];

		for (let i = 0; i < numberOfCards; i++) {
			let sprite = new Sprite(resources.redBack.texture);
			sprite.scale.x = CARD_SCALE;
			sprite.scale.y = CARD_SCALE;
			sprite.x = 80;
			sprite.y = i * -CARD_SEPARATION_LENGTH;
			sprite.anchor.set(0.5);
			sprite.rotation = 1.56;

			sprites.push(sprite);
		}

		return sprites;
	},
	rerenderCards(player) {
		let newSprites = this.generateCards(player);

		while (pixi.playerHandContainer.children[0]) {
			pixi.playerHandContainer.removeChild(pixi.playerHandContainer.children[0]);
		}

		for (let i = 0; i < newSprites.length; i++) {
			Interactions.addCardInteraction(newSprites[i]);
			pixi.playerHandContainer.addChild(newSprites[i]);
		}
	}
}

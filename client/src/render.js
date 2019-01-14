import * as pixi from "./app.js";

let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

export default {
	generateCards(player) {
		let hand = player.getHand().getCards();

		let sprites = [];

		for (let i = 0; i < hand.length; i++) {
			let cardProperty = hand[i].getProperties();
			let card = `${ cardProperty.rank }${ cardProperty.suit }`;


			let sprite = new Sprite(resources[card].texture);
			sprite.x = 0 + i * 30;
			sprite.y = 0;
			sprite.scale.x = 0.5;
			sprite.scale.y = 0.5;
			sprite.name = card;
			
			sprites.push(sprite);
		}
		return sprites;
	},
	generateOpponentHands(opponent) {
		let numberOfCards = opponent.getNumberOfCards();

		let sprites = [];

		for (let i = 0; i < numberOfCards; i++) {
			let sprite = new Sprite(resources.redBack.texture);
			sprite.x = 10 + i * 30;
			sprite.scale.x = 0.5;
			sprite.scale.y = 0.5;

			sprites.push(sprite);
		}

		return sprites;
	},
	rerenderCards(player) {
		let newSprites = this.generateCards(player);

		while (pixi.playerContainer.children[0]) {
			pixi.playerContainer.removeChild(pixi.playerContainer.children[0]);
		}
		console.log(pixi.playerContainer);
		for (let i = 0; i < newSprites.length; i++) {
			pixi.playerContainer.addChild(newSprites[i]);
		}
	}
}

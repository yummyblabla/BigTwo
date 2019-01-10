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
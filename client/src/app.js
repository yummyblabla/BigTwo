import Deck from "./modules/deck.js";
import Player from "./modules/player.js";
import Opponent from "./modules/opponent.js";
import Render from "./render.js";
import Interactions from "./interaction.js";
import Lobby from "./lobby.js";

import * as Socket from "./socket.js";

let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

let app = new Application({ 
    width: 800,         // default: 800
    height: 600,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
});

const pushToImages = () => {
	for (let i = 0; i < 13; i++) {
		let ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
		let suits = 'S H C D'.split(' ');
		for (let j = 0; j < 4; j++) {
			images.push({
				name: `${ranks[i]}${suits[j]}`,
				url: `./cards/${ranks[i]}${suits[j]}.svg`
			});
		}
	}
};

let images = [];
pushToImages();

document.body.appendChild(app.view);

const loadProgressHandler = (loader, resource) => {
	// console.log(`loading: ${ resource.url }`)
	// console.log(`progress: ${ loader.progress }%`);
}

const setup = () => {
	// let card = new Sprite(resources["2D"].texture);
	// card.x = 0;
	// card.scale.x = 0.5;
	// card.scale.y = 0.5;
	// app.stage.addChild(card);

	let cards = Render.generateCards(player1);
	for (let i = 0; i < cards.length; i++) {
		Interactions.addCardInteraction(cards[i]);
		app.stage.addChild(cards[i]);
	}

	let opponent = Render.generateOpponentHands(opponent1);
	for (let i = 0; i < cards.length; i++) {
		app.stage.addChild(opponent[i]);
	}
}

loader
	.add(images)
	.add({name: "blueBack", url: "./cards/BLUE_BACK.svg"})
	.add({name: "redBack", url: "./cards/RED_BACK.svg"})
	.on("progress", loadProgressHandler)
	.load(setup);


const deck = new Deck();

let distribute = deck.distribute();

const player1 = new Player("Player1");
const opponent1 = new Opponent("Opponent1", 13);


player1.setHand(distribute[0]);

console.log(player1.getHand());

console.log(player1.getHand().getIndex("3", "H"))
console.log(player1.getHand().getIndex("3", "D"))
console.log(player1.getHand().getIndex("3", "C"))
console.log(player1.getHand().getIndex("3", "S"))

console.log(Interactions.selectedCards)





const playCards = () => {
	let selection = Interactions.selectedCards;
	if (selection.length > 0) {
		for (let i = 0; i < selection.length; i++) {
			console.log(selection[i]);
		}
	}
}

const getCards = () => {
	console.log("hey")
	Socket.send({type: "cards", something: "now"})
}

document.querySelector("#playCards").addEventListener("click", playCards);

document.querySelector("#getCards").addEventListener("click", getCards);

document.querySelector("#room1").addEventListener("click", () => {
	Lobby.requestJoin("room1");
})
document.querySelector("#room2").addEventListener("click", () => {
	Lobby.requestJoin("room2");
})

document.querySelector("#leave1").addEventListener("click", () => {
	Lobby.leaveRoom("room1");
})
document.querySelector("#leave2").addEventListener("click", () => {
	Lobby.leaveRoom("room2");
})



document.querySelector("#updateName").addEventListener("click", () => {
	let name = document.getElementById("name").value;
	Lobby.updateName(name);
})
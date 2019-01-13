import Deck from "./modules/deck.js";
import Card from "./modules/card.js";
import Player from "./modules/player.js";
import Opponent from "./modules/opponent.js";
import Render from "./render.js";
import Interactions from "./interaction.js";

import * as Socket from "./socket/socket.js";
import * as vueApp from "./main.js";

let gameCanvas = document.getElementById("game");

let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

export let pixiApp;

let currentPlayer;

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

const loadProgressHandler = (loader, resource) => {
	// console.log(`loading: ${ resource.url }`)
	// console.log(`progress: ${ loader.progress }%`);
}

const setup = () => {
	// Initialize player on client
	currentPlayer = new Player(vueApp.app.$data.username);

	// Add canvas to browser page
	gameCanvas.appendChild(pixiApp.view);

	// Send to server that PixiJS has loaded
	Socket.send({
		type: "readyUp",
		gameNumber: vueApp.app.$data.currentRoomNumber
	});

	// Listener to initiate game when all players are ready
	Socket.addListener("allReady", (data) => {
		if (data.type == "allReady") {
			// Remove the listener
			Socket.removeListener("allReady");

			// Listener to receive card hands
			Socket.addListener("receiveCardHand", (data) => {
				if (data.type == "cardHand") {
					let newHand = [];
					for (let i = 0; i < data.hand.length; i++) {
						newHand.push(new Card(data.hand[i].rank, data.hand[i].suit));
					}
					currentPlayer.getHand().setCards(newHand);

					let cardSprites = Render.generateCards(currentPlayer);
					for (let i = 0; i < cardSprites.length; i++) {
						pixiApp.stage.addChild(cardSprites[i]);
					}
				}
			});

			Socket.addListener("determineTurn", (data) => {
				if (data.type == "playerTurn") {
					console.log("yourTurn");
				} else if (data.type == "opponentTurn"){
					console.log(`${data.name}'s turn`)
				}
			})
		}
	})
	
	// let card = new Sprite(resources["2D"].texture);
	// card.x = 0;
	// card.scale.x = 0.5;
	// card.scale.y = 0.5;
	// app.stage.addChild(card);

	// let cards = Render.generateCards(player1);
	// for (let i = 0; i < cards.length; i++) {
	// 	Interactions.addCardInteraction(cards[i]);
	// 	app.stage.addChild(cards[i]);
	// }

	// let opponent = Render.generateOpponentHands(opponent1);
	// for (let i = 0; i < cards.length; i++) {
	// 	app.stage.addChild(opponent[i]);
	// }
}



export const initializePixi = () => {
	pixiApp = new Application({ 
	    width: 800,         // default: 800
	    height: 600,        // default: 600
	    antialias: true,    // default: false
	    transparent: false, // default: false
	    resolution: 1,       // default: 1
	    backgroundColor: 0x061639
	});

	// Load images
	loader
		.add(images)
		.add({name: "blueBack", url: "./cards/BLUE_BACK.svg"})
		.add({name: "redBack", url: "./cards/RED_BACK.svg"})
		.on("progress", loadProgressHandler)
		.load(setup);

	
}


// const player1 = new Player("Player1");
// const opponent1 = new Opponent("Opponent1", 13);
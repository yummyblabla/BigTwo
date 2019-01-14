import Deck from "./modules/deck.js";
import Card from "./modules/card.js";
import Player from "./modules/player.js";
import Opponent from "./modules/opponent.js";
import Render from "./render.js";
import Interactions from "./functions/interaction.js";

import * as Socket from "./socket/socket.js";
import * as vueApp from "./main.js";

let gameCanvas = document.getElementById("game");

let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let Container = PIXI.Container;

// Constants
const IMAGE_SCALE = 0.5;
const PLAYER_HAND_X = 400;
const OPPONENT_SIDE_Y = 575;

// Pixi Application
export let pixiApp;

// Player Class
export let currentPlayer;

// Containers
let mainContainer;
export let playerContainer;
let opponentLeftContainer;
let opponentRightContainer;
let opponentTopContainer;

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

	// uncomment this back
	// Socket.send({
	// 	type: "readyUp",
	// 	gameNumber: vueApp.app.$data.currentRoomNumber
	// });

	// Listener to initiate game when all players are ready
	Socket.addListener("allReady", (data) => {
		if (data.type == "allReady") {
			// Remove the listener
			Socket.removeListener("allReady");

			// Listener to receive initial game details and starting hands
			Socket.addListener("gameDetails", (data) => {
				if (data.type == "gameDetails") {

					initializeOpponentContainers(data.numberOfPlayers);


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
	});

	// let opponent = Render.generateOpponentHands(opponent1);
	// for (let i = 0; i < cards.length; i++) {
	// 	app.stage.addChild(opponent[i]);
	// }
	addPlayerContainer();

	let cards = Render.generateCards(player1);
	for (let i = 0; i < cards.length; i++) {
		Interactions.addCardInteraction(cards[i]);
		playerContainer.addChild(cards[i]);
	}

	createTopContainer(opponentTopContainer);
	createLeftContainer(opponentLeftContainer);
	createRightContainer(opponentRightContainer);
	
}

export const initializePixi = () => {
	pixiApp = new Application({ 
	    width: 1280,         // default: 800
	    height: 800,        // default: 600
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
		.add({name: "play", url: "./cards/play.png"})
		.on("progress", loadProgressHandler)
		.load(setup);
}

const addPlayButton = () => {
	let playButton = new Sprite(resources["play"].texture);
	playButton.x = 200;
	playButton.y = 150;
	Interactions.addPlayButtonInteraction(playButton);
	playerContainer.addChild(playButton);
}

const addPlayerContainer = () => {
	playerContainer = new Container();
	playerContainer.interactive = true;
	playerContainer.x = PLAYER_HAND_X;
	playerContainer.y = 575;
	pixiApp.stage.addChild(playerContainer);

	addPlayButton();
}

const initializeOpponentContainers = (numberOfPlayers) => {
	if (numberOfPlayers === 2) {
		createTopContainer(opponentTopContainer);
	} else if (numberOfPlayers === 3) {
		createLeftContainer(opponentLeftContainer);
		createRightContainer(opponentRightContainer);
	} else if (numberOfPlayers === 4) {
		createTopContainer(opponentTopContainer);
		createLeftContainer(opponentLeftContainer);
		createRightContainer(opponentRightContainer);
	}
}

const createTopContainer = (container) => {
	container = new Container();
	container.x = PLAYER_HAND_X;
	container.y = 20;
	pixiApp.stage.addChild(container);
	for (let i = 0; i < 13; i++) {
		let sprite = new Sprite(resources["redBack"].texture);
		sprite.scale.x = 0.5;
		sprite.scale.y = 0.5;
		sprite.x = i * 30;
		container.addChild(sprite);
	}
	
}

const createLeftContainer = (container) => {
	container = new Container();
	container.x = 20;
	container.y = OPPONENT_SIDE_Y;
	pixiApp.stage.addChild(container);
	for (let i = 0; i < 13; i++) {
		let sprite = new Sprite(resources["redBack"].texture);
		sprite.scale.x = 0.5;
		sprite.scale.y = 0.5;
		sprite.x = 80;
		sprite.y = i * -30;
		sprite.anchor.set(0.5);
		sprite.rotation = 1.56;
		container.addChild(sprite);
	}
}

const createRightContainer = (container) => {
	container = new Container();
	container.x = 1080 + 20;
	container.y = OPPONENT_SIDE_Y;
	pixiApp.stage.addChild(container);
	for (let i = 0; i < 13; i++) {
		let sprite = new Sprite(resources["redBack"].texture);
		sprite.scale.x = 0.5;
		sprite.scale.y = 0.5;
		sprite.x = 80;
		sprite.y = i * -30;
		sprite.anchor.set(0.5);
		sprite.rotation = 1.56;
		container.addChild(sprite);
	}
}



const deck = new Deck();
let hands = deck.distribute();
export const player1 = new Player("Player1");
let playerHand = player1.getHand();

for (let i = 0; i < hands[0].getCards().length; i++) {
	playerHand.addCard(hands[0].getCards()[i]);
}

playerHand.sortCards();
console.log(player1);
// const opponent1 = new Opponent("Opponent1", 13);


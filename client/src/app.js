import Deck from "./modules/deck.js";
import Card from "./modules/card.js";
import Player from "./modules/player.js";
import Opponent from "./modules/opponent.js";
import Render from "./render.js";
import Interactions from "./functions/interaction.js";
import Game from "./functions/game.js";

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

// Player / Opponent Class
export let currentPlayer;
let opponentLeft;
let opponentRight;
let opponentTop;
export let opponentArray;

// Containers
let mainContainer;
export let playerContainer;
export let playerHandContainer;
let opponentLeftContainer;
let opponentRightContainer;
let opponentTopContainer;
let opponentLeftHandContainer;
let opponentRightHandContainer;
let opponentTopHandContainer;

let opponentHandContainerArray = [];

let turnIndicatorContainer;
let playerTurnContainer;
let opponentLeftTurnContainer;
let opponentTopTurnContainer;
let opponentRightTurnContainer;

export let turnContainerArray = [];

// Images array for pixi to load from
let images = [];

// Game Parameters
export let yourTurn = false;
export let playerNameTurn = null;

// Font Style
export const fontStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 20,
	fontStyle: 'italic',
	fill: '#ffffff'
});

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

	// Initialize the container for the player
	addPlayerContainer();

	// Listener to initiate game when all players are ready
	Socket.addListener("allReady", (data) => {
		if (data.type == "allReady") {
			// Remove the listener
			Socket.removeListener("allReady");

			// Listener to receive initial game details and starting hands
			Socket.addListener("gameDetails", (data) => {
				if (data.type == "gameDetails") {

					// Add new hand to currentPlayer
					let newHand = [];
					for (let i = 0; i < data.hand.length; i++) {
						newHand.push(new Card(data.hand[i].rank, data.hand[i].suit));
					}
					currentPlayer.getHand().setCards(newHand);
					currentPlayer.getHand().sortCards();

					// Render the cards 
					let cardSprites = Render.generateCards(currentPlayer);
					for (let i = 0; i < cardSprites.length; i++) {
						Interactions.addCardInteraction(cardSprites[i]);
						playerHandContainer.addChild(cardSprites[i]);
					}

					initializeOpponentInstances(data.numberOfPlayers, data.playersInOrder);
					initializeOpponentContainers(data.numberOfPlayers);
					initializeTurnContainers(data.numberOfPlayers);
				}
			});
		}
	});

	// initializeOpponentInstances(4, ["Lucas", "Pat", "Derrick", "John"]);
	// initializeOpponentContainers(4);
	// initializeTurnContainers(4);
	Game.addTurnListener();
	Game.addAcceptedPlayListener();
	Game.addCardsPlayedListener();

}

export const initializePixi = () => {
	// Add image urls to array
	pushToImages();

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
		.add({name: "pass", url: "./cards/pass.png"})
		.add({name: "turn", url: "./cards/turn.png"})
		.on("progress", loadProgressHandler)
		.load(setup);
}


const initializeTurnContainers = (numberOfPlayers) => {
	turnIndicatorContainer = new Container();
	turnIndicatorContainer.x = 0;
	pixiApp.stage.addChild(turnIndicatorContainer);

	let createdPContainer = createPlayerTurnContainer(playerContainer, currentPlayer);
	turnIndicatorContainer.addChild(createdPContainer);
	turnContainerArray.push(createdPContainer);

	if (numberOfPlayers == 2) {
		let createdOTContainer = createOTTurnContainer(opponentTopTurnContainer, opponentTop);
		turnIndicatorContainer.addChild(createdOTContainer);
		turnContainerArray.push(createdOTContainer);
	} else if (numberOfPlayers == 3) {
		let createdOLContainer = createOLTurnContainer(opponentLeftTurnContainer, opponentLeft);
		turnIndicatorContainer.addChild(createdOLContainer);
		let createdORContainer = createORTurnContainer(opponentRightTurnContainer, opponentRight);
		turnIndicatorContainer.addChild(createdORContainer);
		turnContainerArray.push(createdOLContainer);
		turnContainerArray.push(createdORContainer);
	} else if (numberOfPlayers == 4) {
		let createdOLContainer = createOLTurnContainer(opponentLeftTurnContainer, opponentLeft);
		turnIndicatorContainer.addChild(createdOLContainer);
		let createdOTContainer = createOTTurnContainer(opponentTopTurnContainer, opponentTop);
		turnIndicatorContainer.addChild(createdOTContainer);
		let createdORContainer = createORTurnContainer(opponentRightTurnContainer, opponentRight);
		turnIndicatorContainer.addChild(createdORContainer);
		turnContainerArray.push(createdOLContainer);
		turnContainerArray.push(createdOTContainer);
		turnContainerArray.push(createdORContainer);
	}
}

const createPlayerTurnContainer = (container, player) => {
	container = new Container();
	container.x = 800;
	container.y = 750;
	container.name = player.getUsername();
	container.visible = false;
	container.addChild(createTurnSprite());
	return container;
}

const createOLTurnContainer = (container, opponent) => {
	container = new Container();
	container.x = 100;
	container.y = 645;
	container.name = opponent.getUsername();
	container.visible = false;
	container.addChild(createTurnSprite());
	return container;
}

const createOTTurnContainer = (container, opponent) => {
	container = new Container();
	container.x = 300;
	container.y = 25;
	container.name = opponent.getUsername();
	container.visible = false;
	container.addChild(createTurnSprite());
	return container;
}

const createORTurnContainer = (container, opponent) => {
	container = new Container();
	container.x = 1100;
	container.y = 650;
	container.name = opponent.getUsername();
	container.visible = false;
	container.addChild(createTurnSprite());
	return container;
}

const createTurnSprite = () => {
	let turnSprite = new Sprite(resources["turn"].texture);
	turnSprite.scale.x = 0.05;
	turnSprite.scale.y = 0.05;

	return turnSprite;
}

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

const addPlayButton = () => {
	let playButton = new Sprite(resources["play"].texture);
	playButton.x = 200;
	playButton.y = 150;
	Interactions.addPlayButtonInteraction(playButton);
	playerContainer.addChild(playButton);
}

const addPassButton = () => {
	let passButton = new Sprite(resources["pass"].texture);
	passButton.x = 100;
	passButton.y = 155;
	passButton.width = 70;
	passButton.height = 70;
	Interactions.addPassButtonInteraction(passButton);
	playerContainer.addChild(passButton);
}

const addPlayerContainer = () => {
	playerContainer = new Container();
	playerContainer.interactive = true;
	playerContainer.x = PLAYER_HAND_X;
	playerContainer.y = 575;
	pixiApp.stage.addChild(playerContainer);

	addPlayerHandContainer();
	addPlayButton();
	addPassButton();
	Render.renderPlayerName(currentPlayer);
}

const addPlayerHandContainer = () => {
	playerHandContainer = new Container();
	playerHandContainer.interactive = true;
	playerContainer.addChild(playerHandContainer);
}

const initializeOpponentContainers = (numberOfPlayers) => {
	if (numberOfPlayers === 2) {
		createTopContainer(opponentTopContainer, opponentTopHandContainer, opponentTop);
	} else if (numberOfPlayers === 3) {
		createLeftContainer(opponentLeftContainer, opponentLeftHandContainer, opponentLeft);
		createRightContainer(opponentRightContainer, opponentRightHandContainer, opponentRight);
	} else if (numberOfPlayers === 4) {
		createLeftContainer(opponentLeftContainer, opponentLeftHandContainer, opponentLeft);
		createTopContainer(opponentTopContainer, opponentTopHandContainer, opponentTop);
		createRightContainer(opponentRightContainer, opponentRightHandContainer, opponentRight);
	}
}

const createTopContainer = (container, handContainer, opponent) => {
	container = new Container();
	container.x = PLAYER_HAND_X;
	container.y = 20;
	pixiApp.stage.addChild(container);

	handContainer = new Container();
	handContainer.name = opponent.getUsername();
	handContainer.y = 20;
	opponentHandContainerArray.push(handContainer);
	container.addChild(handContainer);

	let opponentNameText = new PIXI.Text(opponent.getUsername(), fontStyle);
	opponentNameText.y = -20;
	container.addChild(opponentNameText);

	let cardBackSprites = Render.generateOpponentCardsNotSide(opponent);
	for (let i = 0; i < cardBackSprites.length; i++) {
		handContainer.addChild(cardBackSprites[i]);
	}
	
}

const createLeftContainer = (container, handContainer, opponent) => {
	container = new Container();
	container.x = 20;
	container.y = OPPONENT_SIDE_Y;
	pixiApp.stage.addChild(container);

	handContainer = new Container();
	handContainer.name = opponent.getUsername();
	handContainer.y = -20;
	opponentHandContainerArray.push(handContainer);
	container.addChild(handContainer);

	let opponentNameText = new PIXI.Text(opponent.getUsername(), fontStyle);
	opponentNameText.y = 50;
	container.addChild(opponentNameText);

	let cardBackSprites = Render.generateOpponentCardsSide(opponent);
	for (let i = 0; i < cardBackSprites.length; i++) {
		handContainer.addChild(cardBackSprites[i]);
	}
}

const createRightContainer = (container, handContainer, opponent) => {
	container = new Container();
	container.x = 1100;
	container.y = OPPONENT_SIDE_Y;
	pixiApp.stage.addChild(container);

	let opponentNameText = new PIXI.Text(opponent.getUsername(), fontStyle);
	opponentNameText.y = 50;
	container.addChild(opponentNameText);

	handContainer = new Container();
	handContainer.name = opponent.getUsername();
	handContainer.y = -20;
	opponentHandContainerArray.push(handContainer);
	container.addChild(handContainer);

	let cardBackSprites = Render.generateOpponentCardsSide(opponent);
	for (let i = 0; i < cardBackSprites.length; i++) {
		handContainer.addChild(cardBackSprites[i]);
	}
}

const initializeOpponentInstances = (numberOfPlayers, playerNameArray) => {
	let indexOfCurrentPlayer = playerNameArray.indexOf(currentPlayer.getUsername());
	let nextOpponentIndex = indexOfCurrentPlayer + 1 >= numberOfPlayers ? 0 : indexOfCurrentPlayer + 1;
	if (numberOfPlayers === 2) {
		opponentTop = new Opponent(playerNameArray[nextOpponentIndex], 13, false);
		opponentArray = [opponentTop];
	} else if (numberOfPlayers === 3) {
		opponentLeft = new Opponent(playerNameArray[nextOpponentIndex], 13, true);
		nextOpponentIndex = nextOpponentIndex + 1 >= numberOfPlayers ? 0 : nextOpponentIndex + 1;
		opponentRight = new Opponent(playerNameArray[nextOpponentIndex], 13, true);
		opponentArray = [opponentLeft, opponentRight];
	} else if (numberOfPlayers === 4) {
		opponentLeft = new Opponent(playerNameArray[nextOpponentIndex], 13, true);
		nextOpponentIndex = nextOpponentIndex + 1 >= numberOfPlayers ? 0 : nextOpponentIndex + 1;
		opponentTop = new Opponent(playerNameArray[nextOpponentIndex], 13, false);
		nextOpponentIndex = nextOpponentIndex + 1 >= numberOfPlayers ? 0 : nextOpponentIndex + 1;
		opponentRight = new Opponent(playerNameArray[nextOpponentIndex], 13, false);
		opponentArray = [opponentLeft, opponentTop, opponentRight];
	}
}

export const changeToPlayerTurn = () => {
	yourTurn = true;
}

export const setPlayerNameTurn = (name) => {
	playerNameTurn = name;
}

export const getPlayerNameTurn = () => {
	return playerNameTurn;
}

export const getOpponentHandContainers = () => {
	return opponentHandContainerArray;
}

export const getTurnContainerArray = () => {
	return turnContainerArray;
}
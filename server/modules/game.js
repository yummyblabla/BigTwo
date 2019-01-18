const Deck = require("./deck.js");
const Socket = require("./../socket.js");

const clients = Socket.clients;

class Game {
	constructor(index, players, clientIndices) {
		this.deck = new Deck.deck();
		this.started = false;
		this.gameIndex = index;
		this.players = players;
		this.clientIndices = clientIndices;
		this.numberOfPlayers = clientIndices.length;
		this.playerIndexTurn = null;
		this.currentPlay = null;
	}
}

Game.prototype.startGame = function() {
	this.started = true;

	// Distribute cards to the players
	let hands = this.deck.distribute();

	// Order of Player with names
	let orderOfPlayerNames = [];

	for (let i = 0; i < this.clientIndices.length; i++) {
		// Update hand in players object
		this.players[this.clientIndices[i]].setHand(hands[i]);
		this.players[this.clientIndices[i]].getHand().sortCards();
		// Get order of the players using names
		orderOfPlayerNames.push(this.players[this.clientIndices[i]].getUsername());
	}

	// Send game details hand with cards to clients
	for (let i = 0; i < this.clientIndices.length; i++) {
		clients[this.clientIndices[i]].send(JSON.stringify({
			type: "gameDetails",
			numberOfPlayers: this.numberOfPlayers,
			hand: hands[i].getCards(),
			playersInOrder: orderOfPlayerNames
		}));
	}
	
	// Determine who goes first
	this.determineFirst();

	// Send out JSON to clients on who goes first
	this.sendTurnStatus();
}
Game.prototype.getClientIndices = function() {
	return this.clientIndices;
}

Game.prototype.getPlayers = function() {
	return this.players;
}

Game.prototype.determineFirst = function() {
	let foundFirst = false;
	for (let playerIndex in this.players) {
		let playerHand = this.players[playerIndex].getHand();
		console.log(playerHand.findDiamondThree())
		if (playerHand.findDiamondThree()) {
			this.playerIndexTurn = playerIndex;
			foundFirst = true;
			break;
		}
	}
	if (!foundFirst) {
		for (let playerIndex in this.players) {
			let playerHand = this.players[playerIndex].getHand();

			if (playerHand.findClubThree()) {
				this.playerIndexTurn = playerIndex;
				foundFirst = true;
				break;
			}
		}
	}
	if (!foundFirst) {
		for (let playerIndex in this.players) {
			let playerHand = this.players[playerIndex].getHand();

			if (playerHand.findHeartThree()) {
				this.playerIndexTurn = playerIndex;
				foundFirst = true;
				break;
			}
		}
	}
	if (!foundFirst) {
		for (let playerIndex in this.players) {
			let playerHand = this.players[playerIndex].getHand();

			if (playerHand.findSpadeThree()) {
				this.playerIndexTurn = playerIndex;
				foundFirst = true;
				break;
			}
		}
	}
	if (!foundFirst) {
		let random = Math.floor(Math.random() * this.clientIndices.length);
		console.log("randomed")
		this.playerIndexTurn = this.clientIndices[random];
	}
	console.log(this.playerIndexTurn);
}

Game.prototype.sendTurnStatus = function() {
	for (let i = 0; i < this.clientIndices.length; i++) {
		let playerTurnName = this.players[this.playerIndexTurn].getUsername();

		if (this.clientIndices[i] === this.playerIndexTurn) {
			clients[this.clientIndices[i]].send(JSON.stringify({
				type: "playerTurn"
			}));
		} else {
			clients[this.clientIndices[i]].send(JSON.stringify({
				type: "opponentTurn",
				name: playerTurnName
			}));
		}
	}
}

Game.prototype.changePlayerTurn = function() {
	let currentTurn = this.playerIndexTurn;

	let indexInClientIndices = this.clientIndices.indexOf(currentTurn);
	indexInClientIndices++;

	if (indexInClientIndices >= this.clientIndices.length) {
		this.playerIndexTurn = this.clientIndices[0];
	} else {
		this.playerIndexTurn = this.clientIndices[indexInClientIndices];
	}
}

module.exports = {
	game: Game
}
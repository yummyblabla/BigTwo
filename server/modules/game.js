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
	}
}

Game.prototype.startGame = function() {
	this.started = true;

	// Distribute cards to the players
	let hands = this.deck.distribute();
	for (let i = 0; i < this.clientIndices.length; i++) {

		// Update hand in players object
		this.players[this.clientIndices[i]].setHand(hands[i]);

		// Send game details hand with cards to clients
		clients[this.clientIndices[i]].send(JSON.stringify({
			type: "gameDetails",
			numberOfPlayers: this.numberOfPlayers,
			hand: hands[i].getCards()
		}));
	}
	this.determineFirst();

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

		if (playerHand.iterateCards(isDiamondThree)) {
			this.playerIndexTurn = playerIndex;
			foundFirst = true;
			break;
		}
	}
	if (!foundFirst) {
		for (let playerIndex in this.players) {
			let playerHand = this.players[playerIndex].getHand();

			if (playerHand.iterateCards(isClubThree)) {
				this.playerIndexTurn = playerIndex;
				foundFirst = true;
				break;
			}
		}
	}
	if (!foundFirst) {
		for (let playerIndex in this.players) {
			let playerHand = this.players[playerIndex].getHand();

			if (playerHand.iterateCards(isHeartThree)) {
				this.playerIndexTurn = playerIndex;
				foundFirst = true;
				break;
			}
		}
	}
	if (!foundFirst) {
		for (let playerIndex in this.players) {
			let playerHand = this.players[playerIndex].getHand();

			if (playerHand.iterateCards(isSpadeThree)) {
				this.playerIndexTurn = playerIndex;
				foundFirst = true;
				break;
			}
		}
	}
	if (!foundFirst) {
		let random = Math.floor(Math.random() * this.clientIndices.length);
		this.playerIndexTurn = this.clientIndices[random];
	}
}

const isDiamondThree = (card) => {
	let cardProperties = card.getProperties();
	return cardProperties.rank === "3" && cardProperties.suit === "D";
}

const isClubThree = (card) => {
	let cardProperties = card.getProperties();
	return cardProperties.rank === "3" && cardProperties.suit === "C";
}

const isHeartThree = (card) => {
	let cardProperties = card.getProperties();
	return cardProperties.rank === "3" && cardProperties.suit === "H";
}

const isSpadeThree = (card) => {
	let cardProperties = card.getProperties();
	return cardProperties.rank === "3" && cardProperties.suit === "S";
}

module.exports = {
	game: Game
}
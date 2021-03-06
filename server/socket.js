"use strict";
const Deck = require("./modules/deck.js");

const listeners = [];

const rooms = {};
for (let i = 1; i <= 10; i++) {
	rooms[i] = {
		players: {},
		clientIndices: [],
		started: false
	};
}

const startedGames = {};

// Check origin of connection
const originIsAllowed = (origin) => {
	// logic to detect whether specified origin is allowed
	return true;
}

// Iterate through listeners
const checkListeners = (clients, sessionInfo, index, data) => {
	for (let i = 0; i < listeners.length; i++) {
		listeners[i](clients, sessionInfo, index, data);
	}
};

// Add listeners to onmessage emitter
const addListener = (listener) => {
	listeners.push(listener);
};

// Utility function that checks keys of the JSON sent to server for validation
const validateProperties = (data, properties) => {
	for (let i in properties) {
		if (!(properties[i] in data)) {
			return false;
		}
	}
	return true;
};

const removePlayerFromRoom = (sessionInfo, index) => {
	let session = sessionInfo[index];

	if (session.roomNumber) {
		let roomNumber = session.roomNumber;

		let currentRoom = rooms[roomNumber];

		// Remove player from players object
		delete currentRoom.players[index];

		// Remove index from indices array
		let indexInIndicesArray = currentRoom.clientIndices.indexOf(index);
		if (index > -1) {
			currentRoom.clientIndices.splice(indexInIndicesArray, 1);
		}

		// Check if the player is in a started game
		if (session.roomNumber in startedGames) {
			let currentGame = startedGames[roomNumber];

			delete currentGame.players[index];

			// Decrement number of players
			currentGame.numberOfPlayers--;

			// Remove index from indices array
			let indexInIndicesArray = currentGame.clientIndices.indexOf(index);
			if (index > -1) {
				currentGame.clientIndices.splice(indexInIndicesArray, 1);
			}

			if (currentGame.getEndGameStatus()) {
				delete startedGames[roomNumber];

				rooms[roomNumber].started = false;
			}
		}
	}
}

// **
// Instantiate the Websocket server
// **

const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');

const webSocketsServerPort = process.env.PORT || 8080;
const app = express();
const clients = {};
const sessionInfo = {};


const server = http.createServer(app);

server.listen(webSocketsServerPort, () => {
	console.log("Server has started.");
});

// create the server
const wsServer = new WebSocketServer({
	httpServer: server
});


// WebSocket server
wsServer.on('request', (request) => {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		console.log(request.origin + ' rejected.');
	};

	let connection = request.accept(null, request.origin);
	const ip = connection.remoteAddress;
	console.log(`${ ip } connected.`);

	// Assign index of the connection
	let index = 1;
	while (index in clients) {
		index++;
	};

	clients[index] = connection;
	sessionInfo[index] = {};

	connection.on('message', (message) => {
		if (message.type === 'utf8') {
			let data;
			console.log(message); // can comment this out later
			try {
				data = JSON.parse(message.utf8Data);

				if (!("type" in data)) {
					console.log("Invalid data structure received.");
					return;
				} else {
					checkListeners(clients, sessionInfo, index, data);
				}
			} catch (error) {
				console.log(error);
				return;
			}
		}
	});

	connection.on('error', (error) => {
		console.log(error);
	});


	connection.on('close', (connection) => {
		console.log(`${ ip } disconnected.`);

		removePlayerFromRoom(sessionInfo, index);
		
		delete clients[index];
		delete sessionInfo[index];
	});
});

module.exports = {
	addListener: addListener,
	validateProperties: validateProperties,
	rooms: rooms,
	startedGames: startedGames,
	clients: clients
}


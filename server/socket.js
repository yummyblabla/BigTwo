"use strict";

let listeners = [];

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

// **
// Instantiate the Websocket server
// **

const WebSocketServer = require('websocket').server;
const http = require('http');

const webSocketsServerPort = 1337;
const clients = {};
const sessionInfo = {};


const server = http.createServer((request, response) => {
	// process HTTP request. Since we're writing just WebSockets
	// server we don't have to implement anything.
});

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
	let index = 0;
	while (index in clients) {
		index++;
	};

	clients[index] = connection;
	sessionInfo[index] = {};

	connection.on('message', (message) => {
		if (message.type === 'utf8') {
			let data;
			console.log(message);
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
		delete clients[index];
		delete sessionInfo[index];
	});
});

module.exports = {
	addListener: addListener,
	validateProperties: validateProperties
}
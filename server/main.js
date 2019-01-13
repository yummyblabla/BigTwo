const Socket = require("./socket.js");

const Game = require("./listeners/gameListeners.js");
const Lobby = require("./listeners/lobbyListeners.js");
const Pregame = require('./listeners/pregameListeners.js');

Socket.addListener(Game.listener);
Socket.addListener(Lobby.listener);
Socket.addListener(Pregame.listener);
const Socket = require("./socket.js");

const Game = require("./listeners/game.js");
const Lobby = require("./listeners/lobby.js");

Socket.addListener(Game.listener);
Socket.addListener(Lobby.listener);
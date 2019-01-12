const Socket = require("./socket.js");

const Game = require("./listeners/game.js");
const Lobby = require("./listeners/lobby.js");
const Pregame = require('./listeners/pregame.js');

Socket.addListener(Game.listener);
Socket.addListener(Lobby.listener);
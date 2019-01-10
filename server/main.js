const Socket = require("./socket.js");

const Game = require("./listeners/game.js");

Socket.addListener(Game.listener);
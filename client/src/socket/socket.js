const onOpen = () => {
	console.log("Open socket connection");
}

const onMessage = (msg) => {
	for (let i in listeners) {
		listeners[i](JSON.parse(msg.data));
	}
}

const onError = (err) => {
	console.log(err);
}

export const onClose = () => {
	console.log("Closed socket connection");
}

export const addListener = (listenerID, listener) => {
	if (!(listenerID in listeners)) {
		listeners[listenerID] = listener;
	} else {
		return false;
	}
	return true;
}

export const removeListener = (listenerID) => {
	delete listeners[listenerID];
}

export const send = (data) => {
	socket.send(JSON.stringify(data));
}

// **
// Initialize WebSocket on Client
// **

let socket;
let listeners = {};
const localhost = "ws://localhost:8080";
const server = "ws://desolate-inlet-20461.herokuapp.com";
export const initialize = () => {
	socket = new WebSocket(localhost);
	socket.onopen = onOpen;
	socket.onmessage = onMessage;
	socket.onerror = onError;
	socket.onclose = onClose;
}


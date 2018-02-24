const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', 
		generateMessage('Admin', 'Welcome to the chat app'))

	socket.broadcast.emit('newMessage', 
		generateMessage('Admin', 'new user joined'))

	socket.on('createMessage', (msg, callback) => {
		io.emit('newMessage', generateMessage(msg.from, msg.text));
		callback();
	})

	socket.on('createLocationMessage', (location) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', location.lat, location.lon))
	})

	socket.on('disconnect', () => {
		console.log('User disconnected');
	})
});

server.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

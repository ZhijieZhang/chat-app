const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isValidString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = Object.create(Users);
users.init();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	socket.on('join', (params, callback) => {
		if (!isValidString(params.name) || !isValidString(params.room)) {
			return callback('Name or room name is invalid');
		}	

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		socket.emit('newMessage', 
			generateMessage('Admin', 'Welcome to the chat app'));
		socket.broadcast.to(params.room).emit('newMessage', 
			generateMessage('Admin', `${params.name} has joined`));
	})

	socket.on('createMessage', (msg, callback) => {
		var user = users.getUser(socket.id);

		if (user && isValidString(msg.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
		}

		callback();
	})

	socket.on('createLocationMessage', (location) => {
		var user = users.getUser(socket.id);

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.lat, location.lon))
		}
	})

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
	})
});

server.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

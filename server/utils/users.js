var Users = {
	init: function () {
		this.users = [];
	},
	addUser: function (id, name, room) {
		var user = {id, name, room};
		this.users.push(user);
		return user;
	},
	removeUser: function (id) {
		var user = this.getUser(id);
		if (user) {
			this.users = this.users.filter(user => user.id !== id);			
		}
		return user;
	},
	getUser: function (id) {
		return this.users.filter(user => user.id === id)[0];
	},
	getUserList: function (room) {
		var users = this.users.filter(user => user.room === room);
		var namesArray = users.map(user => user.name);
		return namesArray;
	}
}

module.exports.Users = Users;
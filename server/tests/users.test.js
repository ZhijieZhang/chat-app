const expect = require('expect');
const {Users} = require('../utils/users');

describe('User', () => {

	var users;

	beforeEach(() => {
		users = Object.create(Users);
		users.init();
		users.addUser(1, 'Qiuyi', 'NodeJs');
		users.addUser(2, 'Milu', 'React');	
	});

	it('should add a user', () => {
		var user = users.addUser(3, 'Zhijie', 'NodeJs');
		expect(user).toEqual({
			id: 3,
			name: 'Zhijie',
			room: 'NodeJs'
		});
		expect(users.users.length).toBe(3);
	})

	it('should remove a user', () => {
		var user = users.removeUser(1);
		expect(users.users.length).toBe(1);
		expect(users.users[0]).toEqual({
			id: 2,
			name: 'Milu',
			room: 'React'
		})
	})

	it('should return users', () => {
		var nameList = users.getUserList('React');
		expect(nameList.length).toBe(1);
		expect(nameList).toEqual(['Milu']);
	})
})
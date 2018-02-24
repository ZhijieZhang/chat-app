const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('../utils/message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var result = generateMessage('aName', 'hellow');
		expect(result.from).toBe('aName');
		expect(result.text).toBe('hellow');
		expect(result).toHaveProperty('createdAt');
	})
})

describe('generateLocationMessage', () => {
	it('should generate correct location message', () => {
		var result = generateLocationMessage('aName', 33.33, -75.56);
		expect(result.from).toBe('aName');
		expect(result.url).toBe('https://www.google.com/maps?q=33.33,-75.56');
	})
})
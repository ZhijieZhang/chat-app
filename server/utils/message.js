const moment = require('moment');

function generateMessage(from, text) {
	return {
		from: from,
		text: text,
		createdAt: moment().valueOf()
	};
}

function generateLocationMessage(from, lat, lon) {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat},${lon}`,
		createdAt: moment().valueOf()
	}
}

module.exports = {
	generateMessage,
	generateLocationMessage
};
var socket = io();

function scrollToBottom() {
  var messages = jQuery('#msgs');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
	console.log('Connected to server');
	var params = jQuery.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('no err');
		}
	});
})

socket.on('disconnect', function() {
	console.log('Disconnected from server');
})

socket.on('updateUserList', function (users) {
	console.log('Users', users);
	var ol = jQuery('<ol></ol>');
	users.forEach(function (user) {
		console.log(user);
		ol.append(jQuery('<li></li>').text(user));
	});
	jQuery('#users').html(ol);
})

socket.on('newMessage', function(msg) {
	var formattedTime = moment(msg.createdAt).format('h:mm');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: msg.text,
		from: msg.from,
		createdAt: formattedTime
	})
	jQuery('#msgs').append(html);
	scrollToBottom();
})

socket.on('newLocationMessage', function(locationMsg) {
	var formattedTime = moment(locationMsg.createdAt).format('h:mm');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: locationMsg.from,
		url: locationMsg.url,
		createdAt: formattedTime
	})
	jQuery('#msgs').append(html);
	scrollToBottom();
})

jQuery('#msg-form').on('submit', function(event) {
	event.preventDefault();

	var textbox = jQuery('[name=msg]');

	socket.emit('createMessage', {
		from: 'User',
		text: textbox.val()
	}, function() {
		textbox.val('');
	});
})

var locationbtn = jQuery('#send-location');
locationbtn.on('click', function(event) {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationbtn.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function(position) {
		locationbtn.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			lat: position.coords.latitude,
			lon: position.coords.longitude
		})
	}, function() {
		locationbtn.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location');
	})
})
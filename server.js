//Require
//		Here we import the modules we added to our dependencies earlier (package.json).
//		We also import the built-in http module to create a webserver.
		var express = require('express'), 
		app = express(),
		http = require('http'),
		socketIo = require('socket.io');

		
//HTTP-Server
//		Next up we start the webserver and initialize socket.io. 
//		We also tell express to look in our ./public-directory for requested files
		var server =  http.createServer(app);
		var io = socketIo.listen(server);
		server.listen(8080);
		
// 	add directory with our static files
		app.use(express.static(__dirname + '/public'));
		console.log("Server running on 127.0.0.1:8080");

		
//Socket sending/receiving
//		We declare an array line_history where we keep track of all lines ever drawn.
		var line_history = [];
		var letter_history = [];
//		Here a handler for new incoming connections is registered. Whenever a new client connects, 
//		this function is called and the socket of the new client is passed as an argument.
		io.on('connection', function (socket) {


//Bringing new clients up to date
//		Inside the handler we first send all the lines in our line_history to the new client. 
//		That way a client who joins late will see the whole doodle and not just the lines drawn since they joined.
		for (var i in line_history) {
		socket.emit('draw_line', { line: line_history[i] } );
		}
		for (var i in letter_history) {
		socket.emit('write_letter', { letter: letter_history[i] } );
		}
//		Finally we add a handler for our own message-type draw_line to the new client.
//		Each time we receive a line we add it to the line_history and send it to all connected 
//		clients so they can update their canvases.
		socket.on('draw_line', function (data) {
// 	add received line to history 
		line_history.push(data.line);
// 	send line to all clients
		io.emit('draw_line', { line: data.line });
		});//end socket on drawline
				socket.on('write_letter', function (data) {
// 	add received line to history 
		letter_history.push(data.letter);
// 	send line to all clients
		io.emit('write_letter', { letter: data.letter});
		});//end socket on drawline
		socket.on('pointer_move', function (data) {
// 	send line to all clients
		io.emit('pointer_move', { pointer: data.pointer});
		});//end socket on drawline
		});//end io.on connection
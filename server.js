var express = require('express');
var app = express();
http = require('http'),
socketIo = require('socket.io');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));		
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




		var line_history = [];
var letter_history = new Array(100000); 
 var i=0;
 while (i<100000) { myArray[i] =0; i++; }
 var BLength = 0 ;

		io.on('connection', function (socket) {



		for (var i in line_history) {
		socket.emit('draw_line', { line: line_history[i] } );
		}
		for (var i in letter_history) {
		socket.emit('write_letter', { letter: letter_history[i] } );
		}

		socket.on('draw_line', function (data) {

		line_history.push(data.line);

		io.emit('draw_line', { line: data.line });
		});
				socket.on('write_letter', function (data) {

letter_history[ BLength++ ] = (data.letter);
	

		io.emit('write_letter', { letter: data.letter});
		});
		socket.on('pointer_move', function (data) {

		io.emit('pointer_move', { pointer: data.pointer});
		});
		});
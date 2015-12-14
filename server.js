var express = require('express');
var app = express();
http = require('http'),
    socketIo = require('socket.io');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
var letter_history = new Array(100000);
var history_i = 0;
var chat_history = [];
var msg = "";

io.on('connection', function(socket) {
	 socket.on('connected', function(data) {

		     for (i = 0; i < history_i; i++) {
			letter = letter_history[i];			
			 	if(-data.dragContainerX < letter[1] && letter[1] < -data.dragContainerX+data.width && -data.dragContainerY <letter[2] && letter[2]<-data.dragContainerY+data.height){		
				 
        socket.emit('write_letter', {
            letter: letter_history[i]
        });
		
				}
		
		
    }
		 
		 
		 
	 })
	

	
	
	
    for (var i in chat_history) {
        socket.emit('say_message', {
            message: chat_history[i]
        });
    }
	
	
	
	
    socket.on('write_letter', function(data) {
        letter_history[history_i++] = data.letter;
        io.emit('write_letter', {
            letter: data.letter
        });
    });
	
	
    socket.on('say_message', function(data) {
        msg = data.message;
        chat_history.push(data.message);
        if (chat_history.length > 40) {
            chat_history.shift();
        }
		
		
        io.emit('say_message', {
            message: msg
        });
    });
	
	
    socket.on('alert_message', function(data) {
        io.emit('alert_message', {
            alert: data.alert
        });
    });
	
	
});
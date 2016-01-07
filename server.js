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
var match = false;

io.on('connection', function(socket) {
	
	
	 socket.on('connected', function(data) {

		     for (i = 0; i < history_i; i++) {
				 var background = "";
			letter = letter_history[i];			
			 	if(-data.dragContainerX < letter[1] && letter[1] < -data.dragContainerX+data.width && -data.dragContainerY-letter[5] <letter[2] && letter[2]<-data.dragContainerY+data.height){
if(letter[0]==32 && letter[7] !== "098f6bcd4621d373cade4e832627b4f6" ){letter_history[i] = 0}
				
				if(letter[0]!==32 && letter[7] !== "098f6bcd4621d373cade4e832627b4f6" || letter[7] == "098f6bcd4621d373cade4e832627b4f6" && letter[0]!==160 ){
				 if(letter[7] == "098f6bcd4621d373cade4e832627b4f6"){
					background = "#eee" 
				 }
        socket.emit('write_letter', {
            letter: letter_history[i],
			background:background
			
        });
		}
				}//
		
		
    }
		 
		 
		 
	 })
	

	
	
	
    for (var i in chat_history) {
        socket.emit('say_message', {
            message: chat_history[i],
			connect: "new"
        });
    }
	
	
	
	
    socket.on('write_letter', function(data) {
		match = false;
		var replaced = 0;
		for(i=0;i<history_i;i++){
			if(Math.abs(data.letter[1]-letter_history[i][1]) < (data.letter[4]) && Math.abs(data.letter[2]-letter_history[i][2]) < (data.letter[5]) &&  (data.letter[1]-letter_history[i][1]) <= 0 && (data.letter[2]-letter_history[i][2]) <= 0){
				 match = true;
				 if( letter_history[i][7]!=="098f6bcd4621d373cade4e832627b4f6" || data.letter[7]== "098f6bcd4621d373cade4e832627b4f6" || letter_history[i][7]=="098f6bcd4621d373cade4e832627b4f6" && letter_history[i][0]==160 ){
					  
				if(data.letter[1] == letter_history[i][1] && data.letter[2] == letter_history[i][2] )	  {
					  
					  letter_history[i] = data.letter;
			 io.emit('replace_letter', {
            letter: data.letter,
			id:i
        });
		replaced = 1;
		 }
		 else if (!replaced){
					  
	  
					  letter_history[i] = data.letter;
			 io.emit('replace_letter', {
            letter: data.letter,
			id:i
        });
		replaced = 1;
			 }
				 		else {
					  
					 letter_history[i][0] = 0;
					 letter_history[i][8] = 0;
		
			 }

		}
			}
					
		}
		if (!match){
			 var background = "";
			  letter_history[history_i++] = data.letter;
			  
			  
			  
					 if(data.letter[7] == "098f6bcd4621d373cade4e832627b4f6"){
					background = "#eee" 
				 }
			  	   io.emit('write_letter', {
            letter: data.letter,
			background:background
        });
			
		}
		

      
       








    });
	
	socket.on('url_link', function(data) {
		var x = data.location[0];
		var y = data.location[1];
		
for (i = 0; i < history_i; i++) {
	if(x== letter_history[i][1] && y == letter_history[i][2]){
if((/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/).test(letter_history[i][8])){



 io.emit('url_link', {
            location: letter_history[i][8]
        });
		
		
		}
		else if ((/^javascript:/).test(letter_history[i][8])){
		 io.emit('url_link', {
            location: letter_history[i][8]
        });
		}
		
	return 
	}
		
	
};	
	})
	
    socket.on('say_message', function(data) {
        msg = data.message;
        chat_history.push(data.message);
        if (chat_history.length > 40) {
            chat_history.shift();
        }
		
		
        io.emit('say_message', {
            message: msg,
			connect: "old"
        });
    });
	
	
    socket.on('alert_message', function(data) {
		//check to see if the person has the password to send messages.
		if(data.alert[1]=="f831f40d33e621e1e837e21d1d59dd13"){ 
		io.emit('alert_message', {alert: data.alert, notify:"Message sent."});
		}
		//if the wrong pass is place, send an error.
		else{
			io.emit('alert_message', {notify:"Error: message not sent."});
			}
    });
	
	
	
	    socket.on('find_owner', function(data) {
		//check to see if the person has the password to send messages.
		if(data.owner[2]=="f831f40d33e621e1e837e21d1d59dd13"){ 
		var letter_owner = "";
		for (var i in letter_history){
			if(data.owner[0] == letter_history[i][1] && data.owner[1] == letter_history[i][2]){
			letter_owner = 	letter_history[i][7]
			}
		}
		io.emit('find_owner', {owner: data.owner, findOwner:letter_owner});
		}
    });
	
	    socket.on('admin', function(data) {
if(data.admin[0]=="f831f40d33e621e1e837e21d1d59dd13"){
	 io.emit('admin', {
            id: ["098f6bcd4621d373cade4e832627b4f6",data.admin[1]]
        });
}
        })
	
	
});
var teleport = function(){};
var sendalert = function() {};
var findOwner = function() {};
var protect = function(){};
var w = {};
var stage;
var dragContainer;
var dragContainerAlt;
$(document).on("ready pageinit",function() {
var	clearContainer = false;
var linkText = "";
var tileWidth = 10;
var tileHeight = 18;
var textSize = 15;
var socket = io.connect();
var fontSize;
var pixelData;
var character;
var flipX = 0;
var isCtrl = false;
var isShift = false;
var can_admin = false;
var defaultuser = "anon"+Math.random();
var user_id = Math.random();
var oldname =" ";
var writtenamount = 0;
var old_location;
var chat_is_closed = true;
var unicode_is_closed = true;
var needs_updated = false;
var randomColor = false;
var canPaste = true;
var position = {
    x: 0,
    y: 0,
    clickX: 0,
    clickY: 0,
    highlightX: 0,
    highlightX: 0,
    highlightY: 0
};
function reposition(type,x,y){
	if(type == "getpos"){
		position.x = stage.mouseX - dragContainer.x;
		position.y = stage.mouseY - dragContainer.y;
		position.x = (Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth;
		position.y = (Math.ceil(position.y / tileHeight) * tileHeight) - tileHeight;
		position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
		position.highlightY = (Math.ceil(position.y / tileHeight) * tileHeight) + dragContainer.y;
		position.clickX = position.highlightX;
		position.clickY = position.highlightY;
		$(".highlight").css({ "left": "" + (position.highlightX) + "px","top": "" + position.highlightY + "px"});
		}
	else if(type == "enter"){
        position.x = position.clickX - dragContainer.x + tileWidth;
        position.y = (position.clickY - dragContainer.y) + tileHeight;
        position.x = (Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth;
        position.y = (Math.ceil(position.y / tileHeight) * tileHeight);
        position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
        position.highlightY = (Math.ceil(position.y / tileHeight) * tileHeight) + dragContainer.y;
        position.clickX = position.highlightX;
        position.clickY = position.highlightY;
		 $(".highlight").css({"left": "" + (position.highlightX) + "px","top": "" + position.highlightY + "px" });
	}
	else if(type == "font"){
		position.x = (Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth;
		position.y = (Math.ceil(position.y / tileHeight) * tileHeight) - tileHeight;
		position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
		position.highlightY = (Math.ceil(position.y / tileHeight) * tileHeight) + dragContainer.y;
		position.x = (Math.ceil(position.x / tileWidth) * tileWidth) + tileWidth;
		position.y = (Math.ceil(position.y / tileHeight) * tileHeight) + tileHeight;
		position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) - dragContainer.x;
		position.highlightY = (Math.ceil(position.y / tileHeight) * tileHeight) - dragContainer.y;
		$(".highlight").height(tileHeight).width(tileWidth);
		$(document).one("input click",function(){$(".highlight").css({ "left": "" + (position.highlightX) + "px","top": "" + position.highlightY + "px"});})
	
	}
	else if(type == "setSelected"){
		position.x = (x*tileWidth)+tileWidth
		position.y = -(y*tileHeight)+tileHeight
		position.x = ((Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth);
		position.y = (Math.ceil(position.y / tileHeight) * tileHeight) - tileHeight;
		position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
		position.highlightY = (Math.ceil(position.y / tileHeight) * tileHeight) + dragContainer.y;
		position.clickX = position.highlightX;
		position.clickY = position.highlightY;
		$(".highlight").css({ "left": "" + (position.highlightX) + "px","top": "" + position.highlightY + "px"});
	}
}
function roundNumber (num,nearestNum){
	return Math.max( Math.round((num) * 10) / 10 ).toFixed(nearestNum);
};

function paste(word) {
if(canPaste){
	canPaste = false;
    for (var i in word) {
        if (word[i] == "\n") {
            world.triggerEnter();
        }
        else {
            write(word[i]);
        }
    }
	word = "";
	canPaste = true;
	}
}


var new_location = {
		x:0,
		y:0
};
var updateArea = function (){
	old_location = {
		x:dragContainer.x,
		y:dragContainer.y
	}
var oldArray = dragContainer.children;

dragContainerAlt = new createjs.Container();
dragContainerAlt.x = dragContainer.x;
dragContainerAlt.y = dragContainer.y
        stage.addChild(dragContainerAlt);
dragContainerAlt.children = oldArray;
dragContainer.children=[];
setInterval(function(){
	if(clearContainer){
	dragContainerAlt.children=[];
	stage.removeChild(dragContainerAlt);
	clearContainer = false;
}},100)
				

		socket.emit('connected',{
			dragContainerX: [dragContainer.x],
			dragContainerY: [dragContainer.y],
			width: $(window).width(),
			height: $(window).height()
			
		})}
		
		socket.on('clearContiner', function(){
clearContainer=true;
setTimeout(function(){
	for(i=dragContainer.children.length;i>0;i--){
	if(typeof dragContainer.children[i] !== "undefined"){
	if(typeof dragContainer.children[i].graphics !== "undefined"){

//dragContainer.removeChildAt(i)	
	

	}}
}
	
},5000)
		})
	
//		Create two canvases the size of the window.
        $("body").append('<canvas id="canvas" width="' + $(window).width() * 2 + '" height="' + $(window).height() * 2 + '"></canvas><canvas id="canvas_highlight" width="' + $(window).width() * 2 + '" height="' + $(window).height() * 2 + '"></canvas>');

//		Create a stage for the general canvas
        stage = new createjs.Stage("canvas");
//		This runs on every tick.		
        createjs.Ticker.addEventListener("tick", tick);		
		function tick(event) {stage.update();}
//		The DragBox listens to mouse events.
        var dragBox = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, stage.canvas.width, stage.canvas.height));
//		when the mouse is down drag.		
        dragBox.addEventListener("mousedown", startDrag);
		dragBox.addEventListener("touchstart", startDrag);
//		whenever the user click on the window thier click position is captured.
        dragBox.addEventListener("click", getPos);
//		add the box to the stage.
        stage.addChild(dragBox);     
// 		Container to drag around
        dragContainer = new createjs.Container();
        stage.addChild(dragContainer);
        // Drag
		var offset = new createjs.Point();
		updateArea();	
		
		
//-----------------------------------------	| public function which writes a letter to the canvas.
  var write = function(one_letter, color,url) {
	  if(typeof url == "undefined"){url = linkText;}
	  if(url !==""){
		  color = "rgb(0, 0, 255)"
	  }
// 		if you dont specify a color the color is the jscolor      
		if(typeof color == "undefined" && !randomColor){color = document.getElementById("jscolor_id").style.backgroundColor}
		if(typeof url == "undefined"){url = linkText;}

//		if you have random color on do random colors		
		else if (randomColor && url == ""){ color = ("#"+Math.floor(16777215*Math.random()).toString(16))};
//		send the letter data to socket.
		socket.emit('write_letter', {letter: [one_letter.charCodeAt(0), position.x, position.y, textSize, tileWidth, tileHeight,color,user_id,url]});
//		move the positions on the page over a character space.
		position.x += tileWidth;position.highlightX += tileWidth;
//		Move the highlight location. | TODO: make the highlight on the canvas.
		$(".highlight").css({"left": "" + (position.highlightX) + "px", "top": "" + position.highlightY + "px"});		
};//write letter
	

//-----------------------------------------	| what to do when you recive write latter command from socket.io
		socket.on('write_letter', function(data) {
//		Data.letter is all of the letter information			
		var letter = data.letter;
//		write the letter to the canvas.
var g = new createjs.Graphics().beginFill("#ffffff").drawRect(letter[1]-1, letter[2] - 1, letter[4]+1, letter[5]); var box = new createjs.Shape(g); dragContainer.addChild(box);
if(data.background!==""){
	var g = new createjs.Graphics().beginFill(data.background).drawRect(letter[1], letter[2] - 1, letter[4], letter[5]); var box = new createjs.Shape(g); dragContainer.addChild(box);
}

		var text = new createjs.Text("" + String.fromCharCode(data.letter[0]) + "", "" + letter[3] + "px Courier New",letter[6]);
//		make the location of the text.
		text.x = letter[1];
		text.y = letter[2];
//		add text to canvas
		dragContainer.addChild(text);
		
});//end write letter


//-----------------------------------------	| this is ran when you recieve a replace_letter from the canvas.
		socket.on('replace_letter', function(data) {

//		all letter information from server
		letter = data.letter;
//		cover old text with white square. | TODO : remove letter from canvas instead of hiding it.
		var g = new createjs.Graphics().beginFill("#ffffff").drawRect(letter[1]-1, letter[2] - 1, letter[4]+1, letter[5]); var box = new createjs.Shape(g); dragContainer.addChild(box);
//		write the letter to the canvas.
		var text = new createjs.Text("" + String.fromCharCode(data.letter[0]) + "", "" + letter[3] + "px Courier New",letter[6]);
//		make the location of the text.
		text.x = letter[1];
		text.y = letter[2];
//		add text to canvas"

		dragContainer.addChild(text);
});//end replace letter
 
 
//-----------------------------------------	| this is ran when you start to drag.
		function startDrag(event) {
//		move the highlight somewhere away.
		$(".highlight").css({"left": "","top": ""});
		offset.x = stage.mouseX - dragContainer.x;
		offset.y = stage.mouseY - dragContainer.y;
//		once you have the offset, and tou are dragging, run the do drag
		event.addEventListener("mousemove", doDrag)
		event.addEventListener("touchstart", doDrag);
}
		
//-----------------------------------------	| gets and sets all positions.
        function getPos(event) {
		reposition("getpos");
		}
        
teleport= function(x,y) {
dragContainer.x = Math.ceil(x * -1000);
dragContainer.y = Math.ceil(y * 1000);
dragContainerAlt.x = Math.ceil(x * -1000);
dragContainerAlt.y = Math.ceil(y * 1000);
//		recalculate the coords
		$("#coord-x").text(x);
		$("#coord-y").text(y);
		updateArea();
//		reset the location.
		old_location.x = new_location.x;
		old_location.y = new_location.y;
		}
		
//-----------------------------------------	| actually drags the container
        function doDrag(event) {
//		reposition drag container
		dragContainer.x = event.stageX - offset.x;
		dragContainer.y = event.stageY - offset.y;
			dragContainerAlt.x = event.stageX - offset.x;
		dragContainerAlt.y = event.stageY - offset.y;
//		recalculate the coords
		$("#coord-x").text((Math.ceil(offset.x / 1000)-1));
		$("#coord-y").text((((Math.ceil(offset.y / 1000)) * -1)+1));
//		the the new position.
		new_location = {x:dragContainer.x, y:dragContainer.y}
}		// Update the stage


//		run specific functions when the mouse is down or up.
		$(document).on("keydown mouseup",function(){
//		If the new location is not the old location 	
		if(new_location.x !== old_location.x && new_location.y !== old_location.y){
//		update the screen
		updateArea();
//		reset the location.
		old_location.x = new_location.x;
		old_location.y = new_location.y;
		}//end if noew laocation
})

//-----------------------------------------	| Just like ywot, constantly selects the input
        setInterval(function() {
//		if the unicode table is not open, if the chatinput is not selected, and if the nickname is not selected
		if (!$(".chatinput").is(":focus") && !$("#nick").is(":focus") && unicode_is_closed && !$(".swal-input").is(":focus") ) {
//		then select the input for the canvas
		$("#capture").select();
		}//if others or not selcted
});



//-----------------------------------------	| similar to old wcammand of ywot
var world = {
//		this is called to create an enter equivelent	
    triggerEnter: function(amount) {
		if(typeof amount == "undefined"){
			amount = 1;
		}
		if(typeof amount == "string"){
			amount = amount.length;
		}
		for(i=0;i<amount;i++){
		reposition("enter");
		}
    },
//		this moves the cursor is a specific direction
    moveCursor: function(dir,amount) {
		
		if(typeof amount == "undefined"){amount = 1;}
		for(i=0;i<amount;i++){
        if (dir == "right") {
            $(".highlight").css({
                "left": "" + (position.highlightX + tileWidth) + "px",
                "top": "" + position.highlightY + "px"
            });
            position.highlightX += tileWidth;
            position.x += tileWidth;
        }
        else if (dir == "left") {
            $(".highlight").css({
                "left": "" + (position.highlightX - tileWidth) + "px",
                "top": "" + position.highlightY + "px"
            });
            position.highlightX -= tileWidth;
            position.x -= tileWidth;
        }
        else if (dir == "up") {
            $(".highlight").css({
                "left": "" + (position.highlightX) + "px",
                "top": "" + (position.highlightY - tileHeight) + "px"
            });
            position.highlightY -= tileHeight;
            position.y -= tileHeight;
        }
        else if (dir == "down") {
            $(".highlight").css({
                "left": "" + (position.highlightX) + "px",
                "top": "" + (position.highlightY + tileHeight) + "px"
            });
            position.highlightY += tileHeight;
            position.y += tileHeight;
        }
//		this moves the cursor 4 spaces right
        else if (dir == "tab") {
			var sizeX = tileWidth;
			var sizeY = 0;
			var amount = 2;
			if(isShift){
world.triggerEnter(2);
return false;
			}

			
            $(".highlight").css({
                "left": "" + (position.highlightX + (sizeX * amount)) + "px",
                "top": "" + (position.highlightY + (sizeY * amount)) + "px"
            });
            position.highlightX += (sizeX * amount);
            position.x += (sizeX * amount);
			position.highlightY += (sizeY * amount);
            position.y += (sizeY * amount);
			
        }
//		this moves the cursor backwards.	
        else if (dir == "backspace") {
            $(".highlight").css({
                "left": "" + (position.highlightX - (tileWidth * 2)) + "px",
                "top": "" + position.highlightY + "px"
            });
            position.highlightX -= (tileWidth * 2);
            position.x -= (tileWidth * 2);
        }
		else {
		//if the browser does not support table, just return an array.
if (typeof console.table == "undefined") {console.table = function(a) {return a;};}
console.table([{
    direction: "left, right, up, down, tab, backspace",
    amount: "sting, number, blank/undefined",
    description: "w.moveCursor(direction,amount); If the amount is undefined, the function will run once. If the amount is a string, the function will run the strings length"
}]);
		}
}},
eraseCell: function(character){
if(typeof character == "undefined"){character = " ";}
write(character[0]);
world.moveCursor("left");	
}
};
w = {
	triggerEnter: world.triggerEnter,
	moveCursor: world.moveCursor,
	typeChar: function(letter){paste(letter);},
	setSelected: function(x,y){reposition("setSelected",x,y);},
	getCellCoords: function(){return [position.x/tileWidth,-position.y/tileHeight]},
	eraseCell: world.eraseCell	
}

//-----------------------------------------	| whenver capture gets input data
        $("#capture").on("input", function() {
			
		var capture = $("#capture").val();
		$("#capture").val("");
//		check if capture is defined
		if (typeof capture[0] !== "undefined") {
//		check if capture is a newline character, if it is, trigger enter.
		if (capture == "\n") {world.triggerEnter();return;}
		if(isCtrl && can_admin && capture[0] == " "){
			capture = " ";
		}
//		if it is not a newline, paste the data
		paste(capture);
		capture = "";
		}//end of not undefined,

		});

$(document).on("keyup", function(e) {
	var key = 'which' in e ? e.which : e.keyCode;
	if (key == 17) {
				isCtrl = false;
				
			}
				if (key == 16) {
				isShift = false;
				
			}
			
})

//-----------------------------------------	| KEYDOWN EVENTS
		$(document).on("keydown", function(e) {
					var key = 'which' in e ? e.which : e.keyCode;
//		if the unicode table is closed, nich and chatinput are not selected			
		if (!$(".chatinput").is(":focus") && !$("#nick").is(":focus") && unicode_is_closed && !$(".swal-input").is(":focus")) {

//		down arrow
		if (key == 40) {world.moveCursor("down");}
//		right arrow
		if (key == 39) {world.moveCursor("right");}
//		up arrow
		if (key == 38) {world.moveCursor("up");}
//		left arrow
		if (key == 37) {world.moveCursor("left");}
//		tab
		if (key == 9) {e.preventDefault();
				e.stopPropagation();world.moveCursor("tab");}
//		backspace
		if (key == 8) {write(" ");world.moveCursor("backspace");}
		}//only if others are not selected
		if (key == 13 && $(".chatinput").is(":focus") && !isShift){e.preventDefault(); $("#send-btn").trigger("click");}
		if (key == 17) {isCtrl = true;}
		if (key == 16) {isShift = true;}
});


//		This is ran automatically. creates a unicode table.
var stuff = " <tbody><tr>";
for(i=0; i<800;i++){
stuff+="<td>"+(String.fromCharCode(i+9472))+"</td>"
if (i%40==0 && i!==0){stuff += "</tr><tr>"}
}
stuff += "</tr></tbody>"
$(".vertical-center table").html(stuff)


//-----------------------------------------	| this changes font sizes.
fontSize = function(size) {
    if (size == "bigger") {
        if (tileWidth < 80) {
            tileWidth = tileWidth * 2;
            tileHeight = tileHeight * 2;
            textSize = (textSize * 2) + 1;
        }
    }
    if (size == "smaller") {
        if (tileWidth > 10) {
            tileWidth = tileWidth / 2;
            tileHeight = tileHeight / 2;
            textSize = (textSize - 1) / 2;
        }
    }
	    if (size == "smallest") {

            tileWidth = 5;
            tileHeight = 7;
            textSize = 9;
    }
		    if (size == "biggest") {
            tileWidth = 160;
            tileHeight = 288;
            textSize = 255;
    }
reposition("font");
   
};


//make sure mouse is not hidden
var mousehide = false;
// finds position
function findPos(obj) {var curleft = 0,curtop = 0;if (obj.offsetParent) {do { curleft += obj.offsetLeft;curtop += obj.offsetTop;} while (obj = obj.offsetParent);return {x: curleft, y: curtop};}return undefined;}	
// changes rgb values into hex values 
function rgbToHex(r, g, b) {if (r > 255 || g > 255 || b > 255) {throw "Invalid color component";}return ((r << 16) | (g << 8) | b).toString(16);}
//When the mouse moves the tooltip moves.
		$(document).on("mousemove.tooltip", function(e) {$("#tooltip").offset({left: e.clientX + 20,top: e.clientY});});
//when a tool is hovered make the tooltip text change
		$(".toolbar-tool").hover(function() {$("#tooltip").html($(this).data("tooltip").replace(/ /g, "&nbsp;"));});
//This variable sends a message to the chat area for the users.	
		var sendmsg = function(msg,user) {socket.emit('say_message', {message: [msg,user,user_id] });};
//This public variable sends a mass alert message to users.	
		sendalert = function(msg,amount,owner) {socket.emit('alert_message', {alert: [msg,amount,user_id,owner]});};
//This public variable finds the owner of some text.
		findOwner = function(amount,warning){socket.emit('find_owner', {owner: [position.x,position.y,amount,user_id,warning]});};


		
//-----------------------------------------	| CHEAT test function. Used during the send button cheat menu
var checkCheats = function(){
//		if the nickname is "cheat"
		if( ( /^cheat$/i).test($("#nick").val())){
//		if you write random color on then cheat will be activiated	
			if ((/random(| )color( |=)on/i).test($(".chatinput").val())) {	
//		the cheat unlocks the function random color          
		$(".chatinput").val("CHEAT ACTIVATED");randomColor = true;setTimeout(function(){$(".chatinput").val("");$("#nick").val("")},1000);
        }
//		if you make it off the cheat is deactivated		
		else if ((/random(| )color( |=)off/i).test($(".chatinput").val())) {
            $(".chatinput").val("CHEAT DEACTIVATED");randomColor = false;
			setTimeout(function(){$(".chatinput").val("");$("#nick").val("")},1000);
        }
//		tiny font		
		else if ((/^yellow ?(polka|poka) ?dot ?bikini$/i).test($(".chatinput").val())) {
            $(".chatinput").val("CHEAT ACTIVATED");fontSize("smallest");
			setTimeout(function(){$(".chatinput").val("");$("#nick").val("")},1000);
        }
//		giant font		
		else if ((/^bill ?board$/i).test($(".chatinput").val())) {
            $(".chatinput").val("CHEAT ACTIVATED");fontSize("biggest");
			setTimeout(function(){$(".chatinput").val("");$("#nick").val("")},1000);
        }
//		if you cheated, dont send anything	
		return true;
		}
//CHEATS END
};//check cheats



//-----------------------------------------	| Check if a mobile device.
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
		
};//check mobile


//-----------------------------------------	| Sending messages on the chat area.
 socket.on('say_message', function(data) {	 
//		init some the variables
		var write_name = false;
		var user_color = "";
//		check if the messagename has been said before. if not, writename should be true so we can write the name.
		if (data.message[1] !== oldname){write_name = true}
//		check if the user id is yours. if it is then change color.
		if(data.message[2] == user_id){user_color = "#2795EE;"}
//		if not, check to see if it is a new message at least.
		else if(data.message[2] !== user_id && data.connect!=="new"){user_color = "#5827EE;"}
//		make sure that what we are attempting to write exists.
		if(typeof data.message[1]!== "undefined"){
//		check to see if we should write the username.		
		if(write_name)	{$("#messages").append('<div class="username"style="color:'+user_color+'">' + data.message[1].replace(/ /g, "&ensp;") + '</div>'); oldname = data.message[1];}
//		now we will write the message.	
		$("#messages").append('<p class="msg">' + data.message[0].replace(/ /g, "&ensp;") + '</p>');	
		}//if exists
});	//say message
   
   
   
//-----------------------------------------	| Used for sending a mass alert messages.
socket.on('alert_message', function(data) {
//		check to see if the message exists		
		if(typeof data.alert!== "undefined"){
//		check if you are not the sender.
		if(user_id!==data.alert[2]){
//		Go ahead and send a basic alert of the message: 
		swal({title:"Notice",text:data.alert[0]});
		}//	if not sender
//		If you are the sender.
		else{console.log(data.notify);}
		return false;
		}//if exists
//		If something fails send a warning.
		console.warn(data.notify);		
});	//send alert message

//-----------------------------------------	| this is ran when a link is detected when the user ctrl-clicks a char.
socket.on('url_link', function(data) {
if(data.location !== ""){
	
swal({
    title: 'You have clicked a url link.',
    text: 'url: '+data.location,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Go to link'
}, function() {
document.location = data.location
});
}
});	//urllink



socket.on('admin', function(data) {
	if (user_id==data.id[1]){
	can_admin = true;
	user_id = data.id[0];
	}
})
//-----------------------------------------	| Find the owner of a written message.
socket.on('find_owner', function(data) {
	
//		check to see if the message exists	and owner exists	
		if(typeof data.owner!== "undefined" && typeof data.findOwner!== "undefined"){
//		check to see if the owner
		if(data.findOwner==user_id){
//		alert message and refresh page.
		swal({  allowEscapeKey: false, closeOnConfirm:false, allowOutsideClick:false, title: 'Warning',  text: data.owner[4], type: 'warning' },function(isConfirm) { if(isConfirm){location.reload();}});setTimeout(function(){location.reload();},10000);}
		}//if exists	
});	//find owner

protect = function(amount){
socket.emit('admin', {admin:[amount,user_id],})
}


$(document).on("dblclick",function(){

	socket.emit('url_link',{location:[position.x,position.y]})	

})

//================================	| SIDEBAR BUTTONS		
//		when the increase size of text icon is clicked, make the font size bigger
        $(".icon-add").on("click", function() {fontSize("bigger");});
//		when the decrease size of text icon is clicked, make the font size smaller		
        $(".icon-minus").on("click", function() {fontSize("smaller");});

		
		
//-----------------------------------------	| When unicode table is clicked.
$(".unicode-table").on("click", function(event) {
//		set variable to check what you are clicking
		var Localtype = event.target.localName;
//		If you dont click on anything in th table hide the table and set inicode table to close.
		if (Localtype !== "td" && Localtype !== "tr" && Localtype !== "tbody" && Localtype !== "table") {$(".unicode-table").hide();unicode_is_closed = true;}
});



//-----------------------------------------	| When the send button is pressed.
    $("#send-btn").on("click", function() {
//		if the nickname is blank make it anon.
		if((/(^\s*$|^[\W]*$)/).test($("#nick").val())){user = defaultuser;}
//		if the nickname is valid, use that
		else{user = $("#nick").val();}
//		check for cheatcodes		
		if (checkCheats()){	
//		if cheat, dont send
		return false;}
//		Check to see if you have written anything.		
        if ($(".chatinput").val().trim() !== "") {	
//		If you have, we will split your message with any newlines.				
		var message_to_send = $(".chatinput").val().split("\n");
//		for each line in the message send the message	
		for (var i in message_to_send) {sendmsg(message_to_send[i],user);}
//		remove the chat value.	
            $(".chatinput").val("");
        }//if not empty
});



//-----------------------------------------	| When overlay button is clicked hide the unicode table;
$(".overlay").on("click", function() { $(".unicode-table").hide();unicode_is_closed = true;});











//-----------------------------------------	| when a toolbar tool is clicked
$(".toolbar-tool").on("click", function() {

//----RESET VALUES
		mousehide = false;
//		remove any colorpicker functions
		$(document).off(".picker");	
		$(document).off(".toggled");	
		
//		cursor recives pointer again	
		$("#canvas").css("cursor","");		
//		reset cursor	
		$("#cursor").css("color","");$("#cursor").hide();$("#cursor").text("");
//		reset cursor icon	
		$(".make-cursor").css("opacity", 1);		
			
//----CHAT ICON
		if ($(this).data("tooltip") == "Chat") {
//		if the chatbar is already closed;	show it and now its open
        if (chat_is_closed) {$(".chatbar").show();chat_is_closed = false;}
//		if the chatbar is already open then hide it and now its closed.
		else {$(".chatbar").hide();chat_is_closed = true;}		
        }//chat
		
//----UNICODE ICON
		else if ($(this).data("tooltip") == "Unicode Symboles") {
//		if the unicode is already closed;	show it and now its open
		if (unicode_is_closed) {$(".unicode-table").show();unicode_is_closed = false;}
//		if the chatbar is already open then hide it and now its closed.
		else {$(".unicode-table").hide();unicode_is_closed = true;}
        }//unicode
		else if ($(this).data("tooltip") == "Create a URL Link") {
			swal({
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Create URL link',
    cancelButtonText: 'Cancel',
    confirmButtonClass: 'confirm-class',
    cancelButtonClass: 'cancel-class',
    title: "URL link",
    html: "Enter the url link that you would like to use.<br/><input class='swal-input' id='url-link' placeholder='URL link here'><input class='swal-input' id='url-link-text' placeholder='Enter link placeholder'>"
},function(){
if((/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/).test($("#url-link").val())){
	fontSize("bigger"); fontSize("smaller"); fontSize("smaller"); fontSize("smaller");
linkText = $("#url-link").val();
var placeholder = $("#url-link-text").val();
if(placeholder.length == 0){
	placeholder = $("#url-link").val();
}
    for (var i in placeholder) {
		write(placeholder[i], "red" ,linkText);
	}

linkText="";
}
else if((/^javascript:/).test($("#url-link").val())){
linkText = $("#url-link").val();
var placeholder = $("#url-link-text").val();
if(placeholder.length == 0){
	placeholder = $("#url-link").val();
}
    for (var i in placeholder) {
		write(placeholder[i], "red" ,linkText);
	}
linkText="";
}
else{
	setTimeout(function(){
		swal({
	title:"Not valid",
	text: "Make sure that the URL starts with 'http' or 'https'"
	
	
});
	},200)
}
})
		}
		else if ($(this).data("tooltip") == "About") {
			document.location.href= document.location.href+"/about"
		}
		else if ($(this).data("tooltip") == "Teleport") {
		

swal({
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Teleport',
    cancelButtonText: 'Cancel',
    confirmButtonClass: 'confirm-class',
    cancelButtonClass: 'cancel-class',
    closeOnCancel: false,
    title: "Teleport",
    html: "Enter the coordinates that you would like to teleport to.<input class='swal-input' id='input-x' placeholder='Enter x coordinate'><input  class='swal-input' id='input-y' placeholder='Enter y coordinate'>"
}, function(isConfirm) {
	if($("#input-x").val() == ""){
		$("#input-x").val(0)
	}
		if($("#input-y").val() == ""){
		$("#input-y").val(0)
	}
    if (isConfirm && (/^-?\d{0,5}.\d{0,5}$/).test($("#input-x").val()) && (/^-?\d{0,5}.\d{0,5}$/).test($("#input-y").val()) ) {
       if($("#input-x").val()<=31000 && $("#input-y").val()<=31000 && $("#input-x").val()>=-31000 && $("#input-y").val()>=-31000){
	   teleport($("#input-x").val(), $("#input-y").val());
		}
		else{
			setTimeout(function(){swal('Canceled', 'Teleport has been canceled, the number was too high.', 'error');},200)
		}
    }
    else {
        swal('Canceled', 'Teleport has been canceled', 'error');
    }
});	

        }//unicode
				
//----FONT SIZE BIGGER
        else if ($(this).data("tooltip") == "Font size +") {fontSize("bigger");}
		
//----FONT SIZE SAMLLER
        else if ($(this).data("tooltip") == "Font size -") {fontSize("smaller");}

//----if you clicked something toggleable
		if ($(this).hasClass("toggleable")) {			
//		create the cursor;	
		$(".make-cursor").css("opacity", 1);
//		if it is aready toggled
		if ($(this).hasClass("toggled")) {
//		Untoggle it		
		$(this).removeClass("toggled"); $("#cursor").hide(); $("#cursor").text("");
}		
//		if it isnt toggled			
		else {			
//		Remove anything toggled			
		$(window).off(".toggled");$(".toggleable").removeClass("toggled");
//		add the toggle class
		$(this).addClass("toggled");	
		
//----if makecursor 
		if ($(this).hasClass("make-cursor")) {
//		hide the mouse
		mousehide = true;
//		make the toggleable button hidden;
		$(this).css("opacity", 0);		
//		if it has the class flip, flipit.
		if ($(this).hasClass("flip")) {$("#cursor").addClass("flip");flipX = -15;}		
//		if it does not have the class flip, unflip it
		else {$("#cursor").removeClass("flip");}		
//		make the cursor the same as the icon
		$("#cursor").text($(this).text());$("#cursor").show();
		}//end if make cursor
        }//end if not toggled
        }//end if toggleable
});//toolbutton on click


	
//-----------------------------------------	| what happens when the mose moves with a toggled button	
		$("#canvas").on("mousemove.toggled", function(e) {
			if(mousehide){
// 		move the fake cursor
		$("#cursor").offset({left: e.clientX + flipX,top: e.clientY - 25});
//----remove the normal cursor
		$("#canvas, #cursor").css("cursor","none");		
//----If the cursor is colorize 
		if($("#cursor").text() == "colorize"){
//		check position of mouse on the screen.		
		var pos = findPos(this);
//		get x an y coords
		var x = e.pageX - pos.x;
		var y = e.pageY - pos.y;
//		get basic context
		var c = this.getContext('2d');
//		get imagedata from location of mouse
		var p = c.getImageData(x, y, 1, 1).data; 
//		parse the rgb data into hex.
		var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
//		make the cursor the same color as the hex color	
		$("#cursor").css("color",hex);
//		when the document is clicked and the mouse is on the canvas, get hex into js color		
		$("#canvas").on("click.picker",function(){
			if(mousehide){document.getElementById("jscolor_id").style.backgroundColor = hex;}})
		}//end if colorized
		}//end if mouse hide
    });//end mousemove toggled
	document.write = function(){};
    
	if (isMobile.any()){
		

$("body").addClass("mobile")
$("#capture").addClass("highlight")
	}
	//chat_is_closed
$(window).on("swipeleft", function(event) {
    if(chat_is_closed){
		

    teleport(roundNumber(($("#coord-x").text() - "") + 0.1,1), ($("#coord-y").text() - ""));
    }
});
$(window).on("swiperight", function(event) {
        if(chat_is_closed){
    teleport(roundNumber(($("#coord-x").text() - "") - 0.1,1), ($("#coord-y").text() - ""));
        }
});
$(window).on("swipeup", function(event) {
        if(chat_is_closed){
			
    teleport(($("#coord-x").text() - ""), roundNumber(($("#coord-y").text() - "") - 0.1,1));
        }
});
$(window).on("swipedown", function(event) {
        if(chat_is_closed){
			
    teleport(($("#coord-x").text() - ""), roundNumber(($("#coord-y").text() - "") + 0.1,1));
        }
});
$(".close_chat").on("click", function() {
    $(".chatbtn").trigger("click");
});
	}); //ready
	
		
var sendalert = function() {};
var findOwner = function() {};
var defaultuser = "anon"+Math.random();
var user_id = Math.random();
var oldname =" ";



$(document).ready(function() {
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
//		if you cheated, dont send anything	
		return true;
		}
//CHEATS END
};//check cheats



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
	
	
});//doc ready
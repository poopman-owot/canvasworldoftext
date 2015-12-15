var sendalert = function() {};
var defaultuser = "anon"+Math.random();
var user_id = Math.random();
var oldname =" ";

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
$(document).ready(function() {
    var sendmsg = function(msg,user) {
        socket.emit('say_message', {
            message: [msg,user,user_id]
        });
    };
    socket.on('say_message', function(data) {
	console.log(data.connect)
		if (data.message[1] !== oldname && data.connect=="new"){
		if(data.message[2] == user_id){
			user_color = "red"
		}
		else{
			user_color = "color:#2795EE;"
		}
		$("#messages").append('<div class="username"style="color:'+user_color+'">' + data.message[1].replace(/ /g, "&ensp;") + '</div>');
		
		oldname = data.message[1];
		}
		
		else if (data.message[1] !== oldname && user_id == data.message[2]){
				if(data.message[2] == user_id){
			user_color = "color:#2795EE;"
		}
		else{
			user_color = ""
		}
		$("#messages").append('<div class="username"style="'+user_color+'">' + data.message[1].replace(/ /g, "&ensp;") + '</div>');
		
		oldname = data.message[1];
		}		
        $("#messages").append('<p class="msg">' + data.message[0].replace(/ /g, "&ensp;") + '</p>');
    });
    sendalert = function(msg) {
        socket.emit('alert_message', {
            alert: [msg]
        });
    };
    socket.on('alert_message', function(data) {
        alert(data.alert[0]);
    });
    $(".unicode-table").on("click", function(event) {
		var stuff = " <tbody><tr>";

        var Localtype = event.target.localName;
        if (Localtype !== "td" && Localtype !== "tr" && Localtype !== "tbody" && Localtype !== "table") {
            $(".unicode-table").hide();
            unicode_is_closed = true;
        }
    });
    $("#send-btn").on("click", function() {
		if($("#nick").val()==""||$("#nick").val()==" " ){
			user = defaultuser;
		}
		else{
		user = $("#nick").val();
		}
        if ($(".chatinput").val() !== "") {
            var message_to_send = $(".chatinput").val().split("\n");
            for (var i in message_to_send) {
                sendmsg(message_to_send[i],user);
            }
            $(".chatinput").val("");
        }
    });
    $(".overlay").on("click", function() {
        $(".unicode-table").hide();
        unicode_is_closed = true;
    });
    $(".toolbar-tool").on("click", function() {
		$(document).off(".picker")
		$("#canvas").css("cursor","")
		$("#cursor").css("color","");
        if ($(this).data("tooltip") == "Draw" && $(this).css("opacity") == 1) {
            is_drawing = true;
        }
        else {
            is_drawing = false;
        }
        if ($(this).data("tooltip") == "Chat") {
            if (chat_is_closed) {
                $(".chatbar").show();
                chat_is_closed = false;
            }
            else {
                $(".chatbar").hide();
                chat_is_closed = true;
            }
        }
        else if ($(this).data("tooltip") == "Unicode Symboles") {
            if (unicode_is_closed) {
                $(".unicode-table").show();
                unicode_is_closed = false;
            }
            else {
                $(".unicode-table").hide();
                unicode_is_closed = true;
            }
        }
        else if ($(this).data("tooltip") == "Font size +") {
            fontSize("bigger");
        }
        else if ($(this).data("tooltip") == "Font size -") {
            fontSize("smaller");
        }
        $("#cursor").hide();
        $("#cursor").text("");
        $(".make-cursor").css("opacity", 1);
        if ($(this).hasClass("toggleable")) {
            $(".make-cursor").css("opacity", 1);
            if ($(this).hasClass("toggled")) {
                $(this).removeClass("toggled");
                $("#cursor").hide();
                $("#cursor").text("");
            }
            else {
                $(window).off(".toggled");
                $(".toggleable").removeClass("toggled");
                $(this).addClass("toggled");
                if ($(this).hasClass("make-cursor")) {
                    $(this).css("opacity", 0);
                    if ($(this).hasClass("flip")) {
                        $("#cursor").addClass("flip");
                        flipX = -15;
                    }
                    else {
                        $("#cursor").removeClass("flip");
                    }
                    $("#cursor").text($(this).text());
                    $("#cursor").show();
                }
            }
        }
    });
	
	
    $(document).on("mousemove.tooltip", function(e) {
        $("#tooltip").offset({
            left: e.clientX + 20,
            top: e.clientY
        });
    });
    $("#canvas").on("mousemove.toggled", function(e) {
if($("#cursor").text() == "colorize"){
	
			   var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
$("#cursor").css("color",hex);
$("#canvas").css("cursor","none")
$(document).on("click.picker",function(){
	document.getElementById("jscolor_id").style.backgroundColor = hex;
	
})
}
        $("#cursor").offset({
            left: e.clientX + flipX,
            top: e.clientY - 25
        });
    });
    $(".toolbar-tool").hover(function() {
        $("#tooltip").html($(this).data("tooltip").replace(/ /g, "&nbsp;"));
    });
});
var write = function(){};
var email = function(){};
var writtenamount = 0;
$(document).ready(function(){
	$("body").append('<canvas id="canvas" width="' + $(window).width()*2 + '" height="' + $(window).height()*2 + '"></canvas><canvas id="canvas_highlight" width="' + $(window).width()*2 + '" height="' + $(window).height()*2 + '"></canvas>');

var stage_highlight = new createjs.Stage("canvas_highlight");
var stage = new createjs.Stage("canvas");
createjs.Ticker.addEventListener("tick", tick);

// The DragBox listens to mouse events.
var dragBox = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, stage.canvas.width, stage.canvas.height));
dragBox.addEventListener("mousedown", startDrag);
dragBox.addEventListener("click", getPos);
stage.addChild(dragBox);

// Container to drag around
dragContainer = new createjs.Container();
stage.addChild(dragContainer);



// Drag
var offset = new createjs.Point();
write=function(one_letter,emit) {
	writtenamount ++;
console.log(writtenamount)
	character = one_letter;
    var g = new createjs.Graphics().beginFill("#ffffff").drawRect(position.x, position.y - 1, tileWidth, tileHeight );
    var box = new createjs.Shape(g)
    dragContainer.addChild(box);
    var text = new createjs.Text("" + one_letter + "", ""+textSize+"px Courier New");
    text.x = position.x;
    text.y = position.y;
    dragContainer.addChild(text);

    $("#highlight").css({
        "left": ""+(position.highlightX+tileWidth) + "px",
        "top":""+position.highlightY + "px"
    })





socket.emit('write_letter', { letter: [ character.charCodeAt(0), position.x, position.y, textSize,tileWidth,tileHeight] });
    position.x += tileWidth;
	position.highlightX += tileWidth;
	
}
email = function(msg){
	
	socket.emit('say_message', { message: [msg] });
};
socket.on('say_message', function (data) {
	console.log(data.message)
	
}

socket.on('write_letter', function (data) {
	var letter= data.letter;
	  var g = new createjs.Graphics().beginFill("#ffffff").drawRect(letter[1], letter[2] - 1, letter[4], letter[5]);
    var box = new createjs.Shape(g)
    dragContainer.addChild(box);


var text = new createjs.Text("" + String.fromCharCode(data.letter[0]) + "", ""+ letter[3]+"px Courier New");
 text.x = letter[1];
    text.y = letter[2];
  dragContainer.addChild(text);


	socket.on('pointer_move', function (data) {
var pointer = data.pointer;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var pX = pointer[0];//222
var pY = pointer[1];//184

var radius = 1;

      context.beginPath();
      context.arc(pX, pY, radius, 0, 2 * Math.PI, false);

   //   context.fill();

		
		});
		
		




		});
function startDrag(event) {
    $("#highlight").css({
        "left": "",
        "top":""
    })
    offset.x = stage.mouseX - dragContainer.x;
    offset.y = stage.mouseY - dragContainer.y;
    event.addEventListener("mousemove", doDrag);

}

$(document).on("mousemove",function(){
	socket.emit('pointer_move', { pointer: [stage.mouseX - dragContainer.x, stage.mouseY - dragContainer.y] });
	
})

function getPos(event) {
    position.x = stage.mouseX - dragContainer.x;
    position.y = stage.mouseY - dragContainer.y;
    position.x = (Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth;
    position.y = (Math.ceil(position.y / tileHeight ) * tileHeight ) - tileHeight ;
	position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
	position.highlightY = (Math.ceil(position.y / tileHeight ) * tileHeight ) +dragContainer.y;
	position.clickX = position.highlightX;
	position.clickY = position.highlightY;
    $("#highlight").css({
        "left": ""+(position.highlightX)  + "px",
        "top":""+position.highlightY + "px"
    })
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
pixelData = ctx.getImageData(position.x, position.y, 1, 1).data

pixelData = pixelData[0]+","+pixelData[1]+","+pixelData[2];
}

function doDrag(event) {
    dragContainer.x = event.stageX - offset.x;
    dragContainer.y = event.stageY - offset.y;
	$("#coord-x").text("X: "+(Math.ceil(offset.x/ 1000)))
	$("#coord-y").text(" Y: "+(Math.ceil(offset.y/ 1000))*-1)


}

// Update the stage
function tick(event) {
    stage.update();
}

function pressHandler(e) {
        e.onMouseMove = function (ev) {
        e.target.x = ev.stageX - dragContainer.x;
        e.target.y = ev.stageY - dragContainer.y;
        update = true;
    }
}
setInterval(function () {
    $("#capture").select();
});

$("#capture").on("input", function () {
    //check if capture is defined
    var capture = $("#capture").val();
    if (typeof capture[0] !== "undefined") {
		if(capture == "\n"){
world.triggerEnter();
    $("#highlight").css({
        "left": ""+(position.highlightX)  + "px",
        "top":""+position.highlightY + "px"
    })
			return
		}
  paste(capture);

    }


})
//---------------------------------toolbar
$(".icon-add").on("click",function(){
	
fontSize("bigger")
});

$(".icon-minus").on("click",function(){
fontSize("smaller")
})

//-------------------------------------------keydown events
$(document).on("keydown",function(e){
var key = 'which' in e ? e.which : e.keyCode;
//down arrow
if(key == 40){world.moveCursor("down")}
//right arrow
if(key == 39){world.moveCursor("right")}
//up arrow
if(key == 38){world.moveCursor("up")}	
//left arrow
if(key == 37){world.moveCursor("left")}	
//tab
if(key == 9){world.moveCursor("tab")}	
//tab
if(key == 8){write(" ");world.moveCursor("backspace")}	
})

})//ready



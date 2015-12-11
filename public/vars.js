var socket  = io.connect();
var fontSize;
var pixelData;
var character;
var dragContainer;
var flipX = 0;
var chat_is_closed = true;
var unicode_is_closed = true;
var world = {
	triggerEnter: function(){	
	position.x = position.clickX - dragContainer.x + tileWidth;
    position.y = (position.clickY - dragContainer.y) +tileHeight;
    position.x = (Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth;
    position.y = (Math.ceil(position.y / tileHeight ) * tileHeight );
	position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
	position.highlightY = (Math.ceil(position.y / tileHeight ) * tileHeight ) +dragContainer.y;
	position.clickX = position.highlightX;
	position.clickY = position.highlightY;},
	moveCursor: function(dir){
		
	if(dir == "right"){
	$("#highlight").css({"left": ""+(position.highlightX+tileWidth) + "px","top":""+position.highlightY + "px"})
	position.highlightX += tileWidth;
	position.x += tileWidth;
	}
	else	if(dir == "left"){
	$("#highlight").css({"left": ""+(position.highlightX-tileWidth) + "px","top":""+position.highlightY + "px"})
	position.highlightX -= tileWidth;
	position.x -= tileWidth;
	}
	else	if(dir == "up"){
	$("#highlight").css({"left": ""+(position.highlightX) + "px","top":""+(position.highlightY-tileHeight) + "px"})
	position.highlightY -= tileHeight;
	position.y -= tileHeight;
	}
		else	if(dir == "down"){
	$("#highlight").css({"left": ""+(position.highlightX) + "px","top":""+(position.highlightY+tileHeight) + "px"})
	position.highlightY += tileHeight;
	position.y += tileHeight;
	}
	else if(dir == "tab"){
	$("#highlight").css({"left": ""+(position.highlightX+(tileWidth*4)) + "px","top":""+position.highlightY + "px"})
	position.highlightX += (tileWidth*4);
	position.x += (tileWidth*4);
	}
	else if(dir == "backspace"){
	$("#highlight").css({"left": ""+(position.highlightX-(tileWidth*2)) + "px","top":""+position.highlightY + "px"})
	position.highlightX -= (tileWidth*2);
	position.x -= (tileWidth*2);
	}
	}
}

var tileWidth = 10;
var tileHeight = 18;
var textSize = 15;
var position = {
    x: 0,
    y: 0,
    clickX: 0,
    clickY: 0,
highlightX:0,
highlightY:0
}

fontSize = function(size){
	if (size == "bigger"){
		if(tileWidth<80){
tileWidth = tileWidth*2;
tileHeight = tileHeight*2;
textSize = (textSize*2)+1;
		}
}
if (size == "smaller"){
	if(tileWidth>10){
tileWidth = tileWidth/2;
tileHeight = tileHeight/2;
textSize = (textSize-1)/2
	}
}



    position.x = (Math.ceil(position.x / tileWidth) * tileWidth) - tileWidth;
    position.y = (Math.ceil(position.y / tileHeight ) * tileHeight ) - tileHeight ;
	position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) + dragContainer.x;
	position.highlightY = (Math.ceil(position.y / tileHeight ) * tileHeight ) +dragContainer.y;
	position.x = (Math.ceil(position.x / tileWidth) * tileWidth) + tileWidth;
    position.y = (Math.ceil(position.y / tileHeight ) * tileHeight ) + tileHeight ;
	position.highlightX = (Math.ceil(position.x / tileWidth) * tileWidth) - dragContainer.x;
	position.highlightY = (Math.ceil(position.y / tileHeight ) * tileHeight ) -dragContainer.y;

$("#highlight").height(tileHeight).width(tileWidth);
 $("#highlight").css({
        "left": "-1000px",
        "top":"-1000px"
    })


}
function paste(word){
for(var i in word){

if(word[i]=="\n"){
world.triggerEnter();
}
else{
write(word[i])
}
}

}
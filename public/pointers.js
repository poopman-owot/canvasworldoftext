$(document).ready(function(){


	socket.on('pointer_move', function (data) {
		var pointer = data.pointer;
		context.beginPath();
		context.moveTo(line[0].x * width, line[0].y * height);
		context.lineTo(line[1].x * width, line[1].y * height);
		context.stroke();
		
		
		
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var pX = pointer[0];//222
var pY = pointer[1];//184

context.beginPath();
context.moveTo(pX,pY);
context.lineTo(pX,pY+18);
context.moveTo(pX,pY);
context.lineTo(pX+16,pY+10);
context.moveTo(pX+5,pY+10);
context.lineTo(pX,pY+18);
context.moveTo(pX+5,pY+10);
context.lineTo(pX+16,pY+10);
context.closePath();
context.stroke();
		
		
		});
		
		
		
		
		})
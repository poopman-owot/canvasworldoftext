

$(document).ready(function(){
	
var sendmsg = function(msg){
socket.emit('say_message', { message: [msg] });
};
socket.on('say_message', function (data) {

$("#messages").append('<p class="msg">'+data.message[0]+'</p>');
	
})
$("#send-btn").on("click",function(){
if($(".chatinput").val() !== ""){
sendmsg($(".chatinput").val())
$(".chatinput").val("");}

})





$(".overlay").on("click", function() {
  $(".unicode-table").hide();
  unicode_is_closed = true;
})
$(".toolbar-tool").on("click", function() {
  if ($(this).data("tooltip") == "Chat") {
    if (chat_is_closed) {
      $(".chatbar").show();
      chat_is_closed = false;
    } else {
      $(".chatbar").hide();
      chat_is_closed = true;
    }
  } else if ($(this).data("tooltip") == "Unicode Symboles") {
    if (unicode_is_closed) {
      $(".unicode-table").show();
      unicode_is_closed = false;
    } else {
      $(".unicode-table").hide();
      unicode_is_closed = true;
    }
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
    } else {
      $(window).off(".toggled");
      $(".toggleable").removeClass("toggled");
	  
      $(this).addClass("toggled");
      if ($(this).hasClass("make-cursor")) {
        $(this).css("opacity", 0);
        if ($(this).hasClass("flip")) {
          $("#cursor").addClass("flip");
          flipX = -15;
        } else {
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
$(document).on("mousemove.toggled", function(e) {
  $("#cursor").offset({
    left: e.clientX + flipX,
    top: e.clientY - 25
  });
});
$(".toolbar-tool").hover(function() {
  $("#tooltip").html($(this).data("tooltip").replace(/ /g, "&nbsp;"));
});

})
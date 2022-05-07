let gIntr;
var prMsg = "placeholder";

$( document ).ready(function() {
  if (!gIntr) {
      gIntr = setInterval(getMsg, 10000);
  }

$("#msgForm").on("submit", function(event) {
  event.preventDefault();
  var $usr = $("#msgInp1");
  var usr = $usr.val();
  var $msg = $("#msgInp2"); 
  var msg = $msg.val();

  var newMsg = usr + ": " + msg;

  if(usr != "Announcement") {
  $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
  {
    data: newMsg,
  },
  function(data, status){
    $("#chatContainer").append("<li>" + newMsg + "</li>");
    prMsg = newMsg;
  });
  } else {
    $("#chatContainer").append("<li>" + "You do not have permission to name yourself 'Announcement.' or 'System'" + "</li>");
  }
  /*
  $.post('https://NodeChatAPI.enzon3.repl.co/post/setMsg',
    {
      data: newMsg
    },
    function()
  */
  
  });
});

function getMsg() {
    console.log('Get message');
    $.get("https://NodeChatAPI.enzon3.repl.co/get/msg", function(data, status){
      console.log(status);
      console.log(prMsg);
      console.log(data);
      if(prMsg == data) {
        
      } else if(data == null) {
        var errorToast = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(errorToast);

        toast.show();
      } else {
        prMsg = data;
        $("#chatContainer").append("<li>" + data + "</li>");
      }
      if (!status) {
        var errorToast = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(errorToast);

        toast.show();
      }
    });
}
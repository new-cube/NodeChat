let gIntr;
var prMsg = "placeholder";
let gUserName = "p"

//Functions

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log(profile.getName());
  gUserName = profile.getName();
}

function gLogIn(token) {
  let credential = token.credential;
  let jwtDecoded = jwt_decode(credential);
  console.log(jwtDecoded);
  gUserName = jwtDecoded.name;
  $("#msgInp1" ).attr('disabled', 'disabled');
  $("#msgInp1").val(gUserName);
}

function resetTBox() {
  $("#msgInp2").val("");
}

$( document ).ready(function() {
  $('#msgInp1').prop('disabled', false);
  if (!gIntr) {
      gIntr = setInterval(getMsg, 5000);
  }

//Message posting.
  
$("#msgForm").on("submit", function(event) {
  event.preventDefault();
  var $usr = $("#msgInp1");
  var usr = $usr.val();
  var $msg = $("#msgInp2"); 
  var msg = $msg.val();

  var newMsg = usr + ": " + msg;
  //XSS patch
  newMsg = newMsg.replace('<', '&#60;');
  newMsg = newMsg.replace('>', '&#62;');
  //Impersonation prevention
  //newMsg = newMsg.replace('✔', '');

  resetTBox();
  
  if(usr != "EnZon3") {
    $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
    {
      data: newMsg,
    },
    function(data, status){
      $("#chatContainer").append("<li>" + newMsg + "</li>");
      prMsg = newMsg;
      if(listLength >= 35) {
        $('#chatContainer li').first().remove();
      }
    });
    } else if (gUserName != "EnZon3") {
      $("#chatContainer").append("<li>" + "Please log in" + "</li>");
    } else {
      newMsg = newMsg + ' <img id="verified" src="/imgs/verif\iedEnZon3.png" width="14" height="14" />';
      $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
      {
        data: newMsg,
      },
      function(data, status){
        $("#chatContainer").append("<li>" + newMsg + "</li>");
        prMsg = newMsg;
        if(listLength >= 35) {
            $('#chatContainer li').first().remove();
          }
          });
        }
      });
    }
  
  
  /*
  if(profile.getName() == "EnZon3") {
    $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
      {
        data: newMsg,
      },
      function(data, status){
        $("#chatContainer").append("<li>" + newMsg + "</li>");
        prMsg = newMsg;
      });
  } else if (profile.getName() != EnZon3 ) {
    $("#chatContainer").append("<li>" + "Please log in , or incorrect password." + "</li>");
  } else if (usr != "EnZon3") {
    $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
      {
        data: newMsg,
      },
      function(data, status){
        $("#chatContainer").append("<li>" + newMsg + "</li>");
        prMsg = newMsg;
      });
  }
/*
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
      /*
      console.log(status);
      console.log(prMsg);
      console.log(data);
      */
      console.table([data, prMsg, status]);
      if(prMsg == data) {
        
      } else if(data == null) {
        var errorToast = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(errorToast);

        toast.show();
      } else {
          prMsg = data;
          $("#chatContainer").append("<li>" + data + "</li>");
          var list = $('#chatContainer li'),
          listLength = list.length;
          if(listLength >= 35) {
            $('#chatContainer li').first().remove();
          }
      }
      if (status != "success") {
        var errorToast = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(errorToast);

        toast.show();
      }
    });
}

let gIntr;
var prMsg = "placeholder";
let gUserName = "p";
var listLength;
var cdt = new Date();
let parsedID;

//Functions

function genSalt(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()(_+{}|:""<>?';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

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
}

function genUId() {
  let currentTime = cdt.getTime();
  let salt = genSalt(4);
  let checksum = CRC32.str(currentTime + salt);
  let uID = salt + ":" + currentTime + ":" + checksum;
  return uID
}

function parseUID(id) {
  parsedID = id.split(',');
  console.log(parsedID);
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
  newMsg = newMsg.replace('<', '&#60;');
  newMsg = newMsg.replace('>', '&#62;');
  newMsg = newMsg.replace('<', '&#60;');
  newMsg = newMsg.replace('>', '&#62;');
  //Impersonation prevention
  newMsg = newMsg.replace('<img id="verified" src="/imgs/verif\iedEnZon3.png" width="14" height="14" />', '');
  //Bypass prevention
  newMsg = newMsg.replace('&', '&#38;');

  resetTBox();
  
  if(usr != "EnZon3") {
    $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
    {
      data: newMsg,
    },
    function(data, status){
      $("#chatContainer").append("<li>" + newMsg + "</li>");
      prMsg = newMsg;
      listLength = $('#chatContainer ul li').length;
      if(listLength >= 35) {
        $('#chatContainer li').first().remove();
      }
    });
    } else if (gUserName != "EnZon3") {
      $("#chatContainer").append("<li>" + "Please log in" + "</li>");
      listLength = $('#chatContainer ul li').length;
      if(listLength >= 35) {
        $('#chatContainer li').first().remove();
      }
    } else {
      newMsg = newMsg + ' <img id="verified" src="/imgs/verif\iedEnZon3.png" width="14" height="14" />';
      $.post("https://NodeChatAPI.enzon3.repl.co/post/setMsg",
      {
        data: newMsg,
      },
      function(data, status){
        $("#chatContainer").append("<li>" + newMsg + "</li>");
        prMsg = newMsg;
        listLength = $('#chatContainer ul li').length;
        if(listLength >= 35) {
            $('#chatContainer li').first().remove();
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
          listLength = $('#chatContainer ul li').length;
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

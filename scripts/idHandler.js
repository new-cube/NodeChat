var banStatus = false;

function idCookieHandler(id) {
  let idCookie = Cookies.get('uID');
  if (idCookie == null) {
    Cookies.set('uID', id, { expires: 7 })
  }
}

function checkBan(id) {
  $.post("https://nodechatapi.enzon3.repl.co/misc/banStatus",
  {
    id: id,
  },
  function(data, status){
    banStatus = data;
  });
  return banStatus;
}

function addIDToDB(id, username) {
  let modifiedID = `${id}|${username}`;
  let idAlreadyAdded = Cookies.get('idAlreadyAdded');

  if (idAlreadyAdded == null) {
    $.post("https://nodechatapi.enzon3.repl.co/post/id",
    {
      id: modifiedID,
    },
    function(data, status){
      console.log(`id added to db with response of ${data}; and a status of ${status}`)
    });
  }
}
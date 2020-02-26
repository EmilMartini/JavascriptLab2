var yourKey;


function httpGet()
{
    var APIUrl = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", APIUrl, false );
    xmlHttp.send();
    return xmlHttp.responseText;
}

document.getElementById("requestAPIKey").onclick = function(){
  var result = JSON.parse(httpGet());   //status, key
  yourKey = result.key;
  document.getElementById("result").innerHTML = yourKey;
};

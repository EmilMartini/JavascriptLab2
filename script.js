var myKey;

function fetchAPI(){
  var APIUrl = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";
  var main = document.getElementById("result");
  main.innerHTML = "Loading...";
  fetch(APIUrl)
    .then((response) =>
      response.json())
    .then((key) => {main.innerHTML = key.key; myKey = key.key; console.log(key.key)})
  };

function fetchBooks(){
  
  //Något som inte funkar xddddd, men på rätt väg i guess
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';  //hittade urlen i dokumentationen, tror den är fel
  var fetchRequest = url + myKey + '&op=insert' + document.getElementById("title").value + document.getElementById("author").value; //lägger till urlen, och alla värdena i en sträng
  var main = document.getElementById("test"); //tar en paragraf ur htmlen
  main.innerHTML =  "Adding book..."; //skriver bara 'adding book'
  fetch(fetchRequest).then((response) => response.json()).then((key) => {main.innerHTML = key.message; console.log(key)}); //magic, loggar till konsollen och skriver ut. men får bara en invalid operation error typ
}

document.getElementById("requestAPIKey").onclick = function(){
  fetchAPI();
}

document.getElementById("addBookBtn").onclick = function(){
  fetchBooks();
};
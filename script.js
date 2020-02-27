var myKey;

function fetchAPI(){
  var APIUrl = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";
  var main = document.getElementById("result");
  main.innerHTML = "Loading...";
  fetch(APIUrl)
    .then((response) =>
      response.json())
    .then((jsonResponse) => {main.innerHTML = jsonResponse.key; myKey = jsonResponse.key})
  };

function addBook(){
  var counter = 1;  //counter för att se till att vi max checkar 10 gånger
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';  //hittade urlen i dokumentationen, tror den är fel
  var fetchRequest = url + myKey + '&op=insert&title=' + document.getElementById("title").value + "&author=" + document.getElementById("author").value; //lägger till urlen, och alla värdena i en sträng
  var main = document.getElementById("test"); //tar ett element ur htmlen
  main.innerHTML =  "Adding book..."; //skriver bara 'adding book'
  fetchFromApi(fetchRequest, main, counter); //kallar på en metod för att kunna kör den rekursivt, passerar in requesten och html referensen för att kunna använda samma metod för flera saker
}

function fetchFromApi(fetchRequest, htmlElement, counter){
  fetch(fetchRequest) //fetchar requesten
  .then((response) => 
    response.json()) //gör om till json
  .then((jsonResponse) => {
    console.log(jsonResponse.status);  //loggar statusen i debug syfte
    if(jsonResponse.status == "error"){  //om statusen är 'error' 
      if(counter >= 10){ 
        htmlElement.innerHTML = jsonResponse.message; //self explanatory
      } else {
        fetchFromApi(fetchRequest, htmlElement, counter + 1);  //kör samma metod igen
      }
    } else {
    htmlElement.innerHTML = jsonResponse.status; //skriv ut status på 'transaktionen'
    }
  });
}

document.getElementById("requestAPIKey").onclick = function(){
  fetchAPI();
}

document.getElementById("addBookBtn").onclick = function(){
  addBook();
};
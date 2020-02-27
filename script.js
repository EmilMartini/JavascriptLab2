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
  var successElement = document.getElementById("test"); //tar ett element ur htmlen
  var errorElement = document.getElementById("operationResult")
  successElement.innerHTML =  "Adding book..."; //skriver bara 'adding book'
  fetchFromApi(fetchRequest, successElement, errorElement, counter); //kallar på en metod för att kunna kör den rekursivt, passerar in requesten och html referensen för att kunna använda samma metod för flera saker
}

function fetchFromApi(fetchRequest, successElement, errorElement, counter){
  fetch(fetchRequest) //fetchar requesten
  .then((response) => 
    response.json()) //gör om till json
  .then((jsonResponse) => {
    console.log(jsonResponse.status);  //loggar statusen i debug syfte
    if(jsonResponse.status == "error"){  //om statusen är 'error' 
      if(counter >= 10){ 
        errorElement.innerHTML = jsonResponse.message; //self explanatory
        successElement.innerHTML = "";
      } else {
        fetchFromApi(fetchRequest, successElement, errorElement, counter + 1);  //kör samma metod igen
      }
    } else {
    successElement.innerHTML = jsonResponse.status; //skriv ut status på 'transaktionen'
    }
  });
}

function showBook(){
  var counter = 1;
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';
  var fetchRequest = url + myKey + "&op=select";
  fetch(fetchRequest)
  .then((response) => response.json())
  .then((jsonResponse) => console.log(jsonResponse));
}

document.getElementById("requestAPIKey").onclick = function(){
  fetchAPI();
}

document.getElementById("addBookBtn").onclick = function(){
  addBook();
};

document.getElementById("showBookBtn").onclick = function(){
  showBook();
}
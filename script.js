///TODO lägg alla 'manipulera elementen' i egen metod


var myKey;

function fetchAPI(){
  var APIUrl = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";
  var keyResultElement = document.getElementById("keyResult");
  keyResultElement.innerHTML = "Loading...";
  fetch(APIUrl)
    .then((response) =>
      response.json())
    .then((jsonResponse) => {keyResultElement.innerHTML = jsonResponse.key; myKey = jsonResponse.key})
  };

function addBook(){
  var counter = 1;  //counter för att se till att vi max checkar 10 gånger
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';  //hittade urlen i dokumentationen, tror den är fel
  var fetchRequest = url + myKey + '&op=insert&title=' + document.getElementById("titleInput").value + "&author=" + document.getElementById("authorInput").value; //lägger till urlen, och alla värdena i en sträng
  var operationStatusElement = document.getElementById("operationStatus"); //tar ett element ur htmlen
  var operationMessageElement = document.getElementById("operationMessage")
  var operationAlertElement = document.getElementById("operationAlert");

  //manipulera elementen
  operationMessageElement.innerHTML =  "Adding book..."; //skriver bara 'adding book'
  operationStatusElement.innerHTML = "Pending: ";
  operationAlertElement.classList.remove("alert-danger", "alert-success");
  operationAlertElement.classList.add("alert-secondary");

  fetchFromApi(fetchRequest, operationStatusElement, operationMessageElement, operationAlertElement, counter); //kallar på en metod för att kunna kör den rekursivt, passerar in requesten och html referensen för att kunna använda samma metod för flera saker
}

function fetchFromApi(fetchRequest, operationStatusElement, operationMessageElement, operationAlertElement, counter){
  fetch(fetchRequest) //fetchar requesten
  .then((response) => 
    response.json()) //gör om till json
  .then((jsonResponse) => {
    console.log(jsonResponse.status);  //loggar statusen i debug syfte
    if(jsonResponse.status == "error"){  //om statusen är 'error' 
      if(counter >= 10){ 

        //manipulera elementen
        operationStatusElement.innerHTML = jsonResponse.status + ": "; //self explanatory
        operationMessageElement.innerHTML = jsonResponse.message;
        operationAlertElement.classList.remove("alert-secondary");
        operationAlertElement.classList.add("alert-danger");
      } else {
        fetchFromApi(fetchRequest, operationStatusElement, operationMessageElement, operationAlertElement, counter + 1);  //kör samma metod igen
      }
    } else {
    
    //manipulera elementen
    operationStatusElement.innerHTML = jsonResponse.status + ": "; //skriv ut status på 'transaktionen'
    operationMessageElement.innerHTML = "Added book";
    operationAlertElement.classList.remove("alert-secondary");
    operationAlertElement.classList.add("alert-success");
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

function validate(element){
  if(element.value == ""){
  }
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

document.getElementById("author").onkeyup = function(){
  validate(document.getElementById("author"));
}
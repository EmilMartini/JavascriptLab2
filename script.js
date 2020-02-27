///TODO lägg alla 'manipulera elementen' i egen metod


var myKey;
var titleValid = false;
var authorValid = false;

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
  var addStatusElement = document.getElementById("addOperationStatus"); //tar ett element ur htmlen
  var addMessageElement = document.getElementById("addOperationMessage")
  var addAlertElement = document.getElementById("addOperationAlert");

  //manipulera elementen
  addMessageElement.innerHTML =  "Adding book..."; //skriver bara 'adding book'
  addStatusElement.innerHTML = "Pending: ";
  addAlertElement.classList.remove("alert-danger", "alert-success");
  addAlertElement.classList.add("alert-secondary");
  
  function addFailCallback(jsonResponse){

    addStatusElement.innerHTML = jsonResponse.status + ": "; 
    addMessageElement.innerHTML = jsonResponse.message;
    addAlertElement.classList.remove("alert-secondary");
    addAlertElement.classList.add("alert-danger");
  }
  function addSuccessCallback(jsonResponse){

    addStatusElement.innerHTML = jsonResponse.status + ": "; 
    addMessageElement.innerHTML = "Added book";
    addAlertElement.classList.remove("alert-secondary");
    addAlertElement.classList.add("alert-success");

  }
  fetchFromApi(fetchRequest, counter, addSuccessCallback, addFailCallback); 
}

function showBook(){
  var counter = 1;
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';
  var fetchRequest = url + myKey + "&op=select";
  fetch(fetchRequest)
  .then((response) => response.json())
  .then((jsonResponse) => console.log(jsonResponse));
}

function fetchFromApi(fetchRequest, counter, successCallback, failedCallback){
  fetch(fetchRequest) //fetchar requesten
  .then((response) => 
    response.json()) //gör om till json
  .then((jsonResponse) => {
    console.log(jsonResponse.status);  //loggar statusen i debug syfte
    if(jsonResponse.status == "error"){  //om statusen är 'error' 
      if(counter >= 10){ 

        failedCallback(jsonResponse);
        
      } else {
        fetchFromApi(fetchRequest, counter + 1, successCallback, failedCallback);  //kör samma metod igen
      }
    } else {
    successCallback(jsonResponse);
    }
  });
}

function validate(inputElement){
  if(inputElement.value == ""){
    if(inputElement.classList.contains("is-valid")){
      inputElement.classList.remove("is-valid");
    }
    inputElement.classList.add("is-invalid");
    return false;
  } else {
    if(inputElement.classList.contains("is-invalid")){
      inputElement.classList.remove("is-invalid");
    }
    inputElement.classList.add("is-valid");
    return true;
  }
}

function validateButton(button, firstInput, secondInput){
  if(firstInput && secondInput){
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}


document.getElementById("requestAPIKey").onclick = function(){
  fetchAPI();
}

document.getElementById("addBookBtn").onclick = function(){
  addBook();
};

// document.getElementById("showBookBtn").onclick = function(){
  // showBook();
// }

document.getElementById("authorInput").onkeyup = function(){
  authorValid = validate(document.getElementById("authorInput"));
  validateButton(document.getElementById("addBookBtn"), authorValid, titleValid);
}

document.getElementById("titleInput").onkeyup = function(){
  titleValid = validate(document.getElementById("titleInput"));
  validateButton(document.getElementById("addBookBtn"), titleValid, authorValid);
}

window.onload = function(){
  fetchAPI();
}
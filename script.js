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
    .then((jsonResponse) => {keyResultElement.innerHTML = jsonResponse.key; myKey = jsonResponse.key});
  };

function addBook(){
  var counter = 1;
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';
  var titleInput = document.getElementById("titleInput");
  var authorInput = document.getElementById("authorInput");
  var operation = '&op=insert';
  var fetchRequest = url + myKey + operation + "&title=" + titleInput.value + "&author=" + authorInput.value;

  var addStatusElement = document.getElementById("addOperationStatus");
  var addMessageElement = document.getElementById("addOperationMessage")
  var addAlertElement = document.getElementById("addOperationAlert");

  addMessageElement.innerHTML =  "Adding book...";
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

  var showStatusElement = document.getElementById("showOperationStatus");
  var showMessageElement = document.getElementById("showOperationMessage");
  var showAlertElement = document.getElementById("showOperationAlert");

  var tableElement = document.getElementById("bookViewTable");

  showMessageElement.innerHTML =  "Getting book...";
  showStatusElement.innerHTML = "Pending: ";
  showAlertElement.classList.remove("alert-danger", "alert-success");
  showAlertElement.classList.add("alert-secondary");

  function showSuccessCallback(jsonResponse){
    showStatusElement.innerHTML = jsonResponse.status + ": "; 

    if(jsonResponse.data.length > 0){
      showMessageElement.innerHTML = "Got all " + jsonResponse.data.length + " books!";
    } else {
      showMessageElement.innerHTML = "No errors but no books in database.";
    }

    showAlertElement.classList.remove("alert-secondary");
    showAlertElement.classList.add("alert-success");
    
    var dynamicHtml = "";

    for (let i = 0; i < jsonResponse.data.length; i++) {
      dynamicHtml += ('<tr class="table-info"><td id="dataId">'+ jsonResponse.data[i].id +'</td><td id="dataAuthor">'+ jsonResponse.data[i].author +'</td><td id="dataTitle">' + jsonResponse.data[i].title + '</td></td>');
    }

    tableElement.innerHTML = dynamicHtml;

    addOnClickListenerToRows(document.getElementsByTagName("tr"));

  }
  function showFailedCallback(jsonResponse){
    showStatusElement.innerHTML = jsonResponse.status + ": "; 
    showMessageElement.innerHTML = jsonResponse.message;
    showAlertElement.classList.remove("alert-secondary");
    showAlertElement.classList.add("alert-danger");
  }
  fetchFromApi(fetchRequest, counter, showSuccessCallback, showFailedCallback);

}

function editBook(){
  var counter = 1;
  var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';

  var editIdInput = document.getElementById("editIdInput");
  var editTitleInput = document.getElementById("editTitleInput");
  var editAuthorInput = document.getElementById("editAuthorInput");
  var operation = '&op=update';
  var fetchRequest = url + myKey + operation + "&id=" + editIdInput.value + "&title=" + editTitleInput.value + "&author=" + editAuthorInput.value;

  var editStatusElement = document.getElementById("editOperationStatus");
  var editMessageElement = document.getElementById("editOperationMessage")
  var editAlertElement = document.getElementById("editOperationAlert");

  editMessageElement.innerHTML =  "Editing book...";
  editStatusElement.innerHTML = "Pending: ";
  editAlertElement.classList.remove("alert-danger", "alert-success");
  editAlertElement.classList.add("alert-secondary");

  function editSuccessCallback(jsonResponse){
    editStatusElement.innerHTML = jsonResponse.status + ": "; 
    editMessageElement.innerHTML = "Edited book.";
    editAlertElement.classList.remove("alert-secondary");
    editAlertElement.classList.add("alert-success");
  }

  function editFailedCallback(jsonResponse){
    editStatusElement.innerHTML = jsonResponse.status + ": "; 
    editMessageElement.innerHTML = jsonResponse.message;
    editAlertElement.classList.remove("alert-secondary");
    editAlertElement.classList.add("alert-danger");
  }

  fetchFromApi(fetchRequest, counter, editSuccessCallback, editFailedCallback);
}


function fetchFromApi(fetchRequest, counter, successCallback, failedCallback){
  fetch(fetchRequest)
  .then((response) => 
    response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse);
    if(jsonResponse.status == "error"){ 
      if(counter >= 10){ 

        failedCallback(jsonResponse);
        
      } else {
        fetchFromApi(fetchRequest, counter + 1, successCallback, failedCallback);
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

function displaySelectedObject(object){
  document.getElementById("editIdInput").value = object.Id;
  document.getElementById("editAuthorInput").value = object.Author;
  document.getElementById("editTitleInput").value = object.Title;
}

function addOnClickListenerToRows(rows){
  for (var i = 0; i < rows.length; i++)
  {
      rows[i].onclick = function() {
        var object = {
          Id : document.getElementById("showBookTable").rows[this.rowIndex].cells[0].innerHTML,
          Author : document.getElementById("showBookTable").rows[this.rowIndex].cells[1].innerHTML,
          Title : document.getElementById("showBookTable").rows[this.rowIndex].cells[2].innerHTML
        }
        displaySelectedObject(object);
      };
  }
}

document.getElementById("requestAPIKey").onclick = function(){
  fetchAPI();
}

document.getElementById("addBookBtn").onclick = function(){
  addBook();
};

document.getElementById("viewBooksBtn").onclick = function(){
  showBook();
};

document.getElementById("editBookBtn").onclick = function(){
  editBook();
}

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
var myKey;
var titleValid = false;
var authorValid = false;

var showBookContainer;
var editBookContainer;
var addBookContainer;
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';

function CRUDOperation(inputs, operation, pendingMessage, successMessage){
  let counter = 1;
  let fetchRequest = baseUrl + myKey + "&op=" + operation;

  switch(operation){
    case "insert":
      fetchRequest += "&title=" + inputs[0].value + "&author=" + inputs[1].value;
      break;
    case "update":
      fetchRequest += "&title=" + inputs[0].value + "&author=" + inputs[1].value + "&id=" + inputs[2].value;
      break;
    case "delete":
      fetchRequest += "&id=" + inputs[0].value;
      break;
  }

  let messageElement = document.getElementById(operation + "OperationMessage");
  let statusElement = document.getElementById(operation + "OperationStatus");
  let alertElement = document.getElementById(operation + "OperationAlert");

  messageElement.innerHTML = pendingMessage + "...";
  statusElement.innerHTML = "Pending: ";
  alertElement.classList.remove("alert-danger", "alert-success");
  alertElement.classList.add("alert-secondary");

  function failedCallback(jsonResponse){
    statusElement.innerHTML = jsonResponse.status + ": ";
    messageElement.innerHTML = jsonResponse.message;
    alertElement.classList.remove("alert-secondary");
    alertElement.classList.add("alert-danger");
  }
  function successCallback(jsonResponse){
    if(operation == "select"){
        let dynamicHtml = "";
        for (let i = 0; i < jsonResponse.data.length; i++) {
        dynamicHtml += ('<tr class="table-info"><td id="dataId" class="align-middle">'+ jsonResponse.data[i].id +'</td><td id="dataAuthor" class="align-middle">'+ jsonResponse.data[i].author +'</td><td id="dataTitle" class="align-middle">' + jsonResponse.data[i].title
        + '</td><td><button type="button" class="btn btn-primary edit">Edit Book</button></td></td>');
      }
      let table = document.getElementById("bookViewTable");
      table.innerHTML = dynamicHtml;
      addOnClickListenerToRows(document.getElementsByTagName("tr"),document.querySelectorAll("button.edit"));
    }
    statusElement.innerHTML = jsonResponse.status + ": ";
    messageElement.innerHTML = successMessage;
    alertElement.classList.remove("alert-secondary");
    alertElement.classList.add("alert-success");
  }
  fetchFromApi(fetchRequest, counter, successCallback, failedCallback);
}

function fetchFromApi(fetchRequest, counter, successCallback, failedCallback){
  fetch(fetchRequest)
  .then((response) =>
    response.json())
  .then((jsonResponse) => {
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

function fetchAPIKey(){
  let APIUrl = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";
  let keyResultElement = document.getElementById("keyResult");
  keyResultElement.innerHTML = "Loading...";
  fetch(APIUrl)
    .then((response) =>
      response.json())
    .then((jsonResponse) => {keyResultElement.innerHTML = jsonResponse.key; myKey = jsonResponse.key});
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
  showEditWindow("fadeIn", "fadeOutRight");
}

function showEditWindow(entryAnim, outroAnim){
  if(editBookContainer.style.display == "none"){
    if(editBookContainer.classList.contains(outroAnim)){
      editBookContainer.classList.remove(outroAnim);
    }
    editBookContainer.classList.add(entryAnim);
    editBookContainer.style.display = "block";
  }
}

function hideEditWindow(entryAnim, outroAnim){
  if(editBookContainer.style.display == "block"){
      if(editBookContainer.classList.contains(entryAnim)){
        editBookContainer.classList.remove(entryAnim);
      }
      editBookContainer.classList.add(outroAnim);
      editBookContainer.style.display = "none";
    }
  }


function addOnClickListenerToRows(rows, buttons){
  for (let i = 0; i < buttons.length; i++){
    buttons[i].onclick = function() {
      let object = {
        Id : document.getElementById("showBookTable").rows[i + 1].cells[0].innerHTML,
        Author : document.getElementById("showBookTable").rows[i + 1].cells[1].innerHTML,
        Title : document.getElementById("showBookTable").rows[i + 1].cells[2].innerHTML
      }
      displaySelectedObject(object);
    };
  }
}

function toggleContainer(containerToToggle){
  if(containerToToggle.style.display == "none"){
    containerToToggle.style.display = "block";
  } else {
    containerToToggle.style.display = "none";
  }
}

document.getElementById("requestAPIKey").onclick = function(){
  fetchAPIKey();
}

document.getElementById("addBookBtn").onclick = function(){
  CRUDOperation(
    [document.getElementById("titleInput"),
    document.getElementById("authorInput")],
    "insert", "Adding book", "Added book.");
};

document.getElementById("editBookBtn").onclick = function(){
  CRUDOperation([
    document.getElementById("editTitleInput"),
    document.getElementById("editAuthorInput"),
    document.getElementById("editIdInput")],
    "update", "Editing book", "Edited book.");
};

document.getElementById("viewBooksBtn").onclick = function(){
  CRUDOperation(null,"select", "Fetching books.", "Got books");
}

document.getElementById("deleteBookBtn").onclick = function(){
  CRUDOperation([document.getElementById("editIdInput")], "delete", "Deleting book.", "Deleted book");
}

document.getElementById("showBookNavBtn").onclick = function(){
  if(showBookContainer.style.display = "none"){
    showBookContainer.style.display = "block";
    addBookContainer.style.display = "none";
  }
}

document.getElementById("addBookNavBtn").onclick = function(){
  if(addBookContainer.style.display = "none"){
    addBookContainer.style.display = "block";
    showBookContainer.style.display = "none";
  }
}

document.getElementById("closeEditBtn").onclick = function(){
  hideEditWindow("fadeInRight", "fadeOutRight");
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
  fetchAPIKey();
  authorValid = validate(document.getElementById("authorInput"));
  titleValid = validate(document.getElementById("titleInput"));
  validateButton(document.getElementById("addBookBtn"), titleValid, authorValid);

  addBookContainer = document.getElementById("addBookContainer");
  editBookContainer = document.getElementById("editBookContainer");
  showBookContainer = document.getElementById("showBookContainer");
  addBookContainer.style.display = "none";
  showBookContainer.style.display = "block";
  editBookContainer.style.display = "none";
}

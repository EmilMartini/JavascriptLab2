var myKey;

function fetchAPI(){
  var APIUrl = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";

  const main = document.getElementById("result");
  main.innerHTML = "Loading...";
  fetch(APIUrl)
    .then((response) =>
      response.json())
    .then((key) => {main.innerHTML = key.key; myKey = key.key; console.log(key.key)})
  };

document.getElementById("requestAPIKey").onclick = function(){
  fetchAPI();
}

document.getElementById("addBookForm").onsubmit = function(){
  var newObject = {
    op : "insert",
    key : myKey,
    title : document.getElementById("title").value,
    author : document.getElementById("author").value
  };
  queryString = Object.keys(newObject).map(key => key + '=' + newObject[key]).join('&');
  var currentUrl = (window.location.href).split('?');
  currentUrl[1] = queryString;
  window.location.search = queryString;
  this.reset();
};

fetchAPI();

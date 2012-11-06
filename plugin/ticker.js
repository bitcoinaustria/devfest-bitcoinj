/* show current bitcoin price ticker */

/* DOESN'T WORK, no CORS :-( */

(function () {
  var ticker = document.querySelector("#ticker");

  return;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        alert(req.responseText);
        var data = eval("(" + req.responseText + ")")
        ticker.innerHTML = data["last"];
      } else {
        ticker.innerHTML = "ERROR: " + req;
      }
    }
  }

  req.open("GET", "https://www.bitstamp.net/api/ticker/", true);
  req.send();

}());

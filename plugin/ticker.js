/* show current bitcoin price ticker */
var quotes = function(){}
quotes.eur = "...";
quotes.usd = "...";

(function () {
  var ticker = document.querySelector("#ticker");

  function show() {
    ticker.innerHTML = "1Ƀ = " + quotes.usd + " = " + quotes.eur;
  }

  var conn2 = io.connect('https://socketio.mtgox.com/mtgox');
  var conn1 = io.connect('https://socketio.mtgox.com/mtgox?Currency=EUR');

  var cons = [ conn1, conn2 ];
  for (var i = 0; i < cons.length; i++) {
    var conn = cons[i];

    /* todo: unsubscribe doesn't work ?! */
    conn.send({ "op" : "unsubscribe", "channel" : "dbf1dee9-4f2e-4a08-8cb7-748919a71b21" }); /* trades */
    conn.send({ "op" : "unsubscribe", "channel" : "24e67e0d-1cad-4cc0-9e7a-f8523ef460fe" }); /* depth */

    conn.on('message', function(data) {
      if (data["channel"] == "d5f06780-30a8-4a48-a2f8-7ed181b4a13f") {
        if (data["op"] == "private") {
          var q = data["ticker"]["last"]["display"];
          var c = data["ticker"]["last"]["currency"];
          if (c == "USD") { quotes.usd = q; }
          if (c == "EUR") { quotes.eur = q; }
          show();
        } else if (data["op"] == "subscribe") {
          /* ticker.innerHTML = "connected"; */
        }
      }
    });

    conn.on("disconnect", function(data) {
      ticker.innerHTML = "disconnected";
    });
  }

  ticker.innerHTML = "connecting ...";

}());

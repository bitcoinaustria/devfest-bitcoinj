/* show current bitcoin price ticker */

(function () {
  var ticker = document.querySelector("#ticker");
  var usd_cur = null;
  var usd_last = null;
  var usd = "...";
  var trd = "...";
  var avg = null; /* EMA, updated for each trade */
  var trend = "";

  function show() {
    var diff = "";
    if (usd_last != null) {
      var d = usd_last - usd_cur;
      diff = " " + ((d >= 0) ? "+" : "") + d.toFixed(3);
    }
    ticker.innerHTML = "1Ƀ = " + usd + " " + diff + "@" + trd + " " + trend;
  }

  var conn = io.connect('https://socketio.mtgox.com/mtgox');

  /* todo: unsubscribe doesn't work ?! */
  conn.send({ "op" : "unsubscribe", "channel" : "24e67e0d-1cad-4cc0-9e7a-f8523ef460fe" }); /* depth */

  conn.on('message', function(data) {
    if (data["channel"] == "d5f06780-30a8-4a48-a2f8-7ed181b4a13f") {
      if (data["op"] == "private") {
        var last = data["ticker"]["last"]
        usd = last["display"];
        usd_cur = parseFloat(last["value"]);
        show();
      } else if (data["op"] == "subscribe") {
        /* ticker.innerHTML = "connected"; */
      }
    } else if (data["channel"] == "dbf1dee9-4f2e-4a08-8cb7-748919a71b21") {
      if (data["op"] == "private") {
        var trade = data["trade"];
        if (trade["price_currency"] == "USD") {
          trd = "" + trade["amount"].toFixed(3);
          if (avg == null) { avg = usd_cur; }
          if (usd_cur > avg + .001)
             trend = "&#8599;";
          else if (usd_cur < avg - .001)
             trend = "&#8600;";
          else
             trend = "&rarr;";
          show();
          avg = avg + 0.9 * ( usd_cur - avg );
          usd_last = usd_cur;
          /* console.log("avg: " + avg + " cur: " + usd_cur); */
        }
      }
    }
  });

  conn.on("disconnect", function(data) {
    ticker.innerHTML = "disconnected";
  });

  conn.on("error", function(data) {
    ticker.innerHTML = "error";
    console.log("ticker error: " + data);
  });

  ticker.innerHTML = "...";

}());

/* show current bitcoin price ticker */

(function () {
  var ticker = document.querySelector("#ticker");
  var usd_cur = -1;
  var usd_last = -1;
  var usd = "...";
  var trd = "...";

  function show() {
    var diff = "";
    if (usd_last != -1) {
      var d = usd_last - usd_cur;
      diff = " " + ((d >= 0) ? "+" : "-") + d.toFixed(3);
    }
    ticker.innerHTML = "<b>1Ƀ = " + usd + "</b>" + diff + "@" + trd;
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
        usd_last = usd_cur;
      } else if (data["op"] == "subscribe") {
        /* ticker.innerHTML = "connected"; */
      }
    } else if (data["channel"] == "dbf1dee9-4f2e-4a08-8cb7-748919a71b21") {
      if (data["op"] == "private") {
        console.log(data);
        var trade = data["trade"];
        if (trade["price_currency"] == "USD") {
          var sym = (trade["trade_type"] == "bid") ? "&#8599;" : "&#8600;";
          var vol = "" + trade["amount"].toFixed(3);
          trd = vol + " " + sym;
          show();
        }
      }
    }
  });

  conn.on("disconnect", function(data) {
    ticker.innerHTML = "disconnected";
  });

  ticker.innerHTML = "connecting ...";

}());

// https://developer.pebble.com/docs/pebblekit-js/Pebble/#on
Pebble.on('message', function(event) {
  console.log('Message received from watch:', event.data);
});

Pebble.on('ready', function(event) {
    // Get USD=>EUR currency info:
    var req = new XMLHttpRequest();
    req.open('GET', 'http://api.fixer.io/latest?base=USD', true);
    req.onload = function () {
      if (req.readyState === 4) {
        if (req.status === 200) {
          var response = JSON.parse(req.responseText);
          Pebble.postMessage({
              USDToEUR: response.rates.EUR
          });
        } else {
          console.log('Error');
        }
      }
    };
    req.send(null);
});


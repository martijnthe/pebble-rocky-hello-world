var rocky = require('rocky');

// An object to cache our date & time values,
// to minimize computations in the draw handler.
var clockData = {
  time: '',
  date: ''
};

var currencyInfo = 'Loading...';

// Every minute
// https://developer.pebble.com/docs/rockyjs/rocky/#on
rocky.on('minutechange', function(event) {
  // Current date/time
  // https://developer.pebble.com/docs/rockyjs/Date/
  var d = event.date;

  // Get current time, based on 12h or 24h format (01:00 or 1:00 AM)
  clockData.time = d.toLocaleTimeString().replace(/:\d+($| )/, '$1');

  // Day of month
  var day = d.toLocaleDateString(undefined, ({day: 'numeric'}));

  // Month name
  var month = d.toLocaleDateString(undefined, ({month: 'long'}));

  // Date
  clockData.date = (day + ' ' + month);

  // Force screen redraw
  rocky.requestDraw();
});

// Redraw the screen
rocky.on('draw', function(event) {
  // Drawing canvas
  var ctx = event.context;

  // Clear the canvas
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#Canvas
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // UnobstructedArea
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#Canvas
  var offsetY = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2;
  var centerX = ctx.canvas.unobstructedWidth / 2;

  // Text formatting
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';

  // Time font
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#font
  ctx.font = '26px bold Leco-numbers-am-pm';

  // Time
  ctx.fillText(clockData.time, centerX, (66 - offsetY));

  // Date font
  ctx.fillStyle = '#f60';
  ctx.font = '18px bold Gothic';

  // Date
  ctx.fillText(clockData.date, centerX, (94 - offsetY));

  // Currency info font
  ctx.font = '14px bold Gothic';
  ctx.fillStyle = '#3EAAFF';

  // Curreny info:
  ctx.fillText(currencyInfo, centerX, (140 - offsetY));
});


// Send a single message to the Phone
// https://developer.pebble.com/docs/rockyjs/rocky/#postMessage
rocky.postMessage("This arrives on the phone via bluetooth!");

// Listen for messages from pkjs
// https://developer.pebble.com/docs/rockyjs/rocky/#RockyMessageCallback
rocky.on("message", function(event) {
  currencyInfo = '$1 = EUR ' + event.data.USDToEUR;
  rocky.requestDraw();
});

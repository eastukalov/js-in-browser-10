'use strict';

const con = new WebSocket('wss://neto-api.herokuapp.com/mouse');

con.addEventListener('open', () => {
  showBubbles(con);
});

document.addEventListener('click', (event) => {
  con.send(JSON.stringify({x: event.x, y: event.y}));
});

window.addEventListener('beforeunload', () => {
  con.onclose = function () {};
  con.close();
});
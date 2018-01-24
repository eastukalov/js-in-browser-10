'use strict';

const con = new WebSocket('wss://neto-api.herokuapp.com/counter');

window.addEventListener('beforeunload', () => {
  con.onclose = function () {};
  con.close(1000);
});

con.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  document.querySelector('.counter').textContent = data.connections;
  document.querySelector('output.errors').value = data.errors;
});
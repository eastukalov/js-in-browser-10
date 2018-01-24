'use strict';

const con = new WebSocket('wss://neto-api.herokuapp.com/chat');
const inputText = document.querySelector('.message-box .message-input');
const submit = document.querySelector('.message-box .message-submit');
const status = document.querySelector('.chat-status');
const content = document.querySelector('.messages-content');

window.addEventListener('beforeunload', () => {
  con.addEventListener('close', () => {
    status.textContent = status.dataset.offline;
    submit.setAttribute('disabled', '');
    const el = document.querySelector('.messages-templates .message.message-status').cloneNode(true);
    el.querySelector('.message-text').textContent = 'Пользователь не в сети';
    content.appendChild(el);
  });
  con.close(1000);
});

con.addEventListener('open', () => {
  status.textContent = status.dataset.online;
  submit.removeAttribute('disabled');
  const el = document.querySelector('.messages-templates .message.message-status').cloneNode(true);
  el.querySelector('.message-text').textContent = 'Пользователь появился в сети';
  content.appendChild(el);
});

con.addEventListener('message', event => {
  let el;

  if (event.data === '...') {
    el = document.querySelector('.messages-templates .message.loading').cloneNode(true);
    content.appendChild(el);
  } else {

    if (content.querySelector('.message.loading')) {
      content.removeChild(content.querySelector('.message.loading'));
    }

    for (const nod of document.querySelectorAll('.messages-templates .message')) {

      if (nod.classList.length === 1) {
        el = nod.cloneNode(true);
        el.querySelector('.message-text').textContent = event.data;
        el.querySelector('.timestamp').textContent = getTimeNow();
        content.appendChild(el);
      }

    }
  }

});

inputText.addEventListener('keypress', event => {
  if (event.code === 'Enter') {
    event.preventDefault();
    onSend();
  }
});

submit.addEventListener('click', event => {
    event.preventDefault();
    onSend();
});

function onSend() {
  const el = document.querySelector('.messages-templates .message.message-personal').cloneNode(true);
  const text = inputText.value;
  el.querySelector('.message-text').textContent = text;
  inputText.value = '';
  el.querySelector('.timestamp').textContent = getTimeNow();
  content.appendChild(el);
  con.send(text.toString());
}
  
function getTimeNow() {
  const timeDate = new Date();
  return ((timeDate.getHours() < 10) ? '0' + timeDate.getHours().toString() : timeDate.getHours().toString()) + ':' +
    ((timeDate.getMinutes() < 10) ? '0' + timeDate.getMinutes().toString() : timeDate.getMinutes().toString());
}
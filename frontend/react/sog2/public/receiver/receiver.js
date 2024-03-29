const maxFontSize = 10;

function addConnection(connection) {
  connection.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    addMessage(data.text, data.location);
  });

  connection.addEventListener('close', function () {
    window.close();
  });
}

function addMessage(text, location) {
  const textContainer = document.getElementById('text')?.children[0];
  if (textContainer) {
    textContainer.textContent = text;
    resizeText();
  }
  const locationContainer = document.getElementById('location')?.children[0];
  if (locationContainer) {
    locationContainer.textContent = location;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (navigator.presentation.receiver) {
    navigator.presentation.receiver.connectionList.then((list) => {
      list.connections.map((connection) => {
        addConnection(connection);
        connection.send('Connected');
      });
      list.addEventListener('connectionavailable', function (event) {
        addConnection(event.connection);
      });
    });
  }
});

function resizeText() {
  const div = document.getElementById('text')?.children[0];

  if (!div?.textContent.length) {
    return;
  }

  let fontSize = 1; // начальный размер шрифта
  const step = 1; // шаг изменения размера шрифта
  div.style.fontSize = `${fontSize}vh`;

  while (div.scrollHeight <= div.clientHeight && div.scrollWidth <= div.clientWidth && fontSize <= maxFontSize) {
    fontSize += step;
    div.style.fontSize = `${fontSize}vh`;
  }

  while (div.scrollHeight > div.clientHeight || div.scrollWidth > div.clientWidth) {
    fontSize -= step;
    div.style.fontSize = `${fontSize}vh`;
  }
}

window.addEventListener('load', resizeText);
window.addEventListener('resize', resizeText);

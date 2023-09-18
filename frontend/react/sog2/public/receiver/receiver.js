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
  const textContainer = document.getElementById('text');
  textContainer.textContent = text;
  resizeText();
  const locationContainer = document.getElementById('location')?.children[0];
  if (locationContainer) {
    locationContainer.textContent = location;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (navigator.presentation.receiver) {
    navigator.presentation.receiver.connectionList.then((list) => {
      list.connections.map((connection) => addConnection(connection));
      list.addEventListener('connectionavailable', function (event) {
        addConnection(event.connection);
      });
    });
  }
});

function resizeText() {
  const div = document.getElementById('text');

  if (!div.textContent.length) {
    return;
  }

  let fontSize = 1; // начальный размер шрифта
  const step = 1; // шаг изменения размера шрифта
  div.style.fontSize = `${fontSize}px`;

  while (div.scrollHeight <= div.clientHeight && div.scrollWidth <= div.clientWidth) {
    fontSize += step;
    div.style.fontSize = `${fontSize}px`;
  }

  while (div.scrollHeight > div.clientHeight || div.scrollWidth > div.clientWidth) {
    fontSize -= step;
    div.style.fontSize = `${fontSize}px`;
  }
}

window.addEventListener('load', resizeText);
window.addEventListener('resize', resizeText);

const maxFontSize = 10;
const initialSegmentationData = {
  currentScreen: 0,
  screensCount: 1,
  overflow: 10,
};

let currentSegmentationData = initialSegmentationData;

let currentConnection = null;

function addConnection(connection) {
  connection.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    switch (data.command) {
      case 'setText':
        setText(data.text, data.location);
        break;
      case 'setSegmentation':
        setSegmentation(data);
    }
  });

  connection.addEventListener('close', function () {
    window.close();
  });

  const { width, height } = window.screen;
  // height * 0.828 because text contains 90% of height and 0% and 1% paddings of 90% (0.9 - 0.9 * 0.01)
  connection.send(JSON.stringify({ message: 'Connected', data: { width, height: height * 0.899 } }));

  currentConnection = connection;
}

function setSegmentation({ screensCount, currentScreen, overflow }) {
  const prevScreenCount = currentSegmentationData.screensCount;
  const prevOverflow = currentSegmentationData.overflow;

  currentSegmentationData = {
    screensCount,
    currentScreen,
    overflow: overflow > 90 ? prevOverflow : overflow,
  };

  if (currentSegmentationData.screensCount !== prevScreenCount || currentSegmentationData.overflow !== prevOverflow) {
    resizeText();
  }
  setOffset();
}

function setText(text, location) {
  currentSegmentationData = initialSegmentationData;
  const textContainer = document.getElementById('text')?.children[0];
  if (textContainer) {
    textContainer.style.transition = 'none';
    textContainer.style.top = '0';
    textContainer.textContent = text;
    resizeText();
    textContainer.style.position = 'static';
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
      });
      list.addEventListener('connectionavailable', function (event) {
        addConnection(event.connection);
      });
    });
  }
});

function resizeText() {
  const div = document.getElementById('text')?.children[0];

  const multiplier =
    currentSegmentationData.screensCount -
    ((currentSegmentationData.screensCount - 1) * currentSegmentationData.overflow) / 100;

  if (!div?.textContent.length) {
    return;
  }

  let fontSize = 1;
  const step = 0.1;
  div.style.fontSize = `${fontSize}vw`;

  while (
    div.scrollHeight <= div.clientHeight * multiplier &&
    div.scrollWidth <= div.clientWidth &&
    fontSize <= maxFontSize
  ) {
    fontSize += step;
    div.style.fontSize = `${fontSize}vw`;
  }

  while (div.scrollHeight > div.clientHeight * multiplier || div.scrollWidth > div.clientWidth) {
    fontSize -= step;
    div.style.fontSize = `${fontSize}vw`;
  }
}

function setOffset() {
  const div = document.getElementById('text')?.children[0];
  const realOverflow =
    (currentSegmentationData.screensCount * div.clientHeight - div.scrollHeight) /
    (currentSegmentationData.screensCount - 1);
  const offset = currentSegmentationData.currentScreen * (div.clientHeight - realOverflow);

  if (div) {
    div.style.transition = 'top 0.6s ease-in-out';
    div.style.top = `-${offset}px`;
    if (currentSegmentationData.screensCount > 1) {
      div.style.position = 'absolute';
    }
  }

  currentConnection?.send(
    JSON.stringify({
      m: offset,
      currentScreen: currentSegmentationData.currentScreen,
      clientHeight: div.clientHeight,
      realOverflow: realOverflow,
    }),
  );
}

window.addEventListener('load', resizeText);
window.addEventListener('resize', resizeText);

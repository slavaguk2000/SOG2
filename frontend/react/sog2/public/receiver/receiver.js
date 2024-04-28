const minFontSIze = 5;
const maxFontSize = 10;
const overflowPercentage = 10;
const overflow = Math.max(Math.min(overflowPercentage / 100, 90), 0);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentConnection = null;

class ScreenSegmentation {
  textBox = null;
  overlay = 0;

  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.textBox = document.getElementById('text')?.children[0];
    });
  }

  scrollToScreen(screen, { withSmooth = true } = {}) {
    if (this.textBox) {
      const offset = screen * (this.textBox.clientHeight - this.overlay);
      this.textBox.style.transition = withSmooth ? 'top 0.6s ease-in-out' : '';
      this.textBox.style.top = `-${offset}px`;
    }
  }

  getCurrentOverlay(currentScreenCount) {
    this.overlay = this.textBox
      ? (currentScreenCount * this.textBox.clientHeight - this.textBox.scrollHeight) / (currentScreenCount - 1)
      : 0;

    return this.overlay;
  }
}

const screenSegmentation = new ScreenSegmentation();

function addConnection(connection) {
  connection.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    switch (data.command) {
      case 'setText':
        const result = setText(data.text, data.location, data.currentScreen, data.lastUp, data.multiScreenShow);
        if (result?.screensCount > 1) {
          connection.send(JSON.stringify({ message: 'MultiScreenPreviewData', ...result }));
        }
        break;
      case 'scrollToScreen':
        screenSegmentation.scrollToScreen(data.newScreen);
        break;
    }
  });

  connection.addEventListener('close', function () {
    window.close();
  });

  const slideElement = document.getElementById('slide');
  const textElement = document.getElementById('text');

  if (slideElement && textElement) {
    connection.send(
      JSON.stringify({
        message: 'Connected',
        data: { width: slideElement.clientWidth, height: textElement.clientHeight },
      }),
    );
  }
  currentConnection = connection;
}

function setText(text, location, proposalCurrentScreen, lastUp, multiScreenShow) {
  const locationContainer = document.getElementById('location')?.children[0];
  if (locationContainer) {
    locationContainer.textContent = location;
  }
  const textContainer = document.getElementById('text')?.children[0];
  if (textContainer) {
    textContainer.style.transition = 'none';
    textContainer.style.top = '0';
    textContainer.textContent = text;
    return resizeText(proposalCurrentScreen, lastUp, multiScreenShow);
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

function getScreenCount(fullHeight, viewHeight, currentOverflow) {
  return Math.ceil((fullHeight / viewHeight - currentOverflow) / (1 - currentOverflow));
}

function resizeText(proposalCurrentScreen, lastUp, multiScreenShow) {
  const div = document.getElementById('text')?.children[0];
  if (!div?.textContent.length) {
    return;
  }

  let fontSize = multiScreenShow ? minFontSIze : 1;
  const forwardStep = 1;
  const backwardStep = 0.1;
  div.style.fontSize = `${fontSize}vw`;
  const currentScreenCount = multiScreenShow ? getScreenCount(div.scrollHeight, div.clientHeight, overflow) : 1;

  div.style.position = currentScreenCount > 1 ? 'absolute' : 'static';

  while (
    getScreenCount(div.scrollHeight, div.clientHeight, overflow) <= currentScreenCount &&
    div.scrollWidth <= div.clientWidth &&
    fontSize <= maxFontSize
  ) {
    fontSize += forwardStep;
    div.style.fontSize = `${fontSize}vw`;
  }

  while (
    getScreenCount(div.scrollHeight, div.clientHeight, overflow) > currentScreenCount ||
    div.scrollWidth > div.clientWidth
  ) {
    fontSize -= backwardStep;
    div.style.fontSize = `${fontSize}vw`;
  }

  const overlay = screenSegmentation.getCurrentOverlay(currentScreenCount);

  const currentScreen = Math.min(
    Math.max(proposalCurrentScreen ?? (lastUp ? currentScreenCount - 1 : 0), 0),
    currentScreenCount - 1,
  );

  screenSegmentation.scrollToScreen(currentScreen, { withSmooth: false });

  return {
    screensCount: currentScreenCount,
    fontSize,
    viewHeight: div.scrollHeight,
    viewWidth: div.scrollWidth,
    windowWidth: window.screen.width,
    bodyWidth: document.getElementById('slide')?.clientWidth,
    overlay,
    currentScreen,
  };
}

window.addEventListener('load', resizeText);
window.addEventListener('resize', resizeText);

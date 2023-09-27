chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    window.postMessage(message, '*');
  });
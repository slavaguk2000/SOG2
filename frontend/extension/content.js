document.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
      const selection = window.getSelection().toString().trim();
  
      if (selection) {
        chrome.runtime.sendMessage({ text: selection });
      }
    }
  });
  
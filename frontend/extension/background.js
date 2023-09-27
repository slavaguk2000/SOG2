chrome.contextMenus.create({
  id: "display_on_projector",
  title: "Вывести на проектор",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "display_on_projector") {
    const selectedText = info.selectionText;
    const currentTabTitle = tab.title;
    sendMessageToPresentationTab(selectedText, currentTabTitle);
  }
});

function sendMessageToPresentationTab(text, title) {
  chrome.tabs.query({ url: '*://localhost/*' }, (tabs) => {
    const presentationTab = tabs.find(({ title }) => title === "Song of God 2");
    if (presentationTab) {
      chrome.tabs.sendMessage(presentationTab.id, { text, title }, () => {
        chrome.tabs.update(presentationTab.id, { active: true });
      });
    } else {
      console.error("React app tab not found");
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    sendResponse({ text: window.getSelection().toString() });
  }
});

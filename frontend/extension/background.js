try {
  chrome.contextMenus.create({
    id: "display_on_projector",
    title: "Вывести на проектор",
    contexts: ["selection"],
  });
} catch (error) {
  console.error("Ошибка при создании контекстного меню:", error);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "display_on_projector") {
    const selectedText = info.selectionText;
    const currentTabTitle = tab.title;
    sendMessageToPresentationTab(selectedText, currentTabTitle);
  }
});

function sendMessageToPresentationTab(text, slideTitle) {
  chrome.tabs.query({ url: '*://localhost/*' }, (tabs) => {
    const presentationTab = tabs.find(({ title }) => title === "Song of God 2");
    if (presentationTab) {
      chrome.tabs.sendMessage(presentationTab.id, { text, title: slideTitle }, () => {
        chrome.tabs.update(presentationTab.id, { active: true });
      });
    } else {
      console.error("React app tab not found");
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "show_free_slide") {
    sendMessageToPresentationTab(message.data.text, message.data.title);
    sendResponse({status: "success", responseData: "someResponseData"});
  }
});

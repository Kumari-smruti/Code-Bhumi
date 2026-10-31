chrome.runtime.onMessage.addListener((message) => {
  if (!message || message.action !== 'openPopup') return
  chrome.action.openPopup()
})

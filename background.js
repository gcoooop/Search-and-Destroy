// initialize the storage space
chrome.storage.local.get(null, result => {
  if (!Object.keys(result).length) {
    chrome.storage.local.set({
      blockedVids: [],
      settings: {
        disableAutoplay: true,
        disableHomepage: true,
        disableSearchSuggestions: true,
        disableDestroyCounter: true
      }
    });
  }
});
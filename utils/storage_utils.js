function getStorage(fn) {
  chrome.storage.local.get(null, result => {
    fn(result);
  });
};

function addStorageListener(fn) {
  chrome.storage.onChanged.addListener(fn);
};
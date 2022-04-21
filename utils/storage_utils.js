function getStorage(fn) {
  chrome.storage.local.get(null, fn);
};

function addStorageListener(fn) {
  chrome.storage.onChanged.addListener(fn);
};

function addVideosToStorage(videos) {
  let blockedVids = toArray(videos);
  getStorage(result => {
    blockedVids = concatUnique(result.blockedVids, blockedVids);
    chrome.storage.local.set({ blockedVids });
  });
};

function removeVideoFromStorage(video) {
  getStorage(result => {
    const blockedVids = result.blockedVids.filter(blockedVid => !isEqualInsensitive(video, blockedVid));
    chrome.storage.local.set({ blockedVids });
  });
};

function updateSettingInStorage(setting, value) {
  getStorage(result => {
    const storedSettings = result.settings;
    storedSettings[setting] = value;
    chrome.storage.local.set({ 
      settings: storedSettings 
    });
  })
};
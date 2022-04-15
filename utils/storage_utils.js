async function getBlockedVids() {
  const result = await chrome.storage.local.get("blockedVids");
  return result.blockedVids || [];
};

function addStorageListener(key, fn) {
  chrome.storage.onChanged.addListener(changes => {
    if (changes[key]) {
      fn(changes[key]);
    }
  });
};
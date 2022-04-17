const pageUrl = window.location.href;
const sndDestroyedAttr = "snd-destroyed";
const blockedVids = new DynamicArray();
const settings = new Settings();

function initializeGlobals(cb) {
  getStorage(result => {
    blockedVids.concat(result.blockedVids);
    settings.reset(result.settings);

    if(cb) {
      cb(result);
    }
  });
};

function startGlobalListeners(cb) {
  addStorageListener(changes => {
    if (changes.blockedVids) {
      blockedVids.replace(changes.blockedVids.newValue);
    }
  
    if (changes.settings) {
      settings.reset(changes.settings.newValue);
    }

    if (cb) {
      cb(changes);
    }
  });
};

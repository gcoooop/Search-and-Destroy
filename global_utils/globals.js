const SND_DESTROYED_ATTR = "snd-destroyed";
const AUTOPLAY_SETTING_NAME = "disableAutoplay";
const HOMEPAGE_SETTING_NAME = "disableHomepage";
const SEARCH_SUGGESTIONS_SETTING_NAME = "disableSearchSuggestions";
const DESTROY_COUNTER_SETTING_NAME = "disableDestroyCounter";

const blockedVids = new DynamicArray();
const settings = new Settings();

function getPageUrl() {
  return window.location.href;
};

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

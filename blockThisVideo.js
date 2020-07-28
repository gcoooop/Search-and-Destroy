let settings = null;
function getSettings() {
  chrome.storage.local.get("settings", data => {
    settings = data.settings;
  });
}
getSettings();

function updateDestroyCount(zero) {
  chrome.storage.local.get("settings", data => {
    const counterEle = document.querySelector("#destroy-counter");
    const count = document.querySelector("#destroy-counter > span");
    if (zero) {
      count.innerText = "0";
    } else {
      count.innerText = parseInt(count.innerText) + 1;
    }
  
    if (data.settings["destroy-counter-toggle"]) {
      counterEle.style.removeProperty("display");
    } else {
      counterEle.style.display = "none";
    }
  });
}

function initCounter() {
  chrome.storage.local.get("settings", data => {
    const counterEle = document.createElement("div");
    const title = document.createElement("h4");
    const count = document.createElement("span");
  
    counterEle.appendChild(title);
    counterEle.appendChild(count);
    document.body.appendChild(counterEle);
  
    counterEle.id = "destroy-counter";

    counterEle.style.zIndex = "9999";
    counterEle.style.position = "fixed";
    counterEle.style.bottom = "16px";
    counterEle.style.left = "16px";
    counterEle.style.padding = "16px";
    counterEle.style.background = "white";
    counterEle.style.border = "1px solid black";
    counterEle.style.textAlign = "center";
    title.style.marginBottom = "8px";
    if (data.settings["destroy-counter-toggle"]) {
      counterEle.style.removeProperty("display");
    } else {
      counterEle.style.display = "none";
    }
  
    title.innerText = "Destroy Counter";
    count.innerText = "0";
  
    document.addEventListener("yt-navigate-start", () => updateDestroyCount(true));
  });
}
initCounter();

// block logic
const elesForBlock = {
  "homepage": "#primary > ytd-rich-grid-renderer",
  "results": {
    "promoted_video": "ytd-promoted-video-renderer",
    "search_suggestions": "ytd-horizontal-card-list-renderer",
    "radio": "ytd-radio-renderer",
    "related_search": "ytd-shelf-renderer",
    "playlist": "ytd-playlist-renderer",
    "video": {
      "ele": "ytd-video-renderer",
      "channel_name": "ytd-channel-name a",
      "title": "#video-title yt-formatted-string"
    },
    "channel": {
      "ele": "ytd-channel-renderer",
      "channel_name": "yt-formatted-string.ytd-channel-name"
    }
  },
  "watch": {
    "autoplay": "ytd-compact-autoplay-renderer",
    "autoplay_button": "#toggle",
    "radio": "ytd-compact-radio-renderer",
    "playlist": "ytd-compact-playlist-renderer",
    "promoted_video": "ytd-compact-promoted-video-renderer",
    "ad": "div#player-ads",
    "video": {
      "ele": "ytd-compact-video-renderer",
      "channel_name": "yt-formatted-string.ytd-channel-name",
      "title": "span#video-title",
      "meta": "#metadata-line > span"
    }
  }
}

const { homepage, results, watch } = elesForBlock;
let blockedVids = null;
async function getBlockedVids() {
  await chrome.storage.local.get("blockedVids", data => {
    blockedVids = data.blockedVids || [];
    if (settings["recommended-videos-toggle"]) {
      blockedVids = blockedVids.concat("recommended for you");
    }
  });
}
getBlockedVids();

function blockTheseVideos () {
  const url = window.location.href;
  if (url == "https://www.youtube.com/") {
    const page = document.querySelector( homepage );
    if (settings["homepage-toggle"]) {
      if (page) page.style.display = "none";
    } else {
      if (page) page.style.removeProperty("display");
    }
  } else if (url.includes("results")) {
    // search result videos
    blockElementsByQuerySelector( results.promoted_video );
    blockElementsByQuerySelector( results.radio );
    blockElementsByQuerySelector( results.playlist );
    if (settings["search-suggestions-toggle"]) {
      blockElementsByQuerySelector( results.search_suggestions );
      blockElementsByQuerySelector( results.related_search );
    } else {
      unblockElementsByQuerySelector( results.search_suggestions );
      unblockElementsByQuerySelector( results.related_search );
    }
    blockVideosByQuerySelector( results.video.ele, results.video.channel_name );
    blockVideosByQuerySelector( results.video.ele, results.video.title );
    blockVideosByQuerySelector( results.channel.ele, results.channel.channel_name );
  } else if (url.includes("watch")) {
    // related videos
    // blockElementsByQuerySelector( watch.autoplay );
    blockElementsByQuerySelector( watch.radio );
    blockElementsByQuerySelector( watch.playlist );
    blockElementsByQuerySelector( watch.promoted_video );
    blockElementsByQuerySelector( watch.ad );
    blockVideosByQuerySelector( watch.video.ele, watch.video.channel_name );
    blockVideosByQuerySelector( watch.video.ele, watch.video.title );
    blockVideosByQuerySelector( watch.video.ele, watch.video.meta );
    if (settings["autoplay-toggle"]) toggleOffAutoplay();
  } else {
    throw `URL not accounted for: ${url}`;
  }
}

function blockVideosByQuerySelector(cssSelectorForRemoval, cssSelectorForTest) {
  const videoEles = document.querySelectorAll(cssSelectorForRemoval);

  for (let i = 0; i < videoEles.length; i++) {
    const videoEle = videoEles[i];
    const eleToTest = videoEle.querySelector(cssSelectorForTest);

    if (eleToTest) {
      eleText = eleToTest.innerText;
      for (let j = 0; j < blockedVids.length; j++) {
        const blockedVid = blockedVids[j].toLowerCase();
        if ( eleText.toLowerCase().includes(blockedVid) ) {
          if (videoEle.style.display == "none") break;
          videoEle.style.display = "none";
          updateDestroyCount(false);
          break;
        }
      } 
    }

  }
}

function blockElementsByQuerySelector(cssSelector) {
  const eles = document.querySelectorAll(cssSelector);
  for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    ele.style.display = "none";
  }
}

function unblockElementsByQuerySelector(cssSelectorForUnblock) {
  const eles = document.querySelectorAll(cssSelectorForUnblock);
  for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    ele.style.removeProperty("display");
  }
}

let blockInterval = setInterval(blockTheseVideos, 250)

function refreshExt() {
  getSettings();
  getBlockedVids();
  clearInterval(blockInterval);
  const url = window.location.href;
  if (url == "https://www.youtube.com/") {

  } else if (url.includes("results")) {
    // search result videos
    unblockElementsByQuerySelector( results.video.ele );
    unblockElementsByQuerySelector( results.channel.ele );
  } else if (url.includes("watch")) {
    // related videos
    unblockElementsByQuerySelector( watch.video.ele );
  } else {
    throw `URL not accounted for: ${url}`;
  }
  updateDestroyCount(true);
  blockInterval = setInterval(blockTheseVideos, 250);
}

chrome.storage.onChanged.addListener(refreshExt);

function toggleOffAutoplay() {
  const toggle = document.querySelector( watch.autoplay_button );
  if (!!toggle && !!toggle.attributes.checked) {
    toggle.click();
  }
}
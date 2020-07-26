// init counter
const node = document.createElement("div");
const title = document.createElement("h4");
const count = document.createElement("span");

node.appendChild(title);
node.appendChild(count);
document.body.appendChild(node);

node.style.zIndex = "9999";
node.style.position = "fixed";
node.style.bottom = "16px";
node.style.left = "16px";
node.style.padding = "16px";
node.style.background = "white";
node.style.border = "1px solid black";
node.style.textAlign = "center";
title.style.marginBottom = "8px";

title.innerText = "Destroy Counter";
count.innerText = "0";

function updateDestroyCount(zero) {
  if (zero) {
    count.innerText = "0";
  } else {
    count.innerText = parseInt(count.innerText) + 1;
  }
}

document.addEventListener("yt-navigate-start", () => updateDestroyCount(true));

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
    blockedVids = blockedVids.concat("recommended for you");
  });
}
getBlockedVids();

function blockTheseVideos () {
  const url = window.location.href;
  if (url == "https://www.youtube.com/") {
    const page = document.querySelector( homepage );
    if (page) page.innerHTML = "Bye bye homepage!";
  } else if (url.includes("results")) {
    // search result videos
    blockElementsByQuerySelector( results.promoted_video );
    blockElementsByQuerySelector( results.search_suggestions );
    blockElementsByQuerySelector( results.radio );
    blockElementsByQuerySelector( results.related_search );
    blockElementsByQuerySelector( results.playlist );
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
    toggleOffAutoplay()
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

async function refreshExt() {
  await getBlockedVids();
  clearInterval(blockInterval);
  const url = window.location.href;
  if (url.includes("results")) {
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
// these are the keywords of videos to block
let blockedVids = null;

async function getBlockedVids() {
  await chrome.storage.local.get("blockedVids", data => {
    blockedVids = data.blockedVids || [];
    blockedVids.concat("Recommended for you");
  });
}
getBlockedVids();
// main method to block videos
// mutations arg is for the mutation observer event
// and is set to "default" if null to account for 
// non mutation observer event calls to this method
function blockTheseVideos (mutations = "default") {
  const mr = mutations[0];
  if ( mutations == "default" || !!mr.addedNodes.length ) {
    console.log("here")
    // search result videos
    blockElementsByQuerySelector("ytd-promoted-video-renderer");
    blockElementsByQuerySelector("ytd-horizontal-card-list-renderer");
    blockElementsByQuerySelector("ytd-radio-renderer");
    blockElementsByQuerySelector("ytd-shelf-renderer");
    blockVideosByQuerySelector("ytd-video-renderer", "ytd-channel-name a");
    blockVideosByQuerySelector("ytd-video-renderer", "#video-title yt-formatted-string");
    blockVideosByQuerySelector("ytd-channel-renderer", "yt-formatted-string.ytd-channel-name");
    
    // related videos
    blockElementsByQuerySelector("ytd-compact-autoplay-renderer");
    blockElementsByQuerySelector("ytd-compact-radio-renderer");
    blockElementsByQuerySelector("ytd-compact-promoted-video-renderer");
    blockElementsByQuerySelector("div#player-ads");
    blockVideosByQuerySelector("ytd-compact-video-renderer", "yt-formatted-string.ytd-channel-name");
    blockVideosByQuerySelector("ytd-compact-video-renderer", "span#video-title");
    blockVideosByQuerySelector("ytd-compact-video-renderer", "#metadata-line > span");
  }
}

// removes element based on cssSelectorForRemoval arg
// if the element targeted by cssSelectorForTest
// includes a keyword to block in the elements inner text
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
          videoEle.style.display = "none";
        }
      }
    }

  }
}

// removes the elements that match the css selector string
function blockElementsByQuerySelector(cssSelector) {
  const eles = document.querySelectorAll(cssSelector);
  for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    ele.style.display = "none";
  }
}

setInterval(blockTheseVideos, 1000)

// // retrieves the videos lists element based on the URL
// // if the url includes "results", it gets the search results element
// // if the url includes "watch", it gets the related videos element
// // if the url is the homepage, return "homepage"
// function getYoutubeListEle() {
//   const url = window.location.href;
//   if ( url == "https://www.youtube.com/") {
//     return "homepage";
//   } else if ( url.includes("https://www.youtube.com/results") ) {
//     return document.querySelector("div#contents.ytd-section-list-renderer div#contents.ytd-item-section-renderer");
//   } else if ( url.includes("https://www.youtube.com/watch") ) {
//     return document.querySelector("div#items.ytd-watch-next-secondary-results-renderer");
//   } else {
//     throw `URL unaccounted for\n${url}`;
//   }
// }

// // sets up the mutation observer
// // semi hacky logic to take care of the homepage..
// const config = { childList: true };
// const observer = new MutationObserver(blockTheseVideos);
// window.addEventListener("beforeunload", observer.disconnect);

// // assigns the observer to the node arg
// // if the node arg is the homepage, bye bye homepage
// function assignObserver(node) {
//   if (!node) return;
//   if (node == "homepage") {
//     byebyeHomepage();
//   } else {
//     observer.observe(node, config);
//   }
// }

// // this will reassess the observer target if the back/forward button are clicked
// // or if Youtube is navigating to a new page
// function reassessObserverTarget() {
//   observer.disconnect();
//   const node = getYoutubeListEle();
//   assignObserver(node);
// }
// // window.addEventListener("load", reassessObserverTarget);
// reassessObserverTarget();
// document.addEventListener("yt-navigate-finish", reassessObserverTarget);
// window.addEventListener("popstate", reassessObserverTarget);

// // bye bye homepage
// function byebyeHomepage() {
//   document.querySelector("#primary > ytd-rich-grid-renderer").innerHTML = "Bye bye homepage!";
// }

// blocks videos if storage has been updated
chrome.storage.onChanged.addListener(() => {
  getBlockedVids();
  // blockTheseVideos();
});
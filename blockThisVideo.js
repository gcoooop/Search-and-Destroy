let blockedVids = [];
chrome.storage.local.get("blockedVids", data => blockedVids = data.blockedVids || []);

function blockTheseVideos () {
  blockElementsByQuerySelector("ytd-promoted-video-renderer");
  blockElementsByQuerySelector("ytd-horizontal-card-list-renderer");
  blockElementsByQuerySelector("ytd-radio-renderer");
  blockElementsByQuerySelector("ytd-shelf-renderer");
  blockElementsByQuerySelector("ytd-compact-autoplay-renderer");
  blockElementsByQuerySelector("ytd-compact-radio-renderer");

  blockVideosByQuerySelector("ytd-video-renderer", "ytd-channel-name a");
  blockVideosByQuerySelector("ytd-video-renderer", "#video-title yt-formatted-string");
  blockVideosByQuerySelector("ytd-channel-renderer", "yt-formatted-string.ytd-channel-name");
  blockVideosByQuerySelector("ytd-compact-video-renderer", "ytd-formatted-string.ytd-channel-name");
  blockVideosByQuerySelector("ytd-compact-video-renderer", "yt-formatted-string.ytd-channel-name");
  blockVideosByQuerySelector("ytd-compact-video-renderer", "span#video-title");
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
          videoEle.remove();
        }
      }
    }

  }
}

function blockElementsByQuerySelector(cssSelector) {
  const eles = document.querySelectorAll(cssSelector);
  for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    ele.remove();
  }
}

const body = document.body;
const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(blockTheseVideos);
observer.observe(body, config);
document.addEventListener("beforeunload", observer.disconnect);

chrome.storage.onChanged.addListener(blockTheseVideos);
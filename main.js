const destroyerEngine = new TargetingEngine();
const reconstructorEngine = new TargetingEngine();
let blockedVids = new DynamicArray();

const homepageDestroyer = new PageTargeter("https://www.youtube.com/", { exact: true });
const resultsDestroyer = new PageTargeter("results");
const watchDestroyer = new PageTargeter("watch");
// need an OR mechanism
const channelDestroyer = new PageTargeter("channel"); 
const sndReconstructor = new PageTargeter();

// homepage
homepageDestroyer.add(new ComponentTargeter("#primary > ytd-rich-grid-renderer", Operation.block));

// results
resultsDestroyer.add([
  new ComponentTargeter("ytd-shelf-renderer", Operation.delete),
  new ComponentTargeter("ytd-horizontal-card-list-renderer", Operation.delete),
  new ComponentTargeter("ytd-radio-renderer", Operation.delete),
  new ComponentTargeter("ytd-playlist-renderer", Operation.delete),
  new ComponentTargeter("ytd-promoted-sparkles-web-renderer", Operation.delete),
  new ComponentTargeter("ytd-promoted-sparkles-text-search-renderer", Operation.delete),
  new ComponentTargeter("ytd-video-renderer", Operation.blockIf(eleContainsTextInArray(blockedVids)))
]);

// watch
watchDestroyer.add([
  new ComponentTargeter("ytd-player-legacy-desktop-watch-ads-renderer", Operation.delete),
  new ComponentTargeter("ytd-promoted-sparkles-web-renderer", Operation.delete),
  new ComponentTargeter("ytd-compact-video-renderer", Operation.blockIf(eleContainsTextInArray(blockedVids))),
  new ComponentTargeter("a.ytp-videowall-still.ytp-suggestion-set", Operation.blockIf(eleContainsTextInArray(blockedVids)))
]);

// channel
channelDestroyer.add([
  new ComponentTargeter("ytd-channel-video-player-renderer", Operation.delete)
]);

// reconstructor
sndReconstructor.add(new ComponentTargeter(`[${sndDestroyedAttr}]`, Operation.unblock))

destroyerEngine.add([
  homepageDestroyer,
  resultsDestroyer,
  watchDestroyer,
  channelDestroyer
]);
destroyerEngine.start();

reconstructorEngine.add(sndReconstructor);

addStorageListener("blockedVids", changes => {
  blockedVids.replace(changes.newValue);
  reconstructorEngine.execute();
  destroyerEngine.execute();
});

(async () => {
  const storedKeywords = await getBlockedVids();
  blockedVids.concat(storedKeywords);
  destroyerEngine.execute();
})();
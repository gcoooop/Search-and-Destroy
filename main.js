const destroyerEngine = new TargetingEngine();
const reconstructorEngine = new TargetingEngine();

const homepageDestroyer = new PageTargeter("https://www.youtube.com/", { exact: true });
const resultsDestroyer = new PageTargeter("/results");
const watchDestroyer = new PageTargeter("/watch");
const channelDestroyer = new PageTargeter(["/channel", "/user", "/u", "/c"]); 
const sndReconstructor = new PageTargeter();

// homepage
homepageDestroyer.add(new ComponentTargeter("#primary > ytd-rich-grid-renderer", Operation.block, settings.get("homepage-toggle")));

// results
resultsDestroyer.add([
  new ComponentTargeter("ytd-shelf-renderer", Operation.delete, settings.get("search-suggestions-toggle")),
  new ComponentTargeter("ytd-horizontal-card-list-renderer", Operation.delete, settings.get("search-suggestions-toggle")),
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
  new ComponentTargeter("video", Operation.pause),
  new ComponentTargeter("ytd-channel-video-player-renderer", Operation.block)
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

initializeGlobals(() => {
  destroyerEngine.execute();
});

startGlobalListeners(() => {
  reconstructorEngine.execute();
  destroyerEngine.execute();
});
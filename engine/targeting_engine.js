class TargetingEngine {
  constructor() {
    this.ytdApp = document.querySelector("ytd-app");
    this.observer = null;
    this.pageTargeters = [];
  }

  add(pageTargeter) {
    if (Array.isArray(pageTargeter)) {
      this.pageTargeters = this.pageTargeters.concat(pageTargeter);
    } else {
      this.pageTargeters.push(pageTargeter);
    }
  }
  
  execute() {
    this.pageTargeters.forEach(pageTargeter => pageTargeter.execute());
  }

  start() {
    // const throttleFn = throttle(250);
    this.observer = new MutationObserver((mutationsList, observer) => {
      this.execute()
      // throttle causes an issue where the final fn execution does not get called which results in waiting for an additional mutation event
      // throttleFn(this.execute.bind(this));
    });
    this.observer.observe(this.ytdApp, { childList: true, subtree: true });
  }
}
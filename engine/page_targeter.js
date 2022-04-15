class PageTargeter {
  constructor(keywordOrUrl = "", options = {}) {
    this.keywordOrUrl = keywordOrUrl;
    this.options = options;
    this.componentTargeters = [];
  }

  add(componentTargeters) {
    if (Array.isArray(componentTargeters)) {
      this.componentTargeters = this.componentTargeters.concat(componentTargeters);
    } else {
      this.componentTargeters.push(componentTargeters);
    }
  }

  execute() {
    if (this.isPageMatch()) {
      this.componentTargeters.forEach(componentTargeter => componentTargeter.execute());
    }
  }

  isPageMatch() {
    if (this.options.exact) {
      return exactlyMatchesPageUrl(this.keywordOrUrl);
    } else {
      return matchesPageUrl(this.keywordOrUrl);
    }
  }
}
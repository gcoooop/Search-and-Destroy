class PageTargeter {
  constructor(keywordsOrUrls = [""], options = {}) {
    if (Array.isArray(keywordsOrUrls)) {
      this.keywordsOrUrls = keywordsOrUrls;
    } else {
      this.keywordsOrUrls = [keywordsOrUrls];
    }
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
    return this.keywordsOrUrls.some(keywordOrUrl => {
      if (this.options.exact) {
        return exactlyMatchesPageUrl(keywordOrUrl);
      } else {
        return matchesPageUrl(keywordOrUrl);
      }
    });
  }
}
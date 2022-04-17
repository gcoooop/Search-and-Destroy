class Settings {
  constructor(settings = {}) {
    this.settings = settings;
  }

  get(key) {
    return () => {
      return this.settings[key];
    };
  }

  reset(settings) {
    this.settings = settings;
  }
}
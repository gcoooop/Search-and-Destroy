class ComponentTargeter {
  constructor(cssSelector, operation) {
    this.cssSelector = cssSelector;
    this.operation = operation;
  }

  execute() {
    const eles = this.getElements();
    this.operation(eles);
  };

  getElements() {
    return getElementsForSelector(this.cssSelector);
  }
}
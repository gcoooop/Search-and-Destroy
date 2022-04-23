class ComponentTargeter {
  constructor(cssSelector, operation, conditionFn = () => true) {
    this.cssSelector = cssSelector;
    this.operation = operation;
    this.conditionFn = conditionFn;
  }

  execute() {
    if (this.conditionFn()) {
      const eles = this.getElements();
      this.operation(eles);
    }
  };

  getElements() {
    return getElementsForSelector(this.cssSelector);
  }
}
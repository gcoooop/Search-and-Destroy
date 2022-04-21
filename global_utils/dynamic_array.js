class DynamicArray {
  constructor(items = []) {
    this.array = items;
  }

  push(item) {
    this.array.push(item);
    return this.array;
  }

  concat(items) {
    this.array = this.array.concat(items);
    return this.array;
  }

  replace(array) {
    this.array = array;
    return this.array;
  }

  some(fn) {
    return this.array.some(fn);
  }

  sort() {
    return this.array.sort();
  }
}
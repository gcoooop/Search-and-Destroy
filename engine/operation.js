class Operation {
  static block(eles) {
    eles.forEach(hideElement);
  }

  static unblock(eles) {
    eles.forEach(unhideElement);
  }

  static blockIf(fn) {
    return eles => {
      eles.forEach(ele => {
        if (fn(ele)) {
          hideElement(ele);
        }
      });
    };
  };

  static delete(eles) {
    eles.forEach(deleteElement);
  }

  static pause(eles) {
    eles.forEach(pauseElement)
  }
}
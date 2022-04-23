class Counter {
  static initialize() {
    Counter.titleEle = document.createElement("h4");
    Counter.titleEle.innerText = "Destroy Counter";
    
    Counter.countEle = document.createElement("span");

    Counter.counterEle = document.createElement("div");
    Counter.counterEle.id = "sndDestroyCounter";
    
    Counter.counterEle.appendChild(Counter.titleEle);
    Counter.counterEle.appendChild(Counter.countEle);
    document.body.appendChild(Counter.counterEle);
    Counter.update();
  }

  static update() {
    Counter.countEle.innerText = Counter.getCount();
    if (Counter.isDisabled()) {
      removeClassName(Counter.counterEle, "active");
    } else {
      addClassName(Counter.counterEle, "active");
    }
  }

  static isDisabled() {
    return settings.get(DESTROY_COUNTER_SETTING_NAME)();
  }
  
  static getCount() {
    // this only captures the non-deleted nodes
    return document.querySelectorAll(`[${SND_DESTROYED_ATTR}]`).length;
  }

  // static build() {
  //   // document.addEventListener("yt-navigate-start", () => updateDestroyCount(true));
  // }

}
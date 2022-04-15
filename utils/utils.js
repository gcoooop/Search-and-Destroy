const pageUrl = window.location.href;
const sndDestroyedAttr = "snd-destroyed";

function getElementsForSelector(cssSelector) {
  return Array.from(document.querySelectorAll(cssSelector));
};

function hideElement(ele) {
  ele.setAttribute(sndDestroyedAttr, true);
};

function unhideElement(ele) {
  ele.removeAttribute(sndDestroyedAttr);
};

function deleteElement(ele) {
  ele.remove();
}

function testEleForText(ele, text) {
  return ele.innerText.toLowerCase().includes(text.toLowerCase());
};

function eleContainsText(inputText) {
  return ele => {
    return testEleForText(ele, inputText);
  };
};

function eleContainsTextInArray(inputTextArray) {
  return ele => {
    return inputTextArray.some(text => {
      return eleContainsText(text)(ele);
    });
  };
};

function exactlyMatchesPageUrl(url) {
  return pageUrl === url;
};

function matchesPageUrl(keyword) {
  return pageUrl.includes(keyword);
};

function throttle(timeout) {
  let isTimedout = false;
  return (fn, ...args) => {
    if (!isTimedout) {
      isTimedout = true;
      fn(...args);
      setTimeout(() => {
        isTimedout = false;
      }, timeout);
    }
  };
};
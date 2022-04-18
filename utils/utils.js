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
};

function pauseElement(ele) {
  ele.pause();
};

function eleContainsText(inputText) {
  return ele => {
    return includesInsensitive(ele.innerText, inputText);
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

function isEqualInsensitive(string1, string2) {
  return string1.toUpperCase() === string2.toUpperCase();
};

function includesInsensitive(strOrArr, string) {
  if (Array.isArray(strOrArr)) {
    return strOrArr.some(item => isEqualInsensitive(item, string));
  } else { 
    return string1.toUpperCase().includes(string2.toUpperCase());
  }
};

function throttle(timeout) {
  let isTimedout = false;
  return (fn, ...args) => {
    if (!isTimedout) {
      isTimedout = true;
      setTimeout(() => {
        fn(...args);
        isTimedout = false;
      }, timeout);
    }
  };
};

function toArray(input) {
  if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
};

function concatUnique(array1, array2) {
  return array1.concat(array2.filter(item => !includesInsensitive(array1, item)));
};
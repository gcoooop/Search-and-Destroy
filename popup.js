document.addEventListener("DOMContentLoaded", init);

// initializes event listeners and the popup list of entries
function init() {
  chrome.storage.onChanged.addListener(rebuildList);
  
  const form = document.getElementById("video-form");
  const input = document.getElementById("video-input");
  const list = document.getElementById("blocked-videos-list");
  const downloadButton = document.getElementById("download-button");
  const uploadField = document.getElementById("upload-field");
  
  form.addEventListener("submit", () => addToStorage(input.value));
  downloadButton.addEventListener("click", downloadCSV);
  uploadField.addEventListener("change", handleUploadChange);
  createList(list);
}

// creates the popup's list of user entries
function createList(list) {
  getBlockedVids(data => {
    if (!data.blockedVids) return null;
    const blockedVidsSorted = data.blockedVids.sort();
    for (let i = 0; i < blockedVidsSorted.length; i++) {
      const blockedVid = blockedVidsSorted[i];
      const li = createListItem(blockedVid);
      list.appendChild(li);
      list.style.listStyle = "none";
    }
  });
  return list;
}

// creates a single list item and styles it
function createListItem(blockedVid) {
  const li = document.createElement("li");
  const button = document.createElement("button");
  const span = document.createElement("span");

  button.innerHTML = "&times;";
  button.style.border = "none";
  button.style.backgroundColor = "white";
  button.style.color = "red";
  button.style.fontWeight = "bold";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => removeFromStorage(blockedVid));
  
  span.innerText = blockedVid;

  li.appendChild(button);
  li.appendChild(span);
  return li;
}

// resets and rebuilds the popup list
function rebuildList() {
  const list = document.getElementById("blocked-videos-list");
  list.innerHTML = "";
  createList(list);
}

// adds the video text arg to storage under the key "blockedVids"
// can accept an array or string as an argument
function addToStorage(videoText) {
  getBlockedVids( data => {
    let prev = data.blockedVids || [];
    if (prev) {
      chrome.storage.local.set({ "blockedVids": prev.concat(videoText) }, () => console.log(`Saved: ${videoText}`));
    } else {
      chrome.storage.local.set({ "blockedVids": [videoText] }, () => console.log(`Saved: ${videoText}`));
    }
  });
}

// removes a single keyword from storage
function removeFromStorage(vid) {
  getBlockedVids( data => {
    let prev = data.blockedVids;
    let newStorage = prev.filter(blockedVid => blockedVid != vid);
    chrome.storage.local.set({ "blockedVids": newStorage }, () => {
      console.log(`${vid} removed`);
    });
  });
}

// calls chrome storage api with a callback function as an arg
// returns an object of data from chrome
function getBlockedVids(fn) {
  return chrome.storage.local.get("blockedVids", fn);
}

// downloads a CSV file of the blocked keywords from chrome storage
function downloadCSV() {
  getBlockedVids(data => {
    const blob = new Blob([data.blockedVids], { type: 'text/csv' });
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "BlockedVideos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

// uploads a CSV of keywords and adds to chrome storage
function uploadCSV(text) {
  const videoTexts = text.split(",");
  addToStorage(videoTexts);
}

// onChange handler for uploading a file to the input field for a CSV file
function handleUploadChange(event) {
  const file = event.target.files[0];
  if (file) {
    const fr = new FileReader();
    fr.readAsText(file);

    fr.onload = () => {
      uploadCSV(fr.result);
    }

    fr.onerror = () => {
      alert(fr.error);
    }
  }
}
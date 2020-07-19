document.addEventListener("DOMContentLoaded", init);

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

function rebuildList() {
  const list = document.getElementById("blocked-videos-list");
  list.innerHTML = "";
  createList(list);
}

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

function removeFromStorage(vid) {
  getBlockedVids( data => {
    let prev = data.blockedVids;
    let newStorage = prev.filter(blockedVid => blockedVid != vid);
    chrome.storage.local.set({ "blockedVids": newStorage }, () => {
      console.log(`${vid} removed`);
    });
  });
}

function getBlockedVids(fn) {
  return chrome.storage.local.get("blockedVids", fn);
}

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

function uploadCSV(text) {
  const videoTexts = text.split(",");
  addToStorage(videoTexts);
}

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
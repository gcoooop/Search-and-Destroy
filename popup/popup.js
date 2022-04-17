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

  const toggles = document.querySelectorAll("input[type='checkbox']");
  displaySettings(toggles);
  toggles.forEach(toggle => toggle.addEventListener("change", handleToggleClick));

  const tabButtons = document.querySelectorAll(".tabs button");
  tabButtons.forEach(tabButton => tabButton.addEventListener( "click", 
    event => handleTabClick(event, tabButton.id.replace("-button","")) 
  ));
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

function handleToggleClick(event) {
  const key = event.target.id;
  const bool = event.target.checked;
  updateSettings(key, bool);
}

function getSettings(fn) {
  chrome.storage.local.get("settings", fn);
}

async function initializeSettings(toggles) {
  // should only run once on the very first time the extension is used
  const settings = {};
  toggles.forEach(toggle => {
    settings[toggle.id] = true;
  });
  await chrome.storage.local.set({ settings }, () => console.log("Initialized settings object"));
  return settings;
}

function updateSettings(key, bool) {
  getSettings(data => {
    const settings = data.settings;
    settings[key] = bool;
    chrome.storage.local.set({ settings }, () => console.log(`${key} set to ${bool}`));
  });
}

function displaySettings(toggles) {
  getSettings(data => {
    const settings = data.settings || initializeSettings(toggles);
    toggles.forEach(toggle => {
      if ( settings.hasOwnProperty(toggle.id) ) {
        const bool = settings[toggle.id];
        toggle.checked = bool;
      } else {
        updateSettings(toggle.id, true);
        toggle.checked = true;
      }
    });
  });
}

function handleTabClick(event, id) {
  const tabcontents = Array.from(document.getElementsByClassName("tabcontent"));
  const tabButtons = Array.from(document.querySelectorAll(".tabs button"));
  tabcontents.forEach(tabcontent => {
    tabcontent.style.display = "none";
  });
  tabButtons.forEach(button => {
    button.className = "";
  });
  document.getElementById(id).style.display = "block";
  event.target.className += "active";
}
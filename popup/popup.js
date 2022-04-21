document.addEventListener("DOMContentLoaded", init);

function init() {
  initializeGlobals(() => {
    videoForm.addEventListener("submit", handleSubmit);
    initializeList();
    initializeImportExport();
    initializeToggles();
    initializeTabs();
  });
  startGlobalListeners(rebuildList);
};

function initializeImportExport() {
  downloadButton.addEventListener("click", handleDownloadCSV);
  uploadInput.addEventListener("change", handleUploadCSV);
};

function initializeToggles() {
  const settingsToggles = document.querySelectorAll(".settings-toggle");
  settingsToggles.forEach(toggle => {
    toggle.checked = settings.get(toggle.id)();
    toggle.addEventListener("change", handleToggleClick)
  });
};

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(tabButton => {
    tabButton.addEventListener("click", handleTabClick);
  });
};

function initializeList() {
  const blockedVidsSorted = blockedVids.sort();
  blockedVidsSorted.forEach(blockedVid => {
    blockedVideosList.appendChild(createListItem(blockedVid));
  });
};

function createListItem(blockedVid) {
  const button = document.createElement("button");
  button.innerHTML = "&times;";
  button.addEventListener("click", handleRemovalClick(blockedVid));

  const span = document.createElement("span");
  span.innerText = blockedVid;
  
  const li = document.createElement("li");
  li.className += "blocked-vid-item";
  li.appendChild(button);
  li.appendChild(span);
  return li;
};

function rebuildList() {
  blockedVideosList.innerHTML = "";
  initializeList();
}
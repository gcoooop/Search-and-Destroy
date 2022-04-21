function handleSubmit(event) {
  event.preventDefault();
  addVideosToStorage(event.srcElement[0].value);
};

function handleTabClick(event) {
  const activeButton = document.querySelector(".tab-button.active");
  const activeContent = document.getElementById(activeButton.getAttribute("for"));
  const targetButton = event.target;
  const targetContent = document.getElementById(targetButton.getAttribute("for"));
  removeClassName(activeButton, "active");
  removeClassName(activeContent, "active");
  addClassName(targetButton, "active");
  addClassName(targetContent, "active");
};

function handleRemovalClick(vidForRemoval) {
  return event => {
    removeVideoFromStorage(vidForRemoval);
  };
};

function handleToggleClick(event) {
  const key = event.target.id;
  const bool = event.target.checked;
  updateSettingInStorage(key, bool);
};

function handleDownloadCSV(event) {
  getStorage(result => {
    const blob = new Blob([result.blockedVids], { type: 'text/csv' });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "BlockedVideos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  });
};

function handleUploadCSV(event) {
  const file = event.target.files[0];
  if (file) {
    const fr = new FileReader();
    fr.readAsText(file);

    fr.onload = () => {
      const videoTexts = fr.result.split(",");
      addVideosToStorage(videoTexts);
    }

    fr.onerror = () => {
      alert(fr.error);
    }
  }
};
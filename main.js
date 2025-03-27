const { ipcRenderer } = require("electron");
const { join } = require("path");
const { getAbsoluteFSPath } = require("swagger-ui-dist");

window.addEventListener("DOMContentLoaded", async () => {
  const pickerView = document.getElementById("picker-view");
  const swaggerView = document.getElementById("swagger-view");
  const fileListElem = document.getElementById("file-list");
  const swaggerIframe = document.getElementById("swagger-iframe");
  const backButton = document.getElementById("back-button");

  const swaggerUiIndex = join(getAbsoluteFSPath(), "index.html");
  const swaggerUiUrlBase = "file://" + swaggerUiIndex;

  const refreshButton = document.createElement("button");
  refreshButton.id = "refresh-button";
  refreshButton.textContent = "🔄 Check Again";
  refreshButton.style.marginBottom = "10px";
  refreshButton.style.padding = "5px";
  refreshButton.style.display = "block";

  fileListElem.parentElement.insertBefore(refreshButton, fileListElem);

  const renderFileList = async () => {
    fileListElem.innerHTML = "";
    const files = await ipcRenderer.invoke("get-swagger-files");

    const header = document.createElement("h4");
    header.style.fontWeight = "normal";
    header.style.paddingBottom = "5px";
    header.innerHTML = `<strong>${files.length}</strong> JSON files found in <strong>Downloads</strong>`;
    fileListElem.appendChild(header);

    if (files.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No swagger JSON files found in Downloads.";
      fileListElem.appendChild(li);
      return;
    }

    files.forEach(file => {
      const li = document.createElement("li");
      let displayText = file.name;

      if (file.info && file.info.title && file.info.version) {
        displayText += ` - <strong>${file.info.title} (${file.info.version})</strong> - `;
      }

      displayText += `${new Date(file.birthtime).toLocaleString()}`;
      li.innerHTML = displayText;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        const fileParam = encodeURIComponent(file.path);
        const swaggerUrl = `${swaggerUiUrlBase}?file=${fileParam}`;
        swaggerIframe.src = swaggerUrl;
        pickerView.classList.remove("active");
        swaggerView.classList.add("active");
      });

      fileListElem.appendChild(li);
    });
  };

  renderFileList();

  refreshButton.addEventListener("click", renderFileList);

  backButton.addEventListener("click", () => {
    swaggerIframe.src = "";
    swaggerView.classList.remove("active");
    pickerView.classList.add("active");
  });
});

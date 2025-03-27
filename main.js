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

  const files = await ipcRenderer.invoke("get-swagger-files");

  fileListElem.innerHTML = `<h4 style="font-weight: normal; padding-bottom: 5px;"><strong>${files.length} JSON</strong> files found in <strong>Downloads</strong></h4>`;
  if (files.length === 0) {
    fileListElem.innerHTML = "<li>No swagger JSON files found in Downloads.</li>";
  } else {
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
  }


  backButton.addEventListener("click", () => {
    swaggerIframe.src = "";
    swaggerView.classList.remove("active");
    pickerView.classList.add("active");
  });
});

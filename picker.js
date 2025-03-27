const { ipcRenderer } = require("electron");

window.onload = async () => {
  const files = await ipcRenderer.invoke("get-swagger-files");
  const fileList = document.getElementById("file-list");

  if (files.length === 0) {
    fileList.innerHTML = "<li>No swagger JSON files found in Downloads.</li>";
  } else {
    files.forEach(file => {
      const li = document.createElement("li");
      li.textContent = `${file.name} (Created: ${new Date(file.birthtime).toLocaleString()})`;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        ipcRenderer.send("open-swagger-file", file.path);
      });
      fileList.appendChild(li);
    });
  }
};
